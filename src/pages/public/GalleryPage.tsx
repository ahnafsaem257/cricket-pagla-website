import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Images, X, ChevronLeft, ChevronRight, Filter, Download, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { getPublishedGalleryImages } from '../../services/gallery/galleryService';
import type { GalleryImage } from '../../types';

type FilterCategory = 'All' | GalleryImage['category'];

const CATEGORIES: FilterCategory[] = ['All', 'Matches', 'Training', 'Tournament', 'Series', 'Team', 'Celebration', 'Awards', 'Events'];

export const GalleryPage: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');
  const [lightbox, setLightbox] = useState<{ index: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imgContainerRef = useRef<HTMLDivElement>(null);

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

  const openLightbox = (index: number) => {
    setLightbox({ index });
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const closeLightbox = () => {
    setLightbox(null);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (!lightbox) return;
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    if (direction === 'next') {
      setLightbox({ index: (lightbox.index + 1) % filtered.length });
    } else {
      setLightbox({ index: (lightbox.index - 1 + filtered.length) % filtered.length });
    }
  };

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom(prev => Math.min(prev + 0.5, 5));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom(prev => {
      const newZoom = Math.max(prev - 0.5, 0.5);
      if (newZoom <= 1) setPosition({ x: 0, y: 0 });
      return newZoom;
    });
  };

  const handleResetZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoom(prev => Math.min(prev + 0.2, 5));
    } else {
      setZoom(prev => {
        const newZoom = Math.max(prev - 0.2, 0.5);
        if (newZoom <= 1) setPosition({ x: 0, y: 0 });
        return newZoom;
      });
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDownload = async (e: React.MouseEvent, imageUrl: string, fileName: string) => {
    e.stopPropagation();
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'cricket-pagla-gallery.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      window.open(imageUrl, '_blank');
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoom > 1 && e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && zoom > 1 && e.touches.length === 1) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
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
                className="break-inside-avoid mb-3 sm:mb-4 group relative rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 hover:border-cricket-gold/50 transition-all"
              >
                <div className="cursor-pointer" onClick={() => openLightbox(index)}>
                  <img
                    src={img.url}
                    alt={img.title || img.caption || 'Gallery image'}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {img.title && <h3 className="text-white font-bold text-sm truncate">{img.title}</h3>}
                  {img.caption && <p className="text-gray-300 text-xs truncate mt-0.5">{img.caption}</p>}
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="inline-block px-2 py-0.5 bg-gray-800/80 text-gray-300 rounded-full text-[10px] font-medium">
                      {img.category}
                    </span>
                    <button
                      onClick={(e) => handleDownload(e, img.url, img.title || `gallery-${index + 1}`)}
                      className="p-1.5 bg-cricket-gold/90 hover:bg-cricket-gold rounded-full transition-colors"
                      title="Download"
                    >
                      <Download size={12} className="text-cricket-dark" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && filtered[lightbox.index] && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col" onClick={closeLightbox}>
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">
                {lightbox.index + 1} / {filtered.length}
              </span>
              {filtered[lightbox.index].title && (
                <span className="text-white font-medium text-sm hidden sm:inline">— {filtered[lightbox.index].title}</span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleZoomOut}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-white transition-colors"
                title="Zoom Out"
              >
                <ZoomOut size={18} />
              </button>
              <span className="text-gray-400 text-xs w-12 text-center font-mono">{Math.round(zoom * 100)}%</span>
              <button
                onClick={handleZoomIn}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-white transition-colors"
                title="Zoom In"
              >
                <ZoomIn size={18} />
              </button>
              {zoom !== 1 && (
                <button
                  onClick={handleResetZoom}
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-white transition-colors"
                  title="Reset Zoom"
                >
                  <RotateCcw size={18} />
                </button>
              )}
              <button
                onClick={(e) => handleDownload(e, filtered[lightbox.index].url, filtered[lightbox.index].title || `gallery-${lightbox.index + 1}`)}
                className="p-2 bg-cricket-gold hover:bg-yellow-500 rounded-full text-cricket-dark transition-colors"
                title="Download"
              >
                <Download size={18} />
              </button>
              <button
                onClick={closeLightbox}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Image Area */}
          <div
            ref={imgContainerRef}
            className="flex-1 flex items-center justify-center overflow-hidden px-4 pb-4 select-none"
            onClick={e => e.stopPropagation()}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
          >
            {/* Prev Button */}
            <button
              onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 bg-gray-800/80 hover:bg-gray-700 rounded-full text-white transition-colors z-10"
            >
              <ChevronLeft size={28} />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 bg-gray-800/80 hover:bg-gray-700 rounded-full text-white transition-colors z-10"
            >
              <ChevronRight size={28} />
            </button>

            <img
              src={filtered[lightbox.index].url}
              alt={filtered[lightbox.index].title || 'Gallery image'}
              className="max-w-full max-h-full object-contain rounded-lg transition-transform duration-200"
              style={{
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
              }}
              draggable={false}
            />
          </div>

          {/* Caption */}
          {(filtered[lightbox.index].title || filtered[lightbox.index].caption) && (
            <div className="text-center px-4 pb-4 flex-shrink-0" onClick={e => e.stopPropagation()}>
              {filtered[lightbox.index].title && (
                <h3 className="text-white font-bold text-lg">{filtered[lightbox.index].title}</h3>
              )}
              {filtered[lightbox.index].caption && (
                <p className="text-gray-400 text-sm mt-1">{filtered[lightbox.index].caption}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
