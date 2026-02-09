import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full bg-slate-900 border-t border-slate-800 text-slate-300 py-10 relative overflow-hidden font-sans print:hidden">
      {/* Decorative Top Line matching Header accent */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
        
        {/* Copyright Section */}
        <div className="text-center md:text-start flex flex-col gap-1">
             <p className="font-bold text-white text-sm">
              جميع الحقوق محفوظة {currentYear} ©
            </p>
        </div>
       
        {/* Links Section */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm">
          <a href="#" className="text-slate-400 hover:text-white transition-colors font-semibold flex items-center gap-1 group">
             <span className="group-hover:translate-y-px transition-transform">الدعم الفني</span>
             <span className="text-slate-600">|</span>
             <span className="font-english text-xs uppercase tracking-wider group-hover:translate-y-px transition-transform">Support</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;