import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-xl',
}) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Cinematic Dark Backdrop */}
      <div
        className="fixed inset-0 bg-[#0B0D12]/80 backdrop-blur-md transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Dialog Surface */}
      <div
        className={`relative w-full ${maxWidth} bg-[#131722] rounded-2xl shadow-2xl border border-[#232B40] overflow-hidden transform transition-all duration-200 z-10 flex flex-col max-h-[90vh]`}
      >
        {/* Subtle top ambient sheen */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#4D7CFE]/50 to-transparent pointer-events-none" />

        {/* Header */}
        <div className="px-6 py-4.5 border-b border-[#232B40] flex items-center justify-between bg-[#161C2C]/90">
          <div>
            <h3 className="text-base font-bold text-[#F5F5F2] tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-[#929AAA] mt-0.5 font-medium">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#929AAA] hover:text-[#F5F5F2] hover:bg-[#232B40] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto text-[#F5F5F2]">{children}</div>
      </div>
    </div>
  );
}
