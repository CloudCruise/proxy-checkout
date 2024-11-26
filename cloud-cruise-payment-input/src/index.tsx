import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import reportWebVitals from "./reportWebVitals";
import CloudCruisePaymentInput from "./CloudCruisePaymentInput";

interface Product {
  productlink: string;
  productimage: string;
  productdescription: string;
  price: string;
  estimatedshippingbusinessdays: string;
  estimatedshippingcost: string;
  merchant: string;
  scenario?: string;
}

const ProductListing: React.FC = () => {
  const products: Product[] = [
    // ELF
    {
      productlink: "https://www.elfcosmetics.co.uk/power-grip-primer/82846.html",
      productimage: "https://www.elfcosmetics.co.uk/dw/image/v2/BBXC_PRD/on/demandware.static/-/Sites-elf-master/default/dw2f4f2324/2024/ProjectPrimetime/PRIMETIME_PDP_F6.jpg?sw=425&q=90",
      productdescription: "Best Brushes & Tools of 2024",
      price: "10",
      estimatedshippingbusinessdays: "3",
      estimatedshippingcost: "4.50",
      scenario: "ELF checkout",
      merchant: "elf"
    },
    // The OG
    {
      productlink: "https://www.awin1.com/pclick.php?p=36455819997&a=176013&m=2041",
      productimage: "https://boots.scene7.com/is/image/Boots/10336444?op_sharpen=1",
      productdescription: "Graze Smokey Barbeque Crunch Sharing Bag -100G",
      price: "3.15",
      estimatedshippingbusinessdays: "3",
      estimatedshippingcost: "3.95",
      scenario: "The OG",
      merchant: "boots"
    },
    // Out of stock
    {
      productlink: "https://www.awin1.com/pclick.php?p=36893232470&a=176013&m=2041",
      productimage: "https://boots.scene7.com/is/image/Boots/10340364?op_sharpen=1",
      productdescription: "LEGO Classic Creative Houses Building Toys",
      price: "49.99",
      estimatedshippingbusinessdays: "3",
      estimatedshippingcost: "3.95",
      scenario: "Out of stock",
      merchant: "boots"
    },
    // 100 pounds
    {
      productlink: "https://www.awin1.com/pclick.php?p=39120246588&a=176013&m=2041",
      productimage: "https://boots.scene7.com/is/image/Boots/10333351?op_sharpen=1",
      productdescription: "Gucci Guilty Elixir de Parfum for Her 60ml",
      price: "100.80",
      estimatedshippingbusinessdays: "3",
      estimatedshippingcost: "3.95",
      scenario: "100 pounds",
      merchant: "boots"
    },
    // Price lower
    {
      productlink: "https://www.awin1.com/pclick.php?p=35554270752&a=176013&m=2041",
      productimage: "https://boots.scene7.com/is/image/Boots/10320150?op_sharpen=1",
      productdescription: "IT Cosmetics Your Skin But Better CC+ Nude Glow Tan Tan",
      price: "30.00",
      estimatedshippingbusinessdays: "3",
      estimatedshippingcost: "3.95",
      scenario: "Price lower",
      merchant: "boots"
    },
    // Price higher
    {
      productlink: "https://www.awin1.com/pclick.php?p=26878383073&a=176013&m=2041",
      productimage: "https://boots.scene7.com/is/image/Boots/10275560?op_sharpen=1",
      productdescription: "BaBylissMEN Precision Cut Hair Clipper",
      price: "26.50",
      estimatedshippingbusinessdays: "3",
      estimatedshippingcost: "3.95",
      scenario: "Price higher",
      merchant: "boots"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Featured Products
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-w-3 aspect-h-3 w-full">
                <img
                  src={product.productimage}
                  alt={product.productdescription}
                  className="w-full h-[300px] object-cover"
                />
              </div>
              
              <div className="p-6 space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 line-clamp-2">
                  {product.productdescription}
                </h2>
                
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-gray-900">
                      £{product.price}
                    </p>
                    <p className="text-sm text-gray-500">
                      + £{product.estimatedshippingcost} shipping
                    </p>
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    Delivers in {product.estimatedshippingbusinessdays} days
                  </p>
                </div>
                
                <div className="pt-4">
                  <CloudCruisePaymentInput container={product} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    Scenario: {product.scenario}
                  </p> 
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ProductListing />
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
