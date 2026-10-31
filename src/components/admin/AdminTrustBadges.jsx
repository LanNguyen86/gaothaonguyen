import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';

export default function AdminTrustBadges({ onShowToast }) {
  const { trustBadges, updateTrustBadges } = useStore();
  const [badges, setBadges] = useState([...trustBadges]);

  const handleFieldChange = (index, field, value) => {
    const updated = [...badges];
    updated[index] = { ...updated[index], [field]: value };
    setBadges(updated);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateTrustBadges(badges);
    if (onShowToast) onShowToast('Đã lưu 4 cam kết vàng!');
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 font-serif">
            Quản Lý 4 Cam Kết Vàng (Pillars of Trust)
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Cấu hình nội dung 4 trụ cột niềm tin: Gạo mới 100%, Không hóa chất, ST25 chính hãng, Giao siêu tốc 2H.
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-[#0d631b] hover:bg-[#094713] text-white text-sm font-bold shadow-xs flex items-center gap-2 cursor-pointer transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">save</span>
          <span>Lưu 4 Cam Kết</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {badges.map((badge, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
              <span className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0d631b] text-[20px]">{badge.icon}</span>
                <span>Cam kết #{idx + 1}</span>
              </span>
              <span className="text-xs text-stone-400 font-mono">icon: {badge.icon}</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Tiêu đề cam kết</label>
              <input
                type="text"
                value={badge.title || ''}
                onChange={(e) => handleFieldChange(idx, 'title', e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm text-stone-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Đoạn văn giải thích cam kết</label>
              <textarea
                rows={3}
                value={badge.desc || ''}
                onChange={(e) => handleFieldChange(idx, 'desc', e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Dòng điểm nhấn xanh (Highlight)</label>
              <input
                type="text"
                value={badge.highlight || ''}
                onChange={(e) => handleFieldChange(idx, 'highlight', e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-[#0d631b] font-bold focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
              />
            </div>
          </div>
        ))}
      </div>
    </form>
  );
}