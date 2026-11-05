import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, X, Sparkles } from 'lucide-react';
import { KIDS_MEGA_CATEGORIES, MegaCategory, SubCategoryItem } from '../data/categoriesData';
import { ProductCategory } from '../types';

interface CategoriesMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (category: ProductCategory) => void;
  onSelectSubCategory?: (subCategory: SubCategoryItem) => void;
}

export const CategoriesMegaMenu: React.FC<CategoriesMegaMenuProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
  onSelectSubCategory,
}) => {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(KIDS_MEGA_CATEGORIES[0].id);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentCategory: MegaCategory =
    KIDS_MEGA_CATEGORIES.find((cat) => cat.id === activeCategoryId) || KIDS_MEGA_CATEGORIES[0];

  const handleCategoryClick = (categoryName: string) => {
    // Map to valid ProductCategory ('All' | 'Ball Dresses' | 'Gowns' | 'Shoes' | 'Kids Clothing')
    let target: ProductCategory = 'All';
    if (categoryName.toLowerCase().includes('ball dress')) {
      target = 'Ball Dresses';
    } else if (categoryName.toLowerCase().includes('gown')) {
      target = 'Gowns';
    } else if (categoryName.toLowerCase().includes('shoe')) {
      target = 'Shoes';
    } else if (categoryName.toLowerCase().includes('clothing')) {
      target = 'Kids Clothing';
    }

    onSelectCategory(target);
    onClose();

    // Scroll to catalog section
    const el = document.getElementById('catalog-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubCategoryClick = (subItem: SubCategoryItem) => {
    if (onSelectSubCategory) {
      onSelectSubCategory(subItem);
    }
    handleCategoryClick(subItem.parentCategory);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Mega Menu Window anchored right under Navbar */}
      <div className="relative w-full px-2.5 sm:px-8 lg:px-12 xl:px-16 pt-16 sm:pt-20">
        <div
          ref={menuRef}
          className="bg-[#FFFFFF] rounded-2xl sm:rounded-3xl border border-[#E6E4DF] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-3 duration-250 flex flex-col md:flex-row max-h-[85vh]"
        >
          {/* Left Panel: Category Sidebar / Mobile Strip */}
          <div className="w-full md:w-64 lg:w-72 bg-[#FAF9F6] border-b md:border-b-0 md:border-r border-[#E6E4DF] py-2 sm:py-3 shrink-0">
            <div className="hidden md:flex px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[#737373] items-center justify-between">
              <span>All Collections</span>
              <span className="text-[10px] text-[#A39E93]">Babies Touch</span>
            </div>

            <nav className="flex md:flex-col gap-1.5 md:gap-0.5 px-3 md:px-2 overflow-x-auto md:overflow-y-auto scrollbar-none py-1 md:py-0">
              {KIDS_MEGA_CATEGORIES.map((cat) => {
                const isSelected = cat.id === activeCategoryId;
                return (
                  <button
                    key={cat.id}
                    onMouseEnter={() => setActiveCategoryId(cat.id)}
                    onClick={() => setActiveCategoryId(cat.id)}
                    className={`shrink-0 md:w-full flex items-center justify-between px-3 md:px-4 py-1.5 md:py-3 rounded-full md:rounded-2xl text-left text-xs transition-all whitespace-nowrap ${
                      isSelected
                        ? 'bg-[#171717] md:bg-[#FFFFFF] text-white md:text-[#171717] font-semibold shadow-xs md:border md:border-[#E6E4DF]'
                        : 'bg-white md:bg-transparent border border-[#E6E4DF] md:border-transparent text-[#737373] hover:text-[#171717] hover:bg-[#F3F1EC]'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <ChevronRight
                      className={`hidden md:inline w-4 h-4 shrink-0 transition-transform ${
                        isSelected ? 'text-[#171717] translate-x-0.5' : 'text-[#A39E93]'
                      }`}
                    />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Panel: Sub-Categories Grid with Circular Images */}
          <div className="flex-1 p-4 sm:p-8 overflow-y-auto bg-white flex flex-col justify-between">
            <div>
              {/* Header: All Category Link like the reference screenshot */}
              <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-[#E6E4DF]/80 mb-4 sm:mb-6">
                <div>
                  <button
                    onClick={() => handleCategoryClick(currentCategory.name)}
                    className="group inline-flex items-center gap-1.5 sm:gap-2 text-sm sm:text-lg font-serif font-bold text-[#171717] hover:text-black transition-colors text-left"
                  >
                    <span>{currentCategory.allLinkText}</span>
                    <ChevronRight className="w-4 h-4 text-[#737373] group-hover:translate-x-1 transition-transform" />
                  </button>
                  <p className="text-[11px] sm:text-xs text-[#737373] mt-0.5">
                    {currentCategory.subtitle}
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="p-1.5 sm:p-2 rounded-full text-[#737373] hover:text-[#171717] hover:bg-[#F4F3EF] transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Grid of Circular Sub-Category Cards (3 cols mobile, 5 cols desktop) */}
              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-4 sm:gap-y-6 gap-x-2 sm:gap-x-4">
                {currentCategory.subcategories.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => handleSubCategoryClick(sub)}
                    className="group flex flex-col items-center text-center cursor-pointer focus:outline-none"
                  >
                    {/* Circle Image Wrapper with HOT/NEW badge */}
                    <div className="relative w-16 h-16 sm:w-22 sm:h-22 rounded-full overflow-hidden bg-[#FAF9F6] border-2 border-[#E6E4DF] group-hover:border-[#171717] group-hover:shadow-md transition-all duration-300 p-0.5">
                      <img
                        src={sub.image}
                        alt={sub.name}
                        className="w-full h-full object-cover object-center rounded-full brightness-[1.05] contrast-[1.02] group-hover:scale-108 transition-transform duration-300"
                      />

                      {/* Orange HOT Badge from Reference */}
                      {sub.isHot && (
                        <span className="absolute top-0 right-0 px-1 py-0.2 rounded-full bg-[#EA580C] text-white text-[8px] sm:text-[9px] font-bold tracking-tight shadow-xs uppercase">
                          HOT
                        </span>
                      )}

                      {/* Green NEW Badge */}
                      {sub.isNew && (
                        <span className="absolute top-0 right-0 px-1 py-0.2 rounded-full bg-[#2E5A36] text-white text-[8px] sm:text-[9px] font-bold tracking-tight shadow-xs uppercase">
                          NEW
                        </span>
                      )}
                    </div>

                    {/* Sub-Category Label */}
                    <span className="mt-1.5 sm:mt-2.5 text-[11px] sm:text-xs text-[#171717] font-medium leading-tight max-w-[95px] sm:max-w-[105px] line-clamp-2 group-hover:text-black group-hover:font-semibold transition-colors">
                      {sub.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Atelier note */}
            <div className="mt-8 pt-4 border-t border-[#E6E4DF]/70 flex items-center justify-between text-xs text-[#737373]">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#2E5A36]" />
                <span>100% GOTS-certified organic cotton lining in every garment</span>
              </div>
              <button
                onClick={() => {
                  onSelectCategory('All');
                  onClose();
                  const el = document.getElementById('catalog-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs font-semibold text-[#171717] hover:underline"
              >
                View Full Boutique Catalog →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
