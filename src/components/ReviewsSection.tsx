import React from 'react';
import { Star, MessageCircle, Truck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { sampleReviews } from '../data/initialData';
import { useStore } from '../context/StoreContext';

export const ReviewsSection: React.FC = () => {
  const { settings } = useStore();

  return (
    <section className="py-16 bg-[#0a0b0e] border-b border-[#20222a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
            GENTLEMEN REPUTATION
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-display text-white mt-1">
            Trusted Across Karachi & Pakistan
          </h2>
          <p className="text-neutral-400 text-sm mt-2">
            Read authentic reviews from customers who chose AL HAFIZ CLOTHS for exceptional fabric longevity and prompt Karachi delivery.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {sampleReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-xl bg-[#121319] border border-[#22242e] flex flex-col justify-between hover:border-[#d4af37]/30 transition-all duration-300"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-neutral-500">{rev.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#1e202a] flex items-center justify-between">
                <div>
                  <h4 className="font-display font-bold text-xs sm:text-sm text-white">
                    {rev.author}
                  </h4>
                  <span className="text-[11px] text-[#d4af37]">{rev.city}</span>
                </div>
                <span className="text-[10px] text-neutral-400 bg-[#191a24] px-2 py-1 rounded border border-[#292b3a]">
                  {rev.suitName}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Free Karachi Delivery & WhatsApp Callout Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#171922] via-[#14151d] to-[#1a1c26] border border-[#d4af37]/30 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#20222e] border border-[#303342] text-xs font-semibold text-[#d4af37]">
                <Truck className="w-3.5 h-3.5" />
                <span>Special Karachi City Benefit</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                FREE DELIVERY IN KARACHI ON ALL SUITS
              </h3>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl">
                We believe in hassle-free convenience for our hometown. Whether you order one unstitched suit or ten rolls, enjoy zero delivery charges anywhere in Karachi. Direct doorstep cash on delivery.
              </p>

              <div className="flex items-center gap-6 pt-2 text-xs text-neutral-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  24–48 Hour Dispatch
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                  Open Parcel Inspection Allowed
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                  'Assalam-o-Alaikum AL HAFIZ CLOTHS, I am in Karachi and would like to order unstitched fabrics with Free Delivery.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-xl"
              >
                <MessageCircle className="w-5 h-5 fill-white/20" />
                <span>Order on WhatsApp Now</span>
              </a>

              <div className="text-center text-xs text-neutral-400 font-mono">
                Direct Hotline: <strong className="text-white">+92-326-2444991</strong>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
