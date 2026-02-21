import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
        className="mt-auto w-full border-t border-blue-900/30 text-slate-300 py-3 relative overflow-hidden font-sans print:hidden"
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
      {/* Decorative Top Line matching Header accent */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

      {/* Transparent Stars Overlay */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(white 1px, transparent 1px), radial-gradient(white 1.5px, transparent 1.5px)',
          backgroundSize: '50px 50px, 90px 90px',
          backgroundPosition: '0 0, 25px 25px'
      }}></div>

      {/* Transparent Geometric Shapes (Hexagons) Overlay */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L56 15 V45 L30 60 L4 45 V15 Z' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
      }}></div>

      {/* Subtle Glow Orbs for visual depth */}
      <div className="absolute top-[-50%] left-[20%] w-64 h-64 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none"></div>
      <div className="absolute bottom-[-50%] right-[10%] w-80 h-80 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
        
        {/* Copyright Section */}
        <div className="text-center md:text-start flex flex-col gap-1 md:w-1/3">
             <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-blue-400">copyright</span>
                <p className="font-bold text-white text-xs">
                  جميع الحقوق محفوظة {currentYear}
                </p>
             </div>
        </div>

        {/* Center Credits */}
        <div className="flex flex-col items-center justify-center text-center md:w-1/3 order-3 md:order-2">
            <p className="text-xs font-bold text-blue-100">إعداد / صالح دحمان</p>
            <p className="text-[10px] text-slate-500">رئيس قسم شؤون الموظفين</p>
        </div>
       
        {/* Links Section */}
        <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-8 text-xs md:w-1/3 order-2 md:order-3">
          <div className="text-white font-semibold flex items-center gap-2">
             <span className="material-symbols-outlined text-[18px] text-blue-400">headset_mic</span>
             <div className="flex items-center gap-1">
                <span>الدعم الفني</span>
                <span className="text-slate-600 mx-1">|</span>
                <span className="font-english text-[10px] uppercase tracking-wider">Support</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;