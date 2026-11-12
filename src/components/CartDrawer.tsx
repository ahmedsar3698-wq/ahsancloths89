import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, MessageCircle, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CheckoutModal } from './CheckoutModal';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    clearCart,
    settings,
    openProductDetails,
  } = useStore();

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  if (!isCartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm transition-opacity">
        <div className="fixed inset-y-0 right-0 max-w-md w-full bg-[#101116] border-l border-[#22242e] shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-[#20222a] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
              <h2 className="font-display font-bold text-base text-white">
                Your Shopping Bag ({cart.length})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-[#1a1c24] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Banner inside Bag */}
          <div className="bg-[#181a24] px-5 py-2.5 border-b border-[#242632] flex items-center gap-2 text-xs text-neutral-200">
            <Truck className="w-4 h-4 text-[#d4af37] shrink-0" />
            <span>
              <strong className="text-[#d4af37]">Karachi Delivery:</strong> 100% Free on all orders!
            </span>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#181a22] border border-[#2b2d38] flex items-center justify-center mx-auto text-neutral-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-white text-base">
                  Your bag is currently empty
                </h3>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                  Explore our premium wash & wear, pure cotton, and unstitched suit collections.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-lg bg-[#d4af37] text-black font-bold text-xs hover:bg-[#e4c04e] transition-colors"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-[#15161d] border border-[#232530] flex gap-3 relative group"
                >
                  <img
                    src={
                      item.product?.thumbnail ||
                      (Array.isArray(item.product?.images) && item.product.images[0]) ||
                      '/src/assets/images/fabric_washing_wear_1794488410986.jpg'
                    }
                    alt={item.product?.name || 'Suit Fabric'}
                    className="w-20 h-20 object-cover rounded-lg bg-[#1e202a] shrink-0 cursor-pointer"
                    onClick={() => {
                      if (item.product?.id) {
                        openProductDetails(item.product.id);
                        setIsCartOpen(false);
                      }
                    }}
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          onClick={() => {
                            if (item.product?.id) {
                              openProductDetails(item.product.id);
                              setIsCartOpen(false);
                            }
                          }}
                          className="font-display font-bold text-xs text-white line-clamp-1 cursor-pointer hover:text-[#d4af37] transition-colors"
                        >
                          {item.product?.name || 'Unstitched Suit'}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Color: <strong className="text-neutral-200">{item.selectedColor}</strong>
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1e2028]">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-[#2b2d38] rounded-md bg-[#111218]">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-neutral-300 hover:text-white"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-bold text-white tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-neutral-300 hover:text-white"
                        >
                          +
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <span className="text-xs font-bold text-[#d4af37] tabular-nums">
                        Rs. {((item.product?.price || 2500) * (item.quantity || 1)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Action Buttons */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#20222a] bg-[#121319] space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal:</span>
                  <span className="font-bold text-white tabular-nums">
                    Rs. {cartSubtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Karachi Delivery:</span>
                  <span className="text-emerald-400 font-semibold">FREE</span>
                </div>
                <div className="pt-2 border-t border-[#20222a] flex justify-between text-sm font-bold">
                  <span className="text-white">Estimated Total:</span>
                  <span className="text-[#d4af37] tabular-nums">
                    Rs. {cartSubtotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setIsCheckoutModalOpen(true)}
                  className="w-full py-3.5 px-4 rounded-lg bg-[#d4af37] hover:bg-[#e4c04e] text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsCheckoutModalOpen(true)}
                  className="w-full py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order Entire Bag on WhatsApp</span>
                </button>
              </div>

              <button
                onClick={clearCart}
                className="w-full text-center text-[11px] text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                Clear shopping bag
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => {
          setIsCheckoutModalOpen(false);
          setIsCartOpen(false);
        }}
      />
    </>
  );
};
