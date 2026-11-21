import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/layout/ToastContainer';
import { CartDrawer } from './components/cart/CartDrawer';
import { AuthModal } from './components/modals/AuthModal';
import { QuickViewModal } from './components/modals/QuickViewModal';

// Pages
import { HomePage } from './components/home/HomePage';
import { ShopPage } from './components/shop/ShopPage';
import { CategoryPage } from './components/shop/CategoryPage';
import { CarBatteriesPage } from './components/categories/CarBatteriesPage';
import { BikeBatteriesPage } from './components/categories/BikeBatteriesPage';
import { InverterBatteriesPage } from './components/categories/InverterBatteriesPage';
import { LithiumBatteriesPage } from './components/categories/LithiumBatteriesPage';
import { SolarBatteriesPage } from './components/categories/SolarBatteriesPage';
import { IndustrialBatteriesPage } from './components/categories/IndustrialBatteriesPage';
import { UPSBatteriesPage } from './components/categories/UPSBatteriesPage';
import { AccessoriesPage } from './components/categories/AccessoriesPage';
import { BrowseAllBatteriesPage } from './components/categories/BrowseAllBatteriesPage';
import { ProductDetailPage } from './components/product/ProductDetailPage';
import { ComparePage } from './components/compare/ComparePage';
import { CartPage } from './components/cart/CartPage';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { AccountDashboard } from './components/account/AccountDashboard';
import { OrderTrackingPage } from './components/tracking/OrderTrackingPage';
import { AboutPage } from './components/about/AboutPage';
import { ContactPage } from './components/contact/ContactPage';
import { BlogListPage, BlogDetailPage } from './components/blog/BlogListPage';
import { BuyingGuidePage } from './components/pages/BuyingGuidePage';
import { MaintenanceGuidePage } from './components/pages/MaintenanceGuidePage';
import { FAQPage } from './components/pages/FAQPage';
import { PolicyPages } from './components/pages/PolicyPages';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { BrandsPage } from './components/pages/BrandsPage';
import { OffersPage } from './components/pages/OffersPage';
import { NotFoundPage } from './components/pages/NotFoundPage';
import { isDedicatedCategoryPage } from './utils/router';

import { AnimatePresence } from 'motion/react';
import { PageTransition } from './components/layout/PageTransition';

// Mobile bottom bar icons
import { Home, Grid, ShoppingBag, Truck, User } from 'lucide-react';

const MainContent: React.FC = () => {
  const { page, pageParams, navigate, cartItemCount, setIsCartOpen } = useStore();

  const pageKey =
    page === 'category'
      ? `category-${pageParams?.category || ''}`
      : page === 'blog-detail'
      ? `blog-detail-${pageParams?.slug || ''}`
      : page;

  const renderCurrentPage = () => {
    switch (page) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'all-batteries':
        return <BrowseAllBatteriesPage />;
      case 'car-batteries':
        return <CarBatteriesPage />;
      case 'bike-batteries':
        return <BikeBatteriesPage />;
      case 'inverter-batteries':
        return <InverterBatteriesPage />;
      case 'lithium-batteries':
        return <LithiumBatteriesPage />;
      case 'solar-batteries':
        return <SolarBatteriesPage />;
      case 'industrial-batteries':
        return <IndustrialBatteriesPage />;
      case 'ups-batteries':
        return <UPSBatteriesPage />;
      case 'accessories':
        return <AccessoriesPage />;
      case 'brands':
        return <BrandsPage />;
      case 'offers':
        return <OffersPage />;
      case 'category':
        return <CategoryPage />;
      case 'product-detail':
        return <ProductDetailPage />;
      case 'compare':
        return <ComparePage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'account':
        return <AccountDashboard />;
      case 'tracking':
        return <OrderTrackingPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'blog':
        return <BlogListPage />;
      case 'blog-detail':
        return <BlogDetailPage />;
      case 'buying-guide':
        return <BuyingGuidePage />;
      case 'maintenance-guide':
        return <MaintenanceGuidePage />;
      case 'faq':
        return <FAQPage />;
      case 'policy':
        return <PolicyPages />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <NotFoundPage />;
    }
  };

  const isProductDetail = page === 'product-detail';

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#121417] selection:bg-[#D6B98C] selection:text-[#121417]">
      {!isProductDetail && <AnnouncementBar />}
      {!isProductDetail && <Navbar />}

      <main
        className={`flex-1 flex flex-col overflow-x-clip ${
          isProductDetail ? '' : 'pb-20 sm:pb-0'
        }`}
      >
        {isProductDetail ? (
          <ProductDetailPage key={pageParams?.productId || 'default'} />
        ) : page === 'home' ? (
          <HomePage />
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <PageTransition pageKey={pageKey}>
              {renderCurrentPage()}
            </PageTransition>
          </AnimatePresence>
        )}
      </main>

      {!isProductDetail && <Footer />}

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <AuthModal />
      <QuickViewModal />
      <ToastContainer />

      {/* Mobile Bottom Quick Navigation (Ergonomic Thumb Zone, >=44px hitboxes, respects 15% viewport cap) */}
      {!isProductDetail && (
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 h-16 px-1 flex items-stretch justify-around pb-[max(0.25rem,env(safe-area-inset-bottom))] shadow-xl">
        <button
          onClick={() => navigate('home')}
          className={`flex-1 min-h-[44px] flex flex-col items-center justify-center py-1 text-[11px] font-medium transition-all active:scale-95 ${
            page === 'home' ? 'text-[#B59562]' : 'text-gray-500 hover:text-gray-900'
          }`}
          aria-label="Home"
        >
          <Home className="w-4 h-4 mb-1" />
          <span>Home</span>
          {page === 'home' && <span className="w-1 h-1 rounded-full bg-[#B59562] mt-0.5" />}
        </button>

        <button
          onClick={() => navigate('all-batteries')}
          className={`flex-1 min-h-[44px] flex flex-col items-center justify-center py-1 text-[11px] font-medium transition-all active:scale-95 ${
            page === 'shop' || page === 'all-batteries' || page === 'category' || isDedicatedCategoryPage(page)
              ? 'text-[#B59562]'
              : 'text-gray-500 hover:text-gray-900'
          }`}
          aria-label="Shop Batteries"
        >
          <Grid className="w-4 h-4 mb-1" />
          <span>Shop</span>
          {(page === 'shop' || page === 'all-batteries' || page === 'category' || isDedicatedCategoryPage(page)) && (
            <span className="w-1 h-1 rounded-full bg-[#B59562] mt-0.5" />
          )}
        </button>

        <button
          onClick={() => navigate('tracking')}
          className={`relative flex-1 min-h-[44px] flex flex-col items-center justify-center py-1 text-[11px] font-medium transition-all active:scale-95 ${
            page === 'tracking' ? 'text-[#B59562]' : 'text-gray-500 hover:text-gray-900'
          }`}
          aria-label="Track Order"
        >
          <div className="relative">
            <Truck className="w-4 h-4 mb-1" />
          </div>
          <span>Track</span>
          {page === 'tracking' && <span className="w-1 h-1 rounded-full bg-[#B59562] mt-0.5" />}
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex-1 min-h-[44px] flex flex-col items-center justify-center py-1 text-[11px] font-medium text-gray-500 hover:text-gray-900 active:scale-95 transition-all"
          aria-label="Open Shopping Cart"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4 mb-1 text-[#B59562]" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#121417] text-[#D6B98C] text-[9px] font-bold px-1 min-w-[14px] h-[14px] flex items-center justify-center rounded-full font-mono">
                {cartItemCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </button>

        <button
          onClick={() => navigate('account')}
          className={`flex-1 min-h-[44px] flex flex-col items-center justify-center py-1 text-[11px] font-medium transition-all active:scale-95 ${
            page === 'account' ? 'text-[#B59562]' : 'text-gray-500 hover:text-gray-900'
          }`}
          aria-label="Account Profile"
        >
          <User className="w-4 h-4 mb-1" />
          <span>Account</span>
          {page === 'account' && <span className="w-1 h-1 rounded-full bg-[#B59562] mt-0.5" />}
        </button>
        </nav>
      )}
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <MainContent />
      </StoreProvider>
    </ErrorBoundary>
  );
}
