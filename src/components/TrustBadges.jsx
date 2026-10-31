import React from 'react';
import { useStore } from '../context/StoreContext';

export default function TrustBadges() {
  const { trustBadges } = useStore();

  return (
    <section className="w-full py-16 bg-white border-y border-stone-200/60">
      <div className="max-w-7xl mx-auto px-margin">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="font-label-md text-label-md font-bold tracking-widest text-[#0d631b] uppercase">
            Uy Tín Tạo Nên Thương Hiệu
          </span>
          <h2 className="font-headline-lg text-headline-lg text-stone-900 font-serif">
            4 Cam Kết Vàng Từ Vựa Gạo Thảo Nguyên
          </h2>
          <p className="font-body-md text-body-md text-stone-600 leading-relaxed">
            Mỗi bao gạo trao đến tay khách hàng là trọn vẹn sự tận tâm, chuẩn chỉnh từ nguồn gốc ruộng đồng đến chất lượng nồi cơm gia đình.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustBadges.map((pillar, idx) => (
            <div
              key={idx}
              className="group bg-stone-50 hover:bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div
                  className={`w-14 h-14 rounded-2xl ${pillar.iconBg || 'bg-emerald-100'} flex items-center justify-center ${pillar.iconColor || 'text-[#0d631b]'} mb-5 group-hover:scale-110 transition-transform shadow-xs`}
                >
                  <span className="material-symbols-outlined text-[32px]">{pillar.icon}</span>
                </div>
                <div className="font-headline-sm text-headline-sm text-stone-900 mb-2 font-bold font-serif">
                  {pillar.title}
                </div>
                <p className="font-body-sm text-body-sm text-stone-600 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>

              <div className={`mt-5 pt-3.5 border-t border-stone-200/70 flex items-center gap-1.5 font-label-sm text-label-sm ${pillar.highlightColor || 'text-[#0d631b]'} font-bold`}>
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>{pillar.highlight}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}