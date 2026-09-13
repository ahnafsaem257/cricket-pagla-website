import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { getTeams, deleteTeam } from '../../services/teams/teamService';
import type { Team } from '../../types';

export const AdminTeams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadTeams = () => {
    setLoading(true);
    getTeams().then(data => {
      setTeams(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const handleDelete = async (teamId: string, name: string) => {
    if (!confirm(`Delete team "${name}"? This cannot be undone.`)) return;
    try {
      await deleteTeam(teamId);
      setTeams(prev => prev.filter(t => t.teamId !== teamId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete team');
    }
  };

  const filtered = teams.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.captain && t.captain.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Teams</h1>
          <p className="text-gray-400 text-sm mt-1">{teams.length} total teams</p>
        </div>
        <Link to="/admin/teams/add" className="flex items-center gap-2 bg-cricket-gold text-cricket-dark px-4 py-2 rounded-lg font-bold text-sm hover:bg-cricket-gold-light transition-colors">
          <Plus size={18} /> Add Team
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
        <input
          type="text"
          placeholder="Search teams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cricket-gold"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-cricket-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <Shield size={40} className="mx-auto text-gray-600 mb-3" />
          <p className="text-gray-400">No teams found</p>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Team</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium hidden sm:table-cell">Captain</th>
                  <th className="text-center px-4 py-3 text-gray-400 font-medium">W/L</th>
                  <th className="text-center px-4 py-3 text-gray-400 font-medium">Pts</th>
                  <th className="text-center px-4 py-3 text-gray-400 font-medium hidden sm:table-cell">Active</th>
                  <th className="text-right px-4 py-3 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(team => (
                  <tr key={team.teamId} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {team.logo ? (
                          <img src={team.logo} alt={team.name} className="w-8 h-8 rounded-full object-contain bg-gray-800" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                            <Shield size={14} className="text-gray-500" />
                          </div>
                        )}
                        <span className="text-white font-medium">{team.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">{team.captain || '—'}</td>
                    <td className="px-4 py-3 text-center text-gray-300">{team.wins || 0} / {team.losses || 0}</td>
                    <td className="px-4 py-3 text-center text-cricket-gold font-bold">{team.points || 0}</td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${team.active ? 'bg-emerald-900/60 text-emerald-300' : 'bg-gray-800 text-gray-500'}`}>
                        {team.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/teams/edit/${team.teamId}`} className="p-1.5 text-gray-400 hover:text-cricket-gold transition-colors">
                          <Edit2 size={16} />
                        </Link>
                        <button onClick={() => handleDelete(team.teamId, team.name)} className="p-1.5 text-gray-400 hover:text-red-400 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
