import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';

export default function AdminWarehouse({ onShowToast }) {
  const { warehouseContent, updateWarehouseContent, storeInfo, updateStoreInfo } = useStore();
  const [formData, setFormData] = useState({ ...warehouseContent });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateWarehouseContent(formData);
    // sync address & hours with storeInfo
    updateStoreInfo({
      address: formData.address,
      openingHours: formData.openingHours,
      deliveryCoverage: formData.deliveryCoverage,
      googleMapsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(formData.address || '586 Hà Huy Giáp, Phường Thạnh Lộc, Quận 12, TP.HCM')}`,
    });
    if (onShowToast) onShowToast('Đã lưu vị trí kho hàng & bản đồ Google Maps!');
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 font-serif">
            Quản Lý Vị Trí Kho Hàng & Bản Đồ Google Maps
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Cấu hình địa chỉ thực tế tại 586 Hà Huy Giáp, hướng dẫn đỗ xe tải và mã nhúng bản đồ Google Maps chính xác 100%.
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-[#0d631b] hover:bg-[#094713] text-white text-sm font-bold shadow-xs flex items-center gap-2 cursor-pointer transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">save</span>
          <span>Lưu Cài Đặt Kho Bãi</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <h3 className="font-bold text-stone-900 text-base flex items-center gap-2 border-b border-stone-200 pb-3">
          <span className="material-symbols-outlined text-[#0d631b] text-[22px]">location_on</span>
          <span>Địa Điểm & Thông Tin Đón Khách Trực Tiếp</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Dòng chữ nhỏ (Badge)</label>
            <input
              type="text"
              name="badge"
              value={formData.badge || ''}
              onChange={handleChange}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Tên cơ sở kho bãi</label>
            <input
              type="text"
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Lời mời khách ghé thăm kho</label>
          <textarea
            rows={2}
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d631b] leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Địa chỉ kho chính xác *</label>
            <input
              type="text"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d631b] font-medium"
              placeholder="586 Hà Huy Giáp, Phường Thạnh Lộc, Quận 12, TP.HCM"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Thời gian mở cửa</label>
            <input
              type="text"
              name="openingHours"
              value={formData.openingHours || ''}
              onChange={handleChange}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Ghi chú bãi đậu xe (Parking note)</label>
            <input
              type="text"
              name="parkingNote"
              value={formData.parkingNote || ''}
              onChange={handleChange}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-[#855300] font-bold focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
              placeholder="Mặt tiền đường Hà Huy Giáp, xe tải bốc hàng và xe máy đỗ thuận tiện"
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
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            Đường dẫn nhúng Google Maps chính xác (Iframe Embed URL)
          </label>
          <input
            type="text"
            name="googleMapsEmbed"
            value={formData.googleMapsEmbed || ''}
            onChange={handleChange}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
          />
          <p className="text-[11px] text-stone-500 mt-1">
            Mã nhúng Google Maps chuẩn của địa chỉ 586 Hà Huy Giáp, Phường Thạnh Lộc, Quận 12.
          </p>
        </div>

        {/* Live Map Preview inside Admin */}
        <div className="pt-2">
          <label className="block text-xs font-bold text-stone-700 mb-2">
            Xem trước bản đồ trực tiếp:
          </label>
          <div className="w-full h-64 rounded-2xl border border-stone-300 overflow-hidden shadow-xs">
            <iframe
              title="Xem trước bản đồ Google Maps"
              src={formData.googleMapsEmbed}
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </form>
  );
}