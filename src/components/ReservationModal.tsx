import React, { useState } from 'react';
import { useCafe } from '../context/CafeContext';
import { ReservationArea, Reservation } from '../types/cafe';
import { X, Calendar, Clock, Users, CheckCircle2, Mail } from 'lucide-react';

export const ReservationModal: React.FC = () => {
  const { isReservationModalOpen, setIsReservationModalOpen, makeReservation, openGmailWithReservation } = useCafe();

  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('1:00 PM');
  const [guests, setGuests] = useState(2);
  const [area, setArea] = useState<ReservationArea>('Main Espresso Hall');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<{
    code: string;
    name: string;
    reservation: Reservation;
  } | null>(null);

  if (!isReservationModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

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
      reservation: res,
    });
  };

  const handleClose = () => {
    setIsReservationModalOpen(false);
    setConfirmedBooking(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg glass-panel-warm rounded-2xl border border-[#E2B767]/35 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E2B767]/20 flex items-center justify-between bg-[#1C120C]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#B87B42]/20 border border-[#E2B767]/40 flex items-center justify-center text-[#E2B767]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#FDFBF7]">Book a Table</h3>
              <p className="text-[11px] text-[#E2B767]">Sanny's Kitchen · Instant Confirmation</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-[#261811] hover:bg-[#3B251A] text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {confirmedBooking ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-900/40 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h4 className="text-xl font-serif font-bold text-[#FDFBF7]">
                Table Reserved!
              </h4>

              <div className="p-4 rounded-xl bg-[#1C120C] border border-white/10 text-xs space-y-1.5 text-left">
                <div className="flex justify-between">
                  <span className="text-[#F7F1E7]/60">Booking Code:</span>
                  <span className="font-mono font-bold text-[#E2B767]">{confirmedBooking.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#F7F1E7]/60">Guest Name:</span>
                  <span className="font-semibold text-[#FDFBF7]">{confirmedBooking.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#F7F1E7]/60">Details:</span>
                  <span>{guests} Guests · {date} at {timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#F7F1E7]/60">Seating:</span>
                  <span className="text-[#E2B767]">{area}</span>
                </div>
              </div>

              <p className="text-xs text-[#F7F1E7]/70">
                We've alerted our host. See you soon!
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (confirmedBooking?.reservation) {
                      const resToEmail = confirmedBooking.reservation;
                      handleClose();
                      openGmailWithReservation(resToEmail);
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#261811] hover:bg-[#3B251A] text-[#E2B767] hover:text-white border border-[#E2B767]/30 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Mail className="w-3.5 h-3.5 text-[#EA4335]" />
                  <span>Email Confirmation via Gmail</span>
                </button>

                <button
                  onClick={handleClose}
                  className="w-full py-2.5 rounded-xl bg-[#B87B42] hover:bg-[#E2B767] text-white hover:text-[#120B07] text-xs font-semibold transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Seating Area */}
              <div>
                <label className="block text-[11px] font-semibold text-[#E2B767] uppercase tracking-wider mb-1.5">
                  Select Seating Area
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Main Espresso Hall',
                    'Garden Veranda',
                    'Cozy Hearth Corner',
                    'Barista Counter',
                  ].map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setArea(a as ReservationArea)}
                      className={`p-2 rounded-lg text-left border transition-all cursor-pointer ${
                        area === a
                          ? 'bg-[#B87B42] text-white border-[#E2B767]'
                          : 'bg-[#1C120C] text-[#F7F1E7]/70 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <span className="font-medium block text-xs">{a}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date, Time & Guests */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-[#F7F1E7]/80 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full glass-input px-2 py-1.5 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#F7F1E7]/80 mb-1">
                    Time
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full glass-input px-2 py-1.5 rounded-lg text-xs bg-[#1C120C]"
                  >
                    {[
                      '9:00 AM',
                      '10:30 AM',
                      '12:00 PM',
                      '1:00 PM',
                      '2:30 PM',
                      '4:00 PM',
                      '6:00 PM',
                      '7:30 PM',
                    ].map((slot) => (
                      <option key={slot} value={slot} className="bg-[#1C120C]">
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#F7F1E7]/80 mb-1">
                    Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full glass-input px-2 py-1.5 rounded-lg text-xs bg-[#1C120C]"
                  >
                    {[1, 2, 3, 4, 5, 6, 8].map((g) => (
                      <option key={g} value={g} className="bg-[#1C120C]">
                        {g} {g === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-[#F7F1E7]/80 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full glass-input px-2.5 py-1.5 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#F7F1E7]/80 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full glass-input px-2.5 py-1.5 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#F7F1E7]/80 mb-1">
                  Special Notes / Occasion (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Birthday, quiet booth requested"
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  className="w-full glass-input px-2.5 py-1.5 rounded-lg text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-[#B87B42] to-[#9E6431] hover:from-[#E2B767] hover:to-[#B87B42] text-white hover:text-[#120B07] font-semibold text-xs transition-all shadow-md cursor-pointer"
              >
                Confirm Table Reservation
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
