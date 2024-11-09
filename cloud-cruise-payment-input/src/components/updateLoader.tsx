import { CheckCircleIcon, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

export const StatusUpdatePopover = ({
  currentIndex,
  statusUpdates,
}: {
  currentIndex: number;
  statusUpdates: string[];
}) => {
  console.log('statusUpdates', statusUpdates);
  // Calculate the scroll position to keep last three items visible
  const getScrollPosition = () => {
    if (statusUpdates.length <= 3) return 0;
    // Each item is 43px high (20px gap + ~23px content)
    return (statusUpdates.length - 3) * 43;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-white" />
      <div className="z-10">
        <div className="flex flex-col gap-8 p-5">
          <div className="text-2xl">
            The Checkout Concierge is placing your order
          </div>
          
          {(!statusUpdates || statusUpdates.length === 0) && (
            <div className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <div className="text-gray-700">Initializing Checkout</div>
            </div>
          )}

          {/* Fixed height container with overflow and gradient mask */}
          <div 
            className="relative h-36 overflow-hidden"
            style={{
              maskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent 100%)'
            }}
          >
            {/* Scrolling container */}
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
                    "flex gap-5 items-center justify-start mb-5 transition-opacity duration-300",
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