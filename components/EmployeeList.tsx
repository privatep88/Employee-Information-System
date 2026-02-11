import React, { useEffect, useState, useMemo } from 'react';
import { EmployeeFormData } from '../types';
import FormCard from './UI/FormCard';
import { NATIONALITIES, MARITAL_STATUSES, DEGREES, LICENSE_TYPES, RELATIONSHIPS } from '../constants';

interface EmployeeListProps {
  employees: EmployeeFormData[];
  onEdit: (emp: EmployeeFormData) => void;
  onDelete: (emp: EmployeeFormData) => void;
}

const getLabel = (value: string, options: { value: string; label: string }[]) => {
  const option = options.find(opt => opt.value === value);
  return option ? option.label.split('|')[0].trim() : value;
};

const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '-';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
};

const downloadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

const InfoField: React.FC<{ label: string; value: string | React.ReactNode; dir?: 'rtl' | 'ltr' }> = ({ label, value, dir }) => (
  <div className="flex flex-col gap-1 border-b border-slate-100 pb-2 last:border-0 text-right">
    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</span>
    <div className={`text-sm font-bold text-slate-800 break-words text-right ${dir === 'ltr' ? 'font-english' : ''}`} dir={dir}>
      {value || '-'}
    </div>
  </div>
);

const FileDisplay: React.FC<{ label: string; file: File | null; onView: (file: File) => void }> = ({ label, file, onView }) => {
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (file && file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            setPreview(url);
            return () => URL.revokeObjectURL(url);
        }
        setPreview(null);
    }, [file]);

    const handleDownloadClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (file) downloadFile(file);
    };

    if (!file) return (
         <div className="flex flex-col gap-1 border-b border-slate-100 pb-2 last:border-0 text-right">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</span>
            <div className="text-sm font-semibold text-slate-400 italic">غير متوفر | Not Available</div>
         </div>
    );

    return (
        <div className="flex flex-col gap-2 border rounded-md p-3 bg-slate-50/50 mt-2 text-right group hover:bg-slate-100 transition-colors">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">{label}</span>
                <button 
                    onClick={handleDownloadClick}
                    className="text-slate-400 hover:text-primary transition-colors p-1 rounded-full hover:bg-white"
                    title="تحميل الملف | Download File"
                >
                    <span className="material-symbols-outlined text-[20px]">download</span>
                </button>
            </div>
            
            <div className="flex items-center gap-2 justify-end">
                <span className="text-[10px] text-slate-400 font-english">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                <span className="text-xs font-bold text-slate-700 truncate max-w-[150px]" title={file.name}>{file.name}</span>
                <span className="material-symbols-outlined text-primary text-[20px]">
                    {file.type.startsWith('image/') ? 'image' : 'description'}
                </span>
            </div>
            
            <div 
                className="mt-2 relative h-32 w-full overflow-hidden rounded border border-slate-200 bg-white cursor-pointer"
                onClick={() => onView(file)}
            >
                {preview ? (
                    <img src={preview} alt={label} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                         <span className="material-symbols-outlined text-[32px]">picture_as_pdf</span>
                         <span className="text-[10px] font-bold">اضغط للعرض | Click to View</span>
                    </div>
                )}
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 bg-black/30 rounded-full p-2 backdrop-blur-sm transition-opacity">visibility</span>
                </div>
            </div>
        </div>
    )
}

const FileViewerModal: React.FC<{ file: File; onClose: () => void }> = ({ file, onClose }) => {
    const [url, setUrl] = useState<string>('');

    useEffect(() => {
        const objectUrl = URL.createObjectURL(file);
        setUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    const isImage = file.type.startsWith('image/');

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 size-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors z-50 backdrop-blur-md"
            >
                <span className="material-symbols-outlined">close</span>
            </button>

            <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex flex-col bg-transparent rounded-lg overflow-hidden">
                <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start pointer-events-none">
                    <div className="pointer-events-auto bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-lg flex items-center gap-3">
                        <span className="material-symbols-outlined">
                            {isImage ? 'image' : 'description'}
                        </span>
                        <div className="flex flex-col">
                             <span className="text-sm font-bold truncate max-w-[200px]">{file.name}</span>
                             <span className="text-[10px] opacity-75 font-english">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => downloadFile(file)}
                        className="pointer-events-auto bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg transition-colors font-bold text-sm"
                    >
                        <span>تنزيل</span>
                        <span className="material-symbols-outlined text-[18px]">download</span>
                    </button>
                </div>

                <div className="flex-1 flex items-center justify-center overflow-auto p-2 pt-16">
                    {isImage ? (
                        <img src={url} alt="Full View" className="max-w-full max-h-full object-contain shadow-2xl rounded" />
                    ) : (
                        <iframe src={url} className="w-full h-full bg-white rounded shadow-2xl" title="File Preview"></iframe>
                    )}
                </div>
            </div>
        </div>
    );
};

