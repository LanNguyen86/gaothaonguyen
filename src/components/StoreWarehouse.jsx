import React from 'react';
import { useStore } from '../context/StoreContext';

export default function StoreWarehouse() {
  const { warehouseContent, storeInfo } = useStore();

  const exactAddress = warehouseContent.address || storeInfo.address || '586 Hà Huy Giáp, Phường Thạnh Lộc, Quận 12, TP.HCM';
  const directionsUrl = storeInfo.googleMapsUrl || `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(exactAddress)}`;
  const embedMapUrl = warehouseContent.googleMapsEmbed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.443673327686!2d106.68481537480587!3d10.853835889299496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528e12d8a571f%3A0x6bc4ea20f012b1cb!2zNTg2IEjDoCBIdXkgR2nhuYFwLCBUaOG6oW5oIEzhu5ljLCBRdeG6rW4gMTIsIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1711000000000!5m2!1svi!2s";

  return (
    <section className="w-full py-16 lg:py-20 bg-stone-50" id="kho-hang">
      <div className="max-w-7xl mx-auto px-margin">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="font-label-md text-label-md font-bold tracking-widest text-[#0d631b] uppercase">
                {warehouseContent.badge || 'Ghé Thăm Kho Gạo Trực Tiếp'}
              </span>
              <h2 className="font-headline-lg text-headline-lg text-stone-900 font-serif font-bold">
                {warehouseContent.title || storeInfo.name}
              </h2>
              <p className="font-body-md text-body-md text-stone-700 leading-relaxed">
                {warehouseContent.description || 'Kính mời quý khách tới trực tiếp kho xem mẫu gạo thực tế, ngửi hương cám mới và thử độ dẻo trước khi đặt số lượng lớn.'}
              </p>
            </div>

            <div className="space-y-3.5 font-body-md text-body-md">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#0d631b] text-[22px] mt-0.5">location_on</span>
                <div className="text-stone-700">
                  <strong className="text-stone-900">Địa chỉ kho:</strong> {exactAddress}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#0d631b] text-[22px] mt-0.5">schedule</span>
                <div className="text-stone-700">
                  <strong className="text-stone-900">Giờ mở cửa:</strong> {warehouseContent.openingHours || storeInfo.openingHours}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#0d631b] text-[22px] mt-0.5">local_shipping</span>
                <div className="text-stone-700">
                  <strong className="text-stone-900">Bán kính giao hàng:</strong> {warehouseContent.deliveryCoverage || storeInfo.deliveryCoverage}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-stone-100 text-[#0d631b] font-label-lg text-label-lg shadow-xs hover:shadow-md transition-all cursor-pointer border border-stone-200 font-bold"
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="material-symbols-outlined text-[20px]">directions</span>
                <span>Chỉ Đường Google Maps Tới Kho</span>
              </a>

              <a
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#0d631b] hover:bg-[#094713] text-white font-label-lg text-label-lg shadow-xs hover:shadow-md transition-all cursor-pointer font-bold"
                href={`tel:${storeInfo.hotlineClean}`}
              >
                <span className="material-symbols-outlined text-[20px]">call</span>
                <span>Gọi Kho: {storeInfo.hotline}</span>
              </a>
            </div>
          </div>

          {/* Map Preview Column: Real Google Maps Only (No fake images) */}
          <div className="lg:col-span-7">
            <div className="w-full rounded-3xl bg-white border border-stone-200 shadow-md overflow-hidden relative">
              {/* Header Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-stone-100 border-b border-stone-200 text-xs font-bold text-stone-700">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span className="text-stone-900 font-bold">Vị Trí Thực Tế Trên Google Maps (586 Hà Huy Giáp)</span>
                </div>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0d631b] hover:underline flex items-center gap-1 cursor-pointer text-xs font-bold"
                >
                  <span>Mở ứng dụng Google Maps</span>
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </a>
              </div>

              {/* Real Interactive Google Maps Iframe */}
              <div className="w-full h-80 sm:h-96 relative">
                <iframe
                  title="Vị trí thực tế Vựa Gạo Thảo Nguyên tại 586 Hà Huy Giáp"
                  src={embedMapUrl}
                  className="w-full h-full border-0"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>

                {/* Floating Location Card */}
                <div className="absolute bottom-3 left-3 right-3 sm:right-auto bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl shadow-xl max-w-sm space-y-1.5 border border-stone-200 text-stone-900 pointer-events-auto">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#0d631b] text-[20px]">store</span>
                    <div className="font-headline-sm text-sm font-bold text-[#0d631b] font-serif">
                      {warehouseContent.title || storeInfo.name}
                    </div>
                  </div>
                  <div className="text-xs text-stone-700 font-medium">
                    {exactAddress}
                  </div>
                  <div className="text-[11px] text-[#855300] font-bold pt-0.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">local_parking</span>
                    <span>{warehouseContent.parkingNote || 'Mặt tiền đường Hà Huy Giáp, xe tải bốc hàng đỗ thuận tiện'}</span>
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