import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Star,
  MapPin,
  Utensils,
  GraduationCap,
  Briefcase,
  CheckCircle,
  Quote,
  ThumbsUp,
  Filter,
  PlusCircle,
  Calendar,
  Sparkles,
  Heart,
  ShieldCheck,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Review } from '../types';

export const ChefReviewsModal: React.FC = () => {
  const {
    isChefReviewsModalOpen,
    closeChefReviewsModal,
    selectedMotherForReviews,
    reviews,
    openWriteReviewModal,
    openBookingModal,
  } = useAppStore();

  const [activeFilter, setActiveFilter] = useState<'all' | 'students' | 'professionals' | '5stars'>('all');
  const [helpfulLikes, setHelpfulLikes] = useState<Record<string, number>>({});
  const [userLiked, setUserLiked] = useState<Record<string, boolean>>({});

  const toggleHelpful = (id: string) => {
    setUserLiked((prev) => {
      const alreadyLiked = !!prev[id];
      setHelpfulLikes((hl) => ({
        ...hl,
        [id]: (hl[id] || 0) + (alreadyLiked ? -1 : 1),
      }));
      return { ...prev, [id]: !alreadyLiked };
    });
  };

  if (!isChefReviewsModalOpen || !selectedMotherForReviews) return null;

  const mother = selectedMotherForReviews;

  // Filter reviews for this specific chef
  const chefReviews = reviews.filter((r) => r.motherId === mother.id);

  const filteredReviews = chefReviews.filter((rev) => {
    if (activeFilter === 'students') {
      return (
        rev.userType === 'Student' ||
        rev.userProfession.toLowerCase().includes('student') ||
        rev.userProfession.toLowerCase().includes('msu') ||
        rev.userProfession.toLowerCase().includes('intern')
      );
    }
    if (activeFilter === 'professionals') {
      return (
        rev.userType === 'Professional' ||
        rev.userProfession.toLowerCase().includes('engineer') ||
        rev.userProfession.toLowerCase().includes('manager') ||
        rev.userProfession.toLowerCase().includes('doctor') ||
        rev.userProfession.toLowerCase().includes('lead') ||
        rev.userProfession.toLowerCase().includes('l&t')
      );
    }
    if (activeFilter === '5stars') {
      return rev.rating === 5;
    }
    return true;
  });

  const avgRating =
    chefReviews.length > 0
      ? (chefReviews.reduce((sum, r) => sum + r.rating, 0) / chefReviews.length).toFixed(1)
      : mother.rating.toFixed(1);

  const studentReviewsCount = chefReviews.filter(
    (r) =>
      r.userType === 'Student' ||
      r.userProfession.toLowerCase().includes('student') ||
      r.userProfession.toLowerCase().includes('msu')
  ).length;

  const professionalReviewsCount = chefReviews.filter(
    (r) =>
      r.userType === 'Professional' ||
      r.userProfession.toLowerCase().includes('engineer') ||
      r.userProfession.toLowerCase().includes('manager') ||
      r.userProfession.toLowerCase().includes('doctor') ||
      r.userProfession.toLowerCase().includes('lead') ||
      r.userProfession.toLowerCase().includes('l&t')
  ).length;

  const fiveStarReviewsCount = chefReviews.filter((r) => r.rating === 5).length;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#2C1810]/75 backdrop-blur-md overflow-hidden"
        onClick={closeChefReviewsModal}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#FFFDF9] border border-[#E5C3A6] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header Banner */}
          <div className="relative bg-gradient-to-r from-[#F5EBE1] to-[#ECDBCB] p-4 sm:p-6 border-b border-[#E5C3A6]/60 flex items-center justify-between shrink-0 z-20">
            <div className="flex items-center gap-3.5 sm:gap-5 pr-2">
              <div className="relative shrink-0">
                <img
                  src={mother.profilePhoto}
                  alt={mother.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-white shadow-md ring-2 ring-[#D97706]/30"
                />
                {mother.isVerified && (
                  <div
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shadow-sm"
                    title="Verified Kitchen"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-rozha text-xl sm:text-2xl text-[#2C1810] leading-tight">
                    {mother.name}'s Reviews
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#D97706]/15 text-[#B45309] text-[10px] font-bold">
                    Tiffin #{mother.id}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-[#6B3A19] mt-1">
                  <span className="flex items-center gap-1 font-bold text-amber-700 bg-white/80 px-2 py-0.5 rounded-md border border-amber-200 shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {avgRating} ({chefReviews.length} Verified Reviews)
                  </span>
                  <span className="flex items-center gap-1 font-medium text-[#2C1810]">
                    <MapPin className="w-3 h-3 text-[#D97706]" /> {mother.area}, Vadodara
                  </span>
                  <span className="text-[11px] text-[#8C6B53]">
                    ₹{mother.pricePerTiffin}/meal
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={closeChefReviewsModal}
              className="w-10 h-10 rounded-full bg-white text-[#2C1810] shadow-md border border-[#E5C3A6] hover:bg-[#F5EBE1] active:scale-95 transition-all shrink-0 ml-2 flex items-center justify-center"
              title="Close"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-[#2C1810]" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
            {/* Quick Action & Rating Summary Bar */}
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#FBF6EE] to-[#FFFDF9] border border-[#E5C3A6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex flex-col items-center justify-center font-bold shadow-inner shrink-0">
                  <span className="text-xl leading-none">{avgRating}</span>
                  <div className="flex items-center text-[10px] mt-0.5">
                    <Star className="w-3 h-3 fill-white" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#2C1810]">
                    {mother.name}'s Homestyle Kitchen
                  </h4>
                  <p className="text-[11px] text-[#8C6B53]">
                    {mother.experienceYears}+ years experience • {mother.specialtyCuisines.join(', ')}
                  </p>
                  <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                    ✓ 100% Homestyle, low-oil, no baking soda, no preservatives
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    closeChefReviewsModal();
                    openWriteReviewModal({ mother });
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-white border border-[#D97706] text-[#D97706] hover:bg-amber-50 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Write Review</span>
                </button>

                <button
                  onClick={() => {
                    closeChefReviewsModal();
                    openBookingModal(mother);
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-gradient-to-r from-[#D97706] to-[#E07A5F] hover:from-[#B45309] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Tiffin</span>
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5C3A6]/60 pb-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeFilter === 'all'
                      ? 'bg-[#2C1810] text-amber-200 shadow-xs'
                      : 'bg-[#F5EBE1] text-[#6B3A19] hover:bg-[#ECDBCB]'
                  }`}
                >
                  <Filter className="w-3 h-3" />
                  <span>All ({chefReviews.length})</span>
                </button>

                <button
                  onClick={() => setActiveFilter('students')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeFilter === 'students'
                      ? 'bg-[#D97706] text-white shadow-xs'
                      : 'bg-[#F5EBE1] text-[#6B3A19] hover:bg-[#ECDBCB]'
                  }`}
                >
                  <GraduationCap className="w-3 h-3" />
                  <span>Students ({studentReviewsCount})</span>
                </button>

                <button
                  onClick={() => setActiveFilter('professionals')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeFilter === 'professionals'
                      ? 'bg-[#3D2218] text-amber-100 shadow-xs'
                      : 'bg-[#F5EBE1] text-[#6B3A19] hover:bg-[#ECDBCB]'
                  }`}
                >
                  <Briefcase className="w-3 h-3" />
                  <span>Working Professionals ({professionalReviewsCount})</span>
                </button>

                <button
                  onClick={() => setActiveFilter('5stars')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeFilter === '5stars'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-[#F5EBE1] text-[#6B3A19] hover:bg-[#ECDBCB]'
                  }`}
                >
                  <Star className="w-3 h-3 fill-current" />
                  <span>5-Stars ({fiveStarReviewsCount})</span>
                </button>
              </div>

              <span className="text-[11px] text-[#8C6B53]">
                Showing {filteredReviews.length} reviews for {mother.name}
              </span>
            </div>

            {/* Reviews List */}
            {filteredReviews.length === 0 ? (
              <div className="text-center py-10 space-y-3 bg-[#FBF6EE] rounded-2xl border border-[#E5C3A6]/40 p-6">
                <Quote className="w-10 h-10 text-[#E5C3A6] mx-auto" />
                <h4 className="font-rozha text-lg text-[#2C1810]">
                  No reviews match this filter
                </h4>
                <p className="text-xs text-[#8C6B53] max-w-md mx-auto">
                  Be the first to share your experience with {mother.name}'s tiffin!
                </p>
                <button
                  onClick={() => {
                    closeChefReviewsModal();
                    openWriteReviewModal({ mother });
                  }}
                  className="mt-2 px-4 py-2 rounded-xl bg-[#D97706] text-white text-xs font-bold hover:bg-[#B45309] transition-colors"
                >
                  Write First Review
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReviews.map((rev) => {
                  const isStudent =
                    rev.userType === 'Student' ||
                    rev.userProfession.toLowerCase().includes('student') ||
                    rev.userProfession.toLowerCase().includes('msu');

                  const hasLiked = !!userLiked[rev.id];
                  const helpfulCount = (helpfulLikes[rev.id] || 0) + (rev.rating === 5 ? 12 : 5);

                  return (
                    <div
                      key={rev.id}
                      className="p-5 rounded-2xl bg-white border border-[#E5C3A6]/70 shadow-xs hover:border-[#D97706] transition-all space-y-3"
                    >
                      {/* Top Row: User + Badge + Stars */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {rev.userAvatar ? (
                            <img
                              src={rev.userAvatar}
                              alt={rev.userName}
                              className="w-10 h-10 rounded-2xl object-cover border border-[#E5C3A6] shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D97706] to-[#E07A5F] text-white flex items-center justify-center font-bold text-xs shrink-0">
                              {rev.userName.charAt(0)}
                            </div>
                          )}

                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-xs text-[#2C1810]">{rev.userName}</h4>
                              {rev.verifiedSubscriber && (
                                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                  <CheckCircle className="w-2.5 h-2.5 text-emerald-600" /> Verified
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#8C6B53]">{rev.userProfession}</p>
                            {rev.userArea && (
                              <span className="text-[10px] text-[#B45309] font-medium block">
                                📍 {rev.userArea}, Vadodara
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Star Rating & Audience Tag */}
                        <div className="flex flex-col items-end gap-1 shrink-0">
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
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isStudent
                                ? 'bg-amber-100 text-[#B45309]'
                                : 'bg-[#3D2218] text-amber-200'
                            }`}
                          >
                            {isStudent ? 'Student' : 'Professional'}
                          </span>
                        </div>
                      </div>

                      {/* Comment */}
                      <p className="text-xs text-[#4A2E20] leading-relaxed italic bg-[#FBF6EE]/60 p-3 rounded-xl border border-[#E5C3A6]/40">
                        "{rev.comment}"
                      </p>

                      {/* Bottom Info: Dish & Helpful */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-[#8C6B53]">
                        {rev.dishMentioned && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#F5EBE1] text-[#2C1810] font-medium text-[10px] border border-[#E5C3A6]/60">
                            <Utensils className="w-3 h-3 text-[#D97706]" />
                            <span>Ordered: <strong>{rev.dishMentioned}</strong></span>
                          </span>
                        )}

                        <div className="flex items-center gap-3 ml-auto">
                          <span>{rev.date}</span>
                          <button
                            onClick={() => toggleHelpful(rev.id)}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                              hasLiked
                                ? 'bg-amber-100 text-[#B45309] border border-amber-300'
                                : 'bg-[#FBF6EE] text-[#8C6B53] hover:bg-[#F5EBE1] border border-[#E5C3A6]/40'
                            }`}
                          >
                            <ThumbsUp className={`w-3 h-3 ${hasLiked ? 'fill-current' : ''}`} />
                            <span>Helpful ({helpfulCount})</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
