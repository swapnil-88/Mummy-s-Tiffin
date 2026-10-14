import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Utensils, Star, MapPin, Check, Plus, ShoppingBag, Leaf, MessageSquareQuote, CheckCircle, GraduationCap, Briefcase, ThumbsUp, PlusCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const MenuModal: React.FC = () => {
  const {
    isMenuModalOpen,
    closeMenuModal,
    selectedMotherForMenu,
    addToCart,
    openBookingModal,
    reviews,
    openWriteReviewModal,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'menu' | 'reviews'>('menu');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Lunch' | 'Dinner'>('All');

  if (!isMenuModalOpen || !selectedMotherForMenu) return null;

  const mother = selectedMotherForMenu;
  const chefReviews = reviews.filter((r) => r.motherId === mother.id);

  const filteredItems = mother.menuItems.filter((item) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Lunch') return item.mealType === 'Lunch' || item.mealType === 'Both';
    if (activeCategory === 'Dinner') return item.mealType === 'Dinner' || item.mealType === 'Both';
    return true;
  });

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#2C1810]/75 backdrop-blur-md overflow-hidden"
        onClick={closeMenuModal}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#FFFDF9] border border-[#E5C3A6] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header Banner */}
          <div className="relative bg-gradient-to-r from-[#F5EBE1] to-[#ECDBCB] p-4 sm:p-5 flex items-center justify-between shrink-0 border-b border-[#E5C3A6]/60 z-20">
            <div className="flex items-center gap-3 sm:gap-4 z-10 pr-2">
              <img
                src={mother.profilePhoto}
                alt={mother.name}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-white shadow-md ring-2 ring-[#D97706]/30 shrink-0"
              />
              <div>
                <h3 className="font-rozha text-lg sm:text-2xl text-[#2C1810] leading-tight">
                  {mother.name}'s Kitchen
                </h3>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-[#6B3A19] mt-0.5">
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="flex items-center gap-1 font-bold text-amber-700 bg-white/70 px-2 py-0.5 rounded hover:bg-white transition-colors cursor-pointer"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {mother.rating.toFixed(1)} ({chefReviews.length} Reviews)
                  </button>
                  <span>📍 {mother.area}</span>
                </div>
              </div>
            </div>

            <button
              onClick={closeMenuModal}
              className="w-10 h-10 rounded-full bg-white text-[#2C1810] shadow-md border border-[#E5C3A6] hover:bg-[#F5EBE1] active:scale-95 transition-all shrink-0 ml-2 flex items-center justify-center cursor-pointer"
              title="Close modal"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-[#2C1810]" />
            </button>
          </div>

          {/* Top Tab Bar: Menu vs Reviews */}
          <div className="grid grid-cols-2 bg-[#F5EBE1] border-b border-[#E5C3A6] p-1.5 gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('menu')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'menu'
                  ? 'bg-white text-[#2C1810] shadow-xs'
                  : 'text-[#6B3A19] hover:bg-white/50'
              }`}
            >
              <Utensils className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Today's Menu & Tiffin</span>
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-white text-[#2C1810] shadow-xs'
                  : 'text-[#6B3A19] hover:bg-white/50'
              }`}
            >
              <MessageSquareQuote className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Customer Reviews ({chefReviews.length})</span>
            </button>
          </div>

          <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
            {activeTab === 'menu' ? (
              <>
                {/* Standard Tiffin Box Banner */}
                <div className="p-4 rounded-2xl bg-[#FBF6EE] border border-[#E5C3A6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                        Most Popular
                      </span>
                      <span className="text-xs font-bold text-[#D97706]">
                        Standard Daily Tiffin Thali
                      </span>
                    </div>
                    <p className="text-xs text-[#5C3D2E] mt-1">
                      Includes:{' '}
                      <span className="font-medium text-[#2C1810]">
                        {mother.tiffinContents.join(', ')}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-lg font-bold text-[#2C1810]">
                      ₹{mother.pricePerTiffin}
                      <span className="text-xs text-[#8C6B53] font-normal">/meal</span>
                    </span>
                    <button
                      onClick={() => {
                        closeMenuModal();
                        openBookingModal(mother);
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D97706] to-[#E07A5F] hover:from-[#B45309] hover:to-[#C05621] text-white text-xs font-bold shadow transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Book Tiffin
                    </button>
                  </div>
                </div>

                {/* Filter Meal Tabs */}
                <div className="flex items-center gap-2 border-b border-[#E5C3A6]/60 pb-3">
                  <span className="text-xs font-bold text-[#2C1810] mr-2">Filter Meals:</span>
                  {(['All', 'Lunch', 'Dinner'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        activeCategory === cat
                          ? 'bg-[#2C1810] text-amber-200 shadow-sm'
                          : 'bg-[#F5EBE1] text-[#6B3A19] hover:bg-[#ECDBCB]'
                      }`}
                    >
                      {cat === 'All' ? 'All Menu Items' : `${cat} Menu`}
                    </button>
                  ))}
                </div>

                {/* Menu Items List */}
                <div className="space-y-4">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-white border border-[#E5C3A6]/60 shadow-sm hover:border-[#D97706] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full sm:w-24 h-24 rounded-xl object-cover shrink-0 border border-[#E5C3A6]/40"
                        />
                      )}

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded border border-emerald-600 flex items-center justify-center p-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          </span>
                          <h4 className="font-bold text-sm text-[#2C1810]">{item.name}</h4>
                          {item.isJain && (
                            <span className="px-2 py-0.5 rounded bg-amber-100 text-[#B45309] text-[10px] font-bold flex items-center gap-0.5">
                              <Leaf className="w-3 h-3 text-amber-600" /> Jain Available
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded bg-[#F5EBE1] text-[#6B3A19] text-[10px] font-semibold">
                            {item.mealType}
                          </span>
                        </div>

                        <p className="text-xs text-[#6B3A19] leading-relaxed">
                          {item.description}
                        </p>

                        <p className="text-sm font-bold text-[#D97706]">₹{item.price}</p>
                      </div>

                      <button
                        onClick={() => {
                          addToCart({
                            motherId: mother.id,
                            motherName: mother.name,
                            itemId: item.id,
                            itemName: item.name,
                            itemPrice: item.price,
                            quantity: 1,
                            mealType: item.mealType === 'Both' ? 'Lunch' : item.mealType,
                            deliveryDate: new Date().toISOString().split('T')[0],
                            deliveryTimeSlot: '12:30 PM - 1:30 PM',
                          });
                        }}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#F5EBE1] hover:bg-[#D97706] hover:text-white text-[#D97706] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-[#E5C3A6] cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Add Item
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* Reviews Tab inside Menu Modal */
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-[#FBF6EE] p-4 rounded-2xl border border-[#E5C3A6]">
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-[#2C1810] text-sm">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span>{mother.rating.toFixed(1)} / 5.0 Rating</span>
                    </div>
                    <p className="text-xs text-[#8C6B53]">
                      Based on {chefReviews.length} verified ratings for {mother.name}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      closeMenuModal();
                      openWriteReviewModal({ mother });
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#D97706] text-white text-xs font-bold hover:bg-[#B45309] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Rate Meal</span>
                  </button>
                </div>

                {chefReviews.length === 0 ? (
                  <div className="text-center py-8 bg-[#FBF6EE] rounded-2xl border border-[#E5C3A6]/40 p-4">
                    <p className="text-xs text-[#8C6B53]">No reviews yet for {mother.name}.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {chefReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-2xl bg-white border border-[#E5C3A6]/60 space-y-2 shadow-xs"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs text-[#2C1810]">{rev.userName}</span>
                              {rev.verifiedSubscriber && (
                                <span className="inline-flex items-center text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                  <CheckCircle className="w-2.5 h-2.5 mr-0.5 text-emerald-600" /> Verified
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#8C6B53]">{rev.userProfession}</p>
                          </div>
                          <div className="flex items-center gap-0.5 text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
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
                        <p className="text-xs text-[#4A2E20] italic">"{rev.comment}"</p>
                        {rev.dishMentioned && (
                          <span className="inline-block text-[10px] text-[#B45309] font-medium bg-[#F5EBE1] px-2 py-0.5 rounded-md">
                            Dish: {rev.dishMentioned}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
