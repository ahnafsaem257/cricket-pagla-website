import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Flag, Users, Trophy } from 'lucide-react';
import { getTournaments, deleteTournament } from '../../services/tournaments/tournamentService';
import type { Tournament } from '../../types';

const STATUS_COLORS: Record<Tournament['status'], string> = {
  'Upcoming': 'bg-blue-900/50 text-blue-400 border border-blue-800',
  'Ongoing': 'bg-emerald-900/50 text-emerald-400 border border-emerald-800',
  'Completed': 'bg-purple-900/50 text-purple-400 border border-purple-800',
  'Cancelled': 'bg-gray-800 text-gray-400 border border-gray-700',
};

export const AdminTournaments: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const data = await getTournaments();
      setTournaments(data);
    } catch (error) {
      console.error('Error fetching tournaments', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this tournament?')) {
      try {
        await deleteTournament(id);
        setTournaments(tournaments.filter(t => t.tournamentId !== id));
      } catch (error) {
        console.error('Error deleting tournament', error);
        alert('Failed to delete tournament');
      }
    }
  };

  const filteredTournaments = tournaments.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.organizer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.venue?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Tournaments</h1>
          <p className="text-gray-400 text-sm mt-1">{tournaments.length} tournaments</p>
        </div>
        <Link
          to="/admin/tournaments/add"
          className="flex items-center gap-2 bg-cricket-green hover:bg-[#0c6632] text-white px-4 py-2 rounded-md transition-colors"
        >
          <Plus size={20} />
          <span>Add Tournament</span>
        </Link>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search tournaments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading tournaments...</div>
        ) : filteredTournaments.length === 0 ? (
          <div className="p-12 text-center">
            <Flag size={40} className="mx-auto text-gray-600 mb-3" />
            <p className="text-gray-400">No tournaments found. Add your first tournament.</p>
            <Link
              to="/admin/tournaments/add"
              className="inline-flex items-center gap-2 mt-4 text-cricket-green hover:text-[#4ade80] transition-colors font-medium"
            >
              <Plus size={16} /> Add Tournament
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="text-xs text-gray-400 uppercase bg-gray-800 border-b border-gray-700">
                <tr>
                  <th className="px-4 py-3">Tournament</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Dates</th>
                  <th className="px-4 py-3 hidden md:table-cell">Format</th>
                  <th className="px-4 py-3 hidden lg:table-cell">Teams</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTournaments.map(tournament => (
                  <tr key={tournament.tournamentId} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {tournament.logo ? (
                          <img src={tournament.logo} alt={tournament.name} className="w-10 h-10 rounded-md object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-gray-700 flex items-center justify-center text-cricket-gold flex-shrink-0">
                            <Trophy size={18} />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-bold text-white mb-0.5 truncate">{tournament.name}</div>
                          {tournament.organizer && <div className="text-xs text-gray-500 truncate">{tournament.organizer}</div>}
                          <div className="text-xs text-gray-500 sm:hidden">{tournament.startDate}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="text-xs">{tournament.startDate}</div>
                      {tournament.endDate && <div className="text-xs text-gray-500 mt-1">to {tournament.endDate}</div>}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-800 border border-gray-700">
                        {tournament.format}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-1">
                        <Users size={13} className="text-gray-500" />
                        <span>{tournament.teams?.length || 0}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`px-2 py-1 text-xs rounded-full ${STATUS_COLORS[tournament.status]}`}>
                        {tournament.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <Link
                          to={`/admin/tournaments/edit/${tournament.tournamentId}`}
                          title="Edit"
                          className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-md transition-colors"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(tournament.tournamentId)}
                          title="Delete"
                          className="p-2 text-red-400 hover:bg-red-900/30 rounded-md transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};