interface FeedbackMessageProps {
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  onClose?: () => void;
}

function FeedbackMessage({
  type,
  title,
  message,
  onClose,
}: FeedbackMessageProps) {
  return (
    <div
      className={`feedback-message feedback-message--${type}`}
      role={type === 'error' ? 'alert' : 'status'}
      aria-live="polite"
    >
      <div className="feedback-icon" aria-hidden="true">
        {type === 'success' && '✓'}
        {type === 'error' && '!'}
        {type === 'info' && 'i'}
      </div>

      <div className="feedback-content">
        <strong>{title}</strong>
        <p>{message}</p>
      </div>

      {onClose && (
        <button
          type="button"
          className="feedback-close"
          onClick={onClose}
          aria-label="Dismiss message"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default FeedbackMessage;