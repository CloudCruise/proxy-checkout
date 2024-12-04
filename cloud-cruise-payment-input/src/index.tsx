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
  merchantDomain: string;
  scenario?: string;
}

const ProductListing: React.FC = () => {
  const products: Product[] = [
    // ELF
    {
      productlink: "https://www.elfcosmetics.co.uk/power-grip-primer/82846.html",
      productimage: "https://www.elfcosmetics.co.uk/dw/image/v2/BBXC_PRD/on/demandware.static/-/Sites-elf-master/default/dw2f4f2324/2024/ProjectPrimetime/PRIMETIME_PDP_F6.jpg?sw=425&q=90",
      productdescription: "Power Grip Primer",
      price: "10",
      estimatedshippingbusinessdays: "3",
      estimatedshippingcost: "4.50",
      scenario: "ELF checkout 1",
      merchant: "e.l.f. Cosmetics",
      merchantDomain: "elfcosmetics.co.uk"
    },
    // The OG
    {
      productlink: "https://uk.redbrain.shop/redirect/retailer?provider=RAKUTEN&gclid=wl-quiz&utm_source=syndication&url=aHR0cHM6Ly93d3cuZWxmY29zbWV0aWNzLmNvLnVrL3BvcmVsZXNzLXB1dHR5LXByaW1lci84NTkxMi5odG1s",
      productimage: "https://cdn-fsly.yottaa.net/5dbb1b444f1bbf5af87e1113/www.elfcosmetics.co.uk/v~4b.6d/dw/image/v2/BBXC_PRD/on/demandware.static/-/Sites-elf-master/default/dw79f0a7c1/2019/85912_OpenA_R.jpg?sfrm=png&sw=700&q=90&yocs=1c_1e_1g_",
      productdescription: "Poreless Putty Primer",
      price: "10",
      estimatedshippingbusinessdays: "3",
      estimatedshippingcost: "4.50",
      scenario: "ELF checkout 2",
      merchant: "e.l.f. Cosmetics",
      merchantDomain: "elfcosmetics.co.uk"
    },
    // Price changed
    {
      productlink: "https://uk.redbrain.shop/redirect/retailer?provider=RAKUTEN&gclid=wl-quiz&utm_source=syndication&url=aHR0cHM6Ly9jbGljay5saW5rc3luZXJneS5jb20vZGVlcGxpbms%2FaWQ9cGZ4TktTbmdsSU0mbWlkPTQyNDQ4Jm11cmw9aHR0cHMlM0ElMkYlMkZ3d3cuZWxmY29zbWV0aWNzLmNvLnVrJTJGaDIwLXByb29mLWV5ZWxpbmVyLXBlbiUyRjIwMDA3OS5odG1s",
      productimage: "https://cdn-fsly.yottaa.net/5dbb1b444f1bbf5af87e1113/www.elfcosmetics.co.uk/v~4b.6d/dw/image/v2/BBXC_PRD/on/demandware.static/-/Sites-elf-master/default/dw70d9d63a/81109_IntenseH2OProofEyelinerPen_JetBlackA.jpg?sfrm=png&sw=700&q=90&yocs=1c_1e_1g_",
      productdescription: "H2O Proof Eyeliner Pen",
      price: "6",
      estimatedshippingbusinessdays: "3",
      estimatedshippingcost: "4.50",
      scenario: "Price changed",
      merchant: "e.l.f. Cosmetics",
      merchantDomain: "elfcosmetics.co.uk"
    },
    // Out of stock
    {
      productlink: "https://www.elfcosmetics.co.uk/best-brushes-and-tools-of-2024/19453.html",
      productimage: "https://cdn-fsly.yottaa.net/5dbb1b444f1bbf5af87e1113/www.elfcosmetics.co.uk/v~4b.6d/dw/image/v2/BBXC_PRD/on/demandware.static/-/Sites-elf-master/default/dw0206cb92/2024/Bundles/HOLIDAYECOMEXCLUSIVE/19453_1124_HOLIDAY_ECOMMM_PDP_BUNDLES_BESTOFBRUSHES_TOOLS.jpg?sw=700&q=90&yocs=1c_1e_1g_",
      productdescription: "Best Brushes & Tools of 2024",
      price: "40",
      estimatedshippingbusinessdays: "3",
      estimatedshippingcost: "4.50",
      scenario: "Out of stock",
      merchant: "e.l.f. Cosmetics",
      merchantDomain: "elfcosmetics.co.uk"
    },
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
