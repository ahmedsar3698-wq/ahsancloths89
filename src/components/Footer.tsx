import React from 'react';
import { MessageCircle, ShieldCheck, Truck, Phone, MapPin, Sparkles, Lock } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { settings, setActiveView, openCategoryView, categories } = useStore();

  const handleNav = (view: string, slug?: string) => {
    if (slug) {
      openCategoryView(slug);
    } else {
      setActiveView(view);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#08090b] border-t border-[#1a1b22] text-neutral-400 text-xs pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#181920]">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="cursor-pointer" onClick={() => handleNav('home')}>
              <span className="font-display text-2xl font-bold tracking-wider text-white">
                AL HAFIZ CLOTHS
              </span>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold mt-0.5">
                {settings.tagline}
              </p>
            </div>

            <p className="text-neutral-400 leading-relaxed max-w-sm">
              Karachi's trusted purveyor of luxury unstitched men's suits. Offering high-grade washing wear, combed pure cotton, and festive formal weaves with our signature Capry Guarantee.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-950/80 border border-emerald-700/60 hover:bg-emerald-900 text-emerald-300 font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>+92-326-2444991</span>
              </a>
            </div>
          </div>

          {/* Quick Collections */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider">
              Fabric Varieties
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNav('shop', 'washing-wear')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Washing Wear Fabric
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('shop', 'pure-cotton')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Pure Cotton Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('shop', 'mix-cotton')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Mix Cotton Blends
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('shop', 'premium-unstitched-suits')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Premium Unstitched Suits
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('shop', 'mens-suit-collection')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Men's Suit Collection
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider">
              Customer Care
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  About Our Brand
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Contact & Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('returns')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Return & Exchange
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('privacy')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Delivery & Assurance */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider">
              Delivery & Guarantee
            </h3>
            <div className="p-4 rounded-xl bg-[#121319] border border-[#20222b] space-y-2.5">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Truck className="w-4 h-4 text-[#d4af37]" />
                <span>FREE DELIVERY IN KARACHI</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Zero delivery charges across Karachi. Standard Rs. 250 fee for other cities in Pakistan.
              </p>
              <div className="pt-2 border-t border-[#1e2029] flex items-center gap-2 text-[#d4af37] text-[11px] font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Capry Guarantee</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Admin Lock and Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} AL HAFIZ CLOTHS. All Rights Reserved. Built for Pakistani Gentlemen.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNav('admin')}
              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-[#d4af37] transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Portal Login</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
