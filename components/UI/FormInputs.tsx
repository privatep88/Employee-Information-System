import React, { useRef } from 'react';

interface InputBaseProps {
  label: React.ReactNode;
  id: string;
  required?: boolean;
  labelClassName?: string;
}

interface TextInputProps extends InputBaseProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'> {
  icon?: string;
}

export const TextInput: React.FC<TextInputProps> = ({ label, id, required, icon, className, labelClassName, dir, ...props }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Logic to handle placeholder color for date inputs which don't support ::placeholder pseudo-element styling for the mask
  const isDateType = ['date', 'month', 'week', 'time', 'datetime-local'].includes(props.type || '');
  const hasValue = props.value !== '' && props.value !== undefined && props.value !== null;
  const isDatePlaceholder = isDateType && !hasValue;

  // Force LTR for date types to ensure Western Arabic Numerals (English numbers)
  const direction = isDateType ? 'ltr' : dir;

  const openPicker = () => {
    if (inputRef.current) {
      try {
        if (typeof (inputRef.current as any).showPicker === 'function') {
          (inputRef.current as any).showPicker();
        } else {
          inputRef.current.focus();
        }
      } catch (err) {
        // Fallback gracefully
        inputRef.current.focus();
      }
    }
  };

  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    if (isDateType) {
      openPicker();
    }
    props.onClick?.(e);
  };

  const handleIconClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDateType) {
      openPicker();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className={`text-sm font-bold text-slate-700 ${labelClassName || ''}`} htmlFor={id}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {icon ? (
        <div className="relative group">
          <span 
            className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors material-symbols-outlined text-lg z-10 ${isDateType ? 'cursor-pointer hover:text-primary' : 'pointer-events-none'}`}
            onClick={isDateType ? handleIconClick : undefined}
          >
            {icon}
          </span>
          <input
            ref={inputRef}
            id={id}
            dir={direction}
            className={`w-full rounded-lg border-slate-200 bg-slate-50 hover:bg-white focus:bg-white focus:border-primary focus:ring-primary/20 h-11 px-12 placeholder:text-slate-400 placeholder:text-sm transition-all shadow-sm font-semibold text-center ${isDatePlaceholder ? 'text-slate-400 text-sm' : 'text-slate-900 text-base'} ${className || ''}`}
            onClick={handleInputClick}
            {...props}
          />
        </div>
      ) : (
        <input
          ref={inputRef}
          id={id}
          dir={direction}
          className={`w-full rounded-lg border-slate-200 bg-slate-50 hover:bg-white focus:bg-white focus:border-primary focus:ring-primary/20 h-11 px-4 placeholder:text-slate-400 placeholder:text-sm transition-all shadow-sm font-semibold text-center ${isDatePlaceholder ? 'text-slate-400 text-sm' : 'text-slate-900 text-base'} ${className || ''}`}
          onClick={handleInputClick}
          {...props}
        />
      )}
    </div>
  );
};

interface SelectInputProps extends InputBaseProps, Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  id,
  required,
  options,
  placeholder,
  value,
  className,
  labelClassName,
  ...props
}) => {
  // Determine if the current value is empty to style it like a placeholder
  const isPlaceholder = !value;

  return (
    <div className="flex flex-col gap-2">
      <label className={`text-sm font-bold text-slate-700 ${labelClassName || ''}`} htmlFor={id}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={id}
        value={value}
        className={`w-full rounded-lg border-slate-200 bg-slate-50 hover:bg-white focus:bg-white focus:border-primary focus:ring-primary/20 h-11 px-4 transition-all shadow-sm cursor-pointer font-semibold text-center ${
          isPlaceholder ? 'text-slate-400 text-sm' : 'text-slate-900 text-base'
        } ${className || ''}`}
        {...props}
      >
        <option value="" disabled>
          {placeholder || 'Select...'}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="text-slate-900">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};