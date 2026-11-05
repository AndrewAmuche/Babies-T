import React, { useState, useRef, MouseEvent as ReactMouseEvent } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from 'framer-motion';
import {
  Sparkles,
  Eye,
  ShoppingBag,
  Check,
  ChevronRight,
  Maximize2,
  ShieldCheck,
  RotateCw,
  Compass,
  ArrowUpRight,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { Product, ProductSwatch } from '../types';
import { getProductAgeRange } from '../utils/productUtils';

interface AtelierLookbookCardsProps {
  products: Product[];
  onAddToCart: (
    product: Product,
    swatch: ProductSwatch,
    quantity: number,
    event?: ReactMouseEvent
  ) => void;
  onSelectProduct: (product: Product) => void;
}

const AGE_SIZES = [
  { label: '1-2Y', height: '86-92cm', inStock: 4 },
  { label: '3-4Y', height: '98-104cm', inStock: 6 },
  { label: '5-6Y', height: '110-116cm', inStock: 3 },
  { label: '7-8Y', height: '122-128cm', inStock: 5 },
];

const LOOKBOOK_TABS = [
  'All Runway Looks',
  'Grand Ball Gowns',
  'Ceremony Gowns',
  'Bespoke Flared Dresses',
] as const;

type LookbookTab = (typeof LOOKBOOK_TABS)[number];

// Individual 3D Interactive Tilt Card Component
interface TiltCardProps {
  product: Product;
  lookNumber: string;
  onAddToCart: (
    product: Product,
    swatch: ProductSwatch,
    quantity: number,
    event?: ReactMouseEvent
  ) => void;
  onSelectProduct: (product: Product) => void;
}

const TiltCard: React.FC<TiltCardProps> = ({
  product,
  lookNumber,
  onAddToCart,
  onSelectProduct,
}) => {
  const [activeSwatch, setActiveSwatch] = useState<ProductSwatch>(
    product.swatches[0]
  );
  const [selectedSize, setSelectedSize] = useState<string>('3-4Y');
  const [isHovered, setIsHovered] = useState(false);
  const [showAlternateView, setShowAlternateView] = useState(false);
  const [isMagnifierActive, setIsMagnifierActive] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [addedJustNow, setAddedJustNow] = useState(false);

  // 3D Tilt Physics using Framer Motion
  const cardRef = useRef<HTMLDivElement | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for rotational inertia
  const rotateXRaw = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const rotateYRaw = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);
  const rotateX = useSpring(rotateXRaw, { stiffness: 220, damping: 20 });
  const rotateY = useSpring(rotateYRaw, { stiffness: 220, damping: 20 });

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);

    // Magnifier local coordinates (0 to 100%)
    setMousePos({
      x: Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)),
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsMagnifierActive(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleQuickAdd = (e: ReactMouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, activeSwatch, 1, e);
    setAddedJustNow(true);
    setTimeout(() => {
      setAddedJustNow(false);
      setIsDrawerOpen(false);
    }, 1800);
  };

  // Determine current image depending on alternate toggle
  const currentImg =
    showAlternateView && product.hoverImageUrl
      ? product.hoverImageUrl
      : product.imageUrl || '';

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className="relative rounded-3xl bg-white border border-[#E6E4DF] shadow-[0_12px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_24px_60px_rgba(0,0,0,0.1)] transition-shadow duration-500 overflow-hidden flex flex-col justify-between group"
    >
      {/* Dynamic Swatch Color Tint Glow behind image */}
      <div
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-25 transition-colors duration-700 pointer-events-none"
        style={{ backgroundColor: activeSwatch.hex }}
      />

      {/* Top Card Bar: Look Tag, Badge, Angle Toggle */}
      <div className="relative z-10 px-5 pt-5 pb-3 flex items-center justify-between gap-2 border-b border-[#E6E4DF]/60 bg-white/70 backdrop-blur-xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-[#171717] text-white text-[10px] font-bold tracking-widest uppercase shadow-2xs">
            {lookNumber}
          </span>
          <span className="text-[11px] font-medium text-[#737373] tracking-wide">
            {product.category}
          </span>
        </div>

        {/* Action Controls: Dual View Switcher & Fabric Zoom */}
        <div className="flex items-center gap-1.5">
          {product.hoverImageUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAlternateView((prev) => !prev);
              }}
              title={showAlternateView ? 'View Front Stance' : 'View Alternate Runway Angle'}
              className={`p-1.5 rounded-full text-xs transition-all cursor-pointer border ${
                showAlternateView
                  ? 'bg-[#171717] text-white border-[#171717]'
                  : 'bg-white hover:bg-[#F5F5F7] text-[#171717] border-[#E6E4DF]'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMagnifierActive((prev) => !prev);
            }}
            title={isMagnifierActive ? 'Exit Fabric Zoom' : 'Inspect Fabric Weave (Zoom)'}
            className={`p-1.5 rounded-full text-xs transition-all cursor-pointer border ${
              isMagnifierActive
                ? 'bg-[#2E5A36] text-white border-[#2E5A36]'
                : 'bg-white hover:bg-[#F5F5F7] text-[#171717] border-[#E6E4DF]'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage (Aspect 4:3 Studio Presentation) */}
      <div
        onClick={() => onSelectProduct(product)}
        className="relative aspect-[4/3] w-full overflow-hidden bg-white cursor-pointer select-none"
      >
        {/* Primary / Alternate Photo with High Clarity Brightness */}
        <motion.img
          key={currentImg}
          initial={{ opacity: 0.85 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          src={currentImg}
          alt={product.name}
          className="w-full h-full object-cover object-center brightness-[1.05] contrast-[1.02] transform transition-transform duration-700 ease-out group-hover:scale-104"
        />

        {/* Interactive Fabric Magnifier Loupe Lens */}
        {isMagnifierActive && (
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{
              backgroundImage: `url(${currentImg})`,
              backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
              backgroundSize: '240%',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Crosshair guide in magnifier mode */}
            <div
              className="absolute w-24 h-24 rounded-full border-2 border-white/80 shadow-[0_0_20px_rgba(0,0,0,0.3)] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ left: `${mousePos.x}%`, top: `${mousePos.y}%` }}
            />
            <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[10px] text-white font-medium">
              Fabric Weave 2.4× Zoom
            </span>
          </div>
        )}

        {/* Small letter age range tag at top of product image without covering image detail */}
        <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-[#525252] text-[9px] sm:text-[10px] font-medium tracking-tight border border-[#E6E4DF]/80 shadow-2xs pointer-events-none z-10 lowercase">
          age: {getProductAgeRange(product)}
        </span>

        {/* Rating pill - hidden on mobile */}
        <div className="hidden sm:flex absolute top-3 right-3 items-center gap-1 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-xs border border-[#E6E4DF] text-[10px] font-semibold text-[#171717] shadow-xs pointer-events-none">
          <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span>{product.rating}</span>
        </div>
      </div>

      {/* Card Info & Pricing */}
      <div className="p-5 bg-white relative z-10 flex-1 flex flex-col justify-between border-t border-[#E6E4DF]">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h3
              onClick={() => onSelectProduct(product)}
              className="font-serif font-bold text-base text-[#171717] hover:text-[#2E5A36] transition-colors cursor-pointer line-clamp-1"
            >
              {product.name}
            </h3>
            <div className="text-sm font-semibold text-[#171717] tabular-nums shrink-0">
              ₦{product.price.toLocaleString()}
            </div>
          </div>
          <p className="text-xs text-[#737373] mt-1 line-clamp-1">
            {product.subtitle}
          </p>

          {/* Swatch Selector Row */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F0EEE8]">
            <div className="flex items-center gap-1.5">
              {product.swatches.map((swatch) => (
                <button
                  key={swatch.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSwatch(swatch);
                  }}
                  title={swatch.name}
                  className={`w-5 h-5 rounded-full transition-all cursor-pointer flex items-center justify-center ${
                    activeSwatch.name === swatch.name
                      ? 'ring-2 ring-offset-2 ring-[#171717] scale-110'
                      : 'hover:scale-105 border border-black/15'
                  }`}
                  style={{ backgroundColor: swatch.hex }}
                >
                  {activeSwatch.name === swatch.name && (
                    <span className="w-1 h-1 rounded-full bg-white" />
                  )}
                </button>
              ))}
            </div>

            <span className="text-[11px] font-medium text-[#737373]">
              {activeSwatch.name}
            </span>
          </div>
        </div>

        {/* Card Action Strip */}
        <div className="mt-4 pt-3 border-t border-[#F0EEE8] flex items-center gap-2">
          {/* Quick Add / Select Size Trigger */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDrawerOpen((prev) => !prev);
            }}
            className="flex-1 py-2.5 px-3 rounded-full bg-[#171717] text-white hover:bg-[#2C2C2C] active:scale-98 transition-all text-xs font-semibold tracking-wide flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-white/90" />
            <span>Quick Bag</span>
          </button>

          {/* Full Details Modal Trigger */}
          <button
            onClick={() => onSelectProduct(product)}
            title="Inspect Full Garment Story"
            className="p-2.5 rounded-full bg-[#FAF9F6] hover:bg-[#F0EEE8] border border-[#E6E4DF] text-[#171717] transition-all cursor-pointer shadow-2xs"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* INLINE SLIDE-UP SIZING & DISPATCH DRAWER */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="absolute inset-x-0 bottom-0 z-30 p-5 bg-white/95 backdrop-blur-xl border-t border-[#E6E4DF] shadow-2xl rounded-b-3xl"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                Select Atelier Size
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDrawerOpen(false);
                }}
                className="p-1 rounded-full hover:bg-black/5 text-[#737373] transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Size Options Grid */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {AGE_SIZES.map((sz) => (
                <button
                  key={sz.label}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(sz.label);
                  }}
                  className={`py-2 px-1 rounded-xl text-center border transition-all cursor-pointer ${
                    selectedSize === sz.label
                      ? 'bg-[#171717] text-white border-[#171717] shadow-xs'
                      : 'bg-[#F9F8F5] text-[#171717] border-[#E6E4DF] hover:bg-white'
                  }`}
                >
                  <div className="text-xs font-bold">{sz.label}</div>
                  <div className="text-[9px] opacity-70">{sz.height}</div>
                </button>
              ))}
            </div>

            {/* Instant Bag Dispatch Button */}
            <button
              onClick={handleQuickAdd}
              disabled={addedJustNow}
              className={`w-full py-2.5 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                addedJustNow
                  ? 'bg-[#2E5A36] text-white shadow-xs'
                  : 'bg-[#171717] text-white hover:bg-[#2C2C2C] active:scale-98 shadow-xs'
              }`}
            >
              {addedJustNow ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Added · Dispatched to Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-white/90" />
                  <span>Add {selectedSize} to Bag · ₦{product.price.toLocaleString()}</span>
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const AtelierLookbookCards: React.FC<AtelierLookbookCardsProps> = ({
  products,
  onAddToCart,
  onSelectProduct,
}) => {
  const [activeTab, setActiveTab] = useState<LookbookTab>('All Runway Looks');
  const [viewStyle, setViewStyle] = useState<'3d-reel' | 'grid'>('3d-reel');

  // Filter products by active tab
  const filteredProducts = products.filter((p) => {
    if (activeTab === 'All Runway Looks') return true;
    if (activeTab === 'Grand Ball Gowns') return p.category === 'Ball Dresses';
    if (activeTab === 'Ceremony Gowns') return p.category === 'Gowns';
    if (activeTab === 'Bespoke Flared Dresses')
      return p.category === 'Kids Clothing' || p.category === 'Ball Dresses';
    return true;
  });

  return (
    <section
      id="atelier-runway-lookbook"
      className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 py-12 select-none"
    >
      <div className="bg-gradient-to-b from-[#FAF9F6] via-white to-[#F5F4EF] rounded-3xl sm:rounded-[36px] p-6 sm:p-10 lg:p-12 border border-[#E6E4DF] shadow-md relative overflow-hidden">
        
        {/* Subtle Background Radial Aura */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-[radial-gradient(ellipse_at_top,rgba(232,220,184,0.3)_0%,transparent_70%)] pointer-events-none" />

        {/* Section Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E6E4DF]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8DCB8]/40 border border-[#D8C79B] text-[#5C4D26] text-xs font-semibold tracking-wider uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Atelier Lookbook · Kinetic Cards</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#171717] tracking-tight">
              Couture in Motion: The Runway Deck
            </h2>
            <p className="text-xs sm:text-sm text-[#737373] mt-2 max-w-2xl leading-relaxed">
              Experience the craftsmanship in full 3D motion. Tilt each card with your cursor,
              inspect fine duchess weaves with the 2.4× fabric magnifier, switch runway angles,
              and select bespoke sizes directly from the card.
            </p>
          </div>

          {/* View Mode Toggle Pill */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-white border border-[#E6E4DF] shadow-xs shrink-0">
            <button
              onClick={() => setViewStyle('3d-reel')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                viewStyle === '3d-reel'
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'text-[#737373] hover:text-[#171717]'
              }`}
            >
              Kinetic Deck
            </button>
            <button
              onClick={() => setViewStyle('grid')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                viewStyle === 'grid'
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'text-[#737373] hover:text-[#171717]'
              }`}
            >
              Lookbook Grid
            </button>
          </div>
        </div>

        {/* Animated Category Filter Pills */}
        <div className="relative z-10 flex items-center gap-2 pt-6 pb-8 overflow-x-auto scrollbar-none">
          {LOOKBOOK_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-2 rounded-full text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  isActive ? 'text-[#171717]' : 'text-[#737373] hover:text-[#171717]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="lookbook-tab-pill"
                    className="absolute inset-0 bg-white border border-[#E6E4DF] rounded-full shadow-xs -z-10"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span>{tab}</span>
              </button>
            );
          })}
        </div>

        {/* ANIMATED CARDS CONTAINER */}
        <div
          className={
            viewStyle === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
          }
          style={{ perspective: '1000px' }}
        >
          {filteredProducts.slice(0, viewStyle === 'grid' ? 8 : 6).map((product, idx) => (
            <TiltCard
              key={product.id}
              product={product}
              lookNumber={`LOOK 0${idx + 1}`}
              onAddToCart={onAddToCart}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>

        {/* Bottom Editorial Banner */}
        <div className="mt-12 pt-8 border-t border-[#E6E4DF] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#737373]">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-[#171717]">
              All garments handcrafted in limited editions of 25 pieces
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2E5A36]" />
              <span>100% Organic Cotton Slips</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>French Corded Lace & Silk Organza</span>
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
