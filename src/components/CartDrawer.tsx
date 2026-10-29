import React, { useState } from 'react';
import { useCafe } from '../context/CafeContext';
import { DiningType } from '../types/cafe';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    placeOrder,
    settings,
  } = useCafe();

  const [diningType, setDiningType] = useState<DiningType>('dine-in');
  const [tableOrAddress, setTableOrAddress] = useState('Table #6');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple-pay' | 'cash'>('card');
  const [tipAmount, setTipAmount] = useState<number>(30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isCartDrawerOpen) return null;

  const tax = Number((cartSubtotal * (settings.taxRatePercent / 100)).toFixed(2));
  const finalTotal = Number((cartSubtotal + tax + tipAmount).toFixed(2));

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg('Please enter your name and phone number for order updates.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    setTimeout(() => {
      placeOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        diningType,
        tableOrAddress: tableOrAddress.trim() || (diningType === 'dine-in' ? 'Table Walk-in' : 'Pickup Counter'),
        notes: orderNotes.trim() || undefined,
        paymentMethod,
        tip: tipAmount,
      });
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsCartDrawerOpen(false)} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-panel-warm border-l border-[#E2B767]/25 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-[#E2B767]/20 flex items-center justify-between bg-[#1C120C]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#B87B42]/20 border border-[#E2B767]/30 flex items-center justify-center text-[#E2B767]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#FDFBF7]">Your Order Bag</h3>
                <span className="text-[11px] text-[#E2B767]">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-[11px] text-[#F7F1E7]/50 hover:text-red-400 transition-colors mr-2 cursor-pointer"
                >
                  Clear All
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-[#261811] hover:bg-[#3B251A] text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#F7F1E7]/60 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#261811] border border-white/10 flex items-center justify-center text-[#E2B767]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-lg text-[#FDFBF7]">Your Bag is Empty</h4>
                <p className="text-xs max-w-xs font-light">
                  Browse our artisanal roasts, freshly pulled espresso, and oven-warm sourdough pastries.
                </p>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="mt-2 px-4 py-2 rounded-lg bg-[#B87B42] text-xs font-semibold text-white hover:bg-[#E2B767] hover:text-[#120B07] transition-all cursor-pointer"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-[#1C120C]/90 border border-white/10 flex gap-3 items-center"
                >
                  <img
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    className="w-16 h-16 rounded-lg object-cover bg-[#261811] shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-1">
                      <h4 className="text-xs font-bold text-[#FDFBF7] truncate">
                        {item.menuItem.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#F7F1E7]/40 hover:text-red-400 p-0.5 transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Selected Options */}
                    <div className="text-[10px] text-[#E2B767] mt-0.5 space-y-0.5">
                      {item.options.size && <span>Size: {item.options.size} · </span>}
                      {item.options.temperature && <span>{item.options.temperature} · </span>}
                      {item.options.milk && <span>{item.options.milk} · </span>}
                      {item.options.extras && item.options.extras.length > 0 && (
                        <span>+{item.options.extras.join(', ')} · </span>
                      )}
                      {item.options.specialNotes && (
                        <p className="text-[#F7F1E7]/60 italic truncate">
                          "{item.options.specialNotes}"
                        </p>
                      )}
                    </div>

                    {/* Price & Quantity Stepper */}
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs font-bold text-[#E2B767] tabular-nums">
                        ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                      </span>

                      <div className="flex items-center gap-1.5 bg-[#261811] px-1.5 py-0.5 rounded-lg border border-white/10">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="w-5 h-5 flex items-center justify-center text-white/70 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-[#FDFBF7] w-4 text-center tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="w-5 h-5 flex items-center justify-center text-white/70 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Checkout Form (shown when items exist) */}
            {cart.length > 0 && (
              <form onSubmit={handleCheckout} className="mt-4 pt-4 border-t border-white/10 space-y-4">
                
                {/* Dining Preference Segmented Buttons */}
                <div>
                  <label className="block text-xs font-semibold text-[#E2B767] uppercase tracking-wider mb-2">
                    Dining Type
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#1C120C] rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        setDiningType('dine-in');
                        setTableOrAddress('Table #4');
                      }}
                      className={`py-2 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                        diningType === 'dine-in'
                          ? 'bg-[#B87B42] text-white shadow-sm'
                          : 'text-[#F7F1E7]/60 hover:text-white'
                      }`}
                    >
                      Dine-In
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDiningType('takeaway');
                        setTableOrAddress('Pickup Counter');
                      }}
                      className={`py-2 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                        diningType === 'takeaway'
                          ? 'bg-[#B87B42] text-white shadow-sm'
                          : 'text-[#F7F1E7]/60 hover:text-white'
                      }`}
                    >
                      Takeaway
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDiningType('delivery');
                        setTableOrAddress('');
                      }}
                      className={`py-2 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                        diningType === 'delivery'
                          ? 'bg-[#B87B42] text-white shadow-sm'
                          : 'text-[#F7F1E7]/60 hover:text-white'
                      }`}
                    >
                      Local Courier
                    </button>
                  </div>
                </div>

                {/* Table Number or Delivery Address */}
                <div>
                  <label className="block text-xs font-semibold text-[#E2B767] uppercase tracking-wider mb-1">
                    {diningType === 'dine-in'
                      ? 'Table Number or Seating Note'
                      : diningType === 'takeaway'
                      ? 'Pickup Location'
                      : 'Delivery Street Address'}
                  </label>
                  <input
                    type="text"
                    value={tableOrAddress}
                    onChange={(e) => setTableOrAddress(e.target.value)}
                    placeholder={
                      diningType === 'dine-in'
                        ? 'e.g. Table #8 or Bar Seat 2'
                        : diningType === 'takeaway'
                        ? 'e.g. Main Roastery Pickup Counter'
                        : 'e.g. 142 Pine Street, Apt 3B'
                    }
                    required
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                  />
                </div>

                {/* Direct Order Notice - No Account Needed */}
                <div className="p-2.5 rounded-xl bg-[#261811] border border-[#E2B767]/30 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#E2B767] shrink-0" />
                  <span className="text-[11px] text-[#FDFBF7] font-medium">
                    Direct Guest Ordering · No account or registration needed!
                  </span>
                </div>

                {/* Customer Contact */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-[#F7F1E7]/80 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Lakshman / Guest"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="w-full glass-input px-3 py-1.5 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#F7F1E7]/80 mb-1">
                      Mobile Phone *
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      className="w-full glass-input px-3 py-1.5 rounded-lg text-xs"
                    />
                  </div>
                </div>

                {/* Tip Selector */}
                <div>
                  <label className="block text-[11px] font-medium text-[#F7F1E7]/80 mb-1.5">
                    Barista & Kitchen Tip
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[20, 50, 100, 0].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setTipAmount(amount)}
                        className={`py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          tipAmount === amount
                            ? 'bg-[#B87B42] text-white border-[#E2B767]'
                            : 'bg-[#1C120C] text-[#F7F1E7]/70 border-white/10 hover:border-white/20'
                        }`}
                      >
                        {amount === 0 ? 'No Tip' : `₹${amount}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Selection */}
                <div>
                  <label className="block text-xs font-semibold text-[#E2B767] uppercase tracking-wider mb-1.5">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 text-xs">
                    {[
                      { id: 'card', label: 'UPI / Card' },
                      { id: 'apple-pay', label: 'Apple / GPay' },
                      { id: 'cash', label: 'Pay at Counter' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPaymentMethod(p.id as any)}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border text-center transition-all cursor-pointer ${
                          paymentMethod === p.id
                            ? 'bg-[#3B251A] text-[#FDFBF7] border-[#E2B767]'
                            : 'bg-[#1C120C] text-[#F7F1E7]/60 border-white/10'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-[11px] font-medium text-[#F7F1E7]/80 mb-1">
                    Special Kitchen Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Extra hot, less spicy, serve together"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full glass-input px-3 py-1.5 rounded-lg text-xs"
                  />
                </div>

                {errorMsg && (
                  <p className="text-xs text-red-400 font-medium">{errorMsg}</p>
                )}

                {/* Bill Breakdown */}
                <div className="p-3.5 rounded-xl bg-[#1C120C] border border-white/10 space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#F7F1E7]/70">
                    <span>Items Subtotal</span>
                    <span className="tabular-nums font-semibold text-[#FDFBF7]">
                      ₹{cartSubtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#F7F1E7]/70">
                    <span>GST ({settings.taxRatePercent}%)</span>
                    <span className="tabular-nums font-semibold text-[#FDFBF7]">
                      ₹{tax.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#F7F1E7]/70">
                    <span>Kitchen Gratuity</span>
                    <span className="tabular-nums font-semibold text-[#FDFBF7]">
                      ₹{tipAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-sm text-[#FDFBF7]">
                    <span>Total Amount</span>
                    <span className="text-[#E2B767] tabular-nums font-mono text-base">
                      ₹{finalTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Submit Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#B87B42] to-[#9E6431] hover:from-[#E2B767] hover:to-[#B87B42] text-[#FDFBF7] hover:text-[#120B07] font-bold text-xs sm:text-sm transition-all duration-200 shadow-xl shadow-[#B87B42]/30 border border-[#F1D394]/30 flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {isSubmitting ? 'Transmitting to Kitchen...' : `Place Order · ₹${finalTotal.toLocaleString('en-IN')}`}
                  </span>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
