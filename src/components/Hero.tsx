import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles, MessageCircle, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Hero: React.FC = () => {
  const { setActiveView, openCategoryView, settings } = useStore();

  return (
    <section className="relative overflow-hidden bg-[#0c0d10] py-12 lg:py-20 border-b border-[#20222a]">
      {/* Subtle gold radial background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#d4af37]/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Narrative */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Trust Kicker */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181a20] border border-[#d4af37]/30 text-xs text-[#d4af37] font-medium tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Authentic Pakistani Men's Unstitched Suits</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.15]">
              Wear Elegance.{' '}
              <span className="block gold-gradient-text mt-1">
                Experience Premium Quality.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-neutral-300 max-w-2xl font-normal leading-relaxed">
              Discover Premium Men's Unstitched Suits. Sourced from the finest weaving mills, offering royal fall, lasting colorfastness, and our signature Capry Guarantee.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  setActiveView('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-7 py-3.5 rounded-lg bg-[#d4af37] hover:bg-[#e4c04e] text-black font-bold text-sm tracking-wide transition-all shadow-[0_0_25px_rgba(212,175,55,0.25)] flex items-center gap-2 group cursor-pointer"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => {
                  openCategoryView('washing-wear');
                }}
                className="px-6 py-3.5 rounded-lg bg-[#181a22] hover:bg-[#232530] text-neutral-200 hover:text-white border border-[#2e313c] font-semibold text-sm tracking-wide transition-all cursor-pointer"
              >
                Explore Collection
              </button>

              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 font-semibold text-sm transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Order</span>
              </a>
            </div>

            {/* Quick Proof Strip */}
            <div className="pt-6 border-t border-[#1e2028] grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-neutral-300">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded bg-[#161820] border border-[#2b2d38] text-[#d4af37]">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Free Delivery</div>
                  <div className="text-neutral-400">All across Karachi</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded bg-[#161820] border border-[#2b2d38] text-[#d4af37]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Capry Guarantee</div>
                  <div className="text-neutral-400">No Bur / Color bleed</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
                <div className="p-2 rounded bg-[#161820] border border-[#2b2d38] text-[#d4af37]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Rs. 1,500 – 5,000</div>
                  <div className="text-neutral-400">25 Authentic Shades</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer decorative gold border */}
              <div className="relative rounded-2xl overflow-hidden border border-[#d4af37]/30 shadow-2xl bg-[#14151a]">
                <img
                  src="/src/assets/images/hero_unstitched_fabric_1794488410400.jpg"
                  alt="AL HAFIZ CLOTHS Premium Men's Unstitched Fabric"
                  className="w-full h-[380px] sm:h-[460px] object-cover transition-transform duration-700 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Measured Scrim Overlay for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                {/* Overlaid Badge */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-[#0e0f14]/90 backdrop-blur-md border border-[#2f323e] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#d4af37] font-semibold tracking-wider uppercase">
                      New Festive 2026 Collection
                    </span>
                    <h4 className="text-sm font-bold text-white font-display">
                      Royal Executive Unstitched Suit
                    </h4>
                    <p className="text-xs text-neutral-400">
                      Standard 4.25 Gaz Cutting &middot; 4 Authentic Colors
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-neutral-400 block line-through">Rs. 2,950</span>
                    <span className="text-base font-bold text-[#d4af37] tabular-nums">Rs. 2,450</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
