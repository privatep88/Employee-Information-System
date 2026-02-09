import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-12 py-10 border-t border-slate-200 bg-white">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 gap-6">
        <p className="font-semibold text-slate-600">
          © 2024 HR Integrated Management System. All Rights Reserved.
        </p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-primary transition-colors hover:underline font-bold">
            سياسة الخصوصية | Privacy Policy
          </a>
          <a href="#" className="hover:text-primary transition-colors hover:underline font-bold">
            شروط الاستخدام | Terms of Use
          </a>
          <a href="#" className="hover:text-primary transition-colors hover:underline font-bold">
            مركز الدعم | Support Center
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;