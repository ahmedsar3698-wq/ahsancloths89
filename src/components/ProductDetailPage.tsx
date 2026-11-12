import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  MessageCircle,
  Check,
  Star,
  ChevronLeft,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

export const ProductDetailPage: React.FC = () => {
  const {
    products,
    selectedProductId,
    setActiveView,
    addToCart,
    orderViaWhatsApp,
    settings,
  } = useStore();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  // Selected state
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string>(
    product?.colors?.[0]?.name || 'Standard'
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0c0d10] py-20 text-center text-white">
        <p>Product not found.</p>
        <button
          onClick={() => setActiveView('shop')}
          className="mt-4 px-4 py-2 bg-[#d4af37] text-black font-bold rounded"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.isFeatured))
    .slice(0, 3);

  const colorsList = Array.isArray(product?.colors) ? product.colors : [];
  const imagesList =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images
      : [product?.thumbnail || '/src/assets/images/fabric_washing_wear_1794488410986.jpg'];

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, selectedColor, quantity);
    }
  };

  const handleWhatsAppOrder = () => {
    orderViaWhatsApp({
      productName: product.name,
      productPrice: product.price,
      productColor: selectedColor,
      quantity,
      totalAmount: product.price * quantity,
    });
  };

  return (
    <div className="min-h-screen bg-[#0c0d10] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <button
          onClick={() => setActiveView('shop')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-[#d4af37] mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Collection</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Gallery & Zoom Showcase */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Main Active Image View with Zoom on Hover */}
            <div
              className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#161822] border border-[#262835] group cursor-crosshair shadow-2xl"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
            >
              <img
                src={imagesList[activeImageIndex] || product.thumbnail}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-300 ${
                  isZoomed ? 'scale-125' : 'scale-100'
                }`}
                referrerPolicy="no-referrer"
              />

              {/* Quality Seal floating badge */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-[#0c0d10]/90 backdrop-blur-md text-xs font-bold text-[#d4af37] border border-[#d4af37]/40 shadow-lg">
                  {product.badge}
                </span>
                {product.capryGuarantee && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/90 backdrop-blur-md text-xs font-semibold text-emerald-300 border border-emerald-600/40 shadow">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Capry Guarantee
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Navigation Row */}
            {imagesList.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-[#d4af37] ring-2 ring-[#d4af37]/30 scale-105'
                        : 'border-[#232530] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Fabric Details & Guarantee Card */}
            <div className="mt-8 p-6 rounded-xl bg-[#121318] border border-[#22242c] space-y-4">
              <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                <span>Fabric Craftsmanship & Specifications</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-[#181920] border border-[#262834]">
                  <span className="text-neutral-500 block uppercase">Fabric Type</span>
                  <span className="font-bold text-white mt-0.5 block">{product.fabricType}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#181920] border border-[#262834]">
                  <span className="text-neutral-500 block uppercase">Standard Cutting</span>
                  <span className="font-bold text-white mt-0.5 block">{product.cutting}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#181920] border border-[#262834]">
                  <span className="text-neutral-500 block uppercase">Season</span>
                  <span className="font-bold text-white mt-0.5 block">{product.season}</span>
                </div>
              </div>

              {/* Capry Guarantee Highlight */}
              <div className="p-4 rounded-lg bg-[#181b24] border border-[#d4af37]/30 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Official Capry Guarantee Included
                  </h4>
                  <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                    {product.capryGuaranteeText || settings.capryGuaranteeGlobalText}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right: Contiguous Purchase Module */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#121318] border border-[#22242c] rounded-2xl p-6 sm:p-8 space-y-6 sticky top-28 shadow-xl">
              
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs">
                <span className="uppercase tracking-widest font-semibold text-[#d4af37]">
                  {product.category.replace('-', ' ')}
                </span>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-bold text-white">{product.rating}</span>
                  <span className="text-neutral-500">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Product Title */}
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white leading-snug">
                {product.name}
              </h1>

              {/* Price Display */}
              <div className="p-4 rounded-xl bg-[#171821] border border-[#282a36] flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-neutral-400 block mb-1">Pakistani Rupees</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-[#d4af37] tabular-nums">
                      Rs. {product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-neutral-500 line-through tabular-nums">
                        Rs. {product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400 block">
                    Free Karachi Delivery
                  </span>
                  <span className="text-[11px] text-neutral-400">COD Available</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {product.description}
              </p>

              {/* 25 Shades Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white uppercase tracking-wider">
                      Selected Shade: <strong className="text-[#d4af37]">{selectedColor}</strong>
                    </span>
                    <span className="text-[11px] text-[#d4af37] font-semibold bg-[#1a1c26] px-2 py-0.5 rounded border border-[#2c2f40]">
                      {product.colors.length} Master Colors
                    </span>
                  </div>

                  {/* Quick Swatch Bar */}
                  <div className="flex items-center gap-1.5 flex-wrap p-2.5 rounded-xl bg-[#161822] border border-[#252834]">
                    {product.colors.map((color) => {
                      const isSelected = selectedColor === color.name;
                      return (
                        <button
                          key={color.name}
                          type="button"
                          title={color.name}
                          onClick={() => setSelectedColor(color.name)}
                          className={`w-6 h-6 rounded-full border transition-all flex items-center justify-center ${
                            isSelected
                              ? 'ring-2 ring-[#d4af37] scale-110 border-white'
                              : 'border-white/20 hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.hex }}
                        >
                          {isSelected && (
                            <Check
                              className={`w-3.5 h-3.5 ${
                                ['#ffffff', '#f8f6f0', '#f2ede0', '#e6dcbe', '#ebe5d3', '#bad1bf', '#8ca9c7'].includes(color.hex.toLowerCase())
                                  ? 'text-black'
                                  : 'text-white'
                              }`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Scrollable Named Shade Selector */}
                  <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                    {product.colors.map((color) => {
                      const isSelected = selectedColor === color.name;
                      return (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => setSelectedColor(color.name)}
                          className={`p-2 rounded-lg border text-left text-xs font-medium flex items-center justify-between transition-all ${
                            isSelected
                              ? 'bg-[#1e202c] border-[#d4af37] text-white shadow-sm'
                              : 'bg-[#161720] border-[#252733] text-neutral-300 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0 shadow-inner"
                              style={{ backgroundColor: color.hex }}
                            />
                            <span className="truncate text-[11px]">{color.name}</span>
                          </div>
                          {isSelected && <Check className="w-3 h-3 text-[#d4af37] shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-white uppercase tracking-wider block">
                  Quantity (Unstitched Suits)
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#2b2d38] rounded-lg bg-[#161820] overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-2 text-neutral-300 hover:text-white hover:bg-[#232530] transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-sm font-bold text-white tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3.5 py-2 text-neutral-300 hover:text-white hover:bg-[#232530] transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-neutral-400">
                    Total: <strong className="text-white">Rs. {(product.price * quantity).toLocaleString()}</strong>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-[#22242c]">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3.5 px-6 rounded-lg bg-[#d4af37] hover:bg-[#e4c04e] text-black font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Shopping Bag</span>
                </button>

                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full py-3.5 px-6 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white/20" />
                  <span>Order on WhatsApp (Instant Bill)</span>
                </button>
              </div>

              {/* Delivery & Reassurance Strip */}
              <div className="pt-4 border-t border-[#1e2029] space-y-2 text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#d4af37]" />
                  <span>
                    <strong className="text-white">Karachi:</strong> Free Delivery (1-2 Days)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-[#d4af37]" />
                  <span>7-Day Return & Exchange Policy</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#20222a]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#d4af37]">
                  RECOMMENDED WEAVES
                </span>
                <h2 className="text-2xl font-bold font-display text-white mt-1">
                  You May Also Admire
                </h2>
              </div>
              <button
                onClick={() => setActiveView('shop')}
                className="text-xs font-semibold text-[#d4af37] hover:underline"
              >
                View Complete Shop
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
