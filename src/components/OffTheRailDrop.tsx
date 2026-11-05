import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Sparkles,
  ShieldCheck,
  Package,
  Layers,
  ArrowRight,
  ShoppingBag,
  Plus,
  Minus,
} from 'lucide-react';
import { Product, ProductSwatch } from '../types';

interface OffTheRailDropProps {
  products: Product[];
  onAddToCart: (
    product: Product,
    swatch: ProductSwatch,
    quantity: number,
    event?: React.MouseEvent
  ) => void;
  onSelectProduct?: (product: Product) => void;
}

export interface RailGarmentItem {
  id: string;
  product: Product;
  dropNumber: string;
  totalDrop: number;
  availableStock: number;
  editionLabel: string;
}

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL'] as const;
type SizeOption = (typeof SIZE_OPTIONS)[number];

const TICKER_BADGES = [
  'OFF THE RAIL · ATELIER DROP 01',
  'LIMITED RUN OF 25 PIECES PER COLORWAY',
  '100% GOTS-CERTIFIED ORGANIC COTTON LINING',
  'CUSTOM CARVED OAK DISPLAY HANGER INCLUDED',
  'ARCHIVAL KEEPSAKE BOX & MONOGRAM CERTIFICATE',
  'COMPLIMENTARY NATIONWIDE WHITE-GLOVE DELIVERY',
  'NEXT APPAREL DROP: AUTUMN / WINTER 2026',
];

