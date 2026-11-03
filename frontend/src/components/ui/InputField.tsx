import React, { forwardRef, useState } from 'react';

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | null;
  rightElement?: React.ReactNode;
  leftIcon?: React.ReactNode;
  isPassword?: boolean;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  error = '',
  rightElement,
  leftIcon,
  isPassword = false,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || name;
  const [showPassword, setShowPassword] = useState(false);

  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const renderRightElement = rightElement ? (
    rightElement
  ) : isPassword ? (
    <button
      type="button"
      tabIndex={0}
      onClick={() => setShowPassword(!showPassword)}
      className="text-xs font-bold text-accent hover:text-primary px-2.5 py-1 rounded transition-colors cursor-pointer"
      aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
    >
      {showPassword ? 'Ocultar' : 'Mostrar'}
    </button>
  ) : null;

  return (
    <div className={`mb-2 text-left ${className}`}>
      <label htmlFor={inputId} className="form-label-standard">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted z-10">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={effectiveType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`w-full min-h-[44px] py-2.5 rounded-xl border text-sm transition-all duration-150 outline-none text-ink placeholder:text-ink-faint bg-surface ${
            leftIcon ? 'pl-11' : 'pl-3.5'
          } ${renderRightElement ? 'pr-20' : 'pr-3.5'} ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
              : 'border-line-strong focus:border-primary focus:ring-2 focus:ring-primary/20'
          }`}
          {...props}
        />

        {renderRightElement && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center z-10">
            {renderRightElement}
          </div>
        )}
      </div>

      <div className="min-h-[1.25rem] mt-1">
        {error && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-xs text-red-600 font-semibold flex items-center gap-1"
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
});

InputField.displayName = 'InputField';
export default InputField;
