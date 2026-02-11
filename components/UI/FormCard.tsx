import React, { createContext, useContext } from 'react';

// Define the shape of our theme context
interface FormCardTheme {
  inputFocusClass: string;
  fileActiveBorder: string;
  fileActiveBg: string;
  fileIconBg: string;
  fileText: string;
}

// Default theme (fallback to primary blue)
const defaultTheme: FormCardTheme = {
  inputFocusClass: "focus:border-primary focus:ring-primary",
  fileActiveBorder: "border-primary",
  fileActiveBg: "bg-blue-50/50",
  fileIconBg: "bg-primary",
  fileText: "text-primary"
};

export const FormCardContext = createContext<FormCardTheme>(defaultTheme);

// Hook for child components to easily consume the theme
export const useFormCardTheme = () => useContext(FormCardContext);

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
  // 1. Determine the border accent color and title text color based on the icon color class
  let cardBorderColorClass = "border-primary";
  let titleTextColorClass = "text-[#163a6e]"; // Default to Dark Official Navy

  if (iconColorClass.includes("secondary") || iconColorClass.includes("emerald")) {
    cardBorderColorClass = "border-secondary";
    titleTextColorClass = "text-[#0d5f51]"; // Dark Emerald
  } 
  else if (iconColorClass.includes("purple")) {
    cardBorderColorClass = "border-purple-600";
    titleTextColorClass = "text-purple-900";
  } 
  else if (iconColorClass.includes("amber")) {
    cardBorderColorClass = "border-amber-600";
    titleTextColorClass = "text-amber-900";
  } 
  else if (iconColorClass.includes("rose") || iconColorClass.includes("red")) {
    cardBorderColorClass = "border-rose-600";
    titleTextColorClass = "text-rose-900";
  } 
  else if (iconColorClass.includes("indigo")) {
    cardBorderColorClass = "border-indigo-600";
    titleTextColorClass = "text-indigo-900";
  } 
  else if (iconColorClass.includes("blue") && !iconColorClass.includes("primary")) {
    cardBorderColorClass = "border-blue-600";
    titleTextColorClass = "text-blue-900";
  }

  if (borderColor) {
    cardBorderColorClass = borderColor;
  }

  // 2. Determine the Theme for Inputs (Focus states) based on the icon color
  let theme: FormCardTheme = { ...defaultTheme };

  if (iconColorClass.includes("secondary") || iconColorClass.includes("emerald")) {
    theme = {
      inputFocusClass: "focus:border-secondary focus:ring-secondary",
      fileActiveBorder: "border-secondary",
      fileActiveBg: "bg-emerald-50/50",
      fileIconBg: "bg-secondary",
      fileText: "text-secondary"
    };
  } else if (iconColorClass.includes("purple")) {
    theme = {
      inputFocusClass: "focus:border-purple-600 focus:ring-purple-600",
      fileActiveBorder: "border-purple-600",
      fileActiveBg: "bg-purple-50/50",
      fileIconBg: "bg-purple-600",
      fileText: "text-purple-700"
    };
  } else if (iconColorClass.includes("amber")) {
    theme = {
      inputFocusClass: "focus:border-amber-600 focus:ring-amber-600",
      fileActiveBorder: "border-amber-600",
      fileActiveBg: "bg-amber-50/50",
      fileIconBg: "bg-amber-600",
      fileText: "text-amber-700"
    };
  } else if (iconColorClass.includes("rose") || iconColorClass.includes("red")) {
    theme = {
      inputFocusClass: "focus:border-rose-600 focus:ring-rose-600",
      fileActiveBorder: "border-rose-600",
      fileActiveBg: "bg-rose-50/50",
      fileIconBg: "bg-rose-600",
      fileText: "text-rose-700"
    };
  } else if (iconColorClass.includes("indigo")) {
    theme = {
      inputFocusClass: "focus:border-indigo-600 focus:ring-indigo-600",
      fileActiveBorder: "border-indigo-600",
      fileActiveBg: "bg-indigo-50/50",
      fileIconBg: "bg-indigo-600",
      fileText: "text-indigo-600"
    };
  }

  // Background logic
  const containerBg = "bg-surface-white";
  const contentBg = "bg-white";
  const headerBg = bgClass ? `${bgClass} border-slate-200` : "bg-slate-50/50 border-slate-100";

  return (
    <FormCardContext.Provider value={theme}>
      <div className={`${containerBg} rounded-card shadow-card hover:shadow-elevated transition-shadow duration-300 border-t-4 ${cardBorderColorClass} flex flex-col`}>
        {/* Header Section */}
        <div className={`px-6 py-5 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${headerBg}`}>
          <div className="flex items-center gap-4">
            <div
              className={`size-11 rounded-lg flex items-center justify-center border border-slate-100 shadow-sm bg-white ${iconColorClass}`}
            >
              <span className="material-symbols-outlined text-[24px]">{icon}</span>
            </div>
            <div>
              <h2 className={`text-lg font-bold leading-snug ${titleTextColorClass}`}>{title}</h2>
              <p className="text-xs text-[#7688a3] font-medium">{subtitle}</p>
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
    </FormCardContext.Provider>
  );
};

export default FormCard;