import React from 'react';
import { CreditCard } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from './ui/dialog';

interface AppConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const AppConfirmationDialog: React.FC<AppConfirmationDialogProps> = ({
  open,
  onOpenChange,
  onConfirm
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
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
                <li className="flex items-start gap-2">
                  <span className="font-medium">4.</span>
                  <span>Once approved, click the button below to finish the purchase</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onConfirm}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ✅ Approved in App
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppConfirmationDialog; 