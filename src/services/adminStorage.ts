import {
  Product,
  Order,
  CategoryItem,
  ProductAttribute,
  TagItem,
  MediaItem,
  CouponItem,
  CustomerItem,
  ActivityLogItem,
  ProductVariation,
  AttributeTerm,
  StoreSettings,
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from '../data/mockData';

const STORAGE_KEYS = {
  PRODUCTS: 'babies_touch_products_v2',
  ORDERS: 'babies_touch_orders_v2',
  CATEGORIES: 'babies_touch_categories_v2',
  ATTRIBUTES: 'babies_touch_attributes_v2',
  TAGS: 'babies_touch_tags_v2',
  MEDIA: 'babies_touch_media_v2',
  COUPONS: 'babies_touch_coupons_v2',
  CUSTOMERS: 'babies_touch_customers_v2',
  ACTIVITY_LOGS: 'babies_touch_activity_logs_v2',
  SETTINGS: 'babies_touch_settings_v2',
};

// Seed Global Attributes
const INITIAL_ATTRIBUTES: ProductAttribute[] = [
  {
    id: 'attr-size',
    name: 'Size',
    slug: 'size',
    displayType: 'button',
    isVariation: true,
    isVisible: true,
    terms: [
      { id: 'size-nb', name: 'Newborn', slug: 'newborn' },
      { id: 'size-03m', name: '0-3 Months', slug: '0-3m' },
      { id: 'size-36m', name: '3-6 Months', slug: '3-6m' },
      { id: 'size-612m', name: '6-12 Months', slug: '6-12m' },
      { id: 'size-12y', name: '1-2 Years', slug: '1-2y' },
      { id: 'size-23y', name: '2-3 Years', slug: '2-3y' },
      { id: 'size-45y', name: '4-5 Years', slug: '4-5y' },
      { id: 'size-67y', name: '6-7 Years', slug: '6-7y' },
      { id: 'size-89y', name: '8-9 Years', slug: '8-9y' },
    ],
  },
  {
    id: 'attr-colour',
    name: 'Colour',
    slug: 'colour',
    displayType: 'color',
    isVariation: true,
    isVisible: true,
    terms: [
      { id: 'col-pink', name: 'Blush Pink', slug: 'blush-pink', value: '#F3D6D8' },
      { id: 'col-gold', name: 'Midnight & Gold', slug: 'midnight-gold', value: '#1C1C1E' },
      { id: 'col-emerald', name: 'Emerald Polka', slug: 'emerald-polka', value: '#4A6B48' },
      { id: 'col-scarlet', name: 'Scarlet Polka', slug: 'scarlet-polka', value: '#B01824' },
      { id: 'col-powder-pink', name: 'Pink Polka', slug: 'pink-polka', value: '#D88A96' },
      { id: 'col-ivory', name: 'Ivory Pearl', slug: 'ivory-pearl', value: '#FDFBF7' },
      { id: 'col-royal-pink', name: 'Royal Rosette Pink', slug: 'royal-pink', value: '#E8A3BA' },
      { id: 'col-black', name: 'Patent Onyx', slug: 'patent-onyx', value: '#1A1A1A' },
    ],
  },
  {
    id: 'attr-age-group',
    name: 'Age Group',
    slug: 'age-group',
    displayType: 'select',
    isVariation: false,
    isVisible: true,
    terms: [
      { id: 'age-newborn', name: 'Newborn Essentials', slug: 'newborn' },
      { id: 'age-infant', name: 'Infant (0-12M)', slug: 'infant' },
      { id: 'age-toddler', name: 'Toddler (1-3Y)', slug: 'toddler' },
      { id: 'age-kids', name: 'Little Princess (4-9Y)', slug: 'kids' },
    ],
  },
];

// Seed Categories
const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-ball-dresses',
    name: 'Ball Dresses',
    slug: 'ball-dresses',
    description: 'Sculptural luxury ballgowns with organic linings',
    parentId: null,
    imageUrl: '/assets/products/royal-pink-rosette-ball-gown.jpg',
    order: 1,
    isActive: true,
    productCount: 8,
  },
  {
    id: 'cat-gowns',
    name: 'Gowns',
    slug: 'gowns',
    description: 'Floor-length ceremonial gowns for christening and birthdays',
    parentId: null,
    imageUrl: '/assets/products/ivory-champagne-rosette-gown.jpg',
    order: 2,
    isActive: true,
    productCount: 5,
  },
  {
    id: 'cat-shoes',
    name: 'Shoes',
    slug: 'shoes',
    description: 'Italian calfskin and shimmer leather occasion shoes',
    parentId: null,
    imageUrl: '/assets/products/midnight-gold-rose-dress.jpg',
    order: 3,
    isActive: true,
    productCount: 4,
  },
  {
    id: 'cat-baby-girls',
    name: 'Baby Girls Clothing',
    slug: 'baby-girls',
    description: 'Two-piece sets, romper suits, and sweet occasion dresses',
    parentId: null,
    imageUrl: '/assets/products/blush-lace-crystal-gown.jpg',
    order: 4,
    isActive: true,
    productCount: 6,
  },
  {
    id: 'cat-occasion-wear',
    name: 'Occasion Wear',
    slug: 'occasion-wear',
    description: 'Flower girl, birthday milestone, and royal gala outfits',
    parentId: null,
    imageUrl: '/assets/showcase/red-polka-dot-ballgown.png',
    order: 5,
    isActive: true,
    productCount: 7,
  },
  {
    id: 'cat-flower-girl',
    name: 'Flower Girl Dresses',
    slug: 'flower-girl-dresses',
    description: 'Bespoke bridal party and ceremony creations',
    parentId: 'cat-occasion-wear',
    imageUrl: '/assets/showcase/green-polka-dot-dress.png',
    order: 6,
    isActive: true,
    productCount: 3,
  },
];

