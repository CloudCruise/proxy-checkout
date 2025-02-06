import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { SmartphoneIcon } from 'lucide-react';

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
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SmartphoneIcon className="w-5 h-5 text-blue-500" />
            App Confirmation Required
          </DialogTitle>
          <DialogDescription>
            Please confirm the purchase in your banking app. Once you've approved it, click the button below.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <button
            onClick={onConfirm}
            className="w-full px-4 py-2 text-sm text-white bg-black rounded-lg hover:bg-gray-800"
          >
            Confirmed in app
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppConfirmationDialog; 