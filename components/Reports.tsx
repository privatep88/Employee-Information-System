import React, { useState, useMemo } from 'react';
import { EmployeeFormData } from '../types';
import { NATIONALITIES, DEGREES } from '../constants';

interface ReportsProps {
  employees: EmployeeFormData[];
}

interface ExpiredRecord {
  emp_id: string;
  name_ar: string;
  name_en: string;
  nationality: string;
  doc_type: string;
  expiry_date: string;
  profile_picture: File | null;
}

const getNationalityLabel = (code: string) => {
  const nat = NATIONALITIES.find(n => n.value === code);
  return nat ? nat.label.split('|')[0].trim() : code;
};

const getEnglishNationalityLabel = (code: string) => {
  const nat = NATIONALITIES.find(n => n.value === code);
  if (!nat) return code;
  const parts = nat.label.split('|');
  return parts.length > 1 ? parts[1].trim() : code;
};

const Reports: React.FC<ReportsProps> = ({ employees }) => {
  const [expirySearchTerm, setExpirySearchTerm] = useState('');
  
  // Sorting State
  const [sortConfig, setSortConfig] = useState<{ key: keyof ExpiredRecord; direction: 'asc' | 'desc' } | null>(null);
  
  // 1. Calculate expired records
  const expiredRecords = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const records: ExpiredRecord[] = [];

    employees.forEach(emp => {
      // Helper to check date
      const checkExpiry = (dateStr: string, docName: string) => {
        if (!dateStr) return;
        const expiry = new Date(dateStr);
        if (expiry < today) {
          records.push({
            emp_id: emp.emp_id,
            name_ar: emp.name_ar,
            name_en: emp.name_en,
            nationality: emp.nationality,
            doc_type: docName,
            expiry_date: dateStr,
            profile_picture: emp.profile_picture
          });
        }
      };

      // Check all documents
      checkExpiry(emp.passport_expiry, 'جواز السفر | Passport');
      checkExpiry(emp.emirates_expiry, 'الهوية الإماراتية | Emirates ID');
      
      // Check GCC ID only if exists
      if (emp.gcc_id) {
        checkExpiry(emp.gcc_id_expiry, 'الهوية الخليجية | GCC ID');
      }

      // Check License only if not 'none'
      if (emp.license_type !== 'none') {
        checkExpiry(emp.license_expiry, 'رخصة القيادة | Driving License');
      }
    });

    return records;
  }, [employees]);

  // Filter Expired Records based on Search Term
  const filteredExpiredRecords = useMemo(() => {
    if (!expirySearchTerm) return expiredRecords;
    const lowerTerm = expirySearchTerm.toLowerCase();

    return expiredRecords.filter(record => 
        record.emp_id.toLowerCase().includes(lowerTerm) ||
        record.name_ar.toLowerCase().includes(lowerTerm) ||
        record.name_en.toLowerCase().includes(lowerTerm) ||
        record.doc_type.toLowerCase().includes(lowerTerm) ||
        getNationalityLabel(record.nationality).toLowerCase().includes(lowerTerm) ||
        getEnglishNationalityLabel(record.nationality).toLowerCase().includes(lowerTerm)
    );
  }, [expiredRecords, expirySearchTerm]);

  // Apply Sorting to Filtered Records
  const sortedExpiredRecords = useMemo(() => {
    let sortableItems = [...filteredExpiredRecords];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue: any = a[sortConfig.key];
        let bValue: any = b[sortConfig.key];

        // Special handling for nationality label sort
        if (sortConfig.key === 'nationality') {
             aValue = getNationalityLabel(a.nationality);
             bValue = getNationalityLabel(b.nationality);
        }
        
        // Handle dates
        if (sortConfig.key === 'expiry_date') {
             aValue = new Date(aValue).getTime();
             bValue = new Date(bValue).getTime();
        }

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
  }, [filteredExpiredRecords, sortConfig]);

  const handleSort = (key: keyof ExpiredRecord) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Helper for sort icon
  const SortIcon = ({ columnKey }: { columnKey: string }) => {
      if (sortConfig?.key !== columnKey) {
          return <span className="material-symbols-outlined text-[16px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">unfold_more</span>;
      }
      return (
          <span className="material-symbols-outlined text-[16px] text-red-500">
              {sortConfig.direction === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down'}
          </span>
      );
  };

  // 2. Calculate Nationality Statistics
  const nationalityStats = useMemo(() => {
      const stats: Record<string, number> = {};
      employees.forEach(emp => {
          if (emp.nationality) {
              stats[emp.nationality] = (stats[emp.nationality] || 0) + 1;
          }
      });
      
      // Convert to array and sort by count descending
      return Object.entries(stats)
          .map(([code, count]) => ({
              code,
              count,
              labelAr: getNationalityLabel(code),
              labelEn: getEnglishNationalityLabel(code),
              percentage: (count / employees.length) * 100
          }))
          .sort((a, b) => b.count - a.count);
  }, [employees]);

  // 3. Calculate Education Statistics
  const educationStats = useMemo(() => {
    const stats: Record<string, number> = {};
    employees.forEach(emp => {
        if (emp.degree) {
            stats[emp.degree] = (stats[emp.degree] || 0) + 1;
        }
    });

    return DEGREES.map(degree => ({
        ...degree,
        count: stats[degree.value] || 0,
        percentage: employees.length ? ((stats[degree.value] || 0) / employees.length) * 100 : 0
    })).filter(d => d.count > 0).sort((a, b) => b.count - a.count);
  }, [employees]);

  // 4. Calculate File Statistics
  const fileStats = useMemo(() => {
      let totalFiles = 0;
      let pdfCount = 0;
      let imageCount = 0;
      
      const categoryCounts = {
          profile: 0,
          education: 0,
          passport: 0,
          eid: 0,
          license: 0,
          gcc: 0
      };

      const checkFile = (file: File | null, category: keyof typeof categoryCounts) => {
          if (file) {
              totalFiles++;
              categoryCounts[category]++;
              if (file.type === 'application/pdf') pdfCount++;
              else if (file.type.startsWith('image/')) imageCount++;
          }
      };

      employees.forEach(emp => {
          checkFile(emp.profile_picture, 'profile');
          checkFile(emp.education_certificate_file, 'education');
          checkFile(emp.passport_file, 'passport');
          checkFile(emp.eid_file, 'eid');
          checkFile(emp.license_file, 'license');
          checkFile(emp.gcc_id_file, 'gcc');
      });

      return { totalFiles, pdfCount, imageCount, categoryCounts };
  }, [employees]);

  const handlePrint = () => {
      window.print();
  };

  const handleExport = () => {
      if (sortedExpiredRecords.length === 0) return;
      
      const headers = ['Employee ID,Arabic Name,English Name,Nationality,Document,Expiry Date'];
      const csvContent = sortedExpiredRecords.map(rec => {
          return `${rec.emp_id},"${rec.name_ar}","${rec.name_en}",${getNationalityLabel(rec.nationality)},"${rec.doc_type}",${rec.expiry_date}`;
      }).join('\n');
      
      const blob = new Blob(['\uFEFF' + headers + '\n' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `expiry_alerts_${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
        
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Expired Docs - Moved to First Position */}
            <div className="bg-white p-6 rounded-lg shadow-card border-r-4 border-red-500 flex items-center justify-between">
                <div>
                    <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">المستندات المنتهية</h3>
                    <p className="text-[10px] text-slate-400 font-english uppercase">Expired Documents</p>
                    <div className="text-3xl font-black text-red-600 mt-2">{expiredRecords.length}</div>
                </div>
                <div className="size-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">gpp_bad</span>
                </div>
            </div>

            {/* Total Employees */}
            <div className="bg-white p-6 rounded-lg shadow-card border-r-4 border-blue-600 flex items-center justify-between">
                <div>
                    <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">إجمالي الموظفين</h3>
                    <p className="text-[10px] text-slate-400 font-english uppercase">Total Employees</p>
                    <div className="text-3xl font-black text-slate-800 mt-2">{employees.length}</div>
                </div>
                <div className="size-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">groups</span>
                </div>
            </div>

            {/* Total Files */}
            <div className="bg-white p-6 rounded-lg shadow-card border-r-4 border-indigo-600 flex items-center justify-between">
                <div>
                    <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">إجمالي الملفات</h3>
                    <p className="text-[10px] text-slate-400 font-english uppercase">Total Files Archived</p>
                    <div className="text-3xl font-black text-slate-800 mt-2">{fileStats.totalFiles}</div>
                </div>
                <div className="size-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">folder_zip</span>
                </div>
            </div>
            
            {/* Nationalities Count */}
            <div className="bg-white p-6 rounded-lg shadow-card border-r-4 border-teal-600 flex items-center justify-between">
                <div>
                    <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">تنوع الجنسيات</h3>
                    <p className="text-[10px] text-slate-400 font-english uppercase">Nationalities Count</p>
                    <div className="text-3xl font-black text-slate-800 mt-2">{nationalityStats.length}</div>
                </div>
                <div className="size-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">public</span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Nationality Demographics */}
            <div className="bg-white rounded-lg shadow-card border border-slate-200 overflow-hidden flex flex-col h-full">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-teal-600">pie_chart</span>
                        <h2 className="font-bold text-slate-800 text-sm">توزيع الجنسيات | Demographics</h2>
                    </div>
                </div>
                <div className="p-6 flex-1 overflow-y-auto max-h-[350px]">
                    {nationalityStats.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {nationalityStats.map((stat, idx) => (
                                <div key={idx} className="flex flex-col gap-1">
                                    <div className="flex justify-between items-end text-xs font-bold text-slate-700">
                                        <div className="flex flex-col">
                                            <span>{stat.labelAr}</span>
                                            <span className="text-[10px] font-english text-slate-400 font-normal">{stat.labelEn}</span>
                                        </div>
                                        <div className="flex items-end gap-1">
                                             <span>{stat.count}</span>
                                             <span className="text-[10px] text-slate-400 font-normal mb-0.5">({stat.percentage.toFixed(1)}%)</span>
                                        </div>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-teal-500 rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${stat.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10">
                            <span className="material-symbols-outlined text-[48px] opacity-20 mb-2">public_off</span>
                            <span className="text-xs">لا توجد بيانات متاحة</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Education Statistics (NEW) */}
            <div className="bg-white rounded-lg shadow-card border border-slate-200 overflow-hidden flex flex-col h-full">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-purple-600">school</span>
                        <h2 className="font-bold text-slate-800 text-sm">المستوى التعليمي | Education</h2>
                    </div>
                </div>
                <div className="p-6 flex-1 overflow-y-auto max-h-[350px]">
                    {educationStats.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {educationStats.map((stat, idx) => (
                                <div key={idx} className="flex flex-col gap-1">
                                    <div className="flex justify-between items-end text-xs font-bold text-slate-700">
                                        <div className="flex flex-col">
                                            <span>{stat.label.split('|')[0]}</span>
                                            <span className="text-[10px] font-english text-slate-400 font-normal">{stat.label.split('|')[1]}</span>
                                        </div>
                                        <div className="flex items-end gap-1">
                                             <span>{stat.count}</span>
                                             <span className="text-[10px] text-slate-400 font-normal mb-0.5">({stat.percentage.toFixed(1)}%)</span>
                                        </div>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-purple-500 rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${stat.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10">
                            <span className="material-symbols-outlined text-[48px] opacity-20 mb-2">school</span>
                            <span className="text-xs">لا توجد بيانات تعليمية</span>
                        </div>
                    )}
                </div>
            </div>

            {/* File Statistics & Types */}
            <div className="bg-white rounded-lg shadow-card border border-slate-200 overflow-hidden flex flex-col h-full">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-indigo-600">folder_open</span>
                        <h2 className="font-bold text-slate-800 text-sm">الأرشيف الرقمي | Digital Archive</h2>
                    </div>
                </div>
                <div className="p-6 flex flex-col gap-6">
                    
                    {/* File Types Breakdown (PDF vs Images) */}
                    <div className="flex items-center gap-4 p-4 bg-indigo-50/50 rounded-lg border border-indigo-100">
                        <div className="flex-1 flex flex-col items-center gap-2 border-l border-indigo-200 pl-4">
                             <span className="material-symbols-outlined text-red-500 text-[28px]">picture_as_pdf</span>
                             <div className="text-center">
                                 <div className="text-xl font-black text-slate-800">{fileStats.pdfCount}</div>
                                 <div className="text-[10px] text-slate-500 font-bold uppercase font-english">PDF Documents</div>
                             </div>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-2">
                             <span className="material-symbols-outlined text-blue-500 text-[28px]">image</span>
                             <div className="text-center">
                                 <div className="text-xl font-black text-slate-800">{fileStats.imageCount}</div>
                                 <div className="text-[10px] text-slate-500 font-bold uppercase font-english">Image Files</div>
                             </div>
                        </div>
                    </div>

                    {/* Detailed Categories Grid */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-500 mb-3 border-b border-slate-100 pb-2">تصنيف المرفقات | Attachment Categories</h4>
                        <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                            <div className="p-2 rounded border border-slate-100 bg-slate-50 flex flex-col items-center justify-center gap-1 hover:border-indigo-200 transition-colors">
                                <span className="material-symbols-outlined text-slate-400 text-[18px]">account_circle</span>
                                <span className="text-[9px] text-slate-600 font-bold text-center">الصور الشخصية</span>
                                <span className="text-base font-bold text-indigo-600 leading-none">{fileStats.categoryCounts.profile}</span>
                            </div>
                            <div className="p-2 rounded border border-slate-100 bg-slate-50 flex flex-col items-center justify-center gap-1 hover:border-indigo-200 transition-colors">
                                <span className="material-symbols-outlined text-slate-400 text-[18px]">menu_book</span>
                                <span className="text-[9px] text-slate-600 font-bold text-center">جوازات السفر</span>
                                <span className="text-base font-bold text-indigo-600 leading-none">{fileStats.categoryCounts.passport}</span>
                            </div>
                            <div className="p-2 rounded border border-slate-100 bg-slate-50 flex flex-col items-center justify-center gap-1 hover:border-indigo-200 transition-colors">
                                <span className="material-symbols-outlined text-slate-400 text-[18px]">badge</span>
                                <span className="text-[9px] text-slate-600 font-bold text-center">الهوية الإماراتية</span>
                                <span className="text-base font-bold text-indigo-600 leading-none">{fileStats.categoryCounts.eid}</span>
                            </div>
                             <div className="p-2 rounded border border-slate-100 bg-slate-50 flex flex-col items-center justify-center gap-1 hover:border-indigo-200 transition-colors">
                                <span className="material-symbols-outlined text-slate-400 text-[18px]">school</span>
                                <span className="text-[9px] text-slate-600 font-bold text-center">الشهادات العلمية</span>
                                <span className="text-base font-bold text-indigo-600 leading-none">{fileStats.categoryCounts.education}</span>
                            </div>
                             <div className="p-2 rounded border border-slate-100 bg-slate-50 flex flex-col items-center justify-center gap-1 hover:border-indigo-200 transition-colors">
                                <span className="material-symbols-outlined text-slate-400 text-[18px]">directions_car</span>
                                <span className="text-[9px] text-slate-600 font-bold text-center">رخص القيادة</span>
                                <span className="text-base font-bold text-indigo-600 leading-none">{fileStats.categoryCounts.license}</span>
                            </div>
                            <div className="p-2 rounded border border-slate-100 bg-slate-50 flex flex-col items-center justify-center gap-1 hover:border-indigo-200 transition-colors">
                                <span className="material-symbols-outlined text-slate-400 text-[18px]">id_card</span>
                                <span className="text-[9px] text-slate-600 font-bold text-center">الهوية الخليجية</span>
                                <span className="text-base font-bold text-indigo-600 leading-none">{fileStats.categoryCounts.gcc}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        {/* Expired Report Table */}
        <div className="bg-white rounded-lg shadow-card border border-slate-200 overflow-hidden mt-2">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500">warning</span>
                <h2 className="font-bold text-slate-800 text-sm">تنبيهات انتهاء الصلاحية | Expiry Alerts</h2>
            </div>
            
            {/* Search Bar for Expiry Alerts */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                    <input
                        type="text"
                        placeholder="بحث شامل عن السجلات (الاسم، الرقم، المستند، الجنسية)... | Search Records..."
                        className="w-full h-11 pr-10 pl-4 rounded-md border-slate-300 text-sm focus:border-red-500 focus:ring-red-500 shadow-sm"
                        value={expirySearchTerm}
                        onChange={(e) => setExpirySearchTerm(e.target.value)}
                    />
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                </div>
                <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                    <button 
                        onClick={handlePrint}
                        className="h-11 px-4 flex-1 md:flex-none rounded-md border border-slate-300 bg-white text-slate-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[20px]">print</span>
                        <span className="hidden sm:inline">طباعة القائمة</span>
                    </button>
                    <button 
                        onClick={handleExport}
                        className="h-11 px-4 flex-1 md:flex-none rounded-md border border-slate-300 bg-white text-slate-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[20px]">file_download</span>
                        <span className="hidden sm:inline">تصدير Excel</span>
                    </button>
                 </div>
            </div>

            {sortedExpiredRecords.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead>
                            <tr className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200 whitespace-nowrap">
                                {/* Sequence (Static) */}
                                <th className="px-2 py-4 text-center w-12 bg-slate-100/50">
                                    <div className="font-english mb-1">#</div>
                                    <div>م</div>
                                </th>

                                {/* ID - Sortable */}
                                <th onClick={() => handleSort('emp_id')} className="px-2 py-4 text-center cursor-pointer hover:bg-slate-100 transition-colors group select-none">
                                    <div className="flex flex-col items-center justify-center gap-1">
                                        <div className="flex items-center gap-1">
                                            <div className="font-english mb-1">ID</div>
                                            <SortIcon columnKey="emp_id" />
                                        </div>
                                        <div>الرقم الوظيفي</div>
                                    </div>
                                </th>

                                {/* Name - Sortable */}
                                <th onClick={() => handleSort('name_ar')} className="px-2 py-4 cursor-pointer hover:bg-slate-100 transition-colors group select-none">
                                    <div className="flex items-center gap-1">
                                         <div className="flex flex-col">
                                            <div className="font-english mb-1">EMPLOYEE</div>
                                            <div>الموظف</div>
                                         </div>
                                         <SortIcon columnKey="name_ar" />
                                    </div>
                                </th>

                                {/* Nationality - Sortable */}
                                <th onClick={() => handleSort('nationality')} className="px-2 py-4 text-center cursor-pointer hover:bg-slate-100 transition-colors group select-none">
                                    <div className="flex flex-col items-center justify-center gap-1">
                                        <div className="flex items-center gap-1">
                                            <div className="font-english mb-1">NATIONALITY</div>
                                            <SortIcon columnKey="nationality" />
                                        </div>
                                        <div>الجنسية</div>
                                    </div>
                                </th>

                                {/* Document Type - Sortable */}
                                <th onClick={() => handleSort('doc_type')} className="px-2 py-4 text-center cursor-pointer hover:bg-slate-100 transition-colors group select-none">
                                    <div className="flex flex-col items-center justify-center gap-1">
                                        <div className="flex items-center gap-1">
                                            <div className="font-english mb-1">DOCUMENT</div>
                                            <SortIcon columnKey="doc_type" />
                                        </div>
                                        <div>المستند المنتهي</div>
                                    </div>
                                </th>

                                {/* Expiry Date - Sortable */}
                                <th onClick={() => handleSort('expiry_date')} className="px-2 py-4 text-center cursor-pointer hover:bg-slate-100 transition-colors group select-none">
                                    <div className="flex flex-col items-center justify-center gap-1">
                                        <div className="flex items-center gap-1">
                                            <div className="font-english mb-1">EXPIRY DATE</div>
                                            <SortIcon columnKey="expiry_date" />
                                        </div>
                                        <div>تاريخ الانتهاء</div>
                                    </div>
                                </th>

                                {/* Status (Static) */}
                                <th className="px-2 py-4 text-center">
                                    <div className="font-english mb-1">STATUS</div>
                                    <div>الحالة</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {sortedExpiredRecords.map((record, idx) => (
                                <tr key={idx} className="hover:bg-red-50/30 transition-colors whitespace-nowrap">
                                    <td className="px-2 py-4 text-center font-bold text-slate-400 text-xs bg-slate-50/30">
                                        {idx + 1}
                                    </td>
                                    <td className="px-2 py-4 text-center">
                                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 font-bold text-[11px] border border-slate-200 font-english" dir="ltr">
                                            {record.emp_id}
                                        </span>
                                    </td>
                                    <td className="px-2 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-9 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                                                {record.profile_picture ? (
                                                    <img src={URL.createObjectURL(record.profile_picture)} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="material-symbols-outlined text-slate-400 text-[20px]">person</span>
                                                )}
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <div className="font-bold text-slate-900 text-sm leading-tight mb-0.5">{record.name_ar}</div>
                                                <div className="text-[10px] text-slate-500 font-english font-medium tracking-wide leading-none">{record.name_en}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-2 py-4 text-center">
                                         <div className="flex flex-col items-center justify-center">
                                            <span className="font-bold text-slate-800 text-sm leading-tight mb-0.5">
                                                {getNationalityLabel(record.nationality)}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-english font-medium">
                                                {getEnglishNationalityLabel(record.nationality)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-2 py-4 text-center">
                                        <div className="inline-flex flex-col items-center justify-center px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 min-w-[100px]">
                                            <span className="text-xs font-bold text-slate-800 leading-tight">
                                                {record.doc_type.split('|')[0]}
                                            </span>
                                            <span className="text-[10px] text-slate-500 font-english leading-tight">
                                                {record.doc_type.split('|')[1] || ''}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-2 py-4 text-center font-english font-bold text-red-600 text-sm" dir="ltr">
                                        {new Date(record.expiry_date).toLocaleDateString('en-GB')}
                                    </td>
                                    <td className="px-2 py-4 text-center">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                                            <span className="material-symbols-outlined text-[14px]">error</span>
                                            <div className="flex flex-col leading-none items-start">
                                                <span>منتهي</span>
                                                <span className="font-english text-[9px]">Expired</span>
                                            </div>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                    {expiredRecords.length === 0 ? (
                        <>
                            <span className="material-symbols-outlined text-[64px] text-emerald-100 mb-4">check_circle</span>
                            <p className="text-lg font-bold text-slate-600">جميع المستندات سارية الصلاحية</p>
                            <p className="font-english text-slate-400">All documents are valid</p>
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-[64px] text-slate-200 mb-4">search_off</span>
                            <p className="text-lg font-bold text-slate-600">لا توجد نتائج مطابقة</p>
                            <p className="font-english text-slate-400">No matching records found</p>
                        </>
                    )}
                </div>
            )}
        </div>
    </div>
  );
};

export default Reports;