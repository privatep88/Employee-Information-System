import React, { useEffect, useState, useMemo } from 'react';
import { EmployeeFormData } from '../types';
import FormCard from './UI/FormCard';
import { NATIONALITIES, MARITAL_STATUSES, DEGREES, LICENSE_TYPES, RELATIONSHIPS } from '../constants';

interface ArchiveListProps {
  employees: EmployeeFormData[];
  onRestore: (emp: EmployeeFormData) => void;
  onPermanentDelete: (emp: EmployeeFormData) => void;
}

const getLabel = (value: string, options: { value: string; label: string }[]) => {
  const option = options.find(opt => opt.value === value);
  return option ? option.label.split('|')[0].trim() : value;
};

const getEnglishLabel = (value: string, options: { value: string; label: string }[]) => {
    const option = options.find(opt => opt.value === value);
    if (!option) return value;
    const parts = option.label.split('|');
    return parts.length > 1 ? parts[1].trim() : value;
};

const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '-';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
};

// Helper to download file
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
    if (!file) return (
         <div className="flex flex-col gap-1 border-b border-slate-100 pb-2 last:border-0 text-right">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</span>
            <div className="text-sm font-semibold text-slate-400 italic">غير متوفر | Not Available</div>
         </div>
    );

    return (
        <div className="flex flex-col gap-2 border rounded-md p-3 bg-slate-50/50 mt-2 text-right">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">{label}</span>
            </div>
            <div className="flex items-center gap-2 justify-end cursor-pointer hover:bg-slate-100 p-1 rounded" onClick={() => onView(file)}>
                <span className="text-xs font-bold text-slate-700 truncate max-w-[150px]" title={file.name}>{file.name}</span>
                <span className="material-symbols-outlined text-slate-500 text-[20px]">visibility</span>
            </div>
        </div>
    )
}

