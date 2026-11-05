import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowDown,
  Check,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { Product, ProductSwatch } from '../types';
import { BabiesTouchLogo } from './BabiesTouchLogo';
import { getProductAgeRange } from '../utils/productUtils';

interface HeroBentoProps {
  featuredProduct: Product;
  onAddToCart: (
    product: Product,
    swatch: ProductSwatch,
    quantity: number,
    event?: React.MouseEvent
  ) => void;
  onSelectProduct: (product: Product) => void;
  onExploreClick: () => void;
}

const RIGHT_HERO_SWATCH_IMAGES: Record<string, { primary: string; hover: string }> = {
  'Onyx & Gold Rose': {
    primary: '/assets/products/midnight-gold-rose-dress.jpg',
    hover: '/assets/products/midnight-magenta-rose-dress.jpg',
  },
  'Champagne Ivory': {
    primary: '/assets/products/ivory-champagne-rosette-gown.jpg',
    hover: '/assets/products/blush-lace-crystal-gown.jpg',
  },
  'Forest Emerald': {
    primary: '/assets/products/chartreuse-citron-rose-dress.jpg',
    hover: '/assets/products/aqua-bloom-flared-dress.jpg',
  },
  'Burgundy Blossom': {
    primary: '/assets/products/raspberry-crimson-rose-dress.jpg',
    hover: '/assets/products/blossom-pink-crimson-rose-dress.jpg',
  },
  'Blush Rose': {
    primary: '/assets/products/blush-lace-crystal-gown.jpg',
    hover: '/assets/products/royal-pink-rosette-ball-gown.jpg',
  },
  'Ivory Pearl': {
    primary: '/assets/products/ivory-champagne-rosette-gown.jpg',
    hover: '/assets/products/blush-lace-crystal-gown.jpg',
  },
};

