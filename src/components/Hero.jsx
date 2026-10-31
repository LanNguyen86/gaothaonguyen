import React from 'react';
import { useStore } from '../context/StoreContext';

export default function Hero() {
  const { heroContent, storeInfo } = useStore();

  return (
    <section id="hero" className="relative w-full overflow-hidden bg-gradient-to-b from-stone-50 via-white to-stone-50 pt-28 pb-16 lg:pb-24">
      {/* Background Decor & Ambient Image Layer */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center opacity-15 scale-105 transform duration-1000 ease-out"
          style={{ backgroundImage: `url('${storeInfo.heroBgUrl}')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/95 to-white"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-100/60 blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full bg-amber-100/60 blur-3xl pointer-events-none"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-margin">
        {/* Breadcrumb / Authoritative Micro Badge */}
        <div className="flex flex-wrap items-center gap-3 pt-6 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 font-label-md text-label-md shadow-xs">
            <span className="material-symbols-outlined text-[18px] text-[#0d631b]">workspace_premium</span>
            <span className="font-bold">{heroContent.badgeAuthorized}</span>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-950 font-label-sm text-label-sm font-bold shadow-xs">
            <span className="material-symbols-outlined text-[16px] text-amber-800">local_shipping</span>
            <span>{heroContent.badgeDelivery}</span>
          </span>
        </div>

        {/* Main Hero Headline Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="font-label-lg text-label-lg tracking-widest text-[#855300] uppercase font-bold flex items-center gap-2">
                <span className="w-8 h-[2px] bg-[#855300] inline-block"></span>
                {heroContent.subhead}
              </span>
              <h1 className="font-headline-xl text-headline-xl text-stone-900 leading-tight tracking-tight font-serif">
                {heroContent.headlinePart1} <br className="hidden sm:inline" />
                <span className="text-[#0d631b] font-extrabold relative inline-block">
                  {heroContent.headlinePart2}
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-amber-400/80" fill="none" preserveAspectRatio="none" viewBox="0 0 200 8">
                    <path d="M0 5C50 0 150 0 200 5" stroke="currentColor" strokeLinecap="round" strokeWidth="4"></path>
                  </svg>
                </span>
              </h1>
            </div>

            <p className="font-body-lg text-body-lg text-stone-700 max-w-2xl leading-relaxed">
              {heroContent.description}
            </p>

            {/* Dual CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <a
                className="inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-[#0d631b] hover:bg-[#094713] text-white font-headline-sm text-headline-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all font-bold"
                href={`tel:${storeInfo.hotlineClean}`}
              >
                <span className="material-symbols-outlined text-[24px]">call</span>
                <span>Đặt Hàng Ngay: {storeInfo.hotline}</span>
              </a>

              <a
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white hover:bg-stone-100 text-[#0d631b] font-headline-sm text-headline-sm shadow-sm border border-stone-200 hover:shadow-md transition-all font-bold"
                href="#bang-gia-san-pham"
              >
                <span className="material-symbols-outlined text-[22px]">price_change</span>
                <span>Xem Bảng Giá Hôm Nay</span>
              </a>
            </div>

            {/* Quick Metric Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-stone-200">
              <div>
                <div className="font-headline-lg text-headline-lg text-[#0d631b] font-extrabold">{heroContent.metric1Value}</div>
                <div className="font-label-sm text-label-sm text-stone-600 font-medium">{heroContent.metric1Label}</div>
              </div>
              <div>
                <div className="font-headline-lg text-headline-lg text-[#855300] font-extrabold">{heroContent.metric2Value}</div>
                <div className="font-label-sm text-label-sm text-stone-600 font-medium">{heroContent.metric2Label}</div>
              </div>
              <div>
                <div className="font-headline-lg text-headline-lg text-[#0d631b] font-extrabold">{heroContent.metric3Value}</div>
                <div className="font-label-sm text-label-sm text-stone-600 font-medium">{heroContent.metric3Label}</div>
              </div>
            </div>
          </div>

          {/* Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Hero Rice Showcase Card */}
              <div className="relative bg-white rounded-3xl p-4 shadow-xl border border-stone-200/80 overflow-hidden">
                <div className="relative rounded-2xl overflow-hidden h-96 sm:h-[420px]">
                  <img
                    className="w-full h-full object-cover"
                    alt={heroContent.cardTitle}
                    src={storeInfo.heroCookedBowlUrl}
                  />
                  {/* High contrast gradient: dark at bottom so white text is always sharp */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent"></div>
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                    <div className="inline-block px-2.5 py-1 rounded bg-amber-500 text-stone-950 font-label-sm text-label-sm font-extrabold uppercase tracking-wider mb-1.5 shadow-sm">
                      {heroContent.cardTag}
                    </div>
                    <h2 className="font-headline-md text-headline-md text-white font-serif font-bold drop-shadow-md">
                      {heroContent.cardTitle}
                    </h2>
                    <p className="font-body-sm text-body-sm text-stone-200 line-clamp-1 drop-shadow-sm font-medium">
                      {heroContent.cardSubtitle}
                    </p>
                  </div>
                </div>

                {/* Floating Micro Card */}
                <div className="absolute -bottom-2 -right-2 sm:bottom-6 sm:right-6 bg-white p-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-stone-200/80 z-20">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-900 shadow-xs">
                    <span className="material-symbols-outlined text-[28px]">eco</span>
                  </div>
                  <div>
                    <div className="font-label-sm text-label-sm text-stone-500 font-medium">{heroContent.microCardLabel}</div>
                    <div className="font-headline-sm text-headline-sm text-[#0d631b] font-bold">{heroContent.microCardValue}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}