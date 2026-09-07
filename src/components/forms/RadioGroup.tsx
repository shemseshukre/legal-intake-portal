interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;
  label: string;
  value: string;
  options: RadioOption[];
  required?: boolean;
  error?: string;
  onChange: (value: string) => void;
}

function RadioGroup({
  name,
  label,
  value,
  options,
  required = false,
  error,
  onChange,
}: RadioGroupProps) {
  return (
    <fieldset className="form-field radio-field">
      <legend className="form-label">
        {label}

        {required && (
          <span className="required-mark" aria-hidden="true">
            *
          </span>
        )}
      </legend>

      <div className="radio-group">
        {options.map((option) => (
          <label key={option.value} className="radio-option">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />

            <span>{option.label}</span>
          </label>
        ))}
      </div>

      {error && (
        <p className="form-error">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export default RadioGroup;