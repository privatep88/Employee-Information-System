import React from 'react';

interface FileUploadProps {
  label: string;
  id: string;
  accept?: string;
  icon: string;
  helperText?: string;
  currentFile: File | null;
  required?: boolean;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  id,
  accept = "image/*,.pdf",
  icon,
  helperText = "PDF, JPG, PNG (Max 5MB)",
  currentFile,
  required,
  onFileSelect
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1">
        {required && <span className="text-red-600 text-sm leading-none pt-1">*</span>}
        {label}
      </label>
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
          className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-md transition-all cursor-pointer group-hover:bg-slate-50 ${
            currentFile 
            ? 'border-primary bg-blue-50/50' 
            : 'border-slate-300 bg-white hover:border-slate-400'
          }`}
        >
          <div className="flex items-center gap-3 px-4">
            <div className={`size-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${currentFile ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400 group-hover:text-slate-600'}`}>
                <span className="material-symbols-outlined text-[20px]">
                {currentFile ? 'check' : icon}
                </span>
            </div>
            <div className="flex flex-col text-start">
                 {currentFile ? (
                    <>
                        <span className="text-xs font-bold text-primary truncate max-w-[150px] sm:max-w-[200px]">{currentFile.name}</span>
                        <span className="text-[10px] text-green-600 font-bold">تم إرفاق الملف بنجاح</span>
                    </>
                 ) : (
                    <>
                        <span className="text-xs font-bold text-slate-700 group-hover:text-black">
                            اضغط لرفع المستند
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium font-english">{helperText}</span>
                    </>
                 )}
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default FileUpload;