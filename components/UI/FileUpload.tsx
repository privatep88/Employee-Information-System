import React from 'react';

interface FileUploadProps {
  label: string;
  id: string;
  accept?: string;
  icon: string;
  helperText?: string;
  currentFile: File | null;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  id,
  accept = "image/*,.pdf",
  icon,
  helperText = "PDF, JPG, PNG (Max 5MB)",
  currentFile,
  onFileSelect
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-slate-700">{label}</label>
      <div className="relative group">
        <input
          type="file"
          id={id}
          name={id}
          accept={accept}
          className="hidden"
          onChange={onFileSelect}
        />
        <label
          htmlFor={id}
          className={`flex flex-col items-center justify-center w-full h-32 md:h-36 border-2 border-dashed rounded-xl bg-slate-50 hover:bg-white hover:border-primary transition-all cursor-pointer group-hover:shadow-sm ${currentFile ? 'border-primary/50 bg-blue-50/30' : 'border-slate-200'}`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
            <span className={`material-symbols-outlined transition-colors text-2xl md:text-3xl mb-2 ${currentFile ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`}>
              {currentFile ? 'check_circle' : icon}
            </span>
            {currentFile ? (
               <p className="text-sm text-primary font-bold truncate max-w-[200px]">
                 {currentFile.name}
               </p>
            ) : (
              <>
                <p className="text-sm text-slate-600 font-bold">
                  اسحب الملف أو <span className="text-primary underline">تصفح</span> | Upload or{' '}
                  <span className="text-primary underline">Browse</span>
                </p>
                {helperText && (
                  <p className="text-xs text-slate-400 mt-1 font-medium">{helperText}</p>
                )}
              </>
            )}
          </div>
        </label>
      </div>
    </div>
  );
};

export default FileUpload;