import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Facebook,
  Linkedin,
  ShoppingBag,
} from 'lucide-react';
import { Product, ProductSwatch } from '../types';

export interface ShowcaseItem {
  id: string;
  title: string;
  image: string;
  backgroundImage: string;
  price: number;
  originalPrice?: number;
  description: string;
  sizes: string[];
  themeColor: string;
  tagline: string;
}

export const SHOWCASE_PRODUCTS: ShowcaseItem[] = [
  {
    id: 'green-polka-dot-flower-girl-dress',
    title: 'Emerald Polka-Dot Flower Girl Ball Dress',
    image: '/assets/showcase/green-polka-dot-dress.png',
    backgroundImage: '/assets/showcase/green-polka-dot-dress.png',
    price: 28000,
    originalPrice: 38000,
    description:
      'A striking emerald satin balloon gown adorned with crisp ivory polka dots, tailored gold mannequin silhouette, and an architectural ivory blossom capelet.',
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
    themeColor: '#4A6B48',
    tagline: 'Emerald Polka Edition',
  },
  {
    id: 'red-polka-dot-ballgown-mannequin',
    title: 'Scarlet Polka-Dot Couture Ballgown',
    image: '/assets/showcase/red-polka-dot-ballgown.png',
    backgroundImage: '/assets/showcase/red-polka-dot-ballgown.png',
    price: 25000,
    originalPrice: 35000,
    description:
      'Vibrant scarlet duchess satin with bold pearl polka dots, sculpted shoulder capelet with handmade rose centerpiece, and an architectural bouffant hem.',
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
    themeColor: '#B01824',
    tagline: 'Scarlet Royal Gala',
  },
  {
    id: 'pink-polka-dot-party-dress',
    title: 'Blush & Ruby Polka-Dot Celebration Dress',
    image: '/assets/showcase/pink-polka-dot-dress.png',
    backgroundImage: '/assets/showcase/pink-polka-dot-dress.png',
    price: 26500,
    originalPrice: 36000,
    description:
      'Whimsical powder pink satin highlighted with ruby polka dots, sweet blossom capelet, and voluminous bubble hem crafted for milestone celebrations.',
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
    themeColor: '#D88A96',
    tagline: 'Blush Rose Celebration',
  },
];

interface FashionProductShowcaseProps {
  onSelectProduct?: (product: Product) => void;
  onAddToCart?: (
    product: Product,
    swatch: ProductSwatch,
    quantity: number,
    event?: React.MouseEvent
  ) => void;
  onExploreClick?: () => void;
  className?: string;
}

