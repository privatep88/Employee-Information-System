import React, { useEffect, useState } from 'react';
import { EmployeeFormData } from '../types';
import FormCard from './UI/FormCard';
import { NATIONALITIES, MARITAL_STATUSES, DEGREES, LICENSE_TYPES, RELATIONSHIPS } from '../constants';

interface EmployeeListProps {
  employees: EmployeeFormData[];
  onEdit: (emp: EmployeeFormData) => void;
}

const getLabel = (value: string, options: { value: string; label: string }[]) => {
  const option = options.find(opt => opt.value === value);
  return option ? option.label.split('|')[0].trim() : value; // Get Arabic label mainly
};

const getEnglishLabel = (value: string, options: { value: string; label: string }[]) => {
    const option = options.find(opt => opt.value === value);
    if (!option) return value;
    const parts = option.label.split('|');
    return parts.length > 1 ? parts[1].trim() : value;
};

// Helper to display dates nicely (YYYY-MM-DD to DD/MM/YYYY)
const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '-';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
};

const InfoField: React.FC<{ label: string; value: string | React.ReactNode; dir?: 'rtl' | 'ltr' }> = ({ label, value, dir }) => (
  <div className="flex flex-col gap-1 border-b border-slate-100 pb-2 last:border-0 text-right">
    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</span>
    <div className={`text-sm font-bold text-slate-800 break-words text-right ${dir === 'ltr' ? 'font-english' : ''}`} dir={dir}>
      {value || '-'}
    </div>
  </div>
);

