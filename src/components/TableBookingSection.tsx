import React, { useState } from 'react';
import { useCafe } from '../context/CafeContext';
import { ReservationArea } from '../types/cafe';
import { Calendar, Users, Clock, MapPin, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

export const TableBookingSection: React.FC = () => {
  const { makeReservation } = useCafe();

  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('12:30 PM');
  const [guests, setGuests] = useState(2);
  const [area, setArea] = useState<ReservationArea>('Main Espresso Hall');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');

  const [confirmedBooking, setConfirmedBooking] = useState<{
    code: string;
    name: string;
    date: string;
    time: string;
    guests: number;
    area: string;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const seatingAreas: { id: ReservationArea; name: string; description: string; vibe: string }[] = [
    {
      id: 'Main Espresso Hall',
      name: 'Main Espresso Hall',
      description: 'Lively atmosphere near the roasting counter with warm copper pendant illumination.',
      vibe: 'Bustling & Energetic',
    },
    {
      id: 'Garden Veranda',
      name: 'Garden Veranda',
      description: 'Sunlit outdoor terrace with flowering jasmine, linen umbrellas, and gentle breeze.',
      vibe: 'Serene & Airy',
    },
    {
      id: 'Cozy Hearth Corner',
      name: 'Cozy Hearth Corner',
      description: 'Plush velvet banquette nook by the rustic stone hearth. Perfect for intimate conversations.',
      vibe: 'Warm & Quiet',
    },
    {
      id: 'Barista Counter',
      name: 'Barista Tasting Counter',
      description: 'High-top marble seating with a front-row view of single-origin pour overs and siphon brewing.',
      vibe: 'Interactive & Craft',
    },
  ];

  const timeSlots = [
    '8:30 AM',
    '9:30 AM',
    '10:30 AM',
    '11:45 AM',
    '12:30 PM',
    '1:30 PM',
    '2:30 PM',
    '4:00 PM',
    '5:30 PM',
    '6:30 PM',
    '7:30 PM',
    '8:15 PM',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const res = makeReservation({
        customerName,
        customerPhone,
        customerEmail: customerEmail || 'guest@example.com',
        date,
        timeSlot,
        guests,
        area,
        specialRequest: specialRequest.trim() || undefined,
      });

      setConfirmedBooking({
        code: res.bookingCode,
        name: customerName,
        date,
        time: timeSlot,
        guests,
        area,
      });
      setIsSubmitting(false);
    }, 400);
  };

  const handleResetBooking = () => {
    setConfirmedBooking(null);
    setSpecialRequest('');
  };

  return (
    <section id="reservations" className="py-20 relative z-10 bg-[#120B07] border-t border-[#FAF6F0]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#E2B767] font-semibold mb-2">
            <Calendar className="w-3.5 h-3.5 text-[#E2B767]" />
            <span>Table Reservations</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#FDFBF7] tracking-tight">
            Reserve Your Experience
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#F7F1E7]/75 font-light leading-relaxed">
            Whether a cozy morning espresso pairing, an intimate brunch date, or a celebratory gathering, your table is held with genuine hospitality.
          </p>
        </div>

        {confirmedBooking ? (
          /* Confirmation Glass Card */
          <div className="max-w-xl mx-auto glass-panel p-8 sm:p-10 rounded-2xl border border-[#E2B767]/40 shadow-2xl text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-[#B87B42]/20 border border-[#E2B767] text-[#E2B767] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9 text-[#E2B767]" />
            </div>

            <span className="text-xs uppercase tracking-widest text-[#E2B767] font-bold">
              Reservation Confirmed
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#FDFBF7] mt-1 mb-2">
              We Can't Wait to Host You
            </h3>

            <div className="my-6 p-4 rounded-xl bg-[#1C120C] border border-white/10 text-left space-y-2.5 text-xs">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[#F7F1E7]/60">Booking Code:</span>
                <span className="font-mono font-bold text-sm text-[#E2B767]">
                  {confirmedBooking.code}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#F7F1E7]/60">Guest Name:</span>
                <span className="font-semibold text-[#FDFBF7]">{confirmedBooking.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#F7F1E7]/60">Date & Time:</span>
                <span className="font-semibold text-[#FDFBF7]">
                  {confirmedBooking.date} at {confirmedBooking.time}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#F7F1E7]/60">Party Size:</span>
                <span className="font-semibold text-[#FDFBF7]">
                  {confirmedBooking.guests} {confirmedBooking.guests === 1 ? 'Guest' : 'Guests'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#F7F1E7]/60">Seating Area:</span>
                <span className="font-semibold text-[#E2B767]">{confirmedBooking.area}</span>
              </div>
            </div>

            <p className="text-xs text-[#F7F1E7]/70 font-light mb-6">
              A confirmation text has been transmitted to your phone. Tables are held for 15 minutes past reservation time.
            </p>

            <button
              onClick={handleResetBooking}
              className="px-6 py-2.5 rounded-xl bg-[#B87B42] hover:bg-[#E2B767] text-white hover:text-[#120B07] text-xs font-semibold transition-all cursor-pointer shadow-md"
            >
              Book Another Table
            </button>
          </div>
        ) : (
          /* Split Grid: Left Ambience + Right Reservation Form */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left: Atmosphere showcase card */}
            <div className="lg:col-span-5 glass-panel rounded-2xl overflow-hidden border border-[#E2B767]/20 flex flex-col justify-between">
              <div className="relative h-64 sm:h-72 w-full">
                <img
                  src="/src/assets/images/table_dining_patio_1793294321342.jpg"
                  alt="Sanny's Kitchen table setting with wildflowers and ceramics"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C120C] via-transparent to-black/30" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#E2B767] block">
                    Curated Dining
                  </span>
                  <h3 className="text-lg font-serif font-bold text-[#FDFBF7]">
                    The Sanny's Hospitality Promise
                  </h3>
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-center">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#261811] border border-[#E2B767]/30 flex items-center justify-center shrink-0 text-[#E2B767]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#FDFBF7]">Seamless Arrival</h4>
                    <p className="text-[11px] text-[#F7F1E7]/70 mt-0.5">
                      Your designated table is dressed with fresh wildflowers and menus prior to your arrival.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#261811] border border-[#E2B767]/30 flex items-center justify-center shrink-0 text-[#E2B767]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#FDFBF7]">Special Occasions</h4>
                    <p className="text-[11px] text-[#F7F1E7]/70 mt-0.5">
                      Birthdays, anniversaries, and business mornings enjoy dedicated barista attention.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#261811] border border-[#E2B767]/30 flex items-center justify-center shrink-0 text-[#E2B767]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#FDFBF7]">Instant Host Confirmation</h4>
                    <p className="text-[11px] text-[#F7F1E7]/70 mt-0.5">
                      Directly synced with Sanny's live floor host dashboard with zero reservation fees.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Booking Form */}
            <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-2xl border border-[#E2B767]/25 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Step 1: Area Selection */}
                <div>
                  <label className="block text-xs font-semibold text-[#E2B767] uppercase tracking-wider mb-2">
                    1. Choose Seating Atmosphere
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {seatingAreas.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setArea(item.id)}
                        className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                          area === item.id
                            ? 'bg-[#3B251A] border-[#E2B767] shadow-md ring-1 ring-[#E2B767]/50'
                            : 'bg-[#1C120C]/80 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-[#FDFBF7]">{item.name}</span>
                          <span className="text-[10px] text-[#E2B767] font-medium">{item.vibe}</span>
                        </div>
                        <p className="text-[11px] text-[#F7F1E7]/65 line-clamp-2">
                          {item.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Date, Time & Guests */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Date Picker */}
                  <div>
                    <label className="block text-xs font-semibold text-[#E2B767] uppercase tracking-wider mb-1.5">
                      2. Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  {/* Guests Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-[#E2B767] uppercase tracking-wider mb-1.5">
                      Party Size
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F7F1E7]/50" />
                      <select
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full glass-input pl-9 pr-3 py-2 rounded-xl text-xs cursor-pointer appearance-none bg-[#1C120C]"
                      >
                        <option value={1} className="bg-[#1C120C] text-white">1 Solo Guest</option>
                        <option value={2} className="bg-[#1C120C] text-white">2 Guests</option>
                        <option value={3} className="bg-[#1C120C] text-white">3 Guests</option>
                        <option value={4} className="bg-[#1C120C] text-white">4 Guests</option>
                        <option value={5} className="bg-[#1C120C] text-white">5 Guests</option>
                        <option value={6} className="bg-[#1C120C] text-white">6 Guests</option>
                        <option value={8} className="bg-[#1C120C] text-white">8+ Large Party</option>
                      </select>
                    </div>
                  </div>

                  {/* Preferred Time */}
                  <div>
                    <label className="block text-xs font-semibold text-[#E2B767] uppercase tracking-wider mb-1.5">
                      Preferred Time
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F7F1E7]/50" />
                      <select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        className="w-full glass-input pl-9 pr-3 py-2 rounded-xl text-xs cursor-pointer appearance-none bg-[#1C120C]"
                      >
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot} className="bg-[#1C120C] text-white">
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Step 3: Contact Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#E2B767] uppercase tracking-wider mb-1.5">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Julian Hayes"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="w-full glass-input px-3 py-2 rounded-xl text-xs placeholder:text-[#F7F1E7]/35"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#E2B767] uppercase tracking-wider mb-1.5">
                      Mobile Phone (for SMS updates)
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      className="w-full glass-input px-3 py-2 rounded-xl text-xs placeholder:text-[#F7F1E7]/35"
                    />
                  </div>
                </div>

                {/* Email and Special Requests */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#E2B767] uppercase tracking-wider mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full glass-input px-3 py-2 rounded-xl text-xs placeholder:text-[#F7F1E7]/35"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#E2B767] uppercase tracking-wider mb-1.5">
                      Special Requests / Dietary Notes
                    </label>
                    <input
                      type="text"
                      placeholder="Anniversary, wheelchair access, highchair..."
                      value={specialRequest}
                      onChange={(e) => setSpecialRequest(e.target.value)}
                      className="w-full glass-input px-3 py-2 rounded-xl text-xs placeholder:text-[#F7F1E7]/35"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#B87B42] to-[#9E6431] hover:from-[#E2B767] hover:to-[#B87B42] text-[#FDFBF7] hover:text-[#120B07] font-semibold text-xs sm:text-sm transition-all duration-200 shadow-xl shadow-[#B87B42]/25 border border-[#F1D394]/30 cursor-pointer flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>
                    {isSubmitting ? 'Securing Table...' : `Confirm Table for ${guests} ${guests === 1 ? 'Guest' : 'Guests'} on ${date} at ${timeSlot}`}
                  </span>
                </button>

                <p className="text-[11px] text-center text-[#F7F1E7]/50 font-light">
                  Free cancellation anytime · Zero booking deposit required · Instant confirmation
                </p>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
