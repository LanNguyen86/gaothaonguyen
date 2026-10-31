import React, { useState, useEffect } from 'react';
import { dbGetOrders, dbUpdateOrderStatus, isSupabaseConfigured } from '../../lib/supabase';

export default function AdminOrders({ onShowToast }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const isCloud = isSupabaseConfigured();

  const loadOrders = async () => {
    setLoading(true);
    const res = await dbGetOrders();
    if (res.success && Array.isArray(res.data)) {
      setOrders(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    const res = await dbUpdateOrderStatus(orderId, newStatus);
    if (res.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (onShowToast) onShowToast('Đã cập nhật trạng thái đơn hàng!');
    } else {
      alert('Lỗi cập nhật trạng thái: ' + res.error);
    }
  };

  const formatVND = (num) => (num || 0).toLocaleString('vi-VN') + 'đ';

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'all') return true;
    return o.status === statusFilter;
  });

  const countPending = orders.filter((o) => o.status === 'pending').length;
  const countDelivering = orders.filter((o) => o.status === 'delivering').length;
  const countCompleted = orders.filter((o) => o.status === 'completed').length;
  const totalRevenue = orders
    .filter((o) => o.status === 'completed')
    .reduce((sum, o) => sum + (Number(o.total_price) || 0), 0);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Chờ xác nhận
          </span>
        );
      case 'confirmed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            Đã xác nhận
          </span>
        );
      case 'delivering':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200 inline-flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">local_shipping</span>
            Đang giao hàng
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-[#0d631b] border border-emerald-200 inline-flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            Đã hoàn thành
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-500 border border-stone-200">
            Đã hủy
          </span>
        );
      default:
        return <span className="text-xs text-stone-600">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 font-serif flex items-center gap-2">
            <span>Quản Lý Đơn Đặt Gạo</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#0d631b] font-sans font-bold">
              {orders.length} đơn
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Xem và xử lý các đơn hàng khách gửi qua form Đặt Gạo Nhanh trên Landing Page.
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 text-xs font-bold shadow-xs cursor-pointer transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          <span>Làm mới danh sách</span>
        </button>
      </div>

      {/* Cloud Status Banner */}
      <div
        className={`p-4 rounded-2xl border text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          isCloud
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
            : 'bg-amber-50/90 border-amber-200 text-amber-950'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span
            className={`w-3 h-3 rounded-full shrink-0 ${
              isCloud ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
            }`}
          ></span>
          <div>
            <div className="font-bold text-sm">
              {isCloud
                ? 'Đã kết nối Supabase Cloud Database'
                : 'Đang chạy chế độ Bộ nhớ tạm (Local Storage)'}
            </div>
            <div className="text-[11px] opacity-80 mt-0.5">
              {isCloud
                ? 'Mọi đơn hàng được lưu trữ an toàn vĩnh viễn trên máy chủ đám mây Supabase PostgreSQL.'
                : 'Để lưu trữ vĩnh viễn trên Cloud, hãy điền VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY vào file .env'}
            </div>
          </div>
        </div>

        {!isCloud && (
          <span className="px-3 py-1 rounded-lg bg-amber-200/60 text-amber-900 font-semibold text-[11px] shrink-0">
            Xem file supabase_schema.sql
          </span>
        )}
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Chờ xác nhận</div>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">{countPending}</div>
          <div className="text-[11px] text-stone-400 mt-0.5">Cần liên hệ khách gấp</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Đang giao hàng</div>
          <div className="text-2xl font-extrabold text-purple-600 mt-1">{countDelivering}</div>
          <div className="text-[11px] text-stone-400 mt-0.5">Shipper đang trên đường</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Đã hoàn thành</div>
          <div className="text-2xl font-extrabold text-[#0d631b] mt-1">{countCompleted}</div>
          <div className="text-[11px] text-stone-400 mt-0.5">Giao thành công</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Doanh thu hoàn tất</div>
          <div className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-1">{formatVND(totalRevenue)}</div>
          <div className="text-[11px] text-stone-400 mt-0.5">Tổng tiền đơn thành công</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
        {[
          { id: 'all', label: `Tất cả (${orders.length})` },
          { id: 'pending', label: `Chờ xử lý (${countPending})` },
          { id: 'delivering', label: `Đang giao (${countDelivering})` },
          { id: 'completed', label: `Hoàn thành (${countCompleted})` },
          { id: 'cancelled', label: 'Đã hủy' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3.5 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === tab.id
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-stone-400 text-sm">
            <span className="material-symbols-outlined text-[32px] animate-spin mb-2 text-[#0d631b]">
              progress_activity
            </span>
            <p>Đang tải danh sách đơn hàng...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-stone-400 space-y-2">
            <span className="material-symbols-outlined text-[48px] text-stone-300">
              receipt_long
            </span>
            <p className="text-sm font-semibold text-stone-600">Chưa có đơn hàng nào trong mục này</p>
            <p className="text-xs text-stone-400">
              Khi khách hàng đặt gạo qua cửa sổ Đặt Hàng Nhanh trên Landing Page, đơn sẽ lập tức xuất hiện tại đây!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 font-bold text-stone-600 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="p-3.5 sm:p-4">Khách hàng & SĐT</th>
                  <th className="p-3.5 sm:p-4">Gạo đặt & Số lượng</th>
                  <th className="p-3.5 sm:p-4">Địa chỉ giao</th>
                  <th className="p-3.5 sm:p-4">Tổng tiền</th>
                  <th className="p-3.5 sm:p-4">Trạng thái</th>
                  <th className="p-3.5 sm:p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 font-medium">
                {filteredOrders.map((order) => {
                  const phoneClean = (order.phone || '').replace(/[^0-9]/g, '');
                  return (
                    <tr key={order.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="p-3.5 sm:p-4 align-top">
                        <div className="font-bold text-stone-900 text-sm">
                          {order.customer_name || 'Khách vãng lai'}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <a
                            href={`tel:${phoneClean}`}
                            className="text-[#0d631b] font-bold hover:underline inline-flex items-center gap-0.5"
                          >
                            <span className="material-symbols-outlined text-[14px]">call</span>
                            <span>{order.phone || 'Chưa có SĐT'}</span>
                          </a>
                          {phoneClean && (
                            <a
                              href={`https://zalo.me/${phoneClean}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 text-[11px] font-bold hover:underline"
                            >
                              Zalo
                            </a>
                          )}
                        </div>
                        <div className="text-[10px] text-stone-400 mt-1">
                          {order.created_at ? new Date(order.created_at).toLocaleString('vi-VN') : ''}
                        </div>
                      </td>

                      <td className="p-3.5 sm:p-4 align-top">
                        <div className="font-bold text-stone-900">{order.rice_name}</div>
                        <div className="text-stone-600 mt-0.5">
                          Số lượng: <strong className="text-emerald-800">{order.quantity_kg} kg</strong>
                          {order.packaging && <span className="text-stone-400"> ({order.packaging})</span>}
                        </div>
                        {order.note && (
                          <div className="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded-lg border border-amber-200 mt-1.5">
                            Ghi chú: {order.note}
                          </div>
                        )}
                      </td>

                      <td className="p-3.5 sm:p-4 align-top max-w-[220px]">
                        <div className="text-stone-800 leading-relaxed text-xs">
                          {order.address || 'Khách nhận tại vựa'}
                        </div>
                      </td>

                      <td className="p-3.5 sm:p-4 align-top whitespace-nowrap">
                        <div className="font-extrabold text-[#0d631b] text-sm">
                          {formatVND(order.total_price)}
                        </div>
                        <div className="text-[11px] text-stone-400 mt-0.5">
                          {order.shipping_fee === 0 ? 'Freeship' : `Ship ${formatVND(order.shipping_fee)}`}
                        </div>
                      </td>

                      <td className="p-3.5 sm:p-4 align-top whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>

                      <td className="p-3.5 sm:p-4 align-top text-right whitespace-nowrap">
                        <select
                          value={order.status || 'pending'}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          className="bg-stone-50 border border-stone-300 rounded-lg px-2 py-1 text-xs font-bold text-stone-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0d631b]"
                        >
                          <option value="pending">Chờ xác nhận</option>
                          <option value="confirmed">Đã xác nhận</option>
                          <option value="delivering">Đang giao hàng</option>
                          <option value="completed">Đã hoàn thành</option>
                          <option value="cancelled">Đã hủy đơn</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
