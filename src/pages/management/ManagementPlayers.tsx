import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, Edit2 } from 'lucide-react';
import { getPlayers } from '../../services/players/playerService';
import type { Player } from '../../types';

export const ManagementPlayers: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getPlayers().then(data => { setPlayers(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = players.filter(p =>
    p.fullName.toLowerCase().includes(search.toLowerCase()) ||
    p.playingRole.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Players</h1>
          <p className="text-gray-400 text-sm mt-1">View and update player profiles</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
        <input type="text" placeholder="Search players..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cricket-gold" />
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-cricket-gold border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-4 py-3 text-xs text-gray-400 uppercase font-medium">Player</th>
                  <th className="px-4 py-3 text-xs text-gray-400 uppercase font-medium">Role</th>
                  <th className="px-4 py-3 text-xs text-gray-400 uppercase font-medium">Team</th>
                  <th className="px-4 py-3 text-xs text-gray-400 uppercase font-medium">Status</th>
                  <th className="px-4 py-3 text-xs text-gray-400 uppercase font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(player => (
                  <tr key={player.playerId} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {player.profilePhoto ? (
                          <img src={player.profilePhoto} alt="" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-500">{player.fullName.charAt(0)}</span>
                          </div>
                        )}
                        <span className="text-white text-sm font-medium">{player.fullName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-sm">{player.playingRole}</td>
                    <td className="px-4 py-3 text-gray-400 text-sm">{player.team || 'Cricket Pagla'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${player.status === 'Active' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-gray-800 text-gray-400'}`}>
                        {player.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/players/${player.playerId}`} className="text-gray-400 hover:text-cricket-gold transition-colors">
                        <Edit2 size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-8">
              <Users size={32} className="mx-auto text-gray-600 mb-2" />
              <p className="text-gray-400 text-sm">No players found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
