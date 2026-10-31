import React, { useState, useEffect } from 'react';

export default function ProductEditModal({ product, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    category: ['family'],
    badge: '',
    badgeType: 'default',
    packagingSnippet: 'Túi 5kg • 10kg • 25kg',
    textureBadge: '',
    desc: '',
    price: 20000,
    imageUrl: '',
    origin: '',
    softness: 4,
    aroma: 4,
    fluffiness: 2,
    waterRatio: '',
    suitableFor: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name || '',
        category: product.category || ['family'],
        badge: product.badge || '',
        badgeType: product.badgeType || 'default',
        packagingSnippet: product.packagingSnippet || '',
        textureBadge: product.textureBadge || '',
        desc: product.desc || '',
        price: product.price || 20000,
        imageUrl: product.imageUrl || '',
        origin: product.origin || '',
        softness: product.texture?.softness || 4,
        aroma: product.texture?.aroma || 4,
        fluffiness: product.texture?.fluffiness || 2,
        waterRatio: product.waterRatio || '',
        suitableFor: product.suitableFor || '',
      });
    } else {
      setFormData({
        name: '',
        category: ['family'],
        badge: 'Gạo Ngon Tuyển Chọn',
        badgeType: 'default',
        packagingSnippet: 'Túi 5kg • 10kg • 25kg',
        textureBadge: 'Dẻo Thơm • Ngọt Cơm',
        desc: '',
        price: 20000,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgNx_DMD24PnqYVFxm3xJKAozO9ApO-HvO18TpF2HyVRuPBMsIebEbQ5iybw6JYn2mZHXHomhcNbDTOorc5RhKJoKzmsieHO2Mb5untARzothGTTOMKheVSHA5K464eLc6DsrkAkoCUXvMl3x8O1oPrsL2-66YgfgdVTSmEiUgzz3CeqPrQhXWvBN0oT6KQ1XtZy4lIWHpZrCKmlUHApmk4iUGXLcSo4vKqVqcGV4E',
        origin: 'Đồng Bằng Sông Cửu Long',
        softness: 4,
        aroma: 4,
        fluffiness: 2,
        waterRatio: '1 bát gạo : 1.15 bát nước',
        suitableFor: 'Bữa cơm hàng ngày của gia đình',
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...(product ? { id: product.id } : {}),
      name: formData.name,
      category: formData.category,
      badge: formData.badge,
      badgeType: formData.badgeType,
      packagingSnippet: formData.packagingSnippet,
      textureBadge: formData.textureBadge,
      desc: formData.desc,
      price: Number(formData.price) || 0,
      imageUrl: formData.imageUrl,
      origin: formData.origin,
      texture: {
        softness: Number(formData.softness),
        aroma: Number(formData.aroma),
        fluffiness: Number(formData.fluffiness),
      },
      waterRatio: formData.waterRatio,
      suitableFor: formData.suitableFor,
    });
    onClose();
  };

  const toggleCategory = (cat) => {
    setFormData((prev) => {
      const exists = prev.category.includes(cat);
      if (exists && prev.category.length > 1) {
        return { ...prev, category: prev.category.filter((c) => c !== cat) };
      } else if (!exists) {
        return { ...prev, category: [...prev.category, cat] };
      }
      return prev;
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0d631b] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px]">rice_bowl</span>
            <h3 className="font-headline-sm text-headline-sm font-serif font-bold">
              {product ? `Sửa loại gạo: ${product.name}` : 'Thêm loại gạo mới'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto text-sm text-stone-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-900 mb-1">Tên loại gạo *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#0d631b] focus:outline-none"
                placeholder="VD: ST25 Lúa Tôm Ông Cua"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-900 mb-1">Giá bán lẻ (đ / kg) *</label>
              <input
                type="number"
                required
                min="1000"
                step="500"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#0d631b] focus:outline-none text-[#0d631b] font-bold text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-900 mb-1">Huy hiệu trên góc (Badge)</label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#0d631b] focus:outline-none"
                placeholder="VD: BÁN CHẠY NHẤT ★★★★★"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-900 mb-1">Kiểu màu huy hiệu</label>
              <select
                value={formData.badgeType}
                onChange={(e) => setFormData({ ...formData, badgeType: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#0d631b] focus:outline-none"
              >
                <option value="secondary">Vàng cam (Hổ phách - Bán chạy)</option>
                <option value="primary">Xanh lá nhạt (Chuẩn cơm ngon)</option>
                <option value="default">Xám tiêu chuẩn</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-900 mb-1">Đặc tính ngắn (Góc ảnh)</label>
              <input
                type="text"
                value={formData.textureBadge}
                onChange={(e) => setFormData({ ...formData, textureBadge: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#0d631b] focus:outline-none"
                placeholder="VD: Dẻo Nhiều • Thơm Dứa"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-900 mb-1">Quy cách đóng gói hiển thị</label>
              <input
                type="text"
                value={formData.packagingSnippet}
                onChange={(e) => setFormData({ ...formData, packagingSnippet: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#0d631b] focus:outline-none"
                placeholder="VD: Túi 5kg • 10kg • 25kg"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-900 mb-1">Mô tả chi tiết</label>
            <textarea
              rows={2}
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 focus:ring-2 focus:ring-[#0d631b] focus:outline-none"
              placeholder="Mô tả hương vị, hạt cơm khi nấu..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-900 mb-1">Xuất xứ / Vùng trồng</label>
              <input
                type="text"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#0d631b] focus:outline-none"
                placeholder="VD: Sóc Trăng / Long An / Tiền Giang"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-900 mb-1">Đường dẫn ảnh gạo (URL)</label>
              <input
                type="text"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#0d631b] focus:outline-none"
                placeholder="Link ảnh hoặc /logo.png"
              />
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block font-bold text-stone-900 mb-1.5">Danh mục thuộc về (Chọn ít nhất 1):</label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'premium', label: 'Gạo Cao Cấp / Đặc Sản' },
                { id: 'family', label: 'Gạo Gia Đình Dẻo Thơm' },
                { id: 'commercial', label: 'Gạo Quán Ăn - Nở Xốp' },
                { id: 'glutinous', label: 'Nếp & Tấm' },
              ].map((cat) => {
                const isSelected = formData.category.includes(cat.id);
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-emerald-100 border-[#0d631b] text-[#0d631b]'
                        : 'bg-stone-50 border-stone-300 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Texture Meters */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
            <span className="font-bold text-stone-900 block">Thang điểm cảm quan (1 - 5 sao):</span>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-stone-600 font-medium mb-1">
                  Độ dẻo ({formData.softness}/5)
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.softness}
                  onChange={(e) => setFormData({ ...formData, softness: Number(e.target.value) })}
                  className="w-full accent-[#0d631b]"
                />
              </div>
              <div>
                <label className="block text-xs text-stone-600 font-medium mb-1">
                  Hương thơm ({formData.aroma}/5)
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.aroma}
                  onChange={(e) => setFormData({ ...formData, aroma: Number(e.target.value) })}
                  className="w-full accent-[#0d631b]"
                />
              </div>
              <div>
                <label className="block text-xs text-stone-600 font-medium mb-1">
                  Độ tơi xốp ({formData.fluffiness}/5)
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.fluffiness}
                  onChange={(e) => setFormData({ ...formData, fluffiness: Number(e.target.value) })}
                  className="w-full accent-[#0d631b]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-900 mb-1">Tỷ lệ đong nước</label>
              <input
                type="text"
                value={formData.waterRatio}
                onChange={(e) => setFormData({ ...formData, waterRatio: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#0d631b] focus:outline-none"
                placeholder="VD: 1 bát gạo : 1 đến 1.15 bát nước"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-900 mb-1">Phù hợp cho đối tượng</label>
              <input
                type="text"
                value={formData.suitableFor}
                onChange={(e) => setFormData({ ...formData, suitableFor: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#0d631b] focus:outline-none"
                placeholder="VD: Bữa cơm gia đình, người già, trẻ nhỏ..."
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#0d631b] hover:bg-[#094713] text-white font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">check</span>
              <span>{product ? 'Lưu thay đổi' : 'Thêm vào danh sách'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}