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
            
            {/* Clickable Preview Area */}
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
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 bg-black/30 rounded-full p-2 backdrop-blur-sm transition-opacity">visibility</span>
                </div>
            </div>
        </div>
    )
}

// Full Screen File Viewer Modal
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
            {/* Close Button */}
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 size-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors z-50 backdrop-blur-md"
            >
                <span className="material-symbols-outlined">close</span>
            </button>

            {/* Content Container */}
            <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex flex-col bg-transparent rounded-lg overflow-hidden">
                
                {/* Header Actions */}
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

                {/* Main Content */}
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
  const [selectedEmpIndex, setSelectedEmpIndex] = useState<number>(-1);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [viewingFile, setViewingFile] = useState<File | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Sorting State
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNationality, setFilterNationality] = useState('');
  const [filterDegree, setFilterDegree] = useState('');
  const [filterExpiry, setFilterExpiry] = useState('');

  // Handle viewing detailed record
  const handleViewRecord = (emp: EmployeeFormData, index: number) => {
    setSelectedEmp(emp);
    setSelectedEmpIndex(index);
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
    setSelectedEmpIndex(-1);
    if (profilePreview) URL.revokeObjectURL(profilePreview);
  };

  // Handle Sorting Click
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter Logic
  const filteredEmployees = useMemo(() => {
      return employees.filter(emp => {
        const matchesSearch = 
            emp.name_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.emp_id.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesNat = filterNationality ? emp.nationality === filterNationality : true;
        const matchesDeg = filterDegree ? emp.degree === filterDegree : true;

        // Expiry Logic
        let matchesExpiry = true;
        if (filterExpiry) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const isExpired = (dateStr: string) => {
                if (!dateStr) return false;
                return new Date(dateStr) < today;
            };

            const passportExpired = isExpired(emp.passport_expiry);
            const eidExpired = isExpired(emp.emirates_expiry);
            const gccExpired = emp.gcc_id ? isExpired(emp.gcc_id_expiry) : false;
            const licenseExpired = emp.license_type !== 'none' ? isExpired(emp.license_expiry) : false;

            const hasExpiredDoc = passportExpired || eidExpired || gccExpired || licenseExpired;

            if (filterExpiry === 'valid') {
                matchesExpiry = !hasExpiredDoc;
            } else if (filterExpiry === 'expired') {
                matchesExpiry = hasExpiredDoc;
            }
        }

        return matchesSearch && matchesNat && matchesDeg && matchesExpiry;
      });
  }, [employees, searchTerm, filterNationality, filterDegree, filterExpiry]);

  // Apply Sorting to Filtered Data
  const sortedEmployees = useMemo(() => {
    let sortableItems = [...filteredEmployees];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue: any = a[sortConfig.key as keyof EmployeeFormData];
        let bValue: any = b[sortConfig.key as keyof EmployeeFormData];

        // Special handling for labels (Nationality & Degree) to sort by Arabic Text
        if (sortConfig.key === 'nationality') {
             aValue = getLabel(a.nationality, NATIONALITIES);
             bValue = getLabel(b.nationality, NATIONALITIES);
        } else if (sortConfig.key === 'degree') {
             aValue = getLabel(a.degree, DEGREES);
             bValue = getLabel(b.degree, DEGREES);
        } else if (sortConfig.key === 'submission_date') {
             aValue = aValue ? new Date(aValue).getTime() : 0;
             bValue = bValue ? new Date(bValue).getTime() : 0;
        }

        // Handle nulls
        if (aValue === null || aValue === undefined) aValue = '';
        if (bValue === null || bValue === undefined) bValue = '';

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredEmployees, sortConfig]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterNationality, filterDegree, filterExpiry]);

  // Pagination Logic
  const totalItems = sortedEmployees.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentTableData = sortedEmployees.slice(startIndex, startIndex + itemsPerPage);

  // Helper to render sort icon
  const SortIcon = ({ columnKey }: { columnKey: string }) => {
      if (sortConfig?.key !== columnKey) {
          return <span className="material-symbols-outlined text-[16px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">unfold_more</span>;
      }
      return (
          <span className="material-symbols-outlined text-[16px] text-primary">
              {sortConfig.direction === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down'}
          </span>
      );
  };

  const handlePrint = () => {
      // 1. Check if in Detail View - Print Single Record
      if (viewMode === 'detail' && selectedEmp) {
          const printWindow = window.open('', '_blank', 'width=1000,height=800');
          if (!printWindow) {
              alert('Please allow popups to print the report.');
              return;
          }

          const html = `
            <!DOCTYPE html>
            <html dir="rtl" lang="ar">
            <head>
                <title>Employee Record - ${selectedEmp.emp_id}</title>
                <style>
                    body { font-family: sans-serif; padding: 30px; direction: rtl; }
                    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1e4b8a; padding-bottom: 20px; }
                    .header h1 { margin: 0; color: #1e4b8a; font-size: 24px; }
                    .header h2 { margin: 5px 0 0; color: #64748b; font-size: 18px; font-family: sans-serif; }
                    
                    .section { margin-bottom: 20px; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden; break-inside: avoid; }
                    .section-header { background: #f8fafc; padding: 8px 15px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #334155; font-size: 14px; }
                    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; padding: 15px; }
                    
                    .field { display: flex; flex-direction: column; gap: 2px; }
                    .label { font-size: 10px; color: #64748b; font-weight: bold; text-transform: uppercase; }
                    .value { font-size: 13px; color: #0f172a; font-weight: bold; }
                    
                    @media print {
                        body { padding: 0; }
                        .section { break-inside: avoid; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>${selectedEmp.name_ar}</h1>
                    <h2 dir="ltr">${selectedEmp.name_en}</h2>
                </div>

                <div class="section">
                    <div class="section-header">المعلومات الشخصية | Personal Information</div>
                    <div class="grid">
                        <div class="field"><span class="label">الرقم الوظيفي | Employee ID</span><span class="value" dir="ltr">${selectedEmp.emp_id}</span></div>
                        <div class="field"><span class="label">الجنسية | Nationality</span><span class="value">${getLabel(selectedEmp.nationality, NATIONALITIES)}</span></div>
                        <div class="field"><span class="label">الحالة الاجتماعية | Marital Status</span><span class="value">${getLabel(selectedEmp.marital_status, MARITAL_STATUSES)}</span></div>
                        <div class="field"><span class="label">تاريخ الميلاد | Date of Birth</span><span class="value" dir="ltr">${formatDateDisplay(selectedEmp.dob)}</span></div>
                        <div class="field"><span class="label">رقم الهاتف | Phone Number</span><span class="value" dir="ltr">${selectedEmp.phone}</span></div>
                        <div class="field"><span class="label">البريد الإلكتروني | Email</span><span class="value" dir="ltr">${selectedEmp.email}</span></div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-header">المؤهلات العلمية | Education</div>
                    <div class="grid">
                        <div class="field"><span class="label">المؤهل العلمي | Qualification</span><span class="value">${getLabel(selectedEmp.degree, DEGREES)}</span></div>
                        <div class="field"><span class="label">التخصص | Specialization</span><span class="value">${selectedEmp.specialization || '-'}</span></div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-header">المستندات الرسمية | Official Documents</div>
                    <div class="grid">
                        <div class="field"><span class="label">رقم جواز السفر | Passport No</span><span class="value" dir="ltr">${selectedEmp.passport_no}</span></div>
                        <div class="field"><span class="label">تاريخ الانتهاء | Expiry Date</span><span class="value" dir="ltr">${formatDateDisplay(selectedEmp.passport_expiry)}</span></div>
                        
                        <div class="field"><span class="label">رقم الهوية | Emirates ID</span><span class="value" dir="ltr">${selectedEmp.emirates_id}</span></div>
                        <div class="field"><span class="label">تاريخ الانتهاء | Expiry Date</span><span class="value" dir="ltr">${formatDateDisplay(selectedEmp.emirates_expiry)}</span></div>
                        
                        <div class="field"><span class="label">رقم الهوية (خليجي) | GCC ID</span><span class="value" dir="ltr">${selectedEmp.gcc_id || '-'}</span></div>
                        <div class="field"><span class="label">تاريخ الانتهاء | Expiry Date</span><span class="value" dir="ltr">${formatDateDisplay(selectedEmp.gcc_id_expiry)}</span></div>

                        <div class="field"><span class="label">نوع الرخصة | License Type</span><span class="value">${getLabel(selectedEmp.license_type, LICENSE_TYPES)}</span></div>
                        <div class="field"><span class="label">تاريخ الانتهاء | Expiry Date</span><span class="value" dir="ltr">${formatDateDisplay(selectedEmp.license_expiry)}</span></div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-header">جهة الاتصال للطوارئ | Emergency Contact</div>
                    <div class="grid">
                        <div class="field"><span class="label">الاسم | Name</span><span class="value">${selectedEmp.emergency_name}</span></div>
                        <div class="field"><span class="label">الصلة | Relationship</span><span class="value">${getLabel(selectedEmp.emergency_relation, RELATIONSHIPS)}</span></div>
                        <div class="field"><span class="label">رقم الهاتف | Phone Number</span><span class="value" dir="ltr">${selectedEmp.emergency_phone}</span></div>
                    </div>
                </div>

                <script>
                    window.onload = function() { window.print(); window.setTimeout(function() { window.close(); }, 500); }
                </script>
            </body>
            </html>
          `;
          
          printWindow.document.write(html);
          printWindow.document.close();
          return;
      }

      // 2. Default List Print Logic
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
            <title>Employee Records</title>
            <style>
                body { font-family: sans-serif; padding: 20px; }
                h2 { text-align: center; margin-bottom: 20px; color: #1e293b; }
                table { width: 100%; border-collapse: collapse; font-size: 12px; }
                th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: right; }
                th { background-color: #f1f5f9; color: #475569; font-weight: bold; text-transform: uppercase; }
                tr:nth-child(even) { background-color: #f8fafc; }
                .text-center { text-align: center; }
                .text-left { text-align: left; }
                .sub-text { font-size: 10px; color: #64748b; display: block; margin-top: 2px; }
            </style>
        </head>
        <body>
            <h2>سجلات الموظفين | Employee Records</h2>
            <table>
                <thead>
                    <tr>
                        <th class="text-center">#</th>
                        <th class="text-center">ID</th>
                        <th>الموظف | Employee</th>
                        <th class="text-center">الجنسية | Nationality</th>
                        <th class="text-center">المؤهل | Qualification</th>
                        <th class="text-center">تاريخ الإدخال | Submission Date</th>
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
                            <td class="text-center">
                                ${getLabel(emp.degree, DEGREES)}
                            </td>
                            <td class="text-center" dir="ltr">
                                ${emp.submission_date ? new Date(emp.submission_date).toLocaleDateString('en-GB') : '-'}
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
      
      const headers = ['Employee ID,Arabic Name,English Name,Nationality,Qualification,Submission Date'];
      const csvContent = sortedEmployees.map(emp => {
          return `${emp.emp_id},"${emp.name_ar}","${emp.name_en}",${getLabel(emp.nationality, NATIONALITIES)},${getLabel(emp.degree, DEGREES)},${emp.submission_date || ''}`;
      }).join('\n');
      
      const blob = new Blob(['\uFEFF' + headers + '\n' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `employee_records_${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  // --- DETAILED VIEW RENDER ---
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
            {/* Back Button */}
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
                        onClick={handlePrint}
                        className="flex items-center gap-2 text-slate-600 hover:bg-slate-50 border border-slate-200 transition-colors font-bold px-4 py-2 rounded shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[20px]">print</span>
                        <span>طباعة | Print</span>
                    </button>
                    <button
                        onClick={() => {
                           onPermanentDelete(selectedEmp);
                        }}
                         className="flex items-center gap-2 text-red-600 hover:bg-red-50 border border-red-200 transition-colors font-bold px-4 py-2 rounded shadow-sm"
                    >
                         <span className="material-symbols-outlined text-[20px]">delete_forever</span>
                         <span>حذف نهائي | Permanent Delete</span>
                    </button>
                    <button
                        onClick={() => {
                            onRestore(selectedEmp);
                            handleBackToList(); // Optional: Close details view after clicking edit
                        }}
                        className="flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 transition-colors font-bold px-4 py-2 rounded shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[20px]">restore_from_trash</span>
                        <span>استعادة السجل | Restore Record</span>
                    </button>
                </div>
            </div>

            {/* Header Card */}
            <div className="bg-blue-50 rounded-card shadow-card border-r-4 border-primary p-6 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
                
                 {/* Decorations matching Primary Theme */}
                 <div className="absolute inset-0 z-0 opacity-[0.07] pointer-events-none" style={{
                     backgroundImage: `radial-gradient(#1e4b8a 1px, transparent 1px), radial-gradient(#1e4b8a 1.5px, transparent 1.5px)`,
                     backgroundSize: '50px 50px, 90px 90px',
                     backgroundPosition: '0 0, 25px 25px'
                 }}></div>
                 <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" style={{
                     backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L56 15 V45 L30 60 L4 45 V15 Z' fill='none' stroke='%231e4b8a' stroke-width='1'/%3E%3C/svg%3E")`,
                     backgroundSize: '60px 60px'
                 }}></div>
                 <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{
                      backgroundImage: `
                        linear-gradient(30deg, #1e4b8a 0%, transparent 40%),
                        linear-gradient(-30deg, #1e4b8a 0%, transparent 40%)
                      `
                 }}></div>

                <div className="size-24 rounded-lg border-2 border-slate-100 shadow-sm overflow-hidden shrink-0 bg-white relative z-10">
                    {profilePreview ? (
                        <img src={profilePreview} className="w-full h-full object-cover" alt="Profile" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                             <span className="material-symbols-outlined text-[48px]">person</span>
                        </div>
                    )}
                </div>
                <div className="flex-1 text-center md:text-right flex flex-col gap-2 relative z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 leading-tight">{selectedEmp.name_ar}</h2>
                        <h3 className="text-lg font-bold text-slate-500 font-english text-center md:text-right" dir="ltr">{selectedEmp.name_en}</h3>
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-1">
                         <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 border border-blue-200 px-3 py-1 rounded text-xs font-bold">
                            <span className="material-symbols-outlined text-[16px]">badge</span>
                            <span dir="ltr">{selectedEmp.emp_id}</span>
                         </span>
                         <span className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-600 border border-slate-200 px-3 py-1 rounded text-xs font-bold">
                            <span className="material-symbols-outlined text-[16px]">event_available</span>
                            <span dir="ltr">
                                {selectedEmp.submission_date ? new Date(selectedEmp.submission_date).toLocaleDateString('en-GB') : '-'}
                            </span>
                         </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Personal Information */}
                <FormCard
                    title="المعلومات الشخصية | Personal Information"
                    subtitle="البيانات الأساسية"
                    icon="person"
                    iconBgClass="bg-indigo-50"
                    iconColorClass="text-indigo-600"
                    bgClass="bg-[#eef2ff]"
                    enableDecorations={true}
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
                    iconBgClass="bg-emerald-50"
                    iconColorClass="text-secondary"
                    bgClass="bg-[#ebfcf4]"
                    enableDecorations={true}
                >
                    <InfoField label="المؤهل العلمي | Degree" value={getLabel(selectedEmp.degree, DEGREES)} />
                    <InfoField label="التخصص | Specialization" value={selectedEmp.specialization} />
                    <div className="md:col-span-2">
                         <FileDisplay label="صورة المؤهل العلمي | Education Certificate" file={selectedEmp.education_certificate_file} onView={setViewingFile} />
                    </div>
                </FormCard>

                {/* Official Documents */}
                <FormCard
                    title="المستندات الرسمية | Official Documents"
                    subtitle="الهويات والجوازات"
                    icon="folder_shared"
                    iconBgClass="bg-amber-50"
                    iconColorClass="text-amber-700"
                    bgClass="bg-[#fffbeb]"
                    enableDecorations={true}
                >
                    <InfoField label="رقم جواز السفر | Passport No" value={selectedEmp.passport_no} dir="ltr" />
                    <InfoField label="انتهاء الجواز | Expiry" value={formatDateDisplay(selectedEmp.passport_expiry)} />
                    
                    <InfoField label="رقم الهوية | Emirates ID" value={selectedEmp.emirates_id} dir="ltr" />
                    <InfoField label="انتهاء الهوية | Expiry" value={formatDateDisplay(selectedEmp.emirates_expiry)} />
                    
                    <InfoField label="رقم الهوية (خليجي) | GCC ID" value={selectedEmp.gcc_id} dir="ltr" />
                    <InfoField label="انتهاء الهوية (خليجي) | GCC ID Expiry" value={formatDateDisplay(selectedEmp.gcc_id_expiry)} />

                    <InfoField label="نوع الرخصة | License Type" value={getLabel(selectedEmp.license_type, LICENSE_TYPES)} />
                    <InfoField label="انتهاء الرخصة | License Expiry" value={formatDateDisplay(selectedEmp.license_expiry)} />

                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
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
                    iconBgClass="bg-rose-50"
                    iconColorClass="text-rose-700"
                    bgClass="bg-[#fdedef]"
                    enableDecorations={true}
                >
                    <InfoField label="الاسم | Name" value={selectedEmp.emergency_name} />
                    <InfoField label="الصلة | Relation" value={getLabel(selectedEmp.emergency_relation, RELATIONSHIPS)} />
                    <InfoField label="رقم الهاتف | Phone" value={selectedEmp.emergency_phone} dir="ltr" />
                </FormCard>
            </div>
            
            <div className="flex items-center gap-4 py-6">
                 <div className="h-px bg-slate-300 flex-1"></div>
                 <span className="text-slate-400 text-xs font-english">END OF RECORD</span>
                 <div className="h-px bg-slate-300 flex-1"></div>
            </div>
        </div>
        </>
      );
  }

  // --- LIST VIEW RENDER ---
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Actions Row (Print/Export) - Moved outside filter card, aligned to left (end in RTL) */}
        <div className="flex items-center justify-end gap-3">
             <button 
                onClick={handlePrint}
                className="h-10 px-5 rounded-md border border-slate-300 bg-white text-slate-600 font-bold text-sm flex items-center gap-2 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm"
            >
                <span className="material-symbols-outlined text-[20px]">print</span>
                <span>طباعة السجلات</span>
            </button>
            <button 
                onClick={handleExport}
                className="h-10 px-5 rounded-md border border-slate-300 bg-white text-slate-600 font-bold text-sm flex items-center gap-2 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm"
            >
                <span className="material-symbols-outlined text-[20px]">file_download</span>
                <span>تصدير Excel</span>
            </button>
        </div>
        
        {/* Top Filter Card */}
        <div className="bg-white p-5 rounded-lg shadow-card border-t-4 border-primary">
            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                
                {/* Filter Button (Visual) */}
                <div className="md:col-span-1">
                    <button className="w-full h-11 rounded-md bg-blue-50 text-primary border border-blue-200 flex items-center justify-center hover:bg-blue-100 transition-colors">
                        <span className="material-symbols-outlined">filter_list</span>
                    </button>
                </div>

                {/* Qualification Filter */}
                <div className="md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 mb-1 block">المؤهل | Qualification</label>
                    <select 
                        className="w-full h-11 rounded-md border-slate-300 text-sm font-semibold focus:border-primary focus:ring-primary"
                        value={filterDegree}
                        onChange={(e) => setFilterDegree(e.target.value)}
                    >
                        <option value="">الكل / All</option>
                        {DEGREES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                </div>

                 {/* Expiry Status */}
                 <div className="md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 mb-1 block">حالة الصلاحية | Expiry Status</label>
                    <select 
                        className="w-full h-11 rounded-md border-slate-300 text-sm font-semibold focus:border-primary focus:ring-primary"
                        value={filterExpiry}
                        onChange={(e) => setFilterExpiry(e.target.value)}
                    >
                        <option value="">الكل / All</option>
                        <option value="valid">ساري / Valid</option>
                        <option value="expired">منتهي / Expired</option>
                    </select>
                </div>

                 {/* Nationality Filter */}
                 <div className="md:col-span-3">
                    <label className="text-xs font-bold text-slate-500 mb-1 block">الجنسية | Nationality</label>
                    <select 
                        className="w-full h-11 rounded-md border-slate-300 text-sm font-semibold focus:border-primary focus:ring-primary"
                        value={filterNationality}
                        onChange={(e) => setFilterNationality(e.target.value)}
                    >
                        <option value="">الكل / All</option>
                         {NATIONALITIES.map(n => <option key={n.value} value={n.value}>{n.label}</option>)}
                    </select>
                </div>

                {/* Search Bar */}
                <div className="md:col-span-4">
                    <label className="text-xs font-bold text-slate-500 mb-1 block text-left" dir="ltr">Search Keywords | البحث</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="البحث بالاسم أو الرقم | Search by Name or ID"
                            className="w-full h-11 rounded-md border-slate-300 pr-4 pl-10 text-sm font-semibold focus:border-primary focus:ring-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                         <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    </div>
                </div>

            </div>
        </div>

        {/* Table/List View */}
        <div className="bg-white rounded-lg shadow-card border border-slate-200 overflow-hidden">
            {/* Table Header - Clickable for Sorting */}
            <div className="grid grid-cols-[2rem_6rem_3fr_1.5fr_1.5fr_1.2fr_8rem] bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                 {/* Sequence (Static) */}
                 <div className="py-4 px-2 text-center border-l border-slate-200/60">
                    <div className="font-english mb-0.5">#</div>
                    <div className="text-[10px]">م</div>
                </div>

                 {/* ID - Sortable */}
                 <div onClick={() => handleSort('emp_id')} className="py-4 px-2 text-center cursor-pointer hover:bg-slate-100 transition-colors group flex flex-col items-center justify-center select-none">
                    <div className="flex items-center gap-1">
                         <div className="font-english mb-0.5">ID</div>
                         <SortIcon columnKey="emp_id" />
                    </div>
                    <div className="text-[10px]">الرقم</div>
                </div>

                 {/* Name - Sortable */}
                 <div onClick={() => handleSort('name_ar')} className="py-4 px-2 text-center cursor-pointer hover:bg-slate-100 transition-colors group select-none">
                    <div className="flex items-center justify-center gap-1">
                        <div className="font-english mb-0.5">FULL NAME</div>
                        <SortIcon columnKey="name_ar" />
                    </div>
                    <div className="text-[10px]">الاسم الكامل</div>
                </div>

                {/* Nationality - Sortable */}
                <div onClick={() => handleSort('nationality')} className="py-4 px-2 text-center cursor-pointer hover:bg-slate-100 transition-colors group flex flex-col items-center justify-center select-none">
                    <div className="flex items-center gap-1">
                        <div className="font-english mb-0.5">NATIONALITY</div>
                        <SortIcon columnKey="nationality" />
                    </div>
                    <div className="text-[10px]">الجنسية</div>
                </div>

                {/* Qualification - Sortable */}
                <div onClick={() => handleSort('degree')} className="py-4 px-2 text-center cursor-pointer hover:bg-slate-100 transition-colors group flex flex-col items-center justify-center select-none">
                     <div className="flex items-center gap-1">
                        <div className="font-english mb-0.5">QUALIFICATION</div>
                        <SortIcon columnKey="degree" />
                    </div>
                    <div className="text-[10px]">المؤهل العلمي</div>
                </div>

                {/* Date - Sortable */}
                <div onClick={() => handleSort('submission_date')} className="py-4 px-2 text-center cursor-pointer hover:bg-slate-100 transition-colors group flex flex-col items-center justify-center select-none">
                    <div className="flex items-center gap-1">
                        <div className="font-english mb-0.5">DATE</div>
                        <SortIcon columnKey="submission_date" />
                    </div>
                    <div className="text-[10px]">تاريخ الإدخال</div>
                </div>

                {/* Actions (Static) */}
                <div className="py-4 px-2 text-center">
                    <div className="mb-0.5">ACTIONS</div>
                    <div className="text-[10px]">الإجراءات</div>
                </div>
            </div>

            {/* Table Rows - Custom Grid Template */}
            {currentTableData.length > 0 ? (
                <div className="divide-y divide-slate-100">
                    {currentTableData.map((emp, idx) => {
                        // Create initials
                        const initials = emp.name_en.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                        
                        // Color for initials bg
                        const colors = ['bg-blue-100 text-blue-700', 'bg-emerald-100 text-emerald-700', 'bg-amber-100 text-amber-700', 'bg-purple-100 text-purple-700', 'bg-rose-100 text-rose-700'];
                        const colorClass = colors[idx % colors.length];

                        return (
                            <div key={emp.emp_id} className="grid grid-cols-[2rem_6rem_3fr_1.5fr_1.5fr_1.2fr_8rem] items-center py-4 px-2 hover:bg-slate-50 transition-colors group">
                                {/* Sequence */}
                                <div className="flex justify-center border-l border-slate-100/60">
                                    <span className="text-xs font-bold text-slate-400 font-english">
                                        {startIndex + idx + 1}
                                    </span>
                                </div>

                                {/* ID */}
                                <div className="flex justify-center">
                                    <span className="inline-flex items-center justify-center px-1.5 py-1 rounded-md bg-slate-100 text-primary font-bold text-[10px] border border-slate-200 font-english min-w-[50px] truncate" dir="ltr" title={emp.emp_id}>
                                        {emp.emp_id}
                                    </span>
                                </div>

                                {/* Full Name - Right Aligned as requested */}
                                <div className="flex items-center justify-start gap-3 text-right">
                                    <div className={`size-9 rounded-full flex items-center justify-center text-xs font-bold tracking-wider shrink-0 ${colorClass}`}>
                                        {initials}
                                    </div>
                                    <div className="flex flex-col min-w-0 items-start">
                                        <span className="font-bold text-slate-800 break-words leading-snug">{emp.name_ar}</span>
                                        <span className="text-xs text-slate-500 font-medium font-english break-words leading-snug text-right" dir="ltr">{emp.name_en}</span>
                                    </div>
                                </div>

                                {/* Nationality */}
                                <div className="text-center text-sm font-semibold text-slate-700 flex flex-col justify-center">
                                    <span className="break-words leading-tight">{getLabel(emp.nationality, NATIONALITIES)}</span>
                                    <span className="text-xs text-slate-400 font-english break-words leading-tight">{getEnglishLabel(emp.nationality, NATIONALITIES)}</span>
                                </div>

                                {/* Qualification */}
                                <div className="text-center text-sm font-semibold text-slate-700 flex flex-col justify-center">
                                    <span className="break-words leading-tight">{getLabel(emp.degree, DEGREES)}</span>
                                    <span className="text-xs text-slate-400 font-english break-words leading-tight">{getEnglishLabel(emp.degree, DEGREES)}</span>
                                </div>

                                {/* Submission Date */}
                                <div className="text-center text-xs font-bold text-slate-500 font-english">
                                    {emp.submission_date ? new Date(emp.submission_date).toLocaleDateString('en-GB') : '-'}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-center gap-2">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation(); // Stop row click propagation if needed
                                            onPermanentDelete(emp);
                                        }}
                                        className="text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-colors" 
                                        title="Permanent Delete"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">delete_forever</span>
                                    </button>
                                    <button 
                                        onClick={() => onRestore(emp)}
                                        className="text-green-500 hover:bg-green-50 p-1.5 rounded-full transition-colors" 
                                        title="Restore Record"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">restore_from_trash</span>
                                    </button>
                                    <button 
                                        onClick={() => handleViewRecord(emp, idx)}
                                        className="text-primary hover:bg-blue-50 p-1.5 rounded-full transition-colors" 
                                        title="View Details"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-[48px] mb-2 opacity-50">search_off</span>
                    <p>لا توجد نتائج مطابقة | No matching records found</p>
                </div>
            )}
            
            {/* Pagination Footer */}
            <div className="bg-white p-4 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
                 <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 font-english order-2 md:order-1">
                     <span>Showing {totalItems > 0 ? startIndex + 1 : 0} to {endIndex} of {totalItems} results</span>
                     <span className="hidden md:inline">|</span>
                     <span dir="rtl">عرض {totalItems > 0 ? startIndex + 1 : 0} إلى {endIndex} من {totalItems} نتيجة</span>
                </div>

                <div className="flex border border-slate-200 rounded overflow-hidden order-1 md:order-2">
                    <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="size-9 flex items-center justify-center border-l border-slate-200 hover:bg-slate-50 text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Previous Page"
                    >
                         <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </button>
                    
                    <div className="h-9 px-4 flex items-center justify-center bg-blue-50 text-primary font-bold text-sm border-l border-slate-200">
                        {currentPage} <span className="mx-1 text-slate-400 font-normal">/</span> {totalPages || 1}
                    </div>

                    <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="size-9 flex items-center justify-center hover:bg-slate-50 text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Next Page"
                    >
                        <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                    </button>
                </div>
            </div>

        </div>
    </div>
  );
};

export default ArchiveList;