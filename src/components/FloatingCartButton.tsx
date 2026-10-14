import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const FloatingCartButton: React.FC = () => {
  const { cart } = useAppStore();
  const location = useLocation();

  if (cart.length === 0 || location.pathname === '/cart' || location.pathname === '/payment') {
    return null;
  }

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce((sum, item) => sum + item.itemPrice * item.quantity, 0);

  return (
    <div className="fixed bottom-6 right-6 z-40 md:hidden">
      <Link
        to="/cart"
        className="flex items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-[#D97706] to-[#E07A5F] text-white shadow-2xl hover:scale-105 active:scale-95 transition-all border-2 border-white/40"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-white text-[#D97706] text-[10px] font-extrabold flex items-center justify-center">
            {totalCount}
          </span>
        </div>
        <div className="text-left">
          <span className="text-[10px] uppercase font-bold opacity-80 block leading-tight">View Tiffin Basket</span>
          <span className="text-xs font-bold">₹{totalAmount}</span>
        </div>
        <ArrowRight className="w-4 h-4 ml-1" />
      </Link>
    </div>
  );
};
