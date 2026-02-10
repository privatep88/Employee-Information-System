import React, { useState } from 'react';

interface HeaderProps {
  activeTab?: 'home' | 'data';
  onTabChange?: (tab: 'home' | 'data') => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab = 'home', onTabChange = (_: 'home' | 'data') => {} }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: 'home' | 'data') => {
    onTabChange(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="w-full flex flex-col shadow-md font-sans z-50 relative bg-white">
      {/* Top Department Bar - Institutional Navy Blue */}
      <div className="bg-[#1e293b] text-white py-3 px-4 md:px-8 border-b border-slate-600 relative overflow-hidden">
        <div className="container mx-auto relative flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo / Brand Name - Right (Start in RTL) */}
          <div className="flex items-center gap-3 select-none order-1">
              <div className="relative flex items-center justify-center size-10 rounded bg-white border border-slate-200 shadow-sm">
                <span className="material-symbols-outlined text-[24px] text-primary">traffic</span>
              </div>
              <div className="flex flex-col items-start justify-center">
                <h1 className="text-xl font-bold tracking-wide text-white uppercase font-english leading-none">
                  SAAED
                </h1>
                <span className="text-[10px] tracking-widest text-slate-300 uppercase font-english mt-0.5">
                  Traffic Systems
                </span>
              </div>
          </div>

          {/* Center Department Info */}
          <div className="flex flex-col items-center justify-center text-center order-2">
            <div className="text-base md:text-lg font-bold text-white leading-tight">ادارة الموارد البشرية</div>
            <div className="text-xs md:text-sm font-medium text-slate-300">قسم شؤون الموظفين</div>
          </div>

          {/* Contact Us - Left (End in RTL) */}
          <div className="flex items-center order-3">
            <button className="group flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-all cursor-pointer shadow-sm">
              <div className="size-6 rounded-full bg-white flex items-center justify-center">
                <span className="material-symbols-outlined text-black text-[16px]">support_agent</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs font-bold text-white leading-none">تواصل معنا</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-300 font-english leading-none mt-0.5">Contact Us</span>
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* Secondary Navigation Bar - Clean White with Bottom Border */}
      <div className="w-full bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 md:px-8 py-3 flex items-center justify-between whitespace-nowrap">
          {/* System Title */}
          <div className="flex items-center gap-3 text-text-main">
            <div className="w-1 h-8 bg-primary rounded-full"></div>
            <div>
              <h2 className="text-lg font-bold leading-tight text-slate-800">
                نظام معلومات الموظفين <span className="hidden sm:inline text-slate-400 mx-2">|</span> <span className="block sm:inline font-english text-base font-medium text-slate-600">Employee Information System</span>
              </h2>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex flex-1 justify-end gap-2 items-center">
              <button
                onClick={() => handleNavClick('home')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'home' ? 'text-white bg-primary shadow-sm hover:bg-primary-hover' : 'text-slate-600 hover:text-primary hover:bg-slate-50'}`}
              >
                <span className="material-symbols-outlined text-[18px]">home</span>
                <span>الرئيسية</span>
              </button>
              <button
                onClick={() => handleNavClick('data')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'data' ? 'text-white bg-primary shadow-sm hover:bg-primary-hover' : 'text-slate-600 hover:text-primary hover:bg-slate-50'}`}
              >
                <span className="material-symbols-outlined text-[18px]">group</span>
                <span>بيانات الموظفين</span>
              </button>
              <button
                className="flex items-center gap-2 text-slate-600 hover:text-primary hover:bg-slate-50 px-4 py-2 rounded-md text-sm font-semibold transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">bar_chart</span>
                <span>التقارير</span>
              </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden flex size-9 items-center justify-center rounded bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200 transition-all"
          >
            <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white absolute top-full left-0 w-full shadow-lg p-2 flex flex-col gap-1 z-40">
             <button
                onClick={() => handleNavClick('home')}
                className={`flex items-center gap-3 w-full text-right px-4 py-3 rounded text-sm font-bold ${activeTab === 'home' ? 'text-primary bg-blue-50' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <span className="material-symbols-outlined text-[20px]">home</span>
                <span>الرئيسية</span>
              </button>
              <button
                onClick={() => handleNavClick('data')}
                className={`flex items-center gap-3 w-full text-right px-4 py-3 rounded text-sm font-bold ${activeTab === 'data' ? 'text-primary bg-blue-50' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <span className="material-symbols-outlined text-[20px]">group</span>
                <span>بيانات الموظفين</span>
              </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;