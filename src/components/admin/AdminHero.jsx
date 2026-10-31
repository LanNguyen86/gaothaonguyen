import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { STORE_INFO } from '../../data/riceData';
import ImageUploadField from './ImageUploadField';

export default function AdminHero({ onShowToast }) {
  const { heroContent, updateHeroContent, storeInfo, updateStoreInfo } = useStore();
  const [formData, setFormData] = useState({ ...heroContent });
  const [heroCookedBowlUrl, setHeroCookedBowlUrl] = useState(storeInfo.heroCookedBowlUrl || STORE_INFO.heroCookedBowlUrl);
  const [heroBgUrl, setHeroBgUrl] = useState(storeInfo.heroBgUrl || STORE_INFO.heroBgUrl);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateHeroContent(formData);
    const storeUpdates = {};
    if (heroCookedBowlUrl !== storeInfo.heroCookedBowlUrl) {
      storeUpdates.heroCookedBowlUrl = heroCookedBowlUrl;
    }
    if (heroBgUrl !== storeInfo.heroBgUrl) {
      storeUpdates.heroBgUrl = heroBgUrl;
    }
    if (Object.keys(storeUpdates).length > 0) {
      updateStoreInfo(storeUpdates);
    }
    if (onShowToast) onShowToast('Đã lưu nội dung Hero Banner thành công!');
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 font-serif">
            Quản Lý Hero Section (Banner Đầu Trang)
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Tùy biến tiêu đề lớn, đoạn giới thiệu, 3 thông số uy tín và hình ảnh bát cơm ST25 nổi bật.
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-[#0d631b] hover:bg-[#094713] text-white text-sm font-bold shadow-xs flex items-center gap-2 cursor-pointer transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">save</span>
          <span>Lưu Cài Đặt Hero</span>
        </button>
      </div>

      {/* Main Headline & Copy */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <h3 className="font-bold text-stone-900 text-base flex items-center gap-2 border-b border-stone-200 pb-3">
          <span className="material-symbols-outlined text-[#0d631b] text-[22px]">title</span>
          <span>Tiêu Đề & Lời Chào Mở Đầu</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Huy hiệu chứng nhận (Badge trái)</label>
            <input
              type="text"
              name="badgeAuthorized"
              value={formData.badgeAuthorized || ''}
              onChange={handleChange}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Huy hiệu giao hàng (Badge phải)</label>
            <input
              type="text"
              name="badgeDelivery"
              value={formData.badgeDelivery || ''}
              onChange={handleChange}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Dòng chữ nhỏ trên tiêu đề (Subhead)</label>
          <input
            type="text"
            name="subhead"
            value={formData.subhead || ''}
            onChange={handleChange}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d631b] font-medium"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Tiêu đề chính dòng 1</label>
            <input
              type="text"
              name="headlinePart1"
              value={formData.headlinePart1 || ''}
              onChange={handleChange}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-base font-serif font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Tiêu đề chính dòng 2 (Chữ xanh lá nổi bật)</label>
            <input
              type="text"
              name="headlinePart2"
              value={formData.headlinePart2 || ''}
              onChange={handleChange}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-base font-serif font-bold text-[#0d631b] focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Đoạn văn mô tả Hero</label>
          <textarea
            rows={3}
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d631b] leading-relaxed"
          />
        </div>
      </div>

      {/* 3 Metric Counters */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <h3 className="font-bold text-stone-900 text-base flex items-center gap-2 border-b border-stone-200 pb-3">
          <span className="material-symbols-outlined text-[#0d631b] text-[22px]">speed</span>
          <span>3 Chỉ Số Thống Kê Uy Tín</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">Chỉ số 1 (Số lớn)</label>
              <input
                type="text"
                name="metric1Value"
                value={formData.metric1Value || ''}
                onChange={handleChange}
                className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-sm font-bold text-[#0d631b]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">Mô tả chỉ số 1</label>
              <input
                type="text"
                name="metric1Label"
                value={formData.metric1Label || ''}
                onChange={handleChange}
                className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-xs text-stone-700"
              />
            </div>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">Chỉ số 2 (Số lớn)</label>
              <input
                type="text"
                name="metric2Value"
                value={formData.metric2Value || ''}
                onChange={handleChange}
                className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-sm font-bold text-[#855300]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">Mô tả chỉ số 2</label>
              <input
                type="text"
                name="metric2Label"
                value={formData.metric2Label || ''}
                onChange={handleChange}
                className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-xs text-stone-700"
              />
            </div>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">Chỉ số 3 (Số lớn)</label>
              <input
                type="text"
                name="metric3Value"
                value={formData.metric3Value || ''}
                onChange={handleChange}
                className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-sm font-bold text-[#0d631b]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">Mô tả chỉ số 3</label>
              <input
                type="text"
                name="metric3Label"
                value={formData.metric3Label || ''}
                onChange={handleChange}
                className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-xs text-stone-700"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hero Visual Card Setting */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
        <h3 className="font-bold text-stone-900 text-base flex items-center gap-2 border-b border-stone-200 pb-3">
          <span className="material-symbols-outlined text-[#0d631b] text-[22px]">image</span>
          <span>Hình Ảnh Trưng Bày Bát Cơm & Nền Hero</span>
        </h3>

        {/* 2 Image Upload Fields: Cooked Rice Bowl & Hero Background */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ImageUploadField
            label="Ảnh Bát Cơm ST25 Nấu Chín Nổi Bật (Card lớn bên phải)"
            value={heroCookedBowlUrl}
            onChange={setHeroCookedBowlUrl}
            defaultUrl={STORE_INFO.heroCookedBowlUrl}
            folder="hero/bowl"
            previewHeight="h-32"
            helperText="Ảnh chụp bát cơm nóng dẻo thơm, hạt cơm ngọc trắng bóng."
          />

          <ImageUploadField
            label="Ảnh Nền Background Hero (Hiệu ứng mờ nghệ thuật)"
            value={heroBgUrl}
            onChange={setHeroBgUrl}
            defaultUrl={STORE_INFO.heroBgUrl}
            folder="hero/bg"
            previewHeight="h-32"
            helperText="Ảnh cánh đồng lúa hoặc bao gạo tạo chiều sâu nghệ thuật phía sau."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Huy hiệu vàng trên ảnh</label>
            <input
              type="text"
              name="cardTag"
              value={formData.cardTag || ''}
              onChange={handleChange}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Tên gạo trên ảnh</label>
            <input
              type="text"
              name="cardTitle"
              value={formData.cardTitle || ''}
              onChange={handleChange}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Mô tả hương vị hạt cơm</label>
            <input
              type="text"
              name="cardSubtitle"
              value={formData.cardSubtitle || ''}
              onChange={handleChange}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
            />
          </div>
        </div>
      </div>
    </form>
  );
}