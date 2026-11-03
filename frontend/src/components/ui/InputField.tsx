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
      className="text-xs font-bold text-accent hover:text-[#004C73] px-2.5 py-1 rounded transition-colors cursor-pointer"
      aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
    >
      {showPassword ? 'Ocultar' : 'Mostrar'}
    </button>
  ) : null;

  return (
    <div className={`mb-3 text-left ${className}`}>
      <label htmlFor={inputId} className="form-label-standard">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
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
          className={`form-input-standard ${leftIcon ? 'pl-10' : ''} ${
            renderRightElement ? 'pr-20' : ''
          } ${error ? 'form-input-error' : ''}`}
          {...props}
        />

        {renderRightElement && (
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center">
            {renderRightElement}
          </div>
        )}
      </div>

      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="mt-1 text-xs text-red-600 font-semibold flex items-center gap-1"
        >
          {error}
        </p>
      )}
    </div>
  );
});

InputField.displayName = 'InputField';
export default InputField;
