import React, { useState, useEffect } from 'react';
import { X, Sliders, Plus, Trash2, Check } from 'lucide-react';
import { ProductAttribute, AttributeTerm } from '../../types';
import { adminStorage } from '../../services/adminStorage';

interface AttributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  attribute: ProductAttribute | null; // null = new
  onSaved: () => void;
}

export const AttributeModal: React.FC<AttributeModalProps> = ({
  isOpen,
  onClose,
  attribute,
  onSaved,
}) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [displayType, setDisplayType] = useState<'button' | 'color' | 'select'>('button');
  const [isVariation, setIsVariation] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [terms, setTerms] = useState<AttributeTerm[]>([]);

  // New Term Form
  const [newTermName, setNewTermName] = useState('');
  const [newTermValue, setNewTermValue] = useState('#E0218A');

  useEffect(() => {
    if (attribute) {
      setName(attribute.name);
      setSlug(attribute.slug);
      setDisplayType(attribute.displayType);
      setIsVariation(attribute.isVariation);
      setIsVisible(attribute.isVisible);
      setTerms(attribute.terms || []);
    } else {
      setName('');
      setSlug('');
      setDisplayType('button');
      setIsVariation(true);
      setIsVisible(true);
      setTerms([
        { id: `term-${Date.now()}-1`, name: 'Sample Term 1', slug: 'sample-1' },
      ]);
    }
  }, [attribute, isOpen]);

  if (!isOpen) return null;

  const handleAddTerm = () => {
    if (!newTermName.trim()) return;
    const termId = `term-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    const newTerm: AttributeTerm = {
      id: termId,
      name: newTermName.trim(),
      slug: newTermName.toLowerCase().replace(/\s+/g, '-'),
      value: displayType === 'color' ? newTermValue : undefined,
    };
    setTerms([...terms, newTerm]);
    setNewTermName('');
  };

  const handleDeleteTerm = (id: string) => {
    setTerms(terms.filter((t) => t.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload: ProductAttribute = {
      id: attribute?.id || `attr-${Date.now()}`,
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/\s+/g, '-'),
      displayType,
      isVariation,
      isVisible,
      terms,
    };

    adminStorage.saveAttribute(payload);
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#E6E4DF] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E6E4DF] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FAF5FF] text-[#9333EA] flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#171717]">
                {attribute ? `Edit Attribute: ${attribute.name}` : 'New Global Attribute'}
              </h3>
              <p className="text-[11px] text-[#737373]">
                Reusable size, colour, age group, or custom attribute
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#171717] mb-1">
                Attribute Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!attribute) {
                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }
                }}
                placeholder="e.g. Size, Colour, Age Group"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E4DF] text-xs text-[#171717] focus:outline-none focus:border-[#E0218A]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#171717] mb-1">
                URL Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. size, colour"
                className="w-full px-3 py-2 rounded-xl border border-[#E6E4DF] text-xs text-[#737373] bg-[#FAF9F6]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#171717] mb-1">
              Display Type on Storefront
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'button', label: 'Pill Buttons (e.g. Sizes)' },
                { id: 'color', label: 'Color Swatches (Hex)' },
                { id: 'select', label: 'Dropdown Menu' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDisplayType(opt.id as any)}
                  className={`p-2.5 rounded-xl border text-left font-medium transition-all cursor-pointer ${
                    displayType === opt.id
                      ? 'border-[#E0218A] bg-[#FDF2F8] text-[#BE185D] font-semibold'
                      : 'border-[#E6E4DF] bg-white text-[#737373] hover:border-[#171717]'
                  }`}
                >
                  <p className="text-xs">{opt.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <label className="flex items-center gap-2 p-3 rounded-xl border border-[#E6E4DF] bg-[#FAF9F6] cursor-pointer">
              <input
                type="checkbox"
                checked={isVariation}
                onChange={(e) => setIsVariation(e.target.checked)}
                className="rounded text-[#E0218A]"
              />
              <span className="font-semibold text-[#171717]">Used for Variations</span>
            </label>
            <label className="flex items-center gap-2 p-3 rounded-xl border border-[#E6E4DF] bg-[#FAF9F6] cursor-pointer">
              <input
                type="checkbox"
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
                className="rounded text-[#E0218A]"
              />
              <span className="font-semibold text-[#171717]">Visible on Product Page</span>
            </label>
          </div>

          {/* Term Items Section */}
          <div className="pt-3 border-t border-[#E6E4DF]">
            <h4 className="font-semibold text-[#171717] mb-2">Attribute Terms (Values)</h4>

            {/* List of current terms */}
            <div className="flex flex-wrap gap-2 mb-3">
              {terms.map((t) => (
                <div
                  key={t.id}
                  className="px-3 py-1.5 rounded-full bg-[#FAF9F6] border border-[#E6E4DF] flex items-center gap-2 text-xs"
                >
                  {displayType === 'color' && t.value && (
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                      style={{ backgroundColor: t.value }}
                    />
                  )}
                  <span className="font-medium text-[#171717]">{t.name}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteTerm(t.id)}
                    className="text-[#737373] hover:text-rose-600 cursor-pointer ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Add new term row */}
            <div className="p-3 rounded-2xl bg-[#FDFBF7] border border-[#E6E4DF] flex items-center gap-2">
              <input
                type="text"
                placeholder={displayType === 'color' ? 'Color name (e.g. Blush Pink)' : 'Term name (e.g. 1-2Y)'}
                value={newTermName}
                onChange={(e) => setNewTermName(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-[#E6E4DF] bg-white text-xs"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTerm();
                  }
                }}
              />

              {displayType === 'color' && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <input
                    type="color"
                    value={newTermValue}
                    onChange={(e) => setNewTermValue(e.target.value)}
                    className="w-7 h-7 rounded border border-[#E6E4DF] cursor-pointer"
                    title="Choose Hex Color"
                  />
                  <span className="text-[10px] font-mono text-[#737373]">{newTermValue}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleAddTerm}
                className="px-3 py-1.5 rounded-lg bg-[#171717] text-white text-xs font-semibold hover:bg-black cursor-pointer"
              >
                Add Term
              </button>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-[#E6E4DF] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-semibold border border-[#E6E4DF] text-[#737373] hover:bg-[#FAF9F6] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full text-xs font-semibold bg-[#E0218A] hover:bg-[#BE185D] text-white shadow-md cursor-pointer"
            >
              {attribute ? 'Save Changes' : 'Create Attribute'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