// Full Screen File Viewer Modal (Simplified for Archive)
const FileViewerModal: React.FC<{ file: File; onClose: () => void }> = ({ file, onClose }) => {
    const [url, setUrl] = useState<string>('');

    useEffect(() => {
        const objectUrl = URL.createObjectURL(file);
        setUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    const isImage = file.type.startsWith('image/');

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4 print:hidden">
            <button onClick={onClose} className="absolute top-4 right-4 size-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center z-50">
                <span className="material-symbols-outlined">close</span>
            </button>
            <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex flex-col bg-transparent rounded-lg overflow-hidden">
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

const ArchiveList: React.FC<ArchiveListProps> = ({ employees, onRestore, onPermanentDelete }) => {
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [selectedEmp, setSelectedEmp] = useState<EmployeeFormData | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [viewingFile, setViewingFile] = useState<File | null>(null);

  // Sorting State
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Logic similar to EmployeeList for sorting/filtering
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
        } else if (sortConfig.key === 'deleted_at') {
             aValue = a.deleted_at ? new Date(a.deleted_at).getTime() : 0;
             bValue = b.deleted_at ? new Date(b.deleted_at).getTime() : 0;
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredEmployees, sortConfig]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handlePrint = () => {
      if (viewMode === 'detail') {
          window.print();
          return;
      }

      if (sortedEmployees.length === 0) return;

      const printWindow = window.open('', '_blank', 'width=1000,height=800');
      if (!printWindow) {
          alert('Please allow popups to print the report.');
          return;
      }

      const html = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <title>Archive Records</title>
            <style>
                body { font-family: sans-serif; padding: 20px; }
                h2 { text-align: center; margin-bottom: 20px; color: #1e293b; }
                table { width: 100%; border-collapse: collapse; font-size: 12px; }
                th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: right; }
                th { background-color: #f1f5f9; color: #475569; font-weight: bold; text-transform: uppercase; }
                tr:nth-child(even) { background-color: #f8fafc; }
                .text-center { text-align: center; }
                .text-red { color: #dc2626; font-weight: bold; }
                .sub-text { font-size: 10px; color: #64748b; display: block; margin-top: 2px; }
            </style>
        </head>
        <body>
            <h2>سجلات الأرشيف | Archived Records</h2>
            <table>
                <thead>
                    <tr>
                        <th class="text-center">#</th>
                        <th class="text-center">ID</th>
                        <th>الموظف | Employee</th>
                        <th class="text-center">الجنسية | Nationality</th>
                        <th class="text-center">تاريخ الحذف | Deleted Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${sortedEmployees.map((emp, idx) => `
                        <tr>
                            <td class="text-center">${idx + 1}</td>
                            <td class="text-center" dir="ltr"><b>${emp.emp_id}</b></td>
                            <td>
                                <b>${emp.name_ar}</b>
                                <span class="sub-text">${emp.name_en}</span>
                            </td>
                            <td class="text-center">
                                ${getLabel(emp.nationality, NATIONALITIES)}
                            </td>
                            <td class="text-center text-red" dir="ltr">
                                ${emp.deleted_at ? new Date(emp.deleted_at).toLocaleDateString('en-GB') : '-'}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <script>
                window.onload = function() { window.print(); window.setTimeout(function() { window.close(); }, 500); }
            </script>
        </body>
        </html>
      `;
      
      printWindow.document.write(html);
      printWindow.document.close();
  };

  const handleExport = () => {
      if (sortedEmployees.length === 0) return;
      
      const headers = ['Employee ID,Arabic Name,English Name,Nationality,Deleted Date'];
      const csvContent = sortedEmployees.map(emp => {
          return `${emp.emp_id},"${emp.name_ar}","${emp.name_en}",${getLabel(emp.nationality, NATIONALITIES)},${emp.deleted_at || ''}`;
      }).join('\n');
      
      const blob = new Blob(['\uFEFF' + headers + '\n' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `archive_records_${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  // Render Detailed View
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
            <div className="flex items-center justify-between print:hidden">
                <button 
                    onClick={handleBackToList}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors font-bold px-4 py-2 bg-white rounded shadow-sm border border-slate-200"
                >
                    <span className="material-symbols-outlined rtl:rotate-180">arrow_forward</span>
                    <span>العودة للأرشيف | Back to Archive</span>
                </button>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 text-slate-600 hover:bg-slate-50 border border-slate-200 transition-colors font-bold px-4 py-2 rounded shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[20px]">print</span>
                        <span>طباعة | Print</span>
                    </button>
                    <button
                        onClick={() => {
                            onRestore(selectedEmp);
                            handleBackToList();
                        }}
                        className="flex items-center gap-2 text-emerald-600 hover:bg-emerald-50 border border-emerald-200 transition-colors font-bold px-4 py-2 rounded shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[20px]">restore_from_trash</span>
                        <span>استعادة | Restore</span>
                    </button>
                    <button
                        onClick={() => {
                           onPermanentDelete(selectedEmp);
                           handleBackToList();
                        }}
                         className="flex items-center gap-2 text-red-600 hover:bg-red-50 border border-red-200 transition-colors font-bold px-4 py-2 rounded shadow-sm"
                    >
                         <span className="material-symbols-outlined text-[20px]">delete_forever</span>
                         <span>حذف نهائي | Delete Forever</span>
                    </button>
                </div>
            </div>

            {/* Read Only Details */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 opacity-90 print:opacity-100 print:bg-white print:border-0">
                 {/* Header Card */}
                <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                    <div className="size-24 rounded-lg border-2 border-slate-200 shadow-sm overflow-hidden shrink-0 bg-white grayscale print:border-slate-800">
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
                            <h2 className="text-2xl font-bold text-slate-700 leading-tight">{selectedEmp.name_ar}</h2>
                            <h3 className="text-lg font-bold text-slate-500 font-english text-center md:text-right" dir="ltr">{selectedEmp.name_en}</h3>
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-1">
                            <span className="inline-flex items-center gap-1.5 bg-slate-200 text-slate-600 border border-slate-300 px-3 py-1 rounded text-xs font-bold print:bg-transparent print:border-slate-800 print:text-slate-800">
                                <span className="material-symbols-outlined text-[16px]">badge</span>
                                <span dir="ltr">{selectedEmp.emp_id}</span>
                            </span>
                             <span className="inline-flex items-center gap-1.5 bg-slate-200 text-slate-600 border border-slate-300 px-3 py-1 rounded text-xs font-bold print:bg-transparent print:border-slate-800 print:text-slate-800">
                                <span className="material-symbols-outlined text-[16px]">event_available</span>
                                <span dir="ltr">
                                    {selectedEmp.submission_date ? new Date(selectedEmp.submission_date).toLocaleDateString('en-GB') : '-'}
                                </span>
                             </span>
                             {selectedEmp.deleted_at && (
                                <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 border border-red-200 px-3 py-1 rounded text-xs font-bold print:bg-transparent print:border-red-800 print:text-red-800">
                                    <span className="material-symbols-outlined text-[16px]">delete_history</span>
                                    <span dir="ltr">
                                        Deleted: {new Date(selectedEmp.deleted_at).toLocaleDateString('en-GB')}
                                    </span>
                                </span>
                             )}
                        </div>
                    </div>
                </div>
                 
                 <div className="grid grid-cols-1 gap-6">
                    {/* Personal Information */}
                    <FormCard
                        title="المعلومات الشخصية | Personal Information"
                        subtitle="البيانات الأساسية"
                        icon="person"
                        iconBgClass="bg-slate-200"
                        iconColorClass="text-slate-600"
                    >
                        <InfoField label="الجنسية | Nationality" value={getLabel(selectedEmp.nationality, NATIONALITIES)} />
                        <InfoField label="الحالة الاجتماعية | Marital Status" value={getLabel(selectedEmp.marital_status, MARITAL_STATUSES)} />
                        <InfoField label="تاريخ الميلاد | Date of Birth" value={formatDateDisplay(selectedEmp.dob)} />
                        <InfoField label="رقم الهاتف | Phone" value={selectedEmp.phone} dir="ltr" />
                        <InfoField label="البريد الإلكتروني | Email" value={selectedEmp.email} dir="ltr" />
                    </FormCard>

                    {/* Educational Qualifications */}
                    <FormCard
                        title="المؤهلات العلمية | Education"
                        subtitle="الشهادات والدرجات"
                        icon="school"
                        iconBgClass="bg-slate-200"
                        iconColorClass="text-slate-600"
                    >
                        <InfoField label="المؤهل العلمي | Degree" value={getLabel(selectedEmp.degree, DEGREES)} />
                        <InfoField label="التخصص | Specialization" value={selectedEmp.specialization} />
                        <div className="md:col-span-2 print:hidden">
                             <FileDisplay label="صورة المؤهل العلمي | Education Certificate" file={selectedEmp.education_certificate_file} onView={setViewingFile} />
                        </div>
                    </FormCard>

                    {/* Official Documents */}
                    <FormCard
                        title="المستندات الرسمية | Official Documents"
                        subtitle="الهويات والجوازات"
                        icon="folder_shared"
                        iconBgClass="bg-slate-200"
                        iconColorClass="text-slate-600"
                    >
                        <InfoField label="رقم جواز السفر | Passport No" value={selectedEmp.passport_no} dir="ltr" />
                        <InfoField label="انتهاء الجواز | Expiry" value={formatDateDisplay(selectedEmp.passport_expiry)} />
                        
                        <InfoField label="رقم الهوية | Emirates ID" value={selectedEmp.emirates_id} dir="ltr" />
                        <InfoField label="انتهاء الهوية | Expiry" value={formatDateDisplay(selectedEmp.emirates_expiry)} />
                        
                        <InfoField label="رقم الهوية (خليجي) | GCC ID" value={selectedEmp.gcc_id} dir="ltr" />
                        <InfoField label="انتهاء الهوية (خليجي) | GCC ID Expiry" value={formatDateDisplay(selectedEmp.gcc_id_expiry)} />

                        <InfoField label="نوع الرخصة | License Type" value={getLabel(selectedEmp.license_type, LICENSE_TYPES)} />
                        <InfoField label="انتهاء الرخصة | License Expiry" value={formatDateDisplay(selectedEmp.license_expiry)} />

                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 print:hidden">
                             <FileDisplay label="صورة جواز السفر | Passport Copy" file={selectedEmp.passport_file} onView={setViewingFile} />
                             <FileDisplay label="صورة الهوية الإماراتية | EID Copy" file={selectedEmp.eid_file} onView={setViewingFile} />
                             <FileDisplay label="صورة الهوية الخليجية | GCC ID Copy" file={selectedEmp.gcc_id_file} onView={setViewingFile} />
                             <FileDisplay label="صورة الرخصة | License Copy" file={selectedEmp.license_file} onView={setViewingFile} />
                        </div>
                    </FormCard>

                    {/* Emergency Contact */}
                    <FormCard
                        title="جهة الاتصال للطوارئ | Emergency Contact"
                        subtitle="للاتصال عند الضرورة"
                        icon="emergency"
                        iconBgClass="bg-slate-200"
                        iconColorClass="text-slate-600"
                    >
                        <InfoField label="الاسم | Name" value={selectedEmp.emergency_name} />
                        <InfoField label="الصلة | Relation" value={getLabel(selectedEmp.emergency_relation, RELATIONSHIPS)} />
                        <InfoField label="رقم الهاتف | Phone" value={selectedEmp.emergency_phone} dir="ltr" />
                    </FormCard>
                 </div>
            </div>
        </div>
        </>
      );
  }

  // --- LIST VIEW ---
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white p-5 rounded-lg shadow-card border-t-4 border-slate-500">
             <div className="flex flex-col md:flex-row items-end gap-4">
                 <div className="flex items-center gap-4 flex-1 w-full">
                     <div className="shrink-0">
                        <div className="size-11 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center">
                            <span className="material-symbols-outlined">inventory_2</span>
                        </div>
                    </div>
                    <div className="flex-1">
                        <label className="text-xs font-bold text-slate-500 mb-1 block text-left" dir="ltr">Search Archived Records</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="البحث في الأرشيف..."
                                className="w-full h-11 rounded-md border-slate-300 pr-4 pl-10 text-sm font-semibold focus:border-slate-500 focus:ring-slate-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                             <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        </div>
                    </div>
                 </div>

                 <div className="flex items-center gap-2 shrink-0">
                    <button 
                        onClick={handlePrint}
                        className="h-11 px-4 rounded-md border border-slate-300 bg-white text-slate-600 font-bold text-sm flex items-center gap-2 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[20px]">print</span>
                        <span className="hidden sm:inline">طباعة القائمة</span>
                    </button>
                    <button 
                        onClick={handleExport}
                        className="h-11 px-4 rounded-md border border-slate-300 bg-white text-slate-600 font-bold text-sm flex items-center gap-2 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[20px]">file_download</span>
                        <span className="hidden sm:inline">تصدير Excel</span>
                    </button>
                 </div>
             </div>
        </div>

        <div className="bg-white rounded-lg shadow-card border border-slate-200 overflow-hidden">
            <div className="grid grid-cols-[3rem_1fr_1.5fr_1fr_1.2fr_8rem] bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <div className="py-4 px-2 text-center">#</div>
                <div onClick={() => handleSort('emp_id')} className="py-4 px-4 cursor-pointer hover:bg-slate-100 text-center">ID / الرقم</div>
                <div onClick={() => handleSort('name_ar')} className="py-4 px-4 cursor-pointer hover:bg-slate-100 text-right">Name / الاسم</div>
                <div onClick={() => handleSort('nationality')} className="py-4 px-4 cursor-pointer hover:bg-slate-100 text-center">Nat / الجنسية</div>
                <div onClick={() => handleSort('deleted_at')} className="py-4 px-4 cursor-pointer hover:bg-slate-100 text-center">Deleted / الحذف</div>
                <div className="py-4 px-4 text-center">Actions / الإجراءات</div>
            </div>

            {sortedEmployees.length > 0 ? (
                <div className="divide-y divide-slate-100">
                    {sortedEmployees.map((emp, idx) => (
                        <div key={idx} className="grid grid-cols-[3rem_1fr_1.5fr_1fr_1.2fr_8rem] items-center py-4 hover:bg-red-50/10 transition-colors group">
                             <div className="text-center text-slate-400 font-bold text-xs">{idx + 1}</div>
                             <div className="text-center font-english text-xs font-bold text-slate-600">{emp.emp_id}</div>
                             <div className="text-right px-4">
                                <div className="font-bold text-slate-700 text-sm">{emp.name_ar}</div>
                                <div className="font-english text-xs text-slate-400">{emp.name_en}</div>
                             </div>
                             <div className="text-center text-xs font-bold text-slate-500">{getLabel(emp.nationality, NATIONALITIES)}</div>
                             <div className="text-center text-xs font-bold text-red-400 font-english">
                                {emp.deleted_at ? new Date(emp.deleted_at).toLocaleDateString('en-GB') : '-'}
                             </div>
                             <div className="flex items-center justify-center gap-2">
                                <button 
                                    onClick={() => onRestore(emp)}
                                    className="text-emerald-500 hover:bg-emerald-50 p-1.5 rounded-full transition-colors" 
                                    title="استعادة | Restore"
                                >
                                    <span className="material-symbols-outlined text-[20px]">restore_from_trash</span>
                                </button>
                                <button 
                                    onClick={() => onPermanentDelete(emp)}
                                    className="text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-colors" 
                                    title="حذف نهائي | Delete Forever"
                                >
                                    <span className="material-symbols-outlined text-[20px]">delete_forever</span>
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
                    <span className="material-symbols-outlined text-[48px] mb-2 opacity-50">inventory_2</span>
                    <p>الأرشيف فارغ | Archive is empty</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default ArchiveList;