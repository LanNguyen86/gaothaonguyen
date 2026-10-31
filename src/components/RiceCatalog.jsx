import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { RICE_FILTER_TABS } from '../data/riceData';

export default function RiceCatalog({ onQuickCalculate, onQuickOrder, onSelectDetailProduct, searchQuery = '' }) {
  const { products } = useStore();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedTaste, setSelectedTaste] = useState('all');

  // Compute category count badges
  const categoryCounts = useMemo(() => {
    const counts = { all: products.length };
    RICE_FILTER_TABS.forEach((tab) => {
      if (tab.id !== 'all') {
        counts[tab.id] = products.filter((p) => p.category?.includes(tab.id)).length;
      }
    });
    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category tab filter
      const matchesCategory =
        selectedFilter === 'all' || product.category?.includes(selectedFilter);

      // Taste profile filter
      let matchesTaste = true;
      if (selectedTaste === 'deo') {
        matchesTaste = (product.texture?.softness || 0) >= 4;
      } else if (selectedTaste === 'xop') {
        matchesTaste = (product.texture?.fluffiness || 0) >= 4;
      } else if (selectedTaste === 'thom') {
        matchesTaste = (product.texture?.aroma || 0) >= 4;
      }

      // Search query filter
      const matchesSearch =
        !searchQuery.trim() ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.textureBadge && product.textureBadge.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.origin && product.origin.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesTaste && matchesSearch;
    });
  }, [selectedFilter, selectedTaste, searchQuery, products]);

  const formatPrice = (price) => {
    return (price || 0).toLocaleString('vi-VN') + 'đ';
  };

  return (
    <section className="w-full py-16 bg-[#f9f9ff]" id="bang-gia-san-pham">
      <div className="max-w-7xl mx-auto px-margin">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-[#0d631b] font-label-md text-label-md font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[18px]">rice_bowl</span>
              <span>Bảng Giá Niêm Yết Hôm Nay</span>
            </div>
            <h2 className="font-headline-xl text-headline-xl text-stone-900 font-serif font-bold">
              {products.length} Loại Gạo Ngon Tuyển Chọn
            </h2>
            <p className="font-body-md text-body-md text-stone-600 max-w-2xl leading-relaxed">
              Bảng giá minh bạch, chuẩn cân ký, bao đổi trả. Hỗ trợ đóng bao 5kg, 10kg, 25kg và 50kg theo yêu cầu riêng của gia đình và đối tác.
            </p>
          </div>

          {/* Live Status Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white text-stone-800 font-label-sm text-label-sm shadow-xs shrink-0 border border-stone-200">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0d631b] animate-pulse"></span>
            <span>Cập nhật hôm nay: <strong>Gạo Vụ Mới Vừa Về Kho</strong></span>
          </div>
        </div>

        {/* Filter Chips by Category */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar" id="rice-filters">
          {RICE_FILTER_TABS.map((tab) => {
            const isActive = selectedFilter === tab.id;
            const count = categoryCounts[tab.id] || 0;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`rice-filter-btn px-4 py-2 rounded-full font-label-lg text-label-lg whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#0d631b] text-white shadow-xs font-bold scale-[1.02]'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 font-medium'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Taste Profile Tags */}
        <div className="flex flex-wrap items-center gap-2 text-xs mb-8 text-stone-600">
          <span className="font-semibold text-stone-700 flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">tune</span> Lọc theo gu cơm:
          </span>
          <button
            onClick={() => setSelectedTaste('all')}
            className={`px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
              selectedTaste === 'all'
                ? 'bg-stone-800 text-white font-bold border-stone-800'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            Tất cả gu
          </button>
          <button
            onClick={() => setSelectedTaste('deo')}
            className={`px-3 py-1 rounded-lg border transition-colors cursor-pointer flex items-center gap-1 ${
              selectedTaste === 'deo'
                ? 'bg-[#0d631b] text-white font-bold border-[#0d631b]'
                : 'bg-white border-stone-200 text-[#0d631b] hover:bg-emerald-50 font-medium'
            }`}
          >
            🍚 Dẻo nhiều (ST25, ST21, Nàng Hoa...)
          </button>
          <button
            onClick={() => setSelectedTaste('xop')}
            className={`px-3 py-1 rounded-lg border transition-colors cursor-pointer flex items-center gap-1 ${
              selectedTaste === 'xop'
                ? 'bg-[#855300] text-white font-bold border-[#855300]'
                : 'bg-white border-stone-200 text-[#855300] hover:bg-amber-50 font-medium'
            }`}
          >
            🍛 Xốp nở ráo hạt (Tài Nguyên, Hàm Châu, 64 Dứa...)
          </button>
          <button
            onClick={() => setSelectedTaste('thom')}
            className={`px-3 py-1 rounded-lg border transition-colors cursor-pointer flex items-center gap-1 ${
              selectedTaste === 'thom'
                ? 'bg-[#006874] text-white font-bold border-[#006874]'
                : 'bg-white border-stone-200 text-[#006874] hover:bg-teal-50 font-medium'
            }`}
          >
            ✨ Thơm hoa lài / lá dứa (ST25, Nàng Hương...)
          </button>
        </div>

        {/* Empty state when searching */}
        {filteredProducts.length === 0 && (
          <div className="py-14 text-center bg-white rounded-3xl p-8 max-w-md mx-auto border border-stone-200 space-y-3 shadow-xs">
            <span className="material-symbols-outlined text-[48px] text-stone-400">search_off</span>
            <div className="font-headline-sm text-headline-sm text-stone-900 font-bold font-serif">Không tìm thấy loại gạo phù hợp</div>
            <p className="font-body-sm text-body-sm text-stone-600">
              Không có loại gạo nào khớp với bộ lọc hoặc từ khóa "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSelectedFilter('all');
                setSelectedTaste('all');
              }}
              className="mt-2 px-5 py-2.5 rounded-xl bg-[#0d631b] text-white font-label-md text-label-md cursor-pointer hover:bg-[#094713] transition-colors font-bold"
            >
              Xem tất cả các loại gạo
            </button>
          </div>
        )}

        {/* Rice Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="rice-grid">
          {filteredProducts.map((rice) => (
            <div
              key={rice.id}
              className="rice-card bg-white rounded-2xl p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group border border-stone-200 hover:border-emerald-500/50 hover:-translate-y-1"
            >
              <div>
                {/* Top Badge & Packaging */}
                <div className="flex justify-between items-start gap-2 mb-3">
                  <span
                    className={`inline-block px-2.5 py-1 rounded font-label-sm text-label-sm font-bold uppercase shadow-xs ${
                      rice.badgeType === 'secondary'
                        ? 'bg-amber-600 text-white'
                        : rice.badgeType === 'primary'
                        ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                        : 'bg-stone-100 text-stone-800 border border-stone-200'
                    }`}
                  >
                    {rice.badge || 'Gạo Tuyển Chọn'}
                  </span>
                  <span className="font-label-sm text-label-sm text-[#0d631b] font-bold">
                    {rice.packagingSnippet}
                  </span>
                </div>

                {/* Rice Image with Hover Zoom & Texture Tag */}
                <div
                  className="h-44 rounded-xl overflow-hidden mb-4 relative bg-stone-100 cursor-pointer"
                  onClick={() => onSelectDetailProduct && onSelectDetailProduct(rice)}
                  title="Bấm để xem chi tiết hạt gạo"
                >
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={rice.name}
                    src={rice.imageUrl}
                    loading="lazy"
                  />
                  {rice.textureBadge && (
                    <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-white/95 font-label-sm text-label-sm text-stone-900 font-bold backdrop-blur-sm shadow-xs border border-stone-200">
                      {rice.textureBadge}
                    </span>
                  )}
                  <span className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                  </span>
                </div>

                {/* Name & Short Description */}
                <h3
                  className="font-headline-sm text-headline-sm text-stone-900 mb-1 font-serif font-bold group-hover:text-[#0d631b] transition-colors cursor-pointer"
                  onClick={() => onSelectDetailProduct && onSelectDetailProduct(rice)}
                >
                  {rice.name}
                </h3>
                <p className="font-body-sm text-body-sm text-stone-600 mb-4 line-clamp-2 leading-relaxed">
                  {rice.desc}
                </p>

                {/* Detail inspection link */}
                <button
                  type="button"
                  onClick={() => onSelectDetailProduct && onSelectDetailProduct(rice)}
                  className="text-[#0d631b] hover:text-[#094713] font-label-sm text-label-sm flex items-center gap-1 mb-3 cursor-pointer font-bold"
                >
                  <span>Xem đặc tính & cách nấu</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>

              {/* Price & Actions */}
              <div className="space-y-3 pt-3 border-t border-stone-200">
                <div className="flex items-baseline justify-between">
                  <span className="font-label-sm text-label-sm text-stone-500 font-medium">Đơn giá bán lẻ:</span>
                  <div className="text-right">
                    <span className="font-headline-lg text-headline-lg text-[#0d631b] font-extrabold text-xl">
                      {formatPrice(rice.price)}
                    </span>
                    <span className="font-label-sm text-label-sm text-stone-500">/kg</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#0d631b] font-label-md text-label-md transition-colors flex items-center justify-center gap-1 cursor-pointer border border-stone-200 active:scale-95 font-bold"
                    onClick={() => onQuickCalculate(rice.name, rice.price)}
                    title="Tính tiền nhanh với loại gạo này"
                  >
                    <span className="material-symbols-outlined text-[16px]">calculate</span>
                    <span>Tính Tiền</span>
                  </button>

                  <button
                    className="w-full py-2.5 rounded-xl bg-[#0d631b] hover:bg-[#094713] text-white font-label-md text-label-md transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs active:scale-95 font-bold"
                    onClick={() => onQuickOrder && onQuickOrder(rice)}
                    title="Đặt mua loại gạo này ngay"
                  >
                    <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
                    <span>Đặt Mua</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}