import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map(toast => {
        let bgStyle = 'bg-[#1C1E19] border-[#353830] text-[#F4F4EC]';
        let icon = <Info className="w-5 h-5 text-[#B7FF00] shrink-0" />;

        if (toast.type === 'success') {
          bgStyle = 'bg-[#1C1E19] border-[#B7FF00]/50 text-[#F4F4EC] shadow-[0_0_15px_rgba(183,255,0,0.15)]';
          icon = <CheckCircle2 className="w-5 h-5 text-[#B7FF00] shrink-0" />;
        } else if (toast.type === 'error') {
          bgStyle = 'bg-[#1C1E19] border-red-500/50 text-[#F4F4EC] shadow-[0_0_15px_rgba(255,77,77,0.15)]';
          icon = <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-md shadow-xl transition-all duration-300 animate-slideUp ${bgStyle}`}
          >
            {icon}
            <div className="flex-1 text-sm font-medium leading-snug">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#9A9D91] hover:text-[#F4F4EC] p-0.5 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
