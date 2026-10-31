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
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-[#0a4d15] to-[#0d631b] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Đóng cửa sổ"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          <div className="flex items-center gap-2 font-label-sm text-label-sm uppercase tracking-wider text-amber-300 mb-1 font-bold">
            <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
            <span>Đặt Gạo Giao Tận Nhà Trong 2H</span>
          </div>
          <h3 className="font-headline-lg text-headline-lg text-white font-serif font-bold">
            Thông Tin Đơn Hàng
          </h3>
          <p className="font-body-sm text-body-sm text-emerald-100 mt-1 font-medium">
            Giao tận cửa • Kiểm tra gạo chuẩn dẻo trước khi nhận • Đổi trả 1-1 miễn phí
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[72vh] overflow-y-auto font-body-sm text-body-sm text-stone-800">
          
          {/* Select Rice */}
          <div className="space-y-1.5">
            <label className="font-label-md text-label-md text-stone-900 font-bold flex items-center justify-between">
              <span>Loại gạo chọn mua:</span>
              <span className="text-[#0d631b] font-extrabold">{formatVND(unitPrice)} / kg</span>
            </label>
            <div className="relative">
              <select
                className="w-full bg-stone-50 text-stone-900 font-body-sm text-body-sm px-4 py-3 rounded-xl border border-stone-300 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0d631b] cursor-pointer font-medium"
                value={selectedRiceId}
                onChange={(e) => setSelectedRiceId(e.target.value)}
              >
                {products.map((rice) => (
                  <option key={rice.id} value={rice.id}>
                    {rice.name} — {formatVND(rice.price)}/kg ({rice.textureBadge})
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3.5 top-3 text-stone-500 pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Quantity Stepper & Presets */}
          <div className="space-y-2">
            <label className="font-label-md text-label-md text-stone-900 font-bold">
              Số lượng cần mua (kg):
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setKg(Math.max(1, kg - 5))}
                className="w-11 h-11 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-extrabold text-xl flex items-center justify-center cursor-pointer transition-colors border border-stone-200"
                title="Giảm 5kg"
              >
                -
              </button>
              <div className="flex-1 flex items-center justify-center gap-1.5 bg-stone-50 py-2 rounded-xl border border-stone-300">
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={kg}
                  onChange={(e) => setKg(Math.max(1, Number(e.target.value) || 1))}
                  className="w-20 text-center font-headline-sm text-headline-sm text-[#0d631b] font-extrabold bg-transparent border-0 focus:outline-none"
                />
                <span className="font-label-md text-label-md text-stone-900 font-bold">kg</span>
              </div>
              <button
                type="button"
                onClick={() => setKg(kg + 5)}
                className="w-11 h-11 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-extrabold text-xl flex items-center justify-center cursor-pointer transition-colors border border-stone-200"
                title="Tăng 5kg"
              >
                +
              </button>
            </div>

            {/* Quick buttons */}
            <div className="grid grid-cols-5 gap-2 pt-1">
              {[5, 10, 20, 50, 100].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setKg(preset)}
                  className={`py-2 rounded-lg font-label-sm text-label-sm transition-colors cursor-pointer border ${
                    kg === preset
                      ? 'bg-[#0d631b] text-white font-bold border-[#0d631b]'
                      : 'bg-stone-100 text-stone-800 hover:bg-stone-200 border-stone-200 font-semibold'
                  }`}
                >
                  {preset}kg
                </button>
              ))}
            </div>
          </div>

          {/* Packaging choices */}
          <div className="space-y-1.5">
            <label className="font-label-md text-label-md text-stone-900 font-bold">
              Quy cách đóng gói:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <label
                className={`flex items-center justify-center text-center p-2.5 rounded-xl border cursor-pointer font-label-sm text-label-sm transition-all ${
                  packaging === 'tui-5kg'
                    ? 'border-[#0d631b] bg-emerald-50 text-[#0d631b] font-bold shadow-xs'
                    : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 font-medium'
                }`}
              >
                <input
                  type="radio"
                  name="modal-packaging"
                  value="tui-5kg"
                  checked={packaging === 'tui-5kg'}
                  onChange={() => setPackaging('tui-5kg')}
                  className="sr-only"
                />
                <span>Túi 5kg quai</span>
              </label>

              <label
                className={`flex items-center justify-center text-center p-2.5 rounded-xl border cursor-pointer font-label-sm text-label-sm transition-all ${
                  packaging === 'bao-10kg'
                    ? 'border-[#0d631b] bg-emerald-50 text-[#0d631b] font-bold shadow-xs'
                    : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 font-medium'
                }`}
              >
                <input
                  type="radio"
                  name="modal-packaging"
                  value="bao-10kg"
                  checked={packaging === 'bao-10kg'}
                  onChange={() => setPackaging('bao-10kg')}
                  className="sr-only"
                />
                <span>Bao 10kg</span>
              </label>

              <label
                className={`flex items-center justify-center text-center p-2.5 rounded-xl border cursor-pointer font-label-sm text-label-sm transition-all ${
                  packaging === 'bao-25kg'
                    ? 'border-[#0d631b] bg-emerald-50 text-[#0d631b] font-bold shadow-xs'
                    : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 font-medium'
                }`}
              >
                <input
                  type="radio"
                  name="modal-packaging"
                  value="bao-25kg"
                  checked={packaging === 'bao-25kg'}
                  onChange={() => setPackaging('bao-25kg')}
                  className="sr-only"
                />
                <span>Bao 25kg sỉ</span>
              </label>
            </div>
          </div>

          {/* Customer delivery info (Optional) */}
          <div className="space-y-3 pt-2 border-t border-stone-200">
            <div className="font-label-md text-label-md text-[#0d631b] font-bold">
              Địa chỉ nhận hàng (để nhân viên giao tận tủ bếp):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Tên của bạn (vd: Chị Lan)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-stone-50 text-stone-900 placeholder:text-stone-400 px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0d631b] text-body-sm"
              />
              <input
                type="tel"
                placeholder="Số điện thoại nhận hàng"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-stone-50 text-stone-900 placeholder:text-stone-400 px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0d631b] text-body-sm"
              />
            </div>
            <input
              type="text"
              placeholder="Địa chỉ giao (số nhà, tên đường, phường/quận)"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              className="w-full bg-stone-50 text-stone-900 placeholder:text-stone-400 px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0d631b] text-body-sm"
            />
          </div>

          {/* Pricing & Free Shipping Bar */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
            <div className="flex justify-between items-center text-stone-700">
              <span className="font-medium">Tiền gạo ({kg} kg):</span>
              <span className="font-bold text-stone-900">{formatVND(kg * unitPrice)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-700 font-medium">Phí giao tận nơi:</span>
              <span className={`font-bold ${isFreeShip ? 'text-[#0d631b]' : 'text-[#855300]'}`}>
                {isFreeShip ? 'MIỄN PHÍ SHIP (0đ)' : `${formatVND(shippingFee)} (Nội thành)`}
              </span>
            </div>

            {/* Freeship visual progress bar */}
            <div className="pt-2">
              <div className="flex justify-between text-label-sm text-stone-600 mb-1 font-medium">
                <span>{isFreeShip ? 'Đã đủ điều kiện Freeship!' : `Freeship từ ${freeThreshold}kg (còn thiếu ${remainingKg}kg)`}</span>
                <span className="font-bold text-[#0d631b]">{Math.min(100, Math.round((kg / freeThreshold) * 100))}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isFreeShip ? 'bg-[#0d631b]' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(100, (kg / freeThreshold) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
              <span className="font-headline-sm text-headline-sm text-stone-900 font-bold">
                Tổng thanh toán:
              </span>
              <span className="font-headline-lg text-headline-lg text-[#0d631b] font-extrabold text-2xl">
                {formatVND(totalPrice)}
              </span>
            </div>
          </div>

        </div>

        {/* Footer CTAs */}
        <div className="bg-stone-50 p-4 sm:p-6 border-t border-stone-200 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={handleZaloOrder}
            className="w-full sm:flex-1 py-3.5 px-5 rounded-xl bg-[#0d631b] hover:bg-[#094713] text-white font-headline-sm text-headline-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer font-bold"
          >
            <span className="material-symbols-outlined text-[22px]">send</span>
            <span>Chốt Đơn Qua Zalo</span>
          </button>

          <a
            href={`tel:${storeInfo.hotlineClean}`}
            className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-label-lg text-label-lg flex items-center justify-center gap-2 cursor-pointer transition-colors font-bold shadow-xs"
          >
            <span className="material-symbols-outlined text-[20px]">call</span>
            <span>Gọi {storeInfo.hotline}</span>
          </a>

          <button
            type="button"
            onClick={handleCopyOrder}
            className="w-full sm:w-auto py-3 px-3.5 rounded-xl bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 font-label-md text-label-md flex items-center justify-center gap-1.5 cursor-pointer font-semibold"
            title="Sao chép nội dung đơn hàng"
          >
            <span className="material-symbols-outlined text-[18px]">content_copy</span>
            <span className="hidden sm:inline">Sao chép</span>
          </button>
        </div>

      </div>
    </div>
  );
}