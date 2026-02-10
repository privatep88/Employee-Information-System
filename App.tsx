import React, { useState, useMemo } from 'react';
import { INITIAL_STATE, EmployeeFormData } from './types';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import FormCard from './components/UI/FormCard';
import { TextInput, SelectInput } from './components/UI/FormInputs';
import FileUpload from './components/UI/FileUpload';
import ProfileUpload from './components/UI/ProfileUpload';
import ConfirmationDialog from './components/UI/ConfirmationDialog';
import EmployeeList from './components/EmployeeList';
import Reports from './components/Reports';
import { NATIONALITIES, MARITAL_STATUSES, DEGREES, LICENSE_TYPES, RELATIONSHIPS } from './constants';

// Map internal keys to display labels for validation messages
const REQUIRED_FIELD_LABELS: Record<string, string> = {
  emp_id: "الرقم الوظيفي | Employee ID",
  nationality: "الجنسية | Nationality",
  name_ar: "الاسم الكامل (عربي) | Full Name (Arabic)",
  name_en: "الاسم الكامل (إنجليزي) | Full Name (English)",
  marital_status: "الحالة الاجتماعية | Marital Status",
  dob: "تاريخ الميلاد | Date of Birth",
  degree: "المؤهل العلمي | Educational Qualification",
  phone: "رقم الهاتف | Phone Number",
  passport_no: "رقم جواز السفر | Passport Number",
  passport_expiry: "انتهاء جواز السفر | Passport Expiry",
  emirates_id: "رقم الهوية الإماراتية | Emirates ID",
  emirates_expiry: "انتهاء الهوية الإماراتية | Emirates ID Expiry",
  license_type: "نوع الرخصة | License Type",
  license_expiry: "تاريخ انتهاء الرخصة | License Expiry",
  passport_file: "صورة جواز السفر | Passport Copy",
  eid_file: "صورة الهوية الإماراتية | Emirates ID Copy",
  license_file: "صورة رخصة القيادة | Driving License Copy",
  emergency_name: "اسم شخص للطوارئ | Emergency Contact Name",
  emergency_relation: "صلة القرابة | Relationship",
  emergency_phone: "رقم التواصل للطوارئ | Emergency Contact Number",
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'data' | 'reports'>('home');
  const [employees, setEmployees] = useState<EmployeeFormData[]>([]);
  const [formData, setFormData] = useState<EmployeeFormData>(INITIAL_STATE);
  
  // Edit Mode State
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  // Validation State
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Date Logic: Capture current date for display and record keeping
  const [currentDate] = useState(new Date());

  const formattedDate = currentDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).split('/').join(' / '); // 25 / 10 / 2023 format

  const dayNameAr = currentDate.toLocaleDateString('ar-AE', { weekday: 'long' });
  const dayNameEn = currentDate.toLocaleDateString('en-US', { weekday: 'long' });

  // Calculate Total Expired Documents for Badge
  const totalExpiredCount = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let count = 0;

    employees.forEach(emp => {
        // Helper
        const isExpired = (d: string) => d && new Date(d) < today;

        if (isExpired(emp.passport_expiry)) count++;
        if (isExpired(emp.emirates_expiry)) count++;
        if (emp.gcc_id && isExpired(emp.gcc_id_expiry)) count++;
        if (emp.license_type !== 'none' && isExpired(emp.license_expiry)) count++;
    });

    return count;
  }, [employees]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      // 5MB limit (5 * 1024 * 1024 bytes)
      const maxSize = 5 * 1024 * 1024;
      
      if (file.size > maxSize) {
        alert('حجم الملف يتجاوز 5 ميجابايت. يرجى اختيار ملف أصغر.\nFile size exceeds 5MB limit. Please choose a smaller file.');
        e.target.value = ''; // Reset the input to allow re-selecting
        return;
      }
      
      setFormData(prev => ({ ...prev, [name]: file }));
    }
  };

  const handleRemoveProfilePicture = () => {
    setFormData(prev => ({ ...prev, profile_picture: null }));
  };

  // Logic to start editing an employee
  const handleEditEmployee = (emp: EmployeeFormData) => {
    // Find the index of the employee in the master array
    const index = employees.indexOf(emp);
    if (index > -1) {
        setFormData(emp);
        setEditingIndex(index);
        setActiveTab('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Validate all required fields
  const validateForm = () => {
    const errors: string[] = [];
    
    Object.entries(REQUIRED_FIELD_LABELS).forEach(([key, label]) => {
      // Conditional validation: Driving license file/expiry is only required if license type is not "none"
      if ((key === 'license_file' || key === 'license_expiry') && formData.license_type === 'none') {
        return;
      }

      const value = formData[key as keyof EmployeeFormData];
      if (!value) {
        errors.push(label);
      }
    });

    return errors;
  };

  // Called when user clicks "Save & Submit"
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check validation manually
    const errors = validateForm();
    
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowErrorDialog(true);
      return; // Stop submission
    }

    // If valid, show confirmation
    setShowConfirmDialog(true);
  };

  // Called when user confirms inside the dialog
  const handleConfirmSubmission = () => {
    if (editingIndex !== null) {
        // Update existing record
        const updatedEmployees = [...employees];
        // Keep the original submission date if it exists, otherwise set current
        const updatedData = {
            ...formData,
            submission_date: formData.submission_date || currentDate.toISOString()
        };
        updatedEmployees[editingIndex] = updatedData;
        setEmployees(updatedEmployees);
        console.log('Record Updated:', updatedData);
    } else {
        // Create new record
        const submissionData = {
            ...formData,
            submission_date: currentDate.toISOString()
        };
        // Add to employees list (Prepend)
        setEmployees(prev => [submissionData, ...prev]);
        console.log('New Record Created:', submissionData);
    }

    setShowConfirmDialog(false);
    
    // Switch to data tab and show success
    setTimeout(() => {
        setActiveTab('data');
        setShowSuccessDialog(true);
        // Reset form and edit state
        setFormData(INITIAL_STATE);
        setEditingIndex(null);
    }, 300);
  };

  const handleReset = () => {
    if(confirm('هل أنت متأكد من رغبتك في إعادة تعيين النموذج؟ سيتم فقدان جميع البيانات غير المحفوظة.\nAre you sure you want to reset the form? Unsaved data will be lost.')) {
        setFormData(INITIAL_STATE);
        setEditingIndex(null);
        setValidationErrors([]);
    }
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'home':
        return (
          /* Form has noValidate to suppress browser popups and allow custom dialog */
          <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
            
            {/* 1. Personal Information */}
            <FormCard
              title="المعلومات الشخصية | Personal Information"
              subtitle="البيانات الأساسية للتعريف بالموظف | Basic identification data"
              icon="person"
              iconBgClass="bg-indigo-50"
              iconColorClass="text-indigo-600"
              bgClass="bg-indigo-50"
              headerContent={
                <ProfileUpload
                    name="profile_picture"
                    currentFile={formData.profile_picture}
                    onFileSelect={handleFileChange}
                    onRemove={handleRemoveProfilePicture}
                />
              }
            >
              <TextInput
                id="emp_id"
                name="emp_id"
                label="الرقم الوظيفي | Employee ID"
                placeholder="Ex: EMP-10023"
                value={formData.emp_id}
                onChange={handleInputChange}
                required
                dir="ltr"
              />
              <SelectInput
                id="nationality"
                name="nationality"
                label="الجنسية | Nationality"
                placeholder="--- اختر الجنسية ---"
                value={formData.nationality}
                onChange={handleInputChange}
                options={NATIONALITIES}
                required
              />
              <TextInput
                id="name_ar"
                name="name_ar"
                label="الاسم الكامل (باللغة العربية) | Full Name (Arabic)"
                placeholder="الاسم رباعي كما في الجواز"
                value={formData.name_ar}
                onChange={handleInputChange}
                required
              />
              <TextInput
                id="name_en"
                name="name_en"
                label="الاسم الكامل (باللغة الإنجليزية) | Full Name (English)"
                placeholder="Full Name as in Passport"
                value={formData.name_en}
                onChange={handleInputChange}
                required
                dir="ltr"
              />
              <SelectInput
                id="marital_status"
                name="marital_status"
                label="الحالة الاجتماعية | Marital Status"
                placeholder="--- اختر الحالة ---"
                value={formData.marital_status}
                onChange={handleInputChange}
                options={MARITAL_STATUSES}
                required
              />
              <TextInput
                id="dob"
                name="dob"
                type="date"
                label="تاريخ الميلاد | Date of Birth"
                value={formData.dob}
                onChange={handleInputChange}
                className="cursor-pointer"
                icon="calendar_today"
                required
              />
              <TextInput
                id="phone"
                name="phone"
                type="tel"
                label="رقم الهاتف | Phone Number"
                placeholder="05xxxxxxxx"
                value={formData.phone}
                onChange={handleInputChange}
                required
                icon="call"
                dir="ltr"
              />
               <TextInput
                id="email"
                name="email"
                type="email"
                label="البريد الإلكتروني | Email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleInputChange}
                icon="mail"
                dir="ltr"
                // Optional as requested
              />
            </FormCard>

            {/* 2. Educational Qualifications */}
            <FormCard
              title="المؤهلات العلمية | Educational Qualifications"
              subtitle="الشهادات والدرجات الأكاديمية | Academic certificates and degrees"
              icon="school"
              iconBgClass="bg-emerald-50"
              iconColorClass="text-secondary"
              bgClass="bg-emerald-50"
              borderColor="border-emerald-900"
            >
              <SelectInput
                id="degree"
                name="degree"
                label="المؤهل العلمي | Educational Qualification"
                placeholder="--- اختر المؤهل ---"
                value={formData.degree}
                onChange={handleInputChange}
                options={DEGREES}
                required
              />
              <TextInput
                id="specialization"
                name="specialization"
                label="التخصص | Specialization"
                placeholder="مثال: هندسة برمجيات"
                value={formData.specialization}
                onChange={handleInputChange}
                // Optional as requested
              />
              <div className="md:col-span-2">
                <FileUpload
                    id="education_certificate_file"
                    label="صورة المؤهل العلمي | Education Certificate Image"
                    icon="upload_file"
                    currentFile={formData.education_certificate_file}
                    onFileSelect={handleFileChange}
                    // Optional as requested
                />
              </div>
            </FormCard>

            {/* 3. Official Documents */}
            <FormCard
              title="المستندات الرسمية | Official Documents"
              subtitle="أرقام الهوية والجوازات | ID and Passport numbers"
              icon="folder_shared"
              iconBgClass="bg-amber-50"
              iconColorClass="text-amber-700"
              bgClass="bg-amber-50"
            >
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                <TextInput
                  id="passport_no"
                  name="passport_no"
                  label="رقم جواز السفر | Passport Number"
                  placeholder="Passport Number"
                  value={formData.passport_no}
                  onChange={handleInputChange}
                  dir="ltr"
                  labelClassName="min-h-[1.5rem] flex items-end pb-0.5"
                  required
                />
                <TextInput
                  id="passport_expiry"
                  name="passport_expiry"
                  type="date"
                  label="تاريخ الانتهاء | Expiry Date"
                  value={formData.passport_expiry}
                  onChange={handleInputChange}
                  className="cursor-pointer"
                  labelClassName="min-h-[1.5rem] flex items-end pb-0.5"
                  icon="calendar_today"
                  required
                />
                <TextInput
                  id="emirates_id"
                  name="emirates_id"
                  label="رقم الهوية الإماراتية | Emirates ID"
                  placeholder="784-xxxx-xxxxxxx-x"
                  value={formData.emirates_id}
                  onChange={handleInputChange}
                  dir="ltr"
                  labelClassName="min-h-[1.5rem] flex items-end pb-0.5"
                  required
                />
                <TextInput
                  id="emirates_expiry"
                  name="emirates_expiry"
                  type="date"
                  label="تاريخ الانتهاء | Expiry Date"
                  value={formData.emirates_expiry}
                  onChange={handleInputChange}
                  className="cursor-pointer"
                  labelClassName="min-h-[1.5rem] flex items-end pb-0.5"
                  icon="calendar_today"
                  required
                />
                <TextInput
                  id="gcc_id"
                  name="gcc_id"
                  label="رقم الهوية (خليجي) | GCC ID"
                  placeholder="GCC ID Number"
                  value={formData.gcc_id}
                  onChange={handleInputChange}
                  dir="ltr"
                  labelClassName="min-h-[1.5rem] flex items-end pb-0.5"
                  // Optional as requested
                />
                <TextInput
                  id="gcc_id_expiry"
                  name="gcc_id_expiry"
                  type="date"
                  label="تاريخ انتهاء الهوية (خليجي) | GCC ID Expiry"
                  value={formData.gcc_id_expiry}
                  onChange={handleInputChange}
                  className="cursor-pointer"
                  labelClassName="min-h-[1.5rem] flex items-end pb-0.5"
                  icon="calendar_today"
                  // Optional as requested
                />
                <SelectInput
                  id="license_type"
                  name="license_type"
                  label="نوع الرخصة | License Type"
                  placeholder="--- اختر النوع ---"
                  value={formData.license_type}
                  onChange={handleInputChange}
                  options={LICENSE_TYPES}
                  labelClassName="min-h-[1.5rem] flex items-end pb-0.5"
                  required
                />
                <TextInput
                  id="license_expiry"
                  name="license_expiry"
                  type="date"
                  label="تاريخ انتهاء الرخصة | License Expiry"
                  value={formData.license_expiry}
                  onChange={handleInputChange}
                  className="cursor-pointer"
                  labelClassName="min-h-[1.5rem] flex items-end pb-0.5"
                  icon="calendar_today"
                  required={formData.license_type !== 'none'}
                  disabled={formData.license_type === 'none'}
                  containerClassName="md:col-span-2"
                />
              </div>
              
              <FileUpload
                  id="passport_file"
                  label="صورة جواز السفر | Passport Copy"
                  icon="upload_file"
                  currentFile={formData.passport_file}
                  onFileSelect={handleFileChange}
                  required
              />
              <FileUpload
                  id="eid_file"
                  label="صورة الهوية الإماراتية | Emirates ID Copy"
                  icon="id_card"
                  currentFile={formData.eid_file}
                  onFileSelect={handleFileChange}
                  required
              />
              <FileUpload
                  id="gcc_id_file"
                  label="صورة البطاقة الشخصية (خليجي) | GCC ID Copy"
                  icon="badge"
                  currentFile={formData.gcc_id_file}
                  onFileSelect={handleFileChange}
                  // Optional as requested
              />
              <FileUpload
                  id="license_file"
                  label="صورة رخصة القيادة | Driving License Copy"
                  icon="directions_car"
                  currentFile={formData.license_file}
                  onFileSelect={handleFileChange}
                  required={formData.license_type !== 'none'}
              />
            </FormCard>

            {/* 4. Emergency Contact */}
            <FormCard
              title="جهة الاتصال في حالات الطوارئ | Emergency Contact Details"
              subtitle="للاتصال عند الضرورة القصوى | For urgent contact only"
              icon="emergency"
              iconBgClass="bg-rose-50"
              iconColorClass="text-rose-700"
              bgClass="bg-rose-50"
            >
               <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                <TextInput
                    id="emergency_name"
                    name="emergency_name"
                    label="الاسم الكامل | Full Name"
                    placeholder="Contact Name"
                    value={formData.emergency_name}
                    onChange={handleInputChange}
                    labelClassName="min-h-[1.5rem] flex items-end pb-0.5"
                    required
                />
                <SelectInput
                    id="emergency_relation"
                    name="emergency_relation"
                    label="صلة القرابة | Relationship"
                    placeholder="--- اختر الصلة ---"
                    value={formData.emergency_relation}
                    onChange={handleInputChange}
                    options={RELATIONSHIPS}
                    labelClassName="min-h-[1.5rem] flex items-center pb-0.5"
                    required
                />
                <TextInput
                    id="emergency_phone"
                    name="emergency_phone"
                    type="tel"
                    label="رقم الهاتف | Phone Number"
                    placeholder="05xxxxxxxx"
                    value={formData.emergency_phone}
                    onChange={handleInputChange}
                    dir="ltr"
                    labelClassName="min-h-[1.5rem] flex items-end pb-0.5"
                    required
                />
               </div>
            </FormCard>

            {/* Declaration & Actions - Legal Style */}
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-md flex flex-col gap-6 mt-2 relative shadow-card">
              <div className="absolute top-0 right-0 w-1 h-full bg-blue-600 rounded-r-md"></div>
              
              <div className="flex flex-col gap-2">
                 <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wide">إقرار وتعهد | Declaration</h3>
                 <p className="text-xs text-blue-600">يرجى قراءة النص أدناه والموافقة عليه للمتابعة.</p>
              </div>

              <label className="flex items-start gap-4 cursor-pointer group bg-white p-4 border border-blue-100 rounded hover:border-blue-300 transition-colors shadow-sm">
                <div className="relative flex items-center pt-1">
                  <input
                    type="checkbox"
                    name="declaration_accepted"
                    className="peer size-5 cursor-pointer appearance-none rounded border border-slate-400 bg-white checked:border-primary checked:bg-white transition-all shadow-sm"
                    checked={formData.declaration_accepted}
                    onChange={handleInputChange}
                  />
                  <span className="material-symbols-outlined absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[calc(50%-2px)] text-sm text-primary opacity-0 peer-checked:opacity-100 pointer-events-none">
                    check
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                    <span className="text-sm font-bold text-[#1e3a8a] leading-relaxed text-justify">
                      «أقرّ أنا الموظف بأن جميع البيانات التي قمت بإدخالها صحيحة ودقيقة، وأتعهد بتحديث هذه البيانات متى ما تطلّب الأمر ذلك.»
                    </span>
                    <span className="text-xs font-medium text-slate-500 leading-relaxed text-right font-english" dir="ltr">
                      I hereby declare that all the information entered is accurate and correct, and I undertake to update this information whenever required.
                    </span>
                </div>
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-end pt-4 border-t border-blue-200">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto h-11 px-6 rounded border border-blue-200 bg-white text-slate-700 font-bold text-sm hover:bg-slate-50 hover:text-red-700 hover:border-red-200 transition-colors shadow-sm"
                >
                  {editingIndex !== null ? 'إلغاء التعديل | Cancel Edit' : 'إلغاء العملية | Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={!formData.declaration_accepted}
                  className={`w-full sm:w-auto h-11 px-8 rounded bg-primary text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 ${!formData.declaration_accepted ? 'opacity-50 cursor-not-allowed bg-slate-400' : 'hover:bg-primary-hover hover:shadow'}`}
                >
                  <span className="material-symbols-outlined text-[18px]">{editingIndex !== null ? 'update' : 'save'}</span>
                  {editingIndex !== null ? 'تحديث البيانات | Update Data' : 'حفظ البيانات | Save Data'}
                </button>
              </div>
            </div>

          </form>
        );
      case 'data':
        return <EmployeeList employees={employees} onEdit={handleEditEmployee} />;
      case 'reports':
        return <Reports employees={employees} />;
      default:
        return null;
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header activeTab={activeTab} onTabChange={setActiveTab} expiredCount={totalExpiredCount} />
      
      <main className="flex-1 flex justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl flex flex-col gap-8">
          
          {/* Page Title & Date Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-300">
            <div className="flex flex-col gap-2 w-full max-w-2xl">
              <h1 className="text-2xl md:text-3xl font-extrabold leading-tight tracking-normal text-slate-800">
                {activeTab === 'home' ? (
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#1e4b8a] text-[32px] md:text-[36px]">badge</span>
                        <div>
                            <span className="text-[#1e4b8a]">
                                {editingIndex !== null ? 'تحديث بيانات الموظف' : 'نموذج بيانات الموظف'}
                            </span> 
                            <span className="text-[#1e4b8a] font-light mx-2">|</span> 
                            <span className="font-english font-medium text-[#1e4b8a] text-xl md:text-2xl">
                                {editingIndex !== null ? 'Update Employee Data' : 'Employee Data Form'}
                            </span>
                        </div>
                    </div>
                ) : activeTab === 'data' ? (
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#1e4b8a] text-[32px] md:text-[36px]">folder_shared</span>
                        <div>
                             <span className="text-[#1e4b8a]">سجلات الموظفين</span> <span className="text-[#1e4b8a] font-light mx-2">|</span> <span className="font-english font-medium text-[#1e4b8a] text-xl md:text-2xl">Employee Records</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#1e4b8a] text-[32px] md:text-[36px]">bar_chart</span>
                        <div>
                             <span className="text-[#1e4b8a]">تقارير النظام</span> <span className="text-[#1e4b8a] font-light mx-2">|</span> <span className="font-english font-medium text-[#1e4b8a] text-xl md:text-2xl">System Reports</span>
                        </div>
                    </div>
                )}
              </h1>
              <div className="w-full flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#7688a3] text-2xl mt-1 shrink-0">info</span>
                  <div>
                    <p className="text-[#7688a3] text-base font-medium leading-relaxed">
                        {activeTab === 'home' 
                            ? (editingIndex !== null ? "يرجى تعديل البيانات المطلوبة ثم الضغط على تحديث للحفظ." : "يرجى تعبئة النموذج أدناه بدقة عالية لضمان تحديث السجلات.") 
                            : activeTab === 'data' 
                                ? "قائمة بجميع بيانات الموظفين التي تم إدخالها وحفظها في النظام."
                                : "عرض تفصيلي لجميع المستندات المنتهية وتنبيهات النظام."}
                    </p>
                    <p className="text-[#7688a3] text-sm mt-0.5 text-right font-english" dir="ltr">
                        {activeTab === 'home' 
                            ? (editingIndex !== null ? "Please edit the required data and click Update to save." : "Please fill out the form accurately to ensure records update.") 
                            : activeTab === 'data' 
                                ? "List of all employee data entered and saved in the system."
                                : "Detailed view of all expired documents and system alerts."}
                    </p>
                  </div>
              </div>
            </div>

            {/* Date Display Card - Elegant Official Style */}
            <div className="shrink-0 relative bg-white rounded-xl border border-blue-100 shadow-card overflow-hidden flex flex-row items-stretch min-w-[220px] group hover:border-blue-300 transition-colors">
                {/* Accent Strip */}
                <div className="w-1.5 bg-primary shrink-0"></div>
                
                <div className="flex-1 p-3 px-4 flex items-center justify-between gap-4">
                   <div className="flex flex-col gap-0.5">
                       <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-english mb-0.5">Today's Date</span>
                       <div className="text-lg font-black text-slate-800 font-english tracking-widest leading-none" dir="ltr">
                           {formattedDate}
                       </div>
                       <div className="text-xs font-bold text-primary mt-1">
                           {dayNameAr} <span className="text-slate-300 mx-1">|</span> {dayNameEn}
                       </div>
                   </div>
                   <div className="size-10 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0 border border-blue-100 group-hover:scale-105 transition-transform">
                       <span className="material-symbols-outlined text-[24px]">calendar_month</span>
                   </div>
                </div>
            </div>
          </div>

          {renderContent()}
        </div>
      </main>
      
      <Footer />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmSubmission}
        title={editingIndex !== null ? "تأكيد تحديث البيانات" : "تأكيد حفظ البيانات"}
        message={
            <div className="flex flex-col gap-2">
                <p>
                    {editingIndex !== null 
                        ? "هل أنت متأكد من مراجعة التعديلات وترغب في تحديث بيانات الموظف؟" 
                        : "هل أنت متأكد من مراجعة البيانات بشكل دقيق وترغب في حفظ وإرسال النموذج؟"}
                </p>
                <p className="text-sm font-english opacity-80" dir="ltr">
                    {editingIndex !== null
                        ? "Are you sure you reviewed the changes and want to update the employee data?"
                        : "Are you sure you reviewed the data accurately and want to save and submit the form?"}
                </p>
            </div>
        }
        confirmLabel={editingIndex !== null ? "نعم، تحديث | Yes, Update" : "نعم، إرسال | Yes, Submit"}
        cancelLabel="تراجع | Cancel"
        variant="primary"
        icon="help"
      />

      {/* Error / Validation Dialog */}
      <ConfirmationDialog
        isOpen={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        onConfirm={() => setShowErrorDialog(false)}
        title="بيانات ناقصة | Missing Information"
        message={
            <div className="flex flex-col gap-4 text-start">
                <p className="font-bold text-primary">يرجى تعبئة الحقول الإلزامية التالية قبل المتابعة:</p>
                <p className="font-bold text-primary text-sm font-english" dir="ltr">Please fill in the following required fields before proceeding:</p>
                
                <div className="bg-slate-50 p-4 rounded border border-slate-200 max-h-[40vh] overflow-y-auto">
                    <ul className="list-disc list-inside space-y-1 text-sm font-semibold text-slate-800">
                        {validationErrors.map((err, index) => (
                            <li key={index}>{err}</li>
                        ))}
                    </ul>
                </div>
            </div>
        }
        confirmLabel="موافق | OK"
        showCancel={false}
        variant="error"
        icon="error"
      />

      {/* Success Dialog */}
      <ConfirmationDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        onConfirm={() => setShowSuccessDialog(false)}
        title={editingIndex !== null ? "تم التحديث بنجاح" : "تم الإرسال بنجاح"}
        message={
            <div className="flex flex-col gap-2">
                <p>{editingIndex !== null ? "تم تحديث بيانات الموظف بنجاح في السجلات." : "تم حفظ وإرسال بياناتك بنجاح إلى قسم الموارد البشرية."}</p>
                <p className="text-sm font-english opacity-80" dir="ltr">{editingIndex !== null ? "Employee data has been successfully updated in the records." : "Your data has been successfully saved and submitted to the HR department."}</p>
            </div>
        }
        confirmLabel="إغلاق | Close"
        showCancel={false}
        variant="success"
        icon="check_circle"
      />

    </div>
  );
};

export default App;