import React from 'react';

interface FormCardProps {
  title: string;
  subtitle: string;
  icon: string;
  iconBgClass: string;
  iconColorClass: string;
  children: React.ReactNode;
  headerContent?: React.ReactNode;
  bgClass?: string;
  borderColor?: string;
}

const FormCard: React.FC<FormCardProps> = ({
  title,
  subtitle,
  icon,
  iconBgClass,
  iconColorClass,
  children,
  headerContent,
  bgClass,
  borderColor
}) => {
  // Extract color class for the top border accent based on the icon color or default to primary
  // This is a simple visual mapping for the "Official" look
  let borderColorClass = "border-primary";
  if (iconColorClass.includes("emerald") || iconColorClass.includes("green")) borderColorClass = "border-secondary";
  if (iconColorClass.includes("purple")) borderColorClass = "border-purple-600";
  if (iconColorClass.includes("amber")) borderColorClass = "border-amber-600";
  if (iconColorClass.includes("rose") || iconColorClass.includes("red")) borderColorClass = "border-rose-600";
  if (iconColorClass.includes("indigo")) borderColorClass = "border-indigo-600";
  if (iconColorClass.includes("blue") && !iconColorClass.includes("primary")) borderColorClass = "border-blue-600";

  // Override
  if (borderColor) {
    borderColorClass = borderColor;
  }

  // Background logic
  // If bgClass is provided (e.g. bg-indigo-50), apply it to the Header.
  // The content area remains white for better readability of inputs.
  const containerBg = "bg-surface-white";
  const contentBg = "bg-white";
  const headerBg = bgClass ? `${bgClass} border-slate-200` : "bg-slate-50/50 border-slate-100";

  return (
    <div className={`${containerBg} rounded-card shadow-card hover:shadow-elevated transition-shadow duration-300 border-t-4 ${borderColorClass} flex flex-col`}>
      {/* Header Section */}
      <div className={`px-6 py-5 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${headerBg}`}>
        <div className="flex items-center gap-4">
          <div
            className={`size-11 rounded-lg flex items-center justify-center border border-slate-100 shadow-sm bg-white ${iconColorClass}`}
          >
            <span className="material-symbols-outlined text-[24px]">{icon}</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 leading-snug">{title}</h2>
            <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
          </div>
        </div>
        {headerContent && (
           <div className="self-center sm:self-auto mt-2 sm:mt-0">
             {headerContent}
           </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className={`p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 rounded-b-card ${contentBg}`}>
        {children}
      </div>
    </div>
  );
};

export default FormCard;