import React, { useState, useCallback, useRef } from 'react';
import { NotificationContext } from './NotificationContext';
import { ToastContainer } from '../components/notifications/Toast';
import { ConfirmModal } from '../components/notifications/ConfirmModal';
import type {
  ConfirmOptions,
  NotificationContextValue,
  ToastItem,
} from '../types/notifications';

interface NotificationProviderProps {
  children: React.ReactNode;
}

interface ConfirmState {
  options: ConfirmOptions;
  resolve: (value: boolean) => void;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
  const toastCounter = useRef(0);

  const showToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    toastCounter.current += 1;
    const id = `toast-${toastCounter.current}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showConfirm = useCallback(
    (options: ConfirmOptions): Promise<boolean> =>
      new Promise((resolve) => {
        setConfirmState({ options, resolve });
      }),
    []
  );

  const handleConfirmResolve = (value: boolean) => {
    if (confirmState) {
      confirmState.resolve(value);
      setConfirmState(null);
    }
  };

  const value: NotificationContextValue = {
    toasts,
    showToast,
    dismissToast,
    showConfirm,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      {confirmState && (
        <ConfirmModal
          options={confirmState.options}
          onConfirm={() => handleConfirmResolve(true)}
          onCancel={() => handleConfirmResolve(false)}
        />
      )}
    </NotificationContext.Provider>
  );
};