// Seed Tags
const INITIAL_TAGS: TagItem[] = [
  { id: 'tag-birthday', name: 'Birthday Outfit', slug: 'birthday-outfit', productCount: 6 },
  { id: 'tag-gala', name: 'Royal Gala', slug: 'royal-gala', productCount: 5 },
  { id: 'tag-heirloom', name: 'Heirloom Archive', slug: 'heirloom-archive', productCount: 4 },
  { id: 'tag-hand-stitched', name: 'Hand-Stitched', slug: 'hand-stitched', productCount: 8 },
  { id: 'tag-limited', name: 'Limited Stock', slug: 'limited-stock', productCount: 3 },
  { id: 'tag-best-seller', name: 'Best Seller', slug: 'best-seller', productCount: 4 },
  { id: 'tag-organic-lining', name: '100% Organic Lining', slug: 'organic-lining', productCount: 7 },
];

// Seed Media Assets
const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'med-1',
    name: 'Emerald Polka-Dot Flower Girl Dress',
    url: '/assets/showcase/green-polka-dot-dress.png',
    altText: 'Emerald Polka-Dot Flower Girl Ball Dress on Gold Mannequin',
    size: '1.8 MB',
    dimensions: '1920 × 1080',
    uploadedAt: '2026-10-18',
  },
  {
    id: 'med-2',
    name: 'Scarlet Polka-Dot Ballgown',
    url: '/assets/showcase/red-polka-dot-ballgown.png',
    altText: 'Scarlet Polka-Dot Ballgown on Gold Mannequin',
    size: '1.7 MB',
    dimensions: '1920 × 1080',
    uploadedAt: '2026-10-18',
  },
  {
    id: 'med-3',
    name: 'Pink Polka Dot Party Dress',
    url: '/assets/showcase/pink-polka-dot-dress.png',
    altText: 'Blush & Ruby Polka-Dot Celebration Dress',
    size: '1.7 MB',
    dimensions: '1920 × 1080',
    uploadedAt: '2026-10-18',
  },
  {
    id: 'med-4',
    name: 'Midnight Gold Rose Dress',
    url: '/assets/products/midnight-gold-rose-dress.jpg',
    altText: 'Amara Midnight Rose Flared Party Dress Studio Portrait',
    size: '1.2 MB',
    dimensions: '1200 × 896',
    uploadedAt: '2026-10-15',
  },
  {
    id: 'med-5',
    name: 'Blush Lace Crystal Gown',
    url: '/assets/products/blush-lace-crystal-gown.jpg',
    altText: 'Florence Royal Lace & Pearl Ball Gown',
    size: '1.3 MB',
    dimensions: '1200 × 896',
    uploadedAt: '2026-10-15',
  },
  {
    id: 'med-6',
    name: 'Royal Pink Rosette Ball Gown',
    url: '/assets/products/royal-pink-rosette-ball-gown.jpg',
    altText: 'Seraphina Royal Pink Rosette Ball Gown',
    size: '1.4 MB',
    dimensions: '1200 × 896',
    uploadedAt: '2026-10-15',
  },
  {
    id: 'med-7',
    name: 'Ivory Champagne Rosette Gown',
    url: '/assets/products/ivory-champagne-rosette-gown.jpg',
    altText: 'Aurora Heirloom Rosette Ceremonial Gown',
    size: '1.1 MB',
    dimensions: '1200 × 896',
    uploadedAt: '2026-10-15',
  },
  {
    id: 'med-8',
    name: 'Raspberry Crimson Rose Dress',
    url: '/assets/products/raspberry-crimson-rose-dress.jpg',
    altText: 'Crimson Rose Celebration Party Dress',
    size: '1.2 MB',
    dimensions: '1200 × 896',
    uploadedAt: '2026-10-16',
  },
  {
    id: 'med-9',
    name: 'Scarlet Red Black Rose Dress',
    url: '/assets/products/scarlet-red-black-rose-dress.jpg',
    altText: 'Scarlet Rose Contrast Evening Dress',
    size: '1.3 MB',
    dimensions: '1200 × 896',
    uploadedAt: '2026-10-16',
  },
  {
    id: 'med-10',
    name: 'Aqua Bloom Flared Dress',
    url: '/assets/products/aqua-bloom-flared-dress.jpg',
    altText: 'Aqua Bloom Flared Occasion Dress',
    size: '1.1 MB',
    dimensions: '1200 × 896',
    uploadedAt: '2026-10-16',
  },
];

