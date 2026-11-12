import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { ShopPage } from './components/ShopPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { AdminDashboard } from './components/AdminDashboard';
import { StaticPages } from './components/StaticPages';
import { CartDrawer } from './components/CartDrawer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { activeView } = useStore();

  return (
    <div className="min-h-screen bg-[#0c0d10] text-[#f3f1ec] flex flex-col font-sans selection:bg-[#d4af37]/30 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Router */}
      <main className="flex-1">
        {activeView === 'home' && <HomePage />}
        {activeView === 'shop' && <ShopPage />}
        {activeView === 'product-details' && <ProductDetailPage />}
        {activeView === 'admin' && <AdminDashboard />}
        {activeView === 'about' && <StaticPages page="about" />}
        {activeView === 'contact' && <StaticPages page="contact" />}
        {activeView === 'returns' && <StaticPages page="returns" />}
        {activeView === 'privacy' && <StaticPages page="privacy" />}
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Persistent Floating WhatsApp Quick Button */}
      <FloatingWhatsApp />

      {/* Luxury Footer */}
      <Footer />
    </div>
  );
};

import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </ErrorBoundary>
  );
}
