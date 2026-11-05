import React, { useState } from 'react';
import {
  Product,
  CartItem,
  Order,
  ViewMode,
  ProductCategory,
  ProductSwatch,
  ProductVariation,
} from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { HeroBento } from './components/HeroBento';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { OrderConfirmationView } from './components/OrderConfirmationView';
import { AdminDashboard } from './components/AdminDashboard';
import { Toast } from './components/Toast';
import { FlyToCartAnimation, FlyItemData } from './components/FlyToCartAnimation';
import { CategoriesMegaMenu } from './components/CategoriesMegaMenu';
import { CuratedShowcase } from './components/CuratedShowcase';
import { FashionProductShowcase } from './components/FashionProductShowcase';
import { BabiesTouchLogo } from './components/BabiesTouchLogo';
import { adminStorage } from './services/adminStorage';

export default function App() {
  // Global App State with Persistent Storage Sync
  const [products, setProducts] = useState<Product[]>(() => adminStorage.getProducts());
  const [orders, setOrders] = useState<Order[]>(() => adminStorage.getOrders());
  const [viewMode, setViewMode] = useState<ViewMode>('storefront');

  // Filter & Navigation State
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  // Cart State (Initialized with 1 item for immediate delight)
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: `${INITIAL_PRODUCTS[0].id}-${INITIAL_PRODUCTS[0].swatches[0].name}`,
      product: INITIAL_PRODUCTS[0],
      selectedSwatch: INITIAL_PRODUCTS[0].swatches[0],
      quantity: 1,
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [discountRate, setDiscountRate] = useState<number>(0);

  // Active Product Modal Detail State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Order Confirmation State
  const [recentOrder, setRecentOrder] = useState<Order | null>(null);

  // Fly-to-cart visual animation state
  const [flyingItems, setFlyingItems] = useState<FlyItemData[]>([]);
  const [isCartBumping, setIsCartBumping] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
  }>({
    visible: false,
    message: '',
  });

  const showToast = (message: string, actionLabel?: string, onAction?: () => void) => {
    setToast({
      visible: true,
      message,
      actionLabel,
      onAction,
    });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 4000);
  };

  // Cart operations with Flying Circular Image Animation
  const handleAddToCart = (
    product: Product,
    swatch: ProductSwatch,
    quantity: number,
    event?: React.MouseEvent | HTMLElement | { x: number; y: number },
    variation?: ProductVariation,
    size?: string
  ) => {
    // 1. Calculate start origin coordinates
    let startX = window.innerWidth / 2;
    let startY = window.innerHeight / 2;

    if (event) {
      if ('clientX' in event && typeof (event as React.MouseEvent).clientX === 'number') {
        startX = (event as React.MouseEvent).clientX;
        startY = (event as React.MouseEvent).clientY;
      } else if ('getBoundingClientRect' in (event as HTMLElement)) {
        const rect = (event as HTMLElement).getBoundingClientRect();
        startX = rect.left + rect.width / 2;
        startY = rect.top + rect.height / 2;
      } else if ('x' in (event as { x: number; y: number })) {
        startX = (event as { x: number; y: number }).x;
        startY = (event as { x: number; y: number }).y;
      }
    }

    // 2. Locate target Cart Bag element at the top right in Navbar
    const bagElement = document.getElementById('nav-cart-bag-pill');
    let targetX = window.innerWidth - 80;
    let targetY = 40;
    if (bagElement) {
      const bagRect = bagElement.getBoundingClientRect();
      targetX = bagRect.left + bagRect.width / 2;
      targetY = bagRect.top + bagRect.height / 2;
    }

    // 3. Dispatch flying circular product item
    const flightId = `fly-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setFlyingItems((prev) => [
      ...prev,
      {
        id: flightId,
        product,
        swatch,
        startX,
        startY,
        targetX,
        targetY,
      },
    ]);

    // 4. Update cart contents with variation & size consistency
    const itemId = `${product.id}-${variation?.id || swatch.name}-${size || 'std'}`;
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.id === itemId);
      if (existing) {
        return prevCart.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prevCart,
        {
          id: itemId,
          product,
          selectedSwatch: swatch,
          selectedVariation: variation,
          selectedSize: size,
          quantity,
        },
      ];
    });

    const label = variation ? `${product.name} (${variation.name})` : `${product.name} (${swatch.name})`;
    showToast(`Added ${label} to bag`, 'Open Bag', () =>
      setIsCartOpen(true)
    );
  };

  const handleFlyItemLanded = (id: string) => {
    setFlyingItems((prev) => prev.filter((item) => item.id !== id));
    setIsCartBumping(true);
    setTimeout(() => setIsCartBumping(false), 380);
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    showToast('Item removed from shopping bag');
  };

  const handleApplyPromoCode = (code: string) => {
    if (code === 'BABIESTOUCH' || code === 'SLOWHOME') {
      setDiscountRate(0.1);
      showToast('10% Babies Touch Atelier Discount applied');
      return true;
    }
    return false;
  };

  // Checkout & Order Placement
  const handleOrderPlaced = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setRecentOrder(newOrder);
    setCart([]);
    setViewMode('order-success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Order #${newOrder.id} successfully authorized`);
  };

  // Admin Actions
  const handleUpdateOrderStatus = (
    orderId: string,
    newStatus: Order['status']
  ) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Order #${orderId} marked as ${newStatus}`);
  };

  const handleUpdateProductStock = (productId: string, newInventory: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, inventory: newInventory } : p))
    );
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Added ${newProduct.name} to atelier catalog`);
  };

  // Cart summary numbers in Naira
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const featuredProduct = products.find((p) => p.isFeatured) || products[0];

  return (
    <div className="min-h-screen bg-[#F4F3EF] text-[#171717] flex flex-col font-sans selection:bg-[#E6ECE3] selection:text-[#2E5A36]">
      {/* Primary Sticky Navbar (Always visible across Storefront, Checkout, and Confirmation) */}
      {viewMode !== 'admin' && (
        <Navbar
          viewMode={viewMode}
          setViewMode={setViewMode}
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            if (viewMode !== 'storefront') {
              setViewMode('storefront');
            }
          }}
          cartCount={cartCount}
          cartSubtotal={cartSubtotal}
          onOpenCart={() => setIsCartOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isCartBumping={isCartBumping}
          isMegaMenuOpen={isMegaMenuOpen}
          onToggleMegaMenu={() => setIsMegaMenuOpen((prev) => !prev)}
        />
      )}

      {/* VIEW MODE 1: STOREFRONT */}
      {viewMode === 'storefront' && (
        <main className="flex-1">
          {/* Hero Section Bento Grid */}
          <HeroBento
            featuredProduct={featuredProduct}
            onAddToCart={handleAddToCart}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onExploreClick={() => {
              const el = document.getElementById('fashion-showcase-section') || document.getElementById('catalog-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Product Grid Catalog */}
          <ProductGrid
            products={products}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onAddToCart={handleAddToCart}
            searchQuery={searchQuery}
            onOpenCategoriesMenu={() => setIsMegaMenuOpen(true)}
            onClearSearch={() => setSearchQuery('')}
          />

          {/* CENTER OF PAGE: "Wear Confidence" Premium Showcase Section */}
          <section
            id="fashion-showcase-section"
            className="w-full overflow-hidden bg-black my-6 sm:my-10 border-y border-[#E6E4DF]/60 shadow-lg"
          >
            <FashionProductShowcase
              onSelectProduct={(p) => setSelectedProduct(p)}
              onAddToCart={handleAddToCart}
              onExploreClick={() => {
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </section>

          {/* Curated Products Section */}
          <CuratedShowcase
            products={products}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onAddToCart={handleAddToCart}
          />

          {/* Quiet Newsletter & Footer */}
          <footer className="border-t border-[#E6E4DF] bg-[#F4F3EF] mt-6">
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-14">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-5 space-y-4">
                  <BabiesTouchLogo
                    size="lg"
                    showWordmark={true}
                    showTagline={true}
                    showLocation={true}
                    locationText="Main Market, Onitsha"
                  />
                  <p className="text-xs text-[#737373] max-w-sm leading-relaxed mt-2">
                    Bespoke children's couture boutique specializing in luxury ball dresses, birthday gowns, artisanal shoes, and boys' formalwear. Crafted for magical milestones.
                  </p>
                  <p className="text-[11px] text-[#A39E93]">
                    © 2026 Babies Touch Couture Ltd · Main Market, Onitsha, Nigeria.
                  </p>
                </div>

                <div className="lg:col-span-3 space-y-2 text-xs">
                  <h4 className="font-semibold text-[#171717] uppercase tracking-wider text-[11px] mb-3">
                    Flagship Store & Pickup
                  </h4>
                  <p className="text-[#171717] font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#2E5A36] animate-pulse" />
                    Main Market, Onitsha
                  </p>
                  <p className="text-[#737373]">Anambra State, Nigeria</p>
                  <p className="text-[#737373] text-[11px] pt-0.5">
                    Mon – Sat: 8:00 AM – 6:00 PM WAT
                  </p>
                  <p className="text-[#737373] text-[11px] pt-1">
                    WhatsApp / Call: <span className="text-[#171717] font-medium">+234 803 123 4567</span><br />
                    Email: <span className="text-[#171717] font-medium">babiestouchsupport@gmail.com</span>
                  </p>
                  <div className="pt-2 hidden md:block">
                    <button
                      onClick={() => setViewMode('admin')}
                      className="text-xs font-medium text-[#2E5A36] hover:underline"
                    >
                      Atelier Admin Portal →
                    </button>
                  </div>
                </div>

                {/* Newsletter */}
                <div className="lg:col-span-4 space-y-3">
                  <h4 className="font-semibold text-[#171717] uppercase tracking-wider text-[11px]">
                    The Milestone Journal
                  </h4>
                  <p className="text-xs text-[#737373]">
                    Receive invitations to new bespoke ball gown drops, styling advice, and ceremonial milestone guides.
                  </p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      showToast('Thank you for subscribing to The Milestone Journal');
                    }}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1"
                  >
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      className="w-full sm:flex-1 px-4 py-2.5 rounded-full border border-[#E6E4DF] bg-white text-xs text-[#171717] placeholder:text-[#A39E93] focus:outline-none focus:border-[#171717]"
                    />
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#171717] text-white text-xs font-semibold hover:bg-black transition-colors"
                    >
                      Join
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </footer>
        </main>
      )}

      {/* VIEW MODE 2: CHECKOUT */}
      {viewMode === 'checkout' && (
        <CheckoutView
          items={cart}
          discountRate={discountRate}
          onBackToStore={() => setViewMode('storefront')}
          onOrderPlaced={handleOrderPlaced}
        />
      )}

      {/* VIEW MODE 3: ORDER SUCCESS */}
      {viewMode === 'order-success' && recentOrder && (
        <OrderConfirmationView
          order={recentOrder}
          onReturnToStore={() => setViewMode('storefront')}
          onViewInAdmin={() => setViewMode('admin')}
        />
      )}

      {/* VIEW MODE 4: ADMIN DASHBOARD */}
      {viewMode === 'admin' && (
        <AdminDashboard
          orders={orders}
          products={products}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onUpdateProductStock={handleUpdateProductStock}
          onAddProduct={handleAddProduct}
          onReturnToStore={() => setViewMode('storefront')}
        />
      )}

      {/* Visual Categories & Subcategories Mega Menu Modal */}
      <CategoriesMegaMenu
        isOpen={isMegaMenuOpen}
        onClose={() => setIsMegaMenuOpen(false)}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setSearchQuery('');
          setIsMegaMenuOpen(false);
          const el = document.getElementById('catalog-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onSelectSubCategory={(subItem) => {
          setActiveCategory(subItem.parentCategory as ProductCategory);
          // Highlight with search query or toast
          setSearchQuery(subItem.name.split(' ')[0]);
          setIsMegaMenuOpen(false);
          showToast(`Viewing ${subItem.name} in ${subItem.parentCategory}`);
          const el = document.getElementById('catalog-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setViewMode('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        discountRate={discountRate}
        onApplyPromoCode={handleApplyPromoCode}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        isVisible={toast.visible}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
        actionLabel={toast.actionLabel}
        onAction={toast.onAction}
      />

      {/* Dynamic Fly to Cart Animation Layer */}
      <FlyToCartAnimation
        items={flyingItems}
        onItemLanded={handleFlyItemLanded}
      />
    </div>
  );
}
