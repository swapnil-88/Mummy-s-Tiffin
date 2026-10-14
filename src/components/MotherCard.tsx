import React from 'react';
import { motion } from 'motion/react';
import { Star, MapPin, CheckCircle, Utensils, Calendar, Eye, MessageSquareQuote } from 'lucide-react';
import { MotherChef } from '../types';
import { useAppStore } from '../store/useAppStore';

interface MotherCardProps {
  mother: MotherChef;
}

export const MotherCard: React.FC<MotherCardProps> = ({ mother }) => {
  const { openMenuModal, openBookingModal, openChefReviewsModal } = useAppStore();

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="bg-[#FFFDF9] rounded-3xl border border-[#E5C3A6]/70 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
    >
      <div>
        {/* Top Header Banner with Profile Image */}
        <div className="relative h-44 bg-gradient-to-r from-[#F5EBE1] to-[#ECDBCB] p-4 flex items-end">
          {/* Clickable Rating & Reviews Badge */}
          <button
            onClick={() => openChefReviewsModal(mother)}
            className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-amber-800 hover:text-[#D97706] text-xs font-bold shadow-sm border border-amber-200 hover:border-[#D97706] transition-all cursor-pointer group"
            title={`Read ${mother.name}'s reviews`}
          >
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 group-hover:scale-110 transition-transform" />
            <span>{mother.rating.toFixed(1)}</span>
            <span className="text-[#8C6B53] text-[10px] group-hover:text-[#D97706]">({mother.reviewCount} Reviews)</span>
          </button>

          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#2C1810]/80 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#D97706]" />
            {mother.area}
          </div>

          <div className="flex items-center gap-4 z-10">
            <div className="relative">
              <img
                src={mother.profilePhoto}
                alt={mother.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-lg ring-2 ring-[#D97706]/20"
              />
              {mother.isVerified && (
                <div
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm"
                  title="FSSAI Verified Home Kitchen"
                >
                  <CheckCircle className="w-4 h-4" />
                </div>
              )}
            </div>

            <div>
              <h3 className="font-rozha text-2xl text-[#2C1810] leading-tight flex items-center gap-1.5">
                {mother.name}
              </h3>
              <p className="text-xs text-[#8C6B53] font-medium">
                {mother.experienceYears}+ Years Homestyle Cooking
              </p>
              <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block border border-emerald-200">
                ● {mother.isOpen ? 'Accepting Orders Today' : 'Kitchen Closed'}
              </div>
            </div>
          </div>
        </div>

        {/* Cuisines & Bio */}
        <div className="p-5 space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {mother.specialtyCuisines.map((c) => (
              <span
                key={c}
                className="px-2.5 py-0.5 rounded-full bg-[#F5EBE1] border border-[#E5C3A6]/80 text-[#B45309] text-[11px] font-bold"
              >
                {c}
              </span>
            ))}
          </div>

          <p className="text-xs text-[#5C3D2E] line-clamp-2 leading-relaxed italic">
            "{mother.bio}"
          </p>

          {/* Tiffin Preview & Weekly Plan Box */}
          <div className="p-3 rounded-2xl bg-[#FBF6EE] border border-[#E5C3A6]/50 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#2C1810]">
              <span className="flex items-center gap-1.5 text-[#B45309]">
                <Utensils className="w-3.5 h-3.5" /> Daily Thali
              </span>
              <span className="text-base text-[#D97706] font-bold">
                ₹{mother.pricePerTiffin}
                <span className="text-[10px] text-[#8C6B53] font-normal">/meal</span>
              </span>
            </div>

            <ul className="text-[11px] text-[#6B3A19] space-y-0.5 list-disc list-inside">
              {mother.tiffinContents.slice(0, 3).map((item, idx) => (
                <li key={idx} className="truncate">
                  {item}
                </li>
              ))}
            </ul>

            {/* Weekly Plan Benefit Highlight */}
            <div className="pt-2 border-t border-[#E5C3A6]/50 flex items-center justify-between text-[11px]">
              <span className="text-[#8C6B53] flex items-center gap-1">
                <span className="text-amber-600">📅</span> Weekly Plan:
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openBookingModal(mother, 'weekly');
                }}
                className="font-bold text-[#B45309] hover:text-[#D97706] underline decoration-amber-400"
              >
                ₹{Math.round(mother.pricePerTiffin * 0.85)}/meal (Save 15%) →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action CTA Buttons */}
      <div className="p-5 pt-0 space-y-2">
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => openMenuModal(mother)}
            className="w-full py-2.5 px-3 rounded-xl bg-[#F5EBE1] hover:bg-[#ECDBCB] text-[#2C1810] text-xs font-bold flex items-center justify-center gap-1.5 border border-[#E5C3A6] transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#B45309]" /> View Menu
          </button>

          <button
            onClick={() => openBookingModal(mother, 'single')}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#D97706] to-[#E07A5F] hover:from-[#B45309] hover:to-[#C05621] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" /> Book / Subscribe
          </button>
        </div>

        {/* Dedicated Chef Reviews Button */}
        <button
          onClick={() => openChefReviewsModal(mother)}
          className="w-full py-2 px-3 rounded-xl bg-white hover:bg-amber-50 text-[#B45309] text-xs font-semibold flex items-center justify-center gap-1.5 border border-dashed border-[#D97706]/60 hover:border-[#D97706] transition-all cursor-pointer"
        >
          <MessageSquareQuote className="w-3.5 h-3.5 text-[#D97706]" />
          <span>Read Reviews & Ratings ({mother.reviewCount})</span>
        </button>
      </div>
    </motion.div>
  );
};

