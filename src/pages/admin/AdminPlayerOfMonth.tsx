import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Award } from 'lucide-react';
import { getAllPlayerOfMonth, deletePlayerOfMonth } from '../../services/playerOfMonth/playerOfMonthService';
import type { PlayerOfMonth } from '../../types';

export const AdminPlayerOfMonth: React.FC = () => {
  const [records, setRecords] = useState<PlayerOfMonth[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadRecords = () => {
    getAllPlayerOfMonth()
      .then(data => { setRecords(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { loadRecords(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Player of the Month?')) return;
    setDeleting(id);
    try {
      await deletePlayerOfMonth(id);
      setRecords(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Player of the Month</h1>
          <p className="text-gray-400 text-sm mt-1">Manage monthly player awards</p>
        </div>
        <Link
          to="/admin/player-of-the-month/add"
          className="flex items-center gap-2 bg-cricket-gold text-cricket-dark px-4 py-2 rounded-lg font-bold text-sm hover:bg-cricket-gold-light transition-colors"
        >
          <Plus size={16} /> Add New
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-cricket-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-xl">
          <Award size={36} className="mx-auto text-gray-600 mb-3" />
          <p className="text-gray-400">No Player of the Month records yet</p>
          <Link to="/admin/player-of-the-month/add" className="text-cricket-gold text-sm mt-2 inline-block hover:underline">Add first record</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map(record => (
            <div key={record.id} className={`bg-gray-900 border rounded-xl p-4 flex items-center gap-4 ${record.published ? 'border-gray-800' : 'border-yellow-900/50'}`}>
              {record.playerPhoto ? (
                <img src={record.playerPhoto} alt={record.playerName} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                  <span className="font-bold text-gray-500">{record.playerName.charAt(0)}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-bold truncate">{record.playerName}</h3>
                  {record.published ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-900/50 text-emerald-400">Published</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-yellow-900/50 text-yellow-400">Draft</span>
                  )}
                </div>
                <p className="text-gray-400 text-sm">{record.month} {record.year} - {record.totalPoints} pts</p>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/admin/player-of-the-month/edit/${record.id}`} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                  <Edit2 size={16} />
                </Link>
                <button
                  onClick={() => handleDelete(record.id)}
                  disabled={deleting === record.id}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
