// src/CloudCruisePaymentInput.tsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import "./index.scss";
import { Input } from "./components/ui/input";
import { ShoppingCart, ShieldCheckIcon, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "./components/ui/dialog";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { LockClosedIcon } from "@radix-ui/react-icons";
import images, { CardImages } from "react-payment-inputs/images";
import { cn } from "./lib/utils";
import { Card, EvervaultProvider, themes } from "@evervault/react";
import { AddressFinder } from "@ideal-postcodes/address-finder";
import { StatusUpdatePopover } from "./components/updateLoader";
import { PriceChangeDialog } from "./components/priceChangeUserInput";
import { VerificationCodeDialog } from "./components/verificationCodeDialog";

interface CloudCruisePaymentInputProps {
  container?: {
    productlink?: string;
    productimage?: string;
    productdescription?: string;
    price?: string;
    estimatedshippingbusinessdays?: string;
    estimatedshippingcost?: string;
    merchant?: string;
    merchantDomain?: string;
  };
}

  interface FormErrors {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    city?: string;
    postcode?: string;
    nameOnCard?: string;
    billingFirstName?: string;
    billingLastName?: string;
    billingAddress?: string;
    billingCity?: string;
    billingPostcode?: string;
  }

const theme = themes.clean({
  styles: {
    ".field input": {
      fontSize: "0.875rem",
      padding: "4px 12px",
      height: "2.25rem",
    },
    label: {
      display: "none",
    },
    "#number": {
      paddingLeft: "2.5rem",
    },
    ".field:focus-within input": {
      borderColor: "#000",
    },
  },
});

export interface RunResponse {
  session_id: string;
}

export interface ErrorResponse {
  error: string;
}

export async function triggerCheckout(
  bootsLink: string,
  storedPrice: string,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  shippingHouseNumber: string,
  shippingStreetName: string,
  shippingPostcode: string,
  shippingCity: string,
  cardHolder: string,
  cardBin: string,
  cardNumber: string,
  cardExpiryYear: string,
  cardExpiryMonth: string,
  cardCvv: string,
  merchant: string,
  sameAsShipping: boolean,
  billingFirstName: string,
  billingLastName: string,
  billingAddress: string,
  billingPostcode: string,
  billingCity: string
): Promise<RunResponse | ErrorResponse> {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/checkout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bootsLink,
          storedPrice,
          firstName,
          lastName,
          email,
          phone,
          shippingHouseNumber,
          shippingStreetName,
          shippingPostcode,
          shippingCity,
          cardHolder,
          cardBin,
          cardNumber,
          cardExpiryYear,
          cardExpiryMonth,
          cardCvv,
          merchant,
          sameAsShipping,
          billingFirstName: billingFirstName,
          billingLastName: billingLastName,
          billingAddress: billingAddress,
          billingPostcode: billingPostcode,
          billingCity: billingCity
        }),
      }
    );
    if (response.status !== 200) {
      const data = await response.json();
      return {error: data?.detail}
    }
    const data: RunResponse = await response.json();
    return data;
  } catch (error: any) {
    console.error("Failed to trigger checkout");
    return {error: error?.detail}
  }
}

