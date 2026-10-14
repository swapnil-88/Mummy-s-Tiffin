import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  GraduationCap,
  Briefcase,
  Quote,
  ShieldCheck,
  Heart,
  Sparkles,
  MapPin,
  Utensils,
  PlusCircle,
  X,
  ThumbsUp,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Review } from '../types';

type FilterCategory = 'all' | 'students' | 'professionals' | '5stars';

export const CustomerReviews: React.FC = () => {
  const { reviews, mothers, addReview, user, openAuthModal, isAuthenticated } = useAppStore();

  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [helpfulLikes, setHelpfulLikes] = useState<Record<string, number>>({});
  const [userLiked, setUserLiked] = useState<Record<string, boolean>>({});

  // Review Form State
  const [formData, setFormData] = useState({
    userName: user?.name || '',
    userProfession: user?.profession === 'Student' ? 'MSU Student' : user?.profession === 'Employee' ? 'Working Professional' : '',
    userType: (user?.profession === 'Student' ? 'Student' : 'Professional') as 'Student' | 'Professional',
    userArea: user?.area || 'Fatehgunj',
    motherId: mothers[0]?.id || 'mother-1',
    rating: 5,
    dishMentioned: '',
    comment: '',
  });

  const [formError, setFormError] = useState('');

  // Handle helpful toggle
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

  // Filter reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((rev) => {
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
          rev.userProfession.toLowerCase().includes('analyst') ||
          rev.userProfession.toLowerCase().includes('lead') ||
          rev.userProfession.toLowerCase().includes('l&t')
        );
      }
      if (activeFilter === '5stars') {
        return rev.rating === 5;
      }
      return true;
    });
  }, [reviews, activeFilter]);

  // Calculations
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 5.0;
    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  const studentCount = useMemo(() => {
    return reviews.filter(
      (r) =>
        r.userType === 'Student' ||
        r.userProfession.toLowerCase().includes('student') ||
        r.userProfession.toLowerCase().includes('msu') ||
        r.userProfession.toLowerCase().includes('intern')
    ).length;
  }, [reviews]);

  const professionalCount = useMemo(() => {
    return reviews.filter(
      (r) =>
        r.userType === 'Professional' ||
        r.userProfession.toLowerCase().includes('engineer') ||
        r.userProfession.toLowerCase().includes('manager') ||
        r.userProfession.toLowerCase().includes('doctor') ||
        r.userProfession.toLowerCase().includes('analyst') ||
        r.userProfession.toLowerCase().includes('lead') ||
        r.userProfession.toLowerCase().includes('l&t')
    ).length;
  }, [reviews]);

  const fiveStarCount = useMemo(() => {
    return reviews.filter((r) => r.rating === 5).length;
  }, [reviews]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userName.trim()) {
      setFormError('Please enter your name');
      return;
    }
    if (!formData.userProfession.trim()) {
      setFormError('Please specify your college or company/role');
      return;
    }
    if (!formData.comment.trim() || formData.comment.length < 15) {
      setFormError('Please share at least 15 characters of genuine feedback');
      return;
    }

    const selectedMother = mothers.find((m) => m.id === formData.motherId) || mothers[0];

    addReview({
      motherId: selectedMother.id,
      motherName: selectedMother.name,
      userName: formData.userName.trim(),
      userProfession: formData.userProfession.trim(),
      userType: formData.userType,
      userArea: formData.userArea,
      rating: formData.rating,
      comment: formData.comment.trim(),
      dishMentioned: formData.dishMentioned.trim() || `${selectedMother.name}'s Homestyle Thali`,
      verifiedSubscriber: true,
      userAvatar:
        formData.userType === 'Student'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
          : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    });

    setIsWriteModalOpen(false);
    setFormError('');
    setFormData({
      userName: '',
      userProfession: '',
      userType: 'Student',
      userArea: 'Fatehgunj',
      motherId: mothers[0]?.id || 'mother-1',
      rating: 5,
      dishMentioned: '',
      comment: '',
    });
  };

  return (
    <section id="customer-reviews" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* 1. SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-[#E5C3A6]/40">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-[#B45309] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Verified Student & Professional Testimonials</span>
          </div>
          <h2 className="font-rozha text-3xl sm:text-4xl lg:text-5xl text-[#2C1810]">
            Stories from Vadodara's Daily Tiffin Eaters
          </h2>
          <p className="text-xs sm:text-sm text-[#6B3A19] leading-relaxed">
            From MSU hostels in Fatehgunj to corporate tech parks in Alkapuri and Sayajigunj, discover why hundreds of students and working professionals trust our mother chefs for their daily meals.
          </p>
        </div>

        {/* Action Button: Write Review */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            id="write-review-btn"
            onClick={() => setIsWriteModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#D97706] to-[#E07A5F] hover:from-[#B45309] hover:to-[#C05621] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Share Your Tiffin Experience</span>
          </button>
        </div>
      </div>

      {/* 2. TRUST METRICS & HIGHLIGHTS BANNER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-3xl bg-gradient-to-br from-[#FFFDF9] to-[#FBF6EE] border border-[#E5C3A6] shadow-sm">
        {/* Rating Score */}
        <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/80 border border-[#E5C3A6]/60">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex flex-col items-center justify-center font-bold shadow-inner">
            <span className="text-lg leading-none">{averageRating}</span>
            <div className="flex items-center text-[10px]">
              <Star className="w-2.5 h-2.5 fill-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1 text-amber-500">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-xs font-bold text-[#2C1810] block mt-0.5">Top-Rated in Vadodara</span>
            <span className="text-[11px] text-[#8C6B53]">350+ verified reviews</span>
          </div>
        </div>

        {/* Student Trust */}
        <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/80 border border-[#E5C3A6]/60">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#D97706] flex items-center justify-center font-bold">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#2C1810] block">MSU & Hostel Favorite</span>
            <span className="text-[11px] text-[#8C6B53]">Affordable ₹80-₹110/meal</span>
            <span className="text-[10px] text-emerald-700 font-semibold block">Free delivery to campuses</span>
          </div>
        </div>

        {/* Corporate Trust */}
        <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/80 border border-[#E5C3A6]/60">
          <div className="w-12 h-12 rounded-2xl bg-[#3D2218] text-amber-200 flex items-center justify-center font-bold">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#2C1810] block">Corporate Preferred</span>
            <span className="text-[11px] text-[#8C6B53]">Low-oil, non-greasy thalis</span>
            <span className="text-[10px] text-amber-800 font-semibold block">L&T, HDFC, Alembic & IT</span>
          </div>
        </div>

        {/* Mom Care */}
        <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/80 border border-[#E5C3A6]/60">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
            <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#2C1810] block">100% Homestyle Purity</span>
            <span className="text-[11px] text-[#8C6B53]">No soda, no palm oil</span>
            <span className="text-[10px] text-rose-700 font-semibold block">Prepared by verified mothers</span>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE CATEGORY FILTER TABS */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="filter-all-reviews"
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeFilter === 'all'
                ? 'bg-[#2C1810] text-amber-100 shadow-md'
                : 'bg-white text-[#6B3A19] border border-[#E5C3A6] hover:bg-[#F5EBE1]'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>All Testimonials ({reviews.length})</span>
          </button>

          <button
            id="filter-students-reviews"
            onClick={() => setActiveFilter('students')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeFilter === 'students'
                ? 'bg-[#D97706] text-white shadow-md'
                : 'bg-white text-[#6B3A19] border border-[#E5C3A6] hover:bg-[#F5EBE1]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Students ({studentCount})</span>
          </button>

          <button
            id="filter-professionals-reviews"
            onClick={() => setActiveFilter('professionals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeFilter === 'professionals'
                ? 'bg-[#3D2218] text-amber-100 shadow-md'
                : 'bg-white text-[#6B3A19] border border-[#E5C3A6] hover:bg-[#F5EBE1]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Working Professionals ({professionalCount})</span>
          </button>

          <button
            id="filter-5stars-reviews"
            onClick={() => setActiveFilter('5stars')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeFilter === '5stars'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white text-[#6B3A19] border border-[#E5C3A6] hover:bg-[#F5EBE1]'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>5-Star Rated ({fiveStarCount})</span>
          </button>
        </div>

        <span className="text-xs text-[#8C6B53]">
          Showing <strong>{filteredReviews.length}</strong> verified experiences
        </span>
      </div>

      {/* 4. REVIEWS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredReviews.map((rev) => {
            const isStudent =
              rev.userType === 'Student' ||
              rev.userProfession.toLowerCase().includes('student') ||
              rev.userProfession.toLowerCase().includes('msu') ||
              rev.userProfession.toLowerCase().includes('intern');

            const hasLiked = !!userLiked[rev.id];
            const helpfulCount = (helpfulLikes[rev.id] || 0) + (rev.rating === 5 ? 12 : 6);

            return (
              <motion.div
                key={rev.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="p-6 rounded-3xl bg-[#FFFDF9] border border-[#E5C3A6] hover:border-[#D97706] shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-4 relative group"
              >
                {/* Top Row: Category Pill & Star Rating */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide ${
                        isStudent
                          ? 'bg-amber-100 text-[#B45309] border border-amber-200'
                          : 'bg-[#3D2218] text-amber-200 border border-amber-900/40'
                      }`}
                    >
                      {isStudent ? (
                        <>
                          <GraduationCap className="w-3 h-3 text-[#D97706]" />
                          <span>Student</span>
                        </>
                      ) : (
                        <>
                          <Briefcase className="w-3 h-3 text-amber-400" />
                          <span>Professional</span>
                        </>
                      )}
                    </span>

                    {/* Star Rating */}
                    <div className="flex items-center gap-0.5 text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-stone-200 text-stone-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Quote Icon & Feedback Text */}
                  <div className="relative pt-1">
                    <Quote className="w-6 h-6 text-[#E5C3A6]/50 absolute -top-1 -left-1 pointer-events-none" />
                    <p className="text-xs text-[#4A2E20] leading-relaxed relative z-10 pl-2">
                      "{rev.comment}"
                    </p>
                  </div>

                  {/* Mentioned Dish / Mother Chef Tag */}
                  <div className="pt-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#F5EBE1] text-[#2C1810] text-[11px] font-medium border border-[#E5C3A6]/70 w-full">
                      <Utensils className="w-3 h-3 text-[#D97706] shrink-0" />
                      <span className="truncate">
                        <strong className="font-semibold text-[#B45309]">{rev.motherName}'s</strong>{' '}
                        {rev.dishMentioned || 'Homestyle Special Thali'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Section: User Info, Area & Verification */}
                <div className="pt-4 border-t border-[#E5C3A6]/50 space-y-3">
                  <div className="flex items-center gap-3">
                    {/* User Avatar */}
                    {rev.userAvatar ? (
                      <img
                        src={rev.userAvatar}
                        alt={rev.userName}
                        className="w-10 h-10 rounded-2xl object-cover border border-[#E5C3A6] shadow-sm shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D97706] to-[#E07A5F] text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                        {rev.userName.charAt(0)}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-xs text-[#2C1810] truncate">{rev.userName}</h4>
                        {rev.verifiedSubscriber !== false && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" title="Verified Subscriber" />
                        )}
                      </div>
                      <p className="text-[11px] text-[#8C6B53] truncate">{rev.userProfession}</p>
                      {rev.userArea && (
                        <span className="text-[10px] text-[#B45309] font-medium flex items-center gap-1 mt-0.5">
                          <MapPin className="w-2.5 h-2.5" />
                          <span>{rev.userArea}, Vadodara</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Helpful Button & Timestamp */}
                  <div className="flex items-center justify-between text-[11px] text-[#8C6B53] pt-1">
                    <span>{rev.date}</span>
                    <button
                      onClick={() => toggleHelpful(rev.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
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
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* 5. WRITE A REVIEW MODAL */}
      <AnimatePresence>
        {isWriteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#FFFDF9] w-full max-w-lg rounded-3xl border border-[#E5C3A6] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-[#E5C3A6] pb-4">
                <div>
                  <h3 className="font-rozha text-2xl text-[#2C1810]">
                    Share Your Tiffin Story
                  </h3>
                  <p className="text-xs text-[#8C6B53]">
                    Help fellow students & professionals in Vadodara choose their mother chef!
                  </p>
                </div>
                <button
                  onClick={() => setIsWriteModalOpen(false)}
                  className="p-2 rounded-full hover:bg-[#F5EBE1] text-[#8C6B53] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {formError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                    {formError}
                  </div>
                )}

                {/* You are: Student or Professional */}
                <div>
                  <label className="block text-xs font-bold text-[#2C1810] mb-2">
                    I am a:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, userType: 'Student' })}
                      className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        formData.userType === 'Student'
                          ? 'bg-[#D97706] text-white border-[#D97706] shadow-sm'
                          : 'bg-white text-[#6B3A19] border-[#E5C3A6] hover:bg-[#FBF6EE]'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>Student (MSU / College)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, userType: 'Professional' })}
                      className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        formData.userType === 'Professional'
                          ? 'bg-[#3D2218] text-amber-100 border-[#3D2218] shadow-sm'
                          : 'bg-white text-[#6B3A19] border-[#E5C3A6] hover:bg-[#FBF6EE]'
                      }`}
                    >
                      <Briefcase className="w-4 h-4" />
                      <span>Working Professional</span>
                    </button>
                  </div>
                </div>

                {/* Name & Profession */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#2C1810] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Siddharth Dave"
                      value={formData.userName}
                      onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E5C3A6] text-xs text-[#2C1810] focus:ring-2 focus:ring-[#D97706] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2C1810] mb-1">
                      {formData.userType === 'Student' ? 'College / Degree *' : 'Company / Designation *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={formData.userType === 'Student' ? 'e.g. MSU Baroda (Commerce)' : 'e.g. L&T Vadodara, Engineer'}
                      value={formData.userProfession}
                      onChange={(e) => setFormData({ ...formData, userProfession: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E5C3A6] text-xs text-[#2C1810] focus:ring-2 focus:ring-[#D97706] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Area & Mother Chef */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#2C1810] mb-1">
                      Vadodara Area *
                    </label>
                    <select
                      value={formData.userArea}
                      onChange={(e) => setFormData({ ...formData, userArea: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E5C3A6] text-xs font-semibold text-[#2C1810] focus:ring-2 focus:ring-[#D97706] focus:outline-none cursor-pointer"
                    >
                      <option value="Fatehgunj">Fatehgunj (MSU)</option>
                      <option value="Alkapuri">Alkapuri</option>
                      <option value="Sayajigunj">Sayajigunj</option>
                      <option value="Gotri">Gotri</option>
                      <option value="Karelibaug">Karelibaug</option>
                      <option value="Manjalpur">Manjalpur</option>
                      <option value="Akota">Akota</option>
                      <option value="Race Course">Race Course</option>
                      <option value="Waghodia Road">Waghodia Road</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2C1810] mb-1">
                      Reviewed Mother Chef *
                    </label>
                    <select
                      value={formData.motherId}
                      onChange={(e) => setFormData({ ...formData, motherId: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E5C3A6] text-xs font-semibold text-[#2C1810] focus:ring-2 focus:ring-[#D97706] focus:outline-none cursor-pointer"
                    >
                      {mothers.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.area})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Dish Name */}
                <div>
                  <label className="block text-xs font-bold text-[#2C1810] mb-1">
                    Favorite Dish / Meal Ordered
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kathiyawadi Sev Tameta Special Thali"
                    value={formData.dishMentioned}
                    onChange={(e) => setFormData({ ...formData, dishMentioned: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E5C3A6] text-xs text-[#2C1810] focus:ring-2 focus:ring-[#D97706] focus:outline-none"
                  />
                </div>

                {/* Star Rating Picker */}
                <div>
                  <label className="block text-xs font-bold text-[#2C1810] mb-1">
                    Rating *
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="p-1.5 rounded-xl hover:bg-amber-100 transition-colors cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= formData.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-stone-200 text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-[#B45309] ml-2">
                      {formData.rating === 5
                        ? '5 / 5 - Exceptional Homestyle Food!'
                        : formData.rating === 4
                        ? '4 / 5 - Very Delicious'
                        : `${formData.rating} Stars`}
                    </span>
                  </div>
                </div>

                {/* Feedback Comment */}
                <div>
                  <label className="block text-xs font-bold text-[#2C1810] mb-1">
                    Your Review & Experience *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe the taste, rotis softness, hygiene, on-time delivery, and what you loved most about this mother chef's cooking..."
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E5C3A6] text-xs text-[#2C1810] focus:ring-2 focus:ring-[#D97706] focus:outline-none"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsWriteModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-[#E5C3A6] text-xs font-bold text-[#6B3A19] hover:bg-[#F5EBE1] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D97706] to-[#E07A5F] hover:from-[#B45309] hover:to-[#C05621] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    Publish Review
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