// Seed Coupons
const INITIAL_COUPONS: CouponItem[] = [
  {
    id: 'cp-welcome10',
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minSpend: 50000,
    expiryDate: '2026-12-31',
    usageCount: 42,
    usageLimit: 500,
    isActive: true,
  },
  {
    id: 'cp-royalbaby',
    code: 'ROYALBABY',
    discountType: 'fixed',
    discountValue: 5000,
    minSpend: 60000,
    expiryDate: '2026-11-30',
    usageCount: 18,
    usageLimit: 100,
    isActive: true,
  },
  {
    id: 'cp-milestone',
    code: 'MILESTONE15',
    discountType: 'percentage',
    discountValue: 15,
    minSpend: 80000,
    expiryDate: '2026-12-15',
    usageCount: 12,
    usageLimit: 50,
    isActive: true,
  },
];

// Seed Customers
const INITIAL_CUSTOMERS: CustomerItem[] = [
  {
    id: 'cust-1',
    name: 'Folake Adeleke',
    email: 'folake.adeleke@lagosluxury.ng',
    phone: '+234 803 456 7890',
    city: 'Ikoyi, Lagos',
    ordersCount: 4,
    totalSpent: 312000,
    registeredAt: '2026-06-12',
    status: 'vip',
  },
  {
    id: 'cust-2',
    name: 'Amina Bello',
    email: 'amina.bello@maitama.ng',
    phone: '+234 802 334 1122',
    city: 'Maitama, Abuja',
    ordersCount: 3,
    totalSpent: 245000,
    registeredAt: '2026-07-20',
    status: 'vip',
  },
  {
    id: 'cust-3',
    name: 'Chidinma Okafor',
    email: 'chidinma.okafor@gra.ng',
    phone: '+234 818 901 2345',
    city: 'GRA, Port Harcourt',
    ordersCount: 2,
    totalSpent: 162000,
    registeredAt: '2026-08-04',
    status: 'active',
  },
  {
    id: 'cust-4',
    name: 'Zainab Danjuma',
    email: 'zainab.d@kado.ng',
    phone: '+234 805 778 9900',
    city: 'Asokoro, Abuja',
    ordersCount: 1,
    totalSpent: 78000,
    registeredAt: '2026-09-18',
    status: 'active',
  },
];

