import React, { useState } from 'react';
import { X, Upload, Search, Check, Image as ImageIcon, Trash2, Eye } from 'lucide-react';
import { MediaItem } from '../../types';
import { adminStorage } from '../../services/adminStorage';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string, mediaItem?: MediaItem) => void;
  title?: string;
  selectedImageUrl?: string;
}

export const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  title = 'Select Image from Media Library',
  selectedImageUrl,
}) => {
  const [mediaList, setMediaList] = useState<MediaItem[]>(() => adminStorage.getMedia());
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [selectedUrl, setSelectedUrl] = useState<string>(selectedImageUrl || '');
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredMedia = mediaList.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.altText.toLowerCase().includes(search.toLowerCase())
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError(null);
    const file = files[0];

    // File validation
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setUploadError('Image size exceeds 8MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const newItem: MediaItem = {
        id: `med-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        url: result,
        altText: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        dimensions: 'Custom Upload',
        uploadedAt: new Date().toISOString().split('T')[0],
      };

      const updated = adminStorage.addMediaItem(newItem);
      setMediaList(adminStorage.getMedia());
      setSelectedUrl(updated.url);
      setActiveTab('library');
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmSelection = () => {
    if (!selectedUrl) return;
    const item = mediaList.find((m) => m.url === selectedUrl);
    onSelectImage(selectedUrl, item);
    onClose();
  };

  const handleDeleteMedia = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this media item?')) {
      adminStorage.deleteMediaItem(id);
      setMediaList(adminStorage.getMedia());
      if (previewItem?.id === id) setPreviewItem(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl border border-[#E6E4DF] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6E4DF] bg-white shrink-0">
          <div>
            <h3 className="text-base font-serif font-bold text-[#171717]">{title}</h3>
            <p className="text-xs text-[#737373]">
              Assign high-resolution photography to products and individual variations
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#737373] hover:text-[#171717] hover:bg-[#F4F3EF] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab & Search Bar */}
        <div className="px-6 py-3 border-b border-[#E6E4DF] bg-[#FAF9F6] flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('library')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'library'
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'bg-white text-[#737373] hover:text-[#171717] border border-[#E6E4DF]'
              }`}
            >
              Media Library ({mediaList.length})
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'upload'
                  ? 'bg-[#E0218A] text-white shadow-xs'
                  : 'bg-white text-[#737373] hover:text-[#171717] border border-[#E6E4DF]'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload New Image</span>
            </button>
          </div>

          {activeTab === 'library' && (
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" />
              <input
                type="text"
                placeholder="Search images..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#E6E4DF] rounded-full focus:outline-none focus:border-[#E0218A]"
              />
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'upload' ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-[#E6E4DF] rounded-2xl p-8 text-center bg-[#FDF9FB]">
              <div className="w-16 h-16 rounded-full bg-[#FCE7F3] text-[#E0218A] flex items-center justify-center mb-4 shadow-sm">
                <Upload className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-semibold text-[#171717]">Upload Product Image</h4>
              <p className="text-xs text-[#737373] max-w-sm mt-1">
                Upload JPG, PNG, or WebP photography. High resolution is preserved for crisp zooming and variation details.
              </p>
              {uploadError && (
                <div className="mt-3 text-xs text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200">
                  {uploadError}
                </div>
              )}
              <label className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#E0218A] hover:bg-[#BE185D] text-white text-xs font-semibold shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95">
                <Upload className="w-4 h-4" />
                <span>Select File from Device</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredMedia.map((item) => {
                const isSelected = selectedUrl === item.url;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedUrl(item.url);
                      setPreviewItem(item);
                    }}
                    className={`group relative aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#E0218A] ring-4 ring-[#FCE7F3] shadow-md scale-102'
                        : 'border-[#E6E4DF] hover:border-[#D5D3CC] hover:shadow-sm'
                    }`}
                  >
                    <img
                      src={item.url}
                      alt={item.altText}
                      className="w-full h-full object-cover object-center"
                    />

                    {/* Selected badge */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#E0218A] text-white flex items-center justify-center shadow-md">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}

                    {/* Overlay info */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between text-white pointer-events-none">
                      <p className="text-[10px] font-medium truncate">{item.name}</p>
                      <div className="flex items-center justify-between text-[9px] text-white/80">
                        <span>{item.dimensions}</span>
                        <span>{item.size}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E6E4DF] bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {selectedUrl ? (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#E6E4DF] shrink-0">
                  <img src={selectedUrl} alt="Selected preview" className="w-full h-full object-cover" />
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-[#171717]">Image Selected</p>
                  <p className="text-[11px] text-[#737373] truncate max-w-[200px]">
                    {mediaList.find((m) => m.url === selectedUrl)?.name || 'Custom Image'}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#737373]">Select an image from the library or upload a new one.</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-semibold text-[#737373] hover:text-[#171717] hover:bg-[#F4F3EF] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSelection}
              disabled={!selectedUrl}
              className="px-6 py-2 rounded-full text-xs font-semibold bg-[#E0218A] hover:bg-[#BE185D] text-white shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Use Selected Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
