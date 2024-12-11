import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { AlertCircle } from 'lucide-react';

interface PriceChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  oldPrice: string | undefined;
  newPrice: string | undefined;
  onAccept: () => void;
  onDecline: () => void;
}

export const PriceChangeDialog: React.FC<PriceChangeDialogProps> = ({ 
  open, 
  onOpenChange, 
  oldPrice, 
  newPrice, 
  onAccept, 
  onDecline
}) => {
  
  const handleAccept = () => {
    onAccept();
  };

  const priceIncrease = Number(newPrice) - Number(oldPrice);
  const percentageIncrease = ((Number(newPrice) - Number(oldPrice)) / Number(oldPrice) * 100).toFixed(1);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px] z-[9999]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            Price Change Detected
          </AlertDialogTitle>
          
          {/* Move content outside of AlertDialogDescription */}
          <div className="space-y-4">
            <AlertDialogDescription>
              The price has increased by £{priceIncrease.toFixed(2)} ({percentageIncrease}%):
            </AlertDialogDescription>

            <div className="flex justify-between px-4 py-2 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Original Price:</span>
              <span className="line-through text-gray-500">£{oldPrice}</span>
            </div>
            
            <div className="flex justify-between px-4 py-2 bg-yellow-50 rounded-lg font-medium">
              <span className="text-gray-900">New Price:</span>
              <span className="text-gray-900">£{newPrice}</span>
            </div>

            <AlertDialogDescription>
              Would you like to continue with the purchase at the new price?
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onDecline}>Cancel Purchase</AlertDialogCancel>
          <AlertDialogAction onClick={handleAccept}>
            Accept New Price
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PriceChangeDialog;