import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Image, Plus, Eye, EyeOff, Trash2 } from 'lucide-react';
import { getGalleryImages, deleteGalleryImage, updateGalleryImage } from '../../services/gallery/galleryService';
import type { GalleryImage } from '../../types';

export const ManagementGallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    getGalleryImages().then(data => { setImages(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleTogglePublish = async (img: GalleryImage) => {
    try {
      await updateGalleryImage(img.imageId, { published: !img.published });
      setImages(prev => prev.map(i => i.imageId === img.imageId ? { ...i, published: !i.published } : i));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    setDeleting(id);
    try {
      await deleteGalleryImage(id);
      setImages(prev => prev.filter(i => i.imageId !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gallery</h1>
          <p className="text-gray-400 text-sm mt-1">Manage photo gallery</p>
        </div>
        <Link to="/admin/gallery" className="flex items-center gap-2 bg-cricket-gold text-cricket-dark px-4 py-2 rounded-lg font-bold text-sm hover:bg-cricket-gold-light transition-colors">
          <Plus size={16} /> Upload Photos
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-cricket-gold border-t-transparent rounded-full animate-spin" /></div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-xl">
          <Image size={32} className="mx-auto text-gray-600 mb-2" />
          <p className="text-gray-400 text-sm">No photos uploaded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map(img => (
            <div key={img.imageId} className="relative group rounded-xl overflow-hidden bg-gray-800 aspect-square border border-gray-800">
              <img src={img.url} alt={img.title || 'Gallery'} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => handleTogglePublish(img)}
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-white transition-colors" title={img.published ? 'Unpublish' : 'Publish'}>
                  {img.published ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button onClick={() => handleDelete(img.imageId)} disabled={deleting === img.imageId}
                  className="p-2 bg-red-900 hover:bg-red-800 rounded-full text-white transition-colors disabled:opacity-50" title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="absolute top-2 left-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${img.published ? 'bg-emerald-900/80 text-emerald-300' : 'bg-gray-800/80 text-gray-400'}`}>
                  {img.published ? 'Live' : 'Draft'}
                </span>
              </div>
              {img.title && (
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white text-xs font-medium truncate">{img.title}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
