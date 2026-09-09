interface FormActionsProps {
  onSaveDraft: () => void;
  isSubmitting?: boolean;
}

function FormActions({
  onSaveDraft,
  isSubmitting = false,
}: FormActionsProps) {
  return (
    <div className="form-actions">
      <button
        type="button"
        className="button button-secondary"
        onClick={onSaveDraft}
        disabled={isSubmitting}
      >
        Save Draft
      </button>

      <button
        type="submit"
        className="button button-primary"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        {isSubmitting && (
          <span
            className="button-spinner"
            aria-hidden="true"
          />
        )}

        <span>
          {isSubmitting
            ? 'Submitting...'
            : 'Submit Request'}
        </span>
      </button>
    </div>
  );
}

export default FormActions;