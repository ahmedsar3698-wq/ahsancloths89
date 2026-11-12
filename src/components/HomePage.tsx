import React from 'react';
import { ArrowRight, Sparkles, Star, Award, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Hero } from './Hero';
import { QualityStrip } from './QualityStrip';
import { CategoryShowcase } from './CategoryShowcase';
import { ProductCard } from './ProductCard';
import { ReviewsSection } from './ReviewsSection';

export const HomePage: React.FC = () => {
  const { products, setActiveView, openCategoryView } = useStore();

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 3);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 3);

  return (
    <div className="space-y-0">
      {/* 1. Hero Banner */}
      <Hero />

      {/* 2. Quality Guarantees & Capry Seal */}
      <QualityStrip />

      {/* 3. Featured Unstitched Suits */}
      <section className="py-16 bg-[#0c0d10] border-b border-[#1f2129]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                CURATED SELECTION
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-display text-white mt-1">
                Featured Unstitched Suits
              </h2>
            </div>

            <button
              onClick={() => {
                setActiveView('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#d4af37] hover:text-[#e4c04e] transition-colors"
            >
              <span>View Full Shop</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Category Showcase */}
      <CategoryShowcase />

      {/* 5. Best Sellers Section */}
      <section className="py-16 bg-[#0e0f14] border-b border-[#20222a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                HIGHLY REQUESTED
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-display text-white mt-1">
                Gentlemen's Best Sellers
              </h2>
            </div>

            <button
              onClick={() => {
                openCategoryView('best-sellers');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#d4af37] hover:text-[#e4c04e] transition-colors"
            >
              <span>Explore All Best Sellers</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. New Arrivals Section */}
      <section className="py-16 bg-[#0c0d10] border-b border-[#20222a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                SEASONAL MILL RUNS
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-display text-white mt-1">
                Fresh New Arrivals
              </h2>
            </div>

            <button
              onClick={() => {
                openCategoryView('new-arrivals');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#d4af37] hover:text-[#e4c04e] transition-colors"
            >
              <span>See All Arrivals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Reviews, Testimonials & Free Karachi Delivery Banner */}
      <ReviewsSection />
    </div>
  );
};
