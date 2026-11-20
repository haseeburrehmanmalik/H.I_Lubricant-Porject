import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const Toast = () => {
  const { notification } = useCart();

  if (!notification) return null;

  const isError = notification.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-bounce-short">
      <div
        className={`p-4 rounded-xl shadow-card border flex items-center space-x-3 backdrop-blur-md ${
          isError
            ? 'bg-[#1b1111]/95 border-red-500/50 text-[#F5F2EA]'
            : 'bg-[#141414]/95 border-[#D7AD55]/60 text-[#F5F2EA]'
        }`}
      >
        {isError ? (
          <AlertCircle className="text-red-400 shrink-0" size={20} />
        ) : (
          <CheckCircle2 className="text-[#D7AD55] shrink-0" size={20} />
        )}
        <div className="flex-1 text-sm font-medium">
          {notification.message}
        </div>
      </div>
    </div>
  );
};

export default Toast;
