import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const FloatingWhatsApp: React.FC = () => {
  const { settings } = useStore();

  const defaultGreeting = encodeURIComponent(
    'السلام علیکم! Assalam-o-Alaikum AL HAFIZ CLOTHS, I am interested in exploring your unstitched suits and fabric collection.'
  );

  return (
    <aside aria-label="Customer Support" className="fixed bottom-6 right-6 z-40 flex items-center group">
      <div className="mr-3 px-3.5 py-1.5 rounded-full bg-[#111218]/95 border border-[#2c2f3d] text-white text-xs font-semibold shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none hidden sm:block whitespace-nowrap">
        Order on WhatsApp &middot; <span className="text-[#d4af37]">Karachi Delivery Free</span>
      </div>

      <a
        href={`https://wa.me/${settings.whatsappNumber}?text=${defaultGreeting}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-[0_8px_30px_rgba(16,185,129,0.4)] transition-all duration-300 transform group-hover:scale-110 active:scale-95"
        title="Direct WhatsApp Support: +92-326-2444991"
        aria-label="Contact AL HAFIZ CLOTHS on WhatsApp"
      >
        <MessageCircle className="w-8 h-8 fill-white/20" />
      </a>
    </aside>
  );
};
