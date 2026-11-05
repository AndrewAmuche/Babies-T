import React, { useState } from 'react';
import {
  X,
  Star,
  Check,
  ChevronDown,
  Shield,
  Truck,
  RotateCcw,
  Minus,
  Plus,
  Share2,
} from 'lucide-react';
import { Product, ProductSwatch, ProductVariation } from '../types';
import { ProductVisual } from './ProductVisual';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    swatch: ProductSwatch,
    quantity: number,
    event?: React.MouseEvent,
    variation?: ProductVariation,
    size?: string
  ) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [activeSwatch, setActiveSwatch] = useState<ProductSwatch>(
    product.swatches[0]
  );
  const [selectedSize, setSelectedSize] = useState<string>('1-2Y');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('specs');

  // Find exact matching variation if product is variable
  const activeVariation: ProductVariation | undefined = product.variations?.find((v) => {
    const matchesColour =
      v.attributes?.Colour?.toLowerCase() === activeSwatch.name.toLowerCase() ||
      v.name.toLowerCase().includes(activeSwatch.name.toLowerCase());
    const matchesSize =
      v.attributes?.Size?.toLowerCase() === selectedSize.toLowerCase() ||
      v.name.toLowerCase().includes(selectedSize.toLowerCase());
    return matchesColour && matchesSize;
  }) || product.variations?.find((v) =>
    v.attributes?.Colour?.toLowerCase() === activeSwatch.name.toLowerCase()
  ) || product.variations?.[0];

  // Current active display image, price, and stock
  const currentPrice = activeVariation ? activeVariation.price : product.price;
  const currentInventory = activeVariation ? activeVariation.inventory : product.inventory;
  const isOutOfStock = currentInventory <= 0 || (activeVariation && !activeVariation.enabled);
  const currentImageUrl = activeVariation?.imageUrl || product.imageUrl;

  const handleAdd = (e: React.MouseEvent) => {
    if (isOutOfStock) return;
    onAddToCart(product, activeSwatch, quantity, e, activeVariation, selectedSize);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2200);
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-6 lg:p-10 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#FFFFFF] rounded-2xl sm:rounded-3xl border border-[#E6E4DF] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Bar inside modal */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[#E6E4DF] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-[#737373] truncate">
            <span>Babies Touch</span>
            <span>/</span>
            <span>{product.category}</span>
            <span>/</span>
            <span className="text-[#171717] font-medium truncate max-w-[140px] sm:max-w-[200px]">
              {product.name}
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert('Product link copied to clipboard.');
              }}
              className="p-1.5 sm:p-2 rounded-full text-[#737373] hover:text-[#171717] hover:bg-[#F4F3EF] transition-colors"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-full text-[#737373] hover:text-[#171717] hover:bg-[#F4F3EF] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Split-Screen Layout */}
        <div className="overflow-y-auto p-4 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
            {/* Left Column: Visual Showcase */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              <div className="w-full aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E6E4DF] bg-white shadow-xs">
                <ProductVisual
                  product={product}
                  activeSwatch={activeSwatch}
                  selectedVariation={activeVariation}
                  variationImageUrl={currentImageUrl}
                  showAgeTag={true}
                  className="h-full"
                />
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1 sm:pt-2">
                <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-[#F4F3EF] border border-[#E6E4DF] text-center">
                  <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2E5A36] mx-auto mb-1" />
                  <p className="text-[10px] sm:text-[11px] font-medium text-[#171717]">100% Skin Safe</p>
                  <p className="text-[9px] sm:text-[10px] text-[#737373]">Organic lining</p>
                </div>
                <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-[#F4F3EF] border border-[#E6E4DF] text-center">
                  <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2E5A36] mx-auto mb-1" />
                  <p className="text-[10px] sm:text-[11px] font-medium text-[#171717]">Express Delivery</p>
                  <p className="text-[9px] sm:text-[10px] text-[#737373]">Across Nigeria</p>
                </div>
                <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-[#F4F3EF] border border-[#E6E4DF] text-center">
                  <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2E5A36] mx-auto mb-1" />
                  <p className="text-[10px] sm:text-[11px] font-medium text-[#171717]">Perfect Fit</p>
                  <p className="text-[9px] sm:text-[10px] text-[#737373]">Exchange guarantee</p>
                </div>
              </div>
            </div>

            {/* Right Column: Contiguous Purchase Module & Accordions */}
            <div className="lg:col-span-6 flex flex-col">
              {/* Product Header */}
              <div className="pb-5 border-b border-[#E6E4DF]">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs uppercase tracking-wider text-[#737373] font-semibold">
                    {product.designer} · {product.madeIn}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-[#171717]">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{product.rating}</span>
                    <span className="text-[#737373]">({product.reviewsCount})</span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#171717] mt-2">
                  {product.name}
                </h1>
                <p className="text-sm text-[#737373] mt-1">{product.subtitle}</p>

                {/* Price block in Naira with variation price */}
                <div className="flex items-baseline gap-3 mt-4">
                  <span className="text-2xl font-bold text-[#171717] tabular-nums">
                    ₦{currentPrice.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-[#737373] line-through tabular-nums">
                      ₦{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  {activeVariation?.sku && (
                    <span className="text-[11px] font-mono text-[#737373]">
                      SKU: {activeVariation.sku}
                    </span>
                  )}
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#E6ECE3] text-[#2E5A36] text-[11px] font-medium">
                    Complimentary Keepsake Gift Box
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-[#737373] leading-relaxed my-5">
                {product.description}
              </p>

              {/* Swatch Selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-semibold text-[#171717]">
                    Colorway & Fabric Tone
                  </span>
                  <span className="text-xs text-[#737373]">
                    Selected: <strong className="text-[#171717]">{activeSwatch.name}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {product.swatches.map((swatch) => {
                    const isSelected = activeSwatch.name === swatch.name;
                    return (
                      <button
                        key={swatch.name}
                        onClick={() => setActiveSwatch(swatch)}
                        className={`group flex items-center gap-2 px-3 py-2 rounded-xl border text-xs transition-all ${
                          isSelected
                            ? 'border-[#171717] bg-[#F4F3EF] ring-1 ring-[#171717]'
                            : 'border-[#E6E4DF] bg-white hover:border-[#D0CECB]'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-black/15 shadow-2xs"
                          style={{ backgroundColor: swatch.hex }}
                        />
                        <span className="font-medium text-[#171717]">
                          {swatch.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Selector for Variable Products */}
              {product.type === 'variable' && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-semibold text-[#171717]">
                      Choose Size
                    </span>
                    <span className="text-xs text-[#737373]">
                      Selected: <strong className="text-[#171717]">{selectedSize}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {['1-2Y', '2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y'].map((sz) => {
                      const isSelected = selectedSize === sz;
                      return (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#171717] bg-[#171717] text-white shadow-xs'
                              : 'border-[#E6E4DF] bg-white text-[#171717] hover:border-[#B5B3AC]'
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity & Add to Cart Module */}
              <div className="bg-[#F9F9F7] p-5 rounded-2xl border border-[#E6E4DF] mb-6">
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-[#737373]">Atelier Availability</span>
                  <span
                    className={`font-medium flex items-center gap-1 ${
                      isOutOfStock ? 'text-rose-600' : 'text-[#2E5A36]'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isOutOfStock ? 'bg-rose-500' : 'bg-[#2E5A36]'
                      }`}
                    />
                    {isOutOfStock
                      ? 'Out of stock in selected variation'
                      : `In stock (${currentInventory} pieces ready to dispatch)`}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4">
                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-center bg-white border border-[#E6E4DF] rounded-full px-3 py-1.5 shadow-2xs self-center sm:self-auto">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || isOutOfStock}
                      className="p-1.5 text-[#737373] hover:text-[#171717] disabled:opacity-30 cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 text-xs font-semibold text-[#171717] tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={isOutOfStock}
                      className="p-1.5 text-[#737373] hover:text-[#171717] disabled:opacity-30 cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Buy Button */}
                  <button
                    onClick={handleAdd}
                    disabled={addedSuccess || isOutOfStock}
                    className={`flex-1 py-3 px-6 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all min-h-[44px] ${
                      isOutOfStock
                        ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                        : addedSuccess
                        ? 'bg-[#2E5A36] text-white shadow-sm'
                        : 'bg-[#171717] text-white hover:bg-[#2C2C2C] active:scale-98 shadow-sm cursor-pointer'
                    }`}
                  >
                    {isOutOfStock
                      ? 'Unavailable / Sold Out'
                      : addedSuccess
                      ? 'Added to Bag!'
                      : `Add to Bag · ₦${(currentPrice * quantity).toLocaleString()}`}
                  </button>
                </div>
              </div>

              {/* Specs Accordions */}
              <div className="border-t border-[#E6E4DF] divide-y divide-[#E6E4DF]">
                {/* Accordion 1: Size & Fit */}
                <div>
                  <button
                    onClick={() => toggleAccordion('specs')}
                    className="w-full py-3.5 flex items-center justify-between text-left text-xs font-semibold text-[#171717] hover:text-black"
                  >
                    <span>Child Age & Sizing Guide</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#737373] transition-transform ${
                        openAccordion === 'specs' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openAccordion === 'specs' && (
                    <div className="pb-4 text-xs text-[#737373] space-y-1.5 animate-in fade-in duration-150">
                      <p>
                        <strong className="text-[#171717]">Available Sizes:</strong>{' '}
                        {product.dimensions}
                      </p>
                      <p>
                        <strong className="text-[#171717]">Fit Advice:</strong> Designed with comfortable ease and adjustable back ribbon sash. If child is between age brackets, we recommend choosing one size up for room to grow.
                      </p>
                    </div>
                  )}
                </div>

                {/* Accordion 2: Materials & Hypoallergenic Lining */}
                <div>
                  <button
                    onClick={() => toggleAccordion('materials')}
                    className="w-full py-3.5 flex items-center justify-between text-left text-xs font-semibold text-[#171717] hover:text-black"
                  >
                    <span>Fabrics & Hypoallergenic Linings</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#737373] transition-transform ${
                        openAccordion === 'materials' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openAccordion === 'materials' && (
                    <div className="pb-4 text-xs text-[#737373] space-y-1.5 animate-in fade-in duration-150">
                      <p>
                        <strong className="text-[#171717]">Composition:</strong>{' '}
                        {product.materials}
                      </p>
                      <p>
                        <strong className="text-[#171717]">Skin Guarantee:</strong> Completely lined with GOTS-certified organic cotton to avoid irritation against sensitive young skin.
                      </p>
                    </div>
                  )}
                </div>

                {/* Accordion 3: Garment Care */}
                <div>
                  <button
                    onClick={() => toggleAccordion('care')}
                    className="w-full py-3.5 flex items-center justify-between text-left text-xs font-semibold text-[#171717] hover:text-black"
                  >
                    <span>Care & Preservation</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#737373] transition-transform ${
                        openAccordion === 'care' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openAccordion === 'care' && (
                    <div className="pb-4 text-xs text-[#737373] leading-relaxed animate-in fade-in duration-150">
                      {product.careInstructions}
                    </div>
                  )}
                </div>

                {/* Accordion 4: Packaging & Nationwide Delivery */}
                <div>
                  <button
                    onClick={() => toggleAccordion('shipping')}
                    className="w-full py-3.5 flex items-center justify-between text-left text-xs font-semibold text-[#171717] hover:text-black"
                  >
                    <span>Keepsake Packaging & Delivery</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#737373] transition-transform ${
                        openAccordion === 'shipping' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openAccordion === 'shipping' && (
                    <div className="pb-4 text-xs text-[#737373] leading-relaxed animate-in fade-in duration-150">
                      {product.shippingInfo} Same-day and next-day courier delivery available in Lagos and Abuja; 2-3 business days across all states in Nigeria. Worldwide courier available via DHL Express.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
