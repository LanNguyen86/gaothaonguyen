import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';

export default function AdminB2B({ onShowToast }) {
  const { b2bContent, updateB2BContent } = useStore();
  const [formData, setFormData] = useState({ ...b2bContent });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateB2BContent(formData);
    if (onShowToast) onShowToast('Đã lưu nội dung Chính sách B2B & Khách sỉ!');
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 font-serif">
            Quản Lý Khối B2B & Khách Sỉ Doanh Nghiệp
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Cấu hình chính sách giá sỉ cho nhà hàng, trường học, bếp ăn công nghiệp và tổ chức từ thiện.
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-[#0d631b] hover:bg-[#094713] text-white text-sm font-bold shadow-xs flex items-center gap-2 cursor-pointer transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">save</span>
          <span>Lưu Cài Đặt B2B</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <h3 className="font-bold text-stone-900 text-base flex items-center gap-2 border-b border-stone-200 pb-3">
          <span className="material-symbols-outlined text-[#0d631b] text-[22px]">corporate_fare</span>
          <span>Tiêu Đề & Lời Kêu Gọi Hợp Tác B2B</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Huy hiệu trên cùng</label>
            <input
              type="text"
              name="badge"
              value={formData.badge || ''}
              onChange={handleChange}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Tiêu đề chính khối B2B</label>
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
          <label className="block text-xs font-bold text-stone-700 mb-1">Đoạn văn thuyết phục đối tác sỉ</label>
          <textarea
            rows={3}
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d631b] leading-relaxed"
          />
        </div>

        {/* 3 boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">Ưu đãi 1 (Tiêu đề)</label>
              <input
                type="text"
                name="box1Title"
                value={formData.box1Title || ''}
                onChange={handleChange}
                className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-sm font-bold text-[#0d631b]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">Nội dung ưu đãi 1</label>
              <textarea
                rows={2}
                name="box1Desc"
                value={formData.box1Desc || ''}
                onChange={handleChange}
                className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-xs text-stone-700"
              />
            </div>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">Ưu đãi 2 (Tiêu đề)</label>
              <input
                type="text"
                name="box2Title"
                value={formData.box2Title || ''}
                onChange={handleChange}
                className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-sm font-bold text-[#855300]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">Nội dung ưu đãi 2</label>
              <textarea
                rows={2}
                name="box2Desc"
                value={formData.box2Desc || ''}
                onChange={handleChange}
                className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-xs text-stone-700"
              />
            </div>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">Ưu đãi 3 (Tiêu đề)</label>
              <input
                type="text"
                name="box3Title"
                value={formData.box3Title || ''}
                onChange={handleChange}
                className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-sm font-bold text-[#006874]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">Nội dung ưu đãi 3</label>
              <textarea
                rows={2}
                name="box3Desc"
                value={formData.box3Desc || ''}
                onChange={handleChange}
                className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-xs text-stone-700"
              />
            </div>
          </div>
        </div>

        {/* Consultation card right */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Tiêu đề thẻ tư vấn bên phải</label>
            <input
              type="text"
              name="consultTitle"
              value={formData.consultTitle || ''}
              onChange={handleChange}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Mô tả tư vấn & gửi mẫu thử</label>
            <input
              type="text"
              name="consultDesc"
              value={formData.consultDesc || ''}
              onChange={handleChange}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
            />
          </div>
        </div>
      </div>
    </form>
  );
}