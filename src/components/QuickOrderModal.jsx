import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { dbCreateOrder } from '../lib/supabase';

export default function QuickOrderModal({ isOpen, onClose, initialProduct, onShowToast }) {
  const { storeInfo, products, calculatorConfig } = useStore();

  const [selectedRiceId, setSelectedRiceId] = useState(
    initialProduct?.id || (products[0] ? products[0].id : '')
  );
  const [kg, setKg] = useState(10);
  const [packaging, setPackaging] = useState('tui-5kg');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (initialProduct?.id) {
      setSelectedRiceId(initialProduct.id);
    } else if (products.length > 0 && !selectedRiceId) {
      setSelectedRiceId(products[0].id);
    }
  }, [initialProduct, products]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentRice = products.find((r) => r.id === selectedRiceId) || products[0] || { name: 'Gạo', price: 20000 };
  const unitPrice = currentRice.price || 20000;
  const freeThreshold = calculatorConfig?.freeShipThresholdKg || storeInfo.freeShipThresholdKg || 20;
  const isFreeShip = kg >= freeThreshold;
  const shippingFee = isFreeShip ? 0 : (calculatorConfig?.defaultShippingFee || storeInfo.defaultShippingFee || 20000);
  const totalPrice = kg * unitPrice + shippingFee;
  const remainingKg = Math.max(0, freeThreshold - kg);

  const formatVND = (num) => (num || 0).toLocaleString('vi-VN') + 'đ';

  const packagingName =
    packaging === 'tui-5kg'
      ? 'Túi 5kg có quai'
      : packaging === 'bao-10kg'
      ? 'Bao 10kg chuẩn'
      : 'Bao 25kg - 50kg sỉ';

  const orderSummaryText = `Chào Chị Thảo ${storeInfo.name}, tôi muốn đặt hàng:
- Loại gạo: ${currentRice.name}
- Số lượng: ${kg} kg (${packagingName})
- Đơn giá: ${formatVND(unitPrice)}/kg
- Phí vận chuyển: ${isFreeShip ? 'MIỄN PHÍ SHIP' : formatVND(shippingFee)}
- TỔNG THANH TOÁN: ${formatVND(totalPrice)}
${customerName ? `- Người nhận: ${customerName}` : ''}
${customerPhone ? `- Điện thoại: ${customerPhone}` : ''}
${customerAddress ? `- Địa chỉ giao: ${customerAddress}` : ''}
${note ? `- Ghi chú: ${note}` : ''}`;

  const zaloOrderUrl = `https://zalo.me/${storeInfo.hotlineClean}?text=${encodeURIComponent(orderSummaryText)}`;

  const handleZaloOrder = async (e) => {
    e.preventDefault();
    await dbCreateOrder({
      customer_name: customerName.trim() || 'Khách liên hệ Zalo',
      phone: customerPhone.trim() || '',
      address: customerAddress.trim() || '',
      rice_name: currentRice.name,
      quantity_kg: kg,
      unit_price: unitPrice,
      shipping_fee: shippingFee,
      total_price: totalPrice,
      packaging: packagingName,
      note: note.trim() || '',
      status: 'pending',
    });
    if (onShowToast) {
      onShowToast('Đã lưu đơn hàng vào hệ thống! Đang chuyển sang Zalo...');
    }
    window.open(zaloOrderUrl, '_blank');
  };

  const handleCopyOrder = () => {
    navigator.clipboard.writeText(orderSummaryText);
    if (onShowToast) {
      onShowToast('Đã sao chép nội dung đơn hàng vào bộ nhớ tạm!');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-200 my-auto">
        
        {/* Compact Modern Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-[#0a4d15] to-[#0d631b] text-white px-4 py-3 sm:px-5 sm:py-3.5 relative flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0 pr-6">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-amber-300 shrink-0">
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif font-bold text-sm sm:text-base text-white leading-tight truncate">
                  Đặt Giao Gạo Nhanh Tận Bếp
                </h3>
                <span className="inline-block px-1.5 py-0.2 rounded-full bg-amber-400 text-stone-950 text-[10px] font-extrabold uppercase shrink-0">
                  2 Giờ
                </span>
              </div>
              <p className="text-[11px] text-emerald-100/90 truncate font-medium mt-0.5">
                Kiểm tra gạo chuẩn dẻo trước khi nhận • Đổi trả 1-1 miễn phí
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-black/25 hover:bg-black/45 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Đóng cửa sổ"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        {/* Compact Modal Body */}
        <div className="p-4 sm:p-5 space-y-3 max-h-[calc(90vh-110px)] overflow-y-auto font-body-sm text-body-sm text-stone-800">
          
          {/* Row 1: Gạo & Số lượng kg kết hợp 2 cột */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-start">
            {/* Chọn loại gạo */}
            <div className="sm:col-span-7 space-y-1">
              <label className="text-xs font-bold text-stone-800 flex justify-between items-center">
                <span>Loại gạo chọn mua:</span>
                <span className="text-[#0d631b] font-extrabold">{formatVND(unitPrice)}/kg</span>
              </label>
              <div className="relative">
                <select
                  className="w-full bg-stone-50 text-stone-900 text-xs sm:text-sm font-semibold pl-3 pr-8 py-2 rounded-xl border border-stone-300 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0d631b] cursor-pointer truncate"
                  value={selectedRiceId}
                  onChange={(e) => setSelectedRiceId(e.target.value)}
                >
                  {products.map((rice) => (
                    <option key={rice.id} value={rice.id}>
                      {rice.name} — {formatVND(rice.price)}/kg
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-2 text-stone-500 pointer-events-none text-[18px]">
                  expand_more
                </span>
              </div>
            </div>

            {/* Số lượng kg */}
            <div className="sm:col-span-5 space-y-1">
              <div className="flex justify-between items-center text-xs font-bold text-stone-800">
                <span>Số lượng:</span>
                <span className={`text-[10px] font-semibold ${isFreeShip ? 'text-[#0d631b]' : 'text-amber-800'}`}>
                  {isFreeShip ? '✓ Đủ Freeship' : `Thiếu ${remainingKg}kg`}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setKg(Math.max(1, kg - 5))}
                  className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold text-base flex items-center justify-center border border-stone-300 transition-colors cursor-pointer shrink-0"
                  title="Giảm 5kg"
                >
                  -
                </button>
                <div className="flex-1 flex items-center justify-center bg-stone-50 py-1 rounded-lg border border-stone-300">
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={kg}
                    onChange={(e) => setKg(Math.max(1, Number(e.target.value) || 1))}
                    className="w-12 text-center text-sm font-extrabold text-[#0d631b] bg-transparent border-0 focus:outline-none p-0"
                  />
                  <span className="text-xs font-bold text-stone-700 pr-1">kg</span>
                </div>
                <button
                  type="button"
                  onClick={() => setKg(kg + 5)}
                  className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold text-base flex items-center justify-center border border-stone-300 transition-colors cursor-pointer shrink-0"
                  title="Tăng 5kg"
                >
                  +
                </button>
              </div>
              {/* Quick preset buttons */}
              <div className="flex items-center gap-1 pt-0.5">
                {[5, 10, 20, 50].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setKg(preset)}
                    className={`flex-1 py-0.5 rounded text-[11px] transition-colors cursor-pointer font-bold border ${
                      kg === preset
                        ? 'bg-[#0d631b] text-white border-[#0d631b]'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200 border-stone-200'
                    }`}
                  >
                    {preset}k
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Quy cách đóng gói gọn */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-800">Quy cách đóng gói:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'tui-5kg', label: 'Túi 5kg có quai' },
                { id: 'bao-10kg', label: 'Bao 10kg chuẩn' },
                { id: 'bao-25kg', label: 'Bao 25kg sỉ' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPackaging(opt.id)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all text-center truncate cursor-pointer ${
                    packaging === opt.id
                      ? 'bg-emerald-50 border-[#0d631b] text-[#0d631b] font-bold ring-1 ring-[#0d631b]'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Row 3: Thông tin nhận hàng (Gọn) */}
          <div className="space-y-2 pt-1.5 border-t border-stone-100">
            <div className="flex items-center justify-between text-xs font-bold text-stone-800">
              <span>Địa chỉ nhận hàng (nhân viên vác lên tận bếp):</span>
              <span className="text-[11px] text-stone-500 font-medium">TP.HCM giao trong 2H</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Họ tên (vd: Chị Lan)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-stone-50 text-stone-900 placeholder:text-stone-400 px-3 py-1.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#0d631b] text-xs font-medium"
              />
              <input
                type="tel"
                placeholder="Số điện thoại nhận hàng *"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-stone-50 text-stone-900 placeholder:text-stone-400 px-3 py-1.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#0d631b] text-xs font-medium"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <input
                type="text"
                placeholder="Địa chỉ giao (Số nhà, đường, phường, quận...)"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="sm:col-span-8 w-full bg-stone-50 text-stone-900 placeholder:text-stone-400 px-3 py-1.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#0d631b] text-xs font-medium"
              />
              <input
                type="text"
                placeholder="Ghi chú (lầu, giờ giao...)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="sm:col-span-4 w-full bg-stone-50 text-stone-900 placeholder:text-stone-400 px-3 py-1.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#0d631b] text-xs font-medium"
              />
            </div>
          </div>

          {/* Row 4: Thanh tính tiền ngang gọn */}
          <div className="bg-stone-50 rounded-2xl p-2.5 sm:p-3 border border-stone-200 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-xs text-stone-700 flex items-center gap-1.5">
                <span>Tiền gạo: <strong className="text-stone-900">{formatVND(kg * unitPrice)}</strong></span>
                <span>•</span>
                <span className={isFreeShip ? 'text-[#0d631b] font-bold' : 'text-[#855300] font-semibold'}>
                  {isFreeShip ? 'Freeship (0đ)' : `Ship: +${formatVND(shippingFee)}`}
                </span>
              </div>
              <div className="text-[11px] text-stone-500">
                {isFreeShip ? (
                  <span className="text-[#0d631b] font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    <span>Đã miễn phí ship tận bếp TP.HCM</span>
                  </span>
                ) : (
                  <span>Freeship từ {freeThreshold}kg (đặt thêm {remainingKg}kg để freeship)</span>
                )}
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] text-stone-500 block uppercase tracking-wider font-bold">Tổng thanh toán</span>
              <span className="text-xl sm:text-2xl font-black text-[#0d631b] font-serif leading-none">
                {formatVND(totalPrice)}
              </span>
            </div>
          </div>

        </div>

        {/* Compact Footer CTAs */}
        <div className="bg-stone-50 px-4 py-2.5 sm:px-5 sm:py-3 border-t border-stone-200 flex items-center gap-2">
          <button
            type="button"
            onClick={handleZaloOrder}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#0d631b] hover:bg-[#094713] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-98"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            <span>Chốt Đơn Qua Zalo</span>
          </button>

          <a
            href={`tel:${storeInfo.hotlineClean}`}
            className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">call</span>
            <span className="hidden sm:inline">Gọi</span>
            <span>{storeInfo.hotline}</span>
          </a>

          <button
            type="button"
            onClick={handleCopyOrder}
            className="p-2.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 flex items-center justify-center cursor-pointer shrink-0"
            title="Sao chép nội dung đơn hàng"
          >
            <span className="material-symbols-outlined text-[16px]">content_copy</span>
          </button>
        </div>

      </div>
    </div>
  );
}