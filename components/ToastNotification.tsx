
import React from 'react';
import { ToastMessage, ToastType } from '../types';

interface ToastNotificationProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ toast, onDismiss }) => {
  let bgColor = 'bg-gray-700';
  let borderColor = 'border-gray-600';
  let textColor = 'text-gray-100';

  switch (toast.type) {
    case ToastType.Success:
      bgColor = 'bg-green-600';
      borderColor = 'border-green-700';
      textColor = 'text-white';
      break;
    case ToastType.Error:
      bgColor = 'bg-red-600';
      borderColor = 'border-red-700';
      textColor = 'text-white';
      break;
    case ToastType.Info:
      bgColor = 'bg-blue-600';
      borderColor = 'border-blue-700';
      textColor = 'text-white';
      break;
    case ToastType.Warning:
      bgColor = 'bg-yellow-500';
      borderColor = 'border-yellow-600';
      textColor = 'text-black';
      break;
  }

  return (
    <div
      className={`max-w-sm w-full ${bgColor} ${textColor} shadow-lg rounded-md p-3 my-2 border-l-4 ${borderColor} transition-all duration-300 ease-in-out transform opacity-0 animate-toast-in`}
      role="alert"
      style={{ animationFillMode: 'forwards' }}
      aria-live={toast.type === ToastType.Error || toast.type === ToastType.Warning ? "assertive" : "polite"}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm flex-grow">{toast.message}</p>
        <button
          onClick={() => onDismiss(toast.id)}
          className={`ml-2 -mt-1 -mr-1 p-1 rounded-md hover:bg-black hover:bg-opacity-20 transition-colors ${toast.type === ToastType.Warning ? 'text-black hover:text-gray-700' : 'text-white hover:text-gray-200'}`}
          aria-label="Dismiss notification"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default React.memo(ToastNotification);
