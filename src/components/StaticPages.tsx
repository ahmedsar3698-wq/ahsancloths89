import React from 'react';
import { ShieldCheck, Truck, RotateCcw, MessageCircle, MapPin, Phone, Mail, Award } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface StaticPageProps {
  page: 'about' | 'contact' | 'privacy' | 'returns';
}

export const StaticPages: React.FC<StaticPageProps> = ({ page }) => {
  const { settings, setActiveView, openCategoryView } = useStore();

  if (page === 'about') {
    return (
      <div className="min-h-screen bg-[#0c0d10] py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
              OUR HERITAGE & MISSION
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold font-display text-white">
              AL HAFIZ CLOTHS
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
              Premium Fabric. Perfect Elegance. Born in Karachi to bring distinguished Pakistani gentlemen authentic unstitched suit fabrics of uncompromising caliber.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#121319] border border-[#22242e] space-y-6 leading-relaxed text-sm text-neutral-300">
            <h2 className="text-xl font-bold font-display text-white">
              The Gentleman's Benchmark
            </h2>
            <p>
              In traditional Pakistani menswear, true luxury begins with the warp and weft of the unstitched cloth. At <strong>AL HAFIZ CLOTHS</strong>, we curate exclusively from premier weaving masters, ensuring every length possesses superior tensile strength, graceful drape, and authentic breathability.
            </p>
            <p>
              Whether it is our signature <strong>Wrinkle-Resistant Washing Wear</strong> for executive demands, pristine <strong>Combed Pure Cotton</strong> for hot Karachi afternoons, or our gold-boxed <strong>Festive Men's Suits</strong>, we guarantee prices strictly between <strong>Rs. 1,500 and Rs. 5,000</strong> across 25 authentic color shades without sacrificing textile integrity.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#1e202a]">
              <div className="p-4 rounded-xl bg-[#171822] border border-[#282a38] text-center">
                <Truck className="w-6 h-6 text-[#d4af37] mx-auto mb-2" />
                <h3 className="font-bold text-white text-xs">Free Karachi Delivery</h3>
                <p className="text-[11px] text-neutral-400 mt-1">Direct doorstep COD across all towns</p>
              </div>

              <div className="p-4 rounded-xl bg-[#171822] border border-[#282a38] text-center">
                <ShieldCheck className="w-6 h-6 text-[#d4af37] mx-auto mb-2" />
                <h3 className="font-bold text-white text-xs">Capry Guarantee</h3>
                <p className="text-[11px] text-neutral-400 mt-1">Zero bur, shrink-locked, colorfast</p>
              </div>

              <div className="p-4 rounded-xl bg-[#171822] border border-[#282a38] text-center">
                <Award className="w-6 h-6 text-[#d4af37] mx-auto mb-2" />
                <h3 className="font-bold text-white text-xs">Standard 4.25 Gaz</h3>
                <p className="text-[11px] text-neutral-400 mt-1">Full unstitched suit cutting with buttons</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (page === 'contact') {
    return (
      <div className="min-h-screen bg-[#0c0d10] py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
              GET IN TOUCH
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
              Contact AL HAFIZ CLOTHS
            </h1>
            <p className="text-sm text-neutral-300">
              Our Karachi textile advisors are available daily on WhatsApp and phone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl bg-[#121319] border border-[#22242e] space-y-6">
              <h2 className="font-display font-bold text-lg text-white">
                Direct Contact Channels
              </h2>

              <div className="space-y-4 text-xs">
                <a
                  href={`https://wa.me/${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-700/50 hover:bg-emerald-900/60 transition-colors flex items-center gap-3.5 block"
                >
                  <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-neutral-400 block">WhatsApp Orders & Inquiries</span>
                    <strong className="text-white text-sm">{settings.whatsappDisplay}</strong>
                  </div>
                </a>

                <div className="p-4 rounded-xl bg-[#171822] border border-[#282a38] flex items-center gap-3.5">
                  <Phone className="w-5 h-5 text-[#d4af37] shrink-0" />
                  <div>
                    <span className="text-neutral-400 block">Phone Support</span>
                    <strong className="text-white text-sm">{settings.whatsappDisplay}</strong>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#171822] border border-[#282a38] flex items-center gap-3.5">
                  <MapPin className="w-5 h-5 text-[#d4af37] shrink-0" />
                  <div>
                    <span className="text-neutral-400 block">Head Office & Dispatch Center</span>
                    <strong className="text-white">Cloth Market / Saddar, Karachi, Sindh, Pakistan</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#121319] border border-[#22242e] space-y-4">
              <h2 className="font-display font-bold text-lg text-white">
                Send a Fast Message
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Thank you! We will get back to you immediately on WhatsApp.');
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="text-neutral-300 block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Muhammad Bilal"
                    className="w-full bg-[#181922] border border-[#2b2d3c] rounded-lg px-3.5 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-neutral-300 block mb-1">WhatsApp Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="0326-2444991"
                    className="w-full bg-[#181922] border border-[#2b2d3c] rounded-lg px-3.5 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-neutral-300 block mb-1">Message / Fabric Query</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Inquiring about bulk orders or specific colors..."
                    className="w-full bg-[#181922] border border-[#2b2d3c] rounded-lg px-3.5 py-2 text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-[#d4af37] text-black font-bold rounded-lg hover:bg-[#e4c04e] transition-colors"
                >
                  Send Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (page === 'returns') {
    return (
      <div className="min-h-screen bg-[#0c0d10] py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
              CUSTOMER SATISFACTION
            </span>
            <h1 className="text-3xl font-bold font-display text-white">
              Return & Exchange Policy
            </h1>
          </div>

          <div className="p-8 rounded-2xl bg-[#121319] border border-[#22242e] space-y-6 text-sm text-neutral-300 leading-relaxed">
            <div className="p-4 rounded-xl bg-[#181b25] border border-[#d4af37]/30 flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-[#d4af37] shrink-0" />
              <span className="text-white font-semibold text-xs">
                7-Day Hassle-Free Exchange on Unstitched Fabrics
              </span>
            </div>

            <h2 className="text-base font-bold text-white font-display">1. Eligibility Criteria</h2>
            <p>
              We want you to be completely delighted with your fabric purchase. If the color tone does not match your preference or if you wish to choose another weave variety, you may request an exchange within <strong>7 days</strong> of delivery.
            </p>

            <h2 className="text-base font-bold text-white font-display">2. Unstitched Condition</h2>
            <p>
              The fabric must remain in its original, uncut, and unwashed condition with all brand tags, buttons, and presentation ribbons intact.
            </p>

            <h2 className="text-base font-bold text-white font-display">3. Capry Guarantee Claim</h2>
            <p>
              In the unlikely event of any weaving defect or lint formation covered by our <strong>Capry Guarantee</strong>, we will replace your suit immediately free of charge, with complimentary return pickup in Karachi.
            </p>

            <h2 className="text-base font-bold text-white font-display">4. How to Initiate an Exchange</h2>
            <p>
              Simply contact our dispatch coordinator on WhatsApp at <strong>+92-326-2444991</strong> with your Order ID and photo of the unstitched suit.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Privacy Policy
  return (
    <div className="min-h-screen bg-[#0c0d10] py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
            DATA SECURITY
          </span>
          <h1 className="text-3xl font-bold font-display text-white">
            Privacy Policy
          </h1>
        </div>

        <div className="p-8 rounded-2xl bg-[#121319] border border-[#22242e] space-y-6 text-sm text-neutral-300 leading-relaxed">
          <p>
            At <strong>AL HAFIZ CLOTHS</strong>, respecting your privacy and protecting your personal details is our utmost priority.
          </p>
          <h2 className="text-base font-bold text-white font-display">Information Collected</h2>
          <p>
            When you place an order via our website or directly through WhatsApp, we collect only necessary shipping information: customer name, mobile/WhatsApp number, city, and delivery street address to facilitate courier delivery.
          </p>
          <h2 className="text-base font-bold text-white font-display">Zero Spam Guarantee</h2>
          <p>
            We never sell, rent, or distribute your phone number or order history to third parties or marketing syndicates.
          </p>
        </div>
      </div>
    </div>
  );
};
