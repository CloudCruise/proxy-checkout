from pydantic import BaseModel, ConfigDict
from fastapi import FastAPI, HTTPException, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sse_starlette.sse import EventSourceResponse
from dotenv import load_dotenv
load_dotenv("./.env.development")
import time
import os
import hashlib
import hmac
import json
import requests
import asyncio
from asyncio import Queue

app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.environ.get("ALLOW_ORIGIN")
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add this global dictionary to store active SSE connections
active_connections = {}

class CheckoutData(BaseModel):
    model_config = ConfigDict(
        extra='forbid',
    )
    bootsLink: str
    storedPrice: str
    firstName: str
    lastName: str
    email: str
    phone: str
    shippingHouseNumber: str
    shippingStreetName: str
    shippingPostcode: str
    shippingCity: str
    cardHolder: str
    cardBin: str
    cardNumber: str
    cardExpiryYear: str
    cardExpiryMonth: str
    cardCvv: str

class ResponseSession(BaseModel):
    session_id: str

@app.post("/checkout")
def trigger_checkout(payload: CheckoutData) -> ResponseSession:
    if not payload.cardHolder or payload.cardBin == 0:
        raise HTTPException(status_code=400, detail="Card holder and bin are required")
    cloudcruise_endpoint = os.environ.get("CLOUD_CRUISE_ENDPOINT")
    if cloudcruise_endpoint is None:
        cloudcruise_endpoint = "http://localhost:8000/run"
    response = requests.post(
        cloudcruise_endpoint,
        headers={"cc-key": os.environ["REDBRAIN_CC_API_KEY"]},
        json={
            "workflow_id": "873b7626-a85d-48fe-834f-a9346e4b6b81",
            "run_input_variables": {
                "$BOOTS_LINK": payload.bootsLink,
                "$STORED_PRICE": payload.storedPrice,
                "$FIRST_NAME": payload.firstName,
                "$LAST_NAME": payload.lastName,
                "$EMAIL": payload.email,
                "$PHONE": payload.phone,
                "$SHIPPING_HOUSE_NUMBER": payload.shippingHouseNumber,
                "$SHIPPING_STREET_NAME": payload.shippingStreetName,
                "$SHIPPING_POSTCODE": payload.shippingPostcode,
                "$SHIPPING_CITY": payload.shippingCity,
                "$CARD_HOLDER": payload.cardHolder,
                "$CARD_BIN": payload.cardBin,
                "$CARD_NUMBER": payload.cardNumber,
                "$CARD_EXPIRY_YEAR": payload.cardExpiryYear,
                "$CARD_EXPIRY_MONTH": payload.cardExpiryMonth,
                "$CARD_CVV": payload.cardCvv
            }
        }
    )
    return response.json()

class VerificationError(Exception):
    """Custom exception to handle verification errors."""
    def __init__(self, message="Verification failed", status_code=400):
        super().__init__(message)
        self.status_code = status_code

def verify_hmac(received_data, received_signature, secret_key):
    # Ensure the received data is in bytes, necessary for HMAC
    if isinstance(received_data, str):
        received_data = received_data.encode()

    # Generate the HMAC new object with the secret key and SHA-256
    calculated_signature = hmac.new(secret_key.encode(), received_data, hashlib.sha256).hexdigest()

    # Safely compare the computed HMAC with the received HMAC
    return hmac.compare_digest(calculated_signature, received_signature)

def verify_message(received_data, received_signature, secret_key):
    if not received_data:
        raise VerificationError("Received request without body", 400)
    try:
        data_json = json.loads(received_data.decode('utf-8'))
    except json.JSONDecodeError as e:
        raise VerificationError("Failed to decode json: " + str(e), 400)

    # Check if the expiration is sent
    expires_at = data_json.get("expires_at")
    if not expires_at:
        raise VerificationError("No expiration date sent", 400)

    # Verify HMAC first
    if not verify_hmac(received_data, received_signature, secret_key):
        raise VerificationError("Invalid HMAC signature.", 401)

    # Check if the message is not expired
    if time.time() > expires_at:
        raise VerificationError("Webhook message expired.", 400)

    return data_json

async def process_cc_data(data, session_id):
    print("Processing data for session", session_id, data)
    if session_id in active_connections:
        queue = active_connections[session_id]
        print("QUEUE LENGTH", queue.qsize())
        await queue.put(data)
    else:
        print(f"No active connection for session {session_id}")

@app.post("/webhook")
async def webhook_endpoint(request: Request, background_tasks: BackgroundTasks):
    body = await request.body()
    signature = request.headers.get('X-HMAC-Signature').split('=')[1]
    try:
        if os.environ.get("CLOUD_CRUISE_SECRET_KEY") is None:
            raise VerificationError("Please set your secret key", 400)
        cloud_cruise_data = verify_message(body, signature, os.environ["CLOUD_CRUISE_SECRET_KEY"])
        data = cloud_cruise_data.get("data")
        session_id = data.get("session_id")
        background_tasks.add_task(process_cc_data, cloud_cruise_data, session_id)
        return {"message": "Webhook received successfully."}
    except VerificationError as e:
        raise HTTPException(status_code=e.status_code, detail=str(e))

@app.get("/status/{session_id}")
async def status_endpoint(session_id: str):
    queue = Queue()
    active_connections[session_id] = queue

    async def event_generator():
        try:
            while True:
                data = await queue.get()
                yield dict(data=json.dumps(data))
        except asyncio.CancelledError:
            print(f"Connection closed for session {session_id}")
        finally:
            del active_connections[session_id]

    return EventSourceResponse(event_generator())