export const FashionProductShowcase: React.FC<FashionProductShowcaseProps> = ({
  onSelectProduct,
  onAddToCart,
  onExploreClick,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [selectedSize, setSelectedSize] = useState('4-5Y');
  const [isPaused, setIsPaused] = useState(false);

  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  const activeProduct = SHOWCASE_PRODUCTS[currentIndex];

  // Preload all three images into browser memory on mount
  useEffect(() => {
    SHOWCASE_PRODUCTS.forEach((item) => {
      const img = new Image();
      img.src = item.backgroundImage;
    });
  }, []);

  // Sync size when product changes if current size isn't supported
  useEffect(() => {
    if (!activeProduct.sizes.includes(selectedSize)) {
      setSelectedSize(activeProduct.sizes[0] || '4-5Y');
    }
  }, [currentIndex, activeProduct.sizes, selectedSize]);

  // Cleanup pending timeouts on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  // Main animated transition trigger
  const goToSlide = useCallback(
    (targetIndex: number, moveDirection: 'next' | 'prev') => {
      if (isAnimating || targetIndex === currentIndex) return;

      // Lock navigation to prevent rapid click corruption
      setIsAnimating(true);
      setOutgoingIndex(currentIndex);
      setDirection(moveDirection);
      setAnimationStarted(false);

      // Next frame: activate CSS transitions
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimationStarted(true);
          setCurrentIndex(targetIndex);
        });
      });

      // After 950ms animation duration: finalize state and clear outgoing layer
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      animationTimeoutRef.current = setTimeout(() => {
        setOutgoingIndex(null);
        setIsAnimating(false);
        setAnimationStarted(false);
      }, 950);
    },
    [currentIndex, isAnimating]
  );

  const handleNext = useCallback(() => {
    const nextIdx = (currentIndex + 1) % SHOWCASE_PRODUCTS.length;
    goToSlide(nextIdx, 'next');
  }, [currentIndex, goToSlide]);

  const handlePrev = useCallback(() => {
    const prevIdx =
      (currentIndex - 1 + SHOWCASE_PRODUCTS.length) % SHOWCASE_PRODUCTS.length;
    goToSlide(prevIdx, 'prev');
  }, [currentIndex, goToSlide]);

  // Automatic auto-scroll loop: smoothly advances to the next showcase image every 4.5 seconds
  useEffect(() => {
    if (isPaused || isAnimating) return;

    const interval = setInterval(() => {
      // Pause auto-scroll if tab is hidden in background
      if (document.hidden) return;

      // Only advance when showcase is visible on the screen
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (!inView) return;
      }

      handleNext();
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, isAnimating, handleNext]);

  // Keyboard navigation support (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if section is partially in view
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Thumbnail clicks
  const handleThumbnailClick = (targetIdx: number) => {
    if (targetIdx === currentIndex || isAnimating) return;
    const moveDirection = targetIdx > currentIndex ? 'next' : 'prev';
    goToSlide(targetIdx, moveDirection);
  };

  // Convert ShowcaseItem to Product object for modal or cart integration
  const createProductPayload = (item: ShowcaseItem): Product => ({
    id: item.id,
    name: item.title,
    subtitle: item.tagline,
    category: 'Ball Dresses',
    price: item.price,
    originalPrice: item.originalPrice,
    description: item.description,
    story:
      'Handcrafted couture polka-dot collection from the Babies Touch Atelier. Built with 100% hypoallergenic organic cotton inner slip for pure comfort.',
    materials:
      'Lustrous satin, velvet polka dot applique, organic combed cotton lining, gold-tone accents.',
    dimensions: `Sizes Available: ${item.sizes.join(', ')}`,
    careInstructions: 'Delicate dry clean only. Steam reverse side.',
    shippingInfo: 'Arrives in Babies Touch heirloom presentation keepsake box.',
    rating: 4.98,
    reviewsCount: 88,
    inStock: true,
    inventory: 12,
    isFeatured: true,
    designer: 'Babies Touch Atelier',
    madeIn: 'Artisanal Studio',
    imageUrl: item.image,
    hoverImageUrl: item.backgroundImage,
    swatches: [
      { name: item.tagline, hex: item.themeColor },
      { name: 'Ivory Pearl', hex: '#FAF9F6' },
      { name: 'Gold Trim', hex: '#D4AF37' },
    ],
  });

  const handleExploreAction = () => {
    if (onExploreClick) {
      onExploreClick();
    } else {
      const el = document.getElementById('catalog-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleProductCardClick = () => {
    if (onSelectProduct) {
      onSelectProduct(createProductPayload(activeProduct));
    }
  };

  const handleInlineAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      const payload = createProductPayload(activeProduct);
      onAddToCart(payload, payload.swatches[0], 1, e);
    }
  };

  // Check user prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Determine transition styles for outgoing and incoming layers
  const getOutgoingStyle = (): React.CSSProperties => {
    if (prefersReducedMotion) {
      return {
        opacity: animationStarted ? 0 : 1,
        transition: 'opacity 400ms ease-out',
      };
    }

    if (direction === 'next') {
      return {
        transform: animationStarted
          ? 'translate(-30%, -24%) scale(0.78)'
          : 'translate(0, 0) scale(1)',
        opacity: animationStarted ? 0 : 1,
        transformOrigin: 'top left',
        transition:
          'transform 950ms cubic-bezier(0.22, 1, 0.36, 1), opacity 950ms cubic-bezier(0.22, 1, 0.36, 1)',
      };
    } else {
      // Previous direction: retreats smoothly in reverse
      return {
        transform: animationStarted
          ? 'translate(28%, 22%) scale(0.78)'
          : 'translate(0, 0) scale(1)',
        opacity: animationStarted ? 0 : 1,
        transformOrigin: 'bottom right',
        transition:
          'transform 950ms cubic-bezier(0.22, 1, 0.36, 1), opacity 950ms cubic-bezier(0.22, 1, 0.36, 1)',
      };
    }
  };

  const getIncomingStyle = (): React.CSSProperties => {
    if (prefersReducedMotion) {
      return {
        opacity: animationStarted ? 1 : 0,
        transition: 'opacity 400ms ease-out',
      };
    }

    if (direction === 'next') {
      return {
        transform: animationStarted ? 'scale(1)' : 'scale(0.92)',
        opacity: animationStarted ? 1 : 0,
        transformOrigin: 'center center',
        transition:
          'transform 950ms cubic-bezier(0.22, 1, 0.36, 1), opacity 950ms cubic-bezier(0.22, 1, 0.36, 1)',
      };
    } else {
      return {
        transform: animationStarted ? 'scale(1)' : 'scale(1.08)',
        opacity: animationStarted ? 1 : 0,
        transformOrigin: 'center center',
        transition:
          'transform 950ms cubic-bezier(0.22, 1, 0.36, 1), opacity 950ms cubic-bezier(0.22, 1, 0.36, 1)',
      };
    }
  };

  // Other products for bottom-right thumbnails
  const otherProducts = SHOWCASE_PRODUCTS.map((prod, idx) => ({ prod, idx })).filter(
    ({ idx }) => idx !== currentIndex
  );

  return (
    <section
      ref={sectionRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => {
        setTimeout(() => setIsPaused(false), 2500);
      }}
      className={`relative w-full min-h-[660px] sm:min-h-[82vh] md:min-h-[88vh] lg:h-[92vh] overflow-hidden select-none ${className}`}
      aria-label="Interactive Fashion Showcase"
    >
      {/* ============================================================ */}
      {/* LAYER 1: BASE/INCOMING BACKGROUND IMAGE (Cover 100%) */}
      {/* ============================================================ */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={outgoingIndex !== null ? getIncomingStyle() : {}}
      >
        <img
          src={activeProduct.backgroundImage}
          alt={activeProduct.title}
          className="w-full h-full object-cover object-center scale-[1.01]"
          draggable={false}
        />
      </div>

      {/* ============================================================ */}
      {/* LAYER 2: OUTGOING BACKGROUND IMAGE (Animated to Top-Left) */}
      {/* ============================================================ */}
      {outgoingIndex !== null && (
        <div
          className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-1"
          style={getOutgoingStyle()}
        >
          <img
            src={SHOWCASE_PRODUCTS[outgoingIndex].backgroundImage}
            alt={SHOWCASE_PRODUCTS[outgoingIndex].title}
            className="w-full h-full object-cover object-center"
            draggable={false}
          />
        </div>
      )}

      {/* ============================================================ */}
      {/* LAYER 3: LIGHT ATMOSPHERIC GRADIENT (Text Legibility) */}
      {/* ============================================================ */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/10 to-black/55 pointer-events-none z-2" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none z-2" />

      {/* ============================================================ */}
      {/* LAYER 4: EDITORIAL SHOWCASE FOREGROUND CONTENT */}
      {/* ============================================================ */}
      <div className="relative z-10 w-full h-full px-3.5 sm:px-10 lg:px-16 py-5 sm:py-12 flex flex-col justify-between">
        {/* Top Mini Header / Tag with Auto-Scroll Indicator */}
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/90 text-[10px] sm:text-[11px] font-medium tracking-wide sm:tracking-widest uppercase">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: activeProduct.themeColor }}
            />
            <span className="truncate max-w-[170px] sm:max-w-none">Atelier Couture · {activeProduct.tagline}</span>
            <span className="text-white/30 hidden sm:inline">·</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-emerald-300 normal-case tracking-normal text-[10px]">
              <span className={`w-1.5 h-1.5 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-ping'}`} />
              <span>{isPaused ? 'Auto-Scroll Paused' : 'Auto-Scroll Active'}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-white/70 font-mono shrink-0">
            {/* Interactive slide indicator dots */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {SHOWCASE_PRODUCTS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleThumbnailClick(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx ? 'w-5 sm:w-6 bg-white shadow-xs' : 'w-1.5 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to dress ${idx + 1}`}
                  title={SHOWCASE_PRODUCTS[idx].title}
                />
              ))}
            </div>
            <span className="text-white font-bold ml-1">0{currentIndex + 1}</span>
            <span>/</span>
            <span>0{SHOWCASE_PRODUCTS.length}</span>
          </div>
        </div>

        {/* Middle Main Content Composition (Left Copy, Center Space for Mannequin, Right Specs) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-center my-auto">
          {/* Left Column: Headline, Supporting Copy, and CTA */}
          <div className="lg:col-span-4 max-w-lg space-y-3 sm:space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[52px] font-serif font-normal text-white leading-[1.12] tracking-tight drop-shadow-md">
                Wear Confidence.
                <br />
                <span className="italic font-light text-white/95">Define Your Style.</span>
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans max-w-sm drop-shadow-xs">
              Discover beautiful styles designed for comfort, quality, and unforgettable
              moments.
            </p>

            {/* CTA Pill Button with Arrow Icon */}
            <div className="pt-1 sm:pt-2 flex items-center gap-2.5 sm:gap-3">
              <button
                onClick={handleExploreAction}
                className="group inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white text-[#171717] hover:bg-white/90 text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Explore the Collection</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={handleProductCardClick}
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-medium transition-all cursor-pointer"
                title="View dress sizing, fabrics & craftsmanship"
              >
                <span>Details</span>
              </button>
            </div>
          </div>

          {/* Center Column: Open Area revealing the gold mannequin & dress in the background */}
          <div className="lg:col-span-4 flex items-center justify-center min-h-[20px] sm:min-h-[60px] lg:min-h-[140px] pointer-events-none" />

          {/* Right Column: Pricing & Interactive Size Selectors */}
          <div className="lg:col-span-4 flex flex-col lg:items-end justify-center space-y-4 sm:space-y-5 lg:text-right">
            {/* Price Display */}
            <div>
              <div className="flex items-baseline lg:justify-end gap-2.5 sm:gap-3">
                <span className="text-2xl sm:text-4xl font-semibold text-white tracking-tight drop-shadow-md tabular-nums">
                  ₦{activeProduct.price.toLocaleString()}
                </span>
                {activeProduct.originalPrice && (
                  <span className="text-base sm:text-xl text-white/50 line-through tabular-nums">
                    ₦{activeProduct.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-[10px] sm:text-[11px] text-white/70 uppercase tracking-widest mt-0.5">
                Handcrafted · Luxury Silk-Satin
              </p>
            </div>

            {/* Size Selectors (Circular, exactly matching reference) */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-white/85 tracking-wider uppercase">
                Choose your size
              </label>
              <div className="flex items-center lg:justify-end gap-2 sm:gap-2.5">
                {activeProduct.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full text-xs font-bold transition-all duration-200 flex items-center justify-center cursor-pointer ${
                        isSelected
                          ? 'bg-white text-[#171717] shadow-lg scale-105 ring-2 ring-white/50'
                          : 'bg-black/55 text-white/90 hover:bg-black/80 hover:text-white border border-white/20 hover:border-white/40'
                      }`}
                      aria-label={`Select size ${size}`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Add to Bag Trigger */}
            <div className="pt-0.5">
              <button
                onClick={handleInlineAddToCart}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white text-xs font-semibold tracking-wide transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add {selectedSize} to Bag</span>
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* LOWER CONTROLS BAR: Socials, Nav Buttons, Slogan, Thumbnails */}
        {/* ============================================================ */}
        <div className="relative flex flex-col md:grid md:grid-cols-12 gap-4 sm:gap-6 items-center md:items-end pt-3 sm:pt-4 border-t border-white/10">
          {/* Bottom Left: Social Media Icons */}
          <div className="md:col-span-3 flex items-center justify-center md:justify-start gap-4 text-white/70 order-3 md:order-1">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white hover:scale-110 transition-transform"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white hover:scale-110 transition-transform text-xs font-bold font-mono"
              aria-label="X Twitter"
            >
              𝕏
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white hover:scale-110 transition-transform"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white hover:scale-110 transition-transform"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <span
              className="text-xs font-semibold text-white/70 hover:text-white cursor-pointer"
              aria-label="TikTok"
            >
              TikTok
            </span>
          </div>

          {/* Center Navigation Arrows & Bottom Slogan */}
          <div className="md:col-span-6 flex flex-col items-center justify-center space-y-2 sm:space-y-3 order-1 md:order-2">
            {/* Previous & Next Circular Navigation Buttons around center */}
            <div className="flex items-center gap-10 sm:gap-20">
              <button
                onClick={handlePrev}
                disabled={isAnimating}
                aria-label="Previous dress"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/25 text-white flex items-center justify-center transition-all duration-200 shadow-xl hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                title="Previous dress"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <button
                onClick={handleNext}
                disabled={isAnimating}
                aria-label="Next dress"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/25 text-white flex items-center justify-center transition-all duration-200 shadow-xl hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                title="Next dress"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Bottom Slogan (Refined Serif, 2 lines, strictly non-overlapping) */}
            <div className="text-center font-serif text-white/80 tracking-widest text-xs sm:text-base leading-snug drop-shadow-sm select-none">
              <div>Dress Better.</div>
              <div>Feel Better.</div>
            </div>
          </div>

          {/* Bottom Right: Alternative Product Thumbnails */}
          <div className="md:col-span-3 flex justify-center md:justify-end items-center gap-2.5 sm:gap-3 order-2 md:order-3">
            {otherProducts.map(({ prod, idx }) => (
              <button
                key={prod.id}
                onClick={() => handleThumbnailClick(idx)}
                disabled={isAnimating}
                className="group relative flex flex-col items-center focus:outline-none cursor-pointer transition-transform hover:scale-105 active:scale-95"
                title={`Switch to ${prod.title}`}
                aria-label={`Preview ${prod.title}`}
              >
                {/* Thumbnail Card with Soft Shadow */}
                <div className="relative w-14 h-18 sm:w-18 sm:h-24 rounded-xl overflow-hidden border border-white/30 bg-black/40 backdrop-blur-sm group-hover:border-white group-hover:shadow-xl transition-all">
                  <img
                    src={prod.image}
                    alt={prod.title}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>

                {/* Soft Elliptical Ground Shadow beneath floating preview */}
                <div className="w-10 sm:w-12 h-1.5 sm:h-2 mt-1 rounded-full bg-black/50 blur-[2px] transition-all group-hover:w-14 group-hover:bg-black/70" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
