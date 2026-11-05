import React from 'react';
import { X, Printer, Package, Sparkles } from 'lucide-react';
import { Order } from '../../types';
import { BabiesTouchLogo } from '../BabiesTouchLogo';

interface OrderPackingSlipModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderPackingSlipModal: React.FC<OrderPackingSlipModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#E6E4DF] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Controls (Not printed) */}
        <div className="px-6 py-3 border-b border-[#E6E4DF] bg-[#FAF9F6] flex items-center justify-between shrink-0 print:hidden">
          <span className="text-xs font-semibold text-[#737373]">
            Printable Packing Slip & Atelier Certificate
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#E0218A] hover:bg-[#BE185D] text-white flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Packing Slip</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#737373] hover:text-[#171717] rounded-full hover:bg-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="flex-1 overflow-y-auto p-8 sm:p-12 text-[#171717] font-sans print:p-0 space-y-6">
          {/* Slip Header */}
          <div className="flex items-start justify-between border-b border-[#171717]/10 pb-6">
            <div className="flex items-start gap-4">
              <BabiesTouchLogo size="lg" />
              <div>
                <h1 className="font-serif text-2xl font-bold tracking-tight text-[#171717]">
                  BABIES TOUCH
                </h1>
                <p className="text-xs uppercase tracking-widest text-[#FA519B] font-semibold mt-0.5">
                  Simply Magical Children's Couture
                </p>
                <p className="text-[11px] text-[#737373] mt-1.5 leading-relaxed">
                  Flagship Boutique: <strong>Main Market, Onitsha</strong>, Anambra State, Nigeria<br />
                  WhatsApp / Inquiries: +234 803 123 4567 · babiestouchsupport@gmail.com
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#FCE7F3] text-[#BE185D] border border-[#FBCFE8]">
                Atelier Packing Slip
              </span>
              <p className="font-mono text-sm font-bold text-[#171717] mt-2">
                {order.id}
              </p>
              <p className="text-xs text-[#737373]">{order.date}</p>
            </div>
          </div>

          {/* Recipient Box */}
          <div className="grid grid-cols-2 gap-6 text-xs border border-[#E6E4DF] rounded-2xl p-4 bg-[#FAF9F6]">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-1">
                Dispatch To:
              </p>
              <p className="font-bold text-sm text-[#171717]">{order.customerName}</p>
              <p className="text-[#737373] mt-0.5">{order.address}</p>
              <p className="text-[#737373]">{order.city}, {order.country}</p>
              <p className="text-[#737373] mt-1">{order.phone} · {order.email}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-1">
                Fulfilment Protocol:
              </p>
              <p className="text-[#171717] font-semibold">
                Delivery: {order.deliverySpeed.toUpperCase()}
              </p>
              <p className="text-[#737373] mt-0.5">
                Packaging: Archival Acid-Free Keepsake Gift Box
              </p>
              <p className="text-[#737373] mt-0.5">
                Payment: VERIFIED ({order.paymentMethod.toUpperCase()})
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#171717]/20 text-[10px] uppercase tracking-wider text-[#737373]">
                <tr>
                  <th className="py-2.5">Item & Variation</th>
                  <th className="py-2.5">SKU</th>
                  <th className="py-2.5 text-center">Qty</th>
                  <th className="py-2.5 text-right">Price</th>
                  <th className="py-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E4DF]">
                {order.items.map((item, i) => (
                  <tr key={i}>
                    <td className="py-3">
                      <p className="font-semibold text-[#171717]">{item.product.name}</p>
                      <p className="text-[11px] text-[#737373]">
                        {item.selectedSwatch.name} · Size {item.selectedSize || '1-2Y'}
                      </p>
                    </td>
                    <td className="py-3 font-mono text-[10px] text-[#737373]">
                      {item.selectedVariation?.sku || item.product.sku || 'BT-VAR'}
                    </td>
                    <td className="py-3 text-center font-bold">{item.quantity}</td>
                    <td className="py-3 text-right tabular-nums">
                      ₦{(item.selectedVariation?.price || item.product.price).toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-bold tabular-nums">
                      ₦{((item.selectedVariation?.price || item.product.price) * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="border-t border-[#171717]/10 pt-4 flex justify-end">
            <div className="w-60 space-y-1 text-xs">
              <div className="flex justify-between text-[#737373]">
                <span>Subtotal:</span>
                <span className="tabular-nums">₦{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#737373]">
                <span>Packaging & Delivery:</span>
                <span>{order.shippingCost === 0 ? 'Complimentary' : `₦${order.shippingCost.toLocaleString()}`}</span>
              </div>
              <div className="pt-2 border-t border-[#171717]/10 flex justify-between font-bold text-sm text-[#171717]">
                <span>Total:</span>
                <span className="tabular-nums">₦{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Atelier Reassurance Note */}
          <div className="pt-6 border-t border-dashed border-[#E6E4DF] text-center text-[11px] text-[#737373] space-y-1">
            <p className="font-serif italic text-sm text-[#171717]">
              "Handcrafted with care for cherished childhood milestones."
            </p>
            <p>Every garment includes organic cotton linings for delicate baby skin.</p>
            <p className="text-[10px] text-[#A39E93]">
              Inspected and sealed by Babies Touch Quality Atelier · Thank you for your trust.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
