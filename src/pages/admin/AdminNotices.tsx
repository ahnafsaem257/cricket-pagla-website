import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Bell, CalendarDays, FileText } from 'lucide-react';
import { getNotices, deleteNotice } from '../../services/notices/noticeService';
import type { Notice } from '../../types';

const CATEGORY_COLORS: Record<Notice['category'], string> = {
  'General': 'bg-gray-800 text-gray-400 border border-gray-700',
  'Match': 'bg-blue-900/50 text-blue-400 border border-blue-800',
  'Training': 'bg-emerald-900/50 text-emerald-400 border border-emerald-800',
  'Tournament': 'bg-purple-900/50 text-purple-400 border border-purple-800',
  'Meeting': 'bg-cyan-900/50 text-cyan-400 border border-cyan-800',
  'Important': 'bg-red-900/50 text-red-400 border border-red-800',
};

const PRIORITY_COLORS: Record<Notice['priority'], string> = {
  'Normal': 'bg-gray-800 text-gray-400',
  'Important': 'bg-yellow-900/60 text-yellow-300 border border-yellow-800',
  'Urgent': 'bg-red-900/70 text-red-300 border border-red-800',
};

export const AdminNotices: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const data = await getNotices();
      setNotices(data);
    } catch (error) {
      console.error('Error fetching notices', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await deleteNotice(id);
        setNotices(notices.filter(n => n.noticeId !== id));
      } catch (error) {
        console.error('Error deleting notice', error);
        alert('Failed to delete notice');
      }
    }
  };

  const filteredNotices = notices.filter(n =>
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Notices</h1>
          <p className="text-gray-400 text-sm mt-1">{notices.length} notices</p>
        </div>
        <Link
          to="/admin/notices/add"
          className="flex items-center gap-2 bg-cricket-green hover:bg-[#0c6632] text-white px-4 py-2 rounded-md transition-colors"
        >
          <Plus size={20} />
          <span>Post Notice</span>
        </Link>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search notices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading notices...</div>
        ) : filteredNotices.length === 0 ? (
          <div className="p-12 text-center">
            <Bell size={40} className="mx-auto text-gray-600 mb-3" />
            <p className="text-gray-400">No notices found. Post your first notice.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {filteredNotices.map(notice => (
              <div key={notice.noticeId} className="p-4 sm:p-6 hover:bg-gray-800/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${CATEGORY_COLORS[notice.category]}`}>
                        {notice.category}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${PRIORITY_COLORS[notice.priority]}`}>
                        {notice.priority}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                        notice.status === 'published'
                          ? 'bg-green-900/50 text-green-400 border border-green-800'
                          : 'bg-yellow-900/50 text-yellow-400 border border-yellow-800'
                      }`}>
                        {notice.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-base sm:text-lg">{notice.title}</h3>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{notice.description}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
                      <CalendarDays size={14} />
                      <span>{notice.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      to={`/admin/notices/edit/${notice.noticeId}`}
                      title="Edit"
                      className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-md transition-colors"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(notice.noticeId)}
                      title="Delete"
                      className="p-2 text-red-400 hover:bg-red-900/30 rounded-md transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!loading && notices.length === 0 && (
        <Link
          to="/admin/notices/add"
          className="flex items-center justify-center gap-2 p-4 bg-gray-900 border border-gray-800 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <FileText size={18} />
          <span>Create your first notice</span>
        </Link>
      )}
    </div>
  );
};