export async function submitUserInput(
  userInput: Record<string, any>,
  sessionId: string
): Promise<RunResponse | ErrorResponse> {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // wait for 2 seconds
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/run/${sessionId}/user_interaction`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput,
        }),
      }
    );
    const data: RunResponse = await response.json();
    return data;
  } catch (error: any) {
    console.error("Failed to fetch worker console data:", error);
    const errorResponse: ErrorResponse = {
      error: error.message || "Unknown error",
    };
    return errorResponse;
  }
}

function formatUKPostcode(postcode: string): string {
    const cleanPostcode = postcode.replace(/\s+/g, '').toUpperCase();

    if (cleanPostcode.length < 5) return cleanPostcode;
    
    const inwardCodeStart = cleanPostcode.length - 3;
    return `${cleanPostcode.slice(0, inwardCodeStart)} ${cleanPostcode.slice(inwardCodeStart)}`;
}

const CloudCruisePaymentInput: React.FC<CloudCruisePaymentInputProps> = (
  props
) => {
  const {
    productlink: productLink,
    productimage: productImage,
    productdescription: productDescription,
    price,
    estimatedshippingbusinessdays: estimatedShipping,
    estimatedshippingcost: estimatedShippingCost,
    merchant: merchant,
    merchantDomain: merchantDomain
  } = props.container ?? {};
  const [givenPrice, setGivenPrice] = useState(price);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string[]>([]);
  const statusRef = useRef(status);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [billingFirstName, setBillingFirstName] = useState("");
  const [billingLastName, setBillingLastName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingPostcode, setBillingPostcode] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [cardInputReady, setCardInputReady] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [sessionId, setSessionId] = useState("");
  const [executionError, setExecutionError] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [deliverBy, setDeliverBy] = useState("");
  const [orderTotal, setOrderTotal] = useState("");
  const [openUserInputDialog, setOpenUserInputDialog] = useState(false);
  const [openVerificationDialog, setOpenVerificationDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addressFinderInitialized = useRef(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const handleUnload = useCallback(() => {
  if (step === 4 && sessionId) {
    const payload = {
      reasoning: 'user interrupted checkout',
      full_url: window.location.href,
      error_code: 'CHECKOUT-E0005'
    };
    
    // Create the blob
    const blob = new Blob([JSON.stringify(payload)], {
      type: 'application/json'
    });
    
    // Send beacon and log result
    const beaconUrl = `${process.env.REACT_APP_BACKEND_URL}/run/${sessionId}/interrupt`;
    const result = navigator.sendBeacon(beaconUrl, blob);
    
    // Debug logging
    console.log({
      event: 'Beacon sent',
      success: result,
      payload,
      url: beaconUrl,
      timestamp: new Date().toISOString()
    });
    
    // Alternative debugging approach using fetch
    if (!result) {
      // If beacon fails, try fetch as fallback and for debugging
      fetch(beaconUrl, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json'
        },
        // Keep-alive to ensure request completes
        keepalive: true
      }).then(response => {
        console.log('Fallback fetch response:', response.status);
      }).catch(error => {
        console.error('Fallback fetch failed:', error);
      });
    }
  }
}, [step, sessionId]);

  const handleBeforeUnload = useCallback(
    (event: BeforeUnloadEvent) => {
      if (step === 4) {
        event.preventDefault();
        event.returnValue = "";
        return "";
      }
    },
    [step]
  );

  // Set up both unload and beforeunload listeners
  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, [handleBeforeUnload, handleUnload]);

  function splitAddressIntoHouseNumber(input: string): [string, string] {
    // Trim the input string to remove any leading/trailing whitespace
    const trimmedInput = input.trim();

    // Check if the string contains a comma
    if (trimmedInput.includes(",")) {
      // Split by the first comma
      const [firstPart, ...restParts] = trimmedInput.split(",");
      return [firstPart.trim(), restParts.join(",").trim()];
    } else {
      // Split by the first space
      const [firstPart, ...restParts] = trimmedInput.split(/\s+(.*)/);
      return [firstPart, restParts.join(" ").trim()];
    }
  }

  const initAddressFinder = useCallback(() => {
    if (addressFinderInitialized.current) return;
    console.log("Initializing AddressFinder");
    const finder = AddressFinder.setup({
      apiKey: process.env.REACT_APP_IDEAL_POSTCODES_API_KEY || "",
      queryOptions: {
        bias_ip: "true",
      },
      outputFields: {
        line_1: "#address",
        post_town: "#city",
        postcode: "#postcode",
      },
      detectCountry: false,
      defaultCountry: "GBR",
      restrictCountries: ["GBR"],
    });

    addressFinderInitialized.current = true;
  }, []);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    if (step === 1 && isOpen === true) {
      // Wait for the DOM to update before initializing AddressFinder
      setTimeout(initAddressFinder, 0);
    }
  }, [step, isOpen, initAddressFinder]);

  useEffect(() => {
    if (!sessionId) {
      console.error("No session ID provided");
      return;
    }

    eventSourceRef.current = new EventSource(
      `${process.env.REACT_APP_BACKEND_URL}/status/${sessionId}`
    );

    eventSourceRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.event === "interaction.waiting") {
        const msg: string = data.data?.message;
        if (msg.startsWith("New price:")) {
          const newPrice = msg.split(":")[1].trim().slice(1);
          if (Number(newPrice) < Number(givenPrice)) {
            // If price has decreased just continue and show user that we found a better price
            console.log("Price has decreased, continuing with purchase");
            setStatus((prevStatus) => [
              ...prevStatus,
              "Found a lower price! New price is £" + newPrice,
            ]);
            submitUserInput({ accept: true }, sessionId);
            setGivenPrice(newPrice);
          } else {
            // Let user confirm that they are okay with the new price
            setOpenUserInputDialog(true);
            setGivenPrice(newPrice);
          }
        } else if (msg.startsWith("Verification code")) {
          console.log("Verification code required");
          setOpenVerificationDialog(true);
        }
      }
      if (data?.data?.current_step) {
        if (statusRef.current.length === 0) {
          if (data?.data?.current_step === 'Start') {
            setStatus((prevStatus) => [...prevStatus, "Starting checkout..."]);
          }
        }
        if (data?.data?.next_step) {
          if (data?.data?.next_step === 'Accept cookies') {
            setStatus((prevStatus) => [...prevStatus, "Confirming product is in stock"]);
          } else if (data?.data?.next_step === 'Has price changed?') {
            setStatus((prevStatus) => [...prevStatus, "Confirming price"]);
          } else if (data?.data?.next_step === 'Add item to basket') {
            setStatus((prevStatus) => [...prevStatus, "Proceeding to purchase"]);
          } else if (data?.data?.next_step === 'Enter address') {
            setStatus((prevStatus) => [...prevStatus, "Securely transmitting shipping address"]);
          } else if (data?.data?.next_step === 'Continue to payment') {
            setStatus((prevStatus) => [...prevStatus, "Securely transmitting billing address"]);
          } else if (data?.data?.next_step === 'Place Order') {
            setStatus((prevStatus) => [...prevStatus, "Securely transmitting encrypted card details"]);
          } else if (data?.data?.next_step === 'Phone verification requires trigger?') {
            setStatus((prevStatus) => [...prevStatus, "Please confirm the purchase on your phone"]);
          }
        }
      }

      if (data.event === "execution.success") {
        setDeliverBy(data.payload?.data?.deliver_by ?? "");
        setOrderNumber(data.payload?.data?.order_number ?? "");
        setOrderTotal(data.payload?.data?.order_price ?? "");
        setIsLoading(false);
        setStep(5);
        setIsOpen(true);
        toast.success("Order made successfully!", {
          description: "Your order has been placed and is being processed.",
        });
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        }
        setStatus([]);
      } else if (data.event === "execution.failed") {
        setIsLoading(false);
        setStep(2);
        setIsOpen(true);
        setErrorCode(data?.data?.errors[0]?.error_code);
        setExecutionError(data?.data?.errors[0]?.message);
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        }
        setStatus([]);
      }
    };

    eventSourceRef.current.onerror = (error) => {
      console.error("EventSource failed:", error);
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [sessionId, setStep, setIsOpen]);

  const [evervaultCardDetails, setEvervaultCardDetails] = useState<{
    card: {
      bin: string | null;
      brand: string | null;
      cvc: string | null;
      expiry: {
        month: string | null;
        year: string | null;
      };
      lastFour: string | null;
      localBrands: string[];
      name: string | null;
      number: string | null;
    };
    errors: {
      [key: string]: string;
    };
    isComplete: boolean;
    isValid: boolean;
  } | null>(null);

  const handleChange = (payload: any) => {
    console.log(payload);
    setEvervaultCardDetails(payload);
  };

  function getCardSvg(images: any | null | undefined, brand?: string | null) {
    // Check if the brand is in the images object
    if (!images) {
      return {
        "aria-label": "card",
        children: null,
        width: "24",
        height: "16",
        viewBox: "0 0 24 16",
      };
    }
    if (brand && images && images[brand as keyof CardImages]) {
      return {
        "aria-label": "card",
        children: images[brand as keyof CardImages],
        width: "24",
        height: "16",
        viewBox: "0 0 24 16",
      };
    }

    return {
      "aria-label": "card",
      children: images["placeholder"],
      width: "24",
      height: "16",
      viewBox: "0 0 24 16",
    };
  }

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Email is invalid";

    if (!phone) errors.phone = "Phone number is required";
    else if (!/^0\d{9,10}$/.test(phone.replace(/\D/g, "")))
      errors.phone = "Phone number is invalid";

    if (!firstName) errors.firstName = "First name is required";
    if (!lastName) errors.lastName = "Last name is required";
    if (!address) errors.address = "Address is required";
    if (!city) errors.city = "City is required";
    if (!postcode) errors.postcode = "Postcode is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const checkAllFilledOut = () => {
    if (
      email &&
      phone &&
      firstName &&
      lastName &&
      address &&
      city &&
      postcode
    ) {
      return true;
    }
    return false;
  };

  const validatePaymentForm = (): boolean => {
    const errors: FormErrors = {};

    if (!nameOnCard) errors.nameOnCard = "Name on card is required";

    if (!evervaultCardDetails?.isValid) {
      errors.nameOnCard = "Please enter valid card details";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const checkPaymentFilledOut = () => {
    if (
      nameOnCard &&
      evervaultCardDetails?.isValid &&
      evervaultCardDetails.isComplete
    ) {
      return true;
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePaymentForm() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        console.log("Sending request to backend...");
        const response = await triggerCheckout(
          productLink ?? "",
          "£" + givenPrice,
          firstName,
          lastName,
          email,
          phone,
          splitAddressIntoHouseNumber(address)[0],
          splitAddressIntoHouseNumber(address)[1],
          formatUKPostcode(postcode),
          city,
          nameOnCard,
          evervaultCardDetails?.card.bin ? evervaultCardDetails.card.bin : "0",
          evervaultCardDetails?.card.number ? evervaultCardDetails.card.number : "0",
          evervaultCardDetails?.card.expiry.year ? "20" + evervaultCardDetails.card.expiry.year : "0",
          evervaultCardDetails?.card.expiry.month ? evervaultCardDetails.card.expiry.month : "0",
          evervaultCardDetails?.card.cvc ? evervaultCardDetails.card.cvc : "0",
          merchant ?? "",
          sameAsShipping,
          billingFirstName,
          billingLastName,
          billingAddress,
          formatUKPostcode(billingPostcode),
          billingCity
        );

        if ("error" in response) {
          toast.error("Failed to place order", {
            description: response.error,
          });
          if (response.error.includes('postcode')) {
            setStep(1);
          }
        } else {
          setIsLoading(true);
          setSessionId(response.session_id);
          console.log("Session ID:", response.session_id);
          setStep(4);
          setIsOpen(false);
        }
      } catch (error: any) {
        toast.error("Failed to place order", {
          description: error.message,
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const renderPaymentButton = () => (
    <button
      className={cn(
        "py-1.5 px-5 rounded-lg flex items-center justify-center gap-2",
        (checkPaymentFilledOut() === false || isSubmitting)
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-black text-white"
      )}
      disabled={!checkPaymentFilledOut() || isSubmitting}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Processing...
        </>
      ) : (
        "Pay & Place Order"
      )}
    </button>
  );

  const renderInput = (
    name: keyof FormErrors,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    placeholder: string,
    type: string = "text"
  ) => (
    <div className="flex flex-col gap-1">
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        id={name}
        className={formErrors[name] ? "border-red-500" : ""}
      />
      {formErrors[name] && (
        <span className="text-red-500 text-xs">{formErrors[name]}</span>
      )}
    </div>
  );

  const handleAcceptPrice = () => {
    setOpenUserInputDialog(false);
    submitUserInput({ accept: true }, sessionId)
      .then((response) => {
        if ("error" in response) {
          toast.error("Failed to update workflow", {
            description: response.error,
          });
        }
      })
      .catch((error) => {
        toast.error("Failed to place order", {
          description: error.message,
        });
      });
  };

  const handleDeclinePrice = () => {
    setOpenUserInputDialog(false);
    setExecutionError("Purchase cancelled due to price change");
    setIsLoading(false);
    setIsOpen(false);
    submitUserInput({ accept: false }, sessionId);
    setStatus([]);
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setExecutionError("");
  };

  const renderBillingAddressSection = () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="sameAsShipping"
          checked={sameAsShipping}
          onChange={(e) => setSameAsShipping(e.target.checked)}
          className="w-4 h-4 accent-black"
        />
        <label htmlFor="sameAsShipping" className="text-sm">
          Billing address same as shipping
        </label>
      </div>
      
      {!sameAsShipping && (
        <div className="flex flex-col gap-3 mt-2">
          <h3 className="text-xl">Billing Address</h3>
          <div className="grid grid-cols-2 gap-3">
            {renderInput(
              "billingFirstName",
              billingFirstName,
              (e) => setBillingFirstName(e.target.value),
              "First Name"
            )}
            {renderInput(
              "billingLastName",
              billingLastName,
              (e) => setBillingLastName(e.target.value),
              "Last Name"
            )}
          </div>
          {renderInput(
            "billingAddress",
            billingAddress,
            (e) => setBillingAddress(e.target.value),
            "Address"
          )}
          {renderInput(
            "billingCity",
            billingCity,
            (e) => setBillingCity(e.target.value),
            "City"
          )}
          {renderInput(
            "billingPostcode",
            billingPostcode,
            (e) => setBillingPostcode(e.target.value),
            "Postcode"
          )}
          <div className="relative">
            <div className="absolute right-0 h-full flex items-center mr-3">
              <LockClosedIcon className="w-4 h-4 text-gray-600" />
            </div>
            <Input
              type="text"
              placeholder="Country"
              value="United Kingdom"
              disabled
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <EvervaultProvider
      teamId={process.env.REACT_APP_EVERVAULT_TEAM_ID ?? ""}
      appId={process.env.REACT_APP_EVERVAULT_APP_ID ?? ""}
    >
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (open) {
            setStep(1);
            setIsOpen(true);
          } else {
            setIsOpen(false);
          }
        }}
      >
        <DialogTrigger asChild>
          <button className="bg-black rounded-lg w-full text-white py-1.5 flex justify-center gap-2">
            <ShoppingCart className="w-4" />
            Buy Now
          </button>
        </DialogTrigger>
        <DialogContent className="w-full h-full md:w-[100vw] md:h-[100vh] flex justify-center overflow-y-auto">
          <div className="flex flex-col gap-8 max-w-[1000px] w-full h-full py-10 px-4 md:px-0">
            {step < 3 && (
              <div className="flex md:flex-row flex-col gap-5 h-full">
                {step === 1 && (
                  <form
                    className="flex flex-col basis-3/5 gap-5 justify-between px-[2px]"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (validateForm()) {
                        setStep(2);
                      }
                    }}
                  >
                    <div className="flex flex-col gap-8">
                      <div className="text-3xl">Checkout Concierge</div>
                      <div className="flex flex-col gap-3">
                        <h3 className="text-xl">Contact information</h3>
                        {renderInput(
                          "email",
                          email,
                          (e) => setEmail(e.target.value),
                          "Email",
                          "email"
                        )}
                        <div className="flex flex-col gap-1">
                          {renderInput(
                            "phone",
                            phone,
                            (e) => setPhone(e.target.value),
                            "Phone",
                            "tel"
                          )}
                          <div className="text-xs text-gray-500">
                            We may need to contact you about your delivery.
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-end gap-3">
                        <h3 className="text-xl">Shipping information</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {renderInput(
                            "firstName",
                            firstName,
                            (e) => setFirstName(e.target.value),
                            "First Name"
                          )}
                          {renderInput(
                            "lastName",
                            lastName,
                            (e) => setLastName(e.target.value),
                            "Last Name"
                          )}
                        </div>
                        {renderInput(
                          "address",
                          address,
                          (e) => setAddress(e.target.value),
                          "Address"
                        )}
                        {renderInput(
                          "city",
                          city,
                          (e) => setCity(e.target.value),
                          "City"
                        )}
                        {renderInput(
                          "postcode",
                          postcode,
                          (e) => setPostcode(e.target.value),
                          "Postcode"
                        )}
                        <div className="relative">
                          <div className="absolute right-0 h-full flex items-center mr-3">
                            <LockClosedIcon className="w-4 h-4 text-gray-600" />
                          </div>
                          <Input
                            type={"text"}
                            placeholder="Country"
                            value={"United Kingdom"}
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        className={cn(
                          "py-1.5 px-5 rounded-lg flex items-center justify-center",
                          checkAllFilledOut() === false
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-black text-white"
                        )}
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </form>
                )}
                {step === 2 && (
                  <form
                    className="flex flex-col basis-3/5 gap-5 justify-between"
                    onSubmit={handleSubmit}
                  >
                    <div className="flex flex-col max-h-full overflow-y-scroll gap-8 px-[2px]">
                      <div className="text-3xl">Checkout Concierge</div>
                      <div className="flex flex-col justify-end gap-3">
                        <h3 className="text-xl">Payment Information</h3>
                        {cardInputReady && (
                          <div className="flex flex-col gap-1">
                            <Input
                              type={"text"}
                              placeholder="Name on card"
                              onChange={(e) => setNameOnCard(e.target.value)}
                              value={nameOnCard}
                              className={
                                formErrors.nameOnCard ? "border-red-500" : ""
                              }
                            />
                            {formErrors.nameOnCard && (
                              <span className="text-red-500 text-xs">
                                {formErrors.nameOnCard}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="relative">
                          <div className="absolute left-0 h-[20px] flex items-center ml-2 mt-2">
                            {cardInputReady && (
                              <svg
                                {...getCardSvg(
                                  images,
                                  evervaultCardDetails?.card.brand
                                )}
                              />
                            )}
                          </div>
                          <Card
                            theme={theme}
                            onChange={handleChange}
                            onReady={() => setCardInputReady(true)}
                          />
                        </div>
                        {cardInputReady && (
                          <>
                            <div className="flex justify-end">
                              {/* Mastercard and visa logog */}
                              <div className="flex gap-2">
                                <svg
                                  {...getCardSvg(images, "mastercard")}
                                  width={"24px"}
                                  height={"16px"}
                                />
                                <svg
                                  {...getCardSvg(images, "visa")}
                                  width={"24px"}
                                  height={"16px"}
                                />
                              </div>
                            </div>

                            <a
                              className="flex justify-end items-center hover:underline"
                              href="https://evervault.com/"
                              target="_blank"
                              rel="noreferrer"
                            >
                              <span className="text-green-500">
                                <ShieldCheckIcon className="w-4 h-4 mr-1" />
                              </span>
                              <div className="text-sm text-gray-500 flex items-center">
                                <span>Secure payment powered by</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 201 219"
                                  width="15"
                                  height="15"
                                  className="mx-1.5"
                                >
                                  <path
                                    fill="currentColor"
                                    fill-rule="evenodd"
                                    d="M7.84 28.668a15.058 15.058 0 00-7.79 11.94c-.028-.381-.045-.765-.05-1.15v48.546c.007-.316.024-.63.05-.943a19.172 19.172 0 0013.153 16.797l9.028 2.956-14.39 7.854a15.06 15.06 0 00-7.79 11.939A19.289 19.289 0 010 125.458v48.546c.007-.316.024-.631.05-.943a19.172 19.172 0 0013.153 16.797L85.79 213.63a96.843 96.843 0 0076.534-7.028l30.835-16.831a15.057 15.057 0 007.79-11.939c.029.381.046.764.051 1.149v-48.546c-.007.316-.024.631-.051.944a19.17 19.17 0 00-13.152-16.797l-9.027-2.957 14.389-7.854a15.057 15.057 0 007.79-11.939c.029.38.046.764.051 1.15V44.434c-.007.316-.024.631-.051.944a19.171 19.171 0 00-13.152-16.797L115.21 4.81a96.838 96.838 0 00-76.534 7.028L7.841 28.667zm22.218 80.709l-19.343 10.558A9.059 9.059 0 006 127.626V129c.109 7.309 5.097 13.745 12.415 16.02l4.079 1.268 30.946-16.891a56.326 56.326 0 0118.622-6.263l-42.004-13.757zm89.494 22.995a96.838 96.838 0 0042.772-11.77l9.216-5.031 14.389 4.713A13.17 13.17 0 01195 132.575v.868c-.113 4.809-2.924 9.195-7.373 11.5l-11.498 5.958-56.577-18.529zM86.668 80.24L30.472 62.769l25.843-14.106a50.355 50.355 0 0139.797-3.654l72.552 23.76-10.031 5.198c-22.049 11.425-48.092 13.695-71.965 6.273zM97.98 39.307L176.129 64.9l11.498-5.958c4.449-2.305 7.26-6.69 7.373-11.5v-.868a13.17 13.17 0 00-9.071-12.291l-72.586-23.772a90.838 90.838 0 00-71.792 6.592l-30.836 16.83A9.058 9.058 0 006 41.627V43c.109 7.309 5.097 13.745 12.415 16.02l4.079 1.268L53.44 43.397a56.354 56.354 0 0144.54-4.09zM86.668 166.24l-56.196-17.471 25.843-14.106a50.352 50.352 0 0139.797-3.654l72.552 23.76-10.031 5.198c-22.049 11.425-48.092 13.695-71.965 6.273z"
                                    clip-rule="evenodd"
                                  ></path>
                                </svg>
                                <span>Evervault</span>
                              </div>
                            </a>
                          </>
                        )}
                        {renderBillingAddressSection()}
                      </div>
                    </div>
                    {executionError &&
                      (errorCode === "CHECKOUT-E0001" ? (
                        <p className="text-red-700">
                          The product is out of stock. Please try again later.
                        </p>
                      ) : (
                        <p className="text-red-700">
                          Oops! There was an error checking out. Please{" "}
                          <a
                            href={productLink}
                            className="text-red-700 underline hover:text-red-800"
                          >
                            click here
                          </a>{" "}
                          to checkout directly through the supplier website.
                        </p>
                      ))}
                    <div className="flex justify-end">
                      {renderPaymentButton()}
                    </div>
                  </form>
                )}
                <div className="md:border-l border-gray-200"></div>
                <div className="basis-2/5">
                  <div className="flex flex-col gap-5 mx-1 bg-gray-100 rounded-md p-6">
                    <div className="text-lg">Order Summary</div>
                    <div className="flex gap-2 justify-between w-full items-center">
                      <div className="flex gap-2 items-center">
                        <img
                          src={productImage}
                          className="w-16 h-16 rounded-lg"
                          alt="product"
                        />
                        <div className="font-semibold text-sm">
                          {productDescription}
                        </div>
                      </div>
                      <div className="font-semibold text-sm">£{givenPrice}</div>
                    </div>
                    <div className="border-b border-gray-200" />
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-800">Subtotal</div>
                        <div className="text-sm text-gray-800">
                          £{givenPrice}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <div className="text-sm text-gray-800">Shipping</div>
                          <div className="text-xs text-gray-600">
                            Standard delivery est. {estimatedShipping} business
                            days
                          </div>
                        </div>
                        <div className="text-sm text-gray-800">
                          £{estimatedShippingCost}
                        </div>
                      </div>
                    </div>
                    <div className="border-b border-gray-200" />
                    <div className="flex justify-between gap-5 items-center text-sm">
                      <div className="flex flex-col">
                        <div className="font-semibold">Total</div>
                        <div className="text-gray-600">Including taxes</div>
                      </div>
                      <div className="text-2xl font-semibold">
                        £
                        {(
                          Number(givenPrice) + Number(estimatedShippingCost)
                        ).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {step === 5 && (
              <div className="flex flex-col gap-5 p-5 bg-gray-100 rounded-md">
                <div className="flex flex-col gap-2">
                  <div className="text-3xl">Thanks for the order!</div>
                  <div className="font-semibold text-gray-800">
                    Your order has been placed with {" "} <span className="font-bold">{merchant}</span>. You&apos;ll receive an order confirmation email from {merchantDomain} shortly.
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="text-xl">Order Confirmation</div>
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-800">Order Number</div>
                      <div className="text-sm text-gray-800">{orderNumber}</div>
                    </div>
                    {deliverBy !== "" && (
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-800">
                          Expected Delivery
                        </div>
                        <div className="text-sm text-gray-800">{deliverBy}</div>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-800">Order Total</div>
                      <div className="text-sm text-gray-800">{orderTotal}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-800">
                        Shipping Address
                      </div>
                      <div className="text-sm text-gray-800">
                        {[firstName + " " + lastName, address, city, postcode]
                          .filter((item) => item && item.trim() !== "")
                          .join(", ")}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-800">
                        Payment Method
                      </div>
                      <div className="flex flex-col gap-1 text-sm text-gray-800">
                        <div className="flex items-center">
                          <svg
                            {...getCardSvg(
                              images,
                              evervaultCardDetails?.card.brand
                            )}
                            className="pt-1"
                          />
                          <div>
                            **** **** **** {evervaultCardDetails?.card.lastFour}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Product details */}
                  <div className="text-xl">Product</div>
                  <div className="flex gap-2 items-center bg-white p-3 rounded-lg">
                    <div className="flex gap-2 items-center">
                      <img
                        src={productImage}
                        className="w-16 h-16 rounded-lg"
                        alt="product"
                      />
                      <div className="font-semibold text-sm">
                        {productDescription}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    className="bg-black text-white py-1.5 px-5 rounded-lg flex items-center justify-center"
                    onClick={() => {
                      setStep(0);
                      setIsOpen(false);
                    }}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {isLoading && (
        <StatusUpdatePopover
          currentIndex={status.length}
          statusUpdates={status}
        />
      )}
      <PriceChangeDialog
        open={openUserInputDialog}
        onOpenChange={setOpenUserInputDialog}
        oldPrice={price}
        newPrice={givenPrice}
        onAccept={handleAcceptPrice}
        onDecline={handleDeclinePrice}
      />
      <VerificationCodeDialog
        open={openVerificationDialog}
        onOpenChange={setOpenVerificationDialog}
        onSubmit={(code) => {
          setOpenVerificationDialog(false);
          submitUserInput({ verification_code: code }, sessionId);
        }}
        onCancel={() => {
          setOpenVerificationDialog(false);
          setExecutionError("Purchase cancelled due to verification");
          setIsLoading(false);
          setIsOpen(false);
          if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
          }
          setStatus([]);
          setExecutionError("");
        }}
      />
      <Toaster />
    </EvervaultProvider>
  );
};

export default CloudCruisePaymentInput;
