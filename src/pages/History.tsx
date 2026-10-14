import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  History as HistoryIcon,
  Clock,
  MapPin,
  ChefHat,
  RotateCcw,
  Eye,
  Star,
  MessageSquareQuote,
  User as UserIcon,
  CheckCircle2,
  Sparkles,
  PlusCircle,
  Trash2,
  Edit3,
  Utensils,
  GraduationCap,
  Briefcase,
  AlertCircle,
  Save,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Review } from '../types';
import { VADODARA_AREAS } from '../data/mockData';

export const History: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    orders,
    openTrackingModal,
    reorder,
    reviews,
    user,
    isAuthenticated,
    openAuthModal,
    openWriteReviewModal,
    deleteReview,
    updateUser,
    togglePauseSubscriptionDate,
  } = useAppStore();

  // Read tab from query param if available
  const queryParams = new URLSearchParams(location.search);
  const initialTab = (queryParams.get('tab') as 'orders' | 'reviews' | 'profile') || 'orders';

  const [activeTab, setActiveTab] = useState<'orders' | 'reviews' | 'profile'>(initialTab);
  const [orderFilter, setOrderFilter] = useState<'all' | 'subscriptions' | 'single'>('all');

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Karan Mehta',
    email: user?.email || 'karan.m@gmail.com',
    phone: user?.phone || '+91 98765 43210',
    profession: (user?.profession || 'Student') as 'Student' | 'Employee' | 'Senior Citizen' | 'Other',
    address: user?.address || 'Room 204, MSU Hostel No. 4, Fatehgunj',
    area: user?.area || 'Fatehgunj',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const tab = queryParams.get('tab');
    if (tab && (tab === 'orders' || tab === 'reviews' || tab === 'profile')) {
      setActiveTab(tab);
    }
  }, [location.search]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name,
        email: user.email,
        phone: user.phone,
        profession: user.profession,
        address: user.address,
        area: user.area,
      });
    }
  }, [user]);

  // Filter reviews submitted by the user
  const mySubmittedReviews = reviews.filter(
    (r) =>
      r.userId === user?.id ||
      (user?.name && r.userName.toLowerCase() === user.name.toLowerCase())
  );

  // Delivered orders pending review
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered');
  const unreviewedDeliveredOrders = deliveredOrders.filter(
    (o) =>
      !reviews.some(
        (r) =>
          r.orderId === o.id ||
          (r.userId === (user?.id || 'user-demo-1') && r.motherId === o.motherId)
      )
  );

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(profileForm);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-[#D97706] mx-auto flex items-center justify-center">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="font-rozha text-3xl text-[#2C1810]">Please Sign In</h2>
        <p className="text-xs text-[#8C6B53] max-w-md mx-auto">
          Sign in to view your real-time tiffin tracking, manage submitted reviews, and personalize your Vadodara meal deliveries.
        </p>
        <button
          onClick={openAuthModal}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D97706] to-[#E07A5F] hover:from-[#B45309] text-white text-xs font-bold shadow-md cursor-pointer transition-all"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider block">
            Customer Dashboard
          </span>
          <h1 className="font-rozha text-3xl sm:text-4xl text-[#2C1810]">
            My Orders, Reviews & Profile
          </h1>
        </div>

        {/* Quick Review CTA */}
        <button
          onClick={() => openWriteReviewModal()}
          className="px-4 py-2.5 rounded-2xl bg-white border border-[#D97706] text-[#D97706] hover:bg-amber-50 text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer w-fit transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Write a Mother Chef Review</span>
        </button>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E5C3A6] pb-3">
        <button
          onClick={() => {
            setActiveTab('orders');
            navigate('/history?tab=orders', { replace: true });
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-[#2C1810] text-amber-200 shadow-sm'
              : 'bg-[#F5EBE1] text-[#6B3A19] hover:bg-[#ECDBCB]'
          }`}
        >
          <HistoryIcon className="w-4 h-4" />
          <span>My Orders & Live Tracking</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20">
            {orders.length}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab('reviews');
            navigate('/history?tab=reviews', { replace: true });
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'reviews'
              ? 'bg-[#D97706] text-white shadow-sm'
              : 'bg-[#F5EBE1] text-[#6B3A19] hover:bg-[#ECDBCB]'
          }`}
        >
          <Star className="w-4 h-4 fill-current" />
          <span>My Submitted Reviews</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20">
            {mySubmittedReviews.length}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab('profile');
            navigate('/history?tab=profile', { replace: true });
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-[#3D2218] text-amber-100 shadow-sm'
              : 'bg-[#F5EBE1] text-[#6B3A19] hover:bg-[#ECDBCB]'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>My Profile & Address</span>
        </button>
      </div>

      {/* TAB 1: ORDERS & TRACKING */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Delivered Order Review Reminder Alert Banner */}
          {unreviewedDeliveredOrders.length > 0 && (
            <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-50 to-[#FDF6E9] border border-[#D97706]/40 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#D97706] text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#2C1810]">
                    Delivered Tiffin Awaiting Your Feedback!
                  </h4>
                  <p className="text-[11px] text-[#8C6B53]">
                    You received a hot tiffin from <strong>{unreviewedDeliveredOrders[0].motherName}</strong>. Rate the taste and help fellow students & professionals in Vadodara!
                  </p>
                </div>
              </div>

              <button
                onClick={() => openWriteReviewModal({ order: unreviewedDeliveredOrders[0] })}
                className="px-4 py-2 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Star className="w-3.5 h-3.5 fill-white" />
                <span>Rate & Review Now</span>
              </button>
            </div>
          )}

          {/* Filter Pills for Orders & Subscriptions */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setOrderFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                orderFilter === 'all'
                  ? 'bg-[#2C1810] text-amber-200 shadow-xs'
                  : 'bg-[#F5EBE1] text-[#6B3A19] hover:bg-[#ECDBCB]'
              }`}
            >
              All Orders ({orders.length})
            </button>

            <button
              onClick={() => setOrderFilter('subscriptions')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                orderFilter === 'subscriptions'
                  ? 'bg-gradient-to-r from-[#D97706] to-[#B45309] text-white shadow-xs'
                  : 'bg-[#F5EBE1] text-[#B45309] hover:bg-amber-100/60'
              }`}
            >
              <span>🔁 Weekly Subscriptions</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                {orders.filter((o) => o.isSubscription).length}
              </span>
            </button>

            <button
              onClick={() => setOrderFilter('single')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                orderFilter === 'single'
                  ? 'bg-[#2C1810] text-amber-200 shadow-xs'
                  : 'bg-[#F5EBE1] text-[#6B3A19] hover:bg-[#ECDBCB]'
              }`}
            >
              Single Meals ({orders.filter((o) => !o.isSubscription).length})
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="max-w-xl mx-auto py-16 text-center space-y-4 bg-[#FBF6EE] rounded-3xl border border-[#E5C3A6] p-6">
              <HistoryIcon className="w-14 h-14 text-[#D97706] mx-auto opacity-50" />
              <h3 className="font-rozha text-2xl text-[#2C1810]">No Orders Placed Yet</h3>
              <p className="text-xs text-[#8C6B53]">
                Experience homestyle pure Gujarati, Punjabi, and Kathiyawadi tiffins delivered right to your doorstep.
              </p>
              <button
                onClick={() => navigate('/tiffins')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D97706] to-[#E07A5F] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Explore Mother Chefs
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders
                .filter((order) => {
                  if (orderFilter === 'subscriptions') return order.isSubscription;
                  if (orderFilter === 'single') return !order.isSubscription;
                  return true;
                })
                .map((order) => {
                const isDelivered = order.status === 'Delivered';
                const isSub = order.isSubscription && order.subscriptionDetails;
                const subDetails = order.subscriptionDetails;
                const userOrderReview = reviews.find(
                  (r) =>
                    r.orderId === order.id ||
                    (r.userId === (user?.id || 'user-demo-1') && r.motherId === order.motherId)
                );

                return (
                  <div
                    key={order.id}
                    className={`p-6 rounded-3xl border shadow-md transition-all space-y-4 ${
                      isSub
                        ? 'bg-gradient-to-br from-[#FFFDF9] to-[#FCF8F2] border-amber-300 ring-1 ring-amber-200'
                        : 'bg-[#FFFDF9] border-[#E5C3A6] hover:border-[#D97706]'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5C3A6]/60 pb-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-bold text-sm text-[#2C1810]">{order.id}</span>
                        {isSub ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#D97706] to-[#B45309] text-white text-[10px] font-extrabold uppercase shadow-2xs">
                            🔁 Weekly Subscription
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#D97706]/15 text-[#B45309] text-[10px] font-extrabold uppercase">
                            Single Order
                          </span>
                        )}
                        <span className="text-xs text-[#8C6B53]">● {order.createdAt}</span>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${
                          isDelivered
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                        }`}
                      >
                        ● {order.status}
                      </span>
                    </div>

                    {/* Mother Chef & Items */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] text-[#8C6B53] uppercase font-bold block">
                          Mother Chef
                        </span>
                        <p className="font-bold text-sm text-[#2C1810] flex items-center gap-1.5">
                          <ChefHat className="w-4 h-4 text-[#D97706]" /> {order.motherName}
                        </p>
                        <p className="text-xs text-[#6B3A19]">📍 {order.area}, Vadodara</p>
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <span className="text-[10px] text-[#8C6B53] uppercase font-bold block">
                          {isSub ? 'Subscription Plan Details' : `Order Items (${order.items.length})`}
                        </span>
                        <ul className="text-xs text-[#2C1810] space-y-1">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="flex justify-between">
                              <span>
                                {item.quantity}x {item.itemName} ({item.mealType})
                              </span>
                              <span className="font-bold">
                                ₹{item.itemPrice * item.quantity}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Weekly Subscription Schedule & Pause/Skip UI */}
                    {isSub && subDetails && (
                      <div className="p-4 rounded-2xl bg-[#FBF6EE] border border-[#E5C3A6]/80 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#D97706]" />
                            <span className="text-xs font-bold text-[#2C1810]">
                              Active Subscription: {subDetails.startDate} to {subDetails.endDate} ({subDetails.daysCount} days/week)
                            </span>
                          </div>
                          <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full w-fit">
                            Saved with {subDetails.discountPercent}% Subscription Discount
                          </span>
                        </div>

                        {/* Interactive Days Row */}
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#8C6B53] block mb-1.5">
                            Daily Schedule & Vacation Pause
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                            {(subDetails.scheduledDays || []).map((sd, i) => {
                              const isPaused = (subDetails.pausedDates || []).includes(sd.date);
                              return (
                                <div
                                  key={i}
                                  className={`p-2 rounded-xl border text-xs flex flex-col justify-between ${
                                    isPaused
                                      ? 'bg-stone-100 border-stone-300 text-stone-500 opacity-70'
                                      : sd.status === 'Delivered'
                                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                                      : 'bg-white border-amber-200 text-[#2C1810]'
                                  }`}
                                >
                                  <div>
                                    <div className="font-bold text-[11px] flex justify-between items-center">
                                      <span>{sd.day}</span>
                                      <span className="text-[9px] opacity-75">{sd.date.slice(5)}</span>
                                    </div>
                                    <div className="text-[10px] mt-1 font-semibold text-[#8C6B53]">
                                      {isPaused ? '⏸️ Paused' : sd.status}
                                    </div>
                                  </div>

                                  {sd.status !== 'Delivered' && (
                                    <button
                                      type="button"
                                      onClick={() => togglePauseSubscriptionDate(order.id, sd.date)}
                                      className={`mt-2 text-[9px] font-bold py-1 px-1.5 rounded transition-all cursor-pointer text-center ${
                                        isPaused
                                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                          : 'bg-amber-100 hover:bg-amber-200 text-[#8C6B53]'
                                      }`}
                                    >
                                      {isPaused ? 'Resume' : 'Pause Day'}
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Review Status Callout for Delivered Orders */}
                    {isDelivered && (
                      <div className="p-3.5 rounded-2xl bg-[#FBF6EE] border border-[#E5C3A6]/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        {userOrderReview ? (
                          <div className="flex items-center gap-2 text-xs text-[#2C1810]">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>
                              <strong>You reviewed this meal:</strong>{' '}
                              <span className="text-[#D97706] font-bold">
                                {userOrderReview.rating}★
                              </span>{' '}
                              <span className="italic text-[#6B3A19]">
                                "{userOrderReview.comment}"
                              </span>
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-xs text-[#6B3A19]">
                            <Star className="w-4 h-4 text-[#D97706] shrink-0" />
                            <span>
                              Meal delivered! Share your feedback for {order.motherName}'s kitchen.
                            </span>
                          </div>
                        )}

                        {!userOrderReview ? (
                          <button
                            onClick={() => openWriteReviewModal({ order })}
                            className="px-3 py-1.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                          >
                            <Star className="w-3 h-3 fill-white" />
                            <span>Rate & Review Meal</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setActiveTab('reviews');
                              navigate('/history?tab=reviews');
                            }}
                            className="text-xs font-bold text-[#D97706] hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
                          >
                            <span>View in My Reviews</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Bottom Actions & Price */}
                    <div className="pt-3 border-t border-[#E5C3A6]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="text-xs text-[#8C6B53]">
                        <span>Total Paid: </span>
                        <strong className="text-base text-[#D97706]">
                          ₹{order.totalAmount}
                        </strong>
                        <span className="ml-2 text-[10px] uppercase font-bold">
                          ({order.paymentMethod})
                        </span>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                          onClick={() => openTrackingModal(order)}
                          className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#2C1810] text-amber-200 text-xs font-bold hover:bg-[#3D2218] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-4 h-4" /> {isSub ? 'Track Weekly Deliveries' : 'Track Live Order'}
                        </button>

                        <button
                          onClick={() => reorder(order.id)}
                          className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#F5EBE1] hover:bg-[#ECDBCB] text-[#D97706] text-xs font-bold border border-[#E5C3A6] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-4 h-4" /> {isSub ? 'Renew Subscription' : 'Reorder'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY SUBMITTED REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-rozha text-2xl text-[#2C1810]">
                My Submitted Reviews ({mySubmittedReviews.length})
              </h2>
              <p className="text-xs text-[#8C6B53]">
                Your published feedback helps Vadodara's mother chefs maintain high quality and helps fellow foodies discover homestyle kitchens.
              </p>
            </div>

            <button
              onClick={() => openWriteReviewModal()}
              className="px-4 py-2 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold shadow-md transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Write Review</span>
            </button>
          </div>

          {mySubmittedReviews.length === 0 ? (
            <div className="p-10 text-center space-y-4 bg-[#FBF6EE] rounded-3xl border border-[#E5C3A6]">
              <MessageSquareQuote className="w-14 h-14 text-[#D97706] mx-auto opacity-50" />
              <h3 className="font-rozha text-xl text-[#2C1810]">
                No Submitted Reviews Yet
              </h3>
              <p className="text-xs text-[#8C6B53] max-w-md mx-auto">
                Whenever your tiffin order is delivered, you can rate the warmth, spice level, and softness of rotis.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => openWriteReviewModal()}
                  className="px-5 py-2.5 rounded-xl bg-[#D97706] text-white text-xs font-bold shadow-sm hover:bg-[#B45309] cursor-pointer"
                >
                  Write Your First Review
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="px-5 py-2.5 rounded-xl bg-white border border-[#E5C3A6] text-[#2C1810] text-xs font-bold hover:bg-[#F5EBE1] cursor-pointer"
                >
                  View Delivered Orders
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mySubmittedReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-3xl bg-[#FFFDF9] border border-[#E5C3A6] shadow-sm hover:shadow-md hover:border-[#D97706] transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    {/* Top: Chef Name + Stars */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <ChefHat className="w-4 h-4 text-[#D97706]" />
                          <h4 className="font-bold text-sm text-[#2C1810]">
                            {rev.motherName}
                          </h4>
                        </div>
                        <span className="text-[10px] text-[#8C6B53]">
                          Reviewed as <strong>{rev.userName}</strong> ({rev.userProfession})
                        </span>
                      </div>

                      <div className="flex items-center gap-0.5 text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 shrink-0">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < rev.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-stone-200 text-stone-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Comment */}
                    <p className="text-xs text-[#4A2E20] leading-relaxed italic bg-[#FBF6EE] p-3 rounded-2xl border border-[#E5C3A6]/40">
                      "{rev.comment}"
                    </p>

                    {/* Dish Mentioned & Location */}
                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#6B3A19]">
                      {rev.dishMentioned && (
                        <span className="px-2 py-0.5 rounded-md bg-[#F5EBE1] text-[#B45309] font-medium border border-[#E5C3A6]/50">
                          🍛 {rev.dishMentioned}
                        </span>
                      )}
                      {rev.userArea && (
                        <span className="text-[#8C6B53]">📍 {rev.userArea}, Vadodara</span>
                      )}
                      <span className="text-[#8C6B53]">● {rev.date}</span>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-2 border-t border-[#E5C3A6]/50 flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[10px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified Customer Review
                    </span>

                    <button
                      onClick={() => deleteReview(rev.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PROFILE & PREFERENCES */}
      {activeTab === 'profile' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF9] border border-[#E5C3A6] shadow-md space-y-6">
          <div>
            <h2 className="font-rozha text-2xl text-[#2C1810]">
              My Profile & Vadodara Preferences
            </h2>
            <p className="text-xs text-[#8C6B53]">
              Update your delivery address, hostel/society details, and dining profile.
            </p>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#2C1810] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF6EE] border border-[#E5C3A6] text-xs text-[#2C1810] focus:ring-2 focus:ring-[#D97706] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C1810] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF6EE] border border-[#E5C3A6] text-xs text-[#2C1810] focus:ring-2 focus:ring-[#D97706] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C1810] mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF6EE] border border-[#E5C3A6] text-xs text-[#2C1810] focus:ring-2 focus:ring-[#D97706] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C1810] mb-1">
                  Profession / Occupation
                </label>
                <select
                  value={profileForm.profession}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      profession: e.target.value as any,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF6EE] border border-[#E5C3A6] text-xs text-[#2C1810] focus:ring-2 focus:ring-[#D97706] focus:outline-none cursor-pointer"
                >
                  <option value="Student">Student (MSU / Parul / SVIT / Navrachana)</option>
                  <option value="Employee">Working Professional / Corporate</option>
                  <option value="Senior Citizen">Senior Citizen (Low Oil / Soft Roti)</option>
                  <option value="Other">Other Food Lover</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C1810] mb-1">
                  Vadodara Locality / Area *
                </label>
                <select
                  value={profileForm.area}
                  onChange={(e) => setProfileForm({ ...profileForm, area: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF6EE] border border-[#E5C3A6] text-xs text-[#2C1810] focus:ring-2 focus:ring-[#D97706] focus:outline-none cursor-pointer"
                >
                  {VADODARA_AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C1810] mb-1">
                  Default Delivery Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Hostel Room / Flat No., Society, Landmark"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF6EE] border border-[#E5C3A6] text-xs text-[#2C1810] focus:ring-2 focus:ring-[#D97706] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C1810] mb-1">
                  Dietary Preference
                </label>
                <select
                  value={user?.dietaryPreference || 'Pure Veg'}
                  onChange={(e) => updateUser({ dietaryPreference: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF6EE] border border-[#E5C3A6] text-xs text-[#2C1810] focus:ring-2 focus:ring-[#D97706] focus:outline-none cursor-pointer"
                >
                  <option value="Pure Veg">Pure Veg (Standard)</option>
                  <option value="Pure Jain">Pure Jain (No Onion / Garlic)</option>
                  <option value="Kathiyawadi / Gujarati">Kathiyawadi / Gujarati</option>
                  <option value="Regular">Regular Homestyle</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C1810] mb-1">
                  Account Trust & Verification Status
                </label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>256-bit Verified Account • Vadodara Resident</span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D97706] to-[#E07A5F] hover:from-[#B45309] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
