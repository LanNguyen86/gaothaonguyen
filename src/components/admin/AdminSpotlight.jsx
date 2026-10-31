import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { STORE_INFO } from '../../data/riceData';
import ImageUploadField from './ImageUploadField';

export default function AdminSpotlight({ onShowToast }) {
  const { spotlightST25, updateSpotlightST25, storeInfo, updateStoreInfo } = useStore();
  const [formData, setFormData] = useState({ ...spotlightST25 });
  const [bagUrl, setBagUrl] = useState(storeInfo.spotlightSt25BagUrl || STORE_INFO.spotlightSt25BagUrl);
  const [newPackaging, setNewPackaging] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPackaging = () => {
    if (newPackaging.trim()) {
      setFormData((prev) => ({
        ...prev,
        packagingList: [...(prev.packagingList || []), newPackaging.trim()],
      }));
      setNewPackaging('');
    }
  };

  const handleRemovePackaging = (index) => {
    setFormData((prev) => ({
      ...prev,
      packagingList: prev.packagingList.filter((_, i) => i !== index),
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateSpotlightST25({
      ...formData,
      gaugeSoftness: Number(formData.gaugeSoftness) || 9.8,
      gaugeAroma: Number(formData.gaugeAroma) || 9.5,
      gaugeSweetness: Number(formData.gaugeSweetness) || 9.9,
      priceRetail: Number(formData.priceRetail) || 28000,
    });
    if (bagUrl !== storeInfo.spotlightSt25BagUrl) {
      updateStoreInfo({ spotlightSt25BagUrl: bagUrl });
    }
    if (onShowToast) onShowToast('Đã lưu nội dung Spotlight ST25 Ông Cua!');
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 font-serif">
            Quản Lý Spotlight ST25 Kỹ Sư Hồ Quang Cua
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Cấu hình câu chuyện nguồn gốc Sóc Trăng, cam kết tem chống giả, quy cách đóng gói và 3 thanh đo vị ngon.
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-[#0d631b] hover:bg-[#094713] text-white text-sm font-bold shadow-xs flex items-center gap-2 cursor-pointer transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">save</span>
          <span>Lưu Cài Đặt ST25</span>
        </button>
      </div>

      {/* Main Copy */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <h3 className="font-bold text-stone-900 text-base flex items-center gap-2 border-b border-stone-200 pb-3">
          <span className="material-symbols-outlined text-[#0d631b] text-[22px]">award_star</span>
          <span>Tiêu Đề & Câu Chuyện Gạo Ngon Nhất Thế Giới</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Huy hiệu danh vị</label>
            <input
              type="text"
              name="tag"
              value={formData.tag || ''}
              onChange={handleChange}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Tiêu đề chính dòng 1</label>
            <input
              type="text"
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Tiêu đề dòng 2 (Nhấn mạnh vàng)</label>
            <input
              type="text"
              name="titleHighlight"
              value={formData.titleHighlight || ''}
              onChange={handleChange}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-amber-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Đoạn văn giới thiệu nguồn gốc DNTN Hồ Quang Trí</label>
          <textarea
            rows={3}
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d631b] leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">Tiêu đề chứng nhận 1</label>
              <input
                type="text"
                name="feature1Title"
                value={formData.feature1Title || ''}
                onChange={handleChange}
                className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-sm font-bold text-[#0d631b]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">Mô tả chứng nhận 1</label>
              <input
                type="text"
                name="feature1Desc"
                value={formData.feature1Desc || ''}
                onChange={handleChange}
                className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-xs text-stone-700"
              />
            </div>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">Tiêu đề chứng nhận 2</label>
              <input
                type="text"
                name="feature2Title"
                value={formData.feature2Title || ''}
                onChange={handleChange}
                className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-sm font-bold text-[#0d631b]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">Mô tả chứng nhận 2</label>
              <input
                type="text"
                name="feature2Desc"
                value={formData.feature2Desc || ''}
                onChange={handleChange}
                className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-xs text-stone-700"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Packaging Formats & Flavor Gauges */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <h3 className="font-bold text-stone-900 text-base flex items-center gap-2 border-b border-stone-200 pb-3">
          <span className="material-symbols-outlined text-[#0d631b] text-[22px]">tune</span>
          <span>Quy Cách Bao Bì & Điểm Số Hương Vị</span>
        </h3>

        {/* Packaging pills */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5">
            Các quy cách đóng gói sẵn sàng giao:
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.packagingList?.map((pkg, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-800"
              >
                <span>{pkg}</span>
                <button
                  type="button"
                  onClick={() => handleRemovePackaging(idx)}
                  className="text-stone-400 hover:text-red-600 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 max-w-md">
            <input
              type="text"
              value={newPackaging}
              onChange={(e) => setNewPackaging(e.target.value)}
              placeholder="VD: Bao 10kg Quán Ăn"
              className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
            />
            <button
              type="button"
              onClick={handleAddPackaging}
              className="px-3.5 py-1.5 rounded-xl bg-stone-800 text-white text-xs font-bold hover:bg-stone-900 cursor-pointer"
            >
              Thêm quy cách
            </button>
          </div>
        </div>

        {/* 3 Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Độ Dẻo & Dai Hạt (Thang 10)
            </label>
            <input
              type="number"
              step="0.1"
              min="1"
              max="10"
              name="gaugeSoftness"
              value={formData.gaugeSoftness}
              onChange={handleChange}
              className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-sm font-bold text-[#0d631b]"
            />
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Hương Thơm Lá Dứa (Thang 10)
            </label>
            <input
              type="number"
              step="0.1"
              min="1"
              max="10"
              name="gaugeAroma"
              value={formData.gaugeAroma}
              onChange={handleChange}
              className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-sm font-bold text-[#855300]"
            />
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Độ Ngọt Cơm & Mềm Lâu (Thang 10)
            </label>
            <input
              type="number"
              step="0.1"
              min="1"
              max="10"
              name="gaugeSweetness"
              value={formData.gaugeSweetness}
              onChange={handleChange}
              className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-sm font-bold text-[#006874]"
            />
          </div>
        </div>

        <div className="pt-2">
          <label className="block text-xs font-bold text-stone-700 mb-1">Giá niêm yết ST25 Lúa Tôm (đ/kg)</label>
          <input
            type="number"
            step="500"
            name="priceRetail"
            value={formData.priceRetail}
            onChange={handleChange}
            className="w-full sm:w-72 bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-[#0d631b] font-bold focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
          />
        </div>

        {/* ST25 Bag Image Upload Field */}
        <div className="pt-2">
          <ImageUploadField
            label="Ảnh Bao Bì ST25 Sóc Trăng Chính Hãng (Card nổi bật bên phải)"
            value={bagUrl}
            onChange={setBagUrl}
            defaultUrl={STORE_INFO.spotlightSt25BagUrl}
            folder="spotlight/st25"
            previewHeight="h-40"
            helperText="Ảnh chụp bao bì ST25 sắc nét, có logo thương hiệu Ông Cua và tem chống giả."
          />
        </div>
      </div>
    </form>
  );
}