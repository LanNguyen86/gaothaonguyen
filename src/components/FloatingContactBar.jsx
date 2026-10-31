import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

export default function FloatingContactBar() {
  const { storeInfo } = useStore();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-6 right-5 sm:right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="w-11 h-11 rounded-full bg-stone-800/90 hover:bg-stone-900 text-white shadow-lg flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 border border-stone-700/50 backdrop-blur-xs"
          title="Lên đầu trang"
          aria-label="Lên đầu trang"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_upward</span>
        </button>
      )}

      {/* Quick Call Bubble */}
      <a
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#0d631b] hover:bg-[#094713] text-white shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-emerald-500/30 font-bold"
        href={`tel:${storeInfo.hotlineClean}`}
        title="Gọi điện đặt gạo ngay"
      >
        <span className="material-symbols-outlined text-[24px] animate-bounce">call</span>
        <span className="font-headline-sm text-headline-sm hidden sm:inline">{storeInfo.hotline}</span>
        <span className="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 font-extrabold shadow-xs">
          {storeInfo.contactPerson}
        </span>
      </a>

      {/* Quick Zalo Bubble */}
      <a
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-white text-stone-900 shadow-xl hover:scale-105 active:scale-95 transition-all border border-stone-300 cursor-pointer font-bold"
        href={storeInfo.zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Nhắn tin Zalo với Chị Thảo"
      >
        <span className="material-symbols-outlined text-[24px] text-[#0068ff]">chat</span>
        <span className="font-label-lg text-label-lg text-stone-900">Chat Zalo Đặt Gạo</span>
      </a>
    </div>
  );
}