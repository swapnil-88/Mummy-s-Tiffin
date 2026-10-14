import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ChefHat,
  CheckCircle,
  Power,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Award,
  Sparkles,
  Utensils,
  Eye,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { MenuItem, OrderStatus } from '../types';

export const ChefDashboard: React.FC = () => {
  const {
    mothers,
    toggleMotherStatus,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    orders,
    updateOrderStatus,
    user,
    isAuthenticated,
    loginAsChef,
    logout,
    addToast,
  } = useAppStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const GOOGLE_FORM_URL =
    'https://docs.google.com/forms/d/e/1FAIpQLScgxOdVt-gXWTV_iDeWx6Uu7T-KSNtP3W4pGmunF4KGMuzICA/viewform';

  const [selectedMotherId, setSelectedMotherId] = useState('mother-1');
  const [chefPassword, setChefPassword] = useState('1234');
  const [chefEmail, setChefEmail] = useState('');

  // Active chef profile when logged in
  const chef = mothers.find((m) => m.id === user?.id) || mothers[0];

  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'earnings'>('orders');

  // New Menu Item Form state
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('110');
  const [newItemMealType, setNewItemMealType] = useState<'Lunch' | 'Dinner' | 'Both'>('Both');
  const [newItemIsJain, setNewItemIsJain] = useState(false);

  // Payout request modal
  const [payoutRequested, setPayoutRequested] = useState(false);

  const handleChefLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsChef(selectedMotherId, chefEmail);
  };

  const handleCreateMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) return;

    addMenuItem(chef.id, {
      name: newItemName,
      description: newItemDesc,
      price: parseFloat(newItemPrice) || 100,
      mealType: newItemMealType,
      category: 'Thali',
      isJain: newItemIsJain,
      isPureVeg: true,
    });

    setNewItemName('');
    setNewItemDesc('');
    setIsAddingItem(false);
  };

  const handlePayout = () => {
    setPayoutRequested(true);
    addToast('Payout request of ₹4,850 submitted to Vadodara HDFC Bank!', 'success');
    setTimeout(() => setPayoutRequested(false), 3000);
  };

  // If user is not logged in as a Mother Chef, render the dedicated Sign-In Portal Window
  if (!isAuthenticated || user?.role !== 'chef') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Banner Header */}
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-[#2C1810] via-[#3D2218] to-[#2C1810] text-white border border-[#E5C3A6]/40 shadow-2xl relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
              <ChefHat className="w-4 h-4 text-amber-400" />
              Mother Chef Kitchen Portal
            </div>
            <h1 className="font-rozha text-3xl sm:text-5xl text-amber-100 leading-tight">
              Sign In to Your Kitchen
            </h1>
            <p className="text-sm sm:text-base text-[#E5C3A6] max-w-2xl mx-auto">
              Welcome Vadodara Mother Chefs! Manage daily menu items, view incoming tiffin subscriptions, track real-time orders, and manage bank payouts.
            </p>
          </div>
        </div>

        {/* Notice if signed in as Customer */}
        {isAuthenticated && user?.role === 'customer' && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-[#2C1810] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="text-base">ℹ️</span>
              <span>
                Currently signed in as Customer: <strong>{user.name}</strong> ({user.email}). To manage a kitchen, sign in as a Mother Chef below.
              </span>
            </div>
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-xl bg-amber-200 hover:bg-amber-300 text-[#2C1810] font-bold shrink-0 transition-colors"
            >
              Sign Out Customer Session
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Sign In Window Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF9] border border-[#E5C3A6] shadow-xl space-y-6">
            <div>
              <h2 className="font-rozha text-2xl text-[#2C1810]">
                Mother Chef Portal Sign In
              </h2>
              <p className="text-xs text-[#8C6B53]">
                Select your kitchen and enter your kitchen pin/password to log in
              </p>
            </div>

            <form onSubmit={handleChefLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2C1810] mb-1">
                  Select Registered Kitchen / Chef
                </label>
                <select
                  value={selectedMotherId}
                  onChange={(e) => setSelectedMotherId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E5C3A6] bg-white text-xs font-bold text-[#2C1810] focus:ring-2 focus:ring-[#D97706]"
                >
                  {mothers.map((m) => (
                    <option key={m.id} value={m.id}>
                      👩‍🍳 {m.name} ({m.area}, Vadodara)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C1810] mb-1">
                  Kitchen Email / ID (Optional)
                </label>
                <input
                  type="email"
                  value={chefEmail}
                  onChange={(e) => setChefEmail(e.target.value)}
                  placeholder="chef@mummystiffin.com"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E5C3A6] bg-white text-xs text-[#2C1810] focus:ring-2 focus:ring-[#D97706]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C1810] mb-1">
                  Kitchen Security Pin / Password
                </label>
                <input
                  type="password"
                  value={chefPassword}
                  onChange={(e) => setChefPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E5C3A6] bg-white text-xs text-[#2C1810] focus:ring-2 focus:ring-[#D97706]"
                  required
                />
                <span className="text-[10px] text-[#8C6B53] mt-1 block">
                  Demo Pin: Any password (e.g. 1234)
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ChefHat className="w-4 h-4" />
                Sign In to Kitchen Portal
              </button>
            </form>

            <div className="pt-4 border-t border-[#E5C3A6]/60 text-center">
              <span className="text-xs text-[#8C6B53] block mb-3 font-medium">
                Or Quick Login with 1-Click Demo Kitchens:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {mothers.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => loginAsChef(m.id)}
                    className="p-2.5 rounded-xl border border-[#E5C3A6] bg-[#FBF6EE] hover:bg-[#F5EBE1] text-left transition-colors"
                  >
                    <span className="block text-xs font-bold text-[#2C1810] line-clamp-1">
                      {m.name}
                    </span>
                    <span className="text-[10px] text-[#8C6B53]">
                      📍 {m.area}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Register Kitchen Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FBF6EE] to-[#F5EBE1] border border-[#E5C3A6] shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D97706]/10 text-[#D97706] flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-rozha text-2xl text-[#2C1810]">
                Register New Kitchen AS Mother Chef
              </h3>
              <p className="text-xs text-[#6B3A19] leading-relaxed">
                Are you a passionate home chef in Vadodara looking to sell your authentic home-cooked food? Join Mummy's Tiffin network today!
              </p>
              <ul className="space-y-2 text-xs text-[#2C1810]">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Earn ₹30,000+ monthly from home
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Free FSSAI registration guidance
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Flexible cooking hours & menu control
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Dedicated delivery partner support
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-[#E5C3A6]/60">
              <a
                href={GOOGLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl bg-[#2C1810] hover:bg-[#3D2218] text-amber-200 text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2 text-center"
              >
                <span>Register Kitchen AS Mother Chef</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </a>
              <span className="text-[10px] text-center text-[#8C6B53] block mt-2">
                Opens Official Vadodara Partner Registration Form
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Kitchen Profile Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#2C1810] to-[#3D2218] text-white border border-amber-900/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img
              src={chef.profilePhoto}
              alt={chef.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-md ring-2 ring-amber-500/30"
            />
            {chef.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <CheckCircle className="w-4 h-4" />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-rozha text-2xl sm:text-3xl text-amber-100">
                {chef.name}'s Kitchen
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold uppercase">
                FSSAI Certified
              </span>
            </div>
            <p className="text-xs text-[#E5C3A6] mt-0.5">
              📍 {chef.area}, Vadodara • Specialty: {chef.specialtyCuisines.join(', ')}
            </p>
            <p className="text-xs text-amber-300 font-bold mt-1">
              ★ {chef.rating.toFixed(1)} Rating ({chef.reviewCount} Happy Eaters)
            </p>
          </div>
        </div>

        {/* Online / Offline Status Toggle */}
        <div className="flex items-center gap-4 bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10 self-start md:self-auto">
          <div>
            <span className="text-[10px] text-amber-200 block uppercase font-bold">Kitchen Status</span>
            <span className="text-xs font-bold text-white">
              {chef.isOpen ? 'ONLINE (Accepting Tiffins)' : 'OFFLINE'}
            </span>
          </div>

          <button
            onClick={() => toggleMotherStatus(chef.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              chef.isOpen
                ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md'
                : 'bg-rose-500 text-white hover:bg-rose-600'
            }`}
          >
            <Power className="w-4 h-4" />
            {chef.isOpen ? 'Active' : 'Turn On'}
          </button>
        </div>
      </div>

      {/* Analytics Revenue Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-[#FFFDF9] border border-[#E5C3A6] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#8C6B53] uppercase block">This Week's Earnings</span>
            <span className="text-2xl font-rozha text-[#D97706]">₹4,850</span>
            <span className="text-[10px] text-emerald-700 block font-semibold mt-0.5">↑ 18% from last week</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#D97706] flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#FFFDF9] border border-[#E5C3A6] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#8C6B53] uppercase block">Tiffins Cooked Today</span>
            <span className="text-2xl font-rozha text-[#2C1810]">34 Tiffins</span>
            <span className="text-[10px] text-[#8C6B53] block font-medium">Cap: {chef.dailyCapacity}/day</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Utensils className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#FFFDF9] border border-[#E5C3A6] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#8C6B53] uppercase block">Active Orders</span>
            <span className="text-2xl font-rozha text-amber-700">{orders.length} Active</span>
            <span className="text-[10px] text-[#8C6B53] block font-medium">Fatehgunj & Sayajigunj</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-3 border-b border-[#E5C3A6]/60 pb-3">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'orders'
              ? 'bg-[#2C1810] text-amber-200 shadow-md'
              : 'bg-[#F5EBE1] text-[#6B3A19] hover:bg-[#ECDBCB]'
          }`}
        >
          Incoming Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('menu')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'menu'
              ? 'bg-[#2C1810] text-amber-200 shadow-md'
              : 'bg-[#F5EBE1] text-[#6B3A19] hover:bg-[#ECDBCB]'
          }`}
        >
          Manage Menu ({chef.menuItems.length} Items)
        </button>

        <button
          onClick={() => setActiveTab('earnings')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'earnings'
              ? 'bg-[#2C1810] text-amber-200 shadow-md'
              : 'bg-[#F5EBE1] text-[#6B3A19] hover:bg-[#ECDBCB]'
          }`}
        >
          Earnings & Bank Payouts
        </button>
      </div>

      {/* TAB 1: INCOMING ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h2 className="font-rozha text-xl text-[#2C1810]">Live Tiffin Orders</h2>

          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-5 rounded-3xl bg-[#FFFDF9] border border-[#E5C3A6] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#2C1810]">{order.id}</span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                      {order.timeSlot}
                    </span>
                    <span className="text-xs text-[#8C6B53]">({order.area})</span>
                  </div>

                  <p className="text-xs font-semibold text-[#2C1810]">
                    Customer: {order.userName} ({order.userPhone})
                  </p>
                  <p className="text-xs text-[#6B3A19]">Address: {order.deliveryAddress}</p>
                  <p className="text-xs font-bold text-[#D97706] mt-1">
                    Items: {order.items.map((i) => `${i.quantity}x ${i.itemName}`).join(', ')}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-bold text-[#2C1810] mr-2">₹{order.totalAmount}</span>

                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                    className="p-2 rounded-xl bg-[#FBF6EE] border border-[#E5C3A6] text-xs font-bold text-[#2C1810]"
                  >
                    <option value="Placed">Placed</option>
                    <option value="Preparing">Preparing in Kitchen</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MENU MANAGEMENT */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-rozha text-xl text-[#2C1810]">Daily Kitchen Menu</h2>
            <button
              onClick={() => setIsAddingItem(!isAddingItem)}
              className="px-4 py-2 rounded-xl bg-[#D97706] text-white text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" /> Add Menu Item
            </button>
          </div>

          {/* Add New Item Form */}
          {isAddingItem && (
            <form
              onSubmit={handleCreateMenuItem}
              className="p-6 rounded-3xl bg-[#FBF6EE] border border-[#E5C3A6] space-y-4"
            >
              <h3 className="font-rozha text-lg text-[#2C1810]">Add New Dish to Menu</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2C1810] mb-1">Dish Name</label>
                  <input
                    type="text"
                    required
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="e.g. Special Lasaniya Bataka & Phulkas"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5C3A6] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2C1810] mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5C3A6] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C1810] mb-1">Description & Ingredients</label>
                <input
                  type="text"
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  placeholder="e.g. Cooked in peanut oil with garlic, cumin, and fresh cilantro"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5C3A6] text-xs"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="text-xs font-bold text-[#2C1810] flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newItemIsJain}
                    onChange={(e) => setNewItemIsJain(e.target.checked)}
                    className="rounded text-[#D97706]"
                  />
                  Jain Friendly (No onion/garlic)
                </label>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2C1810] text-amber-200 text-xs font-bold ml-auto"
                >
                  Save Dish
                </button>
              </div>
            </form>
          )}

          {/* Menu Items List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {chef.menuItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E5C3A6] shadow-xs flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="font-bold text-sm text-[#2C1810]">{item.name}</h4>
                  <p className="text-xs text-[#6B3A19] line-clamp-1">{item.description}</p>
                  <span className="text-xs font-bold text-[#D97706]">₹{item.price}</span>
                </div>

                <button
                  onClick={() => deleteMenuItem(chef.id, item.id)}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete Dish"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EARNINGS & PAYOUTS */}
      {activeTab === 'earnings' && (
        <div className="p-8 rounded-3xl bg-[#FFFDF9] border border-[#E5C3A6] shadow-md space-y-6">
          <div>
            <h2 className="font-rozha text-2xl text-[#2C1810]">Weekly Revenue & Payouts</h2>
            <p className="text-xs text-[#8C6B53]">
              Direct bank transfer every Monday to your registered Vadodara bank account.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FBF6EE] border border-[#E5C3A6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-[#8C6B53] font-semibold block">Available Payout Balance</span>
              <span className="text-3xl font-rozha text-[#D97706]">₹4,850</span>
              <span className="text-[11px] text-emerald-700 block mt-0.5">HDFC Bank (A/C Ending 8821)</span>
            </div>

            <button
              onClick={handlePayout}
              disabled={payoutRequested}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#D97706] to-[#E07A5F] text-white text-xs font-bold shadow hover:shadow-lg transition-all"
            >
              {payoutRequested ? 'Payout Requested ✓' : 'Request Instant Bank Payout'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
