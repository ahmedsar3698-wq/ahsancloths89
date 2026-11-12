import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CategoryShowcase: React.FC = () => {
  const { categories, openCategoryView } = useStore();

  return (
    <section className="py-16 bg-[#0c0d10] border-b border-[#20222a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#d4af37]">
              CURATED FABRICS
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-white mt-1">
              Explore By Collection
            </h2>
          </div>
          <p className="text-sm text-neutral-400 max-w-md">
            From easy-care washing wear to regal pure cotton and festive suit lengths, find the ideal drape for every occasion.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => openCategoryView(cat.slug)}
              className="group relative rounded-xl overflow-hidden bg-[#14151c] border border-[#232530] hover:border-[#d4af37]/60 cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl"
            >
              {/* Image Container */}
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#181a24]">
                <img
                  src={cat.image || '/src/assets/images/fabric_washing_wear_1794488410986.jpg'}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
              </div>

              {/* Content info */}
              <div className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-white group-hover:text-[#d4af37] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-neutral-300 line-clamp-1 mt-1 max-w-[210px]">
                    {cat.description}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#d4af37] text-white group-hover:text-black flex items-center justify-center transition-all shrink-0">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
