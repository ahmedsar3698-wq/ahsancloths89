import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, RotateCcw, Search, Sparkles, Check, Palette } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { masterSuitColors } from '../data/initialData';

export const ShopPage: React.FC = () => {
  const {
    products,
    categories,
    selectedCategorySlug,
    openCategoryView,
    searchQuery,
    setSearchQuery,
  } = useStore();

  // Filters state
  const [activeCategory, setActiveCategory] = useState<string>(selectedCategorySlug || 'all');
  const [minPrice, setMinPrice] = useState<number>(1500);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [onlyCapryGuarantee, setOnlyCapryGuarantee] = useState<boolean>(false);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(true);
  const [selectedColorFilter, setSelectedColorFilter] = useState<string>('all');

  // Keep active category synced if changed from outside
  React.useEffect(() => {
    if (selectedCategorySlug) {
      setActiveCategory(selectedCategorySlug);
    }
  }, [selectedCategorySlug]);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesCat = p.category.toLowerCase().includes(query);
        const matchesColors = Array.isArray(p.colors) && p.colors.some((c) => c?.name && c.name.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesCat && !matchesColors) {
          return false;
        }
      }

      // Category filter
      if (activeCategory !== 'all') {
        if (activeCategory === 'new-arrivals') {
          if (!p.isNewArrival) return false;
        } else if (activeCategory === 'best-sellers') {
          if (!p.isBestSeller) return false;
        } else if (p.category !== activeCategory) {
          return false;
        }
      }

      // Price filter (Rs. 1,500 – Rs. 5,000)
      if (p.price < minPrice || p.price > maxPrice) {
        return false;
      }

      // Capry guarantee
      if (onlyCapryGuarantee && !p.capryGuarantee) {
        return false;
      }

      // In stock
      if (onlyInStock && !p.inStock) {
        return false;
      }

      // Color Filter (from 25 shades)
      if (selectedColorFilter !== 'all') {
        const hasColor = Array.isArray(p.colors) && p.colors.some(
          (c) => c?.name && c.name.toLowerCase() === selectedColorFilter.toLowerCase()
        );
        if (!hasColor) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      // default: featured
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });
  }, [
    products,
    searchQuery,
    activeCategory,
    minPrice,
    maxPrice,
    onlyCapryGuarantee,
    onlyInStock,
    selectedColorFilter,
    sortBy,
  ]);

  const resetFilters = () => {
    setActiveCategory('all');
    setMinPrice(1500);
    setMaxPrice(5000);
    setSortBy('featured');
    setOnlyCapryGuarantee(false);
    setOnlyInStock(true);
    setSelectedColorFilter('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#0c0d10] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Breadcrumbs */}
        <div className="mb-8 border-b border-[#20222a] pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                AL HAFIZ CLOTHS CATALOGUE
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold font-display text-white mt-1">
                Men's Unstitched Collection (25 Colors &middot; Rs. 1,500 – 5,000)
              </h1>
              <p className="text-sm text-neutral-400 mt-1">
                Showing {filteredProducts.length} authentic fabrics &middot; Free Karachi Delivery &middot; 25 Rich Shades
              </p>
            </div>

            {/* Sort & Search Controls */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#151720] border border-[#2b2d38] text-neutral-200 text-xs rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>

              {(searchQuery || activeCategory !== 'all' || minPrice > 1500 || maxPrice < 5000 || selectedColorFilter !== 'all') && (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-neutral-400 hover:text-white bg-[#151720] border border-[#2b2d38] rounded-lg transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Horizontal Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-2 no-scrollbar">
            <button
              onClick={() => {
                setActiveCategory('all');
                openCategoryView('');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === 'all'
                  ? 'bg-[#d4af37] text-black shadow-md'
                  : 'bg-[#151720] text-neutral-300 hover:text-white border border-[#232530]'
              }`}
            >
              All Varieties ({products.length})
            </button>
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.slug);
                    openCategoryView(cat.slug);
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-[#d4af37] text-black shadow-md'
                      : 'bg-[#151720] text-neutral-300 hover:text-white border border-[#232530]'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Layout: Sidebar Filters + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Filter Sidebar */}
          <div className="lg:col-span-1 space-y-6 bg-[#111216] border border-[#22242c] p-6 rounded-xl h-fit">
            <div className="flex items-center justify-between pb-4 border-b border-[#22242c]">
              <div className="flex items-center gap-2 font-display font-bold text-white text-sm">
                <SlidersHorizontal className="w-4 h-4 text-[#d4af37]" />
                <span>Refine Collection</span>
              </div>
              <button
                onClick={resetFilters}
                className="text-[11px] text-[#d4af37] hover:underline"
              >
                Clear All
              </button>
            </div>

            {/* Price Filter (Strict Rs. 1,500 – Rs. 5,000) */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-white uppercase tracking-wider block">
                Price Range (PKR)
              </label>
              <div className="flex items-center justify-between text-xs text-[#d4af37] font-semibold tabular-nums">
                <span>Rs. {minPrice.toLocaleString()}</span>
                <span>Rs. {maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1500"
                max="5000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#d4af37] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-neutral-500">
                <span>Min: Rs. 1,500</span>
                <span>Max: Rs. 5,000</span>
              </div>
            </div>

            {/* 25 Suit Color Swatches Filter */}
            <div className="space-y-3 pt-4 border-t border-[#22242c]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>25 Suit Shades</span>
                </label>
                {selectedColorFilter !== 'all' && (
                  <button
                    onClick={() => setSelectedColorFilter('all')}
                    className="text-[10px] text-[#d4af37] hover:underline"
                  >
                    All Shades
                  </button>
                )}
              </div>

              {selectedColorFilter !== 'all' && (
                <div className="text-xs text-[#d4af37] font-medium bg-[#1a1b24] p-2 rounded border border-[#2b2d3c]">
                  Active: <strong className="text-white">{selectedColorFilter}</strong>
                </div>
              )}

              <div className="grid grid-cols-5 gap-2 pt-1">
                {masterSuitColors.map((c) => {
                  const isSelected = selectedColorFilter === c.name;
                  return (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColorFilter(isSelected ? 'all' : c.name)}
                      className={`w-7 h-7 rounded-full border transition-all flex items-center justify-center relative group ${
                        isSelected
                          ? 'ring-2 ring-[#d4af37] scale-110 border-white'
                          : 'border-white/20 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {isSelected && (
                        <Check
                          className={`w-3.5 h-3.5 ${
                            ['#ffffff', '#f8f6f0', '#f2ede0', '#e6dcbe', '#ebe5d3', '#bad1bf', '#8ca9c7'].includes(c.hex.toLowerCase())
                              ? 'text-black'
                              : 'text-white'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-neutral-400">
                Select any of our 25 authentic suit colors to filter.
              </p>
            </div>

            {/* Quality Badges Filter */}
            <div className="space-y-3 pt-4 border-t border-[#22242c]">
              <label className="text-xs font-bold text-white uppercase tracking-wider block">
                Special Guarantees
              </label>
              <label className="flex items-center gap-2.5 text-xs text-neutral-300 hover:text-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyCapryGuarantee}
                  onChange={(e) => setOnlyCapryGuarantee(e.target.checked)}
                  className="rounded accent-[#d4af37] w-4 h-4"
                />
                <span className="font-medium">Capry Guarantee Only</span>
              </label>
              <label className="flex items-center gap-2.5 text-xs text-neutral-300 hover:text-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded accent-[#d4af37] w-4 h-4"
                />
                <span className="font-medium">In-Stock Only</span>
              </label>
            </div>

            {/* Karachi Delivery Note */}
            <div className="p-4 rounded-lg bg-[#181920] border border-[#2b2d38] space-y-2">
              <span className="text-[11px] font-bold text-[#d4af37] uppercase tracking-wide block">
                Delivery Policy
              </span>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Enjoy <strong className="text-white">FREE DELIVERY</strong> on all orders within Karachi. Flat Rs. 250 across all other cities in Pakistan.
              </p>
            </div>
          </div>

          {/* Right Product Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-[#121318] border border-[#22242c] rounded-xl p-8 space-y-4">
                <Search className="w-12 h-12 text-neutral-600 mx-auto" />
                <h3 className="text-lg font-bold text-white font-display">
                  No matching fabrics found
                </h3>
                <p className="text-sm text-neutral-400 max-w-md mx-auto">
                  Try adjusting your price range or selected color shade to see all unstitched suit varieties.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 bg-[#d4af37] text-black text-xs font-bold rounded-lg hover:bg-[#e4c04e] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
