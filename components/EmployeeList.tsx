import React, { useEffect, useState } from 'react';
import { EmployeeFormData } from '../types';
import FormCard from './UI/FormCard';
import { NATIONALITIES, MARITAL_STATUSES, DEGREES, LICENSE_TYPES, RELATIONSHIPS } from '../constants';

interface EmployeeListProps {
  employees: EmployeeFormData[];
}

const getLabel = (value: string, options: { value: string; label: string }[]) => {
  const option = options.find(opt => opt.value === value);
  return option ? option.label : value;
};

const InfoField: React.FC<{ label: string; value: string | React.ReactNode; dir?: 'rtl' | 'ltr' }> = ({ label, value, dir }) => (
  <div className="flex flex-col gap-1 border-b border-slate-100 pb-2 last:border-0">
    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</span>
    <div className={`text-sm font-bold text-slate-800 break-words ${dir === 'ltr' ? 'font-english text-left' : ''}`} dir={dir}>
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
         <div className="flex flex-col gap-1 border-b border-slate-100 pb-2 last:border-0">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</span>
            <div className="text-sm font-semibold text-slate-400 italic">غير متوفر | Not Available</div>
         </div>
    );

    return (
        <div className="flex flex-col gap-2 border rounded-md p-3 bg-slate-50/50 mt-2">
            <span className="text-xs font-bold text-slate-500">{label}</span>
            <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">
                    {file.type.startsWith('image/') ? 'image' : 'description'}
                </span>
                <span className="text-xs font-bold text-slate-700 truncate" title={file.name}>{file.name}</span>
                <span className="text-[10px] text-slate-400 font-english">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
            {preview && (
                <div className="mt-2 relative h-32 w-full overflow-hidden rounded border border-slate-200 bg-white">
                    <img src={preview} alt={label} className="h-full w-full object-contain" />
                </div>
            )}
        </div>
    )
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees }) => {
  const [profilePreviews, setProfilePreviews] = useState<Record<number, string>>({});

  useEffect(() => {
    // Create object URLs for profile pictures
    const newPreviews: Record<number, string> = {};
    employees.forEach((emp, index) => {
      if (emp.profile_picture) {
        newPreviews[index] = URL.createObjectURL(emp.profile_picture);
      }
    });
    setProfilePreviews(newPreviews);

    // Cleanup
    return () => {
      Object.values(newPreviews).forEach(url => URL.revokeObjectURL(url));
    };
  }, [employees]);

  if (employees.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-card shadow-soft text-center border border-slate-200">
            <div className="size-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300 border border-slate-100">
                <span className="material-symbols-outlined text-[48px]">folder_open</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">لا توجد سجلات حالياً</h3>
            <p className="text-slate-500 font-english">No records found yet.</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {employees.map((emp, index) => (
        <div key={index} className="flex flex-col gap-6 relative animate-in fade-in slide-in-from-bottom-4 duration-500">
            
             {/* Header Card */}
            <div className="bg-white rounded-card shadow-card border-r-4 border-primary p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="size-24 rounded-lg border-2 border-slate-100 shadow-sm overflow-hidden shrink-0 bg-slate-50">
                    {profilePreviews[index] ? (
                        <img src={profilePreviews[index]} className="w-full h-full object-cover" alt="Profile" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                             <span className="material-symbols-outlined text-[48px]">person</span>
                        </div>
                    )}
                </div>
                <div className="flex-1 text-center md:text-right flex flex-col gap-2">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 leading-tight">{emp.name_ar}</h2>
                        <h3 className="text-lg font-bold text-slate-500 font-english" dir="ltr">{emp.name_en}</h3>
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-1">
                         <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-100 px-3 py-1 rounded text-xs font-bold">
                            <span className="material-symbols-outlined text-[16px]">badge</span>
                            <span dir="ltr">{emp.emp_id}</span>
                         </span>
                         <span className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-600 border border-slate-200 px-3 py-1 rounded text-xs font-bold">
                            <span className="material-symbols-outlined text-[16px]">event_available</span>
                            <span dir="ltr">{new Date(emp.submission_date || '').toLocaleDateString('en-GB')}</span>
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
                    iconBgClass="bg-blue-50"
                    iconColorClass="text-primary"
                >
                    <InfoField label="الجنسية | Nationality" value={getLabel(emp.nationality, NATIONALITIES)} />
                    <InfoField label="الحالة الاجتماعية | Marital Status" value={getLabel(emp.marital_status, MARITAL_STATUSES)} />
                    <InfoField label="تاريخ الميلاد | Date of Birth" value={emp.dob} />
                </FormCard>

                {/* Educational Qualifications */}
                <FormCard
                    title="المؤهلات العلمية | Education"
                    subtitle="الشهادات والدرجات"
                    icon="school"
                    iconBgClass="bg-emerald-50"
                    iconColorClass="text-secondary"
                >
                    <InfoField label="المؤهل العلمي | Degree" value={getLabel(emp.degree, DEGREES)} />
                    <InfoField label="التخصص | Specialization" value={emp.specialization} />
                    <div className="md:col-span-2">
                         <FileDisplay label="صورة المؤهل العلمي | Education Certificate" file={emp.education_certificate_file} />
                    </div>
                </FormCard>

                {/* Contact Information */}
                <FormCard
                    title="معلومات الاتصال | Contact Info"
                    subtitle="أرقام التواصل"
                    icon="contact_phone"
                    iconBgClass="bg-purple-50"
                    iconColorClass="text-purple-700"
                >
                    <InfoField label="رقم الهاتف | Phone" value={emp.phone} dir="ltr" />
                    <InfoField label="البريد الإلكتروني | Email" value={emp.email} dir="ltr" />
                </FormCard>

                {/* Official Documents */}
                <FormCard
                    title="المستندات الرسمية | Official Documents"
                    subtitle="الهويات والجوازات"
                    icon="folder_shared"
                    iconBgClass="bg-amber-50"
                    iconColorClass="text-amber-700"
                >
                    <InfoField label="رقم جواز السفر | Passport No" value={emp.passport_no} dir="ltr" />
                    <InfoField label="انتهاء الجواز | Expiry" value={emp.passport_expiry} />
                    
                    <InfoField label="رقم الهوية | Emirates ID" value={emp.emirates_id} dir="ltr" />
                    <InfoField label="انتهاء الهوية | Expiry" value={emp.emirates_expiry} />
                    
                    <InfoField label="رقم الهوية (خليجي) | GCC ID" value={emp.gcc_id} dir="ltr" />
                    <InfoField label="نوع الرخصة | License Type" value={getLabel(emp.license_type, LICENSE_TYPES)} />

                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                         <FileDisplay label="صورة جواز السفر | Passport Copy" file={emp.passport_file} />
                         <FileDisplay label="صورة الهوية الإماراتية | EID Copy" file={emp.eid_file} />
                         <FileDisplay label="صورة الهوية الخليجية | GCC ID Copy" file={emp.gcc_id_file} />
                         <FileDisplay label="صورة الرخصة | License Copy" file={emp.license_file} />
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
                    <InfoField label="الاسم | Name" value={emp.emergency_name} />
                    <InfoField label="الصلة | Relation" value={getLabel(emp.emergency_relation, RELATIONSHIPS)} />
                    <InfoField label="رقم الهاتف | Phone" value={emp.emergency_phone} dir="ltr" />
                </FormCard>
            </div>
            
            <div className="flex items-center gap-4 py-6">
                 <div className="h-px bg-slate-300 flex-1"></div>
                 <span className="text-slate-400 text-xs font-english">END OF RECORD</span>
                 <div className="h-px bg-slate-300 flex-1"></div>
            </div>
        </div>
      ))}
    </div>
  );
};

export default EmployeeList;