export const OffTheRailDrop: React.FC<OffTheRailDropProps> = ({
  products,
  onAddToCart,
  onSelectProduct,
}) => {
  // Select up to 8 premier garments for the rail carousel
  const railGarments: RailGarmentItem[] = products.slice(0, 8).map((p, idx) => ({
    id: p.id,
    product: p,
    dropNumber: `DROP 0${idx + 1}`,
    totalDrop: 25,
    availableStock: Math.max(3, 14 - idx),
    editionLabel: `Limited Edition 0${idx + 1} / 08`,
  }));

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProductForDetail, setSelectedProductForDetail] =
    useState<RailGarmentItem | null>(null);

  // Lightbox Detail State
  const [selectedSize, setSelectedSize] = useState<SizeOption>('M');
  const [selectedSwatch, setSelectedSwatch] = useState<ProductSwatch>(
    railGarments[0]?.product.swatches[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Sync selected swatch when detail product changes
  useEffect(() => {
    if (selectedProductForDetail) {
      setSelectedSwatch(selectedProductForDetail.product.swatches[0]);
      setQuantity(1);
      setIsAdded(false);
    }
  }, [selectedProductForDetail]);

  const activeGarment = railGarments[activeIndex] || railGarments[0];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % railGarments.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + railGarments.length) % railGarments.length);
  };

  // Keyboard navigation for rail carousel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedProductForDetail) {
        if (e.key === 'Escape') {
          setSelectedProductForDetail(null);
        }
        return;
      }
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProductForDetail]);

  const handleOpenDetail = (item: RailGarmentItem) => {
    setSelectedProductForDetail(item);
  };

  const handleCloseDetail = () => {
    setSelectedProductForDetail(null);
  };

  const handleAddFromDetail = (e: React.MouseEvent) => {
    if (!selectedProductForDetail) return;
    onAddToCart(
      selectedProductForDetail.product,
      selectedSwatch,
      quantity,
      e
    );
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2400);
  };

  return (
    <section
      id="off-the-rail"
      className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 py-8 select-none"
    >
      {/* Viewport Frame (Fullscreen Minimalist Aesthetic #F5F5F7) */}
      <div className="min-h-[85vh] sm:min-h-screen bg-[#F5F5F7] rounded-3xl sm:rounded-[36px] border border-[#E6E4DF] shadow-md relative overflow-hidden flex flex-col justify-between">
        
        {/* Ambient Top Studio Light Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-72 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.9)_0%,rgba(245,245,247,0)_70%)] pointer-events-none z-0" />

        {/* 1. STICKY / TOP DROP HEADER */}
        <header className="relative z-20 px-6 sm:px-12 pt-8 sm:pt-10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E4DF]/60 bg-[#F5F5F7]/85 backdrop-blur-md">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-full bg-[#171717] text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-sm">
              OTR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold tracking-widest text-[#171717] uppercase">
                  Off the Rail
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#E8DCB8]/40 border border-[#D8C79B] text-[#5C4D26] text-[10px] font-semibold tracking-wider uppercase">
                  Atelier Drop Vol. 01
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#737373]">
                Interactive Clothes Rail · Direct from the Atelier Studio
              </p>
            </div>
          </div>

          {/* Right Header Navigation & Rack Counter */}
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-full bg-white border border-[#E6E4DF] text-xs font-semibold text-[#171717] tabular-nums shadow-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                Garment 0{activeIndex + 1} / 0{railGarments.length}
              </span>
            </div>

            {/* Carousel Arrows */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-full border border-[#E6E4DF] shadow-xs">
              <button
                onClick={handlePrev}
                aria-label="Previous rail garment"
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F0EEE8] active:scale-95 transition-all text-[#171717] cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next rail garment"
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F0EEE8] active:scale-95 transition-all text-[#171717] cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* 2. MAIN FEATURE: INTERACTIVE CLOTHES RAIL CAROUSEL */}
        <div
          className={`relative flex-1 flex flex-col justify-center items-center py-10 transition-all duration-500 ${
            selectedProductForDetail ? 'backdrop-blur-md opacity-25 pointer-events-none scale-98' : 'opacity-100'
          }`}
          style={{ perspective: '1200px' }}
        >
          {/* Top Rail Bar Mechanism */}
          <div className="w-full max-w-6xl px-4 sm:px-10 relative mb-8">
            {/* Wall Mount Brackets on Left and Right */}
            <div className="absolute -top-3 left-6 sm:left-12 w-6 h-8 rounded-sm bg-gradient-to-b from-zinc-300 via-zinc-400 to-zinc-500 shadow-sm border border-zinc-400 z-10 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-zinc-600 shadow-inner" />
            </div>
            <div className="absolute -top-3 right-6 sm:right-12 w-6 h-8 rounded-sm bg-gradient-to-b from-zinc-300 via-zinc-400 to-zinc-500 shadow-sm border border-zinc-400 z-10 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-zinc-600 shadow-inner" />
            </div>

            {/* The Horizontal Metal Rail Bar */}
            <div className="relative w-full h-3 sm:h-3.5 rounded-full bg-gradient-to-b from-zinc-100 via-zinc-300 to-zinc-400 shadow-[0_4px_8px_rgba(0,0,0,0.12)] border border-zinc-300">
              {/* Metallic highlight specular line */}
              <div className="absolute top-0.5 left-0 right-0 h-[1.5px] bg-white/80 rounded-full" />
            </div>

            {/* Cast shadow below rail on back wall */}
            <div className="w-full h-4 bg-gradient-to-b from-black/10 to-transparent blur-xs pointer-events-none -mt-0.5" />
          </div>

          {/* Hanging Clothes Carousel Stage */}
          <div className="relative w-full h-[480px] sm:h-[540px] flex items-center justify-center overflow-visible">
            {railGarments.map((item, index) => {
              const offset = index - activeIndex;
              const isActive = offset === 0;

              // 3D perspective calculation
              const rotateY = isActive ? 0 : offset < 0 ? -38 : 38;
              const scale = isActive ? 1.08 : Math.max(0.72, 1 - Math.abs(offset) * 0.09);
              const zIndex = isActive ? 40 : 20 - Math.abs(offset);
              const opacity = isActive
                ? 1
                : Math.abs(offset) > 3
                ? 0
                : Math.max(0.35, 1 - Math.abs(offset) * 0.22);
              const xPos = offset * (window.innerWidth < 640 ? 160 : 230);

              return (
                <motion.div
                  key={item.id}
                  onClick={() => {
                    if (!isActive) {
                      setActiveIndex(index);
                    }
                  }}
                  animate={{
                    x: xPos,
                    scale,
                    rotateY,
                    opacity,
                    zIndex,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 26,
                  }}
                  className={`absolute top-0 cursor-pointer flex flex-col items-center origin-top select-none ${
                    isActive ? 'cursor-default' : 'hover:opacity-90'
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* REALISTIC WOODEN HANGER COMPONENT */}
                  <div className="relative flex flex-col items-center">
                    {/* Hanger Metal Hook on the rail */}
                    <div className="w-4 h-7 border-t-2 border-l-2 border-zinc-400 rounded-tl-full -mb-1 shadow-2xs transform -rotate-6" />

                    {/* Carved Beech Wood Contoured Hanger Bar */}
                    <div className="w-48 sm:w-56 h-6 rounded-t-lg bg-gradient-to-r from-[#C29B6C] via-[#E2BE8F] to-[#B38756] shadow-md border-t border-[#F2DAC0] border-b border-[#8C6438] flex items-center justify-center relative">
                      {/* Subtle brand imprint on hanger */}
                      <span className="text-[8px] tracking-widest uppercase font-semibold text-[#66431E]/70 select-none">
                        Babies Touch
                      </span>
                      {/* Left & Right Notch detail */}
                      <div className="absolute left-3 top-1.5 w-1 h-3 bg-[#8C6438]/40 rounded-full" />
                      <div className="absolute right-3 top-1.5 w-1 h-3 bg-[#8C6438]/40 rounded-full" />
                    </div>
                  </div>

                  {/* HANGING GARMENT CARD (Flat front for active, angled/folded for neighbors) */}
                  <div
                    className={`mt-1 relative w-56 sm:w-64 rounded-2xl overflow-hidden bg-white border transition-all duration-300 ${
                      isActive
                        ? 'border-[#171717] shadow-2xl ring-4 ring-black/5'
                        : 'border-[#E6E4DF] shadow-md'
                    }`}
                  >
                    {/* Hanging Garment Photography */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover object-center brightness-[1.05] contrast-[1.02]"
                      />

                      {/* Drop Edition Badge */}
                      <span className="absolute top-2.5 left-2.5 text-[9px] font-bold tracking-widest text-[#171717] bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-full uppercase border border-black/5 shadow-2xs">
                        {item.dropNumber}
                      </span>

                      {/* Limited Stock Badge */}
                      <span className="absolute top-2.5 right-2.5 text-[9px] font-semibold text-[#2E5A36] bg-[#E6ECE3]/90 backdrop-blur-xs px-2 py-0.5 rounded-full uppercase">
                        {item.availableStock} in Stock
                      </span>
                    </div>

                    {/* Garment Details & Card Bottom */}
                    <div className="p-4 bg-white text-center flex flex-col items-center">
                      <h3 className="font-serif font-bold text-sm text-[#171717] line-clamp-1">
                        {item.product.name}
                      </h3>
                      <p className="text-[11px] text-[#737373] mt-0.5 tabular-nums">
                        ₦{item.product.price.toLocaleString()}
                      </p>

                      {/* Color swatches mini strip */}
                      <div className="flex items-center gap-1.5 my-2.5">
                        {item.product.swatches.map((swatch) => (
                          <span
                            key={swatch.name}
                            className="w-2.5 h-2.5 rounded-full border border-black/15 shadow-2xs"
                            style={{ backgroundColor: swatch.hex }}
                          />
                        ))}
                      </div>

                      {/* "SEE AVAILABILITY" CTA Button on the Active Garment */}
                      {isActive && (
                        <motion.button
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetail(item);
                          }}
                          className="w-full mt-1 py-2 px-3 rounded-full bg-[#171717] text-white hover:bg-[#2C2C2C] active:scale-98 transition-all text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                        >
                          <span>See Availability</span>
                          <ArrowRight className="w-3.5 h-3.5 text-white/80" />
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {/* Ground/Wall Drop Shadow */}
                  <div
                    className={`h-4 rounded-full bg-black/15 filter blur-md mt-2 transition-all ${
                      isActive ? 'w-48 opacity-40' : 'w-32 opacity-20'
                    }`}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Quick Slider Guide Indicator */}
          <div className="flex items-center gap-2 mt-4 z-10">
            {railGarments.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                aria-label={`Jump to rail item ${i + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  i === activeIndex
                    ? 'w-7 h-1.5 bg-[#171717]'
                    : 'w-1.5 h-1.5 bg-black/20 hover:bg-black/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 3. SINGLE-PRODUCT DETAIL LIGHTBOX MODAL ("SEE AVAILABILITY" CLICK) */}
        <AnimatePresence>
          {selectedProductForDetail && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 10 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                className="bg-white rounded-3xl sm:rounded-[32px] max-w-3xl w-full border border-[#E6E4DF] shadow-2xl overflow-hidden relative"
              >
                {/* Modal Top Action Bar */}
                <div className="px-6 py-4 border-b border-[#E6E4DF] flex items-center justify-between bg-[#FAF9F6]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#171717]">
                      {selectedProductForDetail.dropNumber} · {selectedProductForDetail.editionLabel}
                    </span>
                  </div>

                  <button
                    onClick={handleCloseDetail}
                    aria-label="Back to rail"
                    className="p-1.5 rounded-full hover:bg-black/5 text-[#171717] transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
                  >
                    <span>Return to Rail</span>
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Modal Content Split Screen */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8 items-center">
                  {/* Left: Product Visual On Hanger */}
                  <div className="md:col-span-5 flex flex-col items-center">
                    {/* Realistic Mini Wooden Hanger */}
                    <div className="flex flex-col items-center -mb-2 z-10">
                      <div className="w-3 h-5 border-t-2 border-l-2 border-zinc-400 rounded-tl-full shadow-2xs" />
                      <div className="w-40 h-5 rounded-t-md bg-gradient-to-r from-[#C29B6C] via-[#E2BE8F] to-[#B38756] border-t border-[#F2DAC0] border-b border-[#8C6438] flex items-center justify-center shadow-xs">
                        <span className="text-[7px] tracking-widest uppercase font-semibold text-[#66431E]/80">
                          Babies Touch Atelier
                        </span>
                      </div>
                    </div>

                    {/* Image Container with Crisp 4:3 Bright Rendering */}
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-[#E6E4DF] shadow-sm relative">
                      <img
                        src={selectedProductForDetail.product.imageUrl}
                        alt={selectedProductForDetail.product.name}
                        className="w-full h-full object-cover object-center brightness-[1.05] contrast-[1.02]"
                      />
                      <span className="absolute bottom-2.5 right-2.5 text-[9px] font-semibold text-[#2E5A36] bg-white/95 px-2 py-0.5 rounded-full shadow-xs border border-[#E6E4DF]">
                        {selectedProductForDetail.availableStock} Available
                      </span>
                    </div>
                  </div>

                  {/* Right: Specifications & Dynamic Purchase Module */}
                  <div className="md:col-span-7 flex flex-col justify-between space-y-5">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] uppercase tracking-widest text-[#737373] font-semibold">
                          Exclusive Drop Item
                        </span>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Ready to Ship
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#171717] mt-1.5">
                        {selectedProductForDetail.product.name}
                      </h3>
                      <div className="text-lg font-semibold text-[#171717] mt-1 tabular-nums">
                        ₦{selectedProductForDetail.product.price.toLocaleString()}
                      </div>
                      <p className="text-xs text-[#737373] mt-2 leading-relaxed">
                        {selectedProductForDetail.product.description}
                      </p>
                    </div>

                    {/* Size Selector Pills (XS–XL) */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-[#737373]">
                          Select Size
                        </span>
                        <span className="text-[11px] text-[#A39E93]">
                          Couture Fit Guide
                        </span>
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {SIZE_OPTIONS.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                              selectedSize === size
                                ? 'bg-[#171717] text-white border-[#171717] shadow-xs'
                                : 'bg-white text-[#171717] border-[#E6E4DF] hover:bg-[#F5F5F7]'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color Swatch Selector */}
                    <div>
                      <span className="text-xs font-medium text-[#737373] block mb-2">
                        Colorway:{' '}
                        <span className="text-[#171717] font-semibold">
                          {selectedSwatch.name}
                        </span>
                      </span>
                      <div className="flex items-center gap-2">
                        {selectedProductForDetail.product.swatches.map((swatch) => (
                          <button
                            key={swatch.name}
                            onClick={() => setSelectedSwatch(swatch)}
                            title={swatch.name}
                            className={`w-6 h-6 rounded-full transition-all flex items-center justify-center ${
                              selectedSwatch.name === swatch.name
                                ? 'ring-2 ring-offset-2 ring-[#171717] scale-110'
                                : 'hover:scale-105 border border-black/15'
                            }`}
                            style={{ backgroundColor: swatch.hex }}
                          >
                            {selectedSwatch.name === swatch.name && (
                              <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quantity Stepper & Add to Bag CTA */}
                    <div className="pt-2 flex items-center gap-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#E6E4DF] rounded-full bg-white p-1 shadow-2xs">
                        <button
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#F5F5F7] text-[#171717] transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold tabular-nums text-[#171717]">
                          {quantity}
                        </span>
                        <button
                          onClick={() =>
                            setQuantity((q) =>
                              Math.min(selectedProductForDetail.availableStock, q + 1)
                            )
                          }
                          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#F5F5F7] text-[#171717] transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Dynamic "Add to Bag" Button */}
                      <button
                        onClick={handleAddFromDetail}
                        className={`flex-1 py-3 px-5 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          isAdded
                            ? 'bg-[#2E5A36] text-white shadow-sm'
                            : 'bg-[#171717] text-white hover:bg-[#2C2C2C] active:scale-98 shadow-sm'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-300" />
                            <span>Added to Bag</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4 text-white/90" />
                            <span>Add to Bag</span>
                            <span className="text-white/40">·</span>
                            <span className="tabular-nums">
                              ₦{(selectedProductForDetail.product.price * quantity).toLocaleString()}
                            </span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Proof Guarantee bullet */}
                    <div className="flex items-center gap-2 text-[11px] text-[#737373] pt-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Includes custom oak display hanger and archival box</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* 4. MULTI-BADGE BOTTOM TICKER */}
        <footer className="relative z-20 overflow-hidden border-t border-[#E6E4DF] bg-white py-3.5">
          <div className="flex items-center gap-3 animate-none whitespace-nowrap overflow-x-auto scrollbar-none px-4 sm:px-8">
            {TICKER_BADGES.map((badge, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F5F7] border border-[#E6E4DF] text-[11px] font-semibold tracking-wider text-[#171717] uppercase shrink-0"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{badge}</span>
              </span>
            ))}
          </div>
        </footer>

      </div>
    </section>
  );
};
