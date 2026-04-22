import { useMemo } from 'react';
import { useNotifications } from './useNotifications';

export const useToast = () => {
  const { showToast } = useNotifications();
  return useMemo(
    () => ({
      success: (message: string, duration?: number) =>
        showToast({ type: 'success', message, duration }),
      error: (message: string, duration?: number) =>
        showToast({ type: 'error', message, duration }),
      info: (message: string, duration?: number) =>
        showToast({ type: 'info', message, duration }),
      warning: (message: string, duration?: number) =>
        showToast({ type: 'warning', message, duration }),
    }),
    [showToast]
  );
};