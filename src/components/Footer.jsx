import React from 'react';
import { useStore } from '../context/StoreContext';

export default function Footer({ onOpenAdmin }) {
  const { storeInfo } = useStore();

  return (
    <footer className="w-full bg-[#f0f3ff] text-stone-700 pt-space-xl pb-space-lg border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-margin">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-xl mb-space-xl">
          
          {/* Col 1: About & Logo */}
          <div className="space-y-space-sm">
            <div className="flex items-center gap-space-sm mb-space-sm">
              <img
                alt={storeInfo.name}
                className="h-10 w-auto object-contain"
                src={storeInfo.logoUrl || '/logo.png'}
              />
              <span className="font-headline-sm text-headline-sm text-[#0d631b] font-serif font-bold">
                {storeInfo.name}
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-stone-600 leading-relaxed">
              Chuyên cung cấp gạo ngon, gạo sạch đạt chuẩn ATVSTP tại TP.HCM và các tỉnh lân cận. Cam kết hạt gạo thuần khiết, thơm cơm, đúng mùa vụ mang trọn vị ngọt quê hương tới mọi gia đình.
            </p>
            <div className="flex items-center gap-2 pt-space-xs text-[#0d631b] font-label-md text-label-md font-bold">
              <span className="material-symbols-outlined text-[20px]">verified</span>
              <span>Đại lý phân phối Gạo Ông Cua ST25 chính hãng</span>
            </div>
          </div>

          {/* Col 2: Contact */}
          <div className="space-y-space-sm">
            <div className="font-headline-sm text-headline-sm text-stone-900 font-serif font-bold">
              Liên Hệ & Tư Vấn
            </div>
            <ul className="space-y-space-xs font-body-sm text-body-sm text-stone-600">
              <li>
                <strong className="text-stone-900">Địa chỉ kho:</strong> {storeInfo.address}
              </li>
              <li>
                <strong className="text-stone-900">Hotline đặt gạo:</strong>{' '}
                <a className="text-[#0d631b] font-label-lg text-label-lg hover:underline font-extrabold" href={`tel:${storeInfo.hotlineClean}`}>
                  {storeInfo.hotline} ({storeInfo.contactPerson})
                </a>
              </li>
              <li>
                <strong className="text-stone-900">Thời gian mở cửa:</strong> {storeInfo.openingHours}
              </li>
              <li>
                <strong className="text-stone-900">Giao hàng:</strong> Tận nhà trong 2 giờ, hỗ trợ vác lên tận bếp
              </li>
            </ul>
          </div>

          {/* Col 3: Rice categories */}
          <div className="space-y-space-sm">
            <div className="font-headline-sm text-headline-sm text-stone-900 font-serif font-bold">
              Danh Mục Gạo Ngon
            </div>
            <ul className="space-y-space-xs font-body-sm text-body-sm text-stone-600">
              <li><a className="hover:text-[#0d631b] transition-colors" href="#gao-ong-cua">Gạo ST25 Ông Cua hảo hạng</a></li>
              <li><a className="hover:text-[#0d631b] transition-colors" href="#bang-gia-san-pham">Gạo Tài Nguyên Chợ Đào xốp mềm</a></li>
              <li><a className="hover:text-[#0d631b] transition-colors" href="#bang-gia-san-pham">Gạo ST21, Nàng Hoa dẻo thơm</a></li>
              <li><a className="hover:text-[#0d631b] transition-colors" href="#bang-gia-san-pham">Gạo Nàng Hương, Sa Mơ, Bụi Sữa</a></li>
              <li><a className="hover:text-[#0d631b] transition-colors" href="#bang-gia-san-pham">Gạo Nếp Ngỗng, Tấm Thơm Sài Gòn</a></li>
              <li><a className="hover:text-[#0d631b] transition-colors" href="#bang-gia-san-pham">Gạo Quán Ăn 64 Dứa, Hàm Châu, Nở Mềm</a></li>
            </ul>
          </div>

          {/* Col 4: Trust & Payment */}
          <div className="space-y-space-sm">
            <div className="font-headline-sm text-headline-sm text-stone-900 font-serif font-bold">
              Cam Kết & Quản Trị
            </div>
            <div className="bg-white p-space-md rounded-xl shadow-xs space-y-space-xs border border-stone-200">
              <div className="flex items-center gap-2 font-label-md text-label-md text-[#0d631b] font-bold">
                <span className="material-symbols-outlined text-[18px]">shield</span>
                <span>Chứng nhận ATVSTP đầy đủ</span>
              </div>
              <p className="font-body-sm text-body-sm text-stone-600">
                Đổi trả 1-1 miễn phí nếu cơm nấu không ưng ý hoặc gạo không đúng chuẩn mô tả.
              </p>
            </div>
            <div className="pt-space-xs space-y-2">
              <div className="flex items-center gap-2 flex-wrap text-stone-700 font-label-sm text-label-sm">
                <span className="px-2.5 py-1 bg-white border border-stone-200 rounded-md font-medium">Tiền mặt khi nhận gạo</span>
                <span className="px-2.5 py-1 bg-white border border-stone-200 rounded-md font-medium">Chuyển khoản QR 24/7</span>
              </div>

              {/* CMS Admin Link */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-[#0d631b] font-semibold cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                  <span>Đăng nhập trang quản trị (CMS)</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="border-t border-stone-200/80 pt-space-md flex flex-col md:flex-row items-center justify-between gap-space-sm font-label-sm text-label-sm text-stone-500">
          <p>© {new Date().getFullYear()} {storeInfo.name}. Trọn vẹn bữa cơm ngon gia đình Việt.</p>
          <p className="flex items-center gap-1 text-[#855300] font-semibold">
            <span className="material-symbols-outlined text-[16px]">eco</span>
            <span>Nông sản sạch thuần Việt - Vì sức khỏe mọi nhà</span>
          </p>
        </div>
      </div>
    </footer>
  );
}