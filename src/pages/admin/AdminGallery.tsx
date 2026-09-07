import React, { useEffect, useState } from 'react';
import { Upload, Trash2, Eye, EyeOff, X, Loader2, Images } from 'lucide-react';
import { ImageUploader } from '../../components/ui/ImageUploader';
import {
  getGalleryImages,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from '../../services/gallery/galleryService';
import type { GalleryImage } from '../../types';

const GALLERY_CATEGORIES: GalleryImage['category'][] = [
  'Matches', 'Training', 'Tournament', 'Series', 'Team', 'Celebration', 'Awards', 'Events',
];

const CATEGORY_COLORS: Record<GalleryImage['category'], string> = {
  'Matches': 'bg-blue-900/50 text-blue-400 border border-blue-800',
  'Training': 'bg-emerald-900/50 text-emerald-400 border border-emerald-800',
  'Tournament': 'bg-purple-900/50 text-purple-400 border border-purple-800',
  'Series': 'bg-cyan-900/50 text-cyan-400 border border-cyan-800',
  'Team': 'bg-yellow-900/50 text-yellow-400 border border-yellow-800',
  'Celebration': 'bg-pink-900/50 text-pink-400 border border-pink-800',
  'Awards': 'bg-orange-900/50 text-orange-400 border border-orange-800',
  'Events': 'bg-gray-800 text-gray-400 border border-gray-700',
};

export const AdminGallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<GalleryImage['category'] | 'All'>('All');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    caption: '',
    category: 'Matches' as GalleryImage['category'],
    url: '',
    published: true,
  });

  const fetchImages = async () => {
    setLoading(true);
    try {
      const data = await getGalleryImages();
      setImages(data);
    } catch (err) {
      console.error('Error fetching gallery images', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUploadSuccess = (url: string) => {
    setFormData(prev => ({ ...prev, url }));
  };

  const handleSaveImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.url) {
      setError('Please upload an image first.');
      return;
    }
    setError('');
    setUploading(true);
    try {
      await createGalleryImage(formData);
      setFormData({ title: '', caption: '', category: 'Matches', url: '', published: true });
      setShowUploadForm(false);
      await fetchImages();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to save gallery image.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteGalleryImage(id);
        setImages(images.filter(img => img.imageId !== id));
      } catch (err) {
        console.error('Error deleting image', err);
        alert('Failed to delete image');
      }
    }
  };

  const handleTogglePublished = async (image: GalleryImage) => {
    try {
      await updateGalleryImage(image.imageId, { published: !image.published });
      setImages(images.map(img => img.imageId === image.imageId ? { ...img, published: !img.published } : img));
    } catch (err) {
      console.error('Error updating image', err);
      alert('Failed to update image status');
    }
  };

  const filteredImages = categoryFilter === 'All'
    ? images
    : images.filter(img => img.category === categoryFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Photo Gallery</h1>
          <p className="text-gray-400 text-sm mt-1">{images.length} images</p>
        </div>
        <button
          onClick={() => setShowUploadForm(prev => !prev)}
          className="flex items-center gap-2 bg-cricket-green hover:bg-[#0c6632] text-white px-4 py-2 rounded-md transition-colors"
        >
          {showUploadForm ? <><X size={20} /> Close</> : <><Upload size={20} /> Upload Photo</>}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {showUploadForm && (
        <form onSubmit={handleSaveImage} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-medium text-white">Upload New Photo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:row-span-4">
              <ImageUploader
                storagePath="gallery"
                defaultImage={formData.url}
                onUploadSuccess={handleUploadSuccess}
                onUploadError={(err) => setError(err?.message || 'Image upload failed. Please try again.')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Final Match celebration"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as GalleryImage['category'] }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green"
              >
                {GALLERY_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-400 mb-1">Caption</label>
              <textarea
                value={formData.caption}
                onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
                rows={3}
                placeholder="Short description of the photo"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                className="h-4 w-4 text-cricket-green focus:ring-cricket-green border-gray-700 rounded bg-gray-800"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-400">Publish publicly?</label>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setShowUploadForm(false)}
              className="px-6 py-2 rounded-md font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex items-center gap-2 bg-cricket-green hover:bg-[#0c6632] text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
            >
              {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
              {uploading ? 'Saving...' : 'Save to Gallery'}
            </button>
          </div>
        </form>
      )}

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCategoryFilter('All')}
          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            categoryFilter === 'All' ? 'bg-cricket-gold text-cricket-dark' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          All ({images.length})
        </button>
        {GALLERY_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              categoryFilter === cat ? 'bg-cricket-gold text-cricket-dark' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {cat} ({images.filter(img => img.category === cat).length})
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center text-gray-400">
          Loading gallery...
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <Images size={40} className="mx-auto text-gray-600 mb-3" />
          <p className="text-gray-400">No images found. Upload your first photo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map(image => (
            <div key={image.imageId} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden group">
              <div className="relative aspect-square bg-gray-800">
                <img src={image.url} alt={image.title || 'Gallery image'} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleTogglePublished(image)}
                    title={image.published ? 'Unpublish' : 'Publish'}
                    className={`p-2 rounded-md transition-colors ${
                      image.published ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'bg-cricket-green hover:bg-[#0c6632] text-white'
                    }`}
                  >
                    {image.published ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    onClick={() => handleDelete(image.imageId)}
                    title="Delete"
                    className="p-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {image.published ? (
                  <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-medium rounded-full bg-green-900/70 text-green-300 border border-green-700">
                    Published
                  </span>
                ) : (
                  <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-medium rounded-full bg-yellow-900/70 text-yellow-300 border border-yellow-700">
                    Draft
                  </span>
                )}
              </div>
              <div className="p-3">
                <h3 className="text-white font-medium text-sm truncate">{image.title || 'Untitled'}</h3>
                {image.caption && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{image.caption}</p>}
                <span className={`inline-block mt-2 px-2 py-0.5 text-[10px] font-medium rounded-full ${CATEGORY_COLORS[image.category] || 'bg-gray-800 text-gray-400'}`}>
                  {image.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};