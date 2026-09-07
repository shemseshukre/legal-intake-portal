interface FormInputProps {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'date';
  required?: boolean;
  error?: string;
  onChange: (value: string) => void;
}

function FormInput({
  id,
  label,
  value,
  placeholder,
  type = 'text',
  required = false,
  error,
  onChange,
}: FormInputProps) {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">
        {label}

        {required && (
          <span className="required-mark" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <input
        id={id}
        name={id}
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`form-input ${error ? 'form-input--error' : ''}`}
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

export default FormInput;