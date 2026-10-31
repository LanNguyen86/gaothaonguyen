import React, { useEffect } from 'react';
import { STORE_INFO } from '../data/riceData';

export default function ProductDetailModal({ product, onClose, onCalculate, onQuickOrder }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const renderMeter = (score = 4) => {
    return (
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((lvl) => (
          <span
            key={lvl}
            className={`w-3.5 h-3.5 rounded-full inline-block ${
              lvl <= score ? 'bg-[#0d631b]' : 'bg-stone-200'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatVND = (num) => num.toLocaleString('vi-VN') + 'đ';

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-[#0a4d15] to-[#0d631b] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Đóng cửa sổ"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          <div className="inline-block px-3 py-0.5 rounded-full bg-white/20 text-white font-label-sm text-label-sm font-bold uppercase tracking-wider mb-2 backdrop-blur-sm">
            Xuất xứ: {product.origin}
          </div>
          <h3 className="font-headline-lg text-headline-lg text-white font-serif font-bold">
            {product.name}
          </h3>
          <div className="font-body-sm text-body-sm text-emerald-100 mt-1 font-medium">
            {product.textureBadge} • {product.packagingSnippet}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[72vh] overflow-y-auto">
          {/* Main Grid: Image + Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            <div className="sm:col-span-5 h-48 sm:h-56 rounded-2xl overflow-hidden bg-stone-100 relative border border-stone-200">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/logo.png';
                }}
              />
              <span className="absolute top-2 left-2 px-2.5 py-1 rounded bg-amber-500 text-stone-950 font-label-sm text-label-sm font-extrabold shadow-sm">
                {product.badge}
              </span>
            </div>

            <div className="sm:col-span-7 space-y-4">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2.5">
                <div className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-[#855300]">
                  Thang Điểm Cơm Ngon (1 - 5)
                </div>
                <div className="flex items-center justify-between text-body-sm text-stone-800">
                  <span className="font-medium">Độ dẻo & dính cơm:</span>
                  {renderMeter(product.texture?.softness || 4)}
                </div>
                <div className="flex items-center justify-between text-body-sm text-stone-800">
                  <span className="font-medium">Hương thơm tự nhiên:</span>
                  {renderMeter(product.texture?.aroma || 4)}
                </div>
                <div className="flex items-center justify-between text-body-sm text-stone-800">
                  <span className="font-medium">Độ tơi xốp & nở cơm:</span>
                  {renderMeter(product.texture?.fluffiness || 2)}
                </div>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <span className="font-body-sm text-body-sm text-stone-500 font-medium">Giá niêm yết:</span>
                <div className="text-right">
                  <span className="font-headline-lg text-headline-lg text-[#0d631b] font-extrabold text-2xl">
                    {formatVND(product.price)}
                  </span>
                  <span className="font-label-sm text-label-sm text-stone-500 font-medium">/kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Descriptions */}
          <div className="space-y-4 pt-2 border-t border-stone-200 font-body-sm text-body-sm">
            <div>
              <div className="font-label-lg text-label-lg text-[#0d631b] font-bold flex items-center gap-1.5 mb-1.5">
                <span className="material-symbols-outlined text-[20px]">info</span>
                <span>Đặc tính hạt gạo & khi nấu chín:</span>
              </div>
              <p className="text-stone-700 leading-relaxed font-body-md">
                {product.desc}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
                <div className="font-label-md text-label-md text-[#0d631b] font-bold flex items-center gap-1.5 mb-1">
                  <span className="material-symbols-outlined text-[18px]">water_drop</span>
                  <span>Tỷ lệ đong nước chuẩn:</span>
                </div>
                <div className="text-stone-800 text-body-sm font-medium">
                  {product.waterRatio || '1 bát gạo : 1.1 đến 1.2 bát nước'}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80">
                <div className="font-label-md text-label-md text-[#855300] font-bold flex items-center gap-1.5 mb-1">
                  <span className="material-symbols-outlined text-[18px]">family_restroom</span>
                  <span>Phù hợp nhất cho:</span>
                </div>
                <div className="text-stone-800 text-body-sm font-medium">
                  {product.suitableFor || 'Bữa cơm hàng ngày của gia đình, người lớn tuổi và trẻ nhỏ.'}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-stone-50 p-4 sm:p-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              if (onCalculate) onCalculate(product.name, product.price);
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-stone-100 text-stone-900 border border-stone-300 font-label-lg text-label-lg flex items-center justify-center gap-2 cursor-pointer font-bold"
          >
            <span className="material-symbols-outlined text-[18px] text-[#0d631b]">calculate</span>
            <span>Tính tiền đơn hàng</span>
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2.5">
            <button
              onClick={() => {
                onClose();
                if (onQuickOrder) onQuickOrder(product);
              }}
              className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-[#0d631b] hover:bg-[#094713] text-white font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-sm font-bold cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
              <span>Đặt mua loại gạo này</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}