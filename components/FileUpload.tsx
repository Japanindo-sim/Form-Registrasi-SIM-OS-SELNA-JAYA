import React, { useRef } from 'react';

interface FileUploadProps {
  label: string;
  fileName?: string;
  error?: string;
  note?: string;
  accept?: string;
  onChange: (file: File | null) => void;
  required?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  label, 
  fileName, 
  error, 
  note, 
  accept, 
  onChange,
  required
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  const handleDivClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-5">
      <label className="block text-sm font-bold text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {note && <p className="text-xs text-gray-500 mb-2">{note}</p>}

      <div 
        onClick={handleDivClick}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors duration-200 group
          ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-brand-500 hover:bg-brand-50 bg-gray-50'}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
        />
        
        <div className="flex flex-col items-center justify-center space-y-2">
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${error ? 'text-red-400' : 'text-gray-400 group-hover:text-brand-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          
          {fileName ? (
            <span className="text-sm font-semibold text-brand-600 truncate max-w-xs block">
              {fileName}
            </span>
          ) : (
            <span className="text-sm text-gray-500 group-hover:text-gray-700">
              Klik untuk upload foto
            </span>
          )}
        </div>
      </div>
      {error && <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>}
    </div>
  );
};