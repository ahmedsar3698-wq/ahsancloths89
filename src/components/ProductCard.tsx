import React, { useState } from 'react';
import { ShoppingBag, MessageCircle, Eye, ShieldCheck, Check } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { openProductDetails, addToCart, orderViaWhatsApp } = useStore();
  
  const colorsList = Array.isArray(product?.colors) ? product.colors : [];
  const [selectedColor, setSelectedColor] = useState<string>(
    colorsList.length > 0 ? colorsList[0].name : 'Standard'
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product) {
      addToCart(product, selectedColor, 1);
    }
  };

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product) {
      orderViaWhatsApp({
        productName: product.name,
        productPrice: product.price || 2500,
        productColor: selectedColor,
        quantity: 1,
      });
    }
  };

  const imageUrl =
    product?.thumbnail ||
    (Array.isArray(product?.images) && product.images[0]) ||
    '/src/assets/images/fabric_washing_wear_1794488410986.jpg';

  return (
    <div
      onClick={() => product?.id && openProductDetails(product.id)}
      className="group relative bg-[#121318] rounded-xl border border-[#22242e] hover:border-[#d4af37]/50 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer shadow-lg hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
    >
      {/* Visual Top Slot with Aspect Ratio */}
      <div className="relative aspect-[4/3] w-full bg-[#181a22] overflow-hidden">
        <img
          src={imageUrl}
          alt={product?.name || 'Suit Fabric'}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
          referrerPolicy="no-referrer"
        />

        {/* Subtle Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Quality Badge Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          <span className="px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase rounded bg-[#0c0d10]/85 backdrop-blur-md text-[#d4af37] border border-[#d4af37]/30 shadow">
            {product.badge}
          </span>
          {product.capryGuarantee && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 bg-emerald-950/80 backdrop-blur-md border border-emerald-700/40 rounded">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Capry Guarantee
            </span>
          )}
        </div>

        {/* Fast Action Overlay on Hover */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openProductDetails(product.id);
            }}
            className="p-3 bg-white text-black rounded-full hover:bg-[#d4af37] transition-all transform hover:scale-110 shadow-lg"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={handleAddToCart}
            className="p-3 bg-[#d4af37] text-black rounded-full hover:bg-white transition-all transform hover:scale-110 shadow-lg"
            title="Add to Bag"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
          <button
            onClick={handleWhatsAppOrder}
            className="p-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-500 transition-all transform hover:scale-110 shadow-lg"
            title="Order on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Cutting Info */}
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
            <span className="uppercase tracking-wider font-semibold text-[#d4af37]">
              {product.fabricType || product.category.replace('-', ' ')}
            </span>
            <span className="text-[11px] text-neutral-400">{product.cutting}</span>
          </div>

          {/* Product Name */}
          <h3 className="font-display text-sm sm:text-base font-bold text-white line-clamp-1 group-hover:text-[#d4af37] transition-colors">
            {product.name}
          </h3>

          {/* Price System in PKR */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold text-[#d4af37] tabular-nums">
              Rs. {product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-neutral-400 line-through tabular-nums">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Interactive Color Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[#1e2029]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-neutral-300">
                  Color: <strong className="text-white">{selectedColor}</strong>
                </span>
                <span className="text-[10px] text-neutral-400">{product.colors.length} shades</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {product.colors.slice(0, 8).map((color) => {
                  const isSelected = selectedColor === color.name;
                  return (
                    <button
                      key={color.name}
                      type="button"
                      title={color.name}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedColor(color.name);
                      }}
                      className={`w-5 h-5 rounded-full border transition-all flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'ring-2 ring-[#d4af37] scale-110 border-white'
                          : 'border-white/20 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {isSelected && (
                        <Check
                          className={`w-3 h-3 ${
                            ['#ffffff', '#f8f6f0', '#f2ede0', '#e6dcbe', '#ebe5d3', '#bad1bf', '#8ca9c7'].includes(color.hex.toLowerCase())
                              ? 'text-black'
                              : 'text-white'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
                {product.colors.length > 8 && (
                  <span className="text-[10px] text-[#d4af37] font-semibold bg-[#1a1c26] px-1.5 py-0.5 rounded border border-[#2b2d3c]">
                    +{product.colors.length - 8} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Direct Action Buttons */}
        <div className="mt-4 pt-3 border-t border-[#1e2029] grid grid-cols-2 gap-2">
          <button
            onClick={handleAddToCart}
            className="w-full py-2 px-2.5 rounded-lg bg-[#1a1c24] hover:bg-[#252834] border border-[#2d303e] text-xs font-semibold text-neutral-200 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Add to Cart</span>
          </button>

          <button
            onClick={handleWhatsAppOrder}
            className="w-full py-2 px-2.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-xs font-semibold text-emerald-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