const FileDisplay: React.FC<{ label: string; file: File | null }> = ({ label, file }) => {
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (file && file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            setPreview(url);
            return () => URL.revokeObjectURL(url);
        }
        setPreview(null);
    }, [file]);

    if (!file) return (
         <div className="flex flex-col gap-1 border-b border-slate-100 pb-2 last:border-0 text-right">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</span>
            <div className="text-sm font-semibold text-slate-400 italic">غير متوفر | Not Available</div>
         </div>
    );

    return (
        <div className="flex flex-col gap-2 border rounded-md p-3 bg-slate-50/50 mt-2 text-right">
            <span className="text-xs font-bold text-slate-500">{label}</span>
            <div className="flex items-center gap-2 justify-end">
                <span className="text-[10px] text-slate-400 font-english">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                <span className="text-xs font-bold text-slate-700 truncate" title={file.name}>{file.name}</span>
                <span className="material-symbols-outlined text-primary text-[20px]">
                    {file.type.startsWith('image/') ? 'image' : 'description'}
                </span>
            </div>
            {preview && (
                <div className="mt-2 relative h-32 w-full overflow-hidden rounded border border-slate-200 bg-white">
                    <img src={preview} alt={label} className="h-full w-full object-contain" />
                </div>
            )}
        </div>
    )
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees, onEdit }) => {
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [selectedEmp, setSelectedEmp] = useState<EmployeeFormData | null>(null);
  const [selectedEmpIndex, setSelectedEmpIndex] = useState<number>(-1);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

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

  // Filter Logic
  const filteredEmployees = employees.filter(emp => {
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
            if (!dateStr) return false; // Treat missing date as not expired for this logic, or handle otherwise
            return new Date(dateStr) < today;
        };

        const passportExpired = isExpired(emp.passport_expiry);
        const eidExpired = isExpired(emp.emirates_expiry);
        const hasExpiredDoc = passportExpired || eidExpired;

        if (filterExpiry === 'valid') {
            matchesExpiry = !hasExpiredDoc;
        } else if (filterExpiry === 'expired') {
            matchesExpiry = hasExpiredDoc;
        }
    }

    return matchesSearch && matchesNat && matchesDeg && matchesExpiry;
  });

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterNationality, filterDegree, filterExpiry]);

  // Pagination Logic
  const totalItems = filteredEmployees.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentTableData = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  // --- DETAILED VIEW RENDER ---
  if (viewMode === 'detail' && selectedEmp) {
      return (
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
                <button
                    onClick={() => {
                        onEdit(selectedEmp);
                        handleBackToList(); // Optional: Close details view after clicking edit
                    }}
                    className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 transition-colors font-bold px-4 py-2 rounded shadow-sm"
                >
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                    <span>تحرير السجل | Edit Record</span>
                </button>
            </div>

            {/* Header Card */}
            <div className="bg-white rounded-card shadow-card border-r-4 border-primary p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="size-24 rounded-lg border-2 border-slate-100 shadow-sm overflow-hidden shrink-0 bg-slate-50">
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
                        <h2 className="text-2xl font-bold text-slate-900 leading-tight">{selectedEmp.name_ar}</h2>
                        <h3 className="text-lg font-bold text-slate-500 font-english text-center md:text-right" dir="ltr">{selectedEmp.name_en}</h3>
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-1">
                         <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-100 px-3 py-1 rounded text-xs font-bold">
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
                >
                    <InfoField label="المؤهل العلمي | Degree" value={getLabel(selectedEmp.degree, DEGREES)} />
                    <InfoField label="التخصص | Specialization" value={selectedEmp.specialization} />
                    <div className="md:col-span-2">
                         <FileDisplay label="صورة المؤهل العلمي | Education Certificate" file={selectedEmp.education_certificate_file} />
                    </div>
                </FormCard>

                {/* Official Documents */}
                <FormCard
                    title="المستندات الرسمية | Official Documents"
                    subtitle="الهويات والجوازات"
                    icon="folder_shared"
                    iconBgClass="bg-amber-50"
                    iconColorClass="text-amber-700"
                >
                    <InfoField label="رقم جواز السفر | Passport No" value={selectedEmp.passport_no} dir="ltr" />
                    <InfoField label="انتهاء الجواز | Expiry" value={formatDateDisplay(selectedEmp.passport_expiry)} />
                    
                    <InfoField label="رقم الهوية | Emirates ID" value={selectedEmp.emirates_id} dir="ltr" />
                    <InfoField label="انتهاء الهوية | Expiry" value={formatDateDisplay(selectedEmp.emirates_expiry)} />
                    
                    <InfoField label="رقم الهوية (خليجي) | GCC ID" value={selectedEmp.gcc_id} dir="ltr" />
                    <InfoField label="نوع الرخصة | License Type" value={getLabel(selectedEmp.license_type, LICENSE_TYPES)} />

                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                         <FileDisplay label="صورة جواز السفر | Passport Copy" file={selectedEmp.passport_file} />
                         <FileDisplay label="صورة الهوية الإماراتية | EID Copy" file={selectedEmp.eid_file} />
                         <FileDisplay label="صورة الهوية الخليجية | GCC ID Copy" file={selectedEmp.gcc_id_file} />
                         <FileDisplay label="صورة الرخصة | License Copy" file={selectedEmp.license_file} />
                    </div>
                </FormCard>

                {/* Emergency Contact */}
                <FormCard
                    title="جهة الاتصال للطوارئ | Emergency Contact"
                    subtitle="للاتصال عند الضرورة"
                    icon="emergency"
                    iconBgClass="bg-rose-50"
                    iconColorClass="text-rose-700"
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
      );
  }

  // --- LIST VIEW RENDER ---
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
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
            {/* Table Header - RTL Ordered */}
            <div className="grid grid-cols-12 bg-slate-50 py-4 px-6 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                 <div className="col-span-2 text-center">
                    <div className="font-english mb-0.5">EMPLOYEE ID</div>
                    <div className="text-[10px]">الرقم الوظيفي</div>
                </div>
                 <div className="col-span-3 text-right">
                    <div className="font-english mb-0.5">FULL NAME</div>
                    <div className="text-[10px]">الاسم الكامل</div>
                </div>
                <div className="col-span-2 text-center">
                    <div className="font-english mb-0.5">NATIONALITY</div>
                    <div className="text-[10px]">الجنسية</div>
                </div>
                <div className="col-span-2 text-center">
                    <div className="font-english mb-0.5">QUALIFICATION</div>
                    <div className="text-[10px]">المؤهل العلمي</div>
                </div>
                <div className="col-span-2 text-center">
                    <div className="font-english mb-0.5">DATE</div>
                    <div className="text-[10px]">تاريخ الإدخال</div>
                </div>
                <div className="col-span-1 text-center">
                    <div className="mb-0.5">ACTIONS</div>
                    <div className="text-[10px]">الإجراءات</div>
                </div>
            </div>

            {/* Table Rows - RTL Ordered */}
            {currentTableData.length > 0 ? (
                <div className="divide-y divide-slate-100">
                    {currentTableData.map((emp, idx) => {
                        // Create initials
                        const initials = emp.name_en.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                        
                        // Color for initials bg
                        const colors = ['bg-blue-100 text-blue-700', 'bg-emerald-100 text-emerald-700', 'bg-amber-100 text-amber-700', 'bg-purple-100 text-purple-700', 'bg-rose-100 text-rose-700'];
                        const colorClass = colors[idx % colors.length];

                        return (
                            <div key={idx} className="grid grid-cols-12 items-center py-4 px-6 hover:bg-slate-50 transition-colors group">
                                {/* ID */}
                                <div className="col-span-2 flex justify-center">
                                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-slate-100 text-primary font-bold text-xs border border-slate-200 font-english" dir="ltr">
                                        {emp.emp_id}
                                    </span>
                                </div>

                                {/* Full Name */}
                                <div className="col-span-3 flex items-center justify-start gap-3 text-right">
                                    <div className={`size-9 rounded-full flex items-center justify-center text-xs font-bold tracking-wider shrink-0 ${colorClass}`}>
                                        {initials}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-bold text-slate-800 truncate" title={emp.name_ar}>{emp.name_ar}</span>
                                        <span className="text-xs text-slate-500 font-medium font-english truncate" dir="ltr" title={emp.name_en}>{emp.name_en}</span>
                                    </div>
                                </div>

                                {/* Nationality */}
                                <div className="col-span-2 text-center text-sm font-semibold text-slate-700 flex flex-col justify-center">
                                    <span className="font-english truncate">{getEnglishLabel(emp.nationality, NATIONALITIES)}</span>
                                    <span className="text-xs text-slate-400 truncate">{getLabel(emp.nationality, NATIONALITIES)}</span>
                                </div>

                                {/* Qualification */}
                                <div className="col-span-2 text-center text-sm font-semibold text-slate-700 flex flex-col justify-center">
                                    <span className="truncate">{getLabel(emp.degree, DEGREES)}</span>
                                    <span className="text-xs text-slate-400 font-english truncate">{getEnglishLabel(emp.degree, DEGREES)}</span>
                                </div>

                                {/* Submission Date */}
                                <div className="col-span-2 text-center text-xs font-bold text-slate-500 font-english">
                                    {emp.submission_date ? new Date(emp.submission_date).toLocaleDateString('en-GB') : '-'}
                                </div>

                                {/* Actions */}
                                <div className="col-span-1 flex items-center justify-center gap-2">
                                    <button 
                                        onClick={() => onEdit(emp)}
                                        className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-full transition-colors" 
                                        title="Edit Record"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">edit</span>
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

export default EmployeeList;