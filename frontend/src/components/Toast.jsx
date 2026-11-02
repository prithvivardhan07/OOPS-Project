import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const { type = 'success', message, title } = toast;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-[#F87171] shrink-0" />,
    info: <Info className="w-4 h-4 text-[#4D7CFE] shrink-0" />,
  };

  const borders = {
    success: 'border-[#134E35] bg-[#0E1520]/95 text-[#F5F5F2] shadow-[0_10px_30px_rgba(0,0,0,0.5)]',
    error: 'border-[#601D1D] bg-[#0E1520]/95 text-[#F5F5F2] shadow-[0_10px_30px_rgba(0,0,0,0.5)]',
    info: 'border-[#1E3B7A] bg-[#0E1520]/95 text-[#F5F5F2] shadow-[0_10px_30px_rgba(0,0,0,0.5)]',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl ${
          borders[type] || borders.info
        }`}
      >
        <div className="mt-0.5">{icons[type] || icons.info}</div>
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5F5F2] mb-0.5">
              {title}
            </h4>
          )}
          <p className="text-xs text-[#929AAA] leading-relaxed font-medium">
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-[#5E6678] hover:text-[#F5F5F2] transition-colors p-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
