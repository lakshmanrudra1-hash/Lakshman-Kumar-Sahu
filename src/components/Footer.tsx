import React from 'react';
import { useCafe } from '../context/CafeContext';
import { Coffee, MapPin, Phone, Wifi, Instagram, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, setIsOwnerModalOpen, setIsReservationModalOpen } = useCafe();

  return (
    <footer id="location" className="bg-[#0B0604] border-t border-[#FAF6F0]/10 pt-16 pb-12 relative z-10 text-[#F7F1E7]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          
          {/* Brand & Vision */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#B87B42] to-[#7E4D20] flex items-center justify-center text-white shadow-md">
                <Coffee className="w-4 h-4 text-white" />
              </div>
              <span className="font-serif text-xl font-bold text-[#FDFBF7]">
                Sanny's Kitchen
              </span>
            </div>

            <p className="text-xs text-[#F7F1E7]/70 leading-relaxed font-light">
              An artisanal espresso bar, slow-fermentation bakery, and neighborhood kitchen dedicated to thoughtful gastronomy. Direct customer ordering with zero registration or account required.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-[#E2B767]">
              <Wifi className="w-3.5 h-3.5" />
              <span>Complimentary High-Speed Guest Wi-Fi</span>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#E2B767] uppercase tracking-wider">
              Operating Hours
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-[#F7F1E7]/70">Monday – Friday:</span>
                <span className="text-[#FDFBF7] font-medium">{settings.hoursWeekday}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-[#F7F1E7]/70">Saturday – Sunday:</span>
                <span className="text-[#FDFBF7] font-medium">{settings.hoursWeekend}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#F7F1E7]/70">Kitchen Last Call:</span>
                <span className="text-[#E2B767] font-medium">45 mins before close</span>
              </div>
            </div>
          </div>

          {/* Location & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#E2B767] uppercase tracking-wider">
              Find Our Hearth
            </h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-start gap-2 text-[#F7F1E7]/80">
                <MapPin className="w-4 h-4 text-[#E2B767] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </p>
              <p className="flex items-center gap-2 text-[#F7F1E7]/80">
                <Phone className="w-4 h-4 text-[#E2B767] shrink-0" />
                <span>{settings.phone}</span>
              </p>
              
              {/* Clickable Instagram link */}
              <a
                href="https://www.instagram.com/xrn_rudra"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#E2B767] hover:text-[#F1D394] transition-colors group cursor-pointer"
                title="Open Instagram @xrn_rudra"
              >
                <Instagram className="w-4 h-4 text-[#E2B767] group-hover:scale-110 transition-transform" />
                <span className="hover:underline">xrn rudra</span>
              </a>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#E2B767] uppercase tracking-wider">
              Quick Portals
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => setIsReservationModalOpen(true)}
                className="w-full py-2 px-3 rounded-lg glass-panel hover:bg-[#261811] text-xs font-semibold text-[#FDFBF7] hover:text-[#E2B767] transition-all text-left flex items-center justify-between cursor-pointer"
              >
                <span>Reserve a Dining Table</span>
                <span className="text-[#E2B767]">→</span>
              </button>

              <button
                onClick={() => setIsOwnerModalOpen(true)}
                className="w-full py-2 px-3 rounded-lg bg-[#261811] hover:bg-[#3B251A] text-xs font-semibold text-[#E2B767] transition-all text-left flex items-center justify-between border border-[#E2B767]/30 cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#E2B767]" />
                  <span>Owner Space & Kitchen KDS</span>
                </div>
                <span>→</span>
              </button>
            </div>
          </div>

        </div>

        {/* Creator Attribution Section (Made by Rudra & xrn rudra Instagram) */}
        <div className="py-5 px-6 my-8 rounded-2xl glass-panel-warm border border-[#E2B767]/35 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#B87B42]/20 border border-[#E2B767]/40 flex items-center justify-center text-[#E2B767]">
              <Heart className="w-4 h-4 fill-[#E2B767] text-[#E2B767]" />
            </div>
            <div>
              <p className="text-sm font-serif font-bold text-[#FDFBF7] tracking-wide">
                Made by <span className="text-[#E2B767]">Rudra</span>
              </p>
              <p className="text-[11px] text-[#F7F1E7]/65">
                Designed & Built with modern glassmorphism aesthetic for Sanny's Kitchen
              </p>
            </div>
          </div>

          <a
            href="https://www.instagram.com/xrn_rudra"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#B87B42] to-[#9E6431] hover:from-[#E2B767] hover:to-[#B87B42] text-[#FDFBF7] hover:text-[#120B07] text-xs font-bold transition-all shadow-lg shadow-[#B87B42]/25 border border-[#F1D394]/30 cursor-pointer transform hover:-translate-y-0.5 group"
            title="Click to visit Rudra's Instagram: xrn rudra"
          >
            <Instagram className="w-4 h-4 text-[#FDFBF7] group-hover:text-[#120B07] transition-colors" />
            <span>Connect on Instagram: xrn rudra</span>
          </a>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F7F1E7]/50">
          <p>© {new Date().getFullYear()} Sanny's Kitchen Roastery & Cafe · Made by Rudra.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Direct Guest Ordering</span>
            <span>·</span>
            <span>No Account Required</span>
            <span>·</span>
            <span>Curated Roastery & Kitchen</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
