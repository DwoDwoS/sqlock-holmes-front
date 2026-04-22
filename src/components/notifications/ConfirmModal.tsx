import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { ConfirmOptions } from '../../types/notifications';
import './ConfirmModal.scss';

interface ConfirmModalProps {
  options: ConfirmOptions;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ options, onConfirm, onCancel }) => {
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    confirmBtnRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onConfirm();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCancel, onConfirm]);

  return createPortal(
    <div className="confirm-backdrop" onClick={onCancel} role="presentation">
      <div
        className="confirm-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={options.title ? 'confirm-title' : undefined}
      >
        {options.title && (
          <h2 id="confirm-title" className="confirm-title">{options.title}</h2>
        )}
        <p className="confirm-message">{options.message}</p>
        <div className="confirm-actions">
          <button
            type="button"
            className="confirm-btn confirm-btn-cancel"
            onClick={onCancel}
          >
            {options.cancelLabel ?? 'Annuler'}
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            className={`confirm-btn ${options.danger ? 'confirm-btn-danger' : 'confirm-btn-primary'}`}
            onClick={onConfirm}
          >
            {options.confirmLabel ?? 'Confirmer'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};