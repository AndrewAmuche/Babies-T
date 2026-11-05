import React, { useState, useEffect } from 'react';
import {
  Package,
  ShoppingCart,
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Truck,
  Plus,
  ArrowUpRight,
  Store,
  Layers,
  BarChart3,
  Sliders,
  FolderTree,
  Tag,
  Boxes,
  Users,
  Image as ImageIcon,
  Ticket,
  TrendingUp,
  Settings,
  AlertTriangle,
  Clock,
  Filter,
  Trash2,
  Copy,
  Eye,
  Check,
  X,
  Upload,
  Download,
  Printer,
  Sparkles,
  ChevronDown,
  Edit,
  Shield,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import {
  Order,
  Product,
  AdminTab,
  CategoryItem,
  ProductAttribute,
  TagItem,
  MediaItem,
  CouponItem,
  CustomerItem,
  ActivityLogItem,
  ProductVariation,
  AdminRole,
  StoreSettings,
} from '../types';
import { adminStorage } from '../services/adminStorage';
import { ProductEditorModal } from './admin/ProductEditorModal';
import { MediaLibraryModal } from './admin/MediaLibraryModal';
import { CategoryModal } from './admin/CategoryModal';
import { AttributeModal } from './admin/AttributeModal';
import { OrderDetailsModal } from './admin/OrderDetailsModal';
import { OrderPackingSlipModal } from './admin/OrderPackingSlipModal';
import { BabiesTouchLogo } from './BabiesTouchLogo';

interface AdminDashboardProps {
  orders: Order[];
  products: Product[];
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  onUpdateProductStock: (productId: string, newInventory: number) => void;
  onAddProduct: (product: Product) => void;
  onReturnToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders: propOrders,
  products: propProducts,
  onUpdateOrderStatus,
  onUpdateProductStock,
  onAddProduct,
  onReturnToStore,
}) => {
  // Storage synchronized states
  const [productsList, setProductsList] = useState<Product[]>(() =>
    adminStorage.getProducts()
  );
  const [ordersList, setOrdersList] = useState<Order[]>(() =>
    adminStorage.getOrders()
  );
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>(() =>
    adminStorage.getCategories()
  );
  const [attributesList, setAttributesList] = useState<ProductAttribute[]>(() =>
    adminStorage.getAttributes()
  );
  const [tagsList, setTagsList] = useState<TagItem[]>(() =>
    adminStorage.getTags()
  );
  const [mediaList, setMediaList] = useState<MediaItem[]>(() =>
    adminStorage.getMedia()
  );
  const [couponsList, setCouponsList] = useState<CouponItem[]>(() =>
    adminStorage.getCoupons()
  );
  const [customersList, setCustomersList] = useState<CustomerItem[]>(() =>
    adminStorage.getCustomers()
  );
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(() =>
    adminStorage.getActivityLogs()
  );
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() =>
    adminStorage.getSettings()
  );

  // Active Tab and Layout
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Active Admin Role Simulator
  const [currentRole, setCurrentRole] = useState<AdminRole>('Super Admin');

  // Modals Controller State
  const [editorModalOpen, setEditorModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  const [attributeModalOpen, setAttributeModalOpen] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<ProductAttribute | null>(null);

  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [printOrderModal, setPrintOrderModal] = useState<Order | null>(null);

  // Variation direct photo assignment target
  const [variationPhotoTarget, setVariationPhotoTarget] = useState<{
    productId: string;
    variationId: string;
  } | null>(null);

  // Coupon creator modal
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponVal, setNewCouponVal] = useState('10');
  const [newCouponMin, setNewCouponMin] = useState('50000');
  const [newCouponExp, setNewCouponExp] = useState('2026-12-31');

  // Overview Date Filter
  const [overviewDateRange, setOverviewDateRange] = useState<'today' | '7D' | '30D' | '12M'>('7D');

  // Products Tab Filters, Search, Sort & Pagination
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [productStatusFilter, setProductStatusFilter] = useState<'All' | 'published' | 'draft' | 'archived'>('All');
  const [productTypeFilter, setProductTypeFilter] = useState<'All' | 'simple' | 'variable'>('All');
  const [productStockFilter, setProductStockFilter] = useState<'All' | 'in-stock' | 'low-stock' | 'out-of-stock'>('All');
  const [productSortBy, setProductSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'stock-asc' | 'name-asc'>('newest');
  const [productPage, setProductPage] = useState(1);
  const PRODUCTS_PER_PAGE = 8;
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Inventory Tab Filters & Search
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryStockFilter, setInventoryStockFilter] = useState<'All' | 'healthy' | 'low' | 'out'>('All');
  const [expandedInventoryProdId, setExpandedInventoryProdId] = useState<string | null>(null);

  // Orders Tab Filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');

  // Tags Tab New Tag input
  const [newTagNameInput, setNewTagNameInput] = useState('');

  // Settings Tab Audit Log Filter
  const [auditLogTypeFilter, setAuditLogTypeFilter] = useState<string>('All');

  // Notification Toast
  const [adminToast, setAdminToast] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setAdminToast(msg);
    setTimeout(() => setAdminToast(null), 3000);
  };

  // Reload all storage data helper
  const reloadAllState = () => {
    setProductsList(adminStorage.getProducts());
    setOrdersList(adminStorage.getOrders());
    setCategoriesList(adminStorage.getCategories());
    setAttributesList(adminStorage.getAttributes());
    setTagsList(adminStorage.getTags());
    setMediaList(adminStorage.getMedia());
    setCouponsList(adminStorage.getCoupons());
    setCustomersList(adminStorage.getCustomers());
    setActivityLogs(adminStorage.getActivityLogs());
    setStoreSettings(adminStorage.getSettings());
  };

  // KPI Calculations
  const totalProducts = productsList.length;
  const publishedProducts = productsList.filter((p) => p.status === 'published').length;
  const draftProducts = productsList.filter((p) => p.status === 'draft').length;
  const lowStockProducts = productsList.filter(
    (p) => p.inventory <= (p.lowStockThreshold || 5) && p.inventory > 0
  ).length;
  const outOfStockProducts = productsList.filter((p) => p.inventory === 0).length;
  const totalVariations = productsList.reduce(
    (sum, p) => sum + (p.variations?.length || 0),
    0
  );

  const pendingOrders = ordersList.filter(
    (o) => o.status === 'Paid' || o.status === 'Packing'
  ).length;
  const completedOrders = ordersList.filter(
    (o) => o.status === 'Completed' || o.status === 'Shipped'
  ).length;
  const cancelledOrders = ordersList.filter(
    (o) => o.status === 'Cancelled' || o.status === 'Refunded'
  ).length;

  const totalSalesAllTime = ordersList.reduce((sum, o) => sum + o.total, 18450000);
  const salesToday = 245000;
  const salesThisWeek = 1860000;
  const salesThisMonth = 6840000;

  // Best selling products calculation
  const bestSellers = productsList.slice(0, 4).map((p, i) => ({
    ...p,
    unitsSold: 38 - i * 7,
    revenue: (38 - i * 7) * p.price,
  }));

  // ==========================================
  // HANDLERS FOR PRODUCTS
  // ==========================================
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setEditorModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setEditorModalOpen(true);
  };

  const handleSaveProduct = (savedProduct: Product) => {
    adminStorage.saveProduct(savedProduct);
    reloadAllState();
    onAddProduct(savedProduct);
    triggerToast(`Product "${savedProduct.name}" saved with ${savedProduct.variations?.length || 0} variations.`);
  };

  const handleDeleteProduct = (productId: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This will remove all associated variations and stock records.`)) {
      adminStorage.deleteProduct(productId);
      reloadAllState();
      triggerToast(`Product "${name}" deleted.`);
    }
  };

  const handleDuplicateProduct = (productId: string) => {
    const dup = adminStorage.duplicateProduct(productId);
    if (dup) {
      reloadAllState();
      triggerToast(`Duplicated "${dup.name}" as draft.`);
    }
  };

  // Bulk Actions on Products
  const handleBulkAction = (action: 'publish' | 'draft' | 'archive' | 'delete') => {
    if (selectedProductIds.length === 0) return;

    if (action === 'delete') {
      if (
        !window.confirm(
          `Are you sure you want to delete ${selectedProductIds.length} selected products?`
        )
      )
        return;
      selectedProductIds.forEach((id) => adminStorage.deleteProduct(id));
      triggerToast(`Deleted ${selectedProductIds.length} products.`);
    } else {
      const list = adminStorage.getProducts();
      list.forEach((p) => {
        if (selectedProductIds.includes(p.id)) {
          if (action === 'publish') p.status = 'published';
          if (action === 'draft') p.status = 'draft';
          if (action === 'archive') p.status = 'archived';
        }
      });
      adminStorage.saveProducts(list);
      triggerToast(`Updated status for ${selectedProductIds.length} products.`);
    }

    setSelectedProductIds([]);
    reloadAllState();
  };

  // Quick Stock Adjust
  const handleQuickAdjustStock = (productId: string, delta: number) => {
    const list = adminStorage.getProducts();
    const target = list.find((p) => p.id === productId);
    if (!target) return;
    target.inventory = Math.max(0, target.inventory + delta);
    target.inStock = target.inventory > 0;
    adminStorage.saveProducts(list);
    onUpdateProductStock(productId, target.inventory);
    reloadAllState();
    triggerToast(`Stock adjusted to ${target.inventory} units.`);
  };

  // Direct Variation Photo Assignment Handler
  const handleSelectVariationPhoto = (url: string) => {
    if (!variationPhotoTarget) return;
    const success = adminStorage.updateVariationImage(
      variationPhotoTarget.productId,
      variationPhotoTarget.variationId,
      url
    );
    if (success) {
      reloadAllState();
      triggerToast('Variation photography successfully assigned!');
    }
    setVariationPhotoTarget(null);
  };

  // Filtered & Sorted Products List
  const filteredProducts = productsList
    .filter((p) => {
      const matchesSearch =
        productSearch.trim() === '' ||
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(productSearch.toLowerCase())) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(productSearch.toLowerCase())));

      const matchesCategory =
        productCategoryFilter === 'All' || p.category === productCategoryFilter;

      const matchesStatus =
        productStatusFilter === 'All' || p.status === productStatusFilter;

      const matchesType =
        productTypeFilter === 'All' || p.type === productTypeFilter;

      const matchesStock =
        productStockFilter === 'All' ||
        (productStockFilter === 'in-stock' && p.inventory > (p.lowStockThreshold || 5)) ||
        (productStockFilter === 'low-stock' && p.inventory <= (p.lowStockThreshold || 5) && p.inventory > 0) ||
        (productStockFilter === 'out-of-stock' && p.inventory === 0);

      return matchesSearch && matchesCategory && matchesStatus && matchesType && matchesStock;
    })
    .sort((a, b) => {
      if (productSortBy === 'price-asc') return a.price - b.price;
      if (productSortBy === 'price-desc') return b.price - a.price;
      if (productSortBy === 'stock-asc') return a.inventory - b.inventory;
      if (productSortBy === 'name-asc') return a.name.localeCompare(b.name);
      return 0; // 'newest' default
    });

  const totalProductPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE) || 1;
  const paginatedProducts = filteredProducts.slice(
    (productPage - 1) * PRODUCTS_PER_PAGE,
    productPage * PRODUCTS_PER_PAGE
  );

  // Filtered Orders List
  const filteredOrders = ordersList.filter((o) => {
    const matchesSearch =
      orderSearch.trim() === '' ||
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.email.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.phone.toLowerCase().includes(orderSearch.toLowerCase());

    const matchesStatus =
      orderStatusFilter === 'All' || o.status === orderStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // Filtered Inventory List
  const filteredInventory = productsList.filter((p) => {
    const matchesSearch =
      inventorySearch.trim() === '' ||
      p.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(inventorySearch.toLowerCase()));

    const matchesStock =
      inventoryStockFilter === 'All' ||
      (inventoryStockFilter === 'healthy' && p.inventory > (p.lowStockThreshold || 5)) ||
      (inventoryStockFilter === 'low' && p.inventory <= (p.lowStockThreshold || 5) && p.inventory > 0) ||
      (inventoryStockFilter === 'out' && p.inventory === 0);

    return matchesSearch && matchesStock;
  });

  // Export CSV
  const handleExportCSV = () => {
    const headers = 'ID,Name,Category,Type,Price,Inventory,Status,Variations\n';
    const rows = productsList
      .map(
        (p) =>
          `"${p.id}","${p.name}","${p.category}","${p.type || 'simple'}",${p.price},${p.inventory},"${p.status}",${p.variations?.length || 0}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `babies-touch-catalog-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast('Catalogue exported to CSV.');
  };

  // Add Tag
  const handleAddNewTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagNameInput.trim()) return;
    const clean = newTagNameInput.trim();
    adminStorage.saveTag({
      id: `tag-${Date.now()}`,
      name: clean,
      slug: clean.toLowerCase().replace(/\s+/g, '-'),
      productCount: 0,
    });
    setNewTagNameInput('');
    reloadAllState();
    triggerToast(`Created tag #${clean}.`);
  };

  // Delete Tag
  const handleDeleteTag = (tagId: string, name: string) => {
    if (window.confirm(`Delete tag #${name}?`)) {
      adminStorage.deleteTag(tagId);
      reloadAllState();
      triggerToast(`Deleted tag #${name}.`);
    }
  };

  // Add Coupon
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    const newCoupon: CouponItem = {
      id: `cp-${Date.now()}`,
      code: newCouponCode.trim().toUpperCase(),
      discountType: newCouponType,
      discountValue: parseFloat(newCouponVal) || 10,
      minSpend: parseFloat(newCouponMin) || 0,
      expiryDate: newCouponExp || '2026-12-31',
      usageCount: 0,
      usageLimit: 100,
      isActive: true,
    };
    adminStorage.saveCoupon(newCoupon);
    setCouponModalOpen(false);
    setNewCouponCode('');
    reloadAllState();
    triggerToast(`Promo code ${newCoupon.code} created.`);
  };

  // Delete Coupon
  const handleDeleteCoupon = (id: string, code: string) => {
    if (window.confirm(`Delete coupon ${code}?`)) {
      adminStorage.deleteCoupon(id);
      reloadAllState();
      triggerToast(`Coupon ${code} deleted.`);
    }
  };

  // Save Store Settings
  const handleSaveStoreSettings = (e: React.FormEvent) => {
    e.preventDefault();
    adminStorage.saveSettings(storeSettings);
    triggerToast('Atelier settings and nationwide delivery fees updated.');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
      {/* Toast Notification */}
      {adminToast && (
        <div className="fixed top-6 right-6 z-[120] bg-[#171717] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#E0218A]/30 animate-in slide-in-from-top duration-200">
          <CheckCircle className="w-4 h-4 text-[#E0218A]" />
          <span className="text-xs font-semibold">{adminToast}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="h-16 bg-white border-b border-[#E6E4DF] px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <BabiesTouchLogo
              size="sm"
              showWordmark={true}
              showLocation={true}
              locationText="Main Market, Onitsha"
            />
            <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#FCE7F3] text-[#BE185D] border border-[#FBCFE8]">
              Atelier Management
            </span>
          </div>

          {/* Role Selector Pill */}
          <div className="hidden lg:flex items-center gap-2 bg-[#FAF5FF] border border-[#E9D5FF] px-3 py-1 rounded-full text-xs">
            <Shield className="w-3.5 h-3.5 text-[#9333EA]" />
            <span className="text-[#737373] text-[11px]">Role:</span>
            <select
              value={currentRole}
              onChange={(e) => {
                const r = e.target.value as AdminRole;
                setCurrentRole(r);
                triggerToast(`Active administrative role switched to ${r}`);
              }}
              className="bg-transparent font-semibold text-[#9333EA] text-xs cursor-pointer focus:outline-none"
            >
              <option value="Super Admin">Super Admin (Full Access)</option>
              <option value="Store Manager">Store Manager</option>
              <option value="Product Manager">Product Manager</option>
              <option value="Order Manager">Order Manager</option>
              <option value="Content Manager">Content Manager</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs text-[#737373]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Store Online · Flagship: Main Market, Onitsha</span>
          </div>

          <button
            onClick={onReturnToStore}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#FAF9F6] hover:bg-[#FCE7F3] text-[#171717] hover:text-[#BE185D] border border-[#E6E4DF] transition-all cursor-pointer shadow-2xs hover:scale-102"
          >
            <Store className="w-3.5 h-3.5 text-[#E0218A]" />
            <span>View Storefront</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body: Sidebar + Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Navigation */}
        <aside
          className={`${
            sidebarCollapsed ? 'w-20' : 'w-64'
          } bg-white border-r border-[#E6E4DF] flex flex-col justify-between transition-all duration-300 shrink-0 select-none`}
        >
          <div className="p-4 space-y-1 overflow-y-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'products', label: 'Products', icon: Package, badge: productsList.length },
              { id: 'variations', label: 'Variations & Photos', icon: Layers, badge: totalVariations },
              { id: 'categories', label: 'Categories', icon: FolderTree, badge: categoriesList.length },
              { id: 'attributes', label: 'Attributes & Swatches', icon: Sliders },
              { id: 'tags', label: 'Tags', icon: Tag, badge: tagsList.length },
              { id: 'inventory', label: 'Stock & Inventory', icon: Boxes, alert: lowStockProducts > 0 },
              { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: pendingOrders },
              { id: 'customers', label: 'Customers', icon: Users, badge: customersList.length },
              { id: 'media', label: 'Media Library', icon: ImageIcon, badge: mediaList.length },
              { id: 'coupons', label: 'Coupons & Promos', icon: Ticket, badge: couponsList.length },
              { id: 'analytics', label: 'Reports & Analytics', icon: TrendingUp },
              { id: 'settings', label: 'Settings & Logs', icon: Settings },
            ].map((nav) => {
              const Icon = nav.icon;
              const isActive = activeTab === nav.id;
              return (
                <button
                  key={nav.id}
                  onClick={() => setActiveTab(nav.id as AdminTab)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#E0218A] to-[#BE185D] text-white shadow-sm'
                      : 'text-[#737373] hover:text-[#171717] hover:bg-[#FDF2F8]'
                  }`}
                  title={nav.label}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span className="truncate">{nav.label}</span>}
                  </div>

                  {!sidebarCollapsed && (
                    <div className="flex items-center gap-1.5">
                      {nav.alert && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      )}
                      {nav.badge !== undefined && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-[#FAF5FF] text-[#9333EA] border border-[#E9D5FF]'
                          }`}
                        >
                          {nav.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-4 border-t border-[#E6E4DF] bg-[#FAF9F6]">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium text-[#737373] hover:text-[#171717] hover:bg-white transition-colors cursor-pointer"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4" />
                  <span>Collapse Menu</span>
                </>
              )}
            </button>
          </div>
        </aside>

        {/* Workspace Canvas */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-[#FDFBF7]">
          {/* ============================================================ */}
          {/* TAB 1: OVERVIEW & KPIS */}
          {/* ============================================================ */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Top Greeting & Date Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-[#171717]">
                    Atelier Executive Overview
                  </h1>
                  <p className="text-xs text-[#737373] mt-0.5">
                    Real-time performance, inventory alerts, and order fulfilment metrics.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-white p-1 rounded-full border border-[#E6E4DF] shadow-2xs self-start">
                  {[
                    { id: 'today', label: 'Today' },
                    { id: '7D', label: '7 Days' },
                    { id: '30D', label: '30 Days' },
                    { id: '12M', label: 'This Year' },
                  ].map((range) => (
                    <button
                      key={range.id}
                      onClick={() => setOverviewDateRange(range.id as any)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                        overviewDateRange === range.id
                          ? 'bg-[#171717] text-white shadow-xs'
                          : 'text-[#737373] hover:text-[#171717]'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clickable Summary KPI Cards with direct links */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  onClick={() => setActiveTab('products')}
                  className="bg-white p-5 rounded-3xl border border-[#E6E4DF] shadow-xs hover:border-[#E0218A] hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs text-[#737373]">
                    <span>Total Products</span>
                    <Package className="w-4 h-4 text-[#E0218A] group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-2xl font-bold text-[#171717] mt-2 tabular-nums">
                    {totalProducts}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-[#737373]">
                    <span className="text-emerald-700 font-semibold">{publishedProducts} published</span>
                    <span>·</span>
                    <span>{draftProducts} drafts</span>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('variations')}
                  className="bg-white p-5 rounded-3xl border border-[#E6E4DF] shadow-xs hover:border-[#9333EA] hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs text-[#737373]">
                    <span>Product Variations</span>
                    <Layers className="w-4 h-4 text-[#9333EA] group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-2xl font-bold text-[#171717] mt-2 tabular-nums">
                    {totalVariations}
                  </div>
                  <div className="text-[11px] text-[#9333EA] font-medium mt-2">
                    Size & color photography
                  </div>
                </div>

                <div
                  onClick={() => {
                    setActiveTab('inventory');
                    setInventoryStockFilter('low');
                  }}
                  className="bg-white p-5 rounded-3xl border border-[#E6E4DF] shadow-xs hover:border-amber-500 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs text-[#737373]">
                    <span>Stock Alerts</span>
                    <AlertTriangle className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-2xl font-bold text-[#171717] mt-2 tabular-nums">
                    {lowStockProducts}
                  </div>
                  <div className="text-[11px] text-amber-700 font-medium mt-2">
                    {outOfStockProducts} out of stock
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('orders')}
                  className="bg-white p-5 rounded-3xl border border-[#E6E4DF] shadow-xs hover:border-emerald-600 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs text-[#737373]">
                    <span>Total Sales</span>
                    <ShoppingCart className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-2xl font-bold text-[#171717] mt-2 tabular-nums">
                    ₦{totalSalesAllTime.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-medium mt-2">
                    ₦{salesThisMonth.toLocaleString()} this month
                  </div>
                </div>
              </div>

              {/* Revenue & Growth Spline Chart */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6E4DF] shadow-xs">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-serif font-bold text-[#171717]">
                      Revenue Velocity (Nigerian Naira ₦)
                    </h3>
                    <p className="text-xs text-[#737373]">
                      Sales over the selected timeline based on verified client transactions.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-[#171717]">
                      ₦{(overviewDateRange === 'today' ? salesToday : salesThisWeek).toLocaleString()}
                    </span>
                    <p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider">
                      +14.8% vs previous period
                    </p>
                  </div>
                </div>

                <div className="h-44 w-full flex items-end gap-2 pt-6 border-b border-[#E6E4DF]">
                  {[
                    { label: 'Mon', h: '45%', val: '₦320k' },
                    { label: 'Tue', h: '60%', val: '₦480k' },
                    { label: 'Wed', h: '85%', val: '₦720k' },
                    { label: 'Thu', h: '55%', val: '₦410k' },
                    { label: 'Fri', h: '95%', val: '₦890k' },
                    { label: 'Sat', h: '70%', val: '₦620k' },
                    { label: 'Sun', h: '50%', val: '₦390k' },
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                      <span className="text-[10px] text-[#737373] opacity-0 group-hover:opacity-100 transition-opacity">
                        {bar.val}
                      </span>
                      <div
                        className="w-full max-w-[48px] rounded-t-xl bg-[#FCE7F3] group-hover:bg-[#E0218A] transition-all"
                        style={{ height: bar.h }}
                      />
                      <span className="text-[10px] font-medium text-[#737373]">{bar.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Middle Section: Best-Selling Products Leaderboard */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6E4DF] shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-serif font-bold text-[#171717]">
                      Best-Selling Couture Pieces
                    </h3>
                    <p className="text-xs text-[#737373]">
                      Top revenue-generating garments across ball gowns and ceremony wear.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="text-xs font-semibold text-[#E0218A] hover:underline cursor-pointer"
                  >
                    View All Products →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {bestSellers.map((item, idx) => (
                    <div
                      key={item.id}
                      onClick={() => handleOpenEditProduct(item)}
                      className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#E6E4DF] hover:border-[#E0218A] transition-all cursor-pointer flex items-center gap-3 group"
                    >
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-[#E6E4DF] bg-white shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute top-1 left-1 w-4 h-4 rounded-full bg-[#E0218A] text-white text-[10px] font-bold flex items-center justify-center">
                          #{idx + 1}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-[#171717] truncate">{item.name}</p>
                        <p className="text-[11px] text-[#737373]">{item.unitsSold} units sold</p>
                        <p className="text-xs font-bold text-[#BE185D] mt-0.5 tabular-nums">
                          ₦{item.revenue.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Split: Recent Orders & Recent Administrative Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#E6E4DF] shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-serif font-bold text-[#171717]">Recent Orders</h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-semibold text-[#E0218A] hover:underline cursor-pointer"
                    >
                      View All Orders →
                    </button>
                  </div>

                  <div className="divide-y divide-[#E6E4DF]">
                    {ordersList.slice(0, 4).map((order) => (
                      <div key={order.id} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-semibold text-[#171717]">{order.customerName}</p>
                          <p className="text-[11px] text-[#737373]">
                            Order {order.id} · {order.items.length} items · {order.city}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#171717] tabular-nums">
                            ₦{order.total.toLocaleString()}
                          </p>
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              order.status === 'Paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.status === 'Packing'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#E6E4DF] shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-serif font-bold text-[#171717]">
                      Administrative Activity
                    </h3>
                    <span className="text-[11px] text-[#737373]">Live Audit</span>
                  </div>

                  <div className="space-y-3">
                    {activityLogs.slice(0, 4).map((log) => (
                      <div key={log.id} className="flex items-start gap-2.5 text-xs">
                        <span className="w-2 h-2 rounded-full bg-[#E0218A] mt-1 shrink-0" />
                        <div>
                          <p className="font-semibold text-[#171717]">{log.action}</p>
                          <p className="text-[11px] text-[#737373]">{log.details}</p>
                          <span className="text-[10px] text-[#A39E93]">{log.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: PRODUCTS CATALOG MANAGEMENT */}
          {/* ============================================================ */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Header and Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-[#171717]">
                    Product Catalogue
                  </h1>
                  <p className="text-xs text-[#737373]">
                    Create, edit, duplicate, and manage all luxury children's pieces.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-white border border-[#E6E4DF] hover:bg-[#FAF9F6] text-[#171717] flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#737373]" />
                    <span>Export CSV</span>
                  </button>

                  <button
                    onClick={handleOpenAddProduct}
                    className="px-5 py-2 rounded-full text-xs font-semibold bg-[#E0218A] hover:bg-[#BE185D] text-white flex items-center gap-1.5 shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Product</span>
                  </button>
                </div>
              </div>

              {/* Filters & Sorting Bar */}
              <div className="p-4 rounded-3xl bg-white border border-[#E6E4DF] shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-[240px]">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373]" />
                    <input
                      type="text"
                      placeholder="Search by name, SKU, or tag..."
                      value={productSearch}
                      onChange={(e) => {
                        setProductSearch(e.target.value);
                        setProductPage(1);
                      }}
                      className="w-full pl-9 pr-4 py-2 rounded-full border border-[#E6E4DF] text-xs focus:outline-none focus:border-[#E0218A]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => {
                      setProductCategoryFilter(e.target.value);
                      setProductPage(1);
                    }}
                    className="px-3 py-2 rounded-full border border-[#E6E4DF] bg-white text-xs text-[#171717] cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    {categoriesList.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={productTypeFilter}
                    onChange={(e) => {
                      setProductTypeFilter(e.target.value as any);
                      setProductPage(1);
                    }}
                    className="px-3 py-2 rounded-full border border-[#E6E4DF] bg-white text-xs text-[#171717] cursor-pointer"
                  >
                    <option value="All">All Types</option>
                    <option value="variable">Variable Only</option>
                    <option value="simple">Simple Only</option>
                  </select>

                  <select
                    value={productStockFilter}
                    onChange={(e) => {
                      setProductStockFilter(e.target.value as any);
                      setProductPage(1);
                    }}
                    className="px-3 py-2 rounded-full border border-[#E6E4DF] bg-white text-xs text-[#171717] cursor-pointer"
                  >
                    <option value="All">All Stock Levels</option>
                    <option value="in-stock">In Stock</option>
                    <option value="low-stock">Low Stock (≤5)</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>

                  <select
                    value={productStatusFilter}
                    onChange={(e) => {
                      setProductStatusFilter(e.target.value as any);
                      setProductPage(1);
                    }}
                    className="px-3 py-2 rounded-full border border-[#E6E4DF] bg-white text-xs text-[#171717] cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="published">Published</option>
                    <option value="draft">Drafts</option>
                    <option value="archived">Archived</option>
                  </select>

                  <select
                    value={productSortBy}
                    onChange={(e) => setProductSortBy(e.target.value as any)}
                    className="px-3 py-2 rounded-full border border-[#E6E4DF] bg-[#FAF9F6] text-xs text-[#171717] cursor-pointer font-medium"
                  >
                    <option value="newest">Sort: Newest First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="stock-asc">Stock: Low to High</option>
                    <option value="name-asc">Name: A to Z</option>
                  </select>
                </div>
              </div>

              {/* Bulk Actions Bar if items selected */}
              {selectedProductIds.length > 0 && (
                <div className="p-3 rounded-2xl bg-[#FDF2F8] border border-[#FCE7F3] flex items-center justify-between text-xs animate-in fade-in duration-150">
                  <span className="font-semibold text-[#BE185D]">
                    {selectedProductIds.length} products selected
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleBulkAction('publish')}
                      className="px-3 py-1 rounded-full bg-white border border-[#E6E4DF] hover:bg-emerald-50 text-emerald-700 font-medium cursor-pointer"
                    >
                      Publish
                    </button>
                    <button
                      onClick={() => handleBulkAction('draft')}
                      className="px-3 py-1 rounded-full bg-white border border-[#E6E4DF] hover:bg-amber-50 text-amber-700 font-medium cursor-pointer"
                    >
                      Draft
                    </button>
                    <button
                      onClick={() => handleBulkAction('delete')}
                      className="px-3 py-1 rounded-full bg-white border border-[#E6E4DF] hover:bg-rose-50 text-rose-700 font-medium cursor-pointer"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setSelectedProductIds([])}
                      className="text-[#737373] hover:underline ml-2 cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}

              {/* Products Table */}
              <div className="bg-white rounded-3xl border border-[#E6E4DF] overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F6] border-b border-[#E6E4DF] text-[#737373] uppercase tracking-wider font-semibold text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4 w-10">
                        <input
                          type="checkbox"
                          checked={
                            paginatedProducts.length > 0 &&
                            selectedProductIds.length === paginatedProducts.length
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProductIds(paginatedProducts.map((p) => p.id));
                            } else {
                              setSelectedProductIds([]);
                            }
                          }}
                          className="rounded text-[#E0218A]"
                        />
                      </th>
                      <th className="py-3.5 px-4">Product Details</th>
                      <th className="py-3.5 px-4">SKU</th>
                      <th className="py-3.5 px-4">Type</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Stock</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6E4DF]">
                    {paginatedProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-[#FCFBF9] transition-colors">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedProductIds.includes(prod.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedProductIds([...selectedProductIds, prod.id]);
                              } else {
                                setSelectedProductIds(
                                  selectedProductIds.filter((id) => id !== prod.id)
                                );
                              }
                            }}
                            className="rounded text-[#E0218A]"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#E6E4DF] bg-white shrink-0">
                              <img
                                src={prod.imageUrl}
                                alt={prod.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-sm text-[#171717] truncate">
                                {prod.name}
                              </p>
                              <p className="text-[11px] text-[#737373]">
                                {prod.category} {prod.subcategory ? `· ${prod.subcategory}` : ''}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-[#737373]">
                          {prod.sku || 'BT-VAR'}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              prod.type === 'variable'
                                ? 'bg-[#FAF5FF] text-[#9333EA] border border-[#E9D5FF]'
                                : 'bg-[#F4F3EF] text-[#737373]'
                            }`}
                          >
                            {prod.type === 'variable'
                              ? `Variable (${prod.variations?.length || 0})`
                              : 'Simple'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-[#171717] tabular-nums">
                          ₦{prod.price.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                prod.inventory > 5
                                  ? 'bg-emerald-500'
                                  : prod.inventory > 0
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                            />
                            <span className="font-medium text-[#171717]">
                              {prod.inventory} in stock
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              prod.status === 'published'
                                ? 'bg-emerald-100 text-emerald-800'
                                : prod.status === 'draft'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-zinc-100 text-zinc-700'
                            }`}
                          >
                            {prod.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditProduct(prod)}
                              className="p-1.5 text-[#737373] hover:text-[#E0218A] hover:bg-[#FDF2F8] rounded-lg transition-colors cursor-pointer"
                              title="Edit product & variations"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDuplicateProduct(prod.id)}
                              className="p-1.5 text-[#737373] hover:text-[#171717] hover:bg-[#FAF9F6] rounded-lg transition-colors cursor-pointer"
                              title="Duplicate as draft"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id, prod.name)}
                              className="p-1.5 text-[#737373] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="p-4 rounded-3xl bg-white border border-[#E6E4DF] shadow-xs flex items-center justify-between text-xs">
                <span className="text-[#737373]">
                  Showing {(productPage - 1) * PRODUCTS_PER_PAGE + 1} -{' '}
                  {Math.min(productPage * PRODUCTS_PER_PAGE, filteredProducts.length)} of{' '}
                  {filteredProducts.length} items
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    disabled={productPage === 1}
                    onClick={() => setProductPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 rounded-full border border-[#E6E4DF] disabled:opacity-40 hover:bg-[#FAF9F6] font-medium cursor-pointer"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalProductPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      onClick={() => setProductPage(num)}
                      className={`w-7 h-7 rounded-full text-xs font-semibold cursor-pointer ${
                        productPage === num
                          ? 'bg-[#E0218A] text-white shadow-xs'
                          : 'text-[#737373] hover:bg-[#FAF9F6]'
                      }`}
                    >
                      {num}
                    </button>
                  ))}

                  <button
                    disabled={productPage === totalProductPages}
                    onClick={() => setProductPage((p) => Math.min(totalProductPages, p + 1))}
                    className="px-3 py-1.5 rounded-full border border-[#E6E4DF] disabled:opacity-40 hover:bg-[#FAF9F6] font-medium cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: VARIATIONS & DIRECT PHOTO ASSIGNMENT */}
          {/* ============================================================ */}
          {activeTab === 'variations' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-[#171717]">
                    Product Variations & Assigned Photography
                  </h1>
                  <p className="text-xs text-[#737373]">
                    Every individual variation has its own dedicated photo assigned here. Click "Change Photo" on any variation to update its image directly!
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {productsList
                  .filter((p) => p.variations && p.variations.length > 0)
                  .map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-white rounded-3xl border border-[#E6E4DF] p-6 shadow-xs space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-[#E6E4DF] pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#E6E4DF]">
                            <img src={prod.imageUrl} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm text-[#171717]">{prod.name}</h3>
                            <p className="text-[11px] text-[#737373]">
                              {prod.variations?.length} total variations configured
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleOpenEditProduct(prod)}
                          className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#FDF2F8] text-[#BE185D] hover:bg-[#FCE7F3] cursor-pointer"
                        >
                          Manage in Editor →
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {prod.variations?.map((v) => (
                          <div
                            key={v.id}
                            className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#E6E4DF] flex items-center gap-3.5 group hover:border-[#E0218A] transition-all"
                          >
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#E6E4DF] bg-white shrink-0">
                              <img
                                src={v.imageUrl || prod.imageUrl}
                                alt={v.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0 space-y-1">
                              <p className="text-xs font-semibold text-[#171717] truncate">{v.name}</p>
                              <p className="text-[10px] font-mono text-[#737373] truncate">{v.sku}</p>
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-semibold text-[#171717]">
                                  ₦{v.price.toLocaleString()}
                                </span>
                                <span className="text-[#737373]">{v.inventory} in stock</span>
                              </div>
                              <button
                                onClick={() => {
                                  setVariationPhotoTarget({
                                    productId: prod.id,
                                    variationId: v.id,
                                  });
                                  setMediaModalOpen(true);
                                }}
                                className="mt-1 px-2.5 py-0.5 rounded text-[10px] font-semibold bg-[#FDF2F8] text-[#BE185D] hover:bg-[#FCE7F3] border border-[#FBCFE8] cursor-pointer"
                              >
                                Change Photo
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 4: CATEGORIES & SUBCATEGORIES */}
          {/* ============================================================ */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-[#171717]">
                    Categories & Subcategories
                  </h1>
                  <p className="text-xs text-[#737373]">
                    Manage store hierarchy, descriptions, and category showcase images.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingCategory(null);
                    setCategoryModalOpen(true);
                  }}
                  className="px-5 py-2 rounded-full text-xs font-semibold bg-[#E0218A] hover:bg-[#BE185D] text-white flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Category</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoriesList.map((cat) => (
                  <div
                    key={cat.id}
                    className="bg-white rounded-3xl border border-[#E6E4DF] p-5 shadow-xs flex flex-col justify-between hover:border-[#E0218A] transition-all"
                  >
                    <div>
                      {cat.imageUrl && (
                        <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden mb-3 border border-[#E6E4DF]">
                          <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif font-bold text-base text-[#171717]">{cat.name}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F4F3EF] text-[#737373]">
                          {cat.productCount || 0} items
                        </span>
                      </div>
                      <p className="text-xs text-[#737373] mt-1">{cat.description}</p>
                      {cat.parentId && (
                        <p className="text-[11px] text-[#E0218A] mt-1 font-semibold">
                          Subcategory of: {cat.parentId}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E6E4DF] flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingCategory(cat);
                          setCategoryModalOpen(true);
                        }}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF9F6] border border-[#E6E4DF] hover:bg-[#F4F3EF] cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete category "${cat.name}"?`)) {
                            adminStorage.deleteCategory(cat.id);
                            reloadAllState();
                            triggerToast(`Category "${cat.name}" deleted.`);
                          }
                        }}
                        className="p-1.5 text-[#737373] hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 5: ATTRIBUTES & TERMS */}
          {/* ============================================================ */}
          {activeTab === 'attributes' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-[#171717]">
                    Global Attributes & Terms
                  </h1>
                  <p className="text-xs text-[#737373]">
                    Centrally configured attributes (Sizes, Colours, Age Groups) applied across products.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingAttribute(null);
                    setAttributeModalOpen(true);
                  }}
                  className="px-5 py-2 rounded-full text-xs font-semibold bg-[#E0218A] hover:bg-[#BE185D] text-white flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Global Attribute</span>
                </button>
              </div>

              <div className="space-y-6">
                {attributesList.map((attr) => (
                  <div key={attr.id} className="bg-white p-6 rounded-3xl border border-[#E6E4DF] shadow-xs">
                    <div className="flex items-center justify-between border-b border-[#E6E4DF] pb-3 mb-4">
                      <div>
                        <h3 className="font-semibold text-base text-[#171717]">{attr.name}</h3>
                        <p className="text-xs text-[#737373]">
                          Slug: {attr.slug} · Display: {attr.displayType} ·{' '}
                          {attr.isVariation ? 'Used for Variations' : 'Informational Only'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingAttribute(attr);
                            setAttributeModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#FAF9F6] border border-[#E6E4DF] hover:bg-[#F4F3EF] cursor-pointer"
                        >
                          Edit Attribute
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete attribute "${attr.name}"?`)) {
                              adminStorage.deleteAttribute(attr.id);
                              reloadAllState();
                              triggerToast(`Attribute "${attr.name}" deleted.`);
                            }
                          }}
                          className="p-1.5 text-[#737373] hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {attr.terms.map((term) => (
                        <div
                          key={term.id}
                          className="px-3.5 py-1.5 rounded-full bg-[#FAF9F6] border border-[#E6E4DF] text-xs font-medium flex items-center gap-2"
                        >
                          {term.value && (
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                              style={{ backgroundColor: term.value }}
                            />
                          )}
                          <span>{term.name}</span>
                          <button
                            onClick={() => {
                              adminStorage.deleteTerm(attr.id, term.id);
                              reloadAllState();
                            }}
                            className="text-[#737373] hover:text-rose-600 cursor-pointer ml-1"
                            title="Remove term"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 6: TAGS */}
          {/* ============================================================ */}
          {activeTab === 'tags' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-serif font-bold text-[#171717]">Product Tags</h1>
                <p className="text-xs text-[#737373]">
                  Marketing tags used for badges, seasonal campaigns, and quick filters.
                </p>
              </div>

              {/* Add New Tag Bar */}
              <div className="bg-white p-6 rounded-3xl border border-[#E6E4DF] shadow-xs">
                <form onSubmit={handleAddNewTag} className="flex items-center gap-3 max-w-md mb-6">
                  <input
                    type="text"
                    required
                    placeholder="New tag name (e.g. Easter Special, Royal Archive)..."
                    value={newTagNameInput}
                    onChange={(e) => setNewTagNameInput(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-full border border-[#E6E4DF] text-xs focus:outline-none focus:border-[#E0218A]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#E0218A] hover:bg-[#BE185D] text-white text-xs font-semibold shadow-xs cursor-pointer"
                  >
                    Add Tag
                  </button>
                </form>

                <div className="flex flex-wrap gap-2.5">
                  {tagsList.map((tag) => (
                    <div
                      key={tag.id}
                      className="px-4 py-2 rounded-full bg-[#FAF9F6] border border-[#E6E4DF] text-xs font-semibold text-[#171717] flex items-center gap-2 group"
                    >
                      <span>#{tag.name}</span>
                      <span className="text-[10px] text-[#737373]">({tag.productCount || 0})</span>
                      <button
                        onClick={() => handleDeleteTag(tag.id, tag.name)}
                        className="text-[#737373] hover:text-rose-600 opacity-60 group-hover:opacity-100 cursor-pointer ml-1"
                        title="Delete tag"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 7: STOCK & INVENTORY MANAGEMENT */}
          {/* ============================================================ */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-[#171717]">
                    Inventory & Stock Levels
                  </h1>
                  <p className="text-xs text-[#737373]">
                    Real-time stock quantities with quick adjust and low-stock replenishment indicators.
                  </p>
                </div>
              </div>

              {/* Stock Filter Pills & Search */}
              <div className="p-4 rounded-3xl bg-white border border-[#E6E4DF] shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373]" />
                  <input
                    type="text"
                    placeholder="Search by product name or SKU..."
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-full border border-[#E6E4DF] text-xs focus:outline-none focus:border-[#E0218A]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  {[
                    { id: 'All', label: 'All Items' },
                    { id: 'healthy', label: 'Healthy (>5)' },
                    { id: 'low', label: 'Low Stock Alerts' },
                    { id: 'out', label: 'Out of Stock' },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setInventoryStockFilter(filter.id as any)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        inventoryStockFilter === filter.id
                          ? 'bg-[#171717] text-white shadow-xs'
                          : 'bg-[#FAF9F6] text-[#737373] hover:text-[#171717] border border-[#E6E4DF]'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inventory Table */}
              <div className="bg-white rounded-3xl border border-[#E6E4DF] overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F6] border-b border-[#E6E4DF] text-[#737373] uppercase tracking-wider font-semibold text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Item</th>
                      <th className="py-3 px-4">SKU</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Current Stock</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Quick Stock Adjust</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6E4DF]">
                    {filteredInventory.map((prod) => {
                      const isExpanded = expandedInventoryProdId === prod.id;
                      return (
                        <React.Fragment key={prod.id}>
                          <tr className="hover:bg-[#FCFBF9]">
                            <td className="py-3 px-4 font-semibold text-[#171717]">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={prod.imageUrl}
                                  alt=""
                                  className="w-9 h-9 rounded-xl object-cover border border-[#E6E4DF]"
                                />
                                <div>
                                  <p>{prod.name}</p>
                                  {prod.variations && prod.variations.length > 0 && (
                                    <button
                                      onClick={() =>
                                        setExpandedInventoryProdId(
                                          isExpanded ? null : prod.id
                                        )
                                      }
                                      className="text-[10px] text-[#E0218A] hover:underline flex items-center gap-1 mt-0.5 cursor-pointer font-medium"
                                    >
                                      <span>
                                        {isExpanded ? 'Hide Variations' : `View ${prod.variations.length} Variations`}
                                      </span>
                                      <ChevronDown
                                        className={`w-3 h-3 transition-transform ${
                                          isExpanded ? 'rotate-180' : ''
                                        }`}
                                      />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono text-[#737373]">{prod.sku}</td>
                            <td className="py-3 px-4">
                              <span className="capitalize text-[#737373]">
                                {prod.type || 'simple'}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-bold text-sm tabular-nums">
                              {prod.inventory} units
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  prod.inventory > 5
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : prod.inventory > 0
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {prod.inventory > 5
                                  ? 'Healthy'
                                  : prod.inventory > 0
                                  ? 'Low Stock'
                                  : 'Out of Stock'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleQuickAdjustStock(prod.id, -1)}
                                  className="w-7 h-7 rounded-lg bg-[#FAF9F6] border border-[#E6E4DF] flex items-center justify-center font-bold hover:bg-[#F4F3EF] cursor-pointer"
                                  title="Reduce 1"
                                >
                                  -1
                                </button>
                                <button
                                  onClick={() => handleQuickAdjustStock(prod.id, 5)}
                                  className="px-2.5 py-1 rounded-lg bg-[#FDF2F8] text-[#BE185D] text-[11px] font-bold hover:bg-[#FCE7F3] cursor-pointer"
                                  title="Add 5"
                                >
                                  +5
                                </button>
                                <button
                                  onClick={() => handleQuickAdjustStock(prod.id, 10)}
                                  className="px-2.5 py-1 rounded-lg bg-[#FDF2F8] text-[#BE185D] text-[11px] font-bold hover:bg-[#FCE7F3] cursor-pointer"
                                  title="Add 10"
                                >
                                  +10
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Expandable row for variations */}
                          {isExpanded && prod.variations && (
                            <tr className="bg-[#FAF9F6]">
                              <td colSpan={6} className="p-4">
                                <div className="space-y-2 border border-[#E6E4DF] rounded-2xl p-4 bg-white">
                                  <h5 className="font-semibold text-xs text-[#171717] mb-2">
                                    Individual Variation Stock Breakdown
                                  </h5>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    {prod.variations.map((v) => (
                                      <div
                                        key={v.id}
                                        className="p-3 rounded-xl border border-[#E6E4DF] bg-[#FAF9F6] flex items-center justify-between"
                                      >
                                        <div className="flex items-center gap-2.5">
                                          <img
                                            src={v.imageUrl || prod.imageUrl}
                                            alt=""
                                            className="w-8 h-8 rounded-lg object-cover border border-[#E6E4DF]"
                                          />
                                          <div>
                                            <p className="font-semibold text-[11px] text-[#171717]">
                                              {v.name}
                                            </p>
                                            <p className="font-mono text-[10px] text-[#737373]">
                                              {v.sku}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="font-bold text-xs">{v.inventory}</span>
                                          <div className="flex gap-1">
                                            <button
                                              onClick={() => {
                                                adminStorage.updateVariationData(
                                                  prod.id,
                                                  v.id,
                                                  v.price,
                                                  Math.max(0, v.inventory - 1)
                                                );
                                                reloadAllState();
                                              }}
                                              className="w-5 h-5 rounded bg-white border border-[#E6E4DF] text-xs font-bold flex items-center justify-center cursor-pointer"
                                            >
                                              -
                                            </button>
                                            <button
                                              onClick={() => {
                                                adminStorage.updateVariationData(
                                                  prod.id,
                                                  v.id,
                                                  v.price,
                                                  v.inventory + 5
                                                );
                                                reloadAllState();
                                              }}
                                              className="px-1.5 py-0.5 rounded bg-[#FDF2F8] text-[#BE185D] text-[10px] font-bold cursor-pointer"
                                            >
                                              +5
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 8: ORDERS MANAGEMENT */}
          {/* ============================================================ */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-[#171717]">
                    Orders & Fulfilment
                  </h1>
                  <p className="text-xs text-[#737373]">
                    Track purchases, package dispatch, and print packing slips.
                  </p>
                </div>
              </div>

              {/* Order Status Tabs & Search */}
              <div className="p-4 rounded-3xl bg-white border border-[#E6E4DF] shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373]" />
                  <input
                    type="text"
                    placeholder="Search by order ID, customer name, email, or phone..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-full border border-[#E6E4DF] text-xs focus:outline-none focus:border-[#E0218A]"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto text-xs">
                  {['All', 'Paid', 'Packing', 'Shipped', 'Completed', 'Cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                        orderStatusFilter === st
                          ? 'bg-[#171717] text-white shadow-xs'
                          : 'bg-[#FAF9F6] text-[#737373] hover:text-[#171717] border border-[#E6E4DF]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-3xl border border-[#E6E4DF] overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F6] border-b border-[#E6E4DF] text-[#737373] uppercase tracking-wider font-semibold text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Items & Variations</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6E4DF]">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#FCFBF9]">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#171717]">{ord.id}</td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-[#171717]">{ord.customerName}</p>
                          <p className="text-[11px] text-[#737373]">{ord.email}</p>
                        </td>
                        <td className="py-3.5 px-4 text-[#737373]">{ord.date}</td>
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            {ord.items.map((it, idx) => (
                              <p key={idx} className="text-[11px] text-[#171717]">
                                <span className="font-semibold">{it.quantity}x</span> {it.product.name} (
                                <span className="text-[#E0218A] font-medium">{it.selectedSwatch.name}</span>)
                              </p>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#171717] tabular-nums">
                          ₦{ord.total.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={ord.status}
                            onChange={(e) => {
                              const newSt = e.target.value as Order['status'];
                              adminStorage.updateOrderStatus(ord.id, newSt);
                              onUpdateOrderStatus(ord.id, newSt);
                              reloadAllState();
                              triggerToast(`Order ${ord.id} updated to ${newSt}.`);
                            }}
                            className="px-2.5 py-1 rounded-full text-[11px] font-bold border border-[#E6E4DF] bg-white cursor-pointer shadow-2xs"
                          >
                            <option value="Paid">Paid</option>
                            <option value="Packing">Packing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Refunded">Refunded</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedOrderDetails(ord)}
                              className="px-2.5 py-1 rounded-full bg-[#FDF2F8] border border-[#FCE7F3] text-xs font-semibold text-[#BE185D] hover:bg-[#FCE7F3] cursor-pointer"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => setPrintOrderModal(ord)}
                              className="p-1.5 text-[#737373] hover:text-[#171717] rounded-md hover:bg-[#F4F3EF] cursor-pointer"
                              title="Print Packing Slip"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 9: CUSTOMERS DIRECTORY */}
          {/* ============================================================ */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-serif font-bold text-[#171717]">Customer Profiles</h1>
                <p className="text-xs text-[#737373]">
                  Registered clients, purchase histories, and lifetime atelier spend.
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-[#E6E4DF] overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F6] border-b border-[#E6E4DF] text-[#737373] uppercase tracking-wider font-semibold text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Customer Name</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">City</th>
                      <th className="py-3 px-4">Orders</th>
                      <th className="py-3 px-4">Total Spent</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6E4DF]">
                    {customersList.map((c) => (
                      <tr key={c.id} className="hover:bg-[#FCFBF9]">
                        <td className="py-3.5 px-4 font-semibold text-[#171717]">{c.name}</td>
                        <td className="py-3.5 px-4">
                          <p>{c.email}</p>
                          <p className="text-[11px] text-[#737373]">{c.phone}</p>
                        </td>
                        <td className="py-3.5 px-4 text-[#737373]">{c.city}</td>
                        <td className="py-3.5 px-4 font-semibold">{c.ordersCount} orders</td>
                        <td className="py-3.5 px-4 font-bold text-[#171717] tabular-nums">
                          ₦{c.totalSpent.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              c.status === 'vip'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 10: MEDIA LIBRARY */}
          {/* ============================================================ */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-[#171717]">Media Library</h1>
                  <p className="text-xs text-[#737373]">
                    High-resolution studio photography and product assets.
                  </p>
                </div>
                <button
                  onClick={() => setMediaModalOpen(true)}
                  className="px-5 py-2 rounded-full text-xs font-semibold bg-[#E0218A] hover:bg-[#BE185D] text-white flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Asset</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {mediaList.map((m) => (
                  <div
                    key={m.id}
                    className="group bg-white p-2.5 rounded-2xl border border-[#E6E4DF] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden mb-2 bg-[#FAF9F6]">
                      <img src={m.url} alt={m.altText} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-[#171717] truncate">{m.name}</p>
                        <p className="text-[10px] text-[#737373]">{m.dimensions} · {m.size}</p>
                      </div>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete media item "${m.name}"?`)) {
                            adminStorage.deleteMediaItem(m.id);
                            reloadAllState();
                            triggerToast(`Deleted ${m.name}.`);
                          }
                        }}
                        className="p-1 text-[#737373] hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Delete image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 11: COUPONS & PROMOS */}
          {/* ============================================================ */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-[#171717]">
                    Coupons & Promotional Codes
                  </h1>
                  <p className="text-xs text-[#737373]">
                    Configure discount percentages, fixed deductions, and spend thresholds.
                  </p>
                </div>
                <button
                  onClick={() => setCouponModalOpen(true)}
                  className="px-5 py-2 rounded-full text-xs font-semibold bg-[#E0218A] hover:bg-[#BE185D] text-white flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Coupon</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {couponsList.map((cp) => (
                  <div
                    key={cp.id}
                    className="bg-white p-6 rounded-3xl border border-[#E6E4DF] shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-base font-bold text-[#E0218A] tracking-wider">
                          {cp.code}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      </div>
                      <p className="text-xl font-bold text-[#171717] mt-1">
                        {cp.discountType === 'percentage'
                          ? `${cp.discountValue}% OFF`
                          : `₦${cp.discountValue.toLocaleString()} OFF`}
                      </p>
                      <p className="text-xs text-[#737373] mt-2">
                        Min. spend: ₦{(cp.minSpend || 0).toLocaleString()} · Expires: {cp.expiryDate}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E6E4DF] text-xs text-[#737373] flex items-center justify-between">
                      <span>Used {cp.usageCount} times</span>
                      <button
                        onClick={() => handleDeleteCoupon(cp.id, cp.code)}
                        className="text-rose-600 hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 12: ANALYTICS & REPORTS */}
          {/* ============================================================ */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-serif font-bold text-[#171717]">
                  Reports & Financial Analytics
                </h1>
                <p className="text-xs text-[#737373]">
                  Revenue breakdown by couture garment category and top performing variations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-[#E6E4DF] shadow-xs">
                  <p className="text-xs text-[#737373]">Average Order Value</p>
                  <p className="text-2xl font-bold text-[#171717] mt-1">₦84,500</p>
                  <p className="text-[11px] text-emerald-600 mt-2 font-semibold">+12% vs last month</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-[#E6E4DF] shadow-xs">
                  <p className="text-xs text-[#737373]">Cart Conversion Rate</p>
                  <p className="text-2xl font-bold text-[#171717] mt-1">4.6%</p>
                  <p className="text-[11px] text-emerald-600 mt-2 font-semibold">Healthy luxury benchmark</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-[#E6E4DF] shadow-xs">
                  <p className="text-xs text-[#737373]">Top Category by Sales</p>
                  <p className="text-2xl font-bold text-[#171717] mt-1">Ball Dresses</p>
                  <p className="text-[11px] text-purple-600 mt-2 font-semibold">68% of total revenue</p>
                </div>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6E4DF] shadow-xs">
                <h3 className="font-serif font-bold text-base text-[#171717] mb-4">
                  Financial Breakdown (Gross vs Net Revenue)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E6E4DF]">
                    <span className="text-[#737373]">Gross Transactions:</span>
                    <p className="text-lg font-bold text-[#171717] mt-1">
                      ₦{(totalSalesAllTime + 850000).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E6E4DF]">
                    <span className="text-[#737373]">Promotional Discounts:</span>
                    <p className="text-lg font-bold text-rose-600 mt-1">-₦420,000</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E6E4DF]">
                    <span className="text-[#737373]">White-Glove Shipping Collected:</span>
                    <p className="text-lg font-bold text-[#171717] mt-1">+₦610,000</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FDF2F8] border border-[#FBCFE8]">
                    <span className="text-[#BE185D] font-semibold">Net Verified Revenue:</span>
                    <p className="text-lg font-bold text-[#BE185D] mt-1">
                      ₦{totalSalesAllTime.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 13: SETTINGS & AUDIT LOGS */}
          {/* ============================================================ */}
          {activeTab === 'settings' && (
            <div className="space-y-8 max-w-4xl">
              <div>
                <h1 className="text-2xl font-serif font-bold text-[#171717]">
                  Settings & Store Administration
                </h1>
                <p className="text-xs text-[#737373]">
                  Storefront announcements, boutique contact details, delivery fee thresholds, and administrative activity audits.
                </p>
              </div>

              {/* Store Identity & Banners Form */}
              <form onSubmit={handleSaveStoreSettings} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6E4DF] shadow-xs space-y-5 text-xs">
                <h3 className="font-serif font-bold text-base text-[#171717]">
                  Storefront Identity & Messaging
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#737373] font-semibold mb-1">Store Name</label>
                    <input
                      type="text"
                      value={storeSettings.storeName}
                      onChange={(e) =>
                        setStoreSettings({ ...storeSettings, storeName: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E4DF] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[#737373] font-semibold mb-1">Editorial Tagline</label>
                    <input
                      type="text"
                      value={storeSettings.tagline}
                      onChange={(e) =>
                        setStoreSettings({ ...storeSettings, tagline: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E4DF] text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#737373] font-semibold mb-1">
                    Top Announcement Bar Text
                  </label>
                  <input
                    type="text"
                    value={storeSettings.heroAnnouncement}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, heroAnnouncement: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E4DF] text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#737373] font-semibold mb-1">
                      Lagos Atelier Boutique
                    </label>
                    <input
                      type="text"
                      value={storeSettings.lagosAddress}
                      onChange={(e) =>
                        setStoreSettings({ ...storeSettings, lagosAddress: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E4DF] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[#737373] font-semibold mb-1">
                      Abuja Concierge Salon
                    </label>
                    <input
                      type="text"
                      value={storeSettings.abujaAddress}
                      onChange={(e) =>
                        setStoreSettings({ ...storeSettings, abujaAddress: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E4DF] text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#737373] font-semibold mb-1">
                      Concierge Telephone
                    </label>
                    <input
                      type="text"
                      value={storeSettings.phone}
                      onChange={(e) =>
                        setStoreSettings({ ...storeSettings, phone: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E4DF] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[#737373] font-semibold mb-1">
                      Official Email
                    </label>
                    <input
                      type="email"
                      value={storeSettings.email}
                      onChange={(e) =>
                        setStoreSettings({ ...storeSettings, email: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E4DF] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[#737373] font-semibold mb-1">
                      Free Shipping Minimum (₦)
                    </label>
                    <input
                      type="number"
                      value={storeSettings.freeShippingThreshold}
                      onChange={(e) =>
                        setStoreSettings({
                          ...storeSettings,
                          freeShippingThreshold: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E4DF] text-xs"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E6E4DF] flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full text-xs font-semibold bg-[#E0218A] hover:bg-[#BE185D] text-white shadow-md cursor-pointer"
                  >
                    Save Store Settings
                  </button>
                </div>
              </form>

              {/* Delivery Zones Table */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6E4DF] shadow-xs space-y-4">
                <h3 className="font-serif font-bold text-base text-[#171717]">
                  Configured Shipping & Delivery Zones
                </h3>
                <div className="border border-[#E6E4DF] rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF9F6] border-b border-[#E6E4DF] text-[#737373] font-semibold">
                      <tr>
                        <th className="py-2.5 px-4">Zone Name</th>
                        <th className="py-2.5 px-4">Delivery Rate (₦)</th>
                        <th className="py-2.5 px-4">Estimated Transit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E6E4DF]">
                      {storeSettings.shippingZones.map((z) => (
                        <tr key={z.id}>
                          <td className="py-2.5 px-4 font-semibold text-[#171717]">{z.name}</td>
                          <td className="py-2.5 px-4 tabular-nums">₦{z.rate.toLocaleString()}</td>
                          <td className="py-2.5 px-4 text-[#737373]">{z.estimatedDelivery}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Audit Activity Log */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6E4DF] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-[#171717]">
                    System Administrative Audit Trail
                  </h3>
                  <select
                    value={auditLogTypeFilter}
                    onChange={(e) => setAuditLogTypeFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-full border border-[#E6E4DF] text-xs bg-[#FAF9F6] cursor-pointer"
                  >
                    <option value="All">All Actions</option>
                    <option value="product">Product Changes</option>
                    <option value="inventory">Inventory Adjustments</option>
                    <option value="order">Order Statuses</option>
                    <option value="category">Category Changes</option>
                    <option value="system">System Settings</option>
                  </select>
                </div>

                <div className="divide-y divide-[#E6E4DF] max-h-96 overflow-y-auto">
                  {activityLogs
                    .filter(
                      (l) => auditLogTypeFilter === 'All' || l.type === auditLogTypeFilter
                    )
                    .map((log) => (
                      <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#171717]">{log.action}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF5FF] text-[#9333EA] border border-[#E9D5FF]">
                              {log.role}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#737373] mt-0.5">{log.details}</p>
                        </div>
                        <span className="text-[10px] text-[#A39E93] shrink-0">{log.timestamp}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Product Editor Modal */}
      <ProductEditorModal
        isOpen={editorModalOpen}
        onClose={() => setEditorModalOpen(false)}
        product={editingProduct}
        onSave={handleSaveProduct}
      />

      {/* Category Editor Modal */}
      <CategoryModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        category={editingCategory}
        onSaved={reloadAllState}
      />

      {/* Attribute Editor Modal */}
      <AttributeModal
        isOpen={attributeModalOpen}
        onClose={() => setAttributeModalOpen(false)}
        attribute={editingAttribute}
        onSaved={reloadAllState}
      />

      {/* Standalone Media Library Modal */}
      <MediaLibraryModal
        isOpen={mediaModalOpen}
        onClose={() => {
          setMediaModalOpen(false);
          setVariationPhotoTarget(null);
        }}
        onSelectImage={(url) => {
          if (variationPhotoTarget) {
            handleSelectVariationPhoto(url);
          } else {
            triggerToast('Media asset selected.');
            reloadAllState();
          }
        }}
        title={
          variationPhotoTarget
            ? 'Assign Photo to Specific Variation'
            : 'Select Image from Media Library'
        }
      />

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrderDetails}
        isOpen={!!selectedOrderDetails}
        onClose={() => setSelectedOrderDetails(null)}
        onStatusUpdated={(orderId, newStatus) => {
          adminStorage.updateOrderStatus(orderId, newStatus);
          onUpdateOrderStatus(orderId, newStatus);
          reloadAllState();
          triggerToast(`Order ${orderId} updated to ${newStatus}.`);
        }}
        onOpenPrintSlip={(ord) => setPrintOrderModal(ord)}
      />

      {/* Printable Packing Slip Modal */}
      <OrderPackingSlipModal
        order={printOrderModal}
        isOpen={!!printOrderModal}
        onClose={() => setPrintOrderModal(null)}
      />

      {/* Coupon Creation Modal */}
      {couponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#E6E4DF] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6E4DF] pb-3">
              <h3 className="font-serif font-bold text-base text-[#171717]">
                Create Promotional Coupon
              </h3>
              <button
                onClick={() => setCouponModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#F4F3EF] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GALA20"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E6E4DF] font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Discount Type</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E4DF]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₦)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={newCouponVal}
                    onChange={(e) => setNewCouponVal(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E4DF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Min. Spend (₦)</label>
                  <input
                    type="number"
                    value={newCouponMin}
                    onChange={(e) => setNewCouponMin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E4DF]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={newCouponExp}
                    onChange={(e) => setNewCouponExp(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E4DF]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#E6E4DF] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCouponModalOpen(false)}
                  className="px-4 py-1.5 rounded-full border border-[#E6E4DF] text-[#737373]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-full bg-[#E0218A] text-white font-semibold shadow-xs"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
