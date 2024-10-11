# CloudCruise Proxy Checkout

## CloudCruise Payment Input Component

This is a React component that can be easily integrated into any frontend. Here's an example:

```
const product = {
  productlink: "https://www.awin1.com/pclick.php?p=36455819997&a=176013&m=2041",
  productimage: "https://boots.scene7.com/is/image/Boots/10336444?op_sharpen=1",
  productdescription:
    "Graze Smokey Barbeque Crunch Sharing Bag -100G",
  price: "3.15",
  estimatedshippingbusinessdays: "3",
  estimatedshippingcost: "3.75",
};
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <CloudCruisePaymentInput container={product} />
  </React.StrictMode>
);
```

To start development simply run `npm install` and `npm run dev`.

## Relay server

The relay server is forwarding the frontend's checkout request to the CloudCruise API. It also receives webhook events and feeds them to the frontend using server-side events.

To get started
- Run `pip install -r requirements`
- Set the environment variables in the .env file
- Start the development server `uvicorn main:app --reload --port 8001`