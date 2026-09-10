import React, { useEffect, useState } from 'react';
import { Bell, AlertTriangle, Info, Clock, Filter } from 'lucide-react';
import { getPublishedNotices } from '../../services/notices/noticeService';
import type { Notice } from '../../types';

const CATEGORY_STYLES: Record<string, string> = {
  General: 'bg-gray-800/60 text-gray-300 border-gray-600',
  Match: 'bg-blue-900/60 text-blue-300 border-blue-700',
  Training: 'bg-emerald-900/60 text-emerald-300 border-emerald-700',
  Tournament: 'bg-purple-900/60 text-purple-300 border-purple-700',
  Meeting: 'bg-yellow-900/60 text-yellow-300 border-yellow-700',
  Important: 'bg-red-900/60 text-red-300 border-red-700',
};

const PRIORITY_STYLES: Record<string, string> = {
  Normal: 'bg-gray-800 text-gray-400',
  Important: 'bg-yellow-900/50 text-yellow-400',
  Urgent: 'bg-red-900/50 text-red-400',
};

const PRIORITY_ICONS: Record<string, React.ReactNode> = {
  Normal: <Info size={14} />,
  Important: <AlertTriangle size={14} />,
  Urgent: <AlertTriangle size={14} />,
};

type FilterCategory = 'All' | Notice['category'];

const CATEGORIES: FilterCategory[] = ['All', 'General', 'Match', 'Training', 'Tournament', 'Meeting', 'Important'];

export const Notices: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');

  useEffect(() => {
    getPublishedNotices()
      .then(data => {
        setNotices(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = activeFilter === 'All'
    ? notices
    : notices.filter(n => n.category === activeFilter);

  return (
    <div className="min-h-screen bg-cricket-dark">
      {/* Hero */}
      <div className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cricket-gold/5 to-transparent" />
        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-cricket-gold/10 border border-cricket-gold/30 rounded-full px-4 py-1.5 mb-6">
            <Bell size={16} className="text-cricket-gold" />
            <span className="text-cricket-gold text-sm font-medium">{notices.length} Notices</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white uppercase tracking-tight mb-4">
            Latest <span className="text-cricket-gold">Notices</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Stay updated with the latest announcements from Cricket Pagla
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

      {/* Notices List */}
      <div className="container mx-auto px-4 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-cricket-gold border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-400">Loading notices...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Bell size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">No notices found</p>
            <p className="text-gray-500 text-sm mt-1">Check back later for updates</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-4">
            {filtered.map(notice => (
              <div
                key={notice.noticeId}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6 hover:border-gray-700 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${CATEGORY_STYLES[notice.category] || 'bg-gray-800 text-gray-400 border-gray-600'}`}>
                        {notice.category}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${PRIORITY_STYLES[notice.priority] || 'bg-gray-800 text-gray-400'}`}>
                        {PRIORITY_ICONS[notice.priority]}
                        {notice.priority}
                      </span>
                    </div>
                    <h3 className="text-white font-bold text-lg sm:text-xl mb-2">{notice.title}</h3>
                    <p className="text-gray-400 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{notice.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-4 text-gray-500 text-xs">
                  <Clock size={12} />
                  <span>{new Date(notice.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
