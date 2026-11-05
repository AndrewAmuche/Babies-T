import React from 'react';
import { ShoppingBag, LayoutDashboard, Store, Search, X, ChevronDown, LayoutGrid, MapPin } from 'lucide-react';
import { ProductCategory, ViewMode } from '../types';
import { BabiesTouchLogo } from './BabiesTouchLogo';

interface NavbarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  activeCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  cartCount: number;
  cartSubtotal: number;
  onOpenCart: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isCartBumping?: boolean;
  isMegaMenuOpen?: boolean;
  onToggleMegaMenu?: () => void;
}

const CATEGORIES: ProductCategory[] = ['All', 'Ball Dresses', 'Gowns', 'Shoes', 'Kids Clothing'];

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  setViewMode,
  activeCategory,
  onSelectCategory,
  cartCount,
  cartSubtotal,
  onOpenCart,
  searchQuery,
  setSearchQuery,
  isCartBumping = false,
  isMegaMenuOpen = false,
  onToggleMegaMenu,
}) => {
  const [showSearch, setShowSearch] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F4F3EF]/95 backdrop-blur-md border-b border-[#E6E4DF] transition-all">
      {/* Top Boutique Announcement Bar */}
      <div className="w-full bg-[#171717] text-white py-1 px-3 sm:px-4 text-[10px] sm:text-[11px] font-medium flex items-center justify-between sm:justify-center gap-2 sm:gap-3 overflow-hidden">
        <div className="flex items-center gap-1.5 text-emerald-300 shrink-0 truncate">
          <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
          <span>Flagship: <strong>Main Market, Onitsha</strong></span>
        </div>
        <span className="text-white/40 hidden sm:inline">·</span>
        <span className="text-white/85 hidden sm:inline truncate">
          Nationwide Waybill & Doorstep Delivery Across Nigeria
        </span>
        <span className="text-white/40 hidden md:inline">·</span>
        <span className="text-[#FF7BB3] hidden md:inline font-serif italic">
          Simply Magical
        </span>
      </div>

      <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-6">
        {/* Zone 1: Optimized Brand Logo & Wordmark */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => {
              setViewMode('storefront');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex items-center focus:outline-none text-left cursor-pointer"
            aria-label="Babies Touch — Simply Magical (Main Market Onitsha)"
          >
            <BabiesTouchLogo
              size="md"
              showWordmark={true}
              showLocation={true}
              locationText="Main Market, Onitsha"
            />
          </button>
        </div>

        {/* Zone 2: Navigation Category Links & Mega Menu Trigger */}
        {viewMode !== 'admin' && (
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-[#737373]">
            {/* Interactive Categories Mega Menu Button */}
            <button
              onClick={onToggleMegaMenu}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isMegaMenuOpen
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'bg-white hover:bg-[#FAF9F6] border border-[#E6E4DF] text-[#171717] shadow-2xs hover:border-[#D8D6D0]'
              }`}
              aria-label="Browse all categories and subcategories"
              title="Browse categories & visual subcategories"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-[#2E5A36]" />
              <span>Categories</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isMegaMenuOpen ? 'rotate-180 text-white' : 'text-[#737373]'
                }`}
              />
            </button>

            {CATEGORIES.map((cat) => {
              const label = cat === 'All' ? 'Shop all' : cat;
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    onSelectCategory(cat);
                    if (viewMode !== 'storefront') {
                      setViewMode('storefront');
                    }
                  }}
                  className={`relative py-1 whitespace-nowrap transition-colors hover:text-[#171717] ${
                    isActive ? 'text-[#171717] font-semibold' : ''
                  }`}
                >
                  {label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#171717] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        )}

        {viewMode === 'admin' && (
          <div className="hidden md:flex items-center gap-3 text-sm text-[#737373]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6ECE3] text-[#2E5A36] text-xs font-medium">
              Admin Portal Active
            </span>
            <span className="text-xs text-[#737373]">Live boutique inventory & orders</span>
          </div>
        )}

        {/* Zone 3: Actions (Search, Admin/Storefront toggle, Bag Pill) */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Quick Search */}
          {viewMode !== 'admin' && (
            <div className="relative flex items-center">
              {showSearch ? (
                <div className="flex items-center bg-white border border-[#E6E4DF] rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 shadow-xs w-36 sm:w-64 transition-all">
                  <Search className="w-3.5 h-3.5 text-[#737373] mr-1.5 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full text-xs text-[#171717] placeholder:text-[#737373] bg-transparent focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setShowSearch(false);
                    }}
                    className="text-[#737373] hover:text-[#171717] ml-1 p-0.5"
                    aria-label="Close search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSearch(true)}
                  aria-label="Search collection"
                  className="p-2 sm:p-2.5 rounded-full text-[#737373] hover:text-[#171717] hover:bg-white/80 transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Admin / Storefront Toggle - only available on desktop */}
          <button
            onClick={() => setViewMode(viewMode === 'admin' ? 'storefront' : 'admin')}
            className="hidden md:flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-full border border-[#E6E4DF] bg-white text-[#171717] hover:bg-[#F9F9F7] hover:border-[#D8D6D0] transition-colors shadow-2xs"
            title={viewMode === 'admin' ? 'Switch to Storefront' : 'Switch to Admin Dashboard'}
          >
            {viewMode === 'admin' ? (
              <>
                <Store className="w-3.5 h-3.5 text-[#2E5A36]" />
                <span>Storefront</span>
              </>
            ) : (
              <>
                <LayoutDashboard className="w-3.5 h-3.5 text-[#737373]" />
                <span>Admin</span>
              </>
            )}
          </button>

          {/* Bag Pill (Count + Amount in Naira) with reactive landing bounce */}
          <button
            id="nav-cart-bag-pill"
            onClick={onOpenCart}
            aria-label="Open shopping bag"
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-white transition-all duration-200 shadow-sm ${
              isCartBumping
                ? 'scale-105 sm:scale-110 bg-[#2E5A36] ring-4 ring-[#2E5A36]/30 shadow-md'
                : 'bg-[#171717] hover:bg-[#2C2C2C] active:scale-98'
            }`}
          >
            <ShoppingBag className={`w-3.5 h-3.5 transition-transform duration-200 ${isCartBumping ? '-rotate-12 scale-110' : ''}`} />
            <span className="text-xs font-semibold whitespace-nowrap">
              Bag ({cartCount})
            </span>
            {cartCount > 0 && (
              <span className="hidden md:inline text-xs text-[#E6ECE3] border-l border-white/20 pl-2 tabular-nums">
                ₦{cartSubtotal.toLocaleString()}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Category strip */}
      {viewMode === 'storefront' && (
        <div className="md:hidden flex items-center gap-1.5 px-3 py-2 overflow-x-auto scrollbar-none border-t border-[#E6E4DF]/60 bg-[#F4F3EF]">
          <button
            onClick={onToggleMegaMenu}
            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap shadow-xs shrink-0 transition-colors ${
              isMegaMenuOpen
                ? 'bg-[#2E5A36] text-white'
                : 'bg-[#171717] text-white'
            }`}
          >
            <LayoutGrid className="w-3 h-3 text-white/90" />
            <span>Categories</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          {CATEGORIES.map((cat) => {
            const label = cat === 'All' ? 'Shop all' : cat;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-[#171717] text-white'
                    : 'bg-white border border-[#E6E4DF] text-[#737373]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
