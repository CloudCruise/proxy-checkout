# CloudCruise Proxy Checkout

## CloudCruise Payment Input Component

This is a React component that can be easily integrated into any frontend. Here's an example:

```
const product = {
  productlink: "https://www.elfcosmetics.co.uk/best-brushes-and-tools-of-2024/19453.html",
  productimage: "https://cdn-fsly.yottaa.net/5dbb1b444f1bbf5af87e1113/www.elfcosmetics.co.uk/v~4b.6d/dw/image/v2/BBXC_PRD/on/demandware.static/-/Sites-elf-master/default/dw0206cb92/2024/Bundles/HOLIDAYECOMEXCLUSIVE/19453_1124_HOLIDAY_ECOMMM_PDP_BUNDLES_BESTOFBRUSHES_TOOLS.jpg?sw=700&q=90&yocs=1c_1e_1g_",
  productdescription: "Best Brushes & Tools of 2024",
  price: "40",
  estimatedshippingbusinessdays: "3",
  estimatedshippingcost: "4.50",
  merchant: "elf"
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