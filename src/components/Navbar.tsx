import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, User as UserIcon, MapPin, ChefHat, LogOut, Menu, X, History, UtensilsCrossed, Star, UserCheck } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { VADODARA_AREAS } from '../data/mockData';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const {
    user,
    isAuthenticated,
    logout,
    cart,
    openAuthModal,
    selectedArea,
    setSelectedArea,
  } = useAppStore();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find a Tiffin', path: '/tiffins' },
    { name: 'Order History', path: '/history' },
    ...(user?.role === 'chef' || !user
      ? [{ name: 'Mother Chef Portal', path: '/chef-dashboard' }]
      : []),
  ];

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#FFFDF9]/90 border-b border-[#E5C3A6]/50 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & City Selector */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#D97706] to-[#E07A5F] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <div>
                <span className="font-rozha logo-shadow text-2xl sm:text-3xl text-[#2C1810] tracking-wide block leading-none">
                  Mummy's Tiffin
                </span>
                <span className="text-[10px] uppercase font-semibold text-[#B45309] tracking-wider block mt-0.5">
                  Ghar Ka Khana Delivered
                </span>
              </div>
            </Link>

            {/* City Area Badge Selector */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5EBE1] border border-[#E5C3A6]/60 text-xs text-[#6B3A19]">
              <MapPin className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
              <span className="font-medium">Vadodara:</span>
              <select
                value={selectedArea}
                onChange={(e) => {
                  setSelectedArea(e.target.value);
                  if (location.pathname !== '/tiffins') {
                    navigate('/tiffins');
                  }
                }}
                className="bg-transparent font-semibold text-[#2C1810] focus:outline-none cursor-pointer"
              >
                <option value="All">All Areas</option>
                {VADODARA_AREAS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-semibold transition-colors hover:text-[#D97706] relative py-2 ${
                    isActive ? 'text-[#D97706]' : 'text-[#5C3D2E]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D97706] rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Controls: Cart & Auth */}
          <div className="hidden md:flex items-center gap-4">
            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-full bg-[#FBF3EA] hover:bg-[#F3E5D8] border border-[#E5C3A6]/60 text-[#2C1810] transition-colors"
              title="View Tiffin Cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#2C1810]" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#D97706] text-white text-[11px] font-bold flex items-center justify-center animate-pulse">
                  {totalCartCount}
                </span>
              )}
            </Link>

            {/* Auth Dropdown or Button */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#F5EBE1] hover:bg-[#ECDBCB] border border-[#E5C3A6] text-[#2C1810] transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-[#D97706] text-white flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#D97706]/15 text-[#B45309] font-bold">
                    {user.role === 'chef' ? 'Mother Chef' : user.profession}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#FFFDF9] border border-[#E5C3A6] shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-[#E5C3A6]/40">
                      <p className="text-xs font-bold text-[#2C1810]">{user.name}</p>
                      <p className="text-[11px] text-[#6B3A19] truncate">{user.email}</p>
                      <p className="text-[11px] text-[#B45309] font-medium mt-0.5">📍 {user.area}, Vadodara</p>
                    </div>

                    <Link
                      to="/history?tab=orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#2C1810] hover:bg-[#F5EBE1]"
                    >
                      <History className="w-4 h-4 text-[#D97706]" />
                      My Orders & Tracking
                    </Link>

                    <Link
                      to="/history?tab=reviews"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#2C1810] hover:bg-[#F5EBE1]"
                    >
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      My Submitted Reviews
                    </Link>

                    <Link
                      to="/history?tab=profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#2C1810] hover:bg-[#F5EBE1]"
                    >
                      <UserCheck className="w-4 h-4 text-[#6B3A19]" />
                      Profile & Preferences
                    </Link>

                    {user.role === 'chef' && (
                      <Link
                        to="/chef-dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#2C1810] hover:bg-[#F5EBE1]"
                      >
                        <ChefHat className="w-4 h-4 text-[#D97706]" />
                        Mother Kitchen Dashboard
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50 text-left border-t border-[#E5C3A6]/40 mt-1 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#D97706] to-[#E07A5F] hover:from-[#B45309] hover:to-[#C05621] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <UserIcon className="w-4 h-4" />
                Login / Register
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <Link
              to="/cart"
              className="relative p-2 rounded-full bg-[#FBF3EA] text-[#2C1810]"
            >
              <ShoppingBag className="w-5 h-5 text-[#2C1810]" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D97706] text-white text-[10px] font-bold flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#F5EBE1] text-[#2C1810] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5C3A6] bg-[#FFFDF9] px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F5EBE1] text-xs font-medium text-[#2C1810]">
            <MapPin className="w-4 h-4 text-[#D97706]" />
            <span>Vadodara Area:</span>
            <select
              value={selectedArea}
              onChange={(e) => {
                setSelectedArea(e.target.value);
                setMobileMenuOpen(false);
                navigate('/tiffins');
              }}
              className="bg-transparent font-bold focus:outline-none"
            >
              <option value="All">All Areas</option>
              {VADODARA_AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-xl text-sm font-semibold ${
                location.pathname === link.path
                  ? 'bg-[#F5EBE1] text-[#D97706]'
                  : 'text-[#2C1810]'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {isAuthenticated ? (
            <div className="pt-3 border-t border-[#E5C3A6]/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2C1810]">{user?.name}</span>
                <span className="text-[10px] font-semibold text-[#8C6B53]">({user?.profession})</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/history?tab=reviews"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl bg-[#F5EBE1] text-xs font-bold text-[#D97706] text-center flex items-center justify-center gap-1"
                >
                  <Star className="w-3.5 h-3.5 fill-current" /> My Reviews
                </Link>
                <Link
                  to="/history?tab=profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl bg-[#F5EBE1] text-xs font-bold text-[#6B3A19] text-center flex items-center justify-center gap-1"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Profile
                </Link>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full text-xs font-bold text-rose-700 flex items-center justify-center gap-1 pt-2"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openAuthModal();
              }}
              className="w-full py-2.5 rounded-xl bg-[#D97706] text-white text-xs font-bold text-center"
            >
              Login / Sign Up
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

