import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Phone, Mail, Award, ExternalLink, Utensils } from 'lucide-react';
import { VADODARA_AREAS } from '../data/mockData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#2C1810] text-[#F5EBE1] pt-16 pb-12 border-t-4 border-[#D97706]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#D97706] to-[#E07A5F] flex items-center justify-center text-white">
                <Utensils className="w-5 h-5" />
              </div>
              <span className="font-rozha text-2xl text-amber-200 tracking-wide">
                Mummy's Tiffin
              </span>
            </div>
            <p className="text-xs text-[#E5C3A6] leading-relaxed">
              Empowering mother chefs in Vadodara to share authentic, warm, homestyle cooking with students and working professionals. Prepared with love, hygiene, and traditional family recipes.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3D2218] border border-amber-800/60 text-xs text-amber-300 font-medium">
                <Award className="w-3.5 h-3.5 text-[#D97706]" /> 100% Certified Home Kitchens
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-rozha text-lg text-amber-100 tracking-wide border-b border-amber-900/60 pb-2">
              Quick Explore
            </h4>
            <ul className="space-y-2 text-xs text-[#E5C3A6]">
              <li>
                <Link to="/" className="hover:text-amber-300 transition-colors">
                  Ghar Ka Khana Home
                </Link>
              </li>
              <li>
                <Link to="/tiffins" className="hover:text-amber-300 transition-colors">
                  Find Mother Chefs in Vadodara
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-amber-300 transition-colors">
                  Order History & Live Tracking
                </Link>
              </li>
              <li>
                <Link to="/chef-dashboard" className="hover:text-amber-300 transition-colors">
                  Mother Chef Portal Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Vadodara Areas Covered */}
          <div className="space-y-3">
            <h4 className="font-rozha text-lg text-amber-100 tracking-wide border-b border-amber-900/60 pb-2">
              Vadodara Coverage
            </h4>
            <p className="text-[11px] text-[#C49A78]">Hot tiffin delivery across major hubs:</p>
            <div className="flex flex-wrap gap-1.5">
              {VADODARA_AREAS.slice(0, 8).map((area) => (
                <span
                  key={area}
                  className="px-2 py-0.5 rounded bg-[#3D2218] text-[11px] text-amber-200/90 border border-amber-900/40"
                >
                  📍 {area}
                </span>
              ))}
            </div>
          </div>

          {/* Women Empowerment & Registration */}
          <div className="space-y-3 bg-[#3D2218]/60 p-4 rounded-2xl border border-amber-800/40">
            <h4 className="font-rozha text-base text-amber-200 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400" /> Become a Mother Chef
            </h4>
            <p className="text-xs text-[#E5C3A6] leading-relaxed">
              Are you a home-maker in Vadodara who loves cooking? Turn your passion into financial independence!
            </p>
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
              className="inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#D97706] to-[#E07A5F] hover:from-[#B45309] hover:to-[#C05621] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <span>Register Kitchen (Google Form)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-amber-900/50 flex flex-col sm:flex-row items-center justify-between text-xs text-[#A88060] gap-4">
          <p>© {new Date().getFullYear()} Mummy's Tiffin Vadodara. Made with ❤️ for Ghar Ka Khana lovers.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-amber-500" /> +91 98250 11223 (Vadodara)
            </span>
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-amber-500" /> help@mummystiffin.in
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
