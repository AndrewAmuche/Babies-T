import React, { useState } from 'react';
import { X, Minus, Plus, Trash2, ArrowRight, ShieldCheck, Tag, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';
import { ProductVisual } from './ProductVisual';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
  discountRate: number;
  onApplyPromoCode: (code: string) => boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  discountRate,
  onApplyPromoCode,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; success: boolean } | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const FREE_SHIPPING_THRESHOLD = 100000; // ₦100,000 threshold
  const progressToFreeShipping = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const discountAmount = subtotal * discountRate;
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 5000;
  const estimatedTax = (subtotal - discountAmount) * 0.05;
  const total = Math.max(0, subtotal - discountAmount + shipping + estimatedTax);

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = onApplyPromoCode(promoInput.trim().toUpperCase());
    if (success) {
      setPromoMessage({ text: 'Promo code BABIESTOUCH (10% off) applied', success: true });
    } else {
      setPromoMessage({ text: 'Invalid promo code. Try "BABIESTOUCH"', success: false });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-md bg-[#FFFFFF] border-l border-[#E6E4DF] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-[#E6E4DF] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#171717]" />
              <h2 className="text-base sm:text-lg font-serif font-bold text-[#171717]">
                Your Shopping Bag
              </h2>
              <span className="text-xs text-[#737373] font-medium">
                ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-full text-[#737373] hover:text-[#171717] hover:bg-[#F4F3EF] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress bar in Naira */}
          <div className="px-4 sm:px-6 py-3 sm:py-3.5 bg-[#F9F9F7] border-b border-[#E6E4DF] text-xs">
            {amountNeeded > 0 ? (
              <p className="text-[#737373] mb-1.5">
                Add <strong className="text-[#171717] font-semibold">₦{amountNeeded.toLocaleString()}</strong> more to unlock <span className="text-[#2E5A36] font-medium">Free Delivery</span>
              </p>
            ) : (
              <p className="text-[#2E5A36] font-medium mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Complimentary Delivery Unlocked!</span>
              </p>
            )}
            <div className="w-full bg-[#E6E4DF] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#2E5A36] h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-[#E6E4DF]">
            {items.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-[#F4F3EF] flex items-center justify-center mb-3">
                  <ShoppingBag className="w-6 h-6 text-[#737373]" />
                </div>
                <h3 className="text-base font-serif font-semibold text-[#171717]">
                  Your bag is empty
                </h3>
                <p className="text-xs text-[#737373] mt-1 max-w-xs leading-relaxed">
                  Discover our charming collection of children's ball dresses, gowns, artisanal shoes, and everyday clothing.
                </p>
                <button
                  onClick={onClose}
                  className="mt-5 px-6 py-2.5 rounded-full bg-[#171717] text-white text-xs font-semibold hover:bg-black transition-colors"
                >
                  Discover Collection
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4 items-start">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#F7F6F2] border border-[#E6E4DF] shrink-0 p-1 flex items-center justify-center">
                    <ProductVisual
                      product={item.product}
                      activeSwatch={item.selectedSwatch}
                      className="p-1"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-semibold text-[#171717] truncate">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-[#A39E93] hover:text-red-600 transition-colors p-1"
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Selected finish */}
                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#737373]">
                      <span
                        className="w-2 h-2 rounded-full border border-black/15 shrink-0"
                        style={{ backgroundColor: item.selectedSwatch.hex }}
                      />
                      <span>{item.selectedSwatch.name}</span>
                    </div>

                    {/* Price and Live Quantity Steppers */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center bg-[#F4F3EF] border border-[#E6E4DF] rounded-full px-2 py-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="p-1 text-[#737373] hover:text-[#171717]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-[#171717] tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-1 text-[#737373] hover:text-[#171717]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-semibold text-[#171717] tabular-nums">
                        ₦{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Trigger */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-[#E6E4DF] bg-[#FFFFFF] shrink-0 space-y-4">
              {/* Promo code input */}
              <form onSubmit={handlePromoSubmit} className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-[#737373] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo code (try BABIESTOUCH)"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-[#F9F9F7] border border-[#E6E4DF] rounded-xl text-[#171717] placeholder:text-[#A39E93] focus:outline-none focus:border-[#171717]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-medium rounded-xl border border-[#E6E4DF] bg-[#F4F3EF] text-[#171717] hover:bg-[#EAE8E1] transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p
                    className={`text-[11px] ${
                      promoMessage.success ? 'text-[#2E5A36]' : 'text-red-600'
                    }`}
                  >
                    {promoMessage.text}
                  </p>
                )}
              </form>

              {/* Subtotal calculation in Naira */}
              <div className="space-y-1.5 text-xs text-[#737373] pt-2 border-t border-[#E6E4DF]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#171717] tabular-nums">
                    ₦{subtotal.toLocaleString()}
                  </span>
                </div>
                {discountRate > 0 && (
                  <div className="flex justify-between text-[#2E5A36]">
                    <span>Atelier Special (10%)</span>
                    <span className="font-medium tabular-nums">
                      -₦{discountAmount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="font-medium text-[#171717]">
                    {shipping === 0 ? 'Complimentary' : `₦${shipping.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="font-medium text-[#171717] tabular-nums">
                    ₦{Math.round(estimatedTax).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#E6E4DF] text-sm text-[#171717] font-semibold">
                  <span>Total</span>
                  <span className="tabular-nums">₦{Math.round(total).toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Trigger */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 px-6 rounded-full bg-[#171717] text-white hover:bg-[#2C2C2C] active:scale-98 transition-all font-semibold text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
