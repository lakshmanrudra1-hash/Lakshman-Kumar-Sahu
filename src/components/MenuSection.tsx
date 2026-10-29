import React, { useState } from 'react';
import { useCafe } from '../context/CafeContext';
import { MenuItem, FoodCategory } from '../types/cafe';
import { Search, Plus, Sparkles, Clock, Check } from 'lucide-react';
import { ItemCustomizerModal } from './ItemCustomizerModal';

export const MenuSection: React.FC = () => {
  const { menuItems, addToCart } = useCafe();
  const [activeCategory, setActiveCategory] = useState<FoodCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);

  const categories: { id: FoodCategory; label: string }[] = [
    { id: 'all', label: 'Full Menu' },
    { id: 'coffee', label: 'Espresso & Brews' },
    { id: 'brunch', label: 'Artisanal Brunch' },
    { id: 'bakery', label: 'Bakery & Pastries' },
    { id: 'mains', label: 'Gourmet Mains' },
    { id: 'refreshers', label: 'Cold Tonics' },
  ];

  // Filtering
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !filterTag || item.tags.includes(filterTag);
    return matchesCategory && matchesSearch && matchesTag;
  });

  const handleQuickAdd = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.inStock) return;
    if (item.options?.temperature || item.options?.milk || item.options?.size) {
      setSelectedItemForModal(item);
    } else {
      addToCart(item);
      setQuickAddedId(item.id);
      setTimeout(() => setQuickAddedId(null), 1200);
    }
  };

  return (
    <section id="menu" className="py-20 relative z-10 bg-[#0D0704]/90 border-t border-[#FAF6F0]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#E2B767] font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#E2B767]" />
            <span>Seasonal Harvest & Craft Roasts</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#FDFBF7] tracking-tight">
            The Kitchen Menu
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#F7F1E7]/75 font-light leading-relaxed">
            Every dish and beverage is prepared fresh to order. Customize your beverage roast, dairy choice, or savor our slow-fermented bakery offerings.
          </p>
        </div>

        {/* Category Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 bg-[#1C120C] rounded-xl border border-white/10 overflow-x-auto max-w-full no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-[#B87B42] text-white shadow-md'
                    : 'text-[#F7F1E7]/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F7F1E7]/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, pastries, roasts..."
              className="w-full glass-input pl-9 pr-3 py-2 rounded-xl text-xs placeholder:text-[#F7F1E7]/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#F7F1E7]/50 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Dietary Quick Filter */}
        <div className="flex items-center gap-3 text-xs text-[#F7F1E7]/60 mb-8 overflow-x-auto pb-1">
          <span className="font-medium text-[#E2B767] uppercase tracking-wider text-[11px] whitespace-nowrap">Filter:</span>
          <button
            onClick={() => setFilterTag(null)}
            className={`cursor-pointer whitespace-nowrap hover:text-white ${!filterTag ? 'text-[#E2B767] font-semibold underline underline-offset-4' : ''}`}
          >
            All Items
          </button>
          <span>·</span>
          <button
            onClick={() => setFilterTag('Vegetarian')}
            className={`cursor-pointer whitespace-nowrap hover:text-white ${filterTag === 'Vegetarian' ? 'text-[#E2B767] font-semibold underline underline-offset-4' : ''}`}
          >
            Vegetarian
          </button>
          <span>·</span>
          <button
            onClick={() => setFilterTag('Signature')}
            className={`cursor-pointer whitespace-nowrap hover:text-white ${filterTag === 'Signature' ? 'text-[#E2B767] font-semibold underline underline-offset-4' : ''}`}
          >
            Signature Specials
          </button>
          <span>·</span>
          <button
            onClick={() => setFilterTag('Fresh Daily')}
            className={`cursor-pointer whitespace-nowrap hover:text-white ${filterTag === 'Fresh Daily' ? 'text-[#E2B767] font-semibold underline underline-offset-4' : ''}`}
          >
            Fresh Daily Bakery
          </button>
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl max-w-md mx-auto my-8">
            <p className="text-sm text-[#F7F1E7]/80">No menu items matched your search or filter.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
                setFilterTag(null);
              }}
              className="mt-3 text-xs font-semibold text-[#E2B767] hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItemForModal(item)}
                className={`glass-card rounded-2xl overflow-hidden flex flex-col group cursor-pointer border ${
                  !item.inStock ? 'opacity-65 grayscale-[30%]' : ''
                }`}
              >
                {/* Product Image */}
                <div className="relative h-52 w-full overflow-hidden bg-[#1A100A]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C120C] via-transparent to-transparent opacity-80" />

                  {/* Stock or Special Status */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    {item.isChefSpecial && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#B87B42] text-[10px] font-bold text-white shadow uppercase tracking-wider">
                        Chef's Selection
                      </span>
                    )}
                    {!item.inStock && (
                      <span className="px-2.5 py-0.5 rounded-full bg-red-900/90 text-[10px] font-bold text-red-100 shadow uppercase tracking-wider">
                        Sold Out Today
                      </span>
                    )}
                  </div>

                  {/* Prep time badge */}
                  <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-[#120B07]/80 backdrop-blur-md border border-white/10 text-[11px] text-[#F7F1E7] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#E2B767]" />
                    <span>{item.preparationMinutes}m</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Metadata: unboxed clean text as required by anti-slop guidelines */}
                    <div className="flex items-center gap-2 text-xs text-[#E2B767] font-medium mb-1.5">
                      <span className="capitalize">{item.category}</span>
                      {item.tags.length > 0 && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#F7F1E7]/60 truncate">{item.tags.join(' · ')}</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base sm:text-lg font-serif font-bold text-[#FDFBF7] group-hover:text-[#E2B767] transition-colors leading-snug">
                        {item.name}
                      </h3>
                      <span className="text-base font-bold text-[#E2B767] tabular-nums shrink-0">
                        ₹{item.price}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-[#F7F1E7]/70 line-clamp-2 font-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Action row */}
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-[#F7F1E7]/50 hover:text-[#E2B767] transition-colors">
                      {item.options ? 'Customizable options available' : 'Standard serving'}
                    </span>

                    {item.inStock ? (
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(item, e)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#B87B42] hover:bg-[#E2B767] text-white hover:text-[#120B07] text-xs font-semibold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                        title={item.options ? 'Customize & Add' : 'Add to Order'}
                      >
                        {quickAddedId === item.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-white" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>{item.options ? 'Customize' : 'Add'}</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-xs text-red-400/80 font-medium italic">Unavailable</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Item Customizer Modal */}
      {selectedItemForModal && (
        <ItemCustomizerModal
          item={selectedItemForModal}
          onClose={() => setSelectedItemForModal(null)}
        />
      )}
    </section>
  );
};
