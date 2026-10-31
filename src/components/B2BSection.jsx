import React from 'react';
import { useStore } from '../context/StoreContext';

export default function B2BSection() {
  const { b2bContent, storeInfo } = useStore();

  return (
    <section className="w-full py-16 lg:py-20 bg-white" id="chinh-sach-b2b">
      <div className="max-w-7xl mx-auto px-margin">
        <div className="bg-[#eaf0fc] border border-[#d2def5] rounded-3xl p-8 lg:p-12 shadow-xs relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Info Column */}
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-950 font-label-sm text-label-sm font-bold shadow-xs">
                <span className="material-symbols-outlined text-[16px] text-amber-800">corporate_fare</span>
                <span>{b2bContent.badge}</span>
              </div>

              <h2 className="font-headline-lg text-headline-lg text-stone-900 font-serif font-bold">
                {b2bContent.title}
              </h2>

              <p className="font-body-md text-body-md text-stone-700 max-w-2xl leading-relaxed">
                {b2bContent.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
                  <div className="font-headline-sm text-headline-sm text-[#0d631b] mb-1 font-bold">{b2bContent.box1Title}</div>
                  <div className="font-body-sm text-body-sm text-stone-600 leading-relaxed">
                    {b2bContent.box1Desc}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
                  <div className="font-headline-sm text-headline-sm text-[#855300] mb-1 font-bold">{b2bContent.box2Title}</div>
                  <div className="font-body-sm text-body-sm text-stone-600 leading-relaxed">
                    {b2bContent.box2Desc}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
                  <div className="font-headline-sm text-headline-sm text-[#006874] mb-1 font-bold">{b2bContent.box3Title}</div>
                  <div className="font-body-sm text-body-sm text-stone-600 leading-relaxed">
                    {b2bContent.box3Desc}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Contact Card */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 sm:p-8 bg-white rounded-2xl shadow-md text-center space-y-4 border border-stone-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-[#0d631b] shadow-xs">
                <span className="material-symbols-outlined text-[36px]">support_agent</span>
              </div>
              <div className="space-y-1">
                <div className="font-headline-sm text-headline-sm text-stone-900 font-serif font-bold">
                  {b2bContent.consultTitle}
                </div>
                <div className="font-body-sm text-body-sm text-stone-600">
                  {b2bContent.consultDesc}
                </div>
              </div>
              <a
                className="w-full py-4 rounded-xl bg-[#0d631b] hover:bg-[#094713] text-white font-headline-sm text-headline-sm shadow-md transition-all text-center cursor-pointer font-bold uppercase tracking-wider"
                href={`tel:${storeInfo.hotlineClean}`}
              >
                Gọi Báo Giá: {storeInfo.hotline}
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}