import React, { useRef } from 'react';
import { useFormCardTheme } from './FormCard';

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
  const { inputFocusClass, fileText } = useFormCardTheme(); // Consume theme
  
  // Logic to handle placeholder color for date inputs
  const isDateType = ['date', 'month', 'week', 'time', 'datetime-local'].includes(props.type || '');
  const hasValue = props.value !== '' && props.value !== undefined && props.value !== null;
  const isDatePlaceholder = isDateType && !hasValue;
  const direction = isDateType ? 'ltr' : dir;

  // Extract the text color class (e.g., text-indigo-600) to apply to the icon on hover/active
  const iconHoverClass = `group-hover:${fileText.replace('text-', 'text-')}`; 
  const iconFocusWithinClass = `group-focus-within:${fileText.replace('text-', 'text-')}`; 

  const openPicker = () => {
    if (inputRef.current) {
      try {
        if (typeof (inputRef.current as any).showPicker === 'function') {
          (inputRef.current as any).showPicker();
        } else {
          inputRef.current.focus();
        }
      } catch (err) {
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
    <div className="flex flex-col gap-1.5 group">
      <label className={`text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1 ${labelClassName || ''}`} htmlFor={id}>
        {required && <span className="text-red-600 text-sm leading-none pt-1">*</span>}
        {label}
      </label>
      {icon ? (
        <div className="relative">
          <span 
            className={`absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors material-symbols-outlined text-[20px] z-10 ${iconFocusWithinClass} ${isDateType ? `cursor-pointer ${iconHoverClass}` : 'pointer-events-none'}`}
            onClick={isDateType ? handleIconClick : undefined}
          >
            {icon}
          </span>
          <input
            ref={inputRef}
            id={id}
            dir={direction}
            className={`w-full rounded-md border border-slate-300 bg-white focus:bg-white focus:ring-1 h-10 px-10 placeholder:text-slate-400 placeholder:text-sm transition-colors shadow-sm font-semibold text-center text-sm ${inputFocusClass} ${isDatePlaceholder ? 'text-slate-400' : 'text-black'} focus:text-black ${className || ''}`}
            onClick={handleInputClick}
            {...props}
          />
        </div>
      ) : (
        <input
          ref={inputRef}
          id={id}
          dir={direction}
          className={`w-full rounded-md border border-slate-300 bg-white focus:bg-white focus:ring-1 h-10 px-3 placeholder:text-slate-400 placeholder:text-sm transition-colors shadow-sm font-semibold text-center text-sm ${inputFocusClass} ${isDatePlaceholder ? 'text-slate-400' : 'text-black'} focus:text-black ${className || ''}`}
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
  const isPlaceholder = !value;
  const { inputFocusClass } = useFormCardTheme(); // Consume theme

  return (
    <div className="flex flex-col gap-1.5 group">
      <label className={`text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1 ${labelClassName || ''}`} htmlFor={id}>
         {required && <span className="text-red-600 text-sm leading-none pt-1">*</span>}
         {label}
      </label>
      <div className="relative">
        <select
            id={id}
            value={value}
            className={`w-full rounded-md border border-slate-300 bg-white focus:bg-white focus:ring-1 h-10 px-3 transition-colors shadow-sm cursor-pointer font-semibold text-center text-sm appearance-none ${inputFocusClass} ${
            isPlaceholder ? 'text-slate-400' : 'text-slate-900'
            } ${className || ''}`}
            {...props}
        >
            <option value="" disabled>
            {placeholder || '--- اختر من القائمة ---'}
            </option>
            {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-slate-900 py-2">
                {opt.label}
            </option>
            ))}
        </select>
        <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 material-symbols-outlined text-[20px]">arrow_drop_down</span>
      </div>
    </div>
  );
};