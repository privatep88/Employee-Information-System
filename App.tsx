import React, { useState } from 'react';
import { INITIAL_STATE, EmployeeFormData } from './types';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import FormCard from './components/UI/FormCard';
import { TextInput, SelectInput } from './components/UI/FormInputs';
import FileUpload from './components/UI/FileUpload';

// Comprehensive list of nationalities
const NATIONALITIES = [
  { value: 'UAE', label: 'الإمارات العربية المتحدة | United Arab Emirates' },
  { value: 'AFG', label: 'أفغانستان | Afghanistan' },
  { value: 'ALB', label: 'ألبانيا | Albania' },
  { value: 'DZA', label: 'الجزائر | Algeria' },
  { value: 'AND', label: 'أندورا | Andorra' },
  { value: 'AGO', label: 'أنغولا | Angola' },
  { value: 'ARG', label: 'الأرجنتين | Argentina' },
  { value: 'ARM', label: 'أرمينيا | Armenia' },
  { value: 'AUS', label: 'أستراليا | Australia' },
  { value: 'AUT', label: 'النمسا | Austria' },
  { value: 'AZE', label: 'أذربيجان | Azerbaijan' },
  { value: 'BHR', label: 'البحرين | Bahrain' },
  { value: 'BGD', label: 'بنغلاديش | Bangladesh' },
  { value: 'BRB', label: 'بربادوس | Barbados' },
  { value: 'BLR', label: 'بيلاروسيا | Belarus' },
  { value: 'BEL', label: 'بلجيكا | Belgium' },
  { value: 'BLZ', label: 'بليز | Belize' },
  { value: 'BEN', label: 'بنين | Benin' },
  { value: 'BTN', label: 'بوتان | Bhutan' },
  { value: 'BOL', label: 'بوليفيا | Bolivia' },
  { value: 'BIH', label: 'البوسنة والهرسك | Bosnia and Herzegovina' },
  { value: 'BWA', label: 'بوتسوانا | Botswana' },
  { value: 'BRA', label: 'البرازيل | Brazil' },
  { value: 'BRN', label: 'بروناي | Brunei' },
  { value: 'BGR', label: 'بلغاريا | Bulgaria' },
  { value: 'BFA', label: 'بوركينا فاسو | Burkina Faso' },
  { value: 'BDI', label: 'بوروندي | Burundi' },
  { value: 'KHM', label: 'كمبوديا | Cambodia' },
  { value: 'CMR', label: 'الكاميرون | Cameroon' },
  { value: 'CAN', label: 'كندا | Canada' },
  { value: 'CPV', label: 'الرأس الأخضر | Cape Verde' },
  { value: 'CAF', label: 'جمهورية أفريقيا الوسطى | Central African Republic' },
  { value: 'TCD', label: 'تشاد | Chad' },
  { value: 'CHL', label: 'تشيلي | Chile' },
  { value: 'CHN', label: 'الصين | China' },
  { value: 'COL', label: 'كولومبيا | Colombia' },
  { value: 'COM', label: 'جزر القمر | Comoros' },
  { value: 'COG', label: 'الكونغو | Congo' },
  { value: 'CRI', label: 'كوستاريكا | Costa Rica' },
  { value: 'HRV', label: 'كرواتيا | Croatia' },
  { value: 'CUB', label: 'كوبا | Cuba' },
  { value: 'CYP', label: 'قبرص | Cyprus' },
  { value: 'CZE', label: 'جمهورية التشيك | Czech Republic' },
  { value: 'DNK', label: 'الدانمارك | Denmark' },
  { value: 'DJI', label: 'جيبوتي | Djibouti' },
  { value: 'DMA', label: 'دومينيكا | Dominica' },
  { value: 'DOM', label: 'جمهورية الدومينيكان | Dominican Republic' },
  { value: 'ECU', label: 'الإكوادور | Ecuador' },
  { value: 'EGY', label: 'مصر | Egypt' },
  { value: 'SLV', label: 'السلفادور | El Salvador' },
  { value: 'GNQ', label: 'غينيا الاستوائية | Equatorial Guinea' },
  { value: 'ERI', label: 'إريتريا | Eritrea' },
  { value: 'EST', label: 'إستونيا | Estonia' },
  { value: 'ETH', label: 'إثيوبيا | Ethiopia' },
  { value: 'FJI', label: 'فيجي | Fiji' },
  { value: 'FIN', label: 'فنلندا | Finland' },
  { value: 'FRA', label: 'فرنسا | France' },
  { value: 'GAB', label: 'الغابون | Gabon' },
  { value: 'GMB', label: 'غامبيا | Gambia' },
  { value: 'GEO', label: 'جورجيا | Georgia' },
  { value: 'DEU', label: 'ألمانيا | Germany' },
  { value: 'GHA', label: 'غانا | Ghana' },
  { value: 'GRC', label: 'اليونان | Greece' },
  { value: 'GRD', label: 'غرينادا | Grenada' },
  { value: 'GTM', label: 'غواتيمالا | Guatemala' },
  { value: 'GIN', label: 'غينيا | Guinea' },
  { value: 'GNB', label: 'غينيا بيساو | Guinea-Bissau' },
  { value: 'GUY', label: 'غويانا | Guyana' },
  { value: 'HTI', label: 'هايتي | Haiti' },
  { value: 'HND', label: 'هندوراس | Honduras' },
  { value: 'HUN', label: 'هنغاريا | Hungary' },
  { value: 'ISL', label: 'آيسلندا | Iceland' },
  { value: 'IND', label: 'الهند | India' },
  { value: 'IDN', label: 'إندونيسيا | Indonesia' },
  { value: 'IRN', label: 'إيران | Iran' },
  { value: 'IRQ', label: 'العراق | Iraq' },
  { value: 'IRL', label: 'إيرلندا | Ireland' },
  { value: 'ITA', label: 'إيطاليا | Italy' },
  { value: 'JAM', label: 'جامايكا | Jamaica' },
  { value: 'JPN', label: 'اليابان | Japan' },
  { value: 'JOR', label: 'الأردن | Jordan' },
  { value: 'KAZ', label: 'كازاخستان | Kazakhstan' },
  { value: 'KEN', label: 'كينيا | Kenya' },
  { value: 'KIR', label: 'كيريباتي | Kiribati' },
  { value: 'KWT', label: 'الكويت | Kuwait' },
  { value: 'KGZ', label: 'قرغيزستان | Kyrgyzstan' },
  { value: 'LAO', label: 'لاوس | Laos' },
  { value: 'LVA', label: 'لاتفيا | Latvia' },
  { value: 'LBN', label: 'لبنان | Lebanon' },
  { value: 'LSO', label: 'ليسوتو | Lesotho' },
  { value: 'LBR', label: 'ليبيريا | Liberia' },
  { value: 'LBY', label: 'ليبيا | Libya' },
  { value: 'LIE', label: 'ليختنشتاين | Liechtenstein' },
  { value: 'LTU', label: 'ليتوانيا | Lithuania' },
  { value: 'LUX', label: 'لوكسمبورغ | Luxembourg' },
  { value: 'MKD', label: 'مقدونيا الشمالية | North Macedonia' },
  { value: 'MDG', label: 'مدغشقر | Madagascar' },
  { value: 'MWI', label: 'مالاوي | Malawi' },
  { value: 'MYS', label: 'ماليزيا | Malaysia' },
  { value: 'MDV', label: 'جزر المالديف | Maldives' },
  { value: 'MLI', label: 'مالي | Mali' },
  { value: 'MLT', label: 'مالطا | Malta' },
  { value: 'MHL', label: 'جزر مارشال | Marshall Islands' },
  { value: 'MRT', label: 'موريتانيا | Mauritania' },
  { value: 'MUS', label: 'موريشيوس | Mauritius' },
  { value: 'MEX', label: 'المكسيك | Mexico' },
  { value: 'FSM', label: 'ميكرونيزيا | Micronesia' },
  { value: 'MDA', label: 'مولدوفا | Moldova' },
  { value: 'MCO', label: 'موناكو | Monaco' },
  { value: 'MNG', label: 'منغوليا | Mongolia' },
  { value: 'MNE', label: 'الجبل الأسود | Montenegro' },
  { value: 'MAR', label: 'المغرب | Morocco' },
  { value: 'MOZ', label: 'موزمبيق | Mozambique' },
  { value: 'MMR', label: 'ميانمار | Myanmar' },
  { value: 'NAM', label: 'ناميبيا | Namibia' },
  { value: 'NRU', label: 'ناورو | Nauru' },
  { value: 'NPL', label: 'نيبال | Nepal' },
  { value: 'NLD', label: 'هولندا | Netherlands' },
  { value: 'NZL', label: 'نيوزيلندا | New Zealand' },
  { value: 'NIC', label: 'نيكاراغوا | Nicaragua' },
  { value: 'NER', label: 'النيجر | Niger' },
  { value: 'NGA', label: 'نيجيريا | Nigeria' },
  { value: 'PRK', label: 'كوريا الشمالية | North Korea' },
  { value: 'NOR', label: 'النرويج | Norway' },
  { value: 'OMN', label: 'عمان | Oman' },
  { value: 'PAK', label: 'باكستان | Pakistan' },
  { value: 'PLW', label: 'بالاو | Palau' },
  { value: 'PSE', label: 'فلسطين | Palestine' },
  { value: 'PAN', label: 'بنما | Panama' },
  { value: 'PNG', label: 'بابوا غينيا الجديدة | Papua New Guinea' },
  { value: 'PRY', label: 'باراغواي | Paraguay' },
  { value: 'PER', label: 'بيرو | Peru' },
  { value: 'PHL', label: 'الفلبين | Philippines' },
  { value: 'POL', label: 'بولندا | Poland' },
  { value: 'PRT', label: 'البرتغال | Portugal' },
  { value: 'QAT', label: 'قطر | Qatar' },
  { value: 'ROU', label: 'رومانيا | Romania' },
  { value: 'RUS', label: 'روسيا | Russia' },
  { value: 'RWA', label: 'رواندا | Rwanda' },
  { value: 'KNA', label: 'سانت كيتس ونيفيس | Saint Kitts and Nevis' },
  { value: 'LCA', label: 'سانت لوسيا | Saint Lucia' },
  { value: 'VCT', label: 'سانت فنسنت وجزر غرينادين | Saint Vincent and the Grenadines' },
  { value: 'WSM', label: 'ساموا | Samoa' },
  { value: 'SMR', label: 'سان مارينو | San Marino' },
  { value: 'STP', label: 'ساو تومي وبرينسيب | Sao Tome and Principe' },
  { value: 'SAU', label: 'المملكة العربية السعودية | Saudi Arabia' },
  { value: 'SEN', label: 'السنغال | Senegal' },
  { value: 'SRB', label: 'صربيا | Serbia' },
  { value: 'SYC', label: 'سيشيل | Seychelles' },
  { value: 'SLE', label: 'سيراليون | Sierra Leone' },
  { value: 'SGP', label: 'سنغافورة | Singapore' },
  { value: 'SVK', label: 'سلوفاكيا | Slovakia' },
  { value: 'SVN', label: 'سلوفينيا | Slovenia' },
  { value: 'SLB', label: 'جزر سليمان | Solomon Islands' },
  { value: 'SOM', label: 'الصومال | Somalia' },
  { value: 'ZAF', label: 'جنوب أفريقيا | South Africa' },
  { value: 'KOR', label: 'كوريا الجنوبية | South Korea' },
  { value: 'SSD', label: 'جنوب السودان | South Sudan' },
  { value: 'ESP', label: 'إسبانيا | Spain' },
  { value: 'LKA', label: 'سريلانكا | Sri Lanka' },
  { value: 'SDN', label: 'السودان | Sudan' },
  { value: 'SUR', label: 'سورينام | Suriname' },
  { value: 'SWE', label: 'السويد | Sweden' },
  { value: 'CHE', label: 'سويسرا | Switzerland' },
  { value: 'SYR', label: 'سوريا | Syria' },
  { value: 'TWN', label: 'تايوان | Taiwan' },
  { value: 'TJK', label: 'طاجيكستان | Tajikistan' },
  { value: 'TZA', label: 'تنزانيا | Tanzania' },
  { value: 'THA', label: 'تايلاند | Thailand' },
  { value: 'TLS', label: 'تيمور الشرقية | Timor-Leste' },
  { value: 'TGO', label: 'توغو | Togo' },
  { value: 'TON', label: 'تونغا | Tonga' },
  { value: 'TTO', label: 'ترينيداد وتوباغو | Trinidad and Tobago' },
  { value: 'TUN', label: 'تونس | Tunisia' },
  { value: 'TUR', label: 'تركيا | Turkey' },
  { value: 'TKM', label: 'تركمانستان | Turkmenistan' },
  { value: 'TUV', label: 'توفالو | Tuvalu' },
  { value: 'UGA', label: 'أوغندا | Uganda' },
  { value: 'UKR', label: 'أوكرانيا | Ukraine' },
  { value: 'GBR', label: 'المملكة المتحدة | United Kingdom' },
  { value: 'USA', label: 'الولايات المتحدة | United States' },
  { value: 'URY', label: 'أوروغواي | Uruguay' },
  { value: 'UZB', label: 'أوزبكستان | Uzbekistan' },
  { value: 'VUT', label: 'فانواتو | Vanuatu' },
  { value: 'VAT', label: 'الفاتيكان | Vatican City' },
  { value: 'VEN', label: 'فنزويلا | Venezuela' },
  { value: 'VNM', label: 'فيتنام | Vietnam' },
  { value: 'YEM', label: 'اليمن | Yemen' },
  { value: 'ZMB', label: 'زامبيا | Zambia' },
  { value: 'ZWE', label: 'زيمبابوي | Zimbabwe' }
];

