import React from 'react';
import { useStore } from '../context/StoreContext';
import { STORE_INFO } from '../data/riceData';

export default function SpotlightST25({ onSelectRiceForCalculator }) {
  const { spotlightST25, storeInfo } = useStore();
  const st25BagImg = storeInfo?.spotlightSt25BagUrl || STORE_INFO.spotlightSt25BagUrl;

  const handleCalcClick = (e) => {
    e.preventDefault();
    if (onSelectRiceForCalculator) {
      onSelectRiceForCalculator("ST25 Lúa Tôm", spotlightST25.priceRetail || 28000);
    } else {
      const el = document.getElementById('tinh-tien-nhanh');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="gao-ong-cua" className="w-full py-16 lg:py-20 bg-gradient-to-br from-emerald-950 via-[#0a4d15] to-emerald-900 text-white relative overflow-hidden">
      {/* Subtle Golden Glow Layers */}
      <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-amber-400/15 blur-3xl pointer-events-none"></div>
      <div className="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-margin relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Content Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400 text-stone-950 font-label-sm text-label-sm font-extrabold shadow-sm">
              <span className="material-symbols-outlined text-[18px]">award_star</span>
              <span>{spotlightST25.tag}</span>
            </div>

            <h2 className="font-headline-xl text-headline-xl text-white leading-tight font-serif">
              {spotlightST25.title} <br />
              <span className="text-amber-300 font-bold">{spotlightST25.titleHighlight}</span>
            </h2>

            <p className="font-body-lg text-body-lg text-emerald-100/90 leading-relaxed">
              {spotlightST25.description}
            </p>

            {/* Key Authenticity Attributes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 bg-white/10 border border-white/15 p-4 rounded-xl backdrop-blur-sm">
                <span className="material-symbols-outlined text-amber-300 text-[26px]">qr_code_scanner</span>
                <div>
                  <div className="font-label-lg text-label-lg font-bold text-white">{spotlightST25.feature1Title}</div>
                  <div className="font-body-sm text-body-sm text-emerald-100/80">{spotlightST25.feature1Desc}</div>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/10 border border-white/15 p-4 rounded-xl backdrop-blur-sm">
                <span className="material-symbols-outlined text-amber-300 text-[26px]">workspace_premium</span>
                <div>
                  <div className="font-label-lg text-label-lg font-bold text-white">{spotlightST25.feature2Title}</div>
                  <div className="font-body-sm text-body-sm text-emerald-100/80">{spotlightST25.feature2Desc}</div>
                </div>
              </div>
            </div>

            {/* ST25 Packaging Formats */}
            <div className="pt-2">
              <div className="font-label-md text-label-md text-emerald-200/90 mb-3 font-semibold">
                Quy cách đóng gói sẵn sàng giao:
              </div>
              <div className="flex flex-wrap gap-2.5">
                {spotlightST25.packagingList?.map((pkg, idx) => (
                  <span
                    key={idx}
                    className={`px-3.5 py-1.5 rounded-lg border text-xs ${
                      idx === 1
                        ? 'bg-amber-400 text-stone-950 font-bold shadow-xs border-amber-400'
                        : 'bg-white/15 border-white/20 text-white font-medium'
                    }`}
                  >
                    {pkg}
                  </span>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-headline-sm text-headline-sm font-bold shadow-lg transition-all"
                href={`tel:${storeInfo.hotlineClean}`}
              >
                <span className="material-symbols-outlined text-[20px]">phone_in_talk</span>
                <span>Tư Vấn Đại Lý Sỉ: {storeInfo.hotline}</span>
              </a>
              <button
                onClick={handleCalcClick}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/25 font-label-lg text-label-lg transition-all backdrop-blur-sm cursor-pointer font-bold"
              >
                <span className="material-symbols-outlined text-[20px]">calculate</span>
                <span>Tính Tiền Đơn Hàng ST25</span>
              </button>
            </div>
          </div>

          {/* Visual Column */}
          <div className="lg:col-span-5">
            <div className="relative bg-white text-stone-900 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 border border-stone-100">
              <div className="rounded-2xl overflow-hidden h-64 sm:h-72 relative">
                <img
                  className="w-full h-full object-cover"
                  alt="Bao bì chính hãng Gạo ST25 Ông Cua Sóc Trăng"
                  src={st25BagImg}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = STORE_INFO.spotlightSt25BagUrl;
                  }}
                />
                <span className="absolute top-3 left-3 bg-amber-500 text-stone-950 px-3 py-1 rounded-full font-label-sm text-label-sm font-extrabold shadow-md">
                  CHÍNH HIỆU SÓC TRĂNG
                </span>
              </div>

              {/* Flavor Gauge Mini Data Vis */}
              <div className="space-y-3 pt-2">
                <div className="font-headline-sm text-headline-sm text-[#0d631b] font-bold font-serif">
                  Đặc Tính Hạt Cơm ST25
                </div>
                <div className="space-y-2.5 font-label-sm text-label-sm">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-stone-700 font-medium">Độ Dẻo & Dai Hạt</span>
                      <span className="font-bold text-[#0d631b]">{spotlightST25.gaugeSoftness} / 10</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-stone-200 overflow-hidden">
                      <div className="h-full rounded-full bg-[#0d631b]" style={{ width: `${(spotlightST25.gaugeSoftness / 10) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-stone-700 font-medium">Hương Thơm Lá Dứa Tự Nhiên</span>
                      <span className="font-bold text-[#855300]">{spotlightST25.gaugeAroma} / 10</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-stone-200 overflow-hidden">
                      <div className="h-full rounded-full bg-amber-500" style={{ width: `${(spotlightST25.gaugeAroma / 10) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-stone-700 font-medium">Độ Ngọt Cơm & Giữ Mềm Sau Khi Nguội</span>
                      <span className="font-bold text-[#006874]">{spotlightST25.gaugeSweetness} / 10</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-stone-200 overflow-hidden">
                      <div className="h-full rounded-full bg-[#00838f]" style={{ width: `${(spotlightST25.gaugeSweetness / 10) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price display card */}
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-stone-900 font-body-sm text-body-sm">
                <span className="text-stone-700 font-medium">Giá niêm yết ST25 Lúa Tôm:</span>
                <span className="font-headline-sm text-headline-sm text-[#0d631b] font-extrabold text-xl">
                  {(spotlightST25.priceRetail || 28000).toLocaleString('vi-VN')}đ / kg
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}