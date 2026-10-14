import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Calendar,
  Clock,
  ShoppingBag,
  Utensils,
  MessageSquare,
  Plus,
  Minus,
  Sparkles,
  Star,
  CheckCircle2,
  CalendarDays,
  Percent,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { PlanType } from '../types';

const DAYS_OF_WEEK = [
  { id: 'Mon', label: 'Mon', fullName: 'Monday' },
  { id: 'Tue', label: 'Tue', fullName: 'Tuesday' },
  { id: 'Wed', label: 'Wed', fullName: 'Wednesday' },
  { id: 'Thu', label: 'Thu', fullName: 'Thursday' },
  { id: 'Fri', label: 'Fri', fullName: 'Friday' },
  { id: 'Sat', label: 'Sat', fullName: 'Saturday' },
  { id: 'Sun', label: 'Sun', fullName: 'Sunday' },
];

export const BookingModal: React.FC = () => {
  const {
    isBookingModalOpen,
    closeBookingModal,
    selectedMotherForBooking,
    bookingInitialPlan,
    addToCart,
    openChefReviewsModal,
  } = useAppStore();

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  // Booking mode: 'single' or 'weekly'
  const [planType, setPlanType] = useState<PlanType>('single');

  // Single Day States
  const [deliveryDate, setDeliveryDate] = useState(todayStr);
  const [mealType, setMealType] = useState<'Lunch' | 'Dinner' | 'Both'>('Lunch');
  const [timeSlot, setTimeSlot] = useState('12:30 PM - 1:30 PM');
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');

  // Weekly Subscription States
  const [subscriptionPreset, setSubscriptionPreset] = useState<'5day' | '6day' | '7day'>('6day');
  const [activeDays, setActiveDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  const [subMealType, setSubMealType] = useState<'Lunch' | 'Dinner' | 'Both'>('Lunch');
  const [subStartDate, setSubStartDate] = useState(tomorrowStr);
  const [subLunchSlot, setSubLunchSlot] = useState('12:30 PM - 1:30 PM');
  const [subDinnerSlot, setSubDinnerSlot] = useState('7:30 PM - 8:30 PM');

  // Sync initial plan type when modal opens
  useEffect(() => {
    if (isBookingModalOpen) {
      setPlanType(bookingInitialPlan || 'single');
    }
  }, [isBookingModalOpen, bookingInitialPlan]);

  if (!isBookingModalOpen || !selectedMotherForBooking) return null;

  const mother = selectedMotherForBooking;

  // Handle Preset selections
  const handlePresetSelect = (preset: '5day' | '6day' | '7day') => {
    setSubscriptionPreset(preset);
    if (preset === '5day') {
      setActiveDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
    } else if (preset === '6day') {
      setActiveDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
    } else if (preset === '7day') {
      setActiveDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    }
  };

  const toggleDay = (dayId: string) => {
    if (activeDays.includes(dayId)) {
      if (activeDays.length <= 1) return; // Must have at least 1 active day
      const updated = activeDays.filter((d) => d !== dayId);
      setActiveDays(updated);
      updatePresetFromDays(updated);
    } else {
      const updated = [...activeDays, dayId];
      setActiveDays(updated);
      updatePresetFromDays(updated);
    }
  };

  const updatePresetFromDays = (days: string[]) => {
    if (days.length === 7) setSubscriptionPreset('7day');
    else if (days.length === 6 && !days.includes('Sun')) setSubscriptionPreset('6day');
    else if (days.length === 5 && !days.includes('Sat') && !days.includes('Sun')) setSubscriptionPreset('5day');
  };

  // Calculate Subscription Discount
  const daysCount = activeDays.length;
  const mealsPerDay = subMealType === 'Both' ? 2 : 1;
  const totalWeeklyMeals = daysCount * mealsPerDay * quantity;

  // Discount tier
  let discountPercent = 10;
  if (daysCount >= 7) discountPercent = 15;
  else if (daysCount >= 6) discountPercent = 12;
  else discountPercent = 10;

  const baseMealPrice = mother.pricePerTiffin;
  const discountedMealPrice = Math.round(baseMealPrice * (1 - discountPercent / 100));
  const subtotalOriginal = baseMealPrice * totalWeeklyMeals;
  const subtotalDiscounted = discountedMealPrice * totalWeeklyMeals;
  const savingsAmount = subtotalOriginal - subtotalDiscounted;

  // Compute End Date for the 1-week cycle
  const startDateObj = new Date(subStartDate || tomorrowStr);
  const endDateObj = new Date(startDateObj.getTime() + 6 * 86400000);
  const subEndDate = endDateObj.toISOString().split('T')[0];

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (planType === 'single') {
      addToCart({
        motherId: mother.id,
        motherName: mother.name,
        itemName: `${mother.name}'s Homestyle ${mealType} Tiffin`,
        itemPrice: mother.pricePerTiffin,
        quantity,
        mealType,
        deliveryDate,
        deliveryTimeSlot: timeSlot,
        specialInstructions: instructions,
        planType: 'single',
      });
    } else {
      // Weekly Subscription
      const planLabel = `${daysCount}-Day Weekly Meal Subscription (${activeDays.join(', ')})`;
      addToCart({
        motherId: mother.id,
        motherName: mother.name,
        itemName: `${mother.name}'s ${planLabel}`,
        itemPrice: discountedMealPrice * mealsPerDay * daysCount, // Total price for the full week
        quantity,
        mealType: subMealType,
        deliveryDate: subStartDate,
        deliveryTimeSlot:
          subMealType === 'Both'
            ? `Lunch: ${subLunchSlot} & Dinner: ${subDinnerSlot}`
            : subMealType === 'Lunch'
            ? subLunchSlot
            : subDinnerSlot,
        specialInstructions: instructions,
        planType: 'weekly',
        subscriptionDaysCount: daysCount,
        subscriptionDays: activeDays,
        subscriptionStartDate: subStartDate,
        subscriptionEndDate: subEndDate,
        discountPercent,
        mealsPerDay,
        totalMealsCount: totalWeeklyMeals,
      });
    }

    closeBookingModal();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#2C1810]/75 backdrop-blur-md overflow-hidden"
        onClick={closeBookingModal}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-[#FFFDF9] border border-[#E5C3A6] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header Bar */}
          <div className="p-4 sm:p-5 border-b border-[#E5C3A6]/60 flex items-center justify-between bg-[#F5EBE1] shrink-0 z-20">
            <div className="flex items-center gap-3">
              <img
                src={mother.profilePhoto}
                alt={mother.name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl object-cover border border-[#E5C3A6] shrink-0"
              />
              <div>
                <h3 className="font-rozha text-base sm:text-xl text-[#2C1810] leading-tight">
                  Book with {mother.name}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-[#8C6B53]">
                    📍 <span className="font-semibold text-[#2C1810]">{mother.area}, Vadodara</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      closeBookingModal();
                      openChefReviewsModal(mother);
                    }}
                    className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-white px-2 py-0.5 rounded-full border border-amber-200 hover:border-amber-400 cursor-pointer"
                  >
                    <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                    <span>{mother.rating.toFixed(1)} Reviews</span>
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={closeBookingModal}
              className="w-10 h-10 rounded-full bg-white text-[#2C1810] shadow-md border border-[#E5C3A6] hover:bg-[#F5EBE1] active:scale-95 transition-all shrink-0 ml-2 flex items-center justify-center"
              title="Close modal"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-[#2C1810]" />
            </button>
          </div>

          {/* Plan Type Selector Tabs */}
          <div className="p-3 bg-[#FBF6EE] border-b border-[#E5C3A6]/60 grid grid-cols-2 gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setPlanType('single')}
              className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                planType === 'single'
                  ? 'bg-[#2C1810] text-amber-200 shadow-md border border-[#2C1810]'
                  : 'bg-white text-[#6B3A19] border border-[#E5C3A6]/80 hover:bg-[#F5EBE1]'
              }`}
            >
              <Utensils className="w-4 h-4 text-[#D97706]" />
              <span>Single Day Meal</span>
            </button>

            <button
              type="button"
              onClick={() => setPlanType('weekly')}
              className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 relative overflow-hidden ${
                planType === 'weekly'
                  ? 'bg-gradient-to-r from-[#D97706] to-[#B45309] text-white shadow-md border border-[#B45309]'
                  : 'bg-white text-[#B45309] border border-amber-300 hover:bg-amber-50'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>Weekly Subscription</span>
              <span className="bg-amber-300 text-[#2C1810] text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                Save 15%
              </span>
            </button>
          </div>

          <form onSubmit={handleBooking} className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
            {/* ----------------- MODE A: SINGLE MEAL ----------------- */}
            {planType === 'single' ? (
              <>
                {/* Meal Slot Selection */}
                <div>
                  <label className="block text-xs font-bold text-[#2C1810] mb-2 flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-[#D97706]" /> Choose Meal Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setMealType('Lunch');
                        setTimeSlot('12:30 PM - 1:30 PM');
                      }}
                      className={`py-3 px-4 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                        mealType === 'Lunch'
                          ? 'bg-[#2C1810] text-amber-200 border-[#2C1810] shadow-md'
                          : 'bg-[#F5EBE1] text-[#6B3A19] border-[#E5C3A6]/60 hover:bg-[#ECDBCB]'
                      }`}
                    >
                      <span>☀️ Lunch Tiffin</span>
                      <span className="text-[10px] opacity-80">Slots: 12 PM - 2 PM</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMealType('Dinner');
                        setTimeSlot('7:30 PM - 8:30 PM');
                      }}
                      className={`py-3 px-4 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                        mealType === 'Dinner'
                          ? 'bg-[#2C1810] text-amber-200 border-[#2C1810] shadow-md'
                          : 'bg-[#F5EBE1] text-[#6B3A19] border-[#E5C3A6]/60 hover:bg-[#ECDBCB]'
                      }`}
                    >
                      <span>🌙 Dinner Tiffin</span>
                      <span className="text-[10px] opacity-80">Slots: 7 PM - 9 PM</span>
                    </button>
                  </div>
                </div>

                {/* Date Selection */}
                <div>
                  <label className="block text-xs font-bold text-[#2C1810] mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#D97706]" /> Delivery Date
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryDate(todayStr)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                        deliveryDate === todayStr
                          ? 'bg-[#D97706] text-white border-[#D97706]'
                          : 'bg-[#FBF6EE] text-[#2C1810] border-[#E5C3A6]'
                      }`}
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryDate(tomorrowStr)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                        deliveryDate === tomorrowStr
                          ? 'bg-[#D97706] text-white border-[#D97706]'
                          : 'bg-[#FBF6EE] text-[#2C1810] border-[#E5C3A6]'
                      }`}
                    >
                      Tomorrow
                    </button>
                    <input
                      type="date"
                      value={deliveryDate}
                      min={todayStr}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="py-1.5 px-2 rounded-xl bg-[#FBF6EE] border border-[#E5C3A6] text-xs font-semibold text-[#2C1810] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Time Slot Selector */}
                <div>
                  <label className="block text-xs font-bold text-[#2C1810] mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#D97706]" /> Preferred Time Slot
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FBF6EE] border border-[#E5C3A6] text-xs font-bold text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                  >
                    {mealType === 'Lunch' ? (
                      <>
                        <option value="12:00 PM - 1:00 PM">12:00 PM - 1:00 PM</option>
                        <option value="12:30 PM - 1:30 PM">12:30 PM - 1:30 PM (Recommended)</option>
                        <option value="1:00 PM - 2:00 PM">1:00 PM - 2:00 PM</option>
                      </>
                    ) : (
                      <>
                        <option value="7:00 PM - 8:00 PM">7:00 PM - 8:00 PM</option>
                        <option value="7:30 PM - 8:30 PM">7:30 PM - 8:30 PM (Recommended)</option>
                        <option value="8:00 PM - 9:00 PM">8:00 PM - 9:00 PM</option>
                      </>
                    )}
                  </select>
                </div>
              </>
            ) : (
              /* ----------------- MODE B: WEEKLY SUBSCRIPTION ----------------- */
              <>
                {/* Subscription Plan Tier Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#2C1810] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D97706]" /> Choose Weekly Plan Tier
                    </span>
                    <span className="text-[11px] font-semibold text-[#D97706]">
                      {discountPercent}% Recurring Discount
                    </span>
                  </label>

                  <div className="grid grid-cols-3 gap-2.5">
                    {/* 5-Day Plan */}
                    <button
                      type="button"
                      onClick={() => handlePresetSelect('5day')}
                      className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                        subscriptionPreset === '5day' && activeDays.length === 5
                          ? 'bg-[#2C1810] text-amber-200 border-[#2C1810] shadow-md ring-2 ring-[#D97706]'
                          : 'bg-[#FFFDF9] text-[#2C1810] border-[#E5C3A6] hover:bg-[#F5EBE1]'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold block">5-Day Plan</span>
                        <span className="text-[10px] opacity-75 block">Mon – Fri</span>
                      </div>
                      <div className="mt-2 flex items-center gap-1 text-[10px] font-extrabold text-amber-500">
                        <Percent className="w-2.5 h-2.5" /> 10% OFF
                      </div>
                    </button>

                    {/* 6-Day Plan */}
                    <button
                      type="button"
                      onClick={() => handlePresetSelect('6day')}
                      className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                        subscriptionPreset === '6day' && activeDays.length === 6
                          ? 'bg-[#2C1810] text-amber-200 border-[#2C1810] shadow-md ring-2 ring-[#D97706]'
                          : 'bg-[#FFFDF9] text-[#2C1810] border-[#E5C3A6] hover:bg-[#F5EBE1]'
                      }`}
                    >
                      <span className="absolute -top-2 right-2 bg-[#D97706] text-white text-[8px] font-extrabold px-1.5 py-0.2 rounded-full uppercase">
                        Popular
                      </span>
                      <div>
                        <span className="text-xs font-bold block">6-Day Plan</span>
                        <span className="text-[10px] opacity-75 block">Mon – Sat</span>
                      </div>
                      <div className="mt-2 flex items-center gap-1 text-[10px] font-extrabold text-amber-500">
                        <Percent className="w-2.5 h-2.5" /> 12% OFF
                      </div>
                    </button>

                    {/* 7-Day Plan */}
                    <button
                      type="button"
                      onClick={() => handlePresetSelect('7day')}
                      className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                        subscriptionPreset === '7day' && activeDays.length === 7
                          ? 'bg-[#2C1810] text-amber-200 border-[#2C1810] shadow-md ring-2 ring-[#D97706]'
                          : 'bg-[#FFFDF9] text-[#2C1810] border-[#E5C3A6] hover:bg-[#F5EBE1]'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold block">7-Day Full</span>
                        <span className="text-[10px] opacity-75 block">All 7 Days</span>
                      </div>
                      <div className="mt-2 flex items-center gap-1 text-[10px] font-extrabold text-emerald-400">
                        <Percent className="w-2.5 h-2.5" /> 15% OFF
                      </div>
                    </button>
                  </div>
                </div>

                {/* Interactive Day Selection Chips */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-[#2C1810]">
                      Delivery Days ({activeDays.length} days/week)
                    </label>
                    <span className="text-[10px] text-[#8C6B53]">Tap to include or skip days</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5">
                    {DAYS_OF_WEEK.map((d) => {
                      const isSelected = activeDays.includes(d.id);
                      return (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => toggleDay(d.id)}
                          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${
                            isSelected
                              ? 'bg-[#D97706] text-white shadow-sm'
                              : 'bg-[#F5EBE1] text-[#8C6B53] border border-[#E5C3A6]/60 hover:bg-[#ECDBCB]'
                          }`}
                          title={`Toggle ${d.fullName}`}
                        >
                          <span>{d.label}</span>
                          {isSelected && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Subscription Meal Type Selector */}
                <div>
                  <label className="block text-xs font-bold text-[#2C1810] mb-2 flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-[#D97706]" /> Recurring Meal Slot
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSubMealType('Lunch')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${
                        subMealType === 'Lunch'
                          ? 'bg-[#2C1810] text-amber-200 border-[#2C1810] shadow-sm'
                          : 'bg-[#F5EBE1] text-[#6B3A19] border-[#E5C3A6]/60 hover:bg-[#ECDBCB]'
                      }`}
                    >
                      <span>☀️ Lunch Only</span>
                      <span className="text-[10px] opacity-75 font-normal">12:30 PM</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSubMealType('Dinner')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${
                        subMealType === 'Dinner'
                          ? 'bg-[#2C1810] text-amber-200 border-[#2C1810] shadow-sm'
                          : 'bg-[#F5EBE1] text-[#6B3A19] border-[#E5C3A6]/60 hover:bg-[#ECDBCB]'
                      }`}
                    >
                      <span>🌙 Dinner Only</span>
                      <span className="text-[10px] opacity-75 font-normal">7:30 PM</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSubMealType('Both')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-0.5 relative ${
                        subMealType === 'Both'
                          ? 'bg-[#2C1810] text-amber-200 border-[#2C1810] shadow-sm'
                          : 'bg-[#F5EBE1] text-[#6B3A19] border-[#E5C3A6]/60 hover:bg-[#ECDBCB]'
                      }`}
                    >
                      <span>🍱 Both Meals</span>
                      <span className="text-[10px] opacity-75 font-normal">2 Meals / Day</span>
                    </button>
                  </div>
                </div>

                {/* Subscription Start Date & Delivery Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#2C1810] mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#D97706]" /> Subscription Start Date
                    </label>
                    <input
                      type="date"
                      value={subStartDate}
                      min={todayStr}
                      onChange={(e) => setSubStartDate(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl bg-[#FBF6EE] border border-[#E5C3A6] text-xs font-semibold text-[#2C1810] focus:outline-none"
                    />
                    <span className="text-[10px] text-[#8C6B53] mt-1 block">
                      1st Cycle: {subStartDate} to {subEndDate}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2C1810] mb-1.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#D97706]" /> Daily Delivery Slot
                    </label>
                    {subMealType === 'Lunch' ? (
                      <select
                        value={subLunchSlot}
                        onChange={(e) => setSubLunchSlot(e.target.value)}
                        className="w-full p-2 rounded-xl bg-[#FBF6EE] border border-[#E5C3A6] text-xs font-bold text-[#2C1810]"
                      >
                        <option value="12:00 PM - 1:00 PM">12:00 PM - 1:00 PM</option>
                        <option value="12:30 PM - 1:30 PM">12:30 PM - 1:30 PM (Recommended)</option>
                        <option value="1:00 PM - 2:00 PM">1:00 PM - 2:00 PM</option>
                      </select>
                    ) : subMealType === 'Dinner' ? (
                      <select
                        value={subDinnerSlot}
                        onChange={(e) => setSubDinnerSlot(e.target.value)}
                        className="w-full p-2 rounded-xl bg-[#FBF6EE] border border-[#E5C3A6] text-xs font-bold text-[#2C1810]"
                      >
                        <option value="7:00 PM - 8:00 PM">7:00 PM - 8:00 PM</option>
                        <option value="7:30 PM - 8:30 PM">7:30 PM - 8:30 PM (Recommended)</option>
                        <option value="8:00 PM - 9:00 PM">8:00 PM - 9:00 PM</option>
                      </select>
                    ) : (
                      <div className="text-[11px] text-[#6B3A19] bg-[#FBF6EE] p-2 rounded-xl border border-[#E5C3A6]">
                        ☀️ Lunch: 12:30 PM & 🌙 Dinner: 7:30 PM
                      </div>
                    )}
                  </div>
                </div>

                {/* Subscription Benefits Card */}
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#B45309]">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> Weekly Subscriber Perks
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-extrabold">
                      Free Recurring Delivery
                    </span>
                  </div>
                  <ul className="text-[11px] text-[#78350F] space-y-1">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>
                        <strong>Daily Variety:</strong> Different sabzi, dal & fresh rotis rotated every day by {mother.name}.
                      </span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <RotateCcw className="w-3 h-3 text-amber-600 shrink-0" />
                      <span>
                        <strong>Flexible Pause/Skip:</strong> Easily pause meals on specific days directly from your Order History.
                      </span>
                    </li>
                  </ul>
                </div>
              </>
            )}

            {/* Quantity Controls */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F5EBE1] border border-[#E5C3A6]/60">
              <div>
                <span className="text-xs font-bold text-[#2C1810] block">
                  {planType === 'weekly' ? 'Tiffins per Delivery' : 'Number of Tiffins'}
                </span>
                <span className="text-[11px] text-[#8C6B53]">
                  {planType === 'weekly' ? (
                    <>
                      <span className="line-through text-stone-400 mr-1">₹{mother.pricePerTiffin}</span>
                      <strong className="text-[#D97706]">₹{discountedMealPrice}/meal</strong> with {discountPercent}% weekly discount
                    </>
                  ) : (
                    `₹${mother.pricePerTiffin} per tiffin`
                  )}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-xl bg-white text-[#2C1810] font-bold shadow-sm flex items-center justify-center hover:bg-[#D97706] hover:text-white transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-base text-[#2C1810] w-6 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-xl bg-white text-[#2C1810] font-bold shadow-sm flex items-center justify-center hover:bg-[#D97706] hover:text-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-xs font-bold text-[#2C1810] mb-1 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#D97706]" /> Dietary Preferences / Notes (Optional)
              </label>
              <input
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Mild spice, no onions on Thursdays, extra chaas"
                className="w-full px-3 py-2 rounded-xl bg-[#FBF6EE] border border-[#E5C3A6] text-xs text-[#2C1810] focus:outline-none"
              />
            </div>

            {/* Total Price & Submit CTA */}
            <div className="pt-3 border-t border-[#E5C3A6]/60 flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-[#8C6B53] block">
                  {planType === 'weekly' ? `Weekly Total (${totalWeeklyMeals} Meals)` : 'Subtotal'}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-rozha text-[#D97706]">
                    ₹{planType === 'weekly' ? subtotalDiscounted : mother.pricePerTiffin * quantity}
                  </span>
                  {planType === 'weekly' && savingsAmount > 0 && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md">
                      Save ₹{savingsAmount}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#D97706] to-[#E07A5F] hover:from-[#B45309] hover:to-[#C05621] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {planType === 'weekly' ? 'Subscribe to Weekly Plan' : 'Add to Tiffin Basket'}
                </span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
