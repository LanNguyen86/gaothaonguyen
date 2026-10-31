import React, { useState, useEffect } from 'react';
import { StoreProvider } from './context/StoreContext';
import Header from './components/Header';
import Hero from './components/Hero';
import TrustBadges from './components/TrustBadges';
import SpotlightST25 from './components/SpotlightST25';
import RiceCatalog from './components/RiceCatalog';
import RiceCalculator from './components/RiceCalculator';
import B2BSection from './components/B2BSection';
import StoreWarehouse from './components/StoreWarehouse';
import Footer from './components/Footer';
import FloatingContactBar from './components/FloatingContactBar';
import ProductDetailModal from './components/ProductDetailModal';
import QuickOrderModal from './components/QuickOrderModal';
import Toast from './components/Toast';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLoginModal from './components/admin/AdminLoginModal';

function MainApp() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try {
      return Boolean(
        localStorage.getItem('thao_nguyen_admin_logged_in') ||
        sessionStorage.getItem('thao_nguyen_admin_logged_in')
      );
    } catch {
      return false;
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [viewMode, setViewMode] = useState(() => {
    const isAuthed = Boolean(
      localStorage.getItem('thao_nguyen_admin_logged_in') ||
      sessionStorage.getItem('thao_nguyen_admin_logged_in')
    );
    return window.location.hash === '#admin' && isAuthed ? 'admin' : 'landing';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [calcTarget, setCalcTarget] = useState(null);
  const [cartCount, setCartCount] = useState(1);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState(null);
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
  const [orderProduct, setOrderProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Handle hash changes for #admin with authentication guard
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        if (isAdminAuthenticated) {
          setViewMode('admin');
        } else {
          setViewMode('landing');
          setIsLoginModalOpen(true);
        }
      } else if (viewMode === 'admin') {
        setViewMode('landing');
      }
    };

    // If loaded initially with #admin and not authed, prompt login
    if (window.location.hash === '#admin' && !isAdminAuthenticated) {
      setIsLoginModalOpen(true);
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAdminAuthenticated, viewMode]);

  const showToast = (message) => {
    setToastMessage(message);
  };

  const handleQuickCalculate = (riceName, price) => {
    setCalcTarget({ riceName, price, timestamp: Date.now() });
    const targetElement = document.getElementById('tinh-tien-nhanh');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const catalogEl = document.getElementById('bang-gia-san-pham');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleOpenDetail = (product) => {
    setSelectedDetailProduct(product);
  };

  const handleOpenQuickOrder = (product = null) => {
    if (product) {
      setOrderProduct(product);
    }
    setIsQuickOrderOpen(true);
  };

  const handleOpenLogin = () => {
    if (isAdminAuthenticated) {
      window.location.hash = '#admin';
      setViewMode('admin');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setViewMode('admin');
    window.location.hash = '#admin';
    showToast('Đăng nhập hệ thống quản trị thành công!');
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('thao_nguyen_admin_logged_in');
      sessionStorage.removeItem('thao_nguyen_admin_logged_in');
    } catch (err) {
      console.warn(err);
    }
    setIsAdminAuthenticated(false);
    setViewMode('landing');
    window.location.hash = '';
    showToast('Đã đăng xuất khỏi tài khoản quản trị!');
  };

  const handleExitAdmin = () => {
    window.location.hash = '';
    setViewMode('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] font-body-md text-body-md text-stone-900 selection:bg-emerald-200 selection:text-emerald-950">
      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage('')}
      />

      {viewMode === 'admin' && isAdminAuthenticated ? (
        <AdminDashboard
          onExitAdmin={handleExitAdmin}
          onLogout={handleLogout}
          onShowToast={showToast}
        />
      ) : (
        <>
          {/* Header & Sticky Nav */}
          <Header
            cartCount={cartCount}
            searchQuery={searchQuery}
            onSearch={handleSearch}
            onOpenCart={() => handleOpenQuickOrder(null)}
            onOpenLogin={handleOpenLogin}
            isAuthenticated={isAdminAuthenticated}
          />

          {/* Main Content Area with Header Spacing */}
          <main className="w-full pt-20 bg-[#f9f9ff]">
            <div className="flex flex-col w-full">
              {/* Hero Section */}
              <Hero />

              {/* 4 Pillars of Trust */}
              <TrustBadges />

              {/* Spotlight ST25 Ong Cua */}
              <SpotlightST25 onSelectRiceForCalculator={handleQuickCalculate} />

              {/* 13 Rice Catalog with Filters */}
              <RiceCatalog
                searchQuery={searchQuery}
                onQuickCalculate={handleQuickCalculate}
                onQuickOrder={handleOpenQuickOrder}
                onSelectDetailProduct={handleOpenDetail}
              />

              {/* Interactive Rice Price Calculator */}
              <RiceCalculator
                initialRiceName={calcTarget?.riceName}
                initialPrice={calcTarget?.price}
              />

              {/* B2B & Wholesale Section */}
              <B2BSection />

              {/* Store Location & Warehouse Maps */}
              <StoreWarehouse />
            </div>
          </main>

          {/* Footer */}
          <Footer onOpenAdmin={handleOpenLogin} />

          {/* Floating Action Buttons (Phone & Zalo & Scroll Top) */}
          <FloatingContactBar />

          {/* Product Detail Modal */}
          {selectedDetailProduct && (
            <ProductDetailModal
              product={selectedDetailProduct}
              onClose={() => setSelectedDetailProduct(null)}
              onCalculate={handleQuickCalculate}
              onQuickOrder={handleOpenQuickOrder}
            />
          )}

          {/* Quick Order Drawer / Modal */}
          <QuickOrderModal
            isOpen={isQuickOrderOpen}
            onClose={() => setIsQuickOrderOpen(false)}
            initialProduct={orderProduct}
            onShowToast={showToast}
          />
        </>
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          if (window.location.hash === '#admin' && !isAdminAuthenticated) {
            window.location.hash = '';
          }
        }}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}