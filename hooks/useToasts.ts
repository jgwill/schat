
import React, { useState, useCallback } from 'react';
import { ToastMessage, ToastType } from '../types';

const DEFAULT_TOAST_DURATION = 3000; // 3 seconds

interface UseToastsReturn {
  toasts: ToastMessage[];
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const useToasts = (): UseToastsReturn => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType, duration: number = DEFAULT_TOAST_DURATION) => {
    const id = crypto.randomUUID();
    const newToast: ToastMessage = { id, message, type, duration };
    
    setToasts(prevToasts => [newToast, ...prevToasts]); // Add new toasts to the top

    if (duration) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return { toasts, addToast, removeToast };
};

export default useToasts;