// Seed Activity Log
const INITIAL_LOGS: ActivityLogItem[] = [
  {
    id: 'log-1',
    user: 'Victoria Danladi',
    role: 'Super Admin',
    action: 'Product Updated',
    details: 'Assigned distinct variation images for Amara Midnight Rose Dress',
    timestamp: '2026-10-19 18:30',
    type: 'product',
  },
  {
    id: 'log-2',
    user: 'Chioma Nwosu',
    role: 'Store Manager',
    action: 'Inventory Adjusted',
    details: 'Restocked Florence Royal Lace Ball Gown (+10 units)',
    timestamp: '2026-10-19 16:15',
    type: 'inventory',
  },
  {
    id: 'log-3',
    user: 'Victoria Danladi',
    role: 'Super Admin',
    action: 'Order Shipped',
    details: 'Order BT-9104 marked as Shipped via Express Courier',
    timestamp: '2026-10-19 14:00',
    type: 'order',
  },
];

// Helper to seed variations for variable products
function enrichProductWithVariations(p: Product): Product {
  const isVariable = p.category === 'Ball Dresses' || p.category === 'Gowns';
  const type = p.type || (isVariable ? 'variable' : 'simple');
  const status = p.status || 'published';
  const sku = p.sku || `BT-${p.id.substring(0, 4).toUpperCase()}-001`;

  let variations: ProductVariation[] = p.variations || [];
  if (type === 'variable' && (!variations || variations.length === 0)) {
    // Generate realistic variations with individual images!
    const sizes = ['1-2Y', '3-4Y', '5-6Y'];
    const swatches = p.swatches.slice(0, 3);
    variations = [];

    swatches.forEach((swatch, sIdx) => {
      sizes.forEach((size, szIdx) => {
        // Individual image assignment per variation!
        const imageForVariation =
          sIdx === 0
            ? p.imageUrl || '/assets/products/midnight-gold-rose-dress.jpg'
            : sIdx === 1
            ? p.hoverImageUrl || '/assets/products/blush-lace-crystal-gown.jpg'
            : '/assets/products/royal-pink-rosette-ball-gown.jpg';

        variations.push({
          id: `${p.id}-var-${swatch.name.toLowerCase().replace(/\s+/g, '-')}-${size}`,
          name: `${swatch.name} / ${size}`,
          sku: `${sku}-${swatch.name.substring(0, 3).toUpperCase()}-${size.replace('-', '')}`,
          price: p.price + (szIdx * 2000),
          regularPrice: p.originalPrice || p.price + 5000,
          inventory: 8 - (szIdx * 2),
          inStock: true,
          imageUrl: imageForVariation, // Individual image assigned!
          attributes: {
            Colour: swatch.name,
            Size: size,
          },
          enabled: true,
        });
      });
    });
  }

  return {
    ...p,
    type,
    status,
    sku,
    variations,
    galleryImages: p.galleryImages || [
      p.imageUrl || '/assets/products/midnight-gold-rose-dress.jpg',
      p.hoverImageUrl || '/assets/products/royal-pink-rosette-ball-gown.jpg',
      '/assets/products/blush-lace-crystal-gown.jpg',
    ],
    tags: p.tags || ['Hand-Stitched', '100% Organic Lining', 'Royal Gala'],
    createdAt: p.createdAt || '2026-10-10',
    updatedAt: p.updatedAt || '2026-10-19',
  };
}

