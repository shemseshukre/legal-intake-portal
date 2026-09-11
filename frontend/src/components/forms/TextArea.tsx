interface TextAreaProps {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  required?: boolean;
  error?: string;
  onChange: (value: string) => void;
}

function TextArea({
  id,
  label,
  value,
  placeholder,
  maxLength,
  minLength,
  required = false,
  error,
  onChange,
}: TextAreaProps) {
  return (
    <div className="form-field">
      <div className="textarea-label-row">
        <label htmlFor={id} className="form-label">
          {label}

          {required && (
            <span className="required-mark" aria-hidden="true">
              *
            </span>
          )}
        </label>

        {maxLength && (
          <span className="character-counter">
            {value.length}/{maxLength}
          </span>
        )}
      </div>

      <textarea
        id={id}
        name={id}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        minLength={minLength}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`form-textarea ${
          error ? 'form-textarea--error' : ''
        }`}
        onChange={(event) => onChange(event.target.value)}
      />

      {error && (
        <p id={`${id}-error`} className="form-error">
          {error}
        </p>
      )}
    </div>
  );
}

export default TextArea;

