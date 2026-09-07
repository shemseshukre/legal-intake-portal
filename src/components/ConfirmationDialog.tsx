import { useEffect, useRef } from 'react';

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
  const dialogRef =
    useRef<HTMLDivElement>(null);

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

  return (
    <div
      className="dialog-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCancel();
        }
      }}
    >
      <div
        ref={dialogRef}
        className="confirmation-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-message"
        tabIndex={-1}
      >
        <div
          className="confirmation-dialog-icon"
          aria-hidden="true"
        >
          ?
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
}

export default ConfirmationDialog;