const App: React.FC = () => {
  const [formData, setFormData] = useState<EmployeeFormData>(INITIAL_STATE);

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
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Submitted with Data:', formData);
    alert('Data logged to console successfully.');
  };

  const handleReset = () => {
    if(confirm('Are you sure you want to reset the form?')) {
        setFormData(INITIAL_STATE);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 flex justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl flex flex-col gap-10">
          
          {/* Page Title Section */}
          <div className="flex flex-col gap-3 pb-6 border-b border-slate-200">
            <h1 className="text-2xl md:text-3xl font-extrabold leading-tight tracking-tight text-slate-900">
              نموذج بيانات الموظف | Employee Data Form
            </h1>
            <div className="w-fit max-w-2xl">
                <p className="text-slate-500 text-base font-medium leading-relaxed text-justify [text-align-last:justify]">
                  قم بتعبأة النموذج أدناه بدقة عالية لضمان تحديث السجلات بإدارة الموارد البشرية.
                </p>
                <p className="text-slate-400 text-base mt-1 text-left" dir="ltr">
                  Please fill out the form below accurately to ensure HR records are updated correctly.
                </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            
            {/* 1. Personal Information */}
            <FormCard
              title="المعلومات الشخصية | Personal Information"
              subtitle="البيانات الأساسية للتعريف بالموظف | Basic identification data"
              icon="person"
              iconBgClass="bg-blue-50"
              iconColorClass="text-primary"
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
                placeholder="اختر الجنسية | Select Nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                options={NATIONALITIES}
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
                placeholder="اختر الحالة | Select Status"
                value={formData.marital_status}
                onChange={handleInputChange}
                options={[
                  { value: 'single', label: 'أعزب/عزباء | Single' },
                  { value: 'married', label: 'متزوج/متزوجة | Married' },
                  { value: 'divorced', label: 'مطلق/مطلقة | Divorced' },
                  { value: 'widowed', label: 'أرمل/أرملة | Widowed' },
                  { value: 'other', label: 'أخرى | Other' },
                ]}
              />
              <TextInput
                id="dob"
                name="dob"
                type="date"
                label="تاريخ الميلاد | Date of Birth"
                value={formData.dob}
                onChange={handleInputChange}
                className="appearance-none cursor-pointer"
                icon="calendar_month"
              />
            </FormCard>

            {/* 2. Educational Qualifications */}
            <FormCard
              title="المؤهلات العلمية | Educational Qualifications"
              subtitle="الشهادات والدرجات الأكاديمية | Academic certificates and degrees"
              icon="school"
              iconBgClass="bg-emerald-50"
              iconColorClass="text-emerald-600"
            >
              <SelectInput
                id="degree"
                name="degree"
                label="المؤهل العلمي | Educational Qualification"
                placeholder="اختر الدرجة | Select Degree"
                value={formData.degree}
                onChange={handleInputChange}
                options={[
                  { value: 'none', label: 'لا يوجد مؤهل | No Qualification' },
                  { value: 'primary', label: 'ابتدائي | Primary School' },
                  { value: 'middle', label: 'إعدادي | Middle School' },
                  { value: 'hs', label: 'ثانوية عامة | High School' },
                  { value: 'ba', label: 'بكالوريوس | Bachelor' },
                  { value: 'ma', label: 'ماجستير | Master' },
                  { value: 'phd', label: 'دكتوراه | PhD' },
                ]}
              />
              <TextInput
                id="specialization"
                name="specialization"
                label="التخصص | Specialization"
                placeholder="مثال: هندسة برمجيات | e.g. Software Engineering"
                value={formData.specialization}
                onChange={handleInputChange}
              />
              <div className="md:col-span-2">
                <FileUpload
                    id="education_certificate_file"
                    label="صورة المؤهل العلمي | Education Certificate Image"
                    icon="upload_file"
                    currentFile={formData.education_certificate_file}
                    onFileSelect={handleFileChange}
                />
              </div>
            </FormCard>

            {/* 3. Contact Information */}
            <FormCard
              title="معلومات الاتصال | Contact Information"
              subtitle="وسائل التواصل المباشرة | Direct contact methods"
              icon="contact_phone"
              iconBgClass="bg-purple-50"
              iconColorClass="text-purple-600"
            >
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
              />
            </FormCard>

            {/* 4. Official Documents */}
            <FormCard
              title="المستندات الرسمية | Official Documents"
              subtitle="أرقام الهوية والجوازات | ID and Passport numbers"
              icon="folder_shared"
              iconBgClass="bg-amber-50"
              iconColorClass="text-amber-600"
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
                  labelClassName="min-h-[2.5rem] flex items-end pb-1"
                />
                <TextInput
                  id="passport_expiry"
                  name="passport_expiry"
                  type="date"
                  label="تاريخ انتهاء جواز السفر | Passport Expiry Date"
                  value={formData.passport_expiry}
                  onChange={handleInputChange}
                  className="cursor-pointer"
                  labelClassName="min-h-[2.5rem] flex items-end pb-1"
                  icon="calendar_month"
                />
                <TextInput
                  id="gcc_id"
                  name="gcc_id"
                  label="رقم البطاقة الشخصية (خليجي) | GCC ID Number"
                  placeholder="GCC ID Number"
                  value={formData.gcc_id}
                  onChange={handleInputChange}
                  dir="ltr"
                  labelClassName="min-h-[2.5rem] flex items-end pb-1"
                />
                <TextInput
                  id="emirates_id"
                  name="emirates_id"
                  label="رقم الهوية الإماراتية | Emirates ID Number"
                  placeholder="784-xxxx-xxxxxxx-x"
                  value={formData.emirates_id}
                  onChange={handleInputChange}
                  dir="ltr"
                  labelClassName="min-h-[2.5rem] flex items-end pb-1"
                />
                <TextInput
                  id="emirates_expiry"
                  name="emirates_expiry"
                  type="date"
                  label="تاريخ انتهاء الهوية الإماراتية | Emirates ID Expiry"
                  value={formData.emirates_expiry}
                  onChange={handleInputChange}
                  className="cursor-pointer"
                  labelClassName="min-h-[2.5rem] flex items-end pb-1"
                  icon="calendar_month"
                />
                <SelectInput
                  id="license_type"
                  name="license_type"
                  label="نوع الرخصة | License Type"
                  placeholder="اختر نوع الرخصة | Select License Type"
                  value={formData.license_type}
                  onChange={handleInputChange}
                  options={[
                    { value: 'private', label: 'رخصة خصوصي (خفيفة) | Private (Light)' },
                    { value: 'heavy', label: 'رخصة ثقيلة | Heavy Vehicle' },
                    { value: 'motorcycle', label: 'دراجة نارية | Motorcycle' },
                    { value: 'bus', label: 'حافلة | Bus' },
                    { value: 'none', label: 'لا يوجد | None' },
                  ]}
                  labelClassName="min-h-[2.5rem] flex items-end pb-1"
                />
              </div>
              
              <FileUpload
                  id="passport_file"
                  label="صورة جواز السفر | Passport Copy"
                  icon="upload_file"
                  currentFile={formData.passport_file}
                  onFileSelect={handleFileChange}
              />
              <FileUpload
                  id="eid_file"
                  label="صورة الهوية الإماراتية | Emirates ID Copy"
                  icon="id_card"
                  currentFile={formData.eid_file}
                  onFileSelect={handleFileChange}
              />
              <FileUpload
                  id="gcc_id_file"
                  label="صورة البطاقة الشخصية (خليجي) | GCC ID Copy"
                  icon="badge"
                  currentFile={formData.gcc_id_file}
                  onFileSelect={handleFileChange}
              />
              <FileUpload
                  id="license_file"
                  label="صورة رخصة القيادة | Driving License Copy"
                  icon="directions_car"
                  currentFile={formData.license_file}
                  onFileSelect={handleFileChange}
              />
            </FormCard>

            {/* 5. Emergency Contact */}
            <FormCard
              title="جهة الاتصال في حالات الطوارئ | Emergency Contact Details"
              subtitle="للاتصال عند الضرورة القصوى | For urgent contact only"
              icon="emergency"
              iconBgClass="bg-rose-50"
              iconColorClass="text-rose-600"
            >
               <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                <TextInput
                    id="emergency_name"
                    name="emergency_name"
                    label="اسم شخص للطوارئ | Emergency Contact Name"
                    placeholder="Contact Name"
                    value={formData.emergency_name}
                    onChange={handleInputChange}
                    labelClassName="min-h-[2.5rem] flex items-end pb-1"
                />
                <SelectInput
                    id="emergency_relation"
                    name="emergency_relation"
                    label="صلة القرابة | Relationship"
                    placeholder="اختر الصلة | Select Relationship"
                    value={formData.emergency_relation}
                    onChange={handleInputChange}
                    options={[
                    { value: 'parent', label: 'أب / أم | Parent' },
                    { value: 'spouse', label: 'زوج / زوجة | Spouse' },
                    { value: 'sibling', label: 'أخ / أخت | Sibling' },
                    { value: 'friend', label: 'صديق | Friend' },
                    { value: 'other', label: 'أخرى | Other' },
                    ]}
                    labelClassName="min-h-[2.5rem] flex items-center pb-1"
                />
                <TextInput
                    id="emergency_phone"
                    name="emergency_phone"
                    type="tel"
                    label="رقم التواصل في حالات الطوارئ | Emergency Contact Number"
                    placeholder="05xxxxxxxx"
                    value={formData.emergency_phone}
                    onChange={handleInputChange}
                    dir="ltr"
                    labelClassName="min-h-[2.5rem] flex items-end pb-1"
                />
               </div>
            </FormCard>

            {/* Declaration & Actions */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-8 flex flex-col gap-6 mt-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center pt-1">
                  <input
                    type="checkbox"
                    name="declaration_accepted"
                    className="peer size-5 cursor-pointer appearance-none rounded border border-slate-300 bg-white checked:border-primary checked:bg-primary transition-all shadow-sm"
                    checked={formData.declaration_accepted}
                    onChange={handleInputChange}
                  />
                  <span className="material-symbols-outlined absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[calc(50%-2px)] text-sm text-white opacity-0 peer-checked:opacity-100 pointer-events-none">
                    check
                  </span>
                </div>
                <div className="flex flex-col gap-1 flex-1">
                    <span className="text-base font-semibold text-slate-700 leading-relaxed select-none group-hover:text-slate-900 transition-colors">
                      «أقرّ أنا الموظف بأن جميع البيانات التي قمت بإدخالها صحيحة ودقيقة، وأتعهد بتحديث هذه البيانات متى ما تطلّب الأمر ذلك.»
                    </span>
                    <span className="text-base font-semibold text-slate-900 leading-relaxed select-none transition-colors text-right" dir="ltr">
                      I hereby declare that all the information entered is accurate and correct, and I undertake to update this information whenever required.
                    </span>
                </div>
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-end pt-6 border-t border-blue-100">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto h-12 px-8 rounded-xl border border-slate-200 bg-white text-slate-600 font-extrabold text-sm uppercase tracking-wider hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm"
                >
                  إلغاء العملية | CANCEL PROCESS
                </button>
                <button
                  type="submit"
                  disabled={!formData.declaration_accepted}
                  className={`w-full sm:w-auto h-12 px-10 rounded-xl bg-primary text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-3 transform active:scale-95 ${!formData.declaration_accepted ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-hover hover:shadow-blue-500/30'}`}
                >
                  <span className="material-symbols-outlined text-[20px]">save</span>
                  حفظ البيانات | SAVE DATA
                </button>
              </div>
            </div>

          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default App;