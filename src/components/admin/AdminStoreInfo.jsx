import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';

export default function AdminStoreInfo({ onShowToast }) {
  const { storeInfo, updateStoreInfo } = useStore();
  const [formData, setFormData] = useState({ ...storeInfo });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateStoreInfo(formData);
    if (onShowToast) onShowToast('Đã lưu thông tin vựa gạo & liên hệ!');
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 font-serif">
            Thông Tin Vựa Gạo & Thông Tin Liên Hệ
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Cấu hình tên thương hiệu, logo, hotline tư vấn, địa chỉ kho và giờ phục vụ khách hàng.
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-[#0d631b] hover:bg-[#094713] text-white text-sm font-bold shadow-xs flex items-center gap-2 cursor-pointer transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">save</span>
          <span>Lưu Cài Đặt</span>
        </button>
      </div>

      {/* Brand Identity Card */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <h3 className="font-bold text-stone-900 text-base flex items-center gap-2 border-b border-stone-200 pb-3">
          <span className="material-symbols-outlined text-[#0d631b] text-[22px]">badge</span>
          <span>Nhận Diện Thương Hiệu & Logo</span>
        </h3>

        <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
          {/* Logo Preview */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-emerald-300 p-1 flex items-center justify-center bg-stone-50 shadow-xs overflow-hidden">
              <img
                src={formData.logoUrl || '/logo.png'}
                alt="Logo Vựa Gạo Thảo Nguyên"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xs text-stone-500 font-medium">Logo hiện hành</span>
          </div>

          <div className="flex-1 w-full space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Tên Vựa Gạo *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d631b] font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Slogan Thương Hiệu</label>
                <input
                  type="text"
                  name="slogan"
                  value={formData.slogan || ''}
                  onChange={handleChange}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
                  placeholder="Gạo ngon – Chất lượng – Trọn niềm tin"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Đường dẫn tệp Logo (URL hoặc /logo.png)</label>
              <input
                type="text"
                name="logoUrl"
                value={formData.logoUrl || ''}
                onChange={handleChange}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contact & Hotline Card */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <h3 className="font-bold text-stone-900 text-base flex items-center gap-2 border-b border-stone-200 pb-3">
          <span className="material-symbols-outlined text-[#0d631b] text-[22px]">phone_in_talk</span>
          <span>Hotline & Kênh Đặt Hàng Trực Tuyến</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Số điện thoại hiển thị *</label>
            <input
              type="text"
              name="hotline"
              value={formData.hotline || ''}
              onChange={handleChange}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-[#0d631b] font-bold focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
              placeholder="0979.123.789"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Số quay gọi tel: (không dấu chấm)</label>
            <input
              type="text"
              name="hotlineClean"
              value={formData.hotlineClean || ''}
              onChange={handleChange}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
              placeholder="0979123789"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Người phụ trách tư vấn</label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson || ''}
              onChange={handleChange}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
              placeholder="Chị Thảo"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Đường dẫn liên hệ Zalo (zalo.me/...)</label>
            <input
              type="text"
              name="zaloUrl"
              value={formData.zaloUrl || ''}
              onChange={handleChange}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
              placeholder="https://zalo.me/0979123789"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Giờ mở cửa kho</label>
            <input
              type="text"
              name="openingHours"
              value={formData.openingHours || ''}
              onChange={handleChange}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
              placeholder="06:30 - 20:30 (Mở cửa cả tuần)"
            />
          </div>
        </div>
      </div>

      {/* Warehouse & Address Card */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <h3 className="font-bold text-stone-900 text-base flex items-center gap-2 border-b border-stone-200 pb-3">
          <span className="material-symbols-outlined text-[#0d631b] text-[22px]">store</span>
          <span>Kho Hàng & Giao Hàng</span>
        </h3>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Địa chỉ kho hàng chính xác *</label>
          <input
            type="text"
            name="address"
            value={formData.address || ''}
            onChange={handleChange}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d631b] font-medium"
            placeholder="586 Hà Huy Giáp, Phường Thạnh Lộc, Quận 12, TP.HCM"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Phạm vi giao hàng</label>
          <input
            type="text"
            name="deliveryCoverage"
            value={formData.deliveryCoverage || ''}
            onChange={handleChange}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
            placeholder="Phủ sóng toàn bộ các quận huyện TP.HCM và vùng phụ cận"
          />
        </div>
      </div>
    </form>
  );
}