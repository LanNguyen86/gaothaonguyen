import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';

export default function AdminCalculator({ onShowToast }) {
  const { calculatorConfig, updateCalculatorConfig, storeInfo, updateStoreInfo } = useStore();
  const [formData, setFormData] = useState({ ...calculatorConfig });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: Number(value) || 0 }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateCalculatorConfig(formData);
    // sync with storeInfo for backward compatibility
    updateStoreInfo({
      freeShipThresholdKg: formData.freeShipThresholdKg,
      defaultShippingFee: formData.defaultShippingFee,
    });
    if (onShowToast) onShowToast('Đã lưu cấu hình công cụ tính tiền gạo!');
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 font-serif">
            Cấu Hình Công Cụ Tính Tiền & Phí Vận Chuyển
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Thiết lập điều kiện miễn phí ship (Freeship), phí giao hàng tiêu chuẩn và các mốc số lượng gợi ý.
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-[#0d631b] hover:bg-[#094713] text-white text-sm font-bold shadow-xs flex items-center gap-2 cursor-pointer transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">save</span>
          <span>Lưu Cài Đặt Máy Tính</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
        <h3 className="font-bold text-stone-900 text-base flex items-center gap-2 border-b border-stone-200 pb-3">
          <span className="material-symbols-outlined text-[#0d631b] text-[22px]">calculate</span>
          <span>Ngưỡng Freeship & Cước Phí Giao Hàng</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
            <label className="block text-xs font-bold text-[#0d631b] uppercase tracking-wider">
              Mức số lượng để được MIỄN PHÍ VẬN CHUYỂN (kg)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="500"
                name="freeShipThresholdKg"
                value={formData.freeShipThresholdKg}
                onChange={handleChange}
                className="w-32 bg-white border border-emerald-300 rounded-xl px-3.5 py-2 text-base font-extrabold text-[#0d631b] focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
              />
              <span className="text-sm font-bold text-stone-700">kg trở lên</span>
            </div>
            <p className="text-xs text-stone-600">
              Đơn hàng bằng hoặc lớn hơn mức này sẽ hiển thị <strong>MIỄN PHÍ GIAO HÀNG (0đ)</strong>.
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
              Cước ship nội thành khi chưa đủ điều kiện (đ)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="5000"
                min="0"
                name="defaultShippingFee"
                value={formData.defaultShippingFee}
                onChange={handleChange}
                className="w-36 bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-base font-extrabold text-[#855300] focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
              />
              <span className="text-sm font-bold text-stone-700">đồng / đơn</span>
            </div>
            <p className="text-xs text-stone-600">
              Cước hỗ trợ xăng xe giao tận cửa nhà cho đơn nhỏ lẻ dưới ngưỡng Freeship.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}