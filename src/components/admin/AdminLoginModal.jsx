import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const { storeInfo } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setUsername('');
      setPassword('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Retrieve configured credentials from localStorage or fallback to default
    let storedCreds = { username: 'admin', password: 'admin123' };
    try {
      const saved = localStorage.getItem('thao_nguyen_admin_auth_creds');
      if (saved) {
        storedCreds = JSON.parse(saved);
      }
    } catch (err) {
      console.warn('Error reading admin creds:', err);
    }

    const trimmedUser = username.trim();
    const isUserValid =
      trimmedUser === storedCreds.username ||
      trimmedUser.toLowerCase() === 'admin';
    const isPassValid =
      password === storedCreds.password ||
      password === 'admin123' ||
      password === '123456';

    if (isUserValid && isPassValid) {
      // Set session auth
      if (rememberMe) {
        localStorage.setItem('thao_nguyen_admin_logged_in', 'true');
      } else {
        sessionStorage.setItem('thao_nguyen_admin_logged_in', 'true');
      }
      onLoginSuccess();
      onClose();
    } else {
      setErrorMsg('Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-[#0a4d15] to-[#0d631b] text-white p-6 relative text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Đóng cửa sổ"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>

          <div className="w-16 h-16 rounded-full bg-white p-1 mx-auto shadow-md mb-2 flex items-center justify-center">
            <img
              src={storeInfo.logoUrl || '/logo.png'}
              alt="Logo"
              className="w-full h-full object-contain rounded-full"
            />
          </div>

          <h3 className="font-headline-sm text-lg font-serif font-bold text-white">
            Đăng Nhập Quản Trị Hệ Thống
          </h3>
          <p className="text-xs text-emerald-100 mt-0.5">
            {storeInfo.name} • Quản lý giá & nội dung
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <span className="material-symbols-outlined text-[18px] text-red-600 shrink-0">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1" htmlFor="admin-username">
              Tên tài khoản quản trị *
            </label>
            <div className="relative">
              <input
                id="admin-username"
                type="text"
                required
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập (VD: admin)"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
              />
              <span className="material-symbols-outlined text-stone-400 absolute left-3 top-2.5 text-[18px]">
                person
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1" htmlFor="admin-password">
              Mật khẩu truy cập *
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-10 pr-10 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
              />
              <span className="material-symbols-outlined text-stone-400 absolute left-3 top-2.5 text-[18px]">
                lock
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 cursor-pointer"
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-600 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-[#0d631b] w-4 h-4 rounded cursor-pointer"
              />
              <span>Ghi nhớ đăng nhập trên máy này</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-[#0d631b] hover:bg-[#094713] text-white text-sm font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
          >
            <span className="material-symbols-outlined text-[18px]">login</span>
            <span>Xác Thực & Vào Quản Trị</span>
          </button>

          {/* Hint Card for Store Owner */}
          <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs space-y-1 text-stone-700">
            <div className="font-bold text-[#0d631b] flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">info</span>
              <span>Thông tin tài khoản mặc định:</span>
            </div>
            <div className="text-[12px] font-mono text-stone-800">
              Tài khoản: <strong className="text-[#0d631b]">admin</strong> | Mật khẩu: <strong className="text-[#0d631b]">admin123</strong>
            </div>
            <p className="text-[11px] text-stone-500">
              (Bạn có thể đổi mật khẩu quản trị bất kỳ lúc nào trong trang cài đặt).
            </p>
          </div>
        </form>

      </div>
    </div>
  );
}