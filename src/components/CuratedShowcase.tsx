import React, { useState } from 'react';
import { Check, Plus, Star, ArrowRight, ShieldCheck, Gift, Clock } from 'lucide-react';
import { Product, ProductSwatch } from '../types';
import { ProductVisual } from './ProductVisual';

interface CuratedShowcaseProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (
    product: Product,
    swatch: ProductSwatch,
    quantity: number,
    event?: React.MouseEvent
  ) => void;
}

type ShowcaseFilter = 'all' | 'ball-dresses' | 'gowns' | 'shoes' | 'featured';

export const CuratedShowcase: React.FC<CuratedShowcaseProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
}) => {
  const [activeFilter, setActiveFilter] = useState<ShowcaseFilter>('all');
  const [activeSwatches, setActiveSwatches] = useState<Record<string, ProductSwatch>>({});
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  // Curate products based on showcase filter
  const filteredProducts = products.filter((p) => {
    if (activeFilter === 'featured') return p.isFeatured;
    if (activeFilter === 'ball-dresses') return p.category === 'Ball Dresses';
    if (activeFilter === 'gowns') return p.category === 'Gowns';
    if (activeFilter === 'shoes') return p.category === 'Shoes';
    return true; // 'all'
  });

  // Limit to an editorial showcase (up to 8 curated pieces)
  const showcaseList = filteredProducts.slice(0, 8);

  const handleSwatchSelect = (productId: string, swatch: ProductSwatch, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSwatches((prev) => ({ ...prev, [productId]: swatch }));
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentSwatch = activeSwatches[product.id] || product.swatches[0];
    onAddToCart(product, currentSwatch, 1, e);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  // Badges for editorial interest
  const getBadgeForProduct = (index: number, product: Product) => {
    if (product.originalPrice) {
      const discount = Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      );
      return { text: `Save ${discount}%`, color: 'bg-[#2E5A36] text-white' };
    }
    if (index === 0) return { text: 'Atelier Spotlight', color: 'bg-[#171717] text-white' };
    if (index === 1) return { text: 'Heirloom Edition', color: 'bg-[#F4F3EF] text-[#171717] border border-[#E6E4DF]' };
    if (product.inventory <= 12) return { text: 'Only Few Left', color: 'bg-amber-100 text-amber-900 border border-amber-200' };
    return { text: 'Couture 2026', color: 'bg-white/95 text-[#171717] border border-[#E6E4DF]' };
  };

  return (
    <section className="w-full px-3 sm:px-5 lg:px-6 xl:px-8 pt-4 pb-6">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-5 border-b border-[#E6E4DF]">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#171717] leading-tight">
            Handcrafted for First Milestones & Grand Galas
          </h2>
          <p className="text-xs sm:text-sm text-[#737373] mt-2 leading-relaxed">
            A boutique selection of our most admired ceremonial creations. Each piece is hand-finished in our atelier with hypoallergenic combed cotton linings and delivered in our signature presentation keepsake box.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 self-start md:self-auto">
          {[
            { id: 'all', label: 'All Curations' },
            { id: 'featured', label: 'Atelier Picks' },
            { id: 'ball-dresses', label: 'Ball Gowns' },
            { id: 'gowns', label: 'Ceremony Gowns' },
            { id: 'shoes', label: 'Footwear' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as ShowcaseFilter)}
              className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'bg-white text-[#737373] hover:text-[#171717] hover:bg-[#F4F3EF] border border-[#E6E4DF]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid - 2 columns on mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6 mt-5 sm:mt-8">
        {showcaseList.map((product, idx) => {
          const currentSwatch = activeSwatches[product.id] || product.swatches[0];
          const isAdded = addedIds[product.id];
          const badge = getBadgeForProduct(idx, product);

          return (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="group bg-[#FFFFFF] rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 md:p-5 border border-[#E6E4DF] hover:border-[#171717]/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
            >
              <div>
                {/* Visual Image Container with aspect ratio optimized for both mobile and desktop */}
                <div className="relative aspect-square sm:aspect-[4/3] w-full rounded-xl sm:rounded-2xl overflow-hidden mb-2.5 sm:mb-4 bg-white shadow-xs">
                  <ProductVisual
                    product={product}
                    activeSwatch={currentSwatch}
                    showAgeTag={true}
                    className="h-full"
                  />

                  {/* Badge - hidden on mobile so image is clean */}
                  <span
                    className={`hidden sm:inline-block absolute top-2 right-2 sm:top-3 sm:right-3 px-1.5 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold shadow-2xs pointer-events-none z-10 ${badge.color}`}
                  >
                    {badge.text}
                  </span>

                  {/* Quick Add Floating Button */}
                  <button
                    onClick={(e) => handleQuickAdd(product, e)}
                    aria-label={`Add ${product.name} to bag`}
                    title="Add to shopping bag"
                    className={`absolute bottom-2 right-2 sm:bottom-3 sm:right-3 p-2 sm:p-2.5 rounded-full transition-all duration-200 z-20 shadow-md cursor-pointer ${
                      isAdded
                        ? 'bg-[#2E5A36] text-white scale-105'
                        : 'bg-white/95 text-[#171717] hover:bg-[#171717] hover:text-white border border-[#E6E4DF] active:scale-95'
                    }`}
                  >
                    {isAdded ? (
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    )}
                  </button>
                </div>

                {/* Category & Designer Tag */}
                <div className="flex items-center justify-between gap-1 sm:gap-2 text-[10px] sm:text-[11px] text-[#737373]">
                  <span className="uppercase tracking-wider font-semibold text-[#2E5A36] truncate">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-[#171717] text-[10px] sm:text-xs">{product.rating}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xs sm:text-base font-serif font-bold text-[#171717] mt-0.5 sm:mt-1.5 group-hover:text-black line-clamp-1">
                  {product.name}
                </h3>

                {/* Subtitle */}
                <p className="text-[10px] sm:text-xs text-[#737373] mt-0.5 sm:mt-1 line-clamp-1 sm:line-clamp-2 leading-relaxed">
                  {product.subtitle}
                </p>

                {/* Colorway Swatches Selector */}
                <div className="mt-2.5 sm:mt-3.5 flex items-center justify-between gap-1 sm:gap-2 pt-2 sm:pt-3 border-t border-[#E6E4DF]/60">
                  <span className="text-[10px] sm:text-[11px] text-[#737373] truncate">
                    <span className="hidden sm:inline">Color: </span><span className="text-[#171717] font-medium">{currentSwatch.name}</span>
                  </span>

                  <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                    {product.swatches.slice(0, 3).map((sw) => (
                      <button
                        key={sw.name}
                        onClick={(e) => handleSwatchSelect(product.id, sw, e)}
                        title={sw.name}
                        className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full transition-all flex items-center justify-center cursor-pointer ${
                          currentSwatch.name === sw.name
                            ? 'ring-2 ring-offset-1 ring-[#171717] scale-110'
                            : 'hover:scale-110 border border-black/15'
                        }`}
                        style={{ backgroundColor: sw.hex }}
                      />
                    ))}
                    {product.swatches.length > 3 && (
                      <span className="text-[9px] sm:text-[10px] text-[#737373]">
                        +{product.swatches.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3.5 border-t border-[#E6E4DF] flex items-center justify-between gap-1">
                <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
                  <span className="text-xs sm:text-base font-semibold text-[#171717] tabular-nums">
                    ₦{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-[10px] sm:text-xs text-[#737373] line-through tabular-nums">
                      ₦{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-[#171717] group-hover:text-[#2E5A36] group-hover:translate-x-0.5 transition-all shrink-0">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Atelier Service Guarantees Banner */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-2xl bg-[#F8F7F4] border border-[#E6E4DF]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white border border-[#E6E4DF] flex items-center justify-center text-[#2E5A36] shrink-0">
            <Gift className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[#171717]">Archival Gift Packaging</h4>
            <p className="text-[11px] text-[#737373]">Shipped in gold-foil embossed keepsake box</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white border border-[#E6E4DF] flex items-center justify-center text-[#2E5A36] shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[#171717]">100% Skin-Gentle Guarantee</h4>
            <p className="text-[11px] text-[#737373]">GOTS organic combed cotton lining on every dress</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white border border-[#E6E4DF] flex items-center justify-center text-[#2E5A36] shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[#171717]">White-Glove Express Dispatch</h4>
            <p className="text-[11px] text-[#737373]">Hand-packaged and delivered nationwide across Nigeria</p>
          </div>
        </div>
      </div>
    </section>
  );
};
