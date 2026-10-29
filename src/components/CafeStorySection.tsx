import React from 'react';
import { Sparkles, HeartHandshake, Coffee, Award, Wheat } from 'lucide-react';

export const CafeStorySection: React.FC = () => {
  return (
    <section id="story" className="py-24 relative z-10 bg-[#0F0805] border-t border-[#FAF6F0]/5 overflow-hidden">
      
      {/* Ambient background blur elements */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#B87B42]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#E2B767]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Editorial Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#E2B767] font-semibold mb-2">
            <HeartHandshake className="w-3.5 h-3.5 text-[#E2B767]" />
            <span>The Craft & Philosophy</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#FDFBF7] tracking-tight">
            Our Hearth & Heritage
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#F7F1E7]/75 font-light leading-relaxed">
            Founded by Chef Sanny with an unyielding reverence for slow fermentation, honest roasting, and gracious neighborhood hospitality.
          </p>
        </div>

        {/* 3-Column Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Roasting */}
          <div className="glass-card rounded-2xl overflow-hidden border border-[#E2B767]/20 flex flex-col">
            <div className="relative h-60 w-full overflow-hidden">
              <img
                src="/src/assets/images/food_espresso_specialty_1793294320359.jpg"
                alt="Velvety espresso with latte art and roasted beans"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 filter brightness-95"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C120C] via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E2B767]">
                  01 · The Roastery
                </span>
                <h3 className="text-lg font-serif font-bold text-[#FDFBF7]">
                  Single-Origin Altitude
                </h3>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <p className="text-xs text-[#F7F1E7]/70 font-light leading-relaxed">
                We roast in small 5kg batches twice weekly. Sourced directly from micro-farms in Yirgacheffe and Huila, our beans are coaxed to release floral notes, stone fruit vibrancy, and rich velvety cocoa undertones.
              </p>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-[#E2B767] font-medium">
                <Coffee className="w-3.5 h-3.5" />
                <span>Dual boiler custom Sanremo machine</span>
              </div>
            </div>
          </div>

          {/* Card 2: Bakery */}
          <div className="glass-card rounded-2xl overflow-hidden border border-[#E2B767]/20 flex flex-col">
            <div className="relative h-60 w-full overflow-hidden">
              <img
                src="/src/assets/images/food_pastry_croissant_1793294321656.jpg"
                alt="Flaky pistachio croissant with powdered sugar"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 filter brightness-95"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C120C] via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E2B767]">
                  02 · The Viennoiserie
                </span>
                <h3 className="text-lg font-serif font-bold text-[#FDFBF7]">
                  36-Hour Sourdough Levain
                </h3>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <p className="text-xs text-[#F7F1E7]/70 font-light leading-relaxed">
                Our croissants and bread do not take shortcuts. We hand-laminate French butter layers using organic heritage flours and a sourdough starter maintained for over eight years, baking every dawn.
              </p>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-[#E2B767] font-medium">
                <Wheat className="w-3.5 h-3.5" />
                <span>Zero commercial additives or pre-mixes</span>
              </div>
            </div>
          </div>

          {/* Card 3: Kitchen & Hearth */}
          <div className="glass-card rounded-2xl overflow-hidden border border-[#E2B767]/20 flex flex-col">
            <div className="relative h-60 w-full overflow-hidden">
              <img
                src="/src/assets/images/food_artisanal_brunch_1793294319410.jpg"
                alt="Artisanal avocado poached egg tartine with microgreens"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 filter brightness-95"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C120C] via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E2B767]">
                  03 · The Hearth
                </span>
                <h3 className="text-lg font-serif font-bold text-[#FDFBF7]">
                  Farm-to-Table Brunch
                </h3>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <p className="text-xs text-[#F7F1E7]/70 font-light leading-relaxed">
                From pasture-raised golden yolk eggs to wild seasonal chanterelles and house-whipped ricotta, our savory dishes celebrate honest agriculture and vibrant culinary balance.
              </p>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-[#E2B767] font-medium">
                <Award className="w-3.5 h-3.5" />
                <span>100% regional organic partners</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
