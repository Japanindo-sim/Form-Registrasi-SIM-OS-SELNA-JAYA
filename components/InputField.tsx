import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  note?: string;
  isTextArea?: boolean;
  rows?: number;
}

export const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  error, 
  note, 
  isTextArea = false, 
  className = '', 
  rows,
  ...props 
}) => {
  const baseClasses = `w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all duration-200 outline-none ${
    error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'
  } ${className}`;

  return (
    <div className="mb-5">
      <label className="block text-sm font-bold text-gray-700 mb-1">
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {note && <p className="text-xs text-gray-500 mb-2">{note}</p>}
      
      {isTextArea ? (
        <textarea 
          className={baseClasses} 
          rows={rows}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} 
        />
      ) : (
        <input 
          className={baseClasses} 
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)} 
        />
      )}
      
      {error && <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>}
    </div>
  );
};