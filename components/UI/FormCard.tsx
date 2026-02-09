import React from 'react';

interface FormCardProps {
  title: string;
  subtitle: string;
  icon: string;
  iconBgClass: string;
  iconColorClass: string;
  children: React.ReactNode;
  headerContent?: React.ReactNode;
}

const FormCard: React.FC<FormCardProps> = ({
  title,
  subtitle,
  icon,
  iconBgClass,
  iconColorClass,
  children,
  headerContent
}) => {
  return (
    <div className="bg-surface-white rounded-2xl shadow-card p-1">
      <div className="border-b border-slate-100 px-6 sm:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`size-10 rounded-full flex items-center justify-center ${iconBgClass} ${iconColorClass}`}
          >
            <span className="material-symbols-outlined">{icon}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            <p className="text-sm text-slate-400 mt-1 font-medium">{subtitle}</p>
          </div>
        </div>
        {headerContent && (
           <div className="self-center sm:self-auto mt-2 sm:mt-0">
             {headerContent}
           </div>
        )}
      </div>
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {children}
      </div>
    </div>
  );
};

export default FormCard;