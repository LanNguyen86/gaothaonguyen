import React, { useEffect } from 'react';

export default function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed top-24 right-4 sm:right-8 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-white text-stone-900 shadow-2xl border border-emerald-500/30 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-200">
      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-[#0d631b] shrink-0">
        <span className="material-symbols-outlined text-[18px]">check</span>
      </div>
      <div className="font-label-md text-label-md font-medium text-stone-900 pr-2">
        {message}
      </div>
      <button
        onClick={onClose}
        className="text-stone-400 hover:text-stone-700 p-1 rounded-full cursor-pointer"
        aria-label="Đóng thông báo"
      >
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  );
}