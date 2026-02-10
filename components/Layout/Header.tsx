import React, { useState } from 'react';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="w-full flex flex-col shadow-sm font-sans z-50 relative">
      {/* Top Department Bar - Dark Blue Background */}
      <div className="bg-slate-900 text-white py-4 px-4 md:px-8 border-b border-slate-700 shadow-sm relative overflow-hidden">
        <div className="container mx-auto relative flex flex-col md:flex-row items-center justify-center">
          
          {/* Logo / Brand Name - Absolute Right on Desktop (Start in RTL) */}
          <div className="md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 mb-6 md:mb-0 flex items-center order-1 md:order-none z-20">
             <div className="flex items-center gap-3 group select-none hover:opacity-95 transition-opacity cursor-default">
              {/* Icon Container - White bg for contrast */}
              <div className="relative flex items-center justify-center size-12 rounded-xl bg-white border border-blue-100 shadow-sm transition-all group-hover:shadow-md group-hover:border-blue-200">
                <span className="material-symbols-outlined text-[32px] text-slate-900 drop-shadow-sm">traffic</span>
                <div className="absolute -bottom-1 -right-1 size-4 bg-blue-500 rounded-full flex items-center justify-center border border-slate-900">
                    <div className="size-1.5 rounded-full bg-white animate-pulse"></div>
                </div>
              </div>
              
              {/* Text Container */}
              <div className="flex flex-col items-start justify-center">
                <h1 className="text-2xl font-black tracking-wider text-white uppercase font-english leading-[0.9]">
                  SAAED
                </h1>
                <div className="w-full h-px bg-gradient-to-r from-blue-400/50 to-transparent my-1"></div>
                <span className="text-[0.65rem] font-bold tracking-[0.2em] text-blue-200 uppercase font-english leading-none">
                  For Traffic Systems
                </span>
              </div>
            </div>
          </div>

          {/* Center Department Info */}
          <div className="flex flex-col items-center justify-center gap-1 text-center z-10 order-2 md:order-none">
            <div className="text-lg md:text-2xl font-extrabold tracking-wider text-white drop-shadow-sm">ادارة الموارد البشرية</div>
            <div className="text-base md:text-lg font-semibold text-blue-200">قسم شؤون الموظفين</div>
          </div>

          {/* Contact Us - Absolute Left on Desktop (End in RTL) */}
          <div className="md:absolute md:left-0 md:top-1/2 md:-translate-y-1/2 mt-6 md:mt-0 flex items-center order-3 md:order-none z-20">
            <button className="group relative flex items-center gap-3 pl-1 pr-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 hover:bg-slate-800 transition-all cursor-pointer">
              <div className="size-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-white text-[20px]">headset_mic</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs font-bold text-white leading-none group-hover:text-blue-100 transition-colors">تواصل معنا</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-english leading-none mt-1 group-hover:text-blue-300 transition-colors">Contact Us</span>
              </div>
            </button>
          </div>

        </div>
      </div>

      <div className="w-full border-b border-blue-100/50 bg-white/95 backdrop-blur-md">
        <div className="px-4 md:px-10 py-4 flex items-center justify-between whitespace-nowrap">
          {/* Logo Area */}
          <div className="flex items-center gap-4 text-text-main">
            <div className="size-10 flex items-center justify-center rounded-xl bg-white text-blue-600 border border-blue-100 shadow-sm">
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
            <nav className="flex items-center gap-2 bg-white/60 p-1 rounded-lg border border-blue-100/50">
              <a
                href="/"
                className="flex items-center gap-2 text-blue-700 font-bold bg-white shadow-sm px-5 py-2 rounded-md text-sm leading-normal ring-1 ring-blue-100 cursor-pointer transition-all hover:shadow-md hover:text-blue-800"
              >
                <span className="material-symbols-outlined text-[20px]">home</span>
                <span>الرئيسية | Home</span>
              </a>
              <a
                href="#"
                className="text-slate-600 hover:text-blue-700 hover:bg-white px-5 py-2 rounded-md text-sm font-semibold transition-all"
              >
                بيانات الموظفين | Employees Data
              </a>
              <a
                href="#"
                className="text-slate-600 hover:text-blue-700 hover:bg-white px-5 py-2 rounded-md text-sm font-semibold transition-all"
              >
                التقارير | Reports
              </a>
            </nav>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden flex size-10 items-center justify-center rounded-lg bg-white border border-blue-200 text-slate-600 shadow-sm hover:bg-blue-50 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-blue-100 bg-white/95 backdrop-blur-lg absolute top-full left-0 w-full shadow-lg p-4 flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200">
             <a
                href="/"
                className="flex items-center gap-3 text-blue-700 font-bold bg-blue-50 px-4 py-3 rounded-lg text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="material-symbols-outlined text-[20px]">home</span>
                <span>الرئيسية | Home</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 text-slate-600 hover:text-blue-700 hover:bg-blue-50/50 px-4 py-3 rounded-lg text-sm font-semibold transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="material-symbols-outlined text-[20px]">group</span>
                بيانات الموظفين | Employees Data
              </a>
              <a
                href="#"
                className="flex items-center gap-3 text-slate-600 hover:text-blue-700 hover:bg-blue-50/50 px-4 py-3 rounded-lg text-sm font-semibold transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="material-symbols-outlined text-[20px]">bar_chart</span>
                التقارير | Reports
              </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;