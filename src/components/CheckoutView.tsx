import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { CartItem, Order } from '../types';
import { ProductVisual } from './ProductVisual';
import { BabiesTouchLogo } from './BabiesTouchLogo';

interface CheckoutViewProps {
  items: CartItem[];
  discountRate: number;
  onBackToStore: () => void;
  onOrderPlaced: (order: Order) => void;
}

type DeliverySpeed = 'standard' | 'express' | 'white-glove';
type PaymentMethod = 'card' | 'apple-pay' | 'klarna';

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  items,
  discountRate,
  onBackToStore,
  onOrderPlaced,
}) => {
  // Form fields
  const [email, setEmail] = useState('folake.adeleke@lagosluxury.ng');
  const [phone, setPhone] = useState('+234 803 456 7890');
  const [firstName, setFirstName] = useState('Folake');
  const [lastName, setLastName] = useState('Adeleke');
  const [address, setAddress] = useState('14 Alexander Avenue, Ikoyi');
  const [city, setCity] = useState('Lagos');
  const [country, setCountry] = useState('Nigeria');
  const [postalCode, setPostalCode] = useState('101233');
  const [deliverySpeed, setDeliverySpeed] = useState<DeliverySpeed>('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [notes, setNotes] = useState('Please pack in the luxury pink celebration box for 3rd birthday gala.');

  // Card fields
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 5399');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvc, setCardCvc] = useState('941');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discountAmount = subtotal * discountRate;

  const deliveryCostMap: Record<DeliverySpeed, number> = {
    standard: subtotal >= 100000 ? 0 : 5000,
    express: 12000,
    'white-glove': 25000,
  };
  const shippingCost = deliveryCostMap[deliverySpeed];
  const tax = (subtotal - discountAmount) * 0.05;
  const total = Math.max(0, subtotal - discountAmount + shippingCost + tax);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder: Order = {
        id: `BT-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: `${firstName} ${lastName}`.trim() || 'Valued Client',
        email,
        phone,
        address,
        city,
        country,
        postalCode,
        items,
        subtotal,
        shippingCost,
        tax,
        discount: discountAmount,
        total,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        timestamp: Date.now(),
        status: 'Paid',
        deliverySpeed,
        paymentMethod,
        notes,
      };

      onOrderPlaced(newOrder);
      setIsSubmitting(false);
    }, 900);
  };

  return (
    <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10 py-5 sm:py-8">
      {/* Return Navigation */}
      <button
        onClick={onBackToStore}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#737373] hover:text-[#171717] transition-colors mb-5 sm:mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Boutique</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
        {/* Left Column: Form Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8">
          <div className="flex items-center gap-3 sm:gap-3.5">
            <BabiesTouchLogo size="md" />
            <div>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#737373] font-semibold">
                Babies Touch Checkout
              </span>
              <h1 className="text-xl sm:text-3xl font-serif font-bold text-[#171717] mt-0.5">
                Delivery & Payment
              </h1>
              <p className="text-xs text-[#737373] mt-0.5 flex items-center gap-1.5 flex-wrap">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2E5A36]" />
                <span>Flagship: <strong>Main Market, Onitsha</strong></span>
                <span className="text-[#A39E93]">·</span>
                <span>Encrypted 256-bit checkout</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmitOrder} className="space-y-6 sm:space-y-8">
            {/* 1. Contact Information */}
            <div className="bg-white p-4 sm:p-7 rounded-2xl sm:rounded-3xl border border-[#E6E4DF] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#171717]">
                  1. Contact Information
                </h3>
                <span className="text-[11px] text-[#737373]">
                  Required for dispatch & fitting updates
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-[#737373] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E4DF] text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#737373] mb-1">
                    Mobile Phone (for delivery SMS)
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E4DF] text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Delivery Address */}
            <div className="bg-white p-4 sm:p-7 rounded-2xl sm:rounded-3xl border border-[#E6E4DF] shadow-xs space-y-4">
              <h3 className="text-sm font-semibold text-[#171717]">
                2. Delivery Destination
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-[#737373] mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E4DF] text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#737373] mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E4DF] text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-medium text-[#737373] mb-1">
                    Street Address & Apartment / Estate
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E4DF] text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#737373] mb-1">
                    City / State
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E4DF] text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#737373] mb-1">
                    Postal Code / Landmark
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E4DF] text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-medium text-[#737373] mb-1">
                    Country
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E4DF] text-xs text-[#171717] bg-white focus:outline-none focus:border-[#171717]"
                  >
                    <option value="Nigeria">Nigeria</option>
                    <option value="Ghana">Ghana</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Delivery Speed Selection Cards in Naira */}
            <div className="bg-white p-4 sm:p-7 rounded-2xl sm:rounded-3xl border border-[#E6E4DF] shadow-xs space-y-4">
              <h3 className="text-sm font-semibold text-[#171717]">
                3. Delivery Method
              </h3>

              <div className="space-y-3">
                {/* Standard */}
                <label
                  onClick={() => setDeliverySpeed('standard')}
                  className={`flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    deliverySpeed === 'standard'
                      ? 'border-[#171717] bg-[#F4F3EF] ring-1 ring-[#171717]'
                      : 'border-[#E6E4DF] bg-white hover:border-[#D0CECB]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="deliverySpeed"
                      checked={deliverySpeed === 'standard'}
                      onChange={() => setDeliverySpeed('standard')}
                      className="mt-1"
                    />
                    <div>
                      <div className="text-xs font-semibold text-[#171717]">
                        Standard Nationwide Courier
                      </div>
                      <p className="text-[11px] text-[#737373] mt-0.5">
                        Delivered in 2–4 business days in signature protective keepsake box.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#2E5A36]">
                    {subtotal >= 100000 ? 'Free' : '₦5,000'}
                  </span>
                </label>

                {/* Express */}
                <label
                  onClick={() => setDeliverySpeed('express')}
                  className={`flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    deliverySpeed === 'express'
                      ? 'border-[#171717] bg-[#F4F3EF] ring-1 ring-[#171717]'
                      : 'border-[#E6E4DF] bg-white hover:border-[#D0CECB]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="deliverySpeed"
                      checked={deliverySpeed === 'express'}
                      onChange={() => setDeliverySpeed('express')}
                      className="mt-1"
                    />
                    <div>
                      <div className="text-xs font-semibold text-[#171717]">
                        Express Same-Day / Priority Air
                      </div>
                      <p className="text-[11px] text-[#737373] mt-0.5">
                        Priority courier dispatch with live tracking (Lagos & Abuja priority).
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#171717] tabular-nums">
                    ₦12,000
                  </span>
                </label>

                {/* VIP White Glove Fitting */}
                <label
                  onClick={() => setDeliverySpeed('white-glove')}
                  className={`flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    deliverySpeed === 'white-glove'
                      ? 'border-[#171717] bg-[#F4F3EF] ring-1 ring-[#171717]'
                      : 'border-[#E6E4DF] bg-white hover:border-[#D0CECB]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="deliverySpeed"
                      checked={deliverySpeed === 'white-glove'}
                      onChange={() => setDeliverySpeed('white-glove')}
                      className="mt-1"
                    />
                    <div>
                      <div className="text-xs font-semibold text-[#171717]">
                        VIP In-Home Fitting & Monogrammed Box
                      </div>
                      <p className="text-[11px] text-[#737373] mt-0.5">
                        Dedicated concierge hand-delivery, dress steaming, and fit verification.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#171717] tabular-nums">
                    ₦25,000
                  </span>
                </label>
              </div>

              {/* Special Delivery Notes */}
              <div className="pt-2">
                <label className="block text-[11px] font-medium text-[#737373] mb-1">
                  Event Date or Custom Monogram Notes (optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Birthday is Saturday; please include gift card for Princess Nicole"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E6E4DF] text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
                />
              </div>
            </div>

            {/* 4. Payment Method */}
            <div className="bg-white p-4 sm:p-7 rounded-2xl sm:rounded-3xl border border-[#E6E4DF] shadow-xs space-y-4">
              <h3 className="text-sm font-semibold text-[#171717]">
                4. Payment Details
              </h3>

              {/* Payment Tabs */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#171717] bg-[#F4F3EF] text-[#171717] font-semibold'
                      : 'border-[#E6E4DF] bg-white text-[#737373]'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Debit / Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple-pay')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'apple-pay'
                      ? 'border-[#171717] bg-[#F4F3EF] text-[#171717] font-semibold'
                      : 'border-[#E6E4DF] bg-white text-[#737373]'
                  }`}
                >
                  <span>Bank Transfer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('klarna')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'klarna'
                      ? 'border-[#171717] bg-[#F4F3EF] text-[#171717] font-semibold'
                      : 'border-[#E6E4DF] bg-white text-[#737373]'
                  }`}
                >
                  <span>Apple Pay</span>
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-medium text-[#737373] mb-1">
                      Card Number (Mastercard / Visa / Verve)
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E4DF] text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-medium text-[#737373] mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E4DF] text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#737373] mb-1">
                        Security CVV
                      </label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E4DF] text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'apple-pay' && (
                <div className="p-4 rounded-2xl bg-[#F9F9F7] text-xs text-[#737373] text-center border border-[#E6E4DF]">
                  Instant direct bank transfer option via GTBank / Zenith / Access. Virtual account will be displayed upon clicking "Place Order".
                </div>
              )}

              {paymentMethod === 'klarna' && (
                <div className="p-4 rounded-2xl bg-[#FDFBF7] text-xs text-[#737373] border border-[#E6E4DF]">
                  Confirm securely with Face ID or Touch ID on your Apple device.
                </div>
              )}
            </div>

            {/* Submit Action for Mobile */}
            <div className="lg:hidden">
              <button
                type="submit"
                disabled={isSubmitting || items.length === 0}
                className="w-full py-4 px-6 rounded-full bg-[#171717] text-white font-semibold text-xs hover:bg-[#2C2C2C] active:scale-98 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {isSubmitting ? (
                  <span>Authorizing Order...</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Place Order · ₦{Math.round(total).toLocaleString()}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Sticky Order Summary in Naira (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <div className="bg-white p-4 sm:p-7 rounded-2xl sm:rounded-3xl border border-[#E6E4DF] shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E6E4DF]">
              <h2 className="text-base font-serif font-bold text-[#171717]">
                Order Summary
              </h2>
              <span className="text-xs text-[#737373]">
                {items.reduce((sum, i) => sum + i.quantity, 0)} items
              </span>
            </div>

            {/* Items scroll */}
            <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-[#F7F6F2] border border-[#E6E4DF] shrink-0 p-1 flex items-center justify-center">
                    <ProductVisual
                      product={item.product}
                      activeSwatch={item.selectedSwatch}
                      className="p-0.5"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-[#171717] truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-[#737373]">
                      {item.selectedSwatch.name} · Qty {item.quantity}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#171717] tabular-nums">
                    ₦{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations in Naira */}
            <div className="pt-4 border-t border-[#E6E4DF] space-y-2 text-xs text-[#737373]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#171717] font-medium tabular-nums">
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>
              {discountRate > 0 && (
                <div className="flex justify-between text-[#2E5A36]">
                  <span>Atelier Promo Discount (10%)</span>
                  <span className="font-medium tabular-nums">
                    -₦{discountAmount.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping ({deliverySpeed})</span>
                <span className="text-[#171717] font-medium tabular-nums">
                  {shippingCost === 0 ? 'Complimentary' : `₦${shippingCost.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated VAT / Tax (5%)</span>
                <span className="text-[#171717] font-medium tabular-nums">
                  ₦{Math.round(tax).toLocaleString()}
                </span>
              </div>
              <div className="pt-3 border-t border-[#E6E4DF] flex items-baseline justify-between text-base text-[#171717] font-bold">
                <span>Total Due</span>
                <span className="text-xl tabular-nums">₦{Math.round(total).toLocaleString()}</span>
              </div>
            </div>

            {/* Place Order Primary Action */}
            <button
              onClick={handleSubmitOrder}
              disabled={isSubmitting || items.length === 0}
              className="w-full py-4 px-6 rounded-full bg-[#171717] text-white font-semibold text-xs hover:bg-[#2C2C2C] active:scale-98 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing Payment...</span>
                </span>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Place Order · ₦{Math.round(total).toLocaleString()}</span>
                </>
              )}
            </button>

            {/* Assurance */}
            <div className="space-y-1.5 pt-2 text-[11px] text-[#737373]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2E5A36]" />
                <span>Complimentary size exchange within 14 days</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2E5A36]" />
                <span>100% skin-safe hypoallergenic organic lining guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
