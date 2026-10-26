import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { RoleSwitcherModal } from './components/common/RoleSwitcherModal';
import { CartDrawer } from './components/customer/CartDrawer';
import { ProductDetailModal } from './components/customer/ProductDetailModal';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AccountPage } from './pages/AccountPage';
import { PromotionsPage } from './pages/PromotionsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminMenuPage } from './pages/admin/AdminMenuPage';
import { AdminInventoryPage } from './pages/admin/AdminInventoryPage';
import { AdminPromotionsPage } from './pages/admin/AdminPromotionsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { dataService } from './services/dataService';

type AdminTab = 'dashboard' | 'orders' | 'menu' | 'inventory' | 'promotions' | 'settings' | 'reviews';

const MainAppContent: React.FC = () => {
  const { currentPath, routeParams, openProductCustomizer } = useApp();
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');

  // Handle /admin/* path switching
  useEffect(() => {
    if (currentPath.startsWith('/admin')) {
      const parts = currentPath.split('/').filter(Boolean);
      if (parts[1]) {
        const sub = parts[1] as AdminTab;
        if (['dashboard', 'orders', 'menu', 'inventory', 'promotions', 'settings', 'reviews'].includes(sub)) {
          setAdminTab(sub);
        }
      }
    }
  }, [currentPath]);

  // Handle direct /menu/:productId link
  useEffect(() => {
    if (routeParams.productId) {
      const prod = dataService.getProductById(routeParams.productId);
      if (prod) {
        openProductCustomizer(prod);
      }
    }
  }, [routeParams.productId]);

  const isAdminRoute = currentPath.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <AdminLayout currentTab={adminTab} setCurrentTab={setAdminTab}>
        {adminTab === 'dashboard' && (
          <AdminDashboardPage 
            onGoToOrders={() => setAdminTab('orders')} 
            onGoToInventory={() => setAdminTab('inventory')} 
          />
        )}
        {adminTab === 'orders' && <AdminOrdersPage />}
        {adminTab === 'menu' && <AdminMenuPage />}
        {adminTab === 'inventory' && <AdminInventoryPage />}
        {adminTab === 'promotions' && <AdminPromotionsPage />}
        {adminTab === 'settings' && <AdminSettingsPage />}
        {adminTab === 'reviews' && <AdminReviewsPage />}
      </AdminLayout>
    );
  }

  // Render Customer Routes
  const renderCustomerPage = () => {
    if (currentPath === '/' || currentPath === '') {
      return <HomePage />;
    }
    if (currentPath.startsWith('/menu')) {
      return <MenuPage />;
    }
    if (currentPath === '/checkout') {
      return <CheckoutPage />;
    }
    if (currentPath.startsWith('/order-confirmation')) {
      return <OrderConfirmationPage />;
    }
    if (currentPath.startsWith('/track-order')) {
      return <OrderTrackingPage />;
    }
    if (currentPath.startsWith('/account')) {
      return <AccountPage />;
    }
    if (currentPath === '/promotions') {
      return <PromotionsPage />;
    }
    if (currentPath === '/about') {
      return <AboutPage />;
    }
    if (currentPath === '/contact') {
      return <ContactPage />;
    }

    // Default fallback
    return <HomePage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#10110F] text-[#F4F4EC] selection:bg-[#B7FF00] selection:text-[#10110F]">
      <Navbar />
      <main className="flex-1">
        {renderCustomerPage()}
      </main>
      <Footer />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <ProductDetailModal />
      <RoleSwitcherModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
