import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Search, Edit2, Plus } from 'lucide-react';
import { getMatches } from '../../services/matches/matchService';
import type { Match } from '../../types';

export const ManagementMatches: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getMatches().then(data => { setMatches(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = matches.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.teamA.toLowerCase().includes(search.toLowerCase()) ||
    m.teamB.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Match Operations</h1>
          <p className="text-gray-400 text-sm mt-1">Manage matches and results</p>
        </div>
        <Link to="/admin/matches/add" className="flex items-center gap-2 bg-cricket-gold text-cricket-dark px-4 py-2 rounded-lg font-bold text-sm hover:bg-cricket-gold-light transition-colors">
          <Plus size={16} /> Add Match
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
        <input type="text" placeholder="Search matches..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cricket-gold" />
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-cricket-gold border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-3">
          {filtered.map(match => (
            <div key={match.matchId} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-bold text-sm truncate">{match.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    match.status === 'Live' ? 'bg-red-900/50 text-red-400 animate-pulse' :
                    match.status === 'Completed' ? 'bg-emerald-900/50 text-emerald-400' :
                    match.status === 'Upcoming' ? 'bg-blue-900/50 text-blue-400' :
                    'bg-gray-800 text-gray-400'
                  }`}>{match.status}</span>
                </div>
                <p className="text-gray-400 text-xs">{match.teamA} vs {match.teamB}</p>
                <p className="text-gray-500 text-xs mt-0.5">{new Date(match.date).toLocaleDateString()}</p>
              </div>
              <Link to={`/admin/matches/edit/${match.matchId}`} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                <Edit2 size={14} />
              </Link>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-8 bg-gray-900 border border-gray-800 rounded-xl">
              <Trophy size={32} className="mx-auto text-gray-600 mb-2" />
              <p className="text-gray-400 text-sm">No matches found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
