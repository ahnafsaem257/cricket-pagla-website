import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Search, Edit2, Plus } from 'lucide-react';
import { getNotices } from '../../services/notices/noticeService';
import type { Notice } from '../../types';

export const ManagementNotices: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getNotices().then(data => { setNotices(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = notices.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Notices</h1>
          <p className="text-gray-400 text-sm mt-1">Manage club announcements</p>
        </div>
        <Link to="/admin/notices/add" className="flex items-center gap-2 bg-cricket-gold text-cricket-dark px-4 py-2 rounded-lg font-bold text-sm hover:bg-cricket-gold-light transition-colors">
          <Plus size={16} /> New Notice
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
        <input type="text" placeholder="Search notices..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cricket-gold" />
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-cricket-gold border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-3">
          {filtered.map(notice => (
            <div key={notice.noticeId} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-bold text-sm truncate">{notice.title}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-cricket-gold/10 text-cricket-gold">{notice.category}</span>
                  {notice.status === 'published' ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-900/50 text-emerald-400">Published</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-800 text-gray-400">Draft</span>
                  )}
                </div>
                <p className="text-gray-400 text-xs line-clamp-1">{notice.description}</p>
              </div>
              <Link to={`/admin/notices/edit/${notice.noticeId}`} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                <Edit2 size={14} />
              </Link>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-8 bg-gray-900 border border-gray-800 rounded-xl">
              <Bell size={32} className="mx-auto text-gray-600 mb-2" />
              <p className="text-gray-400 text-sm">No notices found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