const EmployeeList: React.FC<EmployeeListProps> = ({ employees, onEdit, onDelete }) => {
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [selectedEmp, setSelectedEmp] = useState<EmployeeFormData | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [viewingFile, setViewingFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const handleViewRecord = (emp: EmployeeFormData) => {
    setSelectedEmp(emp);
    if (emp.profile_picture) {
        setProfilePreview(URL.createObjectURL(emp.profile_picture));
    } else {
        setProfilePreview(null);
    }
    setViewMode('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedEmp(null);
    if (profilePreview) URL.revokeObjectURL(profilePreview);
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredEmployees = useMemo(() => {
      return employees.filter(emp => 
        emp.name_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.emp_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [employees, searchTerm]);

  const sortedEmployees = useMemo(() => {
    let sortableItems = [...filteredEmployees];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue: any = a[sortConfig.key as keyof EmployeeFormData];
        let bValue: any = b[sortConfig.key as keyof EmployeeFormData];

        if (sortConfig.key === 'nationality') {
             aValue = getLabel(a.nationality, NATIONALITIES);
             bValue = getLabel(b.nationality, NATIONALITIES);
        } else if (sortConfig.key === 'degree') {
             aValue = getLabel(a.degree, DEGREES);
             bValue = getLabel(b.degree, DEGREES);
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredEmployees, sortConfig]);

  if (viewMode === 'detail' && selectedEmp) {
      return (
        <>
        {viewingFile && (
            <FileViewerModal 
                file={viewingFile} 
                onClose={() => setViewingFile(null)} 
            />
        )}
        
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between">
                <button 
                    onClick={handleBackToList}
                    className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors font-bold px-4 py-2 bg-white rounded shadow-sm border border-slate-200 hover:border-primary"
                >
                    <span className="material-symbols-outlined rtl:rotate-180">arrow_forward</span>
                    <span>العودة للقائمة | Back to List</span>
                </button>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                           onDelete(selectedEmp);
                           handleBackToList();
                        }}
                         className="flex items-center gap-2 text-red-600 hover:bg-red-50 border border-red-200 transition-colors font-bold px-4 py-2 rounded shadow-sm"
                    >
                         <span className="material-symbols-outlined text-[20px]">delete</span>
                         <span>أرشفة | Archive</span>
                    </button>
                    <button
                        onClick={() => {
                            onEdit(selectedEmp);
                            handleBackToList();
                        }}
                        className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 transition-colors font-bold px-4 py-2 rounded shadow-sm"
                    >
                         <span className="material-symbols-outlined text-[20px]">edit</span>
                         <span>تعديل | Edit</span>
                    </button>
                </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                    <div className="size-24 rounded-lg border-2 border-white shadow-sm overflow-hidden shrink-0 bg-white">
                        {profilePreview ? (
                            <img src={profilePreview} className="w-full h-full object-cover" alt="Profile" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <span className="material-symbols-outlined text-[48px]">person</span>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 text-center md:text-right flex flex-col gap-2">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 leading-tight">{selectedEmp.name_ar}</h2>
                            <h3 className="text-lg font-bold text-slate-500 font-english text-center md:text-right" dir="ltr">{selectedEmp.name_en}</h3>
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-1">
                            <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1 rounded text-xs font-bold">
                                <span className="material-symbols-outlined text-[16px]">badge</span>
                                <span dir="ltr">{selectedEmp.emp_id}</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1 rounded text-xs font-bold">
                                <span className="material-symbols-outlined text-[16px]">flag</span>
                                <span>{getLabel(selectedEmp.nationality, NATIONALITIES)}</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <FormCard title="المعلومات الشخصية" subtitle="Personal Info" icon="person" iconBgClass="bg-indigo-50" iconColorClass="text-indigo-600">
                        <InfoField label="تاريخ الميلاد" value={formatDateDisplay(selectedEmp.dob)} />
                        <InfoField label="الحالة الاجتماعية" value={getLabel(selectedEmp.marital_status, MARITAL_STATUSES)} />
                        <InfoField label="الهاتف" value={selectedEmp.phone} dir="ltr" />
                        <InfoField label="البريد الإلكتروني" value={selectedEmp.email} dir="ltr" />
                    </FormCard>

                    <FormCard title="المؤهلات العلمية" subtitle="Education" icon="school" iconBgClass="bg-emerald-50" iconColorClass="text-emerald-600">
                        <InfoField label="المؤهل" value={getLabel(selectedEmp.degree, DEGREES)} />
                        <InfoField label="التخصص" value={selectedEmp.specialization} />
                        <div className="md:col-span-2">
                             <FileDisplay label="شهادة المؤهل" file={selectedEmp.education_certificate_file} onView={setViewingFile} />
                        </div>
                    </FormCard>

                    <FormCard title="المستندات الرسمية" subtitle="Official Documents" icon="folder_shared" iconBgClass="bg-amber-50" iconColorClass="text-amber-600">
                        <InfoField label="رقم الجواز" value={selectedEmp.passport_no} dir="ltr" />
                        <InfoField label="انتهاء الجواز" value={formatDateDisplay(selectedEmp.passport_expiry)} />
                        <InfoField label="رقم الهوية" value={selectedEmp.emirates_id} dir="ltr" />
                        <InfoField label="انتهاء الهوية" value={formatDateDisplay(selectedEmp.emirates_expiry)} />
                         <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                             <FileDisplay label="صورة الجواز" file={selectedEmp.passport_file} onView={setViewingFile} />
                             <FileDisplay label="صورة الهوية" file={selectedEmp.eid_file} onView={setViewingFile} />
                        </div>
                    </FormCard>
                </div>
            </div>
        </div>
        </>
      );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white p-5 rounded-lg shadow-card border-t-4 border-primary">
             <div className="flex items-center gap-4">
                 <div className="md:col-span-1">
                    <div className="size-11 rounded-md bg-blue-50 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined">search</span>
                    </div>
                </div>
                <div className="flex-1">
                    <label className="text-xs font-bold text-slate-500 mb-1 block text-left" dir="ltr">Search Employee Records</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="البحث باسم الموظف أو الرقم الوظيفي..."
                            className="w-full h-11 rounded-md border-slate-300 pr-4 pl-10 text-sm font-semibold focus:border-primary focus:ring-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                         <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    </div>
                </div>
             </div>
        </div>

        <div className="bg-white rounded-lg shadow-card border border-slate-200 overflow-hidden">
            <div className="grid grid-cols-[3rem_1fr_1.5fr_1fr_1.5fr_8rem] bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <div className="py-4 px-2 text-center">#</div>
                <div onClick={() => handleSort('emp_id')} className="py-4 px-4 cursor-pointer hover:bg-slate-100 text-center">ID / الرقم</div>
                <div onClick={() => handleSort('name_ar')} className="py-4 px-4 cursor-pointer hover:bg-slate-100 text-right">Name / الاسم</div>
                <div onClick={() => handleSort('nationality')} className="py-4 px-4 cursor-pointer hover:bg-slate-100 text-center">Nat / الجنسية</div>
                <div onClick={() => handleSort('degree')} className="py-4 px-4 cursor-pointer hover:bg-slate-100 text-center">Degree / المؤهل</div>
                <div className="py-4 px-4 text-center">Actions / الإجراءات</div>
            </div>

            {sortedEmployees.length > 0 ? (
                <div className="divide-y divide-slate-100">
                    {sortedEmployees.map((emp, idx) => (
                        <div key={idx} className="grid grid-cols-[3rem_1fr_1.5fr_1fr_1.5fr_8rem] items-center py-4 hover:bg-blue-50/10 transition-colors group">
                             <div className="text-center text-slate-400 font-bold text-xs">{idx + 1}</div>
                             <div className="text-center font-english text-xs font-bold text-slate-600">{emp.emp_id}</div>
                             <div className="text-right px-4">
                                <div className="font-bold text-slate-700 text-sm">{emp.name_ar}</div>
                                <div className="font-english text-xs text-slate-400">{emp.name_en}</div>
                             </div>
                             <div className="text-center text-xs font-bold text-slate-500">{getLabel(emp.nationality, NATIONALITIES)}</div>
                             <div className="text-center text-xs font-bold text-slate-500">{getLabel(emp.degree, DEGREES)}</div>
                             <div className="flex items-center justify-center gap-2">
                                <button 
                                    onClick={() => onEdit(emp)}
                                    className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-full transition-colors" 
                                    title="تعديل | Edit"
                                >
                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                </button>
                                <button 
                                    onClick={() => onDelete(emp)}
                                    className="text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-colors" 
                                    title="أرشفة | Archive"
                                >
                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                </button>
                                <button 
                                    onClick={() => handleViewRecord(emp)}
                                    className="text-slate-500 hover:bg-slate-100 p-1.5 rounded-full transition-colors" 
                                    title="عرض التفاصيل | View Details"
                                >
                                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                                </button>
                             </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-[48px] mb-2 opacity-50">group_off</span>
                    <p>لا توجد بيانات موظفين | No employees found</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default EmployeeList;