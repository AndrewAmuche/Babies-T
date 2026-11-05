export type ProductCategory =
  | 'All'
  | 'Ball Dresses'
  | 'Gowns'
  | 'Shoes'
  | 'Kids Clothing'
  | 'Baby Girls'
  | 'Baby Boys'
  | 'Newborn Essentials'
  | 'Occasion Wear';

export interface ProductSwatch {
  name: string;
  hex: string;
  visualColorClass?: string;
  imageUrl?: string;
}

export type ProductType = 'simple' | 'variable';
export type ProductStatus = 'published' | 'draft' | 'archived';

export interface AttributeTerm {
  id: string;
  name: string;
  slug: string;
  value?: string; // Hex color for swatches or label
}

export interface ProductAttribute {
  id: string;
  name: string;
  slug: string;
  displayType: 'button' | 'color' | 'select';
  terms: AttributeTerm[];
  isVariation: boolean;
  isVisible: boolean;
}

export interface ProductVariation {
  id: string;
  name: string; // e.g. "Pink / 1-2 Years"
  sku: string;
  price: number;
  regularPrice?: number;
  inventory: number;
  inStock: boolean;
  imageUrl?: string; // MANDATORY: Specific image for this variation
  attributes: Record<string, string>; // e.g. { "Colour": "Pink", "Size": "1-2 Years" }
  enabled: boolean;
  weight?: string;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  subtitle: string;
  category: string;
  subcategory?: string;
  type?: ProductType;
  status?: ProductStatus;
  price: number;
  originalPrice?: number;
  salePrice?: number;
  saleStartDate?: string;
  saleEndDate?: string;
  sku?: string;
  barcode?: string;
  description: string;
  story: string;
  materials: string;
  dimensions: string; // Age & Size guide (e.g. 1-2Y to 7-8Y)
  weight?: string;
  careInstructions: string;
  shippingInfo: string;
  swatches: ProductSwatch[];
  galleryImages?: string[];
  tags?: string[];
  attributes?: ProductAttribute[];
  variations?: ProductVariation[];
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  inventory: number;
  lowStockThreshold?: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isPreOrder?: boolean;
  preOrderDate?: string;
  seoTitle?: string;
  seoDescription?: string;
  altText?: string;
  designer: string;
  brand?: string;
  madeIn: string;
  imageUrl?: string;
  hoverImageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id: string; // unique item instance id (productId + variationId / swatchName)
  product: Product;
  selectedSwatch: ProductSwatch;
  selectedVariation?: ProductVariation;
  selectedSize?: string;
  quantity: number;
}

export interface OrderItemVariation {
  size?: string;
  colour?: string;
  sku?: string;
  imageUrl?: string;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  date: string;
  timestamp: number;
  status: 'Paid' | 'Packing' | 'Shipped' | 'Completed' | 'Cancelled' | 'Refunded';
  deliverySpeed: 'standard' | 'express' | 'white-glove';
  paymentMethod: 'card' | 'apple-pay' | 'klarna' | 'bank-transfer';
  transactionRef?: string;
  notes?: string;
  internalNotes?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
  imageUrl?: string;
  order: number;
  isActive: boolean;
  productCount?: number;
}

export interface TagItem {
  id: string;
  name: string;
  slug: string;
  productCount?: number;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  altText: string;
  size: string;
  dimensions: string;
  uploadedAt: string;
  referencedBy?: string[];
}

export interface CouponItem {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend?: number;
  expiryDate: string;
  usageCount: number;
  usageLimit?: number;
  isActive: boolean;
}

export interface CustomerItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  ordersCount: number;
  totalSpent: number;
  registeredAt: string;
  status: 'active' | 'vip' | 'inactive';
}

export type AdminRole =
  | 'Super Admin'
  | 'Store Manager'
  | 'Product Manager'
  | 'Order Manager'
  | 'Content Manager';

export interface ShippingZone {
  id: string;
  name: string;
  rate: number;
  freeThreshold?: number;
  estimatedDelivery: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  heroHeadline: string;
  heroAnnouncement: string;
  freeShippingThreshold: number;
  onitshaAddress?: string;
  lagosAddress: string;
  abujaAddress: string;
  phone: string;
  email: string;
  instagram: string;
  whatsapp: string;
  shippingZones: ShippingZone[];
}

export interface ActivityLogItem {
  id: string;
  user: string;
  role: string;
  action: string;
  details: string;
  timestamp: string;
  type: 'product' | 'order' | 'inventory' | 'category' | 'coupon' | 'system';
}

export type ViewMode = 'storefront' | 'checkout' | 'order-success' | 'admin';

export type AdminTab =
  | 'overview'
  | 'products'
  | 'variations'
  | 'categories'
  | 'attributes'
  | 'tags'
  | 'inventory'
  | 'orders'
  | 'customers'
  | 'media'
  | 'coupons'
  | 'analytics'
  | 'settings';
