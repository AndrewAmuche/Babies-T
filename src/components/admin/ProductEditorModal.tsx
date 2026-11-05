import React, { useState } from 'react';
import {
  X,
  Upload,
  Plus,
  Trash2,
  Check,
  Layers,
  Image as ImageIcon,
  DollarSign,
  Package,
  Sparkles,
  AlertCircle,
  Copy,
  ChevronDown,
  ChevronRight,
  Sliders,
} from 'lucide-react';
import {
  Product,
  ProductVariation,
  ProductSwatch,
  CategoryItem,
  TagItem,
  ProductAttribute,
} from '../../types';
import { adminStorage } from '../../services/adminStorage';
import { MediaLibraryModal } from './MediaLibraryModal';

interface ProductEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null; // null = creating new product
  onSave: (savedProduct: Product) => void;
}

type EditorTab =
  | 'general'
  | 'images'
  | 'categories'
  | 'variations'
  | 'inventory'
  | 'seo';

export const ProductEditorModal: React.FC<ProductEditorModalProps> = ({
  isOpen,
  onClose,
  product,
  onSave,
}) => {
  const categoriesList = adminStorage.getCategories();
  const tagsList = adminStorage.getTags();
  const attributesList = adminStorage.getAttributes();

  const [activeTab, setActiveTab] = useState<EditorTab>('general');

  // Form State
  const [name, setName] = useState(product?.name || '');
  const [slug, setSlug] = useState(
    product?.slug ||
      (product?.name ? product.name.toLowerCase().replace(/\s+/g, '-') : '')
  );
  const [subtitle, setSubtitle] = useState(product?.subtitle || '');
  const [productType, setProductType] = useState<'simple' | 'variable'>(
    product?.type || 'variable'
  );
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>(
    product?.status || 'published'
  );
  const [price, setPrice] = useState(product?.price ? String(product.price) : '58000');
  const [originalPrice, setOriginalPrice] = useState(
    product?.originalPrice ? String(product.originalPrice) : '68000'
  );
  const [sku, setSku] = useState(product?.sku || `BT-${Date.now().toString().slice(-6)}`);
  const [barcode, setBarcode] = useState(product?.barcode || '');
  const [category, setCategory] = useState(product?.category || 'Ball Dresses');
  const [subcategory, setSubcategory] = useState(product?.subcategory || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(
    product?.tags || ['Hand-Stitched', '100% Organic Lining']
  );
  const [description, setDescription] = useState(
    product?.description ||
      'An exquisite children couture gown tailored with architectural balloon silhouette, hypoallergenic lining, and bespoke hand-embroidery.'
  );
  const [story, setStory] = useState(
    product?.story ||
      'Designed in our atelier to celebrate milestone birthdays, flower girl appearances, and unforgettable royal galas.'
  );
  const [materials, setMaterials] = useState(
    product?.materials ||
      'Heavyweight duchess satin, 100% GOTS combed organic cotton lining, mother-of-pearl buttons.'
  );
  const [dimensions, setDimensions] = useState(
    product?.dimensions || 'Sizes: 1-2Y (86-92cm), 3-4Y (98-104cm), 5-6Y (110-116cm)'
  );
  const [inventory, setInventory] = useState(
    product?.inventory !== undefined ? String(product.inventory) : '15'
  );
  const [lowStockThreshold, setLowStockThreshold] = useState(
    product?.lowStockThreshold ? String(product.lowStockThreshold) : '5'
  );
  const [inStock, setInStock] = useState(product?.inStock !== false);
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured || false);
  const [isNewArrival, setIsNewArrival] = useState(product?.isNewArrival || false);
  const [isBestSeller, setIsBestSeller] = useState(product?.isBestSeller || false);
  const [isPreOrder, setIsPreOrder] = useState(product?.isPreOrder || false);
  const [preOrderDate, setPreOrderDate] = useState(product?.preOrderDate || '');
  const [seoTitle, setSeoTitle] = useState(product?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(product?.seoDescription || '');

  // Images state
  const [mainImageUrl, setMainImageUrl] = useState(
    product?.imageUrl || '/assets/products/midnight-gold-rose-dress.jpg'
  );
  const [galleryImages, setGalleryImages] = useState<string[]>(
    product?.galleryImages || [
      product?.imageUrl || '/assets/products/midnight-gold-rose-dress.jpg',
      product?.hoverImageUrl || '/assets/products/blush-lace-crystal-gown.jpg',
      '/assets/products/royal-pink-rosette-ball-gown.jpg',
    ]
  );

  // Swatches state
  const [swatches, setSwatches] = useState<ProductSwatch[]>(
    product?.swatches || [
      { name: 'Onyx & Gold', hex: '#1C1C1E' },
      { name: 'Ivory Pearl', hex: '#FDFBF7' },
      { name: 'Blush Rose', hex: '#F3D6D8' },
    ]
  );

  // Variations State
  const [variations, setVariations] = useState<ProductVariation[]>(
    product?.variations || []
  );

  // Attributes for generating variations
  const [selectedAttributeTerms, setSelectedAttributeTerms] = useState<
    Record<string, string[]>
  >({
    Size: ['1-2Y', '3-4Y', '5-6Y'],
    Colour: swatches.map((s) => s.name),
  });

  // Media Library Modal Controller
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<
    | { type: 'main' }
    | { type: 'gallery' }
    | { type: 'variation'; variationId: string }
  >({ type: 'main' });

  // Bulk edit controls for variations
  const [bulkPriceInput, setBulkPriceInput] = useState('');
  const [bulkStockInput, setBulkStockInput] = useState('');

  if (!isOpen) return null;

  // Generate All Variation Combinations
  const handleGenerateVariations = () => {
    const sizeTerms = selectedAttributeTerms['Size'] || ['1-2Y', '3-4Y'];
    const colourTerms = selectedAttributeTerms['Colour'] || ['Blush Rose'];

    const newVariations: ProductVariation[] = [];
    const basePrice = parseFloat(price) || 50000;
    const baseSku = sku || 'BT-VAR';

    colourTerms.forEach((col, cIdx) => {
      sizeTerms.forEach((sz, sIdx) => {
        // Find existing image or assign appropriate swatch image
        const assignedImage =
          cIdx === 0
            ? mainImageUrl
            : galleryImages[cIdx % galleryImages.length] || mainImageUrl;

        newVariations.push({
          id: `var-${Date.now()}-${cIdx}-${sIdx}`,
          name: `${col} / ${sz}`,
          sku: `${baseSku}-${col.substring(0, 3).toUpperCase()}-${sz.replace(/\s+/g, '')}`,
          price: basePrice + sIdx * 2000,
          regularPrice: (parseFloat(originalPrice) || basePrice + 10000),
          inventory: 8,
          inStock: true,
          imageUrl: assignedImage, // ASSIGNED SPECIFIC IMAGE
          attributes: {
            Colour: col,
            Size: sz,
          },
          enabled: true,
        });
      });
    });

    setVariations(newVariations);
  };

  const handleAddSingleVariation = () => {
    const basePrice = parseFloat(price) || 50000;
    const newVar: ProductVariation = {
      id: `var-custom-${Date.now()}`,
      name: `Custom Variation ${variations.length + 1}`,
      sku: `${sku || 'BT'}-VAR-${variations.length + 1}`,
      price: basePrice,
      regularPrice: parseFloat(originalPrice) || basePrice + 10000,
      inventory: 5,
      inStock: true,
      imageUrl: mainImageUrl,
      attributes: { Custom: 'Option' },
      enabled: true,
    };
    setVariations([...variations, newVar]);
  };

  const handleUpdateVariation = (
    varId: string,
    field: keyof ProductVariation,
    value: any
  ) => {
    setVariations(
      variations.map((v) => (v.id === varId ? { ...v, [field]: value } : v))
    );
  };

  const handleDeleteVariation = (varId: string) => {
    if (window.confirm('Delete this variation?')) {
      setVariations(variations.filter((v) => v.id !== varId));
    }
  };

  // Open Media Modal for specific variation
  const handleOpenVariationMedia = (varId: string) => {
    setMediaTarget({ type: 'variation', variationId: varId });
    setMediaModalOpen(true);
  };

  // Handle image selected from MediaLibraryModal
  const handleImageSelected = (url: string) => {
    if (mediaTarget.type === 'main') {
      setMainImageUrl(url);
    } else if (mediaTarget.type === 'gallery') {
      if (!galleryImages.includes(url)) {
        setGalleryImages([...galleryImages, url]);
      }
    } else if (mediaTarget.type === 'variation') {
      handleUpdateVariation(mediaTarget.variationId, 'imageUrl', url);
    }
  };

  // Apply Bulk edits to variations
  const handleApplyBulkPrice = () => {
    const p = parseFloat(bulkPriceInput);
    if (isNaN(p) || p <= 0) return;
    setVariations(variations.map((v) => ({ ...v, price: p })));
    setBulkPriceInput('');
  };

  const handleApplyBulkStock = () => {
    const s = parseInt(bulkStockInput);
    if (isNaN(s) || s < 0) return;
    setVariations(
      variations.map((v) => ({ ...v, inventory: s, inStock: s > 0 }))
    );
    setBulkStockInput('');
  };

  // Save product
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Please enter a product name.');
      setActiveTab('general');
      return;
    }

    const numericPrice = parseFloat(price) || 0;
    const numericOriginalPrice = originalPrice ? parseFloat(originalPrice) : undefined;
    const numericInventory = parseInt(inventory) || 0;

    const payload: Product = {
      id: product?.id || `prod-${Date.now()}`,
      name: name.trim(),
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      subtitle: subtitle.trim() || 'Atelier Masterpiece with Organic Combed Cotton Lining',
      category,
      subcategory: subcategory || undefined,
      type: productType,
      status,
      price: numericPrice,
      originalPrice: numericOriginalPrice,
      sku: sku || `BT-${Date.now().toString().slice(-6)}`,
      barcode: barcode || undefined,
      description,
      story,
      materials,
      dimensions,
      careInstructions: product?.careInstructions || 'Delicate dry clean or gentle hand wash in cool water.',
      shippingInfo: product?.shippingInfo || 'Arrives in Babies Touch heirloom gift box with cedar hanger.',
      swatches: swatches.length > 0 ? swatches : [{ name: 'Default', hex: '#171717' }],
      galleryImages,
      tags: selectedTags,
      variations: productType === 'variable' ? variations : [],
      rating: product?.rating || 4.98,
      reviewsCount: product?.reviewsCount || 1,
      inStock: numericInventory > 0,
      inventory: numericInventory,
      lowStockThreshold: parseInt(lowStockThreshold) || 5,
      isFeatured,
      isNewArrival,
      isBestSeller,
      isPreOrder,
      preOrderDate: isPreOrder ? preOrderDate : undefined,
      seoTitle: seoTitle || name,
      seoDescription: seoDescription || subtitle,
      designer: product?.designer || 'Babies Touch Atelier',
      madeIn: product?.madeIn || 'Handcrafted Atelier',
      imageUrl: mainImageUrl,
      hoverImageUrl: galleryImages[1] || mainImageUrl,
      createdAt: product?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    onSave(payload);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 animate-in fade-in duration-200">
        <div className="relative w-full max-w-5xl bg-white rounded-3xl border border-[#E6E4DF] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#E6E4DF] flex items-center justify-between bg-white shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest font-semibold text-[#E0218A]">
                  Babies Touch Atelier
                </span>
                <span className="text-xs text-[#737373]">·</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    status === 'published'
                      ? 'bg-emerald-100 text-emerald-800'
                      : status === 'draft'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-zinc-100 text-zinc-700'
                  }`}
                >
                  {status}
                </span>
              </div>
              <h2 className="text-xl font-serif font-bold text-[#171717] mt-0.5">
                {product ? `Edit Product: ${product.name}` : 'Create New Luxury Children Product'}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-[#737373] hover:text-[#171717] hover:bg-[#F4F3EF] rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 border-b border-[#E6E4DF] bg-[#FAF9F6] flex items-center gap-2 overflow-x-auto shrink-0">
            {[
              { id: 'general', label: '1. General Info' },
              { id: 'images', label: '2. Product Images' },
              { id: 'categories', label: '3. Categories & Tags' },
              { id: 'variations', label: '4. Variations & Specific Images' },
              { id: 'inventory', label: '5. Inventory & Shipping' },
              { id: 'seo', label: '6. SEO & Badges' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as EditorTab)}
                className={`py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[#E0218A] text-[#E0218A]'
                    : 'border-transparent text-[#737373] hover:text-[#171717]'
                }`}
              >
                {tab.label}
                {tab.id === 'variations' && variations.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-[#FCE7F3] text-[#BE185D] text-[10px]">
                    {variations.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
            {/* TAB 1: GENERAL */}
            {activeTab === 'general' && (
              <div className="space-y-6 max-w-3xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (!product) {
                          setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                        }
                      }}
                      placeholder="e.g. Seraphina Pink Rosette Ball Gown"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E6E4DF] text-xs text-[#171717] focus:outline-none focus:border-[#E0218A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="e.g. seraphina-pink-rosette-ball-gown"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E6E4DF] text-xs text-[#737373] bg-[#FDFBF7]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1">
                    Editorial Subtitle / Tagline
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="e.g. Hand-gathered Micro Tulle & Sculpted Silk Rosettes"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E6E4DF] text-xs text-[#171717] focus:outline-none focus:border-[#E0218A]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1">
                      Product Type
                    </label>
                    <select
                      value={productType}
                      onChange={(e) =>
                        setProductType(e.target.value as 'simple' | 'variable')
                      }
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E6E4DF] text-xs bg-white text-[#171717] focus:outline-none focus:border-[#E0218A]"
                    >
                      <option value="variable">Variable Product (Sizes & Colors)</option>
                      <option value="simple">Simple Product (Single SKU)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1">
                      Regular Price (₦) *
                    </label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E6E4DF] text-xs text-[#171717] focus:outline-none focus:border-[#E0218A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1">
                      Original / Crossed-out Price (₦)
                    </label>
                    <input
                      type="number"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E6E4DF] text-xs text-[#737373] focus:outline-none focus:border-[#E0218A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1">
                    Short Description
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-[#E6E4DF] text-xs text-[#171717] focus:outline-none focus:border-[#E0218A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1">
                    Atelier Story & Craftsmanship
                  </label>
                  <textarea
                    rows={3}
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-[#E6E4DF] text-xs text-[#171717] focus:outline-none focus:border-[#E0218A]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1">
                      Fabrics & Lining Details
                    </label>
                    <input
                      type="text"
                      value={materials}
                      onChange={(e) => setMaterials(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E6E4DF] text-xs text-[#171717]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1">
                      Publication Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) =>
                        setStatus(e.target.value as 'published' | 'draft' | 'archived')
                      }
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E6E4DF] text-xs bg-white text-[#171717]"
                    >
                      <option value="published">Published (Visible in store)</option>
                      <option value="draft">Draft (Admin only)</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: IMAGES */}
            {activeTab === 'images' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-[#171717] mb-2">Main Product Image</h4>
                  <p className="text-xs text-[#737373] mb-4">
                    The primary photo displayed on the storefront catalog cards and detail page header.
                  </p>

                  <div className="flex items-start gap-4">
                    <div className="relative w-44 aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#E6E4DF] bg-white shadow-xs">
                      <img
                        src={mainImageUrl}
                        alt="Main product"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => {
                          setMediaTarget({ type: 'main' });
                          setMediaModalOpen(true);
                        }}
                        className="px-4 py-2 rounded-full text-xs font-semibold bg-[#E0218A] hover:bg-[#BE185D] text-white shadow-sm flex items-center gap-1.5 cursor-pointer"
                      >
                        <ImageIcon className="w-4 h-4" />
                        <span>Select Main Image</span>
                      </button>
                      <p className="text-[11px] text-[#737373]">
                        JPG, PNG, or WebP. Optimal ratio 4:3 or 16:9.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#E6E4DF]">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-sm font-semibold text-[#171717]">Product Image Gallery</h4>
                      <p className="text-xs text-[#737373]">
                        Additional photos showing dress back view, lace embroidery, lining, and packaging.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMediaTarget({ type: 'gallery' });
                        setMediaModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-full text-xs font-semibold bg-white border border-[#E6E4DF] hover:bg-[#F4F3EF] text-[#171717] flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-[#E0218A]" />
                      <span>Add Gallery Photo</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {galleryImages.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#E6E4DF] bg-white shadow-xs"
                      >
                        <img
                          src={imgUrl}
                          alt={`Gallery ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                const copy = [...galleryImages];
                                const tmp = copy[idx - 1];
                                copy[idx - 1] = copy[idx];
                                copy[idx] = tmp;
                                setGalleryImages(copy);
                              }}
                              className="p-1 rounded bg-white/80 text-black hover:bg-white text-[10px] font-bold"
                              title="Move left"
                            >
                              ←
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setMainImageUrl(imgUrl)}
                            className="px-2 py-1 rounded bg-[#E0218A] text-white text-[10px] font-semibold hover:bg-[#BE185D]"
                            title="Set as Main Cover Image"
                          >
                            Main
                          </button>
                          {idx < galleryImages.length - 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const copy = [...galleryImages];
                                const tmp = copy[idx + 1];
                                copy[idx + 1] = copy[idx];
                                copy[idx] = tmp;
                                setGalleryImages(copy);
                              }}
                              className="p-1 rounded bg-white/80 text-black hover:bg-white text-[10px] font-bold"
                              title="Move right"
                            >
                              →
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              setGalleryImages(galleryImages.filter((_, i) => i !== idx))
                            }
                            className="p-1 rounded bg-rose-600 text-white hover:bg-rose-700"
                            title="Remove image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CATEGORIES & TAGS */}
            {activeTab === 'categories' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-2">
                    Primary Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E6E4DF] text-xs bg-white text-[#171717]"
                  >
                    {categoriesList.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-2">
                    Subcategory (Optional)
                  </label>
                  <input
                    type="text"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    placeholder="e.g. Flower Girl Dresses, Birthday Sets, Ceremony"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E6E4DF] text-xs text-[#171717]"
                  />
                </div>

                <div className="pt-4 border-t border-[#E6E4DF]">
                  <label className="block text-xs font-semibold text-[#171717] mb-2">
                    Product Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tagsList.map((t) => {
                      const isSelected = selectedTags.includes(t.name);
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedTags(selectedTags.filter((tag) => tag !== t.name));
                            } else {
                              setSelectedTags([...selectedTags, t.name]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#E0218A] text-white shadow-xs'
                              : 'bg-white text-[#737373] hover:text-[#171717] border border-[#E6E4DF]'
                          }`}
                        >
                          {isSelected && '✓ '}
                          {t.name}
                        </button>
                      );
                    })}
                  </div>

                  {/* Quick Add Custom Tag */}
                  <div className="flex items-center gap-2 max-w-sm">
                    <input
                      type="text"
                      id="quick-tag-input"
                      placeholder="Add custom tag (e.g. Royal Banquet)..."
                      className="flex-1 px-3 py-1.5 rounded-full border border-[#E6E4DF] text-xs"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = (e.target as HTMLInputElement).value.trim();
                          if (val && !selectedTags.includes(val)) {
                            setSelectedTags([...selectedTags, val]);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById('quick-tag-input') as HTMLInputElement;
                        if (el && el.value.trim() && !selectedTags.includes(el.value.trim())) {
                          setSelectedTags([...selectedTags, el.value.trim()]);
                          el.value = '';
                        }
                      }}
                      className="px-3 py-1.5 rounded-full bg-[#171717] text-white text-xs font-semibold hover:bg-black cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: VARIATIONS & SPECIFIC IMAGES (MANDATORY ESSENTIAL REQUIREMENT) */}
            {activeTab === 'variations' && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-[#FDF2F8] border border-[#FCE7F3] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-[#BE185D] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#E0218A]" />
                      <span>Individual Variation Image Assignment</span>
                    </h4>
                    <p className="text-xs text-[#831843] mt-1 max-w-xl">
                      Every variation can have its own assigned photography. When shoppers select this size and color combination on the storefront, the product view smoothly displays that exact dress photo!
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleGenerateVariations}
                      className="px-4 py-2 rounded-full text-xs font-semibold bg-[#E0218A] hover:bg-[#BE185D] text-white shadow-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Layers className="w-4 h-4" />
                      <span>Auto-Generate Combinations</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleAddSingleVariation}
                      className="px-3 py-2 rounded-full text-xs font-semibold bg-white border border-[#E6E4DF] text-[#171717] hover:bg-[#FAF9F6] shadow-2xs flex items-center gap-1 cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Single</span>
                    </button>
                  </div>
                </div>

                {/* Bulk adjustment toolbar */}
                {variations.length > 0 && (
                  <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E6E4DF] flex flex-wrap items-center justify-between gap-4 text-xs">
                    <span className="font-semibold text-[#171717]">
                      {variations.length} Active Variations
                    </span>

                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span>Set All Prices: ₦</span>
                        <input
                          type="number"
                          placeholder="e.g. 62000"
                          value={bulkPriceInput}
                          onChange={(e) => setBulkPriceInput(e.target.value)}
                          className="w-24 px-2 py-1 text-xs rounded border border-[#E6E4DF] bg-white"
                        />
                        <button
                          type="button"
                          onClick={handleApplyBulkPrice}
                          className="px-2.5 py-1 rounded bg-[#171717] text-white font-medium hover:bg-black"
                        >
                          Apply
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span>Set All Stock:</span>
                        <input
                          type="number"
                          placeholder="e.g. 10"
                          value={bulkStockInput}
                          onChange={(e) => setBulkStockInput(e.target.value)}
                          className="w-20 px-2 py-1 text-xs rounded border border-[#E6E4DF] bg-white"
                        />
                        <button
                          type="button"
                          onClick={handleApplyBulkStock}
                          className="px-2.5 py-1 rounded bg-[#171717] text-white font-medium hover:bg-black"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Variations Table */}
                {variations.length === 0 ? (
                  <div className="p-10 border-2 border-dashed border-[#E6E4DF] rounded-2xl text-center">
                    <p className="text-xs text-[#737373]">
                      No variations generated yet. Click "Auto-Generate Combinations" above or add one manually.
                    </p>
                  </div>
                ) : (
                  <div className="border border-[#E6E4DF] rounded-2xl overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF9F6] border-b border-[#E6E4DF] text-[#737373] uppercase tracking-wider font-semibold text-[10px]">
                        <tr>
                          <th className="py-3 px-4">Assigned Image</th>
                          <th className="py-3 px-4">Variation Name</th>
                          <th className="py-3 px-4">SKU</th>
                          <th className="py-3 px-4">Price (₦)</th>
                          <th className="py-3 px-4">Stock</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E6E4DF] bg-white">
                        {variations.map((v) => (
                          <tr key={v.id} className="hover:bg-[#FCFBF9] transition-colors">
                            {/* INDIVIDUAL IMAGE ASSIGNMENT COLUMN */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#E6E4DF] bg-white shrink-0 group">
                                  {v.imageUrl ? (
                                    <img
                                      src={v.imageUrl}
                                      alt={v.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-[#F4F3EF] text-[#737373]">
                                      <ImageIcon className="w-5 h-5 opacity-40" />
                                    </div>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleOpenVariationMedia(v.id)}
                                  className="px-2.5 py-1 text-[11px] font-semibold text-[#E0218A] hover:text-[#BE185D] hover:bg-[#FDF2F8] rounded-md border border-[#FCE7F3] transition-colors cursor-pointer whitespace-nowrap"
                                  title="Assign image for this specific variation"
                                >
                                  {v.imageUrl ? 'Change' : 'Select Image'}
                                </button>
                              </div>
                            </td>

                            <td className="py-3 px-4 font-semibold text-[#171717]">
                              {v.name}
                            </td>

                            <td className="py-3 px-4 font-mono text-[11px] text-[#737373]">
                              <input
                                type="text"
                                value={v.sku}
                                onChange={(e) =>
                                  handleUpdateVariation(v.id, 'sku', e.target.value)
                                }
                                className="w-28 px-2 py-1 rounded border border-[#E6E4DF] text-xs bg-white"
                              />
                            </td>

                            <td className="py-3 px-4">
                              <input
                                type="number"
                                value={v.price}
                                onChange={(e) =>
                                  handleUpdateVariation(
                                    v.id,
                                    'price',
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-24 px-2 py-1 rounded border border-[#E6E4DF] text-xs bg-white font-medium"
                              />
                            </td>

                            <td className="py-3 px-4">
                              <input
                                type="number"
                                value={v.inventory}
                                onChange={(e) =>
                                  handleUpdateVariation(
                                    v.id,
                                    'inventory',
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="w-16 px-2 py-1 rounded border border-[#E6E4DF] text-xs bg-white"
                              />
                            </td>

                            <td className="py-3 px-4">
                              <span
                                className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  v.inventory > 0 && v.enabled
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {v.inventory > 0 && v.enabled ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </td>

                            <td className="py-3 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => handleDeleteVariation(v.id)}
                                className="p-1.5 text-[#737373] hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete variation"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: INVENTORY & SHIPPING */}
            {activeTab === 'inventory' && (
              <div className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1">
                      Parent Product SKU
                    </label>
                    <input
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E6E4DF] text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1">
                      Barcode / GTIN
                    </label>
                    <input
                      type="text"
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      placeholder="e.g. 0123456789012"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E6E4DF] text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1">
                      Total Base Inventory (Units)
                    </label>
                    <input
                      type="number"
                      value={inventory}
                      onChange={(e) => setInventory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E6E4DF] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1">
                      Low-Stock Notification Threshold
                    </label>
                    <input
                      type="number"
                      value={lowStockThreshold}
                      onChange={(e) => setLowStockThreshold(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E6E4DF] text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1">
                    Sizing & Fit Dimensions Guide
                  </label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E6E4DF] text-xs"
                  />
                </div>
              </div>
            )}

            {/* TAB 6: SEO & BADGES */}
            {activeTab === 'seo' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1">
                    SEO Meta Title
                  </label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder={name || 'Luxury Children Couture Dress - Babies Touch'}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E6E4DF] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1">
                    SEO Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Handcrafted ceremony dress with hypoallergenic combed cotton lining..."
                    className="w-full px-4 py-2 rounded-xl border border-[#E6E4DF] text-xs"
                  />
                </div>

                <div className="pt-4 border-t border-[#E6E4DF] space-y-3">
                  <h4 className="text-xs font-semibold text-[#171717] uppercase tracking-wider">
                    Promotional Badges
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 text-xs text-[#171717] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="rounded border-[#E6E4DF] text-[#E0218A] focus:ring-[#E0218A]"
                      />
                      <span>Featured Atelier Pick</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs text-[#171717] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isNewArrival}
                        onChange={(e) => setIsNewArrival(e.target.checked)}
                        className="rounded border-[#E6E4DF] text-[#E0218A] focus:ring-[#E0218A]"
                      />
                      <span>New Arrival</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs text-[#171717] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isBestSeller}
                        onChange={(e) => setIsBestSeller(e.target.checked)}
                        className="rounded border-[#E6E4DF] text-[#E0218A] focus:ring-[#E0218A]"
                      />
                      <span>Best Seller</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="pt-6 border-t border-[#E6E4DF] flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#737373] hover:text-[#171717] hover:bg-[#F4F3EF] cursor-pointer"
              >
                Cancel
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="px-7 py-2.5 rounded-full text-xs font-semibold bg-[#E0218A] hover:bg-[#BE185D] text-white shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  {product ? 'Save & Update Product' : 'Publish Product to Store'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Media Library Modal for Selecting Images */}
      <MediaLibraryModal
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        onSelectImage={handleImageSelected}
        title={
          mediaTarget.type === 'main'
            ? 'Select Main Product Photo'
            : mediaTarget.type === 'gallery'
            ? 'Add to Product Gallery'
            : 'Select Image for Specific Variation'
        }
      />
    </>
  );
};
