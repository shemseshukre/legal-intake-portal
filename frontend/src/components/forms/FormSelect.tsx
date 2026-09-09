interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  id: string;
  label: string;
  value: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  onChange: (value: string) => void;
}

function FormSelect({
  id,
  label,
  value,
  options,
  placeholder,
  required = false,
  error,
  onChange,
}: FormSelectProps) {
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

      <select
        id={id}
        name={id}
        value={value}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`form-select ${error ? 'form-select--error' : ''}`}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">
          {placeholder ?? 'Select an option'}
        </option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p id={`${id}-error`} className="form-error">
          {error}
        </p>
      )}
    </div>
  );
}

export default FormSelect;