import React, { useRef, useState, useEffect } from 'react';

interface ProfileUploadProps {
  name: string;
  currentFile: File | null;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

const ProfileUpload: React.FC<ProfileUploadProps> = ({ name, currentFile, onFileSelect, onRemove }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (currentFile) {
      const objectUrl = URL.createObjectURL(currentFile);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [currentFile]);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the file dialog
    onRemove();
    if (inputRef.current) {
      inputRef.current.value = ''; // Reset file input
    }
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        ref={inputRef}
        name={name}
        id={name}
        accept="image/*"
        onChange={onFileSelect}
        className="hidden"
      />
      
      <div className="relative">
        <div 
            onClick={() => inputRef.current?.click()}
            className={`relative w-24 h-28 sm:w-28 sm:h-32 rounded-lg border-2 border-dashed ${preview ? 'border-primary/50' : 'border-slate-300'} bg-slate-50 hover:bg-white hover:border-primary cursor-pointer flex flex-col items-center justify-center transition-all group overflow-hidden`}
            title={preview ? "Change Profile Picture" : "Upload Profile Picture"}
        >
            {preview ? (
            <>
                <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white">edit</span>
                </div>
            </>
            ) : (
            <>
                <span className="material-symbols-outlined text-slate-400 text-3xl mb-2 group-hover:text-primary transition-colors">account_circle</span>
                <span className="text-[10px] text-slate-500 font-bold text-center leading-tight px-1 group-hover:text-primary transition-colors">
                الصورة<br/>الشخصية
                </span>
                <span className="text-[9px] text-slate-400 mt-1 font-medium">(اختياري)</span>
            </>
            )}
        </div>

        {preview && (
            <button
                type="button"
                onClick={handleRemove}
                className="absolute -top-2 -right-2 size-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-transform hover:scale-110 z-10"
                title="Remove Photo"
            >
                <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
        )}
      </div>
    </div>
  );
};

export default ProfileUpload;