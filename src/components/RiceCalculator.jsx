import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

export default function RiceCalculator({ initialRiceName, initialPrice }) {
  const { products, calculatorConfig, storeInfo } = useStore();
  const [selectedRiceIndex, setSelectedRiceIndex] = useState(0);
  const [kg, setKg] = useState(10);
  const [packaging, setPackaging] = useState('tui-5kg');

  // Handle external selection if passed from catalog
  useEffect(() => {
    if (initialRiceName && products.length > 0) {
      const idx = products.findIndex((r) => r.name.toLowerCase().includes(initialRiceName.toLowerCase()));
      if (idx !== -1) {
        setSelectedRiceIndex(idx);
      }
    }
  }, [initialRiceName, products]);

  const currentRice = products[selectedRiceIndex] || products[0] || { name: 'Gạo', price: 20000 };
  const unitPrice = currentRice.price || 20000;
  const isFreeShip = kg >= (calculatorConfig.freeShipThresholdKg || 20);
  const shippingFee = isFreeShip ? 0 : (calculatorConfig.defaultShippingFee || 20000);
  const totalPrice = kg * unitPrice + shippingFee;
  const remainingKgForFreeShip = Math.max(0, (calculatorConfig.freeShipThresholdKg || 20) - kg);

  const formatVND = (num) => (num || 0).toLocaleString('vi-VN') + 'đ';

  const zaloMessage = encodeURIComponent(
    `Chào Chị Thảo Vựa Gạo Thảo Nguyên, tôi muốn đặt: ${kg}kg gạo ${currentRice.name} (Quy cách: ${
      packaging === 'tui-5kg' ? 'Túi 5kg' : packaging === 'bao-10kg' ? 'Bao 10kg' : 'Bao lớn 25kg'
    }). Tổng tính dự kiến: ${formatVND(totalPrice)}. Nhờ chị giao hàng giúp tôi!`
  );

  const zaloOrderUrl = `https://zalo.me/${storeInfo.hotlineClean}?text=${zaloMessage}`;

  return (
    <section className="w-full py-16 lg:py-20 bg-stone-50" id="tinh-tien-nhanh">
      <div className="max-w-7xl mx-auto px-margin">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Calculator Control Panel */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 border border-stone-200">
            <div className="space-y-1">
              <span className="font-label-md text-label-md font-bold uppercase tracking-wider text-[#855300]">
                Dự Toán Đơn Hàng Thông Minh
              </span>
              <h2 className="font-headline-lg text-headline-lg text-stone-900 font-serif font-bold">
                Công Cụ Tính Tiền Gạo Tức Thì
              </h2>
              <p className="font-body-sm text-body-sm text-stone-600">
                Chọn loại gạo, tùy chỉnh số lượng và quy cách đóng gói để nhận ngay tổng chi phí và ưu đãi miễn phí giao hàng.
              </p>
            </div>

            {/* Select Rice Variety */}
            <div className="space-y-2">
              <label className="font-label-lg text-label-lg text-stone-900 font-bold flex items-center justify-between" htmlFor="calc-rice-select">
                <span>1. Chọn loại gạo cần mua:</span>
                <span className="text-[#0d631b] font-extrabold">{formatVND(unitPrice)} / kg</span>
              </label>
              <div className="relative">
                <select
                  className="w-full bg-stone-50 border border-stone-300 text-stone-900 font-body-md text-body-md px-4 py-3.5 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#0d631b] focus:border-[#0d631b] shadow-xs cursor-pointer"
                  id="calc-rice-select"
                  value={selectedRiceIndex}
                  onChange={(e) => setSelectedRiceIndex(Number(e.target.value))}
                >
                  {products.map((r, idx) => (
                    <option key={r.id} value={idx}>
                      {r.name} ({formatVND(r.price)}/kg)
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-4 top-4 text-stone-500 pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-label-lg text-label-lg text-stone-900 font-bold">2. Số lượng đặt mua (kg):</label>
                <div className="flex items-center gap-2">
                  <input
                    className="w-24 text-center font-headline-sm text-headline-sm text-[#0d631b] font-extrabold bg-stone-100 py-1.5 px-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
                    id="calc-kg-input"
                    max="1000"
                    min="1"
                    type="number"
                    value={kg}
                    onChange={(e) => setKg(Math.max(1, Number(e.target.value) || 1))}
                  />
                  <span className="font-label-lg text-label-lg text-stone-900 font-bold">kg</span>
                </div>
              </div>

              {/* Quick kg Buttons */}
              <div className="grid grid-cols-5 gap-2">
                {(calculatorConfig.presetKgs || [5, 10, 20, 50, 100]).map((presetKg) => {
                  const isActive = kg === presetKg;
                  return (
                    <button
                      key={presetKg}
                      onClick={() => setKg(presetKg)}
                      className={`calc-kg-btn py-2.5 rounded-xl font-label-md text-label-md transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#0d631b] text-white font-bold shadow-xs'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold border border-stone-200'
                      }`}
                    >
                      {presetKg}kg
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Packaging Preset Selection */}
            <div className="space-y-2">
              <label className="font-label-lg text-label-lg text-stone-900 font-bold">3. Quy cách đóng bao đóng gói:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors border ${
                    packaging === 'tui-5kg'
                      ? 'bg-emerald-50 border-emerald-500 font-bold text-emerald-950'
                      : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800'
                  }`}
                >
                  <input
                    checked={packaging === 'tui-5kg'}
                    onChange={() => setPackaging('tui-5kg')}
                    className="accent-[#0d631b] w-4 h-4 cursor-pointer"
                    name="packaging"
                    type="radio"
                    value="tui-5kg"
                  />
                  <span className="font-body-sm text-body-sm">Túi 5kg tiện lợi</span>
                </label>
                <label
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors border ${
                    packaging === 'bao-10kg'
                      ? 'bg-emerald-50 border-emerald-500 font-bold text-emerald-950'
                      : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800'
                  }`}
                >
                  <input
                    checked={packaging === 'bao-10kg'}
                    onChange={() => setPackaging('bao-10kg')}
                    className="accent-[#0d631b] w-4 h-4 cursor-pointer"
                    name="packaging"
                    type="radio"
                    value="bao-10kg"
                  />
                  <span className="font-body-sm text-body-sm">Bao 10kg chuẩn</span>
                </label>
                <label
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors border ${
                    packaging === 'bao-25kg'
                      ? 'bg-emerald-50 border-emerald-500 font-bold text-emerald-950'
                      : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800'
                  }`}
                >
                  <input
                    checked={packaging === 'bao-25kg'}
                    onChange={() => setPackaging('bao-25kg')}
                    className="accent-[#0d631b] w-4 h-4 cursor-pointer"
                    name="packaging"
                    type="radio"
                    value="bao-25kg"
                  />
                  <span className="font-body-sm text-body-sm">Bao 25kg - 50kg sỉ</span>
                </label>
              </div>
            </div>

          </div>

          {/* Receipt & Checkout Summary Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-md space-y-6 border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div className="font-headline-sm text-headline-sm text-stone-900 font-serif font-bold">
                Chi Tiết Đơn Tính Nhanh
              </div>
              <span className="material-symbols-outlined text-[#0d631b] text-[28px]">receipt_long</span>
            </div>

            {/* Line items */}
            <div className="space-y-3 font-body-sm text-body-sm">
              <div className="flex justify-between items-center text-stone-600">
                <span>Sản phẩm chọn:</span>
                <span className="font-bold text-stone-900">{currentRice.name}</span>
              </div>
              <div className="flex justify-between items-center text-stone-600">
                <span>Số lượng:</span>
                <span className="font-bold text-stone-900">{kg} kg</span>
              </div>
              <div className="flex justify-between items-center text-stone-600">
                <span>Đơn giá áp dụng:</span>
                <span className="font-bold text-stone-900">{formatVND(unitPrice)}/kg</span>
              </div>
              <div className="flex justify-between items-center text-stone-600">
                <span>Phí vận chuyển:</span>
                <span className={`font-bold ${isFreeShip ? 'text-[#0d631b]' : 'text-[#855300]'}`}>
                  {isFreeShip ? 'MIỄN PHÍ GIAO HÀNG (0đ)' : `${formatVND(shippingFee)} (Nội thành)`}
                </span>
              </div>

              {/* Shipping Promo Notice */}
              <div
                className={`p-3 rounded-xl font-label-sm text-label-sm flex items-center gap-2 border ${
                  isFreeShip
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-950 font-medium'
                    : 'bg-amber-100 border-amber-300 text-amber-950 font-medium'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isFreeShip ? 'verified' : 'info'}
                </span>
                <span>
                  {isFreeShip ? (
                    <>Đơn hàng của bạn đã đủ điều kiện <strong>MIỄN PHÍ VẬN CHUYỂN TẬN NHÀ!</strong></>
                  ) : (
                    <>Đặt thêm <strong>{remainingKgForFreeShip}kg</strong> để được <strong>MIỄN PHÍ SHIP TẬN BẾP</strong>!</>
                  )}
                </span>
              </div>
            </div>

            {/* Total Amount Display */}
            <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 flex flex-col items-center justify-center text-center space-y-1">
              <span className="font-label-sm text-label-sm text-stone-600 uppercase tracking-wider font-bold">
                Tổng Tạm Tính Dự Kiến
              </span>
              <div className="font-headline-xl text-headline-xl text-[#0d631b] font-black tracking-tight text-3xl sm:text-4xl">
                {formatVND(totalPrice)}
              </div>
              <span className="font-label-sm text-label-sm text-stone-500">
                Đã bao gồm VAT & công vác tận nhà
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <a
                className="w-full py-4 rounded-xl bg-[#0d631b] hover:bg-[#094713] text-white font-headline-sm text-headline-sm flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] transition-all cursor-pointer font-bold"
                href={zaloOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="material-symbols-outlined text-[24px]">send</span>
                <span>Chốt Đơn Ngay Qua Zalo</span>
              </a>

              <a
                className="w-full py-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-label-lg text-label-lg flex items-center justify-center gap-2 transition-colors cursor-pointer border border-stone-200 font-bold"
                href={`tel:${storeInfo.hotlineClean}`}
              >
                <span className="material-symbols-outlined text-[20px] text-[#0d631b]">phone_in_talk</span>
                <span>Hotline 24/7: {storeInfo.hotline} ({storeInfo.contactPerson})</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}