import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag, Check, Sparkles } from 'lucide-react';
import { Product, ProductSwatch } from '../types';

export interface ShowcaseProduct {
  id: string;
  name: string;
  colorName: string;
  image: string;
  price: number;
  originalPrice?: number;
  availableSizes: string[];
  defaultSize: string;
  description: string;
  swatchHex: string;
}

// Exactly the 3 uploaded dresses as specified by user
export const SHOWCASE_PRODUCTS: ShowcaseProduct[] = [
  {
    id: 'emerald-polka-dot-flower-girl-dress',
    name: 'Emerald Polka-Dot Flower Girl Dress',
    colorName: 'Forest Emerald & Ivory',
    image: '/assets/showcase/green-polka-dot-dress.png',
    price: 78000,
    originalPrice: 92000,
    availableSizes: ['2Y', '3Y', '4Y', '5Y', '6Y', '7Y', '8Y', '10Y', '12Y'],
    defaultSize: '4Y',
    description:
      'Handcrafted duchess satin dress in rich forest green with classic ivory polka dots. Accented with a cropped ivory bolero capelet and a dimensional sculpted camellia blossom.',
    swatchHex: '#254E38',
  },
  {
    id: 'scarlet-polka-dot-gala-ballgown',
    name: 'Scarlet Polka-Dot Gala Ballgown',
    colorName: 'Crimson Scarlet & Pure White',
    image: '/assets/showcase/red-polka-dot-ballgown.png',
    price: 86000,
    originalPrice: 98000,
    availableSizes: ['2Y', '3Y', '4Y', '5Y', '6Y', '7Y', '8Y', '10Y', '12Y'],
    defaultSize: '6Y',
    description:
      'A showstopping ceremonial ballgown in scarlet red duchess satin with bold white polka dots, architectural box pleats, and a draped capelet collar with statement rosette.',
    swatchHex: '#B31B26',
  },
  {
    id: 'pink-polka-dot-party-dress',
    name: 'Rose Blush Polka-Dot Party Dress',
    colorName: 'Petal Blush & Ruby Rose',
    image: '/assets/showcase/pink-polka-dot-dress.png',
    price: 74000,
    originalPrice: 85000,
    availableSizes: ['2Y', '3Y', '4Y', '5Y', '6Y', '7Y', '8Y', '10Y', '12Y'],
    defaultSize: '4Y',
    description:
      'Whimsical celebration dress crafted in delicate petal blush satin with deep ruby polka dots, finished with a structured capelet drape and hand-rolled rosette centerpiece.',
    swatchHex: '#E88B9E',
  },
];

interface BabiesTouchShowcaseProps {
  onSelectProduct?: (product: Product) => void;
  onAddToCart?: (
    product: Product,
    swatch: ProductSwatch,
    quantity: number,
    event?: React.MouseEvent
  ) => void;
  onExploreClick?: () => void;
}

export const BabiesTouchShowcase: React.FC<BabiesTouchShowcaseProps> = ({
  onSelectProduct,
  onAddToCart,
  onExploreClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(
    SHOWCASE_PRODUCTS[0].defaultSize
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');
  const [addedJustNow, setAddedJustNow] = useState(false);

  // Touch gesture support
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const currentProduct = SHOWCASE_PRODUCTS[currentIndex];
  const nextIndex = (currentIndex + 1) % SHOWCASE_PRODUCTS.length;
  const nextProduct = SHOWCASE_PRODUCTS[nextIndex];

  // Update selected size when active product changes
  useEffect(() => {
    setSelectedSize(currentProduct.defaultSize);
  }, [currentIndex, currentProduct.defaultSize]);

  const handlePrev = () => {
    if (isTransitioning) return;
    setSlideDirection('prev');
    setIsTransitioning(true);
    setCurrentIndex((prev) =>
      prev === 0 ? SHOWCASE_PRODUCTS.length - 1 : prev - 1
    );
    setTimeout(() => setIsTransitioning(false), 450);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setSlideDirection('next');
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % SHOWCASE_PRODUCTS.length);
    setTimeout(() => setIsTransitioning(false), 450);
  };

  const handleGoToSlide = (index: number) => {
    if (index === currentIndex || isTransitioning) return;
    setSlideDirection(index > currentIndex ? 'next' : 'prev');
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 450);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isSwipe = Math.abs(distance) > 50;
    if (isSwipe) {
      if (distance > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleExplore = () => {
    if (onExploreClick) {
      onExploreClick();
    } else {
      const el = document.getElementById('catalog-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Convert ShowcaseProduct to Product type for cart & modal
  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onAddToCart) return;

    const productForCart: Product = {
      id: currentProduct.id,
      name: currentProduct.name,
      subtitle: `${currentProduct.colorName} · Size ${selectedSize}`,
      category: 'Ball Dresses',
      price: currentProduct.price,
      originalPrice: currentProduct.originalPrice,
      description: currentProduct.description,
      story:
        'Lovingly handcrafted in our Babies Touch Atelier with zero-itch 100% organic cotton lining.',
      materials:
        'Heavyweight duchess satin, sculpted silk floral corsage, 100% GOTS organic cotton lining, YKK safety zipper.',
      dimensions: `Selected Size: ${selectedSize}`,
      careInstructions: 'Delicate dry clean or gentle hand wash in cool water.',
      shippingInfo:
        'Arrives in our signature gold-embossed keepsake archival gift box.',
      rating: 4.98,
      reviewsCount: 38,
      inStock: true,
      inventory: 8,
      isFeatured: true,
      designer: 'Babies Touch Atelier',
      madeIn: 'Handcrafted Atelier',
      imageUrl: currentProduct.image,
      hoverImageUrl: currentProduct.image,
      swatches: [
        { name: currentProduct.colorName, hex: currentProduct.swatchHex },
      ],
    };

    const swatch: ProductSwatch = {
      name: `${currentProduct.colorName} (${selectedSize})`,
      hex: currentProduct.swatchHex,
    };

    onAddToCart(productForCart, swatch, 1, e);
    setAddedJustNow(true);
    setTimeout(() => setAddedJustNow(false), 2000);
  };

  return (
    <section
      aria-label="Babies Touch Polka-Dot Couture Showcase"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full overflow-hidden text-white select-none transition-all duration-700"
      style={{
        background:
          'linear-gradient(115deg, #74605B 0%, #9A8179 48%, #5D4842 100%)',
      }}
    >
      {/* Subtle radial light centered behind the floating garment */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.06) 35%, transparent 70%)',
        }}
      />

      {/* Main Showcase Stage */}
      <div className="relative w-full max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 pt-10 pb-24 sm:pb-28 min-h-[640px] md:min-h-[700px] lg:min-h-[740px] flex flex-col justify-between">
        {/* Top Content Row: 3 Columns (Left Text, Center Dress, Right Options) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center flex-1">
          {/* LEFT COLUMN: Product Messaging */}
          <div className="lg:col-span-4 z-10 text-left space-y-4 sm:space-y-5 max-w-lg">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[11px] font-medium tracking-wide uppercase text-white/90">
              <Sparkles className="w-3 h-3 text-amber-200" />
              <span>Polka-Dot Heirloom Edit</span>
            </div>

            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-serif font-bold text-white tracking-tight leading-[1.12]">
              Dress Them in Elegance.
            </h1>

            <p className="text-xs sm:text-sm text-white/85 font-light leading-relaxed max-w-md">
              Discover beautiful children's outfits designed to make every little
              moment special. Explore charming styles for celebrations, parties,
              and everyday memories.
            </p>

            <div className="pt-2">
              <button
                onClick={handleExplore}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#5D4842] text-xs font-semibold hover:bg-[#F5EFEB] hover:shadow-lg hover:scale-102 active:scale-98 transition-all cursor-pointer shadow-md"
              >
                <span>Explore Collection</span>
                <span className="text-sm">→</span>
              </button>
            </div>
          </div>

          {/* CENTRE COLUMN: Main Floating Product Display */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center my-4 lg:my-0 min-h-[380px] sm:min-h-[440px] lg:min-h-[500px]">
            {/* Soft Elliptical Drop Shadow Beneath the Garment */}
            <div
              className={`absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 w-48 sm:w-64 md:w-80 h-7 sm:h-9 bg-black/45 rounded-[100%] blur-md pointer-events-none transform scale-y-50 transition-all duration-500 ${
                isTransitioning ? 'opacity-30 scale-90' : 'opacity-100 scale-100'
              }`}
            />

            {/* Floating Dress Image with Smooth Fade and Vertical Translate Transition */}
            <div
              className={`relative z-10 w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[460px] h-[360px] sm:h-[420px] lg:h-[480px] flex items-center justify-center transition-all duration-450 ease-out transform ${
                isTransitioning
                  ? slideDirection === 'next'
                    ? 'opacity-0 translate-y-3 scale-98'
                    : 'opacity-0 -translate-y-3 scale-98'
                  : 'opacity-100 translate-y-0 scale-100'
              }`}
            >
              <img
                src={currentProduct.image}
                alt={currentProduct.name}
                loading="eager"
                className="w-full h-full object-contain filter drop-shadow-[0_18px_24px_rgba(0,0,0,0.22)] cursor-pointer"
                onClick={() => {
                  if (onSelectProduct) {
                    onSelectProduct({
                      id: currentProduct.id,
                      name: currentProduct.name,
                      subtitle: currentProduct.colorName,
                      category: 'Ball Dresses',
                      price: currentProduct.price,
                      originalPrice: currentProduct.originalPrice,
                      description: currentProduct.description,
                      story:
                        'Handcrafted in our Babies Touch Atelier with zero-itch organic cotton lining.',
                      materials:
                        'Duchess satin, sculpted silk camellia brooch, 100% GOTS organic cotton lining.',
                      dimensions: 'Sizes: 2Y - 12Y',
                      careInstructions: 'Dry clean only or delicate cold hand wash.',
                      shippingInfo:
                        'Encased in signature Babies Touch gold keepsake box.',
                      rating: 4.98,
                      reviewsCount: 38,
                      inStock: true,
                      inventory: 8,
                      isFeatured: true,
                      designer: 'Babies Touch Atelier',
                      madeIn: 'Handcrafted Atelier',
                      imageUrl: currentProduct.image,
                      hoverImageUrl: currentProduct.image,
                      swatches: [
                        {
                          name: currentProduct.colorName,
                          hex: currentProduct.swatchHex,
                        },
                      ],
                    });
                  }
                }}
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Product Information, Price & Size Options */}
          <div className="lg:col-span-3 z-10 text-left lg:text-left space-y-5 lg:pl-4">
            {/* Product Name */}
            <div>
              <span className="text-[11px] font-medium uppercase tracking-widest text-white/70">
                {currentProduct.colorName}
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1 leading-snug">
                {currentProduct.name}
              </h2>
            </div>

            {/* Price Display */}
            <div className="space-y-0.5">
              <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-white tabular-nums">
                ₦{currentProduct.price.toLocaleString()}
              </div>
              {currentProduct.originalPrice && (
                <div className="text-sm text-white/50 line-through tabular-nums">
                  ₦{currentProduct.originalPrice.toLocaleString()}
                </div>
              )}
            </div>

            {/* Choose Your Size Section */}
            <div className="space-y-2.5">
              <label className="block text-xs uppercase tracking-wider text-white/80 font-medium">
                Choose your size
              </label>

              {/* Row of Size Pills */}
              <div className="flex flex-wrap gap-2 max-w-xs">
                {currentProduct.availableSizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`h-9 px-3 min-w-[36px] rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center ${
                        isSelected
                          ? 'bg-white text-[#171717] shadow-md scale-105'
                          : 'bg-black/35 hover:bg-black/55 text-white/90 border border-white/15'
                      }`}
                      aria-label={`Select size ${size}`}
                      aria-pressed={isSelected}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Direct Add to Bag CTA */}
            <div className="pt-2">
              <button
                onClick={handleAddToCartClick}
                disabled={addedJustNow}
                className={`w-full sm:w-auto px-6 py-3 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                  addedJustNow
                    ? 'bg-[#2E5A36] text-white'
                    : 'bg-black/50 hover:bg-black/70 text-white border border-white/20 active:scale-98'
                }`}
              >
                {addedJustNow ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag · {selectedSize}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Navigation Arrows, Brand Statement & Next Product Floating Thumbnail */}
        <div className="relative mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
          {/* Circular Previous Product Arrow */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              aria-label="Previous product"
              className="w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 text-white flex items-center justify-center backdrop-blur-md transition-all duration-200 hover:scale-108 active:scale-95 cursor-pointer shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Slide Indicator Dots */}
            <div className="hidden sm:flex items-center gap-1.5 ml-2">
              {SHOWCASE_PRODUCTS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleGoToSlide(idx)}
                  aria-label={`Go to product ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex
                      ? 'w-6 bg-white'
                      : 'w-1.5 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Two-Line Brand Fashion Statement Near Bottom Center */}
          <div className="text-center font-serif text-white/95 leading-snug px-4">
            <div className="text-base sm:text-lg font-normal tracking-wide">
              Little Moments.
            </div>
            <div className="text-base sm:text-lg font-light italic text-white/80">
              Beautifully Dressed.
            </div>
          </div>

          {/* Right Area: Next Arrow & Floating Alternative Product Thumbnail */}
          <div className="flex items-center gap-4">
            {/* Circular Next Product Arrow */}
            <button
              onClick={handleNext}
              aria-label="Next product"
              className="w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 text-white flex items-center justify-center backdrop-blur-md transition-all duration-200 hover:scale-108 active:scale-95 cursor-pointer shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Small Floating Alternative Product Thumbnail (Advances slider on click) */}
            <div
              onClick={handleNext}
              title={`Next: ${nextProduct.name} (Click to view)`}
              className="hidden sm:flex flex-col items-center cursor-pointer group transition-transform duration-300 hover:scale-108"
            >
              <div className="relative w-16 h-20 md:w-20 md:h-24 rounded-xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 p-1 shadow-md group-hover:border-white/50 transition-colors flex items-center justify-center">
                <img
                  src={nextProduct.image}
                  alt={nextProduct.name}
                  className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="text-[10px] text-white/70 mt-1 font-medium tracking-tight">
                Next
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
