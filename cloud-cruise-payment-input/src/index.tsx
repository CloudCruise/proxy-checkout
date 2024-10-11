import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import reportWebVitals from "./reportWebVitals";
import CloudCruisePaymentInput from "./CloudCruisePaymentInput";
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
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// import React from "react";
// import ReactDOM from "react-dom";
// import reactToWebComponent from "react-to-webcomponent";
// import CloudCruisePaymentInput from "./CloudCruisePaymentInput";
// import "./index.scss";
// const WebWrapper = reactToWebComponent(
//   // @ts-ignore
//   (props) => <CloudCruisePaymentInput {...props} />,
//   React,
//   ReactDOM as any
// );
// customElements.define(
//   "cloud-cruise-payment",
//   class extends WebWrapper {
//     static get observedAttributes() {
//       return [
//         "estimatedshippingbusinessdays",
//         "estimatedshippingcost",
//         "price",
//         "productdescription",
//         "productlink",
//         "productimage",
//       ];
//     }
//     attributeChangedCallback(name: any, oldValue: any, newValue: any) {
//       // @ts-ignore
//       super.attributeChangedCallback(name, oldValue, newValue);
//       // Convert attribute names to camelCase for React props
//       const propName = name
//         .toLowerCase()
//         .replace(/-([a-z])/g, (g: string) => g[1].toUpperCase());
//       // @ts-ignore
//       this[propName] = newValue;
//     }
//   }
// );
