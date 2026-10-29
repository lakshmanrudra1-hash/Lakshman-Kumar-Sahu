import React, { useEffect } from 'react';
import { CafeProvider, useCafe } from './context/CafeContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MenuSection } from './components/MenuSection';
import { TableBookingSection } from './components/TableBookingSection';
import { CafeStorySection } from './components/CafeStorySection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { ReservationModal } from './components/ReservationModal';
import { OwnerDashboardModal } from './components/OwnerDashboardModal';
import { GmailHubModal } from './components/GmailHubModal';
import { Bell, X, ChefHat, Sparkles } from 'lucide-react';

const CafeAppContent: React.FC = () => {
  const {
    setIsCartDrawerOpen,
    setIsReservationModalOpen,
    setIsOwnerModalOpen,
    isGmailModalOpen,
    setIsGmailModalOpen,
    gmailModalConfig,
    newOrderNotification,
    clearNotification,
  } = useCafe();

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Auto-dismiss notification toast
  useEffect(() => {
    if (newOrderNotification) {
      const timer = setTimeout(() => {
        clearNotification();
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [newOrderNotification, clearNotification]);

  return (
    <div className="min-h-screen bg-[#0D0704] text-[#FAF6F0] flex flex-col selection:bg-[#B87B42] selection:text-white">
      
      {/* Real-time Order & Reservation Toast Notification */}
      {newOrderNotification && (
        <div className="fixed top-24 right-4 z-50 max-w-sm glass-panel-warm p-4 rounded-xl border border-[#E2B767] shadow-2xl flex items-start gap-3 animate-in slide-in-from-right duration-300">
          <div className="w-8 h-8 rounded-lg bg-[#B87B42] text-white flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4 animate-bounce" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#E2B767] block">
              Kitchen Event
            </span>
            <p className="text-xs font-semibold text-[#FDFBF7] truncate">
              {newOrderNotification}
            </p>
            <button
              onClick={() => {
                clearNotification();
                setIsOwnerModalOpen(true);
              }}
              className="mt-1 text-[11px] font-bold text-[#E2B767] hover:underline"
            >
              Open Owner Dashboard →
            </button>
          </div>
          <button
            onClick={clearNotification}
            className="text-white/40 hover:text-white p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Navbar Contract */}
      <Navbar onNavigate={handleNavigate} />

      {/* Main Page Flow */}
      <main className="flex-1">
        <HeroSection
          onOrderClick={() => handleNavigate('menu')}
          onReserveClick={() => handleNavigate('reservations')}
        />

        <MenuSection />

        <CafeStorySection />

        <TableBookingSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Slide-out Drawers */}
      <CartDrawer />
      <OrderTrackerModal />
      <ReservationModal />
      <OwnerDashboardModal />
      <GmailHubModal
        isOpen={isGmailModalOpen}
        onClose={() => setIsGmailModalOpen(false)}
        defaultComposeTab={gmailModalConfig.defaultCompose}
        initialOrderForReceipt={gmailModalConfig.initialOrder}
        initialReservationForConfirm={gmailModalConfig.initialReservation}
      />
    </div>
  );
};

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App runtime error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0D0704] text-[#FAF6F0] flex items-center justify-center p-6 text-center">
          <div className="glass-panel p-8 rounded-2xl border border-[#E2B767]/30 max-w-md w-full space-y-4 shadow-2xl">
            <h2 className="text-xl font-serif font-bold text-[#E2B767]">
              Sanny's Kitchen
            </h2>
            <p className="text-xs text-[#F7F1E7]/70">
              A temporary interface issue occurred. Click below to refresh your dining session.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-5 py-2.5 rounded-xl bg-[#B87B42] hover:bg-[#E2B767] text-white hover:text-[#120B07] text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              Reload Sanny's Kitchen
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <CafeProvider>
        <CafeAppContent />
      </CafeProvider>
    </ErrorBoundary>
  );
}
