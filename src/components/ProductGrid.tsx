import React, { useState } from 'react';
import { Plus, Check, SlidersHorizontal, ArrowUpDown, LayoutGrid } from 'lucide-react';
import { Product, ProductCategory, ProductSwatch } from '../types';
import { ProductVisual } from './ProductVisual';

interface ProductGridProps {
  products: Product[];
  activeCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (
    product: Product,
    swatch: ProductSwatch,
    quantity: number,
    event?: React.MouseEvent
  ) => void;
  searchQuery: string;
  onOpenCategoriesMenu?: () => void;
  onClearSearch?: () => void;
}

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name';

const CATEGORIES: ProductCategory[] = ['All', 'Ball Dresses', 'Gowns', 'Shoes', 'Kids Clothing'];

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  activeCategory,
  onSelectCategory,
  onSelectProduct,
  onAddToCart,
  searchQuery,
  onOpenCategoriesMenu,
  onClearSearch,
}) => {
  const [sortOption, setSortOption] = useState<SortOption>('featured');
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  // Filter products by category and search
  const filtered = products.filter((p) => {
    const matchesCategory =
      activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortOption === 'price-asc') return a.price - b.price;
    if (sortOption === 'price-desc') return b.price - a.price;
    if (sortOption === 'name') return a.name.localeCompare(b.name);
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToCart(product, product.swatches[0], 1, e);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  return (
    <section id="catalog-section" className="w-full px-2.5 sm:px-5 lg:px-6 xl:px-8 pt-4 pb-6">
      {/* Section Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 pb-4 sm:pb-5 border-b border-[#E6E4DF]">
        <div>
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#737373] font-semibold">
            The Babies Touch Collection
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#171717] mt-0.5 sm:mt-1">
            Artisanal Children's Couture
          </h2>
          <p className="text-xs sm:text-sm text-[#737373] mt-1 sm:mt-1.5 leading-relaxed">
            Handcrafted ball dresses, ceremony gowns, leather shoes, and gentle organic clothing.
          </p>
        </div>

        {/* Filter Pills and Sort Bar */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 w-full md:w-auto">
          {/* Category Tabs (Segmented Button Pills with horizontal scroll on mobile) */}
          <div className="flex items-center p-1 bg-white border border-[#E6E4DF] rounded-full shadow-2xs overflow-x-auto max-w-full scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-3 sm:px-4 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-[#171717] text-white shadow-xs'
                      : 'text-[#737373] hover:text-[#171717]'
                  }`}
                >
                  {cat === 'All' ? 'All Pieces' : cat}
                </button>
              );
            })}
            {/* Interactive Mega Menu Subcategory Trigger */}
            {onOpenCategoriesMenu && (
              <button
                onClick={onOpenCategoriesMenu}
                className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#FAF9F6] hover:bg-[#F3F1EC] text-[#171717] border border-[#E6E4DF] shadow-2xs transition-all cursor-pointer shrink-0"
                title="Open photo-rich categories and subcategories browser"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-[#2E5A36]" />
                <span>Browse Subcategories</span>
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white border border-[#E6E4DF] rounded-full px-3 py-1.5 text-xs text-[#171717] shadow-2xs shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#737373]" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="bg-transparent text-xs text-[#171717] font-medium focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Item count & active filter summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#737373] py-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span>
            Showing <strong className="text-[#171717] font-semibold">{sorted.length}</strong> {sorted.length === 1 ? 'piece' : 'pieces'}
            {activeCategory !== 'All' && <span> in {activeCategory}</span>}
          </span>
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E6ECE3] text-[#2E5A36] text-[11px] font-medium">
              <span>Matching: "{searchQuery}"</span>
              {onClearSearch && (
                <button
                  onClick={onClearSearch}
                  className="hover:text-black font-bold ml-1 text-xs cursor-pointer"
                  title="Clear filter"
                >
                  ×
                </button>
              )}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {onOpenCategoriesMenu && (
            <button
              onClick={onOpenCategoriesMenu}
              className="inline-flex items-center gap-1.5 text-xs text-[#171717] font-semibold hover:text-[#2E5A36] underline cursor-pointer"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-[#2E5A36]" />
              <span>Visual Subcategory Guide →</span>
            </button>
          )}
          <span className="hidden sm:inline">Delivered in signature heirloom gift packaging</span>
        </div>
      </div>

      {/* Grid of Cards */}
      {sorted.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-[#E6E4DF] p-8">
          <SlidersHorizontal className="w-8 h-8 text-[#737373] mx-auto mb-3" />
          <h3 className="text-lg font-serif font-semibold text-[#171717]">
            No pieces match your selection
          </h3>
          <p className="text-xs text-[#737373] mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or explore our complete catalog of handcrafted children's clothing.
          </p>
          <button
            onClick={() => {
              onSelectCategory('All');
            }}
            className="mt-4 px-5 py-2 rounded-full bg-[#171717] text-white text-xs font-medium hover:bg-black"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
          {sorted.map((product) => {
            const isAdded = addedIds[product.id];
            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group bg-[#FFFFFF] rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 md:p-5 border border-[#E6E4DF] hover:border-[#D5D3CC] hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Top Image Container with aspect ratio optimized for both mobile and desktop */}
                  <div className="relative aspect-square sm:aspect-[4/3] w-full rounded-xl sm:rounded-2xl overflow-hidden mb-2.5 sm:mb-4 bg-[#FFFFFF]">
                    <ProductVisual
                      product={product}
                      activeSwatch={product.swatches[0]}
                      showAgeTag={true}
                      className="h-full"
                    />

                    {/* Quick Add floating pill on hover / tap */}
                    <button
                      onClick={(e) => handleQuickAdd(e, product)}
                      aria-label={`Add ${product.name} to bag`}
                      className={`absolute bottom-2 right-2 sm:bottom-3 sm:right-3 p-2 sm:p-2.5 rounded-full transition-all duration-200 z-20 shadow-sm cursor-pointer ${
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

                    {/* Stock or Feature badge - hidden on mobile */}
                    {product.isFeatured && (
                      <span className="hidden sm:inline-block absolute top-2 right-2 sm:top-3 sm:right-3 px-1.5 sm:px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[9px] sm:text-[10px] font-semibold text-[#171717] border border-[#E6E4DF] shadow-2xs">
                        Atelier Pick
                      </span>
                    )}
                  </div>

                  {/* Clean unboxed metadata */}
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-[#737373] uppercase tracking-wider font-medium truncate">
                    <span className="truncate">{product.category}</span>
                    <span aria-hidden="true" className="shrink-0">·</span>
                    <span className="truncate">{product.designer}</span>
                  </div>

                  {/* Product Title */}
                  <h3 className="text-xs sm:text-base font-semibold text-[#171717] mt-0.5 sm:mt-1 group-hover:text-black transition-colors line-clamp-1">
                    {product.name}
                  </h3>

                  <p className="text-[10px] sm:text-xs text-[#737373] mt-0.5 line-clamp-1 sm:line-clamp-2 leading-relaxed">
                    {product.subtitle}
                  </p>
                </div>

                {/* Card Footer: Price in Naira & Swatch previews */}
                <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3.5 border-t border-[#E6E4DF]/70 flex items-center justify-between gap-1">
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

                  {/* Swatches dots preview */}
                  <div className="flex items-center gap-1 sm:gap-1.5 shrink-0" title={`${product.swatches.length} colorways available`}>
                    {product.swatches.slice(0, 3).map((sw) => (
                      <span
                        key={sw.name}
                        className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: sw.hex }}
                      />
                    ))}
                    {product.swatches.length > 3 && (
                      <span className="text-[9px] sm:text-[10px] text-[#737373]">+{product.swatches.length - 3}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
