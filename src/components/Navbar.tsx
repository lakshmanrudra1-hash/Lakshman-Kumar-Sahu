import React, { useState } from 'react';
import { useCafe } from '../context/CafeContext';
import { ShoppingBag, Calendar, UserCheck, Menu as MenuIcon, X, Coffee, Sparkles, Lock, Mail } from 'lucide-react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const {
    cartCount,
    cartSubtotal,
    setIsCartDrawerOpen,
    setIsOwnerModalOpen,
    setIsReservationModalOpen,
    setIsGmailModalOpen,
    activeTrackedOrder,
    setIsOrderTrackerOpen,
    orders,
    reservations,
  } = useCafe();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Pending counts for owner badge
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const pendingReservationsCount = reservations.filter((r) => r.status === 'pending').length;
  const ownerAlertsTotal = pendingOrdersCount + pendingReservationsCount;

  const scrollTo = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#120B07]/85 border-b border-[#FAF6F0]/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 md:gap-8">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('hero');
              }}
              className="group flex items-center gap-2.5 text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#B87B42] to-[#7E4D20] p-0.5 flex items-center justify-center shadow-lg shadow-[#B87B42]/20 border border-[#E2B767]/30 group-hover:scale-105 transition-transform">
                <Coffee className="w-5 h-5 text-[#FDFBF7]" />
              </div>
              <div>
                <span className="block font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#FDFBF7] group-hover:text-[#E2B767] transition-colors whitespace-nowrap">
                  Sanny's Kitchen
                </span>
                <span className="block text-[10px] uppercase tracking-widest text-[#E2B767] font-medium -mt-1">
                  Artisanal Roastery & Hearth
                </span>
              </div>
            </a>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#F7F1E7]/80">
            <button
              onClick={() => scrollTo('menu')}
              className="hover:text-[#E2B767] transition-colors whitespace-nowrap py-1 cursor-pointer"
            >
              Food & Drinks
            </button>
            <button
              onClick={() => scrollTo('reservations')}
              className="hover:text-[#E2B767] transition-colors whitespace-nowrap py-1 cursor-pointer"
            >
              Book a Table
            </button>
            <button
              onClick={() => scrollTo('story')}
              className="hover:text-[#E2B767] transition-colors whitespace-nowrap py-1 cursor-pointer"
            >
              Our Story & Hearth
            </button>
            <button
              onClick={() => scrollTo('location')}
              className="hover:text-[#E2B767] transition-colors whitespace-nowrap py-1 cursor-pointer"
            >
              Hours & Location
            </button>
          </nav>

          {/* Zone 3: Actions & Owner Space (Right Top) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Active Order Tracker Button (if customer placed an order) */}
            {activeTrackedOrder && (
              <button
                onClick={() => setIsOrderTrackerOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#261811] border border-[#B87B42]/50 text-xs text-[#E2B767] font-medium hover:bg-[#3B251A] transition-all"
                title="View live order progress"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E2B767] animate-spin" style={{ animationDuration: '6s' }} />
                <span>Order {activeTrackedOrder.orderNumber}</span>
              </button>
            )}

            {/* Book Table Button (Desktop) */}
            <button
              onClick={() => setIsReservationModalOpen(true)}
              className="hidden md:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#261811]/90 hover:bg-[#3B251A] text-[#FDFBF7] border border-[#E2B767]/25 hover:border-[#E2B767]/50 transition-all cursor-pointer whitespace-nowrap"
            >
              <Calendar className="w-3.5 h-3.5 text-[#E2B767]" />
              <span>Reserve Table</span>
            </button>

            {/* Gmail Kitchen Communications Hub Button */}
            <button
              onClick={() => setIsGmailModalOpen(true)}
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#261811] hover:bg-[#3B251A] border border-[#E2B767]/25 hover:border-[#EA4335]/60 text-[#FDFBF7] transition-all cursor-pointer shadow-md group"
              title="Open Gmail Communications Hub (Receipts, Confirmations & Restocks)"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <Mail className="w-3.5 h-3.5 text-[#EA4335] group-hover:scale-110 transition-transform" />
              </div>
              <span className="hidden sm:inline text-xs font-semibold text-[#FDFBF7]">
                Gmail
              </span>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#261811] hover:bg-[#3B251A] border border-[#E2B767]/25 hover:border-[#E2B767]/60 text-[#FDFBF7] transition-all cursor-pointer shadow-md"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-4 h-4 text-[#E2B767]" />
              {cartCount > 0 && (
                <span className="flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-[#B87B42] text-[11px] font-bold text-white shadow">
                  {cartCount}
                </span>
              )}
              <span className="hidden sm:inline text-xs font-semibold text-[#FDFBF7] tabular-nums">
                ₹{cartSubtotal.toLocaleString('en-IN')}
              </span>
            </button>

            {/* OWNER SPACE BUTTON (Prominently placed at top-right for user profiles & intuitive dashboard navigation) */}
            <button
              onClick={() => setIsOwnerModalOpen(true)}
              className="group relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-[#B87B42] to-[#9E6431] hover:from-[#E2B767] hover:to-[#B87B42] text-[#FDFBF7] hover:text-[#120B07] font-semibold text-xs transition-all duration-200 shadow-lg shadow-[#B87B42]/25 border border-[#F1D394]/30 cursor-pointer whitespace-nowrap"
              title="Open Owner Space: Manage Live Orders, Menu Pricing, and Inventory"
            >
              <div className="w-5 h-5 rounded-full bg-white/20 group-hover:bg-[#120B07]/20 flex items-center justify-center">
                <Lock className="w-3 h-3 text-white group-hover:text-[#120B07] transition-colors" />
              </div>
              <span className="tracking-wide">Owner Space</span>
              {ownerAlertsTotal > 0 && (
                <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-extrabold flex items-center justify-center shadow">
                  {ownerAlertsTotal}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-[#261811] border border-[#E2B767]/20 text-[#F7F1E7] hover:text-[#E2B767] cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pt-2 pb-6 bg-[#150D09]/95 backdrop-blur-2xl border-b border-[#E2B767]/20 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
            <button
              onClick={() => scrollTo('menu')}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#F7F1E7] hover:bg-[#261811] hover:text-[#E2B767]"
            >
              Food & Drinks Menu
            </button>
            <button
              onClick={() => scrollTo('reservations')}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#F7F1E7] hover:bg-[#261811] hover:text-[#E2B767]"
            >
              Book a Table Online
            </button>
            <button
              onClick={() => scrollTo('story')}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#F7F1E7] hover:bg-[#261811] hover:text-[#E2B767]"
            >
              Our Story & Hearth
            </button>
            <button
              onClick={() => scrollTo('location')}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#F7F1E7] hover:bg-[#261811] hover:text-[#E2B767]"
            >
              Hours, Location & Contact
            </button>

            <div className="pt-2 border-t border-[#E2B767]/15 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsReservationModalOpen(true);
                  }}
                  className="flex-1 py-2 text-center text-xs font-semibold rounded-lg bg-[#261811] border border-[#E2B767]/30 text-[#FDFBF7]"
                >
                  Table Booking
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsOwnerModalOpen(true);
                  }}
                  className="flex-1 py-2 text-center text-xs font-semibold rounded-lg bg-[#B87B42] text-white"
                >
                  Owner Dashboard
                </button>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsGmailModalOpen(true);
                }}
                className="w-full py-2 flex items-center justify-center gap-2 text-xs font-semibold rounded-lg bg-[#261811] border border-[#EA4335]/40 text-[#FDFBF7]"
              >
                <Mail className="w-3.5 h-3.5 text-[#EA4335]" />
                <span>Gmail Communications Hub</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
