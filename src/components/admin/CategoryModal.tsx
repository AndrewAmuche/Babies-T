import React, { useState, useEffect } from 'react';
import { X, FolderTree, Image as ImageIcon, Check } from 'lucide-react';
import { CategoryItem } from '../../types';
import { adminStorage } from '../../services/adminStorage';
import { MediaLibraryModal } from './MediaLibraryModal';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryItem | null; // null = new
  onSaved: () => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  category,
  onSaved,
}) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState<string>('');
  const [imageUrl, setImageUrl] = useState('');
  const [order, setOrder] = useState('1');
  const [isActive, setIsActive] = useState(true);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);

  const categoriesList = adminStorage.getCategories();

  useEffect(() => {
    if (category) {
      setName(category.name);
      setSlug(category.slug);
      setDescription(category.description || '');
      setParentId(category.parentId || '');
      setImageUrl(category.imageUrl || '');
      setOrder(String(category.order || 1));
      setIsActive(category.isActive !== false);
    } else {
      setName('');
      setSlug('');
      setDescription('');
      setParentId('');
      setImageUrl('/assets/products/royal-pink-rosette-ball-gown.jpg');
      setOrder(String(categoriesList.length + 1));
      setIsActive(true);
    }
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCat: CategoryItem = {
      id: category?.id || `cat-${Date.now()}`,
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/\s+/g, '-'),
      description: description.trim(),
      parentId: parentId ? parentId : null,
      imageUrl: imageUrl || undefined,
      order: parseInt(order) || 1,
      isActive,
      productCount: category?.productCount || 0,
    };

    adminStorage.saveCategory(newCat);
    onSaved();
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
        <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#E6E4DF] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#E6E4DF] flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FCE7F3] text-[#E0218A] flex items-center justify-center">
                <FolderTree className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-[#171717]">
                  {category ? `Edit Category: ${category.name}` : 'Create New Category'}
                </h3>
                <p className="text-[11px] text-[#737373]">
                  Configure store navigation hierarchy & nested subcategories
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#737373] hover:text-[#171717] hover:bg-[#F4F3EF] rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#171717] mb-1">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!category) {
                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }
                }}
                placeholder="e.g. Flower Girl Dresses, Ceremonial Gowns"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E4DF] text-xs text-[#171717] focus:outline-none focus:border-[#E0218A]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#171717] mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="flower-girl-dresses"
                  className="w-full px-3 py-2 rounded-xl border border-[#E6E4DF] text-xs text-[#737373] bg-[#FAF9F6]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#171717] mb-1">
                  Parent Category (Subcategory of)
                </label>
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6E4DF] text-xs bg-white text-[#171717]"
                >
                  <option value="">None (Top-Level Category)</option>
                  {categoriesList
                    .filter((c) => !category || c.id !== category.id)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#171717] mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief editorial summary of this couture collection..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#E6E4DF] text-xs text-[#171717] focus:outline-none focus:border-[#E0218A]"
              />
            </div>

            {/* Category Banner Image */}
            <div>
              <label className="block font-semibold text-[#171717] mb-1.5">
                Category Showcase Photo
              </label>
              <div className="flex items-center gap-3">
                <div className="w-16 h-12 rounded-xl border border-[#E6E4DF] overflow-hidden bg-[#FAF9F6] shrink-0">
                  {imageUrl ? (
                    <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#737373]">
                      <ImageIcon className="w-4 h-4 opacity-40" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setMediaModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#FDF2F8] text-[#BE185D] hover:bg-[#FCE7F3] border border-[#FBCFE8] cursor-pointer"
                >
                  Select from Media Library
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block font-semibold text-[#171717] mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6E4DF] text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="cat-active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-[#E0218A] focus:ring-[#E0218A]"
                />
                <label htmlFor="cat-active" className="text-xs font-semibold text-[#171717] cursor-pointer">
                  Active in Store Navigation
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#E6E4DF] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full text-xs font-semibold border border-[#E6E4DF] text-[#737373] hover:text-[#171717] hover:bg-[#FAF9F6] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full text-xs font-semibold bg-[#E0218A] hover:bg-[#BE185D] text-white shadow-md cursor-pointer"
              >
                {category ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <MediaLibraryModal
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        onSelectImage={(url) => setImageUrl(url)}
        title="Select Category Banner Photo"
        selectedImageUrl={imageUrl}
      />
    </>
  );
};
