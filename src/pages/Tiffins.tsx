import React, { useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, MapPin, Star, Utensils } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { MotherCard } from '../components/MotherCard';
import { VADODARA_AREAS } from '../data/mockData';

export const Tiffins: React.FC = () => {
  const {
    mothers,
    selectedArea,
    setSelectedArea,
    selectedCuisine,
    setSelectedCuisine,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
  } = useAppStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const CUISINES = [
    'All',
    'Gujarati Kathiyawadi',
    'Jain Gujarati',
    'North Indian',
    'Maharashtrian',
    'South Indian',
  ];

  // Filtering Logic
  const filteredMothers = mothers.filter((m) => {
    const matchesArea = selectedArea === 'All' || m.area === selectedArea;

    const matchesCuisine =
      selectedCuisine === 'All' ||
      m.specialtyCuisines.some((c) =>
        c.toLowerCase().includes(selectedCuisine.toLowerCase())
      );

    const matchesSearch =
      searchQuery === '' ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.specialtyCuisines.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.bio.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesArea && matchesCuisine && matchesSearch;
  });

  // Sorting Logic
  const sortedMothers = [...filteredMothers].sort((a, b) => {
    if (sortBy === 'price-low') return a.pricePerTiffin - b.pricePerTiffin;
    if (sortBy === 'price-high') return b.pricePerTiffin - a.pricePerTiffin;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.reviewCount - a.reviewCount; // recommended default
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider block">
          Vadodara Home Kitchen Directory
        </span>
        <h1 className="font-rozha text-3xl sm:text-4xl text-[#2C1810]">
          Find Mother Chefs Near You
        </h1>
        <p className="text-xs sm:text-sm text-[#8C6B53]">
          Browse authentic home kitchens across Fatehgunj, Alkapuri, Sayajigunj & Manjalpur. Book single-day or daily tiffins.
        </p>
      </div>

      {/* Weekly Subscription Highlight Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#2C1810] to-[#4A2818] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg border border-[#E5C3A6]/40">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#D97706] to-[#B45309] text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-md">
            🍱
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-rozha text-base sm:text-lg text-amber-200">
                Weekly Meal Subscriptions
              </h3>
              <span className="bg-emerald-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-tight">
                Save Up to 15%
              </span>
            </div>
            <p className="text-xs text-amber-100/80">
              Subscribe to 5, 6, or 7-day recurring lunch & dinner plans with free priority delivery and flexible day pausing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold shrink-0">
          <span className="text-amber-200/90 text-[11px]">
            ⚡ Free Delivery • Easy Pause Anytime
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 sm:p-6 rounded-3xl bg-[#FFFDF9] border border-[#E5C3A6] shadow-md space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-[#B45309] absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search mother chef name, area (e.g. Fatehgunj), or cuisine (e.g. Kathiyawadi)..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[#FBF6EE] border border-[#E5C3A6] text-xs sm:text-sm text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Area Selector */}
          <div>
            <label className="block text-[11px] font-bold text-[#8C6B53] mb-1">
              📍 Vadodara Area
            </label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#FBF6EE] border border-[#E5C3A6] text-xs font-bold text-[#2C1810] focus:outline-none"
            >
              <option value="All">All Areas ({mothers.length} Kitchens)</option>
              {VADODARA_AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* Cuisine Filter */}
          <div>
            <label className="block text-[11px] font-bold text-[#8C6B53] mb-1">
              🍛 Cuisine Specialty
            </label>
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#FBF6EE] border border-[#E5C3A6] text-xs font-bold text-[#2C1810] focus:outline-none"
            >
              {CUISINES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sorting */}
          <div>
            <label className="block text-[11px] font-bold text-[#8C6B53] mb-1">
              ⚡ Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full p-2.5 rounded-xl bg-[#FBF6EE] border border-[#E5C3A6] text-xs font-bold text-[#2C1810] focus:outline-none"
            >
              <option value="recommended">Recommended & Popular</option>
              <option value="rating">Highest Rating ★</option>
              <option value="price-low">Price: Low to High (₹80+)</option>
              <option value="price-high">Price: High to Low (₹150+)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-[#8C6B53] px-1">
        <span>
          Showing <strong className="text-[#2C1810]">{sortedMothers.length}</strong> mother chefs in Vadodara
        </span>
        {(selectedArea !== 'All' || selectedCuisine !== 'All' || searchQuery !== '') && (
          <button
            onClick={() => {
              setSelectedArea('All');
              setSelectedCuisine('All');
              setSearchQuery('');
            }}
            className="text-[#D97706] font-bold underline hover:text-[#B45309]"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Grid of Mothers */}
      {sortedMothers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedMothers.map((mother) => (
            <MotherCard key={mother.id} mother={mother} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-[#FBF6EE] rounded-3xl border border-[#E5C3A6] space-y-3">
          <Utensils className="w-10 h-10 text-[#D97706] mx-auto opacity-60" />
          <h3 className="font-rozha text-xl text-[#2C1810]">No Mother Chefs Found</h3>
          <p className="text-xs text-[#8C6B53]">
            Try changing your area or cuisine filter to see kitchens nearby.
          </p>
          <button
            onClick={() => {
              setSelectedArea('All');
              setSelectedCuisine('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-[#D97706] text-white text-xs font-bold"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
