import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';

export default function AdminOverview({ setActiveTab, onShowToast }) {
  const {
    products,
    updateProductPrice,
    storeInfo,
    updateStoreInfo,
    calculatorConfig,
  } = useStore();

  const [announcementInput, setAnnouncementInput] = useState(storeInfo.announcement || '');
  const [editingPrices, setEditingPrices] = useState({});

  const prices = products.map((p) => p.price);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;
  const avgPrice = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;

  const handlePriceChange = (id, val) => {
    setEditingPrices({ ...editingPrices, [id]: val });
  };

  const handleSavePrice = (id) => {
    const val = editingPrices[id];
    if (val !== undefined && val !== '') {
      updateProductPrice(id, Number(val));
      const next = { ...editingPrices };
      delete next[id];
      setEditingPrices(next);
      if (onShowToast) onShowToast('Đã cập nhật giá gạo thành công!');
    }
  };

  const handleSaveAnnouncement = () => {
    updateStoreInfo({ announcement: announcementInput });
    if (onShowToast) onShowToast('Đã cập nhật thông báo đầu trang!');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Notice Quick Edit */}
      <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1 w-full">
          <div className="text-xs font-bold text-[#0d631b] uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">campaign</span>
            <span>Banner Thông Báo Đầu Trang (Chạy phía trên Navbar)</span>
          </div>
          <input
            type="text"
            value={announcementInput}
            onChange={(e) => setAnnouncementInput(e.target.value)}
            className="w-full bg-white border border-emerald-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
            placeholder="Nhập nội dung thông báo nổi bật..."
          />
        </div>
        <button
          onClick={handleSaveAnnouncement}
          className="px-5 py-2 rounded-xl bg-[#0d631b] hover:bg-[#094713] text-white text-sm font-bold shadow-xs cursor-pointer whitespace-nowrap self-end md:self-auto"
        >
          Lưu thông báo
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Tổng loại gạo</div>
            <div className="text-3xl font-extrabold text-[#0d631b] mt-1">{products.length}</div>
            <div className="text-xs text-stone-500 mt-0.5">Đang niêm yết công khai</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#0d631b] flex items-center justify-center">
            <span className="material-symbols-outlined text-[28px]">rice_bowl</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Giá thấp nhất</div>
            <div className="text-2xl font-extrabold text-[#0d631b] mt-1">{minPrice.toLocaleString('vi-VN')}đ</div>
            <div className="text-xs text-stone-500 mt-0.5">Gạo kinh tế / Quán ăn</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-[#855300] flex items-center justify-center">
            <span className="material-symbols-outlined text-[28px]">trending_down</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Giá cao nhất</div>
            <div className="text-2xl font-extrabold text-amber-700 mt-1">{maxPrice.toLocaleString('vi-VN')}đ</div>
            <div className="text-xs text-stone-500 mt-0.5">ST25 Lúa Tôm Ông Cua</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-[28px]">award_star</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Chính sách Freeship</div>
            <div className="text-2xl font-extrabold text-[#006874] mt-1">{calculatorConfig.freeShipThresholdKg} kg</div>
            <div className="text-xs text-stone-500 mt-0.5">Giao tận bếp trong 2H</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-100 text-[#006874] flex items-center justify-center">
            <span className="material-symbols-outlined text-[28px]">local_shipping</span>
          </div>
        </div>
      </div>

      {/* Quick Price Update Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-stone-50">
          <div>
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0d631b] text-[20px]">edit_note</span>
              <span>Bảng Cập Nhật Nhanh Đơn Giá Hôm Nay</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Chỉnh sửa giá trực tiếp tại đây và bấm "Lưu" để cập nhật ngay trên toàn bộ landing page & máy tính tiền.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('products')}
            className="text-xs font-bold text-[#0d631b] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Quản lý chi tiết 13 loại gạo</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-800">
            <thead className="bg-stone-100 text-xs text-stone-600 uppercase font-bold border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Tên loại gạo</th>
                <th className="py-3 px-4">Đặc tính</th>
                <th className="py-3 px-4">Giá hiện tại</th>
                <th className="py-3 px-4">Đổi giá mới (đ/kg)</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {products.map((rice) => {
                const currentDraft = editingPrices[rice.id] !== undefined ? editingPrices[rice.id] : rice.price;
                const isDirty = editingPrices[rice.id] !== undefined && Number(editingPrices[rice.id]) !== rice.price;

                return (
                  <tr key={rice.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-stone-900">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rice.imageUrl}
                          alt={rice.name}
                          className="w-9 h-9 rounded-lg object-cover border border-stone-200"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/logo.png';
                          }}
                        />
                        <span>{rice.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-stone-600">
                      <span className="inline-block px-2 py-0.5 rounded bg-stone-100 border border-stone-200 font-medium">
                        {rice.textureBadge}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#0d631b]">
                      {rice.price.toLocaleString('vi-VN')}đ
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 max-w-[160px]">
                        <input
                          type="number"
                          step="500"
                          min="1000"
                          value={currentDraft}
                          onChange={(e) => handlePriceChange(rice.id, e.target.value)}
                          className={`w-full bg-stone-50 border rounded-lg px-2.5 py-1 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0d631b] ${
                            isDirty ? 'border-amber-500 bg-amber-50/50 text-amber-900' : 'border-stone-300 text-stone-900'
                          }`}
                        />
                        <span className="text-xs text-stone-500 font-medium">đ</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleSavePrice(rice.id)}
                        disabled={!isDirty}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          isDirty
                            ? 'bg-[#0d631b] hover:bg-[#094713] text-white shadow-xs cursor-pointer'
                            : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                        }`}
                      >
                        Lưu giá
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}