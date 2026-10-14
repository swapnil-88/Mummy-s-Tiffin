import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Star,
  ChefHat,
  GraduationCap,
  Briefcase,
  MapPin,
  Utensils,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const WriteReviewModal: React.FC = () => {
  const {
    isWriteReviewModalOpen,
    closeWriteReviewModal,
    reviewTargetOrder,
    reviewTargetMother,
    mothers,
    addReview,
    user,
  } = useAppStore();

  const [formData, setFormData] = useState({
    userName: user?.name || 'Karan Mehta',
    userProfession:
      user?.profession === 'Student'
        ? 'MSU Baroda (Student)'
        : user?.profession === 'Employee'
        ? 'Working Professional'
        : 'MSU Faculty of Tech',
    userType: (user?.profession === 'Student' ? 'Student' : 'Student') as 'Student' | 'Professional',
    userArea: user?.area || 'Fatehgunj',
    motherId: mothers[0]?.id || 'mother-1',
    rating: 5,
    dishMentioned: '',
    comment: '',
  });

  const [error, setError] = useState('');

  // Sync with target when opened
  useEffect(() => {
    if (isWriteReviewModalOpen) {
      const targetMotherId = reviewTargetOrder?.motherId || reviewTargetMother?.id || mothers[0]?.id || 'mother-1';
      const targetDish =
        reviewTargetOrder?.items?.[0]?.itemName ||
        (reviewTargetMother ? `${reviewTargetMother.name}'s Homestyle Thali` : '');

      setFormData((prev) => ({
        ...prev,
        userName: user?.name || prev.userName || 'Karan Mehta',
        userArea: user?.area || prev.userArea || 'Fatehgunj',
        motherId: targetMotherId,
        dishMentioned: targetDish || prev.dishMentioned,
        userType: user?.profession === 'Employee' ? 'Professional' : 'Student',
        userProfession:
          user?.profession === 'Employee'
            ? 'Software Engineer, Vadodara'
            : 'MSU Faculty of Tech (Student)',
      }));
      setError('');
    }
  }, [isWriteReviewModalOpen, reviewTargetOrder, reviewTargetMother, user, mothers]);

  if (!isWriteReviewModalOpen) return null;

  const selectedMother =
    mothers.find((m) => m.id === formData.motherId) ||
    reviewTargetMother ||
    mothers[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userName.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!formData.userProfession.trim()) {
      setError('Please enter your college or company');
      return;
    }
    if (!formData.comment.trim() || formData.comment.trim().length < 10) {
      setError('Please write at least 10 characters describing the taste and meal experience');
      return;
    }

    addReview({
      userId: user?.id || 'user-demo-1',
      orderId: reviewTargetOrder?.id,
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
          ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    });

    closeWriteReviewModal();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#2C1810]/75 backdrop-blur-md overflow-hidden"
        onClick={closeWriteReviewModal}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-[#FFFDF9] border border-[#E5C3A6] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#F5EBE1] p-4 sm:p-5 border-b border-[#E5C3A6]/60 flex items-center justify-between shrink-0 z-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D97706] to-[#E07A5F] text-white flex items-center justify-center shadow-sm">
                <ChefHat className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-rozha text-lg sm:text-xl text-[#2C1810]">
                  {reviewTargetOrder
                    ? `Rate Your Tiffin Order (${reviewTargetOrder.id})`
                    : `Review ${selectedMother?.name || "Mother Chef"}`}
                </h3>
                <p className="text-[11px] text-[#8C6B53]">
                  Share honest feedback for home-cooked meals in Vadodara
                </p>
              </div>
            </div>

            <button
              onClick={closeWriteReviewModal}
              className="w-9 h-9 rounded-full bg-white text-[#2C1810] shadow-sm border border-[#E5C3A6] hover:bg-[#F5EBE1] flex items-center justify-center transition-all"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* If from delivered order, show badge */}
            {reviewTargetOrder && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Verified Delivered Order: <strong>{reviewTargetOrder.motherName}</strong> ({reviewTargetOrder.items.map((i) => i.itemName).join(', ')})
                </span>
              </div>
            )}

            {/* Mother Chef Selector (if not locked by order) */}
            {!reviewTargetOrder && (
              <div>
                <label className="block text-xs font-bold text-[#2C1810] mb-1">
                  Selected Mother Chef *
                </label>
                <select
                  value={formData.motherId}
                  onChange={(e) => setFormData({ ...formData, motherId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5C3A6] text-xs font-bold text-[#2C1810] focus:ring-2 focus:ring-[#D97706] focus:outline-none cursor-pointer"
                >
                  {mothers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.area} - {m.specialtyCuisines.join(', ')})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Star Rating Picker */}
            <div className="p-3.5 rounded-2xl bg-[#FBF6EE] border border-[#E5C3A6]/60 text-center space-y-2">
              <label className="block text-xs font-bold text-[#2C1810]">
                How would you rate the food taste & quality? *
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="p-1 rounded-lg hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= formData.rating
                          ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                          : 'fill-stone-200 text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-[#B45309] block">
                {formData.rating === 5 && '★★★★★ 5.0 - Heavenly Homestyle (Like Mom made it!)'}
                {formData.rating === 4 && '★★★★☆ 4.0 - Very Delicious & Wholesome'}
                {formData.rating === 3 && '★★★☆☆ 3.0 - Good Meal'}
                {formData.rating === 2 && '★★☆☆☆ 2.0 - Average'}
                {formData.rating === 1 && '★☆☆☆☆ 1.0 - Needs Improvement'}
              </span>
            </div>

            {/* User Type Toggle */}
            <div>
              <label className="block text-xs font-bold text-[#2C1810] mb-1.5">
                I am a:
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, userType: 'Student' })}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    formData.userType === 'Student'
                      ? 'bg-[#D97706] text-white border-[#D97706] shadow-xs'
                      : 'bg-white text-[#6B3A19] border-[#E5C3A6] hover:bg-[#FBF6EE]'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Student (MSU / College)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, userType: 'Professional' })}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    formData.userType === 'Professional'
                      ? 'bg-[#3D2218] text-amber-100 border-[#3D2218] shadow-xs'
                      : 'bg-white text-[#6B3A19] border-[#E5C3A6] hover:bg-[#FBF6EE]'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Working Professional</span>
                </button>
              </div>
            </div>

            {/* Name and Designation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#2C1810] mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Siddharth Dave"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5C3A6] text-xs text-[#2C1810] focus:ring-2 focus:ring-[#D97706] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C1810] mb-1">
                  {formData.userType === 'Student' ? 'College / Faculty *' : 'Company / Role *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    formData.userType === 'Student'
                      ? 'e.g. MSU Faculty of Tech'
                      : 'e.g. L&T Knowledge City'
                  }
                  value={formData.userProfession}
                  onChange={(e) => setFormData({ ...formData, userProfession: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5C3A6] text-xs text-[#2C1810] focus:ring-2 focus:ring-[#D97706] focus:outline-none"
                />
              </div>
            </div>

            {/* Area & Dish */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#2C1810] mb-1">
                  Vadodara Area
                </label>
                <select
                  value={formData.userArea}
                  onChange={(e) => setFormData({ ...formData, userArea: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5C3A6] text-xs font-bold text-[#2C1810] focus:ring-2 focus:ring-[#D97706] focus:outline-none cursor-pointer"
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
                  Dish / Meal Eaten
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kathiyawadi Sev Tameta Thali"
                  value={formData.dishMentioned}
                  onChange={(e) => setFormData({ ...formData, dishMentioned: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5C3A6] text-xs text-[#2C1810] focus:ring-2 focus:ring-[#D97706] focus:outline-none"
                />
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-xs font-bold text-[#2C1810] mb-1">
                Your Review & Feedback *
              </label>
              <textarea
                required
                rows={3}
                placeholder="How was the softness of rotis, spice balance, cleanliness, and maternal care in this meal?"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5C3A6] text-xs text-[#2C1810] focus:ring-2 focus:ring-[#D97706] focus:outline-none"
              />
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeWriteReviewModal}
                className="px-4 py-2 rounded-xl border border-[#E5C3A6] text-xs font-bold text-[#6B3A19] hover:bg-[#F5EBE1] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#D97706] to-[#E07A5F] hover:from-[#B45309] hover:to-[#C05621] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Submit Review</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
