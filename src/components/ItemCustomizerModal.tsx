import React, { useState } from 'react';
import { MenuItem, CartItemOption } from '../types/cafe';
import { useCafe } from '../context/CafeContext';
import { X, Plus, Minus, Check, Flame, Clock } from 'lucide-react';

interface ItemCustomizerModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export const ItemCustomizerModal: React.FC<ItemCustomizerModalProps> = ({ item, onClose }) => {
  const { addToCart } = useCafe();

  const [quantity, setQuantity] = useState(1);
  const [temperature, setTemperature] = useState<'Hot' | 'Iced' | undefined>(
    item?.options?.temperature ? item.options.temperature[0] : undefined
  );
  const [selectedMilk, setSelectedMilk] = useState<string | undefined>(
    item?.options?.milk ? item.options.milk[0] : undefined
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    item?.options?.size ? item.options.size[0].name : undefined
  );
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [specialNotes, setSpecialNotes] = useState('');

  if (!item) return null;

  const toggleExtra = (extraName: string) => {
    setSelectedExtras((prev) =>
      prev.includes(extraName) ? prev.filter((e) => e !== extraName) : [...prev, extraName]
    );
  };

  // Calculate current unit price
  let currentUnitPrice = item.price;
  if (selectedSize && item.options?.size) {
    const sizeObj = item.options.size.find((s) => s.name === selectedSize);
    if (sizeObj) currentUnitPrice += sizeObj.extraPrice;
  }
  selectedExtras.forEach((extraName) => {
    const extraObj = item.options?.extras?.find((e) => e.name === extraName);
    if (extraObj) currentUnitPrice += extraObj.price;
  });

  const totalPrice = currentUnitPrice * quantity;

  const handleConfirm = () => {
    const options: CartItemOption = {
      temperature,
      milk: selectedMilk,
      size: selectedSize,
      extras: selectedExtras,
      specialNotes: specialNotes.trim() || undefined,
    };
    addToCart(item, options, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg glass-panel-warm rounded-2xl border border-[#E2B767]/30 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image */}
        <div className="relative h-48 w-full bg-[#1C120C] shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover filter brightness-90"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#261811] via-transparent to-black/40" />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex items-center gap-2 text-[11px] text-[#E2B767] font-semibold uppercase tracking-wider mb-1">
              <span>{item.category}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {item.preparationMinutes}m prep
              </span>
              {item.calories && (
                <>
                  <span>·</span>
                  <span>{item.calories} kcal</span>
                </>
              )}
            </div>
            <h3 className="text-xl font-serif font-bold text-[#FDFBF7] leading-tight">
              {item.name}
            </h3>
          </div>
        </div>

        {/* Scrollable options content */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          <p className="text-xs text-[#F7F1E7]/80 leading-relaxed font-light">
            {item.description}
          </p>

          {/* Temperature Choice (Hot / Iced) */}
          {item.options?.temperature && (
            <div>
              <label className="block text-xs font-semibold text-[#E2B767] uppercase tracking-wider mb-2">
                Serving Temperature
              </label>
              <div className="grid grid-cols-2 gap-2">
                {item.options.temperature.map((temp) => (
                  <button
                    key={temp}
                    type="button"
                    onClick={() => setTemperature(temp)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      temperature === temp
                        ? 'bg-[#B87B42] text-white border-[#E2B767]'
                        : 'bg-[#1C120C] text-[#F7F1E7]/70 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {temp === 'Hot' ? <Flame className="w-3.5 h-3.5 text-amber-300" /> : '❄️'}
                    <span>{temp}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Choice */}
          {item.options?.size && (
            <div>
              <label className="block text-xs font-semibold text-[#E2B767] uppercase tracking-wider mb-2">
                Select Size
              </label>
              <div className="grid grid-cols-2 gap-2">
                {item.options.size.map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => setSelectedSize(s.name)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border flex items-center justify-between transition-all cursor-pointer ${
                      selectedSize === s.name
                        ? 'bg-[#B87B42] text-white border-[#E2B767]'
                        : 'bg-[#1C120C] text-[#F7F1E7]/70 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <span>{s.name}</span>
                    <span className="text-[11px] opacity-80">
                      {s.extraPrice > 0 ? `+₹${s.extraPrice}` : 'Included'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Milk Choice */}
          {item.options?.milk && (
            <div>
              <label className="block text-xs font-semibold text-[#E2B767] uppercase tracking-wider mb-2">
                Choice of Dairy or Plant Milk
              </label>
              <div className="grid grid-cols-2 gap-2">
                {item.options.milk.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelectedMilk(m)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border text-left flex items-center justify-between transition-all cursor-pointer ${
                      selectedMilk === m
                        ? 'bg-[#B87B42] text-white border-[#E2B767]'
                        : 'bg-[#1C120C] text-[#F7F1E7]/70 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <span>{m}</span>
                    {selectedMilk === m && <Check className="w-3 h-3 text-white" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add-ons and Extras */}
          {item.options?.extras && item.options.extras.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-[#E2B767] uppercase tracking-wider mb-2">
                Artisanal Enhancements & Extras
              </label>
              <div className="space-y-1.5">
                {item.options.extras.map((extra) => {
                  const isChecked = selectedExtras.includes(extra.name);
                  return (
                    <button
                      key={extra.name}
                      type="button"
                      onClick={() => toggleExtra(extra.name)}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-medium border flex items-center justify-between transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#3B251A] text-[#FDFBF7] border-[#E2B767]'
                          : 'bg-[#1C120C] text-[#F7F1E7]/70 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border ${
                            isChecked
                              ? 'bg-[#B87B42] border-[#E2B767] text-white'
                              : 'border-white/30 bg-transparent'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span>{extra.name}</span>
                      </div>
                      <span className="text-xs text-[#E2B767] tabular-nums">
                        {extra.price > 0 ? `+₹${extra.price}` : 'Free'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions Note */}
          <div>
            <label className="block text-xs font-semibold text-[#E2B767] uppercase tracking-wider mb-1.5">
              Kitchen Instructions / Allergies (Optional)
            </label>
            <textarea
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="e.g. Extra hot, milk on the side, oat milk only, gluten sensitive..."
              rows={2}
              className="w-full glass-input px-3 py-2 rounded-lg text-xs placeholder:text-[#F7F1E7]/35 resize-none"
            />
          </div>
        </div>

        {/* Footer with quantity and Add to Bag button */}
        <div className="p-4 bg-[#1C120C] border-t border-[#E2B767]/20 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2 bg-[#261811] p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-lg bg-[#1C120C] hover:bg-[#3B251A] text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center text-xs font-bold text-[#FDFBF7] tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-lg bg-[#1C120C] hover:bg-[#3B251A] text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#B87B42] to-[#9E6431] hover:from-[#E2B767] hover:to-[#B87B42] text-[#FDFBF7] hover:text-[#120B07] font-semibold text-xs transition-all duration-200 shadow-lg shadow-[#B87B42]/30 border border-[#F1D394]/30 flex items-center justify-between cursor-pointer"
          >
            <span>Add to Order</span>
            <span className="tabular-nums font-bold text-sm">
              ₹{totalPrice.toLocaleString('en-IN')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
