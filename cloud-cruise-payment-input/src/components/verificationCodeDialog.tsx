import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Input } from './ui/input';
import { ShieldCheck } from 'lucide-react';

interface VerificationCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (code: string) => void;
  onCancel: () => void;
  message?: string;
}

export const VerificationCodeDialog: React.FC<VerificationCodeDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  onCancel
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }
    if (!/^\d+$/.test(verificationCode.trim())) {
      setError('Please enter only numbers');
      return;
    }
    onSubmit(verificationCode.trim());
    setVerificationCode('');
    setError('');
  };

  const handleCancel = () => {
    onCancel();
    setVerificationCode('');
    setError('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-500" />
            Verification Required
          </DialogTitle>
          <DialogDescription>
            Please enter the verification code sent to your phone or email to complete your purchase.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <Input
            type="text"
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={(e) => {
              setVerificationCode(e.target.value);
              setError('');
            }}
            className={error ? 'border-red-500' : ''}
            maxLength={8}
          />
          {error && (
            <span className="text-red-500 text-sm">{error}</span>
          )}
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <button
            onClick={handleCancel}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="w-full px-4 py-2 text-sm text-white bg-black rounded-lg hover:bg-gray-800"
          >
            Submit Code
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationCodeDialog;