import React from 'react';
import { CheckCircle2, ArrowRight, LayoutDashboard, Truck, Package, Clock, MapPin } from 'lucide-react';
import { Order } from '../types';
import { ProductVisual } from './ProductVisual';
import { BabiesTouchLogo } from './BabiesTouchLogo';

interface OrderConfirmationViewProps {
  order: Order;
  onReturnToStore: () => void;
  onViewInAdmin: () => void;
}

export const OrderConfirmationView: React.FC<OrderConfirmationViewProps> = ({
  order,
  onReturnToStore,
  onViewInAdmin,
}) => {
  return (
    <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-12">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E6E4DF] shadow-xs p-4 sm:p-10 md:p-12 space-y-6 sm:space-y-8">
        {/* Header confirmation */}
        <div className="text-center max-w-lg mx-auto space-y-3">
          <div className="flex justify-center pb-2">
            <BabiesTouchLogo size="md" showWordmark={true} showLocation={true} locationText="Main Market, Onitsha" />
          </div>
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#E6ECE3] text-[#2E5A36] flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <span className="text-xs uppercase tracking-widest text-[#2E5A36] font-semibold">
            Order #{order.id} Confirmed
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#171717]">
            Thank you, {order.customerName.split(' ')[0]}.
          </h1>
          <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
            We have received your order. Our Babies Touch atelier tailors at <strong>Main Market, Onitsha</strong> will carefully prepare, steam, and package your children's pieces in our signature keepsake box for dispatch.
          </p>
        </div>

        {/* Status Timeline */}
        <div className="p-4 sm:p-6 rounded-2xl bg-[#F9F9F7] border border-[#E6E4DF]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#2E5A36] text-white flex items-center justify-center text-xs font-semibold mb-1.5 sm:mb-2">
                ✓
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-[#171717]">Payment Verified</span>
              <span className="text-[10px] sm:text-[11px] text-[#737373]">{order.date}</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#E6ECE3] text-[#2E5A36] flex items-center justify-center text-xs font-semibold mb-1.5 sm:mb-2 ring-2 ring-[#2E5A36]">
                <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-[#171717]">Atelier Steaming & Boxing</span>
              <span className="text-[10px] sm:text-[11px] text-[#2E5A36] font-medium">In Progress</span>
            </div>

            <div className="flex flex-col items-center opacity-60">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-[#E6E4DF] text-[#737373] flex items-center justify-center text-xs font-semibold mb-1.5 sm:mb-2">
                <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-[#171717]">Courier Dispatch</span>
              <span className="text-[10px] sm:text-[11px] text-[#737373]">Est. 1-2 days</span>
            </div>

            <div className="flex flex-col items-center opacity-60">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-[#E6E4DF] text-[#737373] flex items-center justify-center text-xs font-semibold mb-1.5 sm:mb-2">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-[#171717]">Doorstep Delivery</span>
              <span className="text-[10px] sm:text-[11px] text-[#737373]">Scheduled</span>
            </div>
          </div>
        </div>

        {/* Order Details & Items in Naira */}
        <div className="border-t border-[#E6E4DF] pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#737373] mb-3">
              Delivery Destination
            </h3>
            <p className="text-xs text-[#171717] font-medium">{order.customerName}</p>
            <p className="text-xs text-[#737373]">{order.address}</p>
            <p className="text-xs text-[#737373]">
              {order.city}, {order.postalCode}
            </p>
            <p className="text-xs text-[#737373]">{order.country}</p>
            <p className="text-xs text-[#737373] mt-2">
              Dispatch updates sent to: <strong className="text-[#171717]">{order.email}</strong>
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#737373] mb-3">
              Ordered Pieces ({order.items.length})
            </h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#F7F6F2] border border-[#E6E4DF] shrink-0 p-0.5 flex items-center justify-center">
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
              <div className="pt-2 border-t border-[#E6E4DF] flex justify-between text-xs font-semibold text-[#171717]">
                <span>Total Paid</span>
                <span className="tabular-nums">₦{Math.round(order.total).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="pt-4 border-t border-[#E6E4DF] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          <button
            onClick={onReturnToStore}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#171717] text-white text-xs font-semibold hover:bg-[#2C2C2C] transition-colors"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onViewInAdmin}
            className="hidden md:inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#F4F3EF] hover:bg-[#EAE8E1] border border-[#E6E4DF] text-[#171717] text-xs font-semibold transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#2E5A36]" />
            <span>Inspect Order in Admin Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
