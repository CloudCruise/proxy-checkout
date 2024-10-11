import { CheckCircleIcon, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

export const StatusUpdatePopover = ({
  currentIndex,
  statusUpdates,
}: {
  currentIndex: number;
  statusUpdates: string[];
}) => (
  <div
    className="fixed inset-0 flex items-center justify-center z-50 "
    style={{ zIndex: 9999 }}
  >
    <div className="absolute inset-0 bg-white" />
    <div className="z-10">
      <div className="flex flex-col gap-16 p-5">
        <div className="text-2xl">
          The Checkout Concierge is placing your order
        </div>
        {(!statusUpdates || statusUpdates.length === 0) && (
          <div className="flex items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <div className="text-gray-700">Initializing Checkout</div>
          </div>
        )}
        <div className="max-h-[138px] h-[138px] overflow-hidden flex flex-col gap-5 gradient-text text-lg transition-all">
          <div
            className="flex flex-col gap-5 w-full transition-all"
            style={{ marginTop: `${-(currentIndex * 43 - 43)}px` }}
          >
            {statusUpdates.map((status, index) => (
              <div
                key={index}
                className={cn("flex gap-5 items-center justify-start", {})}
              >
                <CheckCircleIcon
                  className={cn(
                    "w-5 h-5",
                    index <= currentIndex ? "text-green-500" : "text-gray-300"
                  )}
                />
                <div>{status}</div>
              </div>
            ))}
          </div>
        </div>
        {statusUpdates.length > 0 && (
          <div>
            <div className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <div className="text-gray-700">Checkout in progress</div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
