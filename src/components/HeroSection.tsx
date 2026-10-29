import React from 'react';
import { useCafe } from '../context/CafeContext';
import { Sparkles, Utensils, Calendar, Clock, MapPin, Award, Flame } from 'lucide-react';

interface HeroSectionProps {
  onOrderClick: () => void;
  onReserveClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOrderClick, onReserveClick }) => {
  const { settings } = useCafe();

  return (
    <section id="hero" className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden pt-4 pb-16">
      
      {/* Background with Ambient Espresso Glows & High-Res Photography */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_sannys_cafe_1793294318477.jpg"
          alt="Warm atmospheric interior of Sanny's Kitchen cafe"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.38] contrast-[1.08]"
          referrerPolicy="no-referrer"
        />
        {/* Gradients to blend seamless dark espresso tone */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0704] via-[#120B07]/80 to-[#120B07]/60" />
        <div className="absolute -top-32 right-1/4 w-96 h-96 rounded-full bg-[#B87B42]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-10 w-80 h-80 rounded-full bg-[#E2B767]/10 blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
        
        {/* Dynamic Cafe Announcement Banner */}
        {settings.announcement?.active && (
          <div className="mb-6 inline-flex max-w-full">
            <div className="glass-panel px-4 py-2 rounded-full inline-flex items-center gap-2.5 text-xs text-[#F7F1E7] border border-[#E2B767]/30 shadow-lg">
              <span className="px-2 py-0.5 rounded-full bg-[#B87B42] text-[10px] font-bold text-white tracking-wider uppercase">
                {settings.announcement.tag || 'Special'}
              </span>
              <span className="font-medium text-[#E2B767] hidden sm:inline">
                {settings.announcement.highlightText}
              </span>
              <span className="text-[#F7F1E7]/90 truncate">
                {settings.announcement.message}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-[#E2B767] shrink-0" />
            </div>
          </div>
        )}

        {/* Hero Headline & Value Proposition */}
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#E2B767] font-semibold">
            <Flame className="w-3.5 h-3.5 text-[#E2B767]" />
            <span>Hand-Crafted Roastery · Artisan Hearth · Boutique Dining</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-[#FDFBF7] tracking-tight leading-[1.08] text-balance">
            Where Artisanal Roast Meets <span className="italic font-normal text-[#E2B767]">Slow Hearth.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#F7F1E7]/85 max-w-2xl leading-relaxed font-light">
            Welcome to <strong className="text-[#FDFBF7] font-semibold">Sanny's Kitchen</strong>. Single-origin micro-roasted beans, organic sourdough tartines, flaky pistachio viennoiserie, and savory breakfast bowls crafted with deliberate care.
          </p>

          {/* Quick CTA Actions */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={onOrderClick}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#B87B42] to-[#9E6431] hover:from-[#E2B767] hover:to-[#B87B42] text-[#FDFBF7] hover:text-[#120B07] font-semibold text-sm transition-all duration-200 shadow-xl shadow-[#B87B42]/30 border border-[#F1D394]/30 flex items-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5"
            >
              <Utensils className="w-4 h-4" />
              <span>Explore Menu & Order</span>
            </button>

            <button
              onClick={onReserveClick}
              className="px-6 py-3.5 rounded-xl glass-panel hover:bg-[#261811] text-[#FDFBF7] hover:text-[#E2B767] font-semibold text-sm transition-all duration-200 border border-[#E2B767]/30 flex items-center gap-2.5 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#E2B767]" />
              <span>Book Table Online</span>
            </button>
          </div>

          {/* Live Kitchen Status Indicators */}
          <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#F7F1E7]/80">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${settings.isOpenForOrders ? 'bg-emerald-400' : 'bg-red-400'} ring-4 ring-emerald-400/20`} />
              <span className="font-medium text-[#FDFBF7]">
                {settings.isOpenForOrders ? 'Kitchen Open for Orders' : 'Kitchen Closed'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#E2B767]" />
              <span>Est. Prep: ~{settings.estimatedWaitMinutes} mins</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#E2B767]" />
              <span className="truncate max-w-xs">{settings.address}</span>
            </div>
          </div>
        </div>

        {/* Glassmorphic 4-Column Feature Strip */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="glass-panel p-4 rounded-xl border border-[#E2B767]/15 hover:border-[#E2B767]/40 transition-all">
            <span className="text-xl sm:text-2xl font-serif font-bold text-[#E2B767]">100%</span>
            <p className="text-xs font-semibold text-[#FDFBF7] mt-1">Single-Origin Roast</p>
            <p className="text-[11px] text-[#F7F1E7]/65 mt-0.5">Ethically direct-traded Ethiopian & Colombian lots.</p>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-[#E2B767]/15 hover:border-[#E2B767]/40 transition-all">
            <span className="text-xl sm:text-2xl font-serif font-bold text-[#E2B767]">36h</span>
            <p className="text-xs font-semibold text-[#FDFBF7] mt-1">Wild Sourdough Ferment</p>
            <p className="text-[11px] text-[#F7F1E7]/65 mt-0.5">Laminated butter croissants & rustic woodfired batards.</p>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-[#E2B767]/15 hover:border-[#E2B767]/40 transition-all">
            <span className="text-xl sm:text-2xl font-serif font-bold text-[#E2B767]">Live</span>
            <p className="text-xs font-semibold text-[#FDFBF7] mt-1">Real-Time Kitchen Sync</p>
            <p className="text-[11px] text-[#F7F1E7]/65 mt-0.5">Direct acceptance & instant kitchen status progression.</p>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-[#E2B767]/15 hover:border-[#E2B767]/40 transition-all">
            <div className="flex items-center gap-1 text-[#E2B767]">
              <span className="text-xl sm:text-2xl font-serif font-bold">4.9</span>
              <Award className="w-4 h-4 fill-[#E2B767]" />
            </div>
            <p className="text-xs font-semibold text-[#FDFBF7] mt-1">Neighborhood Favorite</p>
            <p className="text-[11px] text-[#F7F1E7]/65 mt-0.5">Over 1,200 verified table reviews & guest smiles.</p>
          </div>
        </div>

      </div>
    </section>
  );
};
