import React, { useState } from 'react';
import { X, CheckCircle2, Truck, MessageCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../context/StoreContext';
import { OrderItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const {
    cart,
    cartSubtotal,
    settings,
    clearCart,
    createOrder,
    generateWhatsAppLink,
  } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [city, setCity] = useState('Karachi');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  if (!isOpen) return null;

  const isKarachi = city.trim().toLowerCase().includes('karachi');
  const deliveryFee = isKarachi ? 0 : settings.standardDeliveryFee;
  const grandTotal = cartSubtotal + deliveryFee;

  const orderItems: OrderItem[] = cart.map((item) => ({
    productId: item.product?.id || `prod-${Date.now()}`,
    productName: item.product?.name || 'Unstitched Suit',
    color: item.selectedColor || 'Default',
    quantity: item.quantity || 1,
    unitPrice: item.product?.price || 2500,
    totalPrice: (item.product?.price || 2500) * (item.quantity || 1),
    image:
      item.product?.thumbnail ||
      (Array.isArray(item.product?.images) && item.product.images[0]) ||
      '/src/assets/images/fabric_washing_wear_1794488410986.jpg',
  }));

  const handlePlaceOrder = (channel: 'WhatsApp' | 'Website COD') => {
    if (!customerName.trim() || !whatsappNumber.trim() || !address.trim()) {
      alert('Please fill in your Customer Name, WhatsApp Number, and Complete Delivery Address.');
      return;
    }

    setIsSubmitting(true);

    const newOrder = createOrder({
      customerName,
      whatsappNumber,
      city,
      address,
      notes,
      items: orderItems,
      subtotal: cartSubtotal,
      deliveryFee,
      totalAmount: grandTotal,
      orderChannel: channel,
    });

    // Fire luxury celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#ffffff', '#10b981'],
      });
    } catch (e) {
      // ignore
    }

    setConfirmedOrderId(newOrder.id);
    setIsSubmitting(false);

    if (channel === 'WhatsApp') {
      // Build summary of all items
      const itemsSummary = cart
        .map(
          (c) =>
            `• ${c.product?.name || 'Suit'} (${c.selectedColor || 'Shade'}) x ${c.quantity || 1} = Rs. ${(
              (c.product?.price || 2500) * (c.quantity || 1)
            ).toLocaleString()}`
        )
        .join('\n');

      const message = `السلام علیکم! Assalam-o-Alaikum AL HAFIZ CLOTHS,

I would like to place an order from your website:

📦 *Order #${newOrder.id} Summary:*
${itemsSummary}

💰 *Financials:*
• Subtotal: Rs. ${cartSubtotal.toLocaleString()}
• Delivery to ${city}: ${isKarachi ? 'FREE DELIVERY IN KARACHI' : `Rs. ${deliveryFee}`}
• *Grand Total: Rs. ${grandTotal.toLocaleString()}*

👤 *Customer Details:*
• Name: ${customerName}
• WhatsApp: ${whatsappNumber}
• City: ${city}
• Complete Address: ${address}
${notes ? `• Special Instructions: ${notes}` : ''}

Please confirm receipt and dispatch schedule. Thank you!`;

      const encoded = encodeURIComponent(message);
      const waUrl = `https://wa.me/${settings.whatsappNumber}?text=${encoded}`;
      window.open(waUrl, '_blank');
    }

    clearCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#111217] border border-[#262835] rounded-2xl shadow-2xl p-6 sm:p-8 text-white my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-[#1c1d25] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedOrderId ? (
          /* Success Screen */
          <div className="text-center py-8 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                ORDER CONFIRMED
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
                Thank You, {customerName}!
              </h2>
              <p className="text-sm text-neutral-400 mt-2">
                Your order <strong className="text-white">#{confirmedOrderId}</strong> has been registered in the AL HAFIZ CLOTHS portal.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#171822] border border-[#2b2d3c] max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-400">Delivery Destination:</span>
                <span className="font-bold text-white">{city} ({isKarachi ? 'Free Karachi Delivery' : 'Standard Rate'})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Total Payable:</span>
                <span className="font-bold text-[#d4af37] text-sm tabular-nums">Rs. {grandTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Payment Mode:</span>
                <span className="text-white">Cash on Delivery (COD)</span>
              </div>
            </div>

            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Our team in Karachi will call/WhatsApp you at <strong className="text-white">{whatsappNumber}</strong> before dispatching your package.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                  `Assalam-o-Alaikum, I just placed Order #${confirmedOrderId} for Rs. ${grandTotal}. Please confirm dispatch timing.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Track on WhatsApp</span>
              </a>

              <button
                onClick={onClose}
                className="px-6 py-3 rounded-lg bg-[#22242e] hover:bg-[#2c2f3d] text-white font-semibold text-xs transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <div>
            <div className="mb-6 pb-4 border-b border-[#232532]">
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                SECURE CHECKOUT
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
                Delivery & Contact Details
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Free Delivery in Karachi &middot; Cash on Delivery available across Pakistan
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Customer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Muhammad Ahmed"
                    className="w-full bg-[#161720] border border-[#2b2d3b] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    WhatsApp Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="0326-2444991 or +92300..."
                    className="w-full bg-[#161720] border border-[#2b2d3b] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    City / Destination *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#161720] border border-[#2b2d3b] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="Karachi">Karachi (FREE DELIVERY)</option>
                    <option value="Lahore">Lahore (Rs. 250 Delivery)</option>
                    <option value="Islamabad">Islamabad (Rs. 250 Delivery)</option>
                    <option value="Rawalpindi">Rawalpindi (Rs. 250 Delivery)</option>
                    <option value="Faisalabad">Faisalabad (Rs. 250 Delivery)</option>
                    <option value="Multan">Multan (Rs. 250 Delivery)</option>
                    <option value="Peshawar">Peshawar (Rs. 250 Delivery)</option>
                    <option value="Quetta">Quetta (Rs. 250 Delivery)</option>
                    <option value="Hyderabad">Hyderabad (Rs. 250 Delivery)</option>
                    <option value="Other City">Other City in Pakistan</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Delivery Status
                  </label>
                  <div className="flex items-center gap-2 p-2.5 bg-[#171922] border border-[#2b2d3a] rounded-lg text-xs">
                    <Truck className="w-4 h-4 text-[#d4af37]" />
                    <span className="font-semibold text-white">
                      {isKarachi ? (
                        <span className="text-emerald-400">FREE DELIVERY IN KARACHI</span>
                      ) : (
                        `Standard Delivery: Rs. ${deliveryFee}`
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Complete Street Address / House / Landmark *
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House / Flat #, Street, Sector / Area name, Nearest landmark..."
                  className="w-full bg-[#161720] border border-[#2b2d3b] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Order Notes (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Please deliver after 3 PM or call on arrival"
                  className="w-full bg-[#161720] border border-[#2b2d3b] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* Order Summary Table */}
              <div className="p-4 rounded-xl bg-[#171822] border border-[#282a38] space-y-2 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Items Subtotal ({cart.length} suit varieties):</span>
                  <span className="font-medium text-white tabular-nums">Rs. {cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Shipping Fee:</span>
                  <span className={`font-semibold ${isKarachi ? 'text-emerald-400' : 'text-white'}`}>
                    {isKarachi ? 'FREE (Karachi Special)' : `Rs. ${deliveryFee}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#272936] flex justify-between text-sm font-bold">
                  <span className="text-white">Total Amount (COD):</span>
                  <span className="text-[#d4af37] tabular-nums">Rs. {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Dual Action Placement */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handlePlaceOrder('Website COD')}
                  className="py-3 px-4 rounded-lg bg-[#d4af37] hover:bg-[#e4c04e] text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <Truck className="w-4 h-4" />
                  <span>Place Order (Cash on Delivery)</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handlePlaceOrder('WhatsApp')}
                  className="py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Confirm on WhatsApp</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