// Durable Storage API
export const adminStorage = {
  // Products
  getProducts(): Product[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('LocalStorage error reading products', e);
    }
    const initial = INITIAL_PRODUCTS.map(enrichProductWithVariations);
    this.saveProducts(initial);
    return initial;
  },

  saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed saving products to storage', e);
    }
  },

  saveProduct(product: Product): Product {
    const list = this.getProducts();
    const existingIndex = list.findIndex((p) => p.id === product.id);
    const enriched = {
      ...product,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    if (existingIndex >= 0) {
      list[existingIndex] = enriched;
      this.logActivity(
        'Product Updated',
        `Updated "${enriched.name}" (${enriched.variations?.length || 0} variations)`,
        'product'
      );
    } else {
      enriched.createdAt = new Date().toISOString().split('T')[0];
      list.unshift(enriched);
      this.logActivity(
        'Product Created',
        `Created new product "${enriched.name}"`,
        'product'
      );
    }

    this.saveProducts(list);
    return enriched;
  },

  deleteProduct(productId: string): boolean {
    const list = this.getProducts();
    const target = list.find((p) => p.id === productId);
    const filtered = list.filter((p) => p.id !== productId);
    this.saveProducts(filtered);
    if (target) {
      this.logActivity('Product Deleted', `Deleted "${target.name}"`, 'product');
    }
    return true;
  },

  duplicateProduct(productId: string): Product | null {
    const list = this.getProducts();
    const target = list.find((p) => p.id === productId);
    if (!target) return null;

    const cloned: Product = {
      ...target,
      id: `${target.id}-copy-${Date.now().toString().slice(-4)}`,
      name: `${target.name} (Copy)`,
      status: 'draft',
      sku: `${target.sku || 'BT'}-COPY`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      variations: target.variations?.map((v) => ({
        ...v,
        id: `${v.id}-copy`,
        sku: `${v.sku}-COPY`,
      })),
    };

    list.unshift(cloned);
    this.saveProducts(list);
    this.logActivity(
      'Product Duplicated',
      `Duplicated "${target.name}" as draft`,
      'product'
    );
    return cloned;
  },

  // Orders
  getOrders(): Order[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('LocalStorage error reading orders', e);
    }
    this.saveOrders(INITIAL_ORDERS);
    return INITIAL_ORDERS;
  },

  saveOrders(orders: Order[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed saving orders', e);
    }
  },

  updateOrderStatus(
    orderId: string,
    newStatus: Order['status'],
    internalNote?: string
  ): Order | null {
    const orders = this.getOrders();
    const target = orders.find((o) => o.id === orderId);
    if (!target) return null;

    target.status = newStatus;
    if (internalNote) {
      target.internalNotes = internalNote;
    }

    this.saveOrders(orders);
    this.logActivity(
      'Order Status Changed',
      `Order ${orderId} changed to ${newStatus}`,
      'order'
    );
    return target;
  },

  // Categories
  getCategories(): CategoryItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('LocalStorage error reading categories', e);
    }
    this.saveCategories(INITIAL_CATEGORIES);
    return INITIAL_CATEGORIES;
  },

  saveCategories(categories: CategoryItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {}
  },

  saveCategory(cat: CategoryItem): CategoryItem {
    const list = this.getCategories();
    const idx = list.findIndex((c) => c.id === cat.id);
    if (idx >= 0) {
      list[idx] = cat;
      this.logActivity('Category Updated', `Updated category "${cat.name}"`, 'category');
    } else {
      list.push(cat);
      this.logActivity('Category Created', `Created category "${cat.name}"`, 'category');
    }
    this.saveCategories(list);
    return cat;
  },

  deleteCategory(catId: string): boolean {
    const list = this.getCategories().filter((c) => c.id !== catId);
    this.saveCategories(list);
    this.logActivity('Category Deleted', `Deleted category ${catId}`, 'category');
    return true;
  },

  // Attributes
  getAttributes(): ProductAttribute[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ATTRIBUTES);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    this.saveAttributes(INITIAL_ATTRIBUTES);
    return INITIAL_ATTRIBUTES;
  },

  saveAttributes(attributes: ProductAttribute[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ATTRIBUTES, JSON.stringify(attributes));
    } catch (e) {}
  },

  saveAttribute(attr: ProductAttribute): ProductAttribute {
    const list = this.getAttributes();
    const idx = list.findIndex((a) => a.id === attr.id);
    if (idx >= 0) {
      list[idx] = attr;
      this.logActivity('Attribute Updated', `Updated attribute "${attr.name}"`, 'system');
    } else {
      list.push(attr);
      this.logActivity('Attribute Created', `Created attribute "${attr.name}"`, 'system');
    }
    this.saveAttributes(list);
    return attr;
  },

  deleteAttribute(attrId: string): boolean {
    const list = this.getAttributes().filter((a) => a.id !== attrId);
    this.saveAttributes(list);
    this.logActivity('Attribute Deleted', `Deleted attribute ${attrId}`, 'system');
    return true;
  },

  addTerm(attrId: string, term: AttributeTerm): boolean {
    const list = this.getAttributes();
    const attr = list.find((a) => a.id === attrId);
    if (!attr) return false;
    const exists = attr.terms.some((t) => t.slug === term.slug || t.id === term.id);
    if (exists) {
      attr.terms = attr.terms.map((t) => (t.id === term.id ? term : t));
    } else {
      attr.terms.push(term);
    }
    this.saveAttributes(list);
    this.logActivity('Term Added', `Added term "${term.name}" to ${attr.name}`, 'system');
    return true;
  },

  deleteTerm(attrId: string, termId: string): boolean {
    const list = this.getAttributes();
    const attr = list.find((a) => a.id === attrId);
    if (!attr) return false;
    attr.terms = attr.terms.filter((t) => t.id !== termId);
    this.saveAttributes(list);
    this.logActivity('Term Deleted', `Removed term ${termId} from ${attr.name}`, 'system');
    return true;
  },

  // Direct Variation Image Assignment (Mandatory Requirement 4.1)
  updateVariationImage(productId: string, variationId: string, imageUrl: string): boolean {
    const products = this.getProducts();
    const prod = products.find((p) => p.id === productId);
    if (!prod || !prod.variations) return false;

    const variation = prod.variations.find((v) => v.id === variationId);
    if (!variation) return false;

    variation.imageUrl = imageUrl;
    prod.updatedAt = new Date().toISOString().split('T')[0];
    this.saveProducts(products);

    this.logActivity(
      'Variation Photo Assigned',
      `Assigned photo to variation "${variation.name}" on ${prod.name}`,
      'product'
    );
    return true;
  },

  // Direct Variation Price & Stock Update
  updateVariationData(
    productId: string,
    variationId: string,
    price: number,
    inventory: number
  ): boolean {
    const products = this.getProducts();
    const prod = products.find((p) => p.id === productId);
    if (!prod || !prod.variations) return false;

    const variation = prod.variations.find((v) => v.id === variationId);
    if (!variation) return false;

    variation.price = price;
    variation.inventory = inventory;
    variation.inStock = inventory > 0;
    prod.updatedAt = new Date().toISOString().split('T')[0];
    this.saveProducts(products);

    this.logActivity(
      'Variation Updated',
      `Updated price (₦${price.toLocaleString()}) & stock (${inventory}) for ${variation.name}`,
      'inventory'
    );
    return true;
  },

  // Tags
  getTags(): TagItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TAGS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    this.saveTags(INITIAL_TAGS);
    return INITIAL_TAGS;
  },

  saveTags(tags: TagItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
    } catch (e) {}
  },

  saveTag(tag: TagItem): TagItem {
    const list = this.getTags();
    const idx = list.findIndex((t) => t.id === tag.id);
    if (idx >= 0) {
      list[idx] = tag;
    } else {
      list.push(tag);
      this.logActivity('Tag Created', `Created tag #${tag.name}`, 'system');
    }
    this.saveTags(list);
    return tag;
  },

  deleteTag(tagId: string): boolean {
    const list = this.getTags().filter((t) => t.id !== tagId);
    this.saveTags(list);
    this.logActivity('Tag Deleted', `Deleted tag ${tagId}`, 'system');
    return true;
  },

  // Media
  getMedia(): MediaItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MEDIA);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    this.saveMedia(INITIAL_MEDIA);
    return INITIAL_MEDIA;
  },

  saveMedia(media: MediaItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(media));
    } catch (e) {}
  },

  addMediaItem(item: MediaItem): MediaItem {
    const list = this.getMedia();
    list.unshift(item);
    this.saveMedia(list);
    this.logActivity('Media Uploaded', `Uploaded image "${item.name}"`, 'system');
    return item;
  },

  deleteMediaItem(mediaId: string): boolean {
    const list = this.getMedia().filter((m) => m.id !== mediaId);
    this.saveMedia(list);
    this.logActivity('Media Deleted', `Removed media asset ${mediaId}`, 'system');
    return true;
  },

  // Coupons
  getCoupons(): CouponItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.COUPONS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    this.saveCoupons(INITIAL_COUPONS);
    return INITIAL_COUPONS;
  },

  saveCoupons(coupons: CouponItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
    } catch (e) {}
  },

  saveCoupon(coupon: CouponItem): CouponItem {
    const list = this.getCoupons();
    const idx = list.findIndex((c) => c.id === coupon.id);
    if (idx >= 0) {
      list[idx] = coupon;
      this.logActivity('Coupon Updated', `Updated coupon "${coupon.code}"`, 'coupon');
    } else {
      list.push(coupon);
      this.logActivity('Coupon Created', `Created promo coupon "${coupon.code}"`, 'coupon');
    }
    this.saveCoupons(list);
    return coupon;
  },

  deleteCoupon(couponId: string): boolean {
    const list = this.getCoupons().filter((c) => c.id !== couponId);
    this.saveCoupons(list);
    this.logActivity('Coupon Deleted', `Deleted coupon ${couponId}`, 'coupon');
    return true;
  },

  // Customers
  getCustomers(): CustomerItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    this.saveCustomers(INITIAL_CUSTOMERS);
    return INITIAL_CUSTOMERS;
  },

  saveCustomers(customers: CustomerItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    } catch (e) {}
  },

  // Settings & Store Configuration
  getSettings(): StoreSettings {
    const DEFAULT_SETTINGS: StoreSettings = {
      storeName: 'Babies Touch',
      tagline: "Simply Magical — Children's Couture Boutique",
      heroHeadline: 'Wear Confidence. Define Your Style.',
      heroAnnouncement:
        'Main Market Onitsha Flagship Boutique · Nationwide Waybill Delivery Across Nigeria',
      freeShippingThreshold: 150000,
      onitshaAddress: 'Main Market, Onitsha, Anambra State, Nigeria',
      lagosAddress: 'Victoria Island, Lagos, Nigeria',
      abujaAddress: 'Maitama, Abuja, Nigeria',
      phone: '+234 803 123 4567',
      email: 'babiestouchsupport@gmail.com',
      instagram: '@babiestouch_couture',
      whatsapp: '+234 803 123 4567',
      shippingZones: [
        {
          id: 'zone-onitsha',
          name: 'Onitsha & Anambra Direct / Store Pickup',
          rate: 0,
          freeThreshold: 0,
          estimatedDelivery: 'Same Day / 2 Hours Pickup',
        },
        {
          id: 'zone-lagos',
          name: 'Lagos Standard & Express',
          rate: 4500,
          freeThreshold: 150000,
          estimatedDelivery: '24 - 48 Hours',
        },
        {
          id: 'zone-abuja',
          name: 'Abuja & Federal Capital',
          rate: 6500,
          freeThreshold: 150000,
          estimatedDelivery: '24 - 48 Hours',
        },
        {
          id: 'zone-nationwide',
          name: 'Nationwide Express (Nigeria)',
          rate: 8500,
          freeThreshold: 200000,
          estimatedDelivery: '2 - 3 Days',
        },
        {
          id: 'zone-intl',
          name: 'West Africa & International',
          rate: 35000,
          estimatedDelivery: '4 - 7 Business Days',
        },
      ],
    };

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    this.saveSettings(DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: StoreSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      this.logActivity('Settings Saved', 'Updated store policies, delivery rates, and contact info', 'system');
    } catch (e) {}
  },

  // Activity Logs
  getActivityLogs(): ActivityLogItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    this.saveActivityLogs(INITIAL_LOGS);
    return INITIAL_LOGS;
  },

  saveActivityLogs(logs: ActivityLogItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(logs));
    } catch (e) {}
  },

  logActivity(
    action: string,
    details: string,
    type: ActivityLogItem['type'],
    user: string = 'Victoria Danladi',
    role: string = 'Super Admin'
  ): void {
    const logs = this.getActivityLogs();
    const newLog: ActivityLogItem = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user,
      role,
      action,
      details,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type,
    };
    logs.unshift(newLog);
    this.saveActivityLogs(logs.slice(0, 80));
  },
};

