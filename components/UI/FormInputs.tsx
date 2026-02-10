import React, { useRef, useState, useEffect } from 'react';
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

// Helper to convert YYYY-MM-DD (ISO) to DD/MM/YYYY
const formatISOToDisplay = (isoDate: string): string => {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
};

// Helper to convert DD/MM/YYYY to YYYY-MM-DD (ISO)
const formatDisplayToISO = (displayDate: string): string | null => {
  if (displayDate.length !== 10) return null;
  const parts = displayDate.split('/');
  if (parts.length !== 3) return null;
  
  const day = parts[0];
  const month = parts[1];
  const year = parts[2];

  // Basic validation
  const numDay = parseInt(day, 10);
  const numMonth = parseInt(month, 10);
  const numYear = parseInt(year, 10);

  if (isNaN(numDay) || isNaN(numMonth) || isNaN(numYear)) return null;
  if (numDay < 1 || numDay > 31) return null;
  if (numMonth < 1 || numMonth > 12) return null;
  if (numYear < 1900 || numYear > 2100) return null;

  return `${year}-${month}-${day}`;
};

export const TextInput: React.FC<TextInputProps> = ({ label, id, required, icon, className, labelClassName, dir, ...props }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const datePickerRef = useRef<HTMLInputElement>(null);
  const { inputFocusClass, fileText } = useFormCardTheme();
  
  const isDateType = props.type === 'date';
  // Use text type for display input if it's a date to control masking
  const inputType = isDateType ? 'text' : props.type;
  
  // Local state for the masked display value (DD/MM/YYYY)
  const [displayValue, setDisplayValue] = useState('');

  // Sync display value when prop value changes (e.g. from picker or initial load)
  useEffect(() => {
    if (isDateType) {
      setDisplayValue(formatISOToDisplay(props.value as string));
    }
  }, [props.value, isDateType]);

  const hasValue = isDateType ? !!props.value : (props.value !== '' && props.value !== undefined && props.value !== null);
  const isPlaceholder = isDateType ? !hasValue : (props.type === 'date' && !hasValue); // Logic mainly for styling placeholder color
  
  // Directions
  const direction = isDateType ? 'ltr' : dir;
  
  // Styling classes
  const iconHoverClass = `group-hover:${fileText.replace('text-', 'text-')}`; 
  const iconFocusWithinClass = `group-focus-within:${fileText.replace('text-', 'text-')}`; 

  // Open native picker via hidden input
  const openPicker = () => {
    if (datePickerRef.current) {
      try {
        if (typeof (datePickerRef.current as any).showPicker === 'function') {
          (datePickerRef.current as any).showPicker();
        } else {
          datePickerRef.current.focus();
        }
      } catch (err) {
        // Fallback or ignore
      }
    }
  };

  const handleIconClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDateType) {
      openPicker();
    }
  };

  // Masking Logic for DD/MM/YYYY
  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    
    // 1. Remove non-digits
    val = val.replace(/\D/g, '');
    
    // 2. Limit length to 8 digits (DDMMYYYY)
    if (val.length > 8) val = val.slice(0, 8);

    // 3. Add slashes
    let formatted = '';
    if (val.length > 4) {
      formatted = `${val.slice(0, 2)}/${val.slice(2, 4)}/${val.slice(4)}`;
    } else if (val.length > 2) {
      formatted = `${val.slice(0, 2)}/${val.slice(2)}`;
    } else {
      formatted = val;
    }

    setDisplayValue(formatted);

    // 4. If valid full date, send ISO to parent
    if (formatted.length === 10) {
      const iso = formatDisplayToISO(formatted);
      if (iso && props.onChange) {
        // Create synthetic event
        const syntheticEvent = {
          target: {
            name: props.name,
            value: iso,
            type: 'date'
          }
        } as React.ChangeEvent<HTMLInputElement>;
        props.onChange(syntheticEvent);
      }
    } else {
      // If user deletes or has incomplete date, clear parent value? 
      // Or keep last valid? Usually clearing is safer for validation
      if (props.value && props.onChange) {
         const syntheticEvent = {
          target: {
            name: props.name,
            value: '',
            type: 'date'
          }
        } as React.ChangeEvent<HTMLInputElement>;
        props.onChange(syntheticEvent);
      }
    }
  };

  // Handler for the hidden date picker
  const handleNativeDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // This value is YYYY-MM-DD
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 group relative">
      <label className={`text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1 ${labelClassName || ''}`} htmlFor={id}>
        {required && <span className="text-red-600 text-sm leading-none pt-1">*</span>}
        {label}
      </label>
      
      <div className="relative">
        {/* Icon logic */}
        {(icon || isDateType) && (
          <span 
            className={`absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors material-symbols-outlined text-[20px] z-10 ${iconFocusWithinClass} ${isDateType ? `cursor-pointer ${iconHoverClass}` : 'pointer-events-none'}`}
            onClick={isDateType ? handleIconClick : undefined}
          >
            {isDateType ? 'calendar_month' : icon}
          </span>
        )}

        {isDateType ? (
          <>
            {/* Visible Masked Input */}
            <input
              ref={inputRef}
              id={id}
              name={props.name} // Important for autofill isolation
              dir="ltr"
              placeholder="DD/MM/YYYY"
              maxLength={10}
              className={`w-full rounded-md border border-slate-300 bg-white focus:bg-white focus:ring-1 h-10 px-10 placeholder:text-slate-400 placeholder:text-sm transition-colors shadow-sm font-semibold text-center text-sm ${inputFocusClass} ${!displayValue ? 'text-slate-400' : 'text-black'} focus:text-black ${className || ''}`}
              {...props}
              // Override props that shouldn't be passed to text input
              type="text"
              value={displayValue}
              onChange={handleDateInputChange}
            />
            
            {/* Hidden Native Picker */}
            <input
              ref={datePickerRef}
              type="date"
              tabIndex={-1}
              aria-hidden="true"
              className="absolute opacity-0 pointer-events-none w-0 h-0 bottom-0 left-0"
              value={props.value as string}
              onChange={handleNativeDateChange}
              name={props.name} // Needed for change handler
            />
          </>
        ) : (
          /* Standard Text Input */
          <input
            ref={inputRef}
            id={id}
            dir={direction}
            type={inputType}
            className={`w-full rounded-md border border-slate-300 bg-white focus:bg-white focus:ring-1 h-10 ${icon ? 'px-10' : 'px-3'} placeholder:text-slate-400 placeholder:text-sm transition-colors shadow-sm font-semibold text-center text-sm ${inputFocusClass} ${isPlaceholder ? 'text-slate-400' : 'text-black'} focus:text-black ${className || ''}`}
            {...props}
          />
        )}
      </div>
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
  const { inputFocusClass } = useFormCardTheme();

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