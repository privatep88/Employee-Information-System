import React, { useState } from 'react';

interface HeaderProps {
  activeTab?: 'home' | 'data' | 'reports' | 'archive';
  onTabChange?: (tab: 'home' | 'data' | 'reports' | 'archive') => void;
  expiredCount?: number;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab = 'home', onTabChange = (_tab) => {}, expiredCount = 0, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: 'home' | 'data' | 'reports' | 'archive') => {
    onTabChange(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="w-full flex flex-col shadow-md font-sans z-50 relative bg-white">
      {/* Top Department Bar - Artistic Dark Blue Geometric Theme */}
      <div 
        className="text-white py-3 px-4 md:px-8 border-b border-blue-900/30 relative overflow-hidden transition-all duration-500"
        style={{
            backgroundColor: '#020617', // Deep Dark Navy
            backgroundImage: `
                radial-gradient(circle at 50% -20%, #172554 0%, #020617 80%),
                
                /* Abstract Geometric Shapes (Triangles/Polygons) */
                linear-gradient(30deg, rgba(255,255,255,0.02) 0%, transparent 40%),
                linear-gradient(-30deg, rgba(255,255,255,0.02) 0%, transparent 40%),
                
                /* Decorative Pattern: Intersecting Circles/Arcs */
                radial-gradient(circle at 0% 50%, rgba(255,255,255,0.03) 0%, transparent 20%),
                radial-gradient(circle at 100% 50%, rgba(255,255,255,0.03) 0%, transparent 20%),
                
                /* Geometric Grid with Rotation (Diamond/Rhombus feel) */
                repeating-linear-gradient(45deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 30px),
                repeating-linear-gradient(-45deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 30px)
            `,
            backgroundSize: '100% 100%, 100% 100%, 100% 100%, 50% 100%, 50% 100%, 100% 100%, 100% 100%'
        }}
      >
        <div className="container mx-auto relative flex flex-col md:flex-row items-center justify-between gap-4 z-10">
          
          {/* Logo / Brand Name - Right (Start in RTL) */}
          <div className="flex items-center gap-3 select-none order-1">
              <div className="relative flex items-center justify-center size-10 rounded bg-white/10 border border-white/20 shadow-sm backdrop-blur-sm">
                <span className="material-symbols-outlined text-[24px] text-blue-100">traffic</span>
              </div>
              <div className="flex flex-col items-start justify-center">
                <h1 className="text-xl font-bold tracking-wide text-white uppercase font-english leading-none drop-shadow-sm">
                  SMART
                </h1>
                <span className="text-[10px] tracking-widest text-blue-200 uppercase font-english mt-0.5 opacity-90">
                  SERVICES SYSTEM
                </span>
              </div>
          </div>

          {/* Center Department Info */}
          <div className="flex flex-col items-center justify-center text-center order-2">
            <div className="text-base md:text-lg font-bold text-white leading-tight drop-shadow-md">ادارة الموارد البشرية</div>
            <div className="text-xs md:text-sm font-medium text-blue-200/80">قسم شؤون الموظفين</div>
          </div>

          {/* Contact Us & Logout - Left (End in RTL) */}
          <div className="flex items-center gap-3 order-3">
            {onLogout && (
              <button 
                onClick={onLogout}
                className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer shadow-sm backdrop-blur-sm"
                title="تسجيل الخروج"
              >
                <div className="size-6 rounded-full bg-white/10 border border-white/10 flex items-center justify-center group-hover:bg-red-500/80 group-hover:border-red-500 transition-colors">
                  <span className="material-symbols-outlined text-white text-[16px]">power_settings_new</span>
                </div>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-xs font-bold text-white leading-none">خروج</span>
                  <span className="text-[9px] uppercase tracking-wider text-blue-200 font-english leading-none mt-0.5 opacity-80">Logout</span>
                </div>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Secondary Navigation Bar - Elegant Light Blue Theme */}
      <div className="w-full bg-blue-50 border-b border-blue-200">
        <div className="container mx-auto px-4 md:px-8 py-3 flex items-center justify-between whitespace-nowrap">
          {/* System Title */}
          <div className="flex items-center gap-3 text-text-main">
            <span className="material-symbols-outlined text-[#163a6e] text-[32px]">assignment_ind</span>
            <div>
              <h2 className="text-lg font-bold leading-tight text-[#163a6e]">
                نظام معلومات الموظفين <span className="hidden sm:inline text-[#163a6e] opacity-50 mx-2">|</span> <span className="block sm:inline font-english text-base font-medium text-[#163a6e]">Employee Information System</span>
              </h2>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex flex-1 justify-end gap-2 items-center">
              <button
                onClick={() => handleNavClick('home')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'home' ? 'text-white bg-primary shadow-sm hover:bg-primary-hover' : 'text-slate-600 hover:text-primary hover:bg-blue-100'}`}
              >
                <span className="material-symbols-outlined text-[18px]">home</span>
                <span>الرئيسية</span>
              </button>
              <button
                onClick={() => handleNavClick('data')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'data' ? 'text-white bg-primary shadow-sm hover:bg-primary-hover' : 'text-slate-600 hover:text-primary hover:bg-blue-100'}`}
              >
                <span className="material-symbols-outlined text-[18px]">group</span>
                <span>بيانات الموظفين</span>
              </button>
              <button
                onClick={() => handleNavClick('reports')}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'reports' ? 'text-white bg-primary shadow-sm hover:bg-primary-hover' : 'text-slate-600 hover:text-primary hover:bg-blue-100'}`}
              >
                <span className="material-symbols-outlined text-[18px]">bar_chart</span>
                <span>التقارير</span>
                {expiredCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] text-white ring-2 ring-white animate-pulse">
                    {expiredCount > 99 ? '99+' : expiredCount}
                  </span>
                )}
              </button>
              {/* Archive Tab */}
              <button
                onClick={() => handleNavClick('archive')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'archive' ? 'text-white bg-slate-600 shadow-sm hover:bg-slate-700' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200'}`}
              >
                <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                <span>الأرشيف</span>
              </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden flex size-9 items-center justify-center rounded bg-white border border-blue-200 text-slate-600 hover:bg-blue-100 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-blue-200 bg-blue-50 absolute top-full left-0 w-full shadow-lg p-2 flex flex-col gap-1 z-40">
             <button
                onClick={() => handleNavClick('home')}
                className={`flex items-center gap-3 w-full text-right px-4 py-3 rounded text-sm font-bold ${activeTab === 'home' ? 'text-primary bg-blue-100' : 'text-slate-700 hover:bg-blue-100'}`}
              >
                <span className="material-symbols-outlined text-[20px]">home</span>
                <span>الرئيسية</span>
              </button>
              <button
                onClick={() => handleNavClick('data')}
                className={`flex items-center gap-3 w-full text-right px-4 py-3 rounded text-sm font-bold ${activeTab === 'data' ? 'text-primary bg-blue-100' : 'text-slate-700 hover:bg-blue-100'}`}
              >
                <span className="material-symbols-outlined text-[20px]">group</span>
                <span>بيانات الموظفين</span>
              </button>
              <button
                onClick={() => handleNavClick('reports')}
                className={`flex items-center gap-3 w-full text-right px-4 py-3 rounded text-sm font-bold justify-between ${activeTab === 'reports' ? 'text-primary bg-blue-100' : 'text-slate-700 hover:bg-blue-100'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px]">bar_chart</span>
                  <span>التقارير</span>
                </div>
                {expiredCount > 0 && (
                  <span className="flex h-5 min-w-[1.25rem] px-1.5 items-center justify-center rounded-full bg-red-600 text-[10px] text-white">
                    {expiredCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleNavClick('archive')}
                className={`flex items-center gap-3 w-full text-right px-4 py-3 rounded text-sm font-bold ${activeTab === 'archive' ? 'text-slate-800 bg-slate-200' : 'text-slate-700 hover:bg-blue-100'}`}
              >
                <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                <span>الأرشيف</span>
              </button>
              
              {onLogout && (
                 <button
                    onClick={onLogout}
                    className="flex items-center gap-3 w-full text-right px-4 py-3 rounded text-sm font-bold text-red-600 hover:bg-red-50 mt-1 border-t border-slate-200"
                  >
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                    <span>تسجيل الخروج</span>
                  </button>
              )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;