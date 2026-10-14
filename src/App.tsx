import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { AuthModal } from './components/AuthModal';
import { MenuModal } from './components/MenuModal';
import { BookingModal } from './components/BookingModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { ChefReviewsModal } from './components/ChefReviewsModal';
import { WriteReviewModal } from './components/WriteReviewModal';
import { FloatingCartButton } from './components/FloatingCartButton';
import { ScrollToTop } from './components/ScrollToTop';

import { Home } from './pages/Home';
import { Tiffins } from './pages/Tiffins';
import { Cart } from './pages/Cart';
import { Payment } from './pages/Payment';
import { History } from './pages/History';
import { ChefDashboard } from './pages/ChefDashboard';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-[#FFFDF9] text-[#2C1810] font-['Poppins',sans-serif] antialiased">
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tiffins" element={<Tiffins />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<History />} />
            <Route path="/chef-dashboard" element={<ChefDashboard />} />
          </Routes>
        </main>

        <Footer />

        {/* Global Floating Controls & Modals */}
        <FloatingCartButton />
        <ToastContainer />
        <AuthModal />
        <MenuModal />
        <BookingModal />
        <OrderTrackingModal />
        <ChefReviewsModal />
        <WriteReviewModal />
      </div>
    </Router>
  );
}
