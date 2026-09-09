import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CircleAlert } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmationDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  const cancelButtonRef =
    useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener(
      'keydown',
      handleKeyDown,
    );

    const previousActiveElement =
      document.activeElement as HTMLElement | null;

    cancelButtonRef.current?.focus();

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown,
      );

      previousActiveElement?.focus();
    };
  }, [isOpen, onCancel]);

  if (!isOpen) {
    return null;
  }

  const dialogContent = (
    <div
      className="dialog-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        boxSizing: 'border-box',
        backgroundColor:
          'rgba(15, 23, 42, 0.45)',
        zIndex: 99999,
      }}
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget
        ) {
          onCancel();
        }
      }}
    >
      <div
        className="confirmation-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-message"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '460px',
          margin: 0,
          padding: '28px',
          boxSizing: 'border-box',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '14px',
          boxShadow:
            '0 20px 50px rgba(15, 23, 42, 0.2)',
        }}
      >
        <div
          className="confirmation-dialog-icon"
          aria-hidden="true"
        >
          <CircleAlert
            size={22}
            strokeWidth={2}
          />
        </div>

        <div className="confirmation-dialog-content">
          <h2 id="confirmation-dialog-title">
            {title}
          </h2>

          <p id="confirmation-dialog-message">
            {message}
          </p>
        </div>

        <div className="confirmation-dialog-actions">
          <button
            ref={cancelButtonRef}
            type="button"
            className="button button-secondary"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            className="button button-primary"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(
    dialogContent,
    document.body,
  );
}

export default ConfirmationDialog;
