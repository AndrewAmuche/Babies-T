import React from 'react';
import { Check, X } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  isVisible,
  onClose,
  actionLabel,
  onAction,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#171717] text-white rounded-2xl shadow-xl border border-white/10 animate-in slide-in-from-bottom-3 duration-200">
      <div className="w-5 h-5 rounded-full bg-[#2E5A36] text-white flex items-center justify-center shrink-0">
        <Check className="w-3 h-3 stroke-[3]" />
      </div>
      <span className="text-xs font-medium">{message}</span>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="text-xs font-semibold text-[#E6ECE3] hover:underline ml-2 underline-offset-2"
        >
          {actionLabel}
        </button>
      )}

      <button
        onClick={onClose}
        className="text-white/60 hover:text-white ml-1 p-0.5"
        aria-label="Dismiss toast"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