export const HeroBento: React.FC<HeroBentoProps> = ({
  featuredProduct,
  onAddToCart,
  onSelectProduct,
  onExploreClick,
}) => {
  const [selectedSwatch, setSelectedSwatch] = useState<ProductSwatch>(
    featuredProduct.swatches[0]
  );
  const [addedJustNow, setAddedJustNow] = useState(false);
  const [showPhilosophyModal, setShowPhilosophyModal] = useState(false);
  const [isHoveredRightProduct, setIsHoveredRightProduct] = useState(false);

  // Background Video Ref for Left Hero Card (Always looping and muted)
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // Video Ref for Right Hero Product Card (Looping and muted)
  const rightVideoRef = useRef<HTMLVideoElement | null>(null);

  // Ensure autoplay on mount with loop and mute
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      video.play().catch(() => {
        // Autoplay policy handled gracefully
      });
    }

    const rightVideo = rightVideoRef.current;
    if (rightVideo) {
      rightVideo.defaultMuted = true;
      rightVideo.muted = true;
      rightVideo.play().catch(() => {
        // Autoplay policy handled gracefully
      });
    }
  }, []);

  const handleInlineAdd = (e: React.MouseEvent) => {
    onAddToCart(featuredProduct, selectedSwatch, 1, e);
    setAddedJustNow(true);
    setTimeout(() => setAddedJustNow(false), 2000);
  };

  return (
    <section className="w-full px-2.5 sm:px-5 lg:px-6 xl:px-8 pt-2 sm:pt-3 pb-4">
      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
        {/* Bento Cell 1: Left Hero Card with Background Video on Loop & Mute (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 border border-[#E6E4DF] flex flex-col justify-between shadow-xs relative overflow-hidden min-h-[440px] sm:min-h-[540px] group bg-[#111111]">
          {/* Background Video Element (Looping, Muted, Continuous) */}
          <div className="absolute inset-0 z-0 overflow-hidden bg-[#111111]">
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              poster="/assets/videos/hero-poster.jpg"
              className="w-full h-full object-cover object-center scale-[1.02] transform transition-transform duration-700 group-hover:scale-105"
            >
              <source
                src="/assets/videos/animate_20261016044915.mp4"
                type="video/mp4"
              />
              <source
                src="/assets/videos/hero-animation.mp4"
                type="video/mp4"
              />
              Your browser does not support HTML5 video.
            </video>

            {/* Cinematic Gradient Overlays for Readability & High-End Warmth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/35 pointer-events-none z-1" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none z-1" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.35)_100%)] pointer-events-none z-1" />
          </div>

          {/* Top Row: Haute Couture Badge */}
          <div className="relative z-10 flex items-center justify-between gap-3">
            {/* Live Atelier Motion Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] sm:text-xs font-medium shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="tracking-wide">Atelier Motion</span>
              <span className="text-white/40">·</span>
              <span className="text-white/80 font-normal">Haute Couture 2026</span>
            </div>
          </div>

          {/* Bottom Area: Title, CTAs, Guarantee Strip */}
          <div className="relative z-10 pt-12 sm:pt-16">
            <div className="space-y-4 sm:space-y-5 max-w-xl">
              <div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-white leading-[1.14] drop-shadow-xs">
                  Couture Grace in Motion
                </h1>
                <p className="text-xs sm:text-sm text-white/85 mt-2.5 sm:mt-3 leading-relaxed max-w-lg drop-shadow-2xs">
                  Hand-finished ceremonial gowns, cloud-soft tiered tulle, and 100% hypoallergenic organic cotton linings crafted for unforgettable milestones.
                </p>
              </div>

              {/* CTAs and Quality Guarantee strip */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
                <button
                  onClick={onExploreClick}
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white text-[#171717] hover:bg-[#F4F3EF] active:scale-98 transition-all font-semibold text-xs shadow-md group cursor-pointer"
                >
                  <span>Explore Collection</span>
                  <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => setShowPhilosophyModal(true)}
                  className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors font-medium text-xs border border-white/25 backdrop-blur-md cursor-pointer"
                >
                  <span>The Atelier Story</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/80" />
                </button>
              </div>

              {/* Micro proof line */}
              <div className="pt-3 sm:pt-4 border-t border-white/20 flex flex-wrap items-center gap-y-1.5 gap-x-3 sm:gap-x-4 text-[11px] sm:text-xs text-white/90">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% Skin-Gentle Lining</span>
                </div>
                <span className="text-white/40">·</span>
                <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Flagship: Main Market, Onitsha</span>
                </span>
                <span className="text-white/40">·</span>
                <span>Nationwide Waybill Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Cell 2: Featured Hero Product Showcase (5 cols) */}
        <div className="lg:col-span-5 bg-[#FFFFFF] rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-8 border border-[#E6E4DF] flex flex-col justify-between shadow-xs">
          <div>
            {/* Header info */}
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-[#737373]">
                Atelier Masterpiece
              </span>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E6ECE3] text-[#2E5A36] text-[10px] sm:text-[11px] font-medium">
                In Stock · Ready to Dispatch
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-lg sm:text-2xl font-serif font-bold text-[#171717] truncate">
                {featuredProduct.name}
              </h2>
              <div className="text-base sm:text-lg font-semibold text-[#171717] tabular-nums shrink-0">
                ₦{featuredProduct.price.toLocaleString()}
              </div>
            </div>
            <p className="text-xs text-[#737373] mt-0.5">{featuredProduct.subtitle}</p>

            {/* Right Hero Product Card Video Container (Continuous loop & muted) */}
            <div
              onClick={() => onSelectProduct(featuredProduct)}
              className="mt-3.5 h-52 sm:h-64 md:h-72 w-full cursor-pointer relative group rounded-2xl overflow-hidden bg-[#111111] border border-[#E6E4DF] shadow-xs select-none"
              title="Click to view product details"
            >
              {/* Product Video Element */}
              <video
                ref={rightVideoRef}
                autoPlay
                loop
                muted
                playsInline
                poster="/assets/videos/right-hero-poster.jpg"
                className="absolute inset-0 w-full h-full object-cover object-center brightness-[1.05] contrast-[1.02] transition-transform duration-700 ease-out group-hover:scale-105"
              >
                <source
                  src="/assets/videos/animate_20261016193613.mp4"
                  type="video/mp4"
                />
                <source
                  src="/assets/videos/right-hero-video.mp4"
                  type="video/mp4"
                />
                Your browser does not support HTML5 video.
              </video>

              {/* Small letter age range tag at top of product image without covering image detail */}
              <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-[#525252] text-[9px] sm:text-[10px] font-medium tracking-tight border border-[#E6E4DF]/80 shadow-2xs pointer-events-none z-10 lowercase">
                age: {getProductAgeRange(featuredProduct)}
              </span>

              {/* Live Motion Status Indicator Badge */}
              <div className="absolute top-3 right-3 z-10 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-medium border border-white/20 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Runway Motion</span>
                </span>
              </div>

              {/* Active swatch indicator pill - hidden on mobile */}
              <div className="hidden sm:flex absolute bottom-3 left-3 items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs border border-[#E6E4DF] text-[11px] text-[#171717] pointer-events-none shadow-xs z-10">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/15 shrink-0"
                  style={{ backgroundColor: selectedSwatch.hex }}
                />
                <span className="font-medium">{selectedSwatch.name}</span>
              </div>

              {/* Hover overlay button */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-10">
                <span className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-xs font-semibold text-[#171717] shadow-md border border-[#E6E4DF] transform translate-y-1 group-hover:translate-y-0 transition-transform">
                  View Full Details & Sizing
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Swatch & Inline Add to Cart */}
          <div className="mt-6 pt-5 border-t border-[#E6E4DF] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#737373]">
                Colorway: <span className="text-[#171717] font-semibold">{selectedSwatch.name}</span>
              </span>

              {/* Swatch options */}
              <div className="flex items-center gap-2">
                {featuredProduct.swatches.map((swatch: ProductSwatch) => (
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

            {/* Inline Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleInlineAdd}
                disabled={addedJustNow}
                className={`flex-1 py-3 px-5 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  addedJustNow
                    ? 'bg-[#2E5A36] text-white shadow-sm'
                    : 'bg-[#171717] text-white hover:bg-[#2C2C2C] active:scale-98 shadow-xs'
                }`}
              >
                {addedJustNow ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <span>Add to Bag</span>
                    <span className="text-white/60">·</span>
                    <span className="tabular-nums">₦{featuredProduct.price.toLocaleString()}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onSelectProduct(featuredProduct)}
                className="py-3 px-4 rounded-full border border-[#E6E4DF] bg-white text-xs font-medium text-[#171717] hover:bg-[#F4F3EF] transition-colors cursor-pointer"
              >
                Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy Modal */}
      {showPhilosophyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full border border-[#E6E4DF] shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-3">
              <BabiesTouchLogo size="sm" />
              <h3 className="text-2xl font-serif font-bold text-[#171717]">
                The Babies Touch Promise
              </h3>
            </div>
            <p className="text-sm text-[#737373] leading-relaxed mb-4">
              Headquartered at <strong>Main Market, Onitsha</strong>, Babies Touch creates bespoke children's couture, gowns, and shoes crafted for timeless milestone celebrations. Every stitch is placed with uncompromising love.
            </p>

            <div className="space-y-3 py-2 border-y border-[#E6E4DF] my-4 text-xs text-[#171717]">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-[#2E5A36]">01. 100% Breathable Organic Linings</span>
                <span className="text-[#737373]">— No scratchy netting or raw seams touching your child's delicate skin.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-[#2E5A36]">02. Hand-Embellished Artistry</span>
                <span className="text-[#737373]">— Hand-sewn 3D organza blossoms, mother-of-pearl buttons, and seed pearl details.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-[#2E5A36]">03. Heirloom Preservation</span>
                <span className="text-[#737373]">— Each dress and shoe set is shipped in archival keepsake boxes to cherish forever.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-[#2E5A36]">04. Main Market Onitsha Flagship</span>
                <span className="text-[#737373]">— Visit our physical boutique in Onitsha or enjoy nationwide waybill delivery across all 36 Nigerian states.</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowPhilosophyModal(false)}
                className="px-5 py-2.5 rounded-full bg-[#171717] text-white text-xs font-medium hover:bg-black cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
