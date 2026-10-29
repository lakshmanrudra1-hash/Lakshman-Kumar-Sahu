import React from 'react';
import { useCafe } from '../context/CafeContext';
import { X, CheckCircle2, Clock, ChefHat, Sparkles, MapPin, Phone, Coffee, Mail } from 'lucide-react';

export const OrderTrackerModal: React.FC = () => {
  const {
    isOrderTrackerOpen,
    setIsOrderTrackerOpen,
    activeTrackedOrder,
    settings,
    openGmailWithOrder,
  } = useCafe();

  if (!isOrderTrackerOpen || !activeTrackedOrder) return null;

  const steps = [
    { key: 'pending', label: 'Order Received', desc: 'Awaiting Kitchen confirmation' },
    { key: 'preparing', label: 'Crafting & Brewing', desc: 'Barista & Chef preparing with care' },
    { key: 'ready', label: 'Ready for You', desc: 'Placed at counter / heading to table' },
    { key: 'completed', label: 'Delivered', desc: 'Completed & Savored' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'preparing':
        return 1;
      case 'ready':
        return 2;
      case 'completed':
        return 3;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(activeTrackedOrder.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg glass-panel-warm rounded-2xl border border-[#E2B767]/35 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E2B767]/20 flex items-center justify-between bg-[#1C120C]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#B87B42]/20 border border-[#E2B767]/40 flex items-center justify-center text-[#E2B767]">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-[#FDFBF7]">
                  Order {activeTrackedOrder.orderNumber}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#B87B42]/30 border border-[#E2B767]/40 text-[10px] font-bold text-[#E2B767] uppercase">
                  {activeTrackedOrder.diningType}
                </span>
              </div>
              <p className="text-[11px] text-[#F7F1E7]/60">
                For {activeTrackedOrder.customerName} · {activeTrackedOrder.tableOrAddress}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOrderTrackerOpen(false)}
            className="w-8 h-8 rounded-full bg-[#261811] hover:bg-[#3B251A] text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Estimated time banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#261811] to-[#3B251A] border border-[#E2B767]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#B87B42] text-white flex items-center justify-center animate-pulse">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#E2B767] font-semibold block">
                  Estimated Ready Time
                </span>
                <span className="text-lg font-bold text-[#FDFBF7]">
                  {activeTrackedOrder.status === 'ready'
                    ? 'Ready for You Now!'
                    : activeTrackedOrder.status === 'completed'
                    ? 'Delivered & Completed'
                    : `~${activeTrackedOrder.estimatedMinutes} Minutes`}
                </span>
              </div>
            </div>

            <span className="text-xs text-[#E2B767] font-medium hidden sm:inline">
              Live Kitchen Sync
            </span>
          </div>

          {/* Stepper progress */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-[#E2B767] uppercase tracking-wider">
              Preparation Progress
            </h4>
            <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
              {steps.map((st, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div key={st.key} className="relative flex items-start gap-3">
                    <div
                      className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                        isCurrent
                          ? 'bg-[#E2B767] text-[#120B07] ring-4 ring-[#E2B767]/25 shadow'
                          : isPassed
                          ? 'bg-[#B87B42] text-white'
                          : 'bg-[#1C120C] text-white/40 border border-white/20'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold ${
                            isCurrent
                              ? 'text-[#E2B767]'
                              : isPassed
                              ? 'text-[#FDFBF7]'
                              : 'text-[#F7F1E7]/40'
                          }`}
                        >
                          {st.label}
                        </span>
                        {isCurrent && (
                          <span className="w-2 h-2 rounded-full bg-[#E2B767] animate-ping" />
                        )}
                      </div>
                      <p className="text-[11px] text-[#F7F1E7]/60">{st.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Itemized summary */}
          <div className="p-4 rounded-xl bg-[#1C120C] border border-white/10 space-y-3">
            <div className="flex justify-between items-center border-b border-white/5 pb-2 text-xs font-semibold text-[#FDFBF7]">
              <span>Ordered Items ({activeTrackedOrder.items.length})</span>
              <span className="text-[#E2B767] font-mono">₹{activeTrackedOrder.total.toLocaleString('en-IN')}</span>
            </div>

            <div className="space-y-2 text-xs">
              {activeTrackedOrder.items.map((it) => (
                <div key={it.id} className="flex justify-between items-center text-[#F7F1E7]/80">
                  <div className="truncate mr-2">
                    <span className="font-bold text-[#E2B767] mr-1.5">{it.quantity}x</span>
                    <span>{it.menuItem.name}</span>
                    {it.options.milk && (
                      <span className="text-[10px] text-[#F7F1E7]/50 block">
                        ({it.options.milk} · {it.options.temperature || 'Hot'})
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-xs tabular-nums text-[#FDFBF7] shrink-0">
                    ₹{(it.unitPrice * it.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {activeTrackedOrder.notes && (
              <div className="pt-2 border-t border-white/5 text-[11px] text-[#F7F1E7]/60 italic">
                Note: "{activeTrackedOrder.notes}"
              </div>
            )}
          </div>

          {/* Kitchen Help, Email Receipt & Contact */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#F7F1E7]/70 pt-2 border-t border-white/5">
            <button
              onClick={() => {
                setIsOrderTrackerOpen(false);
                openGmailWithOrder(activeTrackedOrder);
              }}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-[#261811] hover:bg-[#3B251A] text-[#E2B767] hover:text-white border border-[#E2B767]/30 transition-all font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Mail className="w-3.5 h-3.5 text-[#EA4335]" />
              <span>Email Receipt via Gmail</span>
            </button>

            <button
              onClick={() => setIsOrderTrackerOpen(false)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#B87B42] hover:bg-[#E2B767] text-white hover:text-[#120B07] font-semibold text-xs transition-colors cursor-pointer"
            >
              Close Tracker
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
