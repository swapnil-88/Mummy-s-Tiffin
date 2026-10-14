import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  CheckCircle,
  Clock,
  MapPin,
  ChefHat,
  Bike,
  ShoppingBag,
  Star,
  Sparkles,
  CalendarDays,
  PauseCircle,
  PlayCircle,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const OrderTrackingModal: React.FC = () => {
  const {
    isTrackingModalOpen,
    closeTrackingModal,
    selectedOrderForTracking,
    reviews,
    openWriteReviewModal,
    togglePauseSubscriptionDate,
  } = useAppStore();

  if (!isTrackingModalOpen || !selectedOrderForTracking) return null;

  const order = selectedOrderForTracking;
  const existingReview = reviews.find(
    (r) => r.orderId === order.id || (r.userId === order.userId && r.motherId === order.motherId)
  );
  const isDelivered = order.status === 'Delivered';
  const isSub = order.isSubscription && order.subscriptionDetails;
  const subDetails = order.subscriptionDetails;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#2C1810]/75 backdrop-blur-md overflow-hidden"
        onClick={closeTrackingModal}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-xl max-h-[90vh] flex flex-col bg-[#FFFDF9] border border-[#E5C3A6] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header Bar */}
          <div className="p-4 sm:p-5 border-b border-[#E5C3A6]/60 bg-[#F5EBE1] shrink-0 flex items-center justify-between z-20">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#D97706] tracking-wider block">
                {isSub ? '🔁 Active Weekly Subscription' : 'Real-Time Tiffin Tracker'}
              </span>
              <h3 className="font-rozha text-lg sm:text-2xl text-[#2C1810]">
                {isSub ? `Subscription ${order.id}` : `Order ${order.id}`}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  order.status === 'Delivered'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                }`}
              >
                ● {order.status}
              </span>
              <button
                onClick={closeTrackingModal}
                className="w-10 h-10 rounded-full bg-white text-[#2C1810] shadow-md border border-[#E5C3A6] hover:bg-[#F5EBE1] active:scale-95 transition-all shrink-0 ml-2 flex items-center justify-center cursor-pointer"
                title="Close modal"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-[#2C1810]" />
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
            {/* Subscription Summary Banner (if subscription) */}
            {isSub && subDetails && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-[#FDF8F0] border border-amber-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-[#D97706]" />
                    <span className="font-bold text-xs sm:text-sm text-[#2C1810]">
                      {subDetails.daysCount === 7 ? '7-Day Full Week Plan' : `${subDetails.daysCount}-Day Recurring Plan`}
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {subDetails.discountPercent}% OFF Active
                  </span>
                </div>

                <div className="text-[11px] text-[#6B3A19] flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span>
                    <strong>Duration:</strong> {subDetails.startDate} to {subDetails.endDate}
                  </span>
                  <span>
                    <strong>Slots:</strong> {order.items[0]?.deliveryTimeSlot || '12:30 PM - 1:30 PM'}
                  </span>
                </div>

                {/* Days Schedule with Pause / Resume */}
                <div className="pt-2 border-t border-amber-200/60">
                  <span className="text-[10px] uppercase font-bold text-[#8C6B53] block mb-2">
                    Weekly Meal Schedule (Tap to Pause / Skip)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(subDetails.scheduledDays || []).map((sd, i) => {
                      const isPaused = (subDetails.pausedDates || []).includes(sd.date);
                      return (
                        <div
                          key={i}
                          className={`p-2.5 rounded-xl border text-xs transition-all ${
                            isPaused
                              ? 'bg-stone-100 border-stone-300 opacity-60 text-stone-500'
                              : sd.status === 'Delivered'
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                              : 'bg-white border-amber-200 text-[#2C1810]'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold text-[11px]">
                            <span>{sd.day}</span>
                            <span className="text-[10px] font-medium opacity-80">{sd.date.slice(5)}</span>
                          </div>

                          <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-black/5">
                            <span className="text-[10px] font-bold">
                              {isPaused ? 'Paused' : sd.status}
                            </span>
                            {sd.status !== 'Delivered' && (
                              <button
                                type="button"
                                onClick={() => togglePauseSubscriptionDate(order.id, sd.date)}
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded cursor-pointer ${
                                  isPaused
                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                    : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                                }`}
                              >
                                {isPaused ? 'Resume' : 'Pause'}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Post-Delivery Review Prompt Card */}
            {isDelivered && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 sm:p-5 rounded-2xl border ${
                  existingReview
                    ? 'bg-emerald-50/80 border-emerald-200'
                    : 'bg-gradient-to-r from-amber-50 to-[#FDF6E9] border-[#D97706]/40 shadow-md'
                } space-y-3`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#D97706] text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                      {existingReview ? <CheckCircle className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-[#2C1810]">
                        {existingReview
                          ? 'Thank you for reviewing this meal!'
                          : `How was your tiffin from ${order.motherName}?`}
                      </h4>
                      <p className="text-[11px] text-[#8C6B53]">
                        {existingReview
                          ? `You rated this order ${existingReview.rating}★: "${existingReview.comment}"`
                          : 'Your feedback helps other students & professionals find homestyle food.'}
                      </p>
                    </div>
                  </div>

                  {!existingReview && (
                    <button
                      onClick={() => {
                        closeTrackingModal();
                        openWriteReviewModal({ order });
                      }}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#D97706] to-[#E07A5F] hover:from-[#B45309] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <Star className="w-3.5 h-3.5 fill-white" />
                      <span>Write Review</span>
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Live Progress Tracker */}
            <div className="space-y-6 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2C1810]">
                  {isSub ? "Today's Delivery Progress" : 'Delivery Status'}
                </span>
                <span className="text-[11px] text-[#8C6B53]">Live updates</span>
              </div>
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5C3A6]">
                {order.trackingSteps.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-4">
                    {/* Step Dot */}
                    <div
                      className={`absolute -left-[23px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        step.completed
                          ? 'bg-[#D97706] text-white shadow-md'
                          : step.current
                          ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-bounce'
                          : 'bg-[#E5C3A6] text-white'
                      }`}
                    >
                      {step.completed ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`text-xs font-bold ${
                            step.completed || step.current ? 'text-[#2C1810]' : 'text-[#A88060]'
                          }`}
                        >
                          {step.step}
                        </h4>
                        {step.timestamp && (
                          <span className="text-[10px] text-[#8C6B53] font-medium">
                            {step.timestamp}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#6B3A19] mt-0.5">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Driver & Kitchen Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div className="p-3.5 rounded-2xl bg-[#FBF6EE] border border-[#E5C3A6]/60 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D97706]/15 text-[#D97706] flex items-center justify-center shrink-0">
                  <ChefHat className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-[#8C6B53] block font-semibold">Mother Kitchen</span>
                  <span className="text-xs font-bold text-[#2C1810]">{order.motherName}</span>
                  <span className="text-[10px] text-emerald-700 block font-medium">Verified Vadodara Chef</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FBF6EE] border border-[#E5C3A6]/60 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600/15 text-amber-700 flex items-center justify-center shrink-0">
                  <Bike className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-[#8C6B53] block font-semibold">Delivery Partner</span>
                  <span className="text-xs font-bold text-[#2C1810]">Ramesh Patel (Express)</span>
                  <span className="text-[10px] text-[#D97706] block font-semibold">
                    📞 +91 98980 44112
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Location & Order Details */}
            <div className="p-4 rounded-2xl bg-[#F5EBE1] border border-[#E5C3A6] space-y-2 text-xs">
              <div className="flex items-start gap-2 text-[#2C1810]">
                <MapPin className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Delivery Address ({order.area}, Vadodara):</span>
                  <span className="text-[#6B3A19]">{order.deliveryAddress}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E5C3A6]/60 flex items-center justify-between font-bold text-[#2C1810]">
                <span>Total Paid ({order.paymentMethod}):</span>
                <span className="text-sm text-[#D97706]">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
