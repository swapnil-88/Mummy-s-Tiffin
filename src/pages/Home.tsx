import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Utensils,
  MapPin,
  Star,
  ShieldCheck,
  Heart,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Award,
  Users,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { MotherCard } from '../components/MotherCard';
import { CustomerReviews } from '../components/CustomerReviews';
import { VADODARA_AREAS } from '../data/mockData';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { mothers, reviews, selectedArea, setSelectedArea, openAuthModal } = useAppStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const featuredMothers = mothers.slice(0, 4);

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[580px] bg-gradient-to-br from-[#2C1810] via-[#3D2218] to-[#1E100A] text-white overflow-hidden rounded-b-[40px] shadow-2xl">
        {/* Background Overlay Image */}
        <div className="absolute inset-0 opacity-25 mix-blend-overlay">
          <img
            src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=1600"
            alt="Authentic Indian Meal"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Ambient Warm Gradients */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#D97706]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#E07A5F]/20 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Text Column */}
          <div className="space-y-6 lg:max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Vadodara's #1 Authentic Home-Cooked Tiffin Network</span>
            </div>

            <h1 className="font-rozha text-4xl sm:text-5xl lg:text-6xl text-amber-100 leading-tight tracking-wide">
              Ghar Ka Khana Delivered.
            </h1>

            <p className="text-sm sm:text-base text-[#E5C3A6] leading-relaxed font-light">
              Craving authentic, hygienic home food in Vadodara? We connect mother chefs (Mummys) with university students & working executives for piping hot, fresh daily tiffin delivery.
            </p>

            {/* Area Filter Selector & CTA */}
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 text-xs text-amber-200 w-full sm:w-auto flex-1">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-medium text-white/80">Select Area:</span>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="bg-transparent font-bold text-white focus:outline-none cursor-pointer w-full"
                >
                  <option value="All" className="text-[#2C1810]">All Vadodara Areas</option>
                  {VADODARA_AREAS.map((a) => (
                    <option key={a} value={a} className="text-[#2C1810]">
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => navigate('/tiffins')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#D97706] to-[#E07A5F] hover:from-[#B45309] hover:to-[#C05621] text-white text-xs font-bold shadow-lg hover:shadow-amber-500/25 transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <span>Find a Tiffin</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Trust Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#E5C3A6]">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> FSSAI Certified Kitchens
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-4 h-4 text-amber-400" /> Hot Express Delivery
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400" /> 100% Home Cooked
              </span>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div className="relative w-full max-w-md lg:max-w-none lg:w-1/2">
            <div className="relative mx-auto max-w-sm rounded-3xl overflow-hidden border-4 border-amber-500/30 shadow-2xl bg-[#3D2218]">
              <img
                src="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=800"
                alt="Gujarati Kathiyawadi Thali"
                className="w-full h-80 object-cover"
              />
              <div className="p-5 bg-[#2C1810] text-amber-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Featured Today
                  </span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.9 (180+ Reviews)
                  </span>
                </div>
                <h3 className="font-rozha text-2xl text-white">Lina Patel's Kathiyawadi Thali</h3>
                <p className="text-xs text-[#E5C3A6]">
                  5 Soft Butter Phulkas, Sev Tameta Subzi, Gujarati Sweet Dal, Basmati Rice & Masala Chaas.
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xl font-bold text-amber-400">₹110 / tiffin</span>
                  <button
                    onClick={() => navigate('/tiffins')}
                    className="px-4 py-2 rounded-xl bg-white text-[#2C1810] text-xs font-bold hover:bg-amber-100 transition-colors"
                  >
                    Explore All Mothers
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MOTHER'S GRID SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider block">
              Handpicked Home Kitchens
            </span>
            <h2 className="font-rozha text-3xl sm:text-4xl text-[#2C1810] mt-1">
              Meet Our Mother Chefs
            </h2>
            <p className="text-xs sm:text-sm text-[#8C6B53] mt-1">
              Mother chefs preparing traditional regional thalis in Vadodara with clean, home ingredients.
            </p>
          </div>

          <Link
            to="/tiffins"
            className="px-5 py-2.5 rounded-full bg-[#F5EBE1] hover:bg-[#ECDBCB] text-[#D97706] text-xs font-bold flex items-center gap-1.5 transition-colors border border-[#E5C3A6]"
          >
            <span>View All Mothers ({mothers.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredMothers.map((mother) => (
            <MotherCard key={mother.id} mother={mother} />
          ))}
        </div>
      </section>

      {/* 3. WHY CHOOSE US SECTION */}
      <section className="bg-[#FBF6EE] py-16 border-y border-[#E5C3A6]/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Visual Box with Tiffin Image */}
            <div className="relative">
              <div className="relative mx-auto rounded-3xl overflow-hidden border-4 border-white shadow-xl max-w-md">
                <img
                  src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800"
                  alt="Homestyle Indian Food Tiffin"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6 text-white">
                  <div>
                    <span className="text-xs font-bold text-amber-300">100% Homestyle Hygiene</span>
                    <h4 className="font-rozha text-2xl">Pure Ingredients, Zero Commercial Colors</h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits List */}
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider block">
                  Why Students & Professionals Love Us
                </span>
                <h2 className="font-rozha text-3xl sm:text-4xl text-[#2C1810] mt-1">
                  Taste Like Home, Pocket Friendly Too
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-[#E5C3A6]/60 shadow-sm">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-[#D97706] flex items-center justify-center font-bold mb-2">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-[#2C1810]">Home Kitchen Hygiene</h4>
                  <p className="text-xs text-[#6B3A19] mt-1">
                    Every mother chef’s kitchen is personally verified for cleanliness & food safety.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E5C3A6]/60 shadow-sm">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-[#D97706] flex items-center justify-center font-bold mb-2">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-[#2C1810]">Daily Menu Variety</h4>
                  <p className="text-xs text-[#6B3A19] mt-1">
                    Never get bored! Subzi & Kathol change daily so you get balanced nutrition.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E5C3A6]/60 shadow-sm">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-[#D97706] flex items-center justify-center font-bold mb-2">
                    <Award className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-[#2C1810]">Student Friendly Rates</h4>
                  <p className="text-xs text-[#6B3A19] mt-1">
                    Tiffins start from just ₹80-₹110 per meal. Affordable for MSU & hostel students.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E5C3A6]/60 shadow-sm">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-[#D97706] flex items-center justify-center font-bold mb-2">
                    <Heart className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-[#2C1810]">Women Empowerment</h4>
                  <p className="text-xs text-[#6B3A19] mt-1">
                    Your orders directly support independent home-makers gaining financial freedom.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (5-STEP PROCESS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        <div>
          <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider block">
            Simple 5-Step Process
          </span>
          <h2 className="font-rozha text-3xl sm:text-4xl text-[#2C1810] mt-1">
            How Mummy's Tiffin Works
          </h2>
          <p className="text-xs sm:text-sm text-[#8C6B53] max-w-xl mx-auto mt-1">
            Getting warm, homemade food delivered to your PG, hostel, or office in Vadodara is super easy!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { step: '01', title: 'Choose Mother Chef', desc: 'Browse profiles in Fatehgunj, Alkapuri, Sayajigunj & Manjalpur.' },
            { step: '02', title: 'Select Lunch / Dinner', desc: 'Pick your preferred delivery slot and delivery date.' },
            { step: '03', title: 'Custom or Thali', desc: 'Book standard daily tiffin or order specific menu delicacies.' },
            { step: '04', title: 'Piping Hot Delivery', desc: 'Our Express Vadodara partner delivers hot meals to your door.' },
            { step: '05', title: 'Enjoy Homestyle Food', desc: 'Eat healthy, warm, mother-cooked food with zero guilt!' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-[#FFFDF9] border border-[#E5C3A6] text-left hover:border-[#D97706] hover:shadow-lg transition-all relative overflow-hidden group"
            >
              <span className="text-4xl font-rozha text-[#E5C3A6] group-hover:text-[#D97706] transition-colors block mb-2">
                {item.step}
              </span>
              <h4 className="font-bold text-sm text-[#2C1810] mb-1">{item.title}</h4>
              <p className="text-xs text-[#6B3A19] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. WOMEN EMPOWERMENT IMPACT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#2C1810] to-[#3D2218] text-white flex flex-col lg:flex-row items-center justify-between gap-8 border border-amber-900/60 shadow-xl">
          <div className="space-y-4 lg:max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
              <Heart className="w-3.5 h-3.5 fill-rose-300" /> Women Empowerment Mission
            </div>
            <h2 className="font-rozha text-3xl sm:text-4xl text-amber-100">
              Transforming Home Kitchens into Thriving Businesses
            </h2>
            <p className="text-xs sm:text-sm text-[#E5C3A6] leading-relaxed">
              Mummy's Tiffin has enabled over 50+ mother chefs in Vadodara to earn a respectful monthly income from home. If you or a mother you know loves cooking, register today!
            </p>
            <div className="pt-2 flex items-center gap-6 text-xs text-amber-200">
              <div>
                <span className="text-2xl font-bold text-white block">50+</span>
                <span>Active Mother Chefs</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-white block">12,000+</span>
                <span>Tiffins Served in Vadodara</span>
              </div>
            </div>
          </div>

          <div className="w-full sm:w-auto text-center">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLScgxOdVt-gXWTV_iDeWx6Uu7T-KSNtP3W4pGmunF4KGMuzICA/viewform"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                window.open(
                  'https://docs.google.com/forms/d/e/1FAIpQLScgxOdVt-gXWTV_iDeWx6Uu7T-KSNtP3W4pGmunF4KGMuzICA/viewform',
                  '_blank',
                  'noopener,noreferrer'
                );
              }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#D97706] to-[#E07A5F] hover:from-[#B45309] hover:to-[#C05621] text-white text-sm font-bold shadow-xl transition-all cursor-pointer"
            >
              <span>Register as a Mother Chef (Google Form)</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <span className="block text-[11px] text-[#C49A78] mt-2">
              Zero joining fee • Flexible cooking hours • Daily payouts
            </span>
          </div>
        </div>
      </section>

      {/* 6. CUSTOMER REVIEWS & TESTIMONIALS SECTION */}
      <CustomerReviews />
    </div>
  );
};
