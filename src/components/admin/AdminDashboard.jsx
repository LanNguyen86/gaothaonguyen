import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import AdminOverview from './AdminOverview';
import AdminOrders from './AdminOrders';
import AdminProducts from './AdminProducts';
import AdminStoreInfo from './AdminStoreInfo';
import AdminHero from './AdminHero';
import AdminSpotlight from './AdminSpotlight';
import AdminTrustBadges from './AdminTrustBadges';
import AdminCalculator from './AdminCalculator';
import AdminB2B from './AdminB2B';
import AdminWarehouse from './AdminWarehouse';

export default function AdminDashboard({ onExitAdmin, onShowToast, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { storeInfo, resetToDefault, exportData, importData } = useStore();

  const handleReset = () => {
    if (window.confirm('CẢNH BÁO: Bạn có chắc chắn muốn khôi phục toàn bộ nội dung về trạng thái mặc định ban đầu?')) {
      resetToDefault();
      if (onShowToast) onShowToast('Đã khôi phục toàn bộ nội dung mặc định!');
    }
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = importData(event.target.result);
        if (result.success) {
          if (onShowToast) onShowToast('Đã nhập dữ liệu sao lưu thành công!');
        } else {
          alert('Lỗi nhập file: ' + result.error);
        }
      };
      reader.readAsText(file);
    }
  };

  const navItems = [
    { id: 'overview', label: 'Tổng quan & Báo giá nhanh', icon: 'dashboard', color: 'text-[#0d631b]' },
    { id: 'orders', label: 'Quản Lý Đơn Đặt Gạo', icon: 'receipt_long', color: 'text-emerald-700' },
    { id: 'products', label: 'Quản lý 13 Loại Gạo', icon: 'rice_bowl', color: 'text-amber-700' },
    { id: 'store', label: 'Thông tin Vựa Gạo & Liên hệ', icon: 'storefront', color: 'text-blue-700' },
    { id: 'hero', label: 'Banner Đầu Trang (Hero)', icon: 'view_carousel', color: 'text-purple-700' },
    { id: 'spotlight', label: 'Spotlight ST25 Ông Cua', icon: 'award_star', color: 'text-amber-600' },
    { id: 'trust', label: '4 Cam Kết Vàng', icon: 'verified', color: 'text-emerald-700' },
    { id: 'calculator', label: 'Máy Tính Tiền & Freeship', icon: 'calculate', color: 'text-teal-700' },
    { id: 'b2b', label: 'Chính Sách B2B Khách Sỉ', icon: 'corporate_fare', color: 'text-indigo-700' },
    { id: 'warehouse', label: 'Kho Bãi & Bản Đồ', icon: 'location_on', color: 'text-rose-700' },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f8] flex flex-col font-body-md text-stone-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-xs px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100 cursor-pointer"
            aria-label="Mở menu quản trị"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>

          <div className="flex items-center gap-3">
            <img
              src={storeInfo.logoUrl || '/logo.png'}
              alt="Logo"
              className="h-9 w-9 rounded-full object-contain border border-stone-200"
            />
            <div>
              <div className="font-headline-sm text-sm font-bold text-[#0d631b] leading-tight">
                HỆ THỐNG QUẢN TRỊ NỘI DUNG (CMS)
              </div>
              <div className="text-[11px] text-stone-500 font-medium">
                {storeInfo.name} • {storeInfo.hotline}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Export JSON */}
          <button
            onClick={exportData}
            title="Tải xuống tệp sao lưu dữ liệu toàn trang"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-200 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Sao lưu</span>
          </button>

          {/* Import JSON */}
          <label
            title="Khôi phục từ tệp sao lưu JSON"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-200 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">upload</span>
            <span>Khôi phục file</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="sr-only"
            />
          </label>

          {/* Reset to Default */}
          <button
            onClick={handleReset}
            title="Khôi phục toàn bộ về dữ liệu gốc ban đầu"
            className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-stone-500 hover:text-red-700 hover:bg-red-50 text-xs font-semibold cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            <span>Mặc định</span>
          </button>

          {/* Exit to Landing Page */}
          <button
            onClick={onExitAdmin}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-bold border border-stone-200 shadow-xs cursor-pointer transition-all"
            title="Quay lại giao diện Landing Page khách hàng"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
            <span>Xem Website</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            title="Đăng xuất khỏi tài khoản quản trị"
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 text-xs sm:text-sm font-bold border border-red-200 shadow-xs cursor-pointer transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Đăng xuất</span>
          </button>
        </div>
      </header>

      {/* Main Body with Sidebar + Tab Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 shrink-0 bg-white rounded-2xl border border-stone-200 shadow-xs p-3 self-start sticky top-24">
          <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-3 py-2">
            Danh mục quản lý
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-[#0d631b] shadow-xs border border-emerald-200/80'
                      : 'text-stone-700 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-[#0d631b]' : item.color}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-6 pt-4 border-t border-stone-200 px-3">
            <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 text-xs space-y-1 text-stone-700">
              <div className="font-bold text-[#0d631b] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">sync</span>
                <span>Tự động đồng bộ</span>
              </div>
              <p className="text-[11px] leading-relaxed text-stone-600">
                Mọi thay đổi tại đây được lưu ngay vào bộ nhớ máy và hiển thị trực tiếp trên Landing Page!
              </p>
            </div>
          </div>
        </aside>

        {/* Mobile Drawer Sidebar */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden bg-black/60 flex">
            <div className="w-72 bg-white h-full p-4 space-y-4 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div className="font-bold text-stone-900 text-sm">Quản lý chuyên mục</div>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1 rounded-lg text-stone-500 hover:bg-stone-100"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>
                <nav className="mt-4 space-y-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-colors cursor-pointer ${
                        activeTab === item.id
                          ? 'bg-emerald-50 text-[#0d631b] border border-emerald-200'
                          : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-[20px] ${item.color}`}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="pt-3 border-t border-stone-200 space-y-2">
                <button
                  onClick={() => {
                    setMobileSidebarOpen(false);
                    onExitAdmin();
                  }}
                  className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                  <span>Quay lại xem Website</span>
                </button>
                <button
                  onClick={() => {
                    setMobileSidebarOpen(false);
                    onLogout();
                  }}
                  className="w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  <span>Đăng xuất Quản trị</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Tab View */}
        <main className="flex-1 min-w-0">
          {activeTab === 'overview' && (
            <AdminOverview setActiveTab={setActiveTab} onShowToast={onShowToast} />
          )}
          {activeTab === 'orders' && (
            <AdminOrders onShowToast={onShowToast} />
          )}
          {activeTab === 'products' && (
            <AdminProducts onShowToast={onShowToast} />
          )}
          {activeTab === 'store' && (
            <AdminStoreInfo onShowToast={onShowToast} />
          )}
          {activeTab === 'hero' && (
            <AdminHero onShowToast={onShowToast} />
          )}
          {activeTab === 'spotlight' && (
            <AdminSpotlight onShowToast={onShowToast} />
          )}
          {activeTab === 'trust' && (
            <AdminTrustBadges onShowToast={onShowToast} />
          )}
          {activeTab === 'calculator' && (
            <AdminCalculator onShowToast={onShowToast} />
          )}
          {activeTab === 'b2b' && (
            <AdminB2B onShowToast={onShowToast} />
          )}
          {activeTab === 'warehouse' && (
            <AdminWarehouse onShowToast={onShowToast} />
          )}
        </main>
      </div>
    </div>
  );
}