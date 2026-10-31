import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export default function Header({
  cartCount = 0,
  onSearch,
  searchQuery = '',
  onOpenCart,
}) {
  const { storeInfo } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const navLinks = [
    { name: "Trang chủ", href: "#hero" },
    { name: "Bảng giá gạo", href: "#bang-gia-san-pham" },
    { name: "Gạo Ông Cua", href: "#gao-ong-cua" },
    { name: "Tính tiền nhanh", href: "#tinh-tien-nhanh" },
    { name: "Chính sách sỉ", href: "#chinh-sach-b2b" },
    { name: "Kho & Liên hệ", href: "#kho-hang" },
  ];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-xs border-b border-stone-200">
      {/* Top Banner */}
      <div className="bg-[#0d631b] text-white py-1.5 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs sm:text-[13px] gap-2">
          <div className="flex items-center gap-2 min-w-0 overflow-hidden">
            <span className="truncate font-medium">
              {storeInfo.announcement || '🌾 Cam kết 100% Gạo Mới Đầu Mùa - Không Đấu Trộn - Giữ Trọn Vị Tự Nhiên'}
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              className="text-amber-300 hover:text-amber-200 text-xs sm:text-[13px] hover:underline flex items-center gap-1 font-bold whitespace-nowrap transition-colors"
              href={`tel:${storeInfo.hotlineClean}`}
            >
              <span className="material-symbols-outlined text-[16px]">phone_in_talk</span>
              <span>Hotline: {storeInfo.hotline}</span>
              {storeInfo.contactPerson && (
                <span className="hidden sm:inline">({storeInfo.contactPerson})</span>
              )}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="h-20 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 lg:gap-3 xl:gap-4">
        {/* Brand & Logo */}
        <a href="#hero" className="flex items-center gap-2 sm:gap-2.5 shrink-0 group cursor-pointer select-none">
          <img
            alt={storeInfo.name}
            className="h-9 sm:h-12 xl:h-14 w-auto object-contain transition-transform group-hover:scale-105 shrink-0"
            src={storeInfo.logoUrl || '/logo.png'}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/logo.png';
            }}
          />
          <div className="flex flex-col justify-center min-w-0">
            <div className="text-[13px] sm:text-sm md:text-base lg:text-sm xl:text-lg text-[#0d631b] leading-tight tracking-tight font-serif font-bold whitespace-nowrap">
              {storeInfo.name}
            </div>
            <div className="text-[10px] xl:text-xs text-[#855300] tracking-wide font-semibold whitespace-nowrap leading-snug hidden xl:block">
              {storeInfo.slogan}
            </div>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 2xl:gap-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              className="px-2 py-1 xl:px-3 xl:py-1.5 text-xs xl:text-sm text-stone-700 hover:text-[#0d631b] hover:bg-stone-100 transition-colors cursor-pointer rounded-lg font-semibold whitespace-nowrap shrink-0"
              href={link.href}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Search, Cart & Mobile Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 xl:gap-2.5 shrink-0">
          {/* Desktop Search Input (xl: 1280px+) */}
          <div className="relative hidden xl:block w-36 2xl:w-44 shrink-0">
            <input
              className="w-full bg-stone-50 text-stone-900 placeholder:text-stone-400 text-xs sm:text-sm pl-8 pr-3 py-1.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0d631b] shadow-xs"
              placeholder="Tìm loại gạo..."
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch && onSearch(e.target.value)}
            />
            <span className="material-symbols-outlined text-stone-400 absolute left-2 top-2 text-[18px]">
              search
            </span>
          </div>

          {/* Search Toggle Icon for < xl */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="xl:hidden p-2 rounded-xl text-stone-600 hover:text-[#0d631b] hover:bg-stone-100 transition-colors cursor-pointer shrink-0"
            aria-label="Tìm kiếm"
            title="Tìm kiếm loại gạo"
          >
            <span className="material-symbols-outlined text-[20px] sm:text-[22px]">search</span>
          </button>

          {/* Cart / Quick Order Button */}
          <button
            onClick={onOpenCart}
            className="relative p-2 sm:p-2.5 rounded-xl bg-stone-100 text-[#0d631b] hover:bg-stone-200 transition-colors flex items-center justify-center cursor-pointer border border-stone-200 shrink-0"
            title="Xem giỏ hàng / Đặt nhanh"
            aria-label="Giỏ hàng"
          >
            <span className="material-symbols-outlined text-[20px] sm:text-[22px]">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-stone-950 text-[10px] sm:text-[11px] w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-bold shadow-xs animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-stone-700 hover:text-[#0d631b] hover:bg-stone-100 transition-colors cursor-pointer shrink-0"
            aria-label="Mở menu"
          >
            <span className="material-symbols-outlined text-[24px] sm:text-[26px]">
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
        <div className="lg:hidden bg-white border-t border-stone-200 px-4 sm:px-6 py-5 shadow-2xl space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={handleNavClick}
                className="px-4 py-3 rounded-xl text-stone-800 text-sm sm:text-base hover:bg-stone-100 hover:text-[#0d631b] transition-colors flex items-center justify-between font-semibold whitespace-nowrap"
              >
                <span>{link.name}</span>
                <span className="material-symbols-outlined text-[18px] text-stone-400">chevron_right</span>
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-stone-200 flex flex-col gap-2.5">
            <a
              href={`tel:${storeInfo.hotlineClean}`}
              className="w-full py-3.5 px-4 rounded-xl bg-[#0d631b] text-white text-sm sm:text-base flex items-center justify-center gap-2 shadow-xs font-bold whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[20px]">call</span>
              <span>Hotline: {storeInfo.hotline}</span>
            </a>

            <a
              href={storeInfo.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-stone-100 text-[#855300] text-sm sm:text-base flex items-center justify-center gap-2 border border-stone-200 font-bold whitespace-nowrap hover:bg-stone-200"
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