import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export default function Header({
  cartCount = 0,
  onSearch,
  searchQuery = '',
  onOpenCart,
  onOpenLogin,
  isAuthenticated = false,
}) {
  const { storeInfo } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const navLinks = [
    { name: "Trang chủ", href: "#hero" },
    { name: "Bảng giá & Sản phẩm", href: "#bang-gia-san-pham" },
    { name: "Gạo Ông Cua", href: "#gao-ong-cua" },
    { name: "Tính tiền nhanh", href: "#tinh-tien-nhanh" },
    { name: "Về chúng tôi", href: "#chinh-sach-b2b" },
    { name: "Liên hệ", href: "#kho-hang" },
  ];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-xs border-b border-stone-200">
      {/* Top Banner */}
      <div className="bg-[#0d631b] text-white py-1.5 px-margin">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-label-md text-label-md">
          <div className="flex items-center gap-2">
            <span className="hidden md:inline font-medium">
              {storeInfo.announcement || '🌾 Cam kết 100% Gạo Mới Đầu Mùa - Không Đấu Trộn - Giữ Trọn Vị Tự Nhiên'}
            </span>
            <span className="md:hidden text-[11px] font-medium truncate max-w-[230px]">
              {storeInfo.announcement || '🌾 Gạo mới vụ mùa thơm ngọt chuẩn vị'}
            </span>
          </div>
          <div className="flex items-center gap-space-lg">
            <a
              className="text-amber-300 font-label-md text-label-md hover:underline flex items-center gap-1 font-bold"
              href={`tel:${storeInfo.hotlineClean}`}
            >
              <span className="material-symbols-outlined text-[16px]">phone_in_talk</span>
              <span>Hotline: {storeInfo.hotline} ({storeInfo.contactPerson})</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="h-20 max-w-7xl mx-auto px-margin flex items-center justify-between gap-space-md">
        {/* Brand & Logo */}
        <a href="#hero" className="flex items-center gap-3 flex-shrink-0 group cursor-pointer">
          <img
            alt={storeInfo.name}
            className="h-12 sm:h-14 w-auto object-contain transition-transform group-hover:scale-105"
            src={storeInfo.logoUrl || '/logo.png'}
          />
          <div className="hidden sm:block">
            <div className="font-headline-sm text-headline-sm text-[#0d631b] leading-tight tracking-tight font-serif font-bold">
              {storeInfo.name.toUpperCase()}
            </div>
            <div className="font-label-sm text-label-sm text-[#855300] tracking-wide font-semibold">
              {storeInfo.slogan}
            </div>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-space-md font-label-lg text-label-lg">
          {navLinks.map((link) => (
            <a
              key={link.name}
              className="px-3 py-1.5 text-stone-700 hover:text-[#0d631b] hover:bg-stone-100 transition-colors cursor-pointer rounded-lg font-semibold"
              href={link.href}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Search, Cart, Login & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop Search Input */}
          <div className="relative hidden xl:block w-44">
            <input
              className="w-full bg-stone-50 text-stone-900 placeholder:text-stone-400 font-body-sm text-body-sm pl-8 pr-3 py-1.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0d631b] shadow-xs"
              placeholder="Tìm loại gạo..."
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch && onSearch(e.target.value)}
            />
            <span className="material-symbols-outlined text-stone-400 absolute left-2 top-2 text-[18px]">
              search
            </span>
          </div>

          {/* Mobile Search Toggle Icon */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="xl:hidden p-2 rounded-lg text-stone-600 hover:text-[#0d631b] hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Tìm kiếm"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>

          {/* Cart / Quick Order Button */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-xl bg-stone-100 text-[#0d631b] hover:bg-stone-200 transition-colors flex items-center justify-center cursor-pointer border border-stone-200"
            title="Xem giỏ hàng / Đặt nhanh"
            aria-label="Giỏ hàng"
          >
            <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-stone-950 font-label-sm text-[11px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-xs animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin Login Button */}
          <button
            onClick={onOpenLogin}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs border active:scale-95 ${
              isAuthenticated
                ? 'bg-emerald-50 text-[#0d631b] border-emerald-300 hover:bg-emerald-100'
                : 'bg-stone-900 hover:bg-stone-800 text-white border-stone-900'
            }`}
            title={isAuthenticated ? 'Đã đăng nhập - Mở trang quản trị' : 'Đăng nhập tài khoản quản trị'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isAuthenticated ? 'admin_panel_settings' : 'lock'}
            </span>
            <span>{isAuthenticated ? 'Vào Quản Trị' : 'Đăng Nhập'}</span>
          </button>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-stone-700 hover:text-[#0d631b] hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Mở menu"
          >
            <span className="material-symbols-outlined text-[26px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Expansion */}
      {mobileSearchOpen && (
        <div className="xl:hidden px-margin pb-3 pt-1 border-t border-stone-200 bg-white animate-in slide-in-from-top-2 duration-150">
          <div className="relative">
            <input
              className="w-full bg-stone-50 text-stone-900 placeholder:text-stone-400 font-body-sm text-body-sm pl-9 pr-8 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0d631b] shadow-xs"
              placeholder="Tìm theo tên gạo, đặc tính (ST25, dẻo, xốp...)"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch && onSearch(e.target.value)}
              autoFocus
            />
            <span className="material-symbols-outlined text-stone-400 absolute left-2.5 top-2.5 text-[18px]">
              search
            </span>
            {searchQuery && (
              <button
                onClick={() => onSearch && onSearch('')}
                className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700"
              >
                <span className="material-symbols-outlined text-[18px]">cancel</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-stone-200 px-margin py-5 shadow-2xl space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={handleNavClick}
                className="px-4 py-3 rounded-xl text-stone-800 font-label-lg text-label-lg hover:bg-stone-100 hover:text-[#0d631b] transition-colors flex items-center justify-between font-semibold"
              >
                <span>{link.name}</span>
                <span className="material-symbols-outlined text-[18px] text-stone-400">chevron_right</span>
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-stone-200 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLogin();
              }}
              className="w-full py-3 px-4 rounded-xl bg-stone-900 text-white font-label-lg text-label-lg flex items-center justify-center gap-2 font-bold cursor-pointer hover:bg-stone-800"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isAuthenticated ? 'admin_panel_settings' : 'lock'}
              </span>
              <span>{isAuthenticated ? 'Mở Trang Quản Trị CMS' : 'Đăng Nhập Quản Trị'}</span>
            </button>

            <a
              href={`tel:${storeInfo.hotlineClean}`}
              className="w-full py-3.5 px-4 rounded-xl bg-[#0d631b] text-white font-headline-sm text-headline-sm flex items-center justify-center gap-2 shadow-xs font-bold"
            >
              <span className="material-symbols-outlined text-[20px]">call</span>
              <span>Hotline: {storeInfo.hotline}</span>
            </a>

            <a
              href={storeInfo.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-stone-100 text-[#855300] font-label-lg text-label-lg flex items-center justify-center gap-2 border border-stone-200 font-bold"
            >
              <span className="material-symbols-outlined text-[20px]">chat</span>
              <span>Nhắn tin Zalo với Chị Thảo</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}