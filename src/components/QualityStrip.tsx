import React from 'react';
import { ShieldCheck, Award, Palette, Sparkles, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const QualityStrip: React.FC = () => {
  const { settings } = useStore();

  const qualities = [
    {
      icon: <Award className="w-6 h-6 text-[#d4af37]" />,
      title: 'Best Quality Fabric',
      description: 'Ultra-fine yarn weaving with superior hand-feel, durability, and smooth fall.',
      badge: 'Premium Quality',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#d4af37]" />,
      title: 'Capry Guarantee',
      description: settings.capryGuaranteeGlobalText || 'Guaranteed zero lint/burring, shrink-stabilized, and long-lasting shape retention.',
      badge: 'Capry Guarantee',
      highlight: true,
    },
    {
      icon: <Palette className="w-6 h-6 text-[#d4af37]" />,
      title: 'Color Guaranteed',
      description: 'Vat-dyed rich pigments that do not bleed or fade across decades of washing.',
      badge: 'Color Guaranteed',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#d4af37]" />,
      title: 'Affordable Luxury',
      description: 'All genuine unstitched designer suits priced strictly between Rs. 1,500 to Rs. 5,000 in 25 shades.',
      badge: 'Best Fabric',
    },
  ];

  return (
    <section className="py-12 bg-[#0e0f14] border-b border-[#1f2129]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#d4af37]">
            AL HAFIZ CLOTHS STANDARDS
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
            Engineered For The Pakistani Gentleman
          </h2>
          <p className="text-neutral-400 text-sm mt-2">
            Every unstitched suit undergoes rigorous hand inspection before cutting and dispatch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {qualities.map((item) => (
            <div
              key={item.title}
              className={`p-6 rounded-xl border transition-all duration-300 relative ${
                item.highlight
                  ? 'bg-[#151720] border-[#d4af37]/40 shadow-[0_0_20px_rgba(212,175,55,0.08)]'
                  : 'bg-[#121318] border-[#22242e] hover:border-[#2f3240]'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-lg bg-[#1a1c24] border border-[#2d303d]">
                  {item.icon}
                </div>
                <span className="text-[11px] font-semibold tracking-wide text-[#d4af37] bg-[#d4af37]/10 px-2.5 py-1 rounded">
                  {item.badge}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-2 font-display">
                {item.title}
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {item.description}
              </p>

              <div className="mt-4 pt-3 border-t border-[#1e2029] flex items-center gap-1.5 text-[11px] text-neutral-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Quality Seal</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
