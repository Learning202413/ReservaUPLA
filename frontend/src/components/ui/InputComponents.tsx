import React from 'react';

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  helperText,
  id,
  className = '',
  required,
  ...props
}) => {
  const inputId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={inputId}
        required={required}
        className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-200 text-red-900 bg-red-50/20'
            : 'border-slate-300 focus:border-[#006699] focus:ring-[#006699]/20 text-slate-800'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholderOption?: string;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  error,
  options,
  placeholderOption = '-- Seleccione una opción --',
  id,
  className = '',
  required,
  ...props
}) => {
  const selectId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        id={selectId}
        required={required}
        className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-200 text-red-900'
            : 'border-slate-300 focus:border-[#006699] focus:ring-[#006699]/20 text-slate-800'
        } ${className}`}
        {...props}
      >
        {placeholderOption && (
          <option value="" disabled>
            {placeholderOption}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};

export interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const DateInput: React.FC<DateInputProps> = ({
  label,
  error,
  id,
  className = '',
  required,
  ...props
}) => {
  const inputId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type="date"
        id={inputId}
        required={required}
        className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-200 text-red-900'
            : 'border-slate-300 focus:border-[#006699] focus:ring-[#006699]/20 text-slate-800'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};

export interface TimeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const TimeInput: React.FC<TimeInputProps> = ({
  label,
  error,
  id,
  className = '',
  required,
  ...props
}) => {
  const inputId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type="time"
        id={inputId}
        required={required}
        className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-200 text-red-900'
            : 'border-slate-300 focus:border-[#006699] focus:ring-[#006699]/20 text-slate-800'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};
