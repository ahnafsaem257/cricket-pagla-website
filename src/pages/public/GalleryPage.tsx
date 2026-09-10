import React, { useEffect, useState } from 'react';
import { Images, X, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { getPublishedGalleryImages } from '../../services/gallery/galleryService';
import type { GalleryImage } from '../../types';

type FilterCategory = 'All' | GalleryImage['category'];

const CATEGORIES: FilterCategory[] = ['All', 'Matches', 'Training', 'Tournament', 'Series', 'Team', 'Celebration', 'Awards', 'Events'];

export const GalleryPage: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');
  const [lightbox, setLightbox] = useState<{ index: number } | null>(null);

  useEffect(() => {
    getPublishedGalleryImages()
      .then(data => {
        setImages(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = activeFilter === 'All'
    ? images
    : images.filter(img => img.category === activeFilter);

  const openLightbox = (index: number) => setLightbox({ index });
  const closeLightbox = () => setLightbox(null);

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (!lightbox) return;
    if (direction === 'next') {
      setLightbox({ index: (lightbox.index + 1) % filtered.length });
    } else {
      setLightbox({ index: (lightbox.index - 1 + filtered.length) % filtered.length });
    }
  };

  return (
    <div className="min-h-screen bg-cricket-dark">
      {/* Hero */}
      <div className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cricket-green/10 to-transparent" />
        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-cricket-gold/10 border border-cricket-gold/30 rounded-full px-4 py-1.5 mb-6">
            <Images size={16} className="text-cricket-gold" />
            <span className="text-cricket-gold text-sm font-medium">{images.length} Photos</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white uppercase tracking-tight mb-4">
            Photo <span className="text-cricket-gold">Gallery</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Moments captured from our journey on and off the field
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="container mx-auto px-4 mt-2">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 justify-center max-w-4xl mx-auto">
          <Filter size={16} className="text-gray-500 flex-shrink-0" />
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                activeFilter === cat
                  ? 'bg-cricket-gold text-cricket-dark shadow-lg shadow-cricket-gold/20'
                  : 'bg-gray-800/80 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-cricket-gold border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-400">Loading gallery...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Images size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">No photos found</p>
            <p className="text-gray-500 text-sm mt-1">Try a different category</p>
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 md:columns-4 gap-3 sm:gap-4">
            {filtered.map((img, index) => (
              <div
                key={img.imageId}
                className="break-inside-avoid mb-3 sm:mb-4 cursor-pointer group relative rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 hover:border-cricket-gold/50 transition-all"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={img.url}
                  alt={img.title || img.caption || 'Gallery image'}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {img.title && <h3 className="text-white font-bold text-sm truncate">{img.title}</h3>}
                  {img.caption && <p className="text-gray-300 text-xs truncate mt-0.5">{img.caption}</p>}
                  <span className="inline-block mt-1 px-2 py-0.5 bg-gray-800/80 text-gray-300 rounded-full text-[10px] font-medium">
                    {img.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && filtered[lightbox.index] && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={closeLightbox}>
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-white transition-colors z-10"
          >
            <X size={24} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 bg-gray-800/80 hover:bg-gray-700 rounded-full text-white transition-colors z-10"
          >
            <ChevronLeft size={28} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 bg-gray-800/80 hover:bg-gray-700 rounded-full text-white transition-colors z-10"
          >
            <ChevronRight size={28} />
          </button>

          <div className="max-w-5xl max-h-[85vh] px-4" onClick={e => e.stopPropagation()}>
            <img
              src={filtered[lightbox.index].url}
              alt={filtered[lightbox.index].title || 'Gallery image'}
              className="max-w-full max-h-[80vh] object-contain rounded-lg mx-auto"
            />
            {(filtered[lightbox.index].title || filtered[lightbox.index].caption) && (
              <div className="text-center mt-4">
                {filtered[lightbox.index].title && (
                  <h3 className="text-white font-bold text-lg">{filtered[lightbox.index].title}</h3>
                )}
                {filtered[lightbox.index].caption && (
                  <p className="text-gray-400 text-sm mt-1">{filtered[lightbox.index].caption}</p>
                )}
              </div>
            )}
            <p className="text-gray-500 text-xs text-center mt-2">
              {lightbox.index + 1} / {filtered.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
