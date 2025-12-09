import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedCollection from './components/FeaturedCollection';
import NewArrivals from './components/NewArrivals';
import BestSellers from './components/BestSellers';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import SEO from './components/SEO';
import TrustBadges from './components/TrustBadges';
import ScrollToTop from './components/ScrollToTop';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const Analytics = lazy(() => import('./pages/admin/Analytics'));
const ProductList = lazy(() => import('./pages/admin/ProductList'));
const ProductForm = lazy(() => import('./pages/admin/ProductForm'));
const OrderList = lazy(() => import('./pages/admin/OrderList'));
const CouponManagement = lazy(() => import('./pages/admin/CouponManagement'));
const LiveTraffic = lazy(() => import('./pages/admin/LiveTraffic'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Shop = lazy(() => import('./pages/Shop'));
const About = lazy(() => import('./pages/About'));
const FAQ = lazy(() => import('./pages/FAQ'));
const ShippingReturns = lazy(() => import('./pages/ShippingReturns'));
const CareInstructions = lazy(() => import('./pages/CareInstructions'));
const Contact = lazy(() => import('./pages/Contact'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));

// User Pages Removed
// const UserLayout = lazy(() => import('./layouts/UserLayout'));
// ... other user pages removed

// const Register = lazy(() => import('./pages/Register'));

// Loading Fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  </div>
);

import { Toaster } from 'react-hot-toast';
import WhatsAppButton from './components/WhatsAppButton';

import useVisitorTracker from './hooks/useVisitorTracker';

import useCurrencyStore from './store/currencyStore';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  useVisitorTracker(); // Initialize tracking
  const initCurrency = useCurrencyStore(state => state.initCurrency);

  React.useEffect(() => {
    initCurrency();
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <Toaster position="top-center" />
        <WhatsAppButton />
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={
              <>
                <Navbar />
                <CartSidebar />
                <main>
                  <ProductDetails />
                </main>
                <Footer />
              </>
            } />
            <Route path="/shop" element={
              <>
                <SEO title="Shop" description="Explore our exclusive collection of luxury watches." />
                <Navbar />
                <CartSidebar />
                <main>
                  <Shop />
                </main>
                <Footer />
              </>
            } />
            <Route path="/about" element={
              <>
                <SEO title="About Us" description="Learn about the craftsmanship behind M Timepiece watches." />
                <Navbar />
                <CartSidebar />
                <main>
                  <About />
                </main>
                <Footer />
              </>
            } />
            <Route path="/faq" element={<><SEO title="FAQ" /><Navbar /><CartSidebar /><main><FAQ /></main><Footer /></>} />
            <Route path="/shipping" element={<><SEO title="Shipping & Returns" /><Navbar /><CartSidebar /><main><ShippingReturns /></main><Footer /></>} />
            <Route path="/care" element={<><SEO title="Care Instructions" /><Navbar /><CartSidebar /><main><CareInstructions /></main><Footer /></>} />
            <Route path="/contact" element={<><SEO title="Contact Us" /><Navbar /><CartSidebar /><main><Contact /></main><Footer /></>} />
            <Route path="/privacy" element={<><SEO title="Privacy Policy" /><Navbar /><CartSidebar /><main><PrivacyPolicy /></main><Footer /></>} />
            <Route path="/terms" element={<><SEO title="Terms of Service" /><Navbar /><CartSidebar /><main><TermsOfService /></main><Footer /></>} />
            <Route path="/login" element={<><SEO title="Login" /><Login /></>} />
            <Route path="/checkout" element={
              <>
                <SEO title="Checkout" />
                <Navbar />
                <main>
                  <Checkout />
                </main>
                <Footer />
              </>
            } />
            <Route path="/track-order" element={
              <>
                <SEO title="Track Order" />
                <Navbar />
                <CartSidebar />
                <main>
                  <OrderTracking />
                </main>
                <Footer />
              </>
            } />
            {/* User Routes Removed */}
             {/* <Route path="/user" element={<UserLayout />}>
              <Route index element={<UserDashboard />} />
              <Route path="orders" element={<Orders />} />
              <Route path="profile" element={<Profile />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="loyalty" element={<LoyaltyPoints />} />
            </Route> */}

            {/* Admin Routes - Protected by Role */}
            <Route element={<ProtectedRoute requireAdmin={true} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Analytics />} />
                <Route path="products" element={<ProductList />} />
                <Route path="products/new" element={<ProductForm />} />
                <Route path="products/edit/:id" element={<ProductForm />} />
                <Route path="orders" element={<OrderList />} />
                <Route path="coupons" element={<CouponManagement />} />
                <Route path="traffic" element={<LiveTraffic />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </div>
    </ThemeProvider>
  );
}

export default App;
