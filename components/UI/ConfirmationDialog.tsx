import React from 'react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  icon?: string;
  variant?: 'info' | 'success' | 'warning' | 'error' | 'primary';
  showCancel?: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "نعم، متابعة | Yes, Proceed",
  cancelLabel = "إلغاء | Cancel",
  icon = "help",
  variant = 'info',
  showCancel = true
}) => {
  if (!isOpen) return null;

  const styles = {
    info: {
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      buttonBg: 'bg-blue-600 hover:bg-blue-700',
      barColor: 'bg-blue-500'
    },
    success: {
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
      buttonBg: 'bg-green-600 hover:bg-green-700',
      barColor: 'bg-green-500'
    },
    warning: {
        iconBg: 'bg-amber-50',
        iconColor: 'text-amber-600',
        buttonBg: 'bg-amber-600 hover:bg-amber-700',
        barColor: 'bg-amber-500'
    },
    error: {
        iconBg: 'bg-red-50',
        iconColor: 'text-red-600',
        buttonBg: 'bg-red-600 hover:bg-red-700',
        barColor: 'bg-red-500'
    },
    primary: {
        iconBg: 'bg-blue-50',
        iconColor: 'text-primary',
        buttonBg: 'bg-primary hover:bg-primary-hover',
        barColor: 'bg-primary'
    }
  }[variant];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={showCancel ? onClose : undefined}
      ></div>

      {/* Dialog Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Top Accent Bar */}
        <div className={`h-1.5 w-full shrink-0 ${styles.barColor}`}></div>

        <div className="p-8 flex flex-col items-center text-center overflow-y-auto">
            {/* Icon */}
            <div className={`size-16 rounded-2xl ${styles.iconBg} ${styles.iconColor} flex items-center justify-center mb-6 shadow-sm ring-4 ring-white shrink-0`}>
                <span className="material-symbols-outlined text-[36px]">{icon}</span>
            </div>

            {/* Content */}
            <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight">{title}</h3>
            <div className="text-slate-500 font-medium leading-relaxed mb-8 text-base w-full">
                {message}
            </div>

            {/* Actions */}
            <div className={`grid gap-3 w-full shrink-0 ${showCancel ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {showCancel && (
                  <button
                      onClick={onClose}
                      className="h-12 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
                  >
                      {cancelLabel}
                  </button>
                )}
                <button
                    onClick={onConfirm}
                    className={`h-12 rounded-xl text-white font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 ${styles.buttonBg}`}
                >
                    <span>{confirmLabel}</span>
                    {!showCancel && variant !== 'error' && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;