import React, { useState } from 'react';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-subtle bg-surface-white/80 backdrop-blur-md shadow-sm">
      <div className="px-4 md:px-10 py-4 flex items-center justify-between whitespace-nowrap">
        {/* Logo Area */}
        <div className="flex items-center gap-4 text-text-main">
          <div className="size-10 flex items-center justify-center rounded-xl bg-blue-50 text-primary border border-blue-100 shadow-sm">
            <span className="material-symbols-outlined text-[24px]">badge</span>
          </div>
          <div>
            <h2 className="text-lg font-extrabold leading-tight text-slate-900">
              نظام معلومات الموظفين | Employee Information System
            </h2>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex flex-1 justify-end gap-8 items-center">
          <nav className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-100">
            <a
              href="/"
              className="flex items-center gap-2 text-primary font-bold bg-white shadow-sm px-5 py-2 rounded-md text-sm leading-normal ring-1 ring-slate-200 cursor-pointer transition-all hover:shadow-md"
            >
              <span className="material-symbols-outlined text-[20px]">home</span>
              <span>الرئيسية | Home</span>
            </a>
            <a
              href="#"
              className="text-slate-600 hover:text-primary hover:bg-white px-5 py-2 rounded-md text-sm font-semibold transition-all"
            >
              بيانات الموظفين | Employees Data
            </a>
            <a
              href="#"
              className="text-slate-600 hover:text-primary hover:bg-white px-5 py-2 rounded-md text-sm font-semibold transition-all"
            >
              التقارير | Reports
            </a>
          </nav>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden flex size-10 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 shadow-sm hover:bg-slate-50 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white/95 backdrop-blur-lg absolute top-full left-0 w-full shadow-lg p-4 flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200">
           <a
              href="/"
              className="flex items-center gap-3 text-primary font-bold bg-blue-50/50 px-4 py-3 rounded-lg text-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="material-symbols-outlined text-[20px]">home</span>
              <span>الرئيسية | Home</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 text-slate-600 hover:text-primary hover:bg-slate-50 px-4 py-3 rounded-lg text-sm font-semibold transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="material-symbols-outlined text-[20px]">group</span>
              بيانات الموظفين | Employees Data
            </a>
            <a
              href="#"
              className="flex items-center gap-3 text-slate-600 hover:text-primary hover:bg-slate-50 px-4 py-3 rounded-lg text-sm font-semibold transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="material-symbols-outlined text-[20px]">bar_chart</span>
              التقارير | Reports
            </a>
        </div>
      )}
    </header>
  );
};

export default Header;