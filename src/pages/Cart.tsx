import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, MapPin, Tag, ArrowRight, Utensils, Calendar, Clock, AlertCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { VADODARA_AREAS } from '../data/mockData';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    user,
    openAuthModal,
    addToast,
  } = useAppStore();

  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || 'Hostel No. 4, MSU Fatehgunj');
  const [selectedArea, setSelectedArea] = useState(user?.area || 'Fatehgunj');
  const [couponInput, setCouponInput] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.itemPrice * item.quantity, 0);
  const hasSubscription = cart.some(
    (item) => item.planType === 'weekly' || item.isSubscription
  );
  const totalMealsInCart = cart.reduce((sum, item) => {
    if (item.planType === 'weekly' || item.isSubscription) {
      const meals =
        item.totalMealsCount ||
        item.subscriptionDetails?.totalMeals ||
        (item.subscriptionDaysCount ? item.subscriptionDaysCount * (item.mealsPerDay || 1) : 6);
      return sum + meals;
    }
    return sum + item.quantity;
  }, 0);

  // Delivery Fee: 100% FREE for weekly subscriptions (normally ₹15/order or ~₹90/week); ₹15 for single meal orders
  const deliveryFee = hasSubscription ? 0 : subtotal > 0 ? 15 : 0;
  const deliverySavings = hasSubscription ? 15 * (totalMealsInCart > 1 ? totalMealsInCart : 6) : 0;

  // Packaging Fee: 100% FREE for weekly subscriptions (reusable stainless steel tiffin rotation, ₹0 plastic waste); ₹5 for single meal orders
  const packagingFee = hasSubscription ? 0 : subtotal > 0 ? 5 : 0;
  const packagingSavings = hasSubscription ? 5 * (totalMealsInCart > 1 ? totalMealsInCart : 6) : 0;

  const totalAmount = Math.max(0, subtotal + deliveryFee + packagingFee - discountAmount);

  const applyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.toUpperCase() === 'MUMMY10') {
      const disc = Math.round(subtotal * 0.1);
      setDiscountAmount(disc);
      addToast(`Coupon MUMMY10 applied! You saved ₹${disc}`, 'success');
    } else {
      addToast('Invalid Coupon Code. Try "MUMMY10"', 'error');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#F5EBE1] text-[#D97706] flex items-center justify-center mx-auto border-2 border-[#E5C3A6]">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="font-rozha text-3xl text-[#2C1810]">Your Tiffin Basket is Empty</h2>
          <p className="text-xs sm:text-sm text-[#8C6B53] max-w-md mx-auto">
            You haven't added any homestyle tiffins yet. Explore our mother chefs in Vadodara to order fresh meals!
          </p>
        </div>
        <Link
          to="/tiffins"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#D97706] to-[#E07A5F] text-white text-xs font-bold shadow-lg hover:shadow-xl transition-all"
        >
          <span>Find a Tiffin Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const motherName = cart[0]?.motherName;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-[#E5C3A6]/60 pb-4">
        <div>
          <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider block">
            Checkout Basket
          </span>
          <h1 className="font-rozha text-3xl text-[#2C1810]">
            Tiffins from {motherName}
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" /> Clear Basket
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => {
            const isSub = item.planType === 'weekly';

            return (
              <div
                key={item.id}
                className={`p-5 rounded-3xl border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                  isSub
                    ? 'bg-gradient-to-br from-[#FFFDF9] to-[#FDF8F0] border-amber-300 ring-1 ring-amber-200'
                    : 'bg-[#FFFDF9] border-[#E5C3A6]'
                }`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {isSub ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#D97706] to-[#B45309] text-white text-[10px] font-extrabold uppercase flex items-center gap-1 shadow-xs">
                        <span>🔁 Weekly Plan</span>
                        <span>•</span>
                        <span>{item.subscriptionDaysCount} Days</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#D97706]/15 text-[#B45309] text-[10px] font-extrabold uppercase">
                        Single Order
                      </span>
                    )}

                    <span className="px-2 py-0.5 rounded-md bg-[#F5EBE1] text-[#6B3A19] text-[10px] font-bold">
                      {item.mealType === 'Both' ? '☀️ Lunch & 🌙 Dinner' : item.mealType}
                    </span>

                    {isSub && item.discountPercent && (
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {item.discountPercent}% Discount Applied
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-[#2C1810]">{item.itemName}</h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#8C6B53]">
                    {isSub ? (
                      <>
                        <span className="flex items-center gap-1 bg-[#FBF6EE] px-2 py-0.5 rounded-md border border-[#E5C3A6]/60">
                          <Calendar className="w-3.5 h-3.5 text-[#D97706]" />
                          <span>
                            {item.subscriptionStartDate} to {item.subscriptionEndDate}
                          </span>
                        </span>
                        <span className="flex items-center gap-1 text-[#6B3A19]">
                          <Clock className="w-3.5 h-3.5 text-[#D97706]" /> {item.deliveryTimeSlot}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#D97706]" /> {item.deliveryDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#D97706]" /> {item.deliveryTimeSlot}
                        </span>
                      </>
                    )}
                  </div>

                  {isSub && item.subscriptionDays && (
                    <div className="text-[11px] text-[#8C6B53] flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-[#2C1810]">Active Days:</span>
                      {item.subscriptionDays.map((d) => (
                        <span
                          key={d}
                          className="px-1.5 py-0.2 rounded-md bg-amber-100/70 text-amber-900 text-[10px] font-bold"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  )}

                  {item.specialInstructions && (
                    <p className="text-[11px] text-[#B45309] bg-[#FBF6EE] px-2.5 py-1 rounded-lg border border-[#E5C3A6]/50 inline-block">
                      Note: "{item.specialInstructions}"
                    </p>
                  )}
                </div>

                {/* Quantity & Price */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E5C3A6]/40">
                  <div className="flex items-center gap-2 bg-[#F5EBE1] p-1.5 rounded-xl border border-[#E5C3A6]/60">
                    <button
                      onClick={() => updateCartQuantity(item.id, -1)}
                      className="w-7 h-7 rounded-lg bg-white text-[#2C1810] font-bold shadow-xs flex items-center justify-center hover:bg-rose-100 transition-colors"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-xs text-[#2C1810] w-5 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.id, 1)}
                      className="w-7 h-7 rounded-lg bg-white text-[#2C1810] font-bold shadow-xs flex items-center justify-center hover:bg-amber-100 transition-colors"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right min-w-[75px]">
                    <span className="font-bold text-base text-[#D97706] block">
                      ₹{item.itemPrice * item.quantity}
                    </span>
                    {isSub && (
                      <span className="text-[10px] text-[#8C6B53] block">
                        Full Week Plan
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Remove Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Delivery Location Section */}
          <div className="p-6 rounded-3xl bg-[#FBF6EE] border border-[#E5C3A6] space-y-4">
            <h3 className="font-rozha text-lg text-[#2C1810] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#D97706]" /> Delivery Address in Vadodara
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#2C1810] mb-1">Select Area</label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E5C3A6] text-xs font-bold text-[#2C1810]"
                >
                  {VADODARA_AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#2C1810] mb-1">Detailed Address / Hostel Room</label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="e.g. Room 204, MSU Campus Hostel 4, Fatehgunj"
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#E5C3A6] text-xs text-[#2C1810] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary & Payment CTA */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#FFFDF9] border border-[#E5C3A6] shadow-md space-y-5">
            <h3 className="font-rozha text-xl text-[#2C1810] border-b border-[#E5C3A6]/60 pb-3">
              Payment Summary
            </h3>

            {/* Coupon Code Box */}
            <form onSubmit={applyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 text-[#D97706] absolute left-3 top-3" />
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Promo (Use: MUMMY10)"
                  className="w-full pl-9 pr-2 py-2 rounded-xl bg-[#FBF6EE] border border-[#E5C3A6] text-xs text-[#2C1810] uppercase font-bold focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#2C1810] text-amber-200 text-xs font-bold hover:bg-[#3D2218]"
              >
                Apply
              </button>
            </form>

            {/* Calculation Breakdown */}
            <div className="space-y-2.5 text-xs text-[#6B3A19] pt-2">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-[#2C1810]">₹{subtotal}</span>
              </div>

              {/* Delivery Fee Line */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span>Vadodara Delivery Fee</span>
                  {hasSubscription && (
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-tight">
                      Free for Subscription
                    </span>
                  )}
                </div>
                <div>
                  {hasSubscription ? (
                    <div className="flex items-center gap-1.5">
                      <span className="line-through text-stone-400 text-[11px]">₹{deliverySavings || 90}</span>
                      <span className="font-extrabold text-emerald-700">₹0 FREE</span>
                    </div>
                  ) : (
                    <span className="font-bold text-[#2C1810]">₹{deliveryFee}</span>
                  )}
                </div>
              </div>

              {/* Packaging Fee Line */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span>Eco Reusable Steel Tiffin Packaging</span>
                  {hasSubscription && (
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-tight">
                      Free Box Rotation
                    </span>
                  )}
                </div>
                <div>
                  {hasSubscription ? (
                    <div className="flex items-center gap-1.5">
                      <span className="line-through text-stone-400 text-[11px]">₹{packagingSavings || 30}</span>
                      <span className="font-extrabold text-emerald-700">₹0 FREE</span>
                    </div>
                  ) : (
                    <span className="font-bold text-[#2C1810]">₹{packagingFee}</span>
                  )}
                </div>
              </div>

              {/* Subscription Savings Highlight Box */}
              {hasSubscription && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-[11px] text-emerald-900 space-y-1">
                  <div className="font-bold flex items-center gap-1 text-emerald-800">
                    <span>🎉 Weekly Subscription Perks Applied:</span>
                  </div>
                  <p className="text-emerald-700 leading-snug">
                    You saved <strong>₹{(deliverySavings || 90) + (packagingSavings || 30)}</strong> in recurring delivery & packaging charges!
                  </p>
                </div>
              )}

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Promo Code (MUMMY10)</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              <div className="pt-3 border-t border-[#E5C3A6]/60 flex justify-between items-center text-sm font-bold text-[#2C1810]">
                <div>
                  <span>Total Payable</span>
                  {hasSubscription && (
                    <span className="block text-[10px] text-[#8C6B53] font-normal">
                      Includes 100% Free Weekly Delivery
                    </span>
                  )}
                </div>
                <span className="text-2xl font-rozha text-[#D97706]">₹{totalAmount}</span>
              </div>
            </div>

            {/* Proceed Button */}
            <button
              onClick={() => {
                if (!user) {
                  openAuthModal();
                  return;
                }
                navigate('/payment', {
                  state: {
                    deliveryAddress,
                    selectedArea,
                    totalAmount,
                    subtotal,
                    deliveryFee,
                    packagingFee,
                    discountAmount,
                    hasSubscription,
                  },
                });
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D97706] to-[#E07A5F] hover:from-[#B45309] hover:to-[#C05621] text-white text-xs font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Payment (₹{totalAmount})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
