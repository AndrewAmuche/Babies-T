import React, { useState } from 'react';
import {
  X,
  Package,
  Truck,
  Printer,
  CheckCircle,
  Clock,
  ShieldCheck,
  CreditCard,
  MapPin,
  Mail,
  Phone,
  FileText,
} from 'lucide-react';
import { Order } from '../../types';
import { adminStorage } from '../../services/adminStorage';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdated: (orderId: string, newStatus: Order['status']) => void;
  onOpenPrintSlip: (order: Order) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
  onStatusUpdated,
  onOpenPrintSlip,
}) => {
  if (!isOpen || !order) return null;

  const [currentStatus, setCurrentStatus] = useState<Order['status']>(order.status);
  const [internalNote, setInternalNote] = useState(order.internalNotes || '');
  const [noteSaved, setNoteSaved] = useState(false);

  const handleStatusChange = (newStatus: Order['status']) => {
    setCurrentStatus(newStatus);
    onStatusUpdated(order.id, newStatus);
  };

  const handleSaveNote = () => {
    adminStorage.updateOrderStatus(order.id, currentStatus, internalNote);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl border border-[#E6E4DF] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E6E4DF] flex items-center justify-between bg-white shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#E0218A]">
                Order {order.id}
              </span>
              <span className="text-xs text-[#737373]">·</span>
              <span className="text-xs text-[#737373]">{order.date}</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-[#171717] mt-0.5">
              Fulfilment & Client Order Record
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenPrintSlip(order)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#FAF9F6] border border-[#E6E4DF] hover:bg-[#F4F3EF] flex items-center gap-1.5 cursor-pointer text-[#171717]"
              title="Print Packing Slip"
            >
              <Printer className="w-3.5 h-3.5 text-[#E0218A]" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#737373] hover:text-[#171717] hover:bg-[#F4F3EF] rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Status & Delivery Banner */}
          <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E6E4DF] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[#737373] font-medium">Fulfilment Status:</span>
              <select
                value={currentStatus}
                onChange={(e) => handleStatusChange(e.target.value as Order['status'])}
                className="px-3 py-1.5 rounded-full text-xs font-bold bg-white border border-[#E6E4DF] text-[#171717] cursor-pointer shadow-2xs"
              >
                <option value="Paid">Paid (Pending Dispatch)</option>
                <option value="Packing">Packing in Atelier</option>
                <option value="Shipped">Dispatched / Shipped</option>
                <option value="Completed">Completed & Delivered</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-[#2E5A36] bg-[#E8EFE8] px-3 py-1.5 rounded-full">
              <Truck className="w-3.5 h-3.5" />
              <span>Speed: {order.deliverySpeed.toUpperCase()}</span>
            </div>
          </div>

          {/* Customer & Address Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-[#E6E4DF] bg-white space-y-2">
              <h4 className="font-semibold text-sm text-[#171717] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#E0218A]" />
                <span>Shipping Destination</span>
              </h4>
              <p className="font-medium text-[#171717]">{order.customerName}</p>
              <p className="text-[#737373]">{order.address}</p>
              <p className="text-[#737373]">
                {order.city}, {order.postalCode} · {order.country}
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-[#E6E4DF] bg-white space-y-2">
              <h4 className="font-semibold text-sm text-[#171717] flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-[#E0218A]" />
                <span>Payment & Contact</span>
              </h4>
              <p className="text-[#737373] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>{order.email}</span>
              </p>
              <p className="text-[#737373] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>{order.phone}</span>
              </p>
              <p className="text-[11px] text-[#737373]">
                Method: {order.paymentMethod.toUpperCase()} · Ref: {order.transactionRef || order.id}
              </p>
            </div>
          </div>

          {/* Purchased Items with Exact Variation and Assigned Photo */}
          <div>
            <h4 className="font-serif font-bold text-sm text-[#171717] mb-3">
              Items Purchased & Specific Variations ({order.items.length})
            </h4>

            <div className="border border-[#E6E4DF] rounded-2xl overflow-hidden divide-y divide-[#E6E4DF] bg-white">
              {order.items.map((item, idx) => {
                const variationImage =
                  item.selectedVariation?.imageUrl ||
                  item.selectedSwatch.imageUrl ||
                  item.product.imageUrl;

                const variationSku =
                  item.selectedVariation?.sku || item.product.sku;

                return (
                  <div key={idx} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-14 h-14 rounded-xl border border-[#E6E4DF] overflow-hidden bg-[#FAF9F6] shrink-0">
                        <img
                          src={variationImage}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-semibold text-[#171717] truncate">
                          {item.product.name}
                        </h5>
                        <div className="flex items-center gap-2 text-[11px] text-[#737373] mt-0.5">
                          <span className="font-semibold text-[#E0218A]">
                            Colour: {item.selectedSwatch.name}
                          </span>
                          <span>·</span>
                          <span>Size: {item.selectedSize || '1-2Y'}</span>
                          {variationSku && (
                            <>
                              <span>·</span>
                              <span className="font-mono">{variationSku}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-bold text-sm text-[#171717] tabular-nums">
                        ₦{((item.selectedVariation?.price || item.product.price) * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-[11px] text-[#737373]">
                        {item.quantity} × ₦{(item.selectedVariation?.price || item.product.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E6E4DF] space-y-1.5">
            <div className="flex justify-between text-[#737373]">
              <span>Subtotal:</span>
              <span className="font-medium text-[#171717] tabular-nums">
                ₦{order.subtotal.toLocaleString()}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Promotional Discount:</span>
                <span className="font-medium tabular-nums">-₦{order.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-[#737373]">
              <span>White-Glove Shipping & Packaging:</span>
              <span className="font-medium text-[#171717] tabular-nums">
                {order.shippingCost === 0 ? 'Complimentary' : `₦${order.shippingCost.toLocaleString()}`}
              </span>
            </div>
            <div className="pt-2 border-t border-[#E6E4DF] flex justify-between text-sm font-bold text-[#171717]">
              <span>Total Paid:</span>
              <span className="tabular-nums">₦{order.total.toLocaleString()}</span>
            </div>
          </div>

          {/* Internal Notes Section */}
          <div className="p-4 rounded-2xl border border-[#E6E4DF] bg-white space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-xs text-[#171717] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#737373]" />
                <span>Internal Atelier Notes (Staff Only)</span>
              </label>
              {noteSaved && (
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </span>
              )}
            </div>
            <textarea
              rows={2}
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              placeholder="e.g. VIP client requested bespoke silk bow gift tag with initials 'FA'..."
              className="w-full px-3 py-2 rounded-xl border border-[#E6E4DF] text-xs text-[#171717] focus:outline-none focus:border-[#E0218A]"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveNote}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#171717] hover:bg-black text-white cursor-pointer"
              >
                Save Internal Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
