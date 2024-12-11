import { CheckCircleIcon, Loader2, CreditCard } from "lucide-react";
import { cn } from "../lib/utils";
import { useEffect, useState } from "react";

export const StatusUpdatePopover = ({
  currentIndex,
  statusUpdates,
}: {
  currentIndex: number;
  statusUpdates: string[];
}) => {
  const [showPhoneAlert, setShowPhoneAlert] = useState(false);
  
  useEffect(() => {
    if (statusUpdates.length > 0 && 
        statusUpdates[statusUpdates.length - 1] === "Please confirm the purchase on your phone") {
      setShowPhoneAlert(true);
    }
  }, [statusUpdates]);

  const getScrollPosition = () => {
    if (statusUpdates.length <= 3) return 0;
    return (statusUpdates.length - 3) * 43;
  };

  if (showPhoneAlert) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="w-full max-w-md p-6 space-y-8">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="rounded-full bg-blue-50 p-4">
              <CreditCard className="w-12 h-12 text-blue-500" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Verify Purchase</h2>
              <p className="text-gray-600">
                Please open your banking app to approve this purchase
              </p>
            </div>

            <div className="w-full space-y-4">
              <div className="animate-pulse flex justify-center">
                <div className="h-2 w-24 bg-blue-200 rounded"></div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700">
                <p className="font-medium mb-2">Next steps:</p>
                <ul className="space-y-2 list-none text-left">
                  <li className="flex items-start gap-2">
                    <span className="font-medium">1.</span>
                    <span>Open your banking app</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-medium">2.</span>
                    <span>Look for a new push notification or pending authorization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-medium">3.</span>
                    <span>Review and approve the transaction</span>
                  </li>
                </ul>
              </div>

              <div className="text-sm text-gray-500">
                This window will automatically update once the purchase is approved
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-white" />
      <div className="z-10 w-full">
        <div className="flex flex-col items-center gap-8 p-5">
          <div className="flex flex-col items-center w-full max-w-[50%]">
            <div className="text-2xl text-center">
              The Checkout Concierge is placing your order
            </div>
            <div className="mt-2 p-3 bg-gray-100 rounded-md text-gray-600 text-sm text-center w-full">
              <div>This may take 30 seconds to 5 minutes at most.</div>
              <div className="font-bold underline">
                Please stay on this page to confirm any details like verifying your payment.
              </div>
            </div>
          </div>
          
          {(!statusUpdates || statusUpdates.length === 0) && (
            <div className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <div className="text-gray-700">Initializing Checkout</div>
            </div>
          )}
          <div 
            className="relative h-36 overflow-hidden w-full max-w-[50%]"
            style={{
              maskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent 100%)'
            }}
          >
            <div 
              className="absolute w-full transition-all duration-500 ease-in-out"
              style={{ 
                transform: `translateY(-${getScrollPosition()}px)`
              }}
            >
              {statusUpdates.map((status, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex gap-5 items-center justify-center mb-5 transition-opacity duration-300",
                    {
                      'opacity-40': index < currentIndex - 3,
                      'opacity-100': index >= currentIndex - 3
                    }
                  )}
                >
                  <CheckCircleIcon
                    className={cn(
                      "w-5 h-5",
                      index < currentIndex - 1 ? "text-green-500" : "text-gray-300"
                    )}
                  />
                  <div className="bg-clip-text text-gray-700">
                    {status}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {statusUpdates.length > 0 && (
            <div className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <div className="text-gray-700">Checkout in progress</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusUpdatePopover;