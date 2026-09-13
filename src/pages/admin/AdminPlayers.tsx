import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Database, Filter } from 'lucide-react';
import { getPlayers, deletePlayer, seedAllPlayers } from '../../services/players/playerService';
import type { Player, PlayingRole } from '../../types';

const ALL_ROLES: (PlayingRole | 'All')[] = ['All', 'All-Rounder', 'Batsman', 'Bowler', 'Wicket Keeper', 'Unspecified'];

export const AdminPlayers: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<PlayingRole | 'All'>('All');
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState('');

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const data = await getPlayers();
      setPlayers(data);
    } catch (error) {
      console.error("Error fetching players", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this player?")) {
      try {
        await deletePlayer(id);
        setPlayers(players.filter(p => p.playerId !== id));
      } catch (error) {
        console.error("Error deleting player", error);
        alert("Failed to delete player");
      }
    }
  };

  const handleSeed = async () => {
    if (!window.confirm("This will add all 64 players to Firestore. Existing players will not be duplicated. Continue?")) return;
    setSeeding(true);
    setSeedResult('');
    try {
      const result = await seedAllPlayers();
      setSeedResult(`Done! Created: ${result.created} new players, Updated: ${result.updated} existing players, Skipped: ${result.skipped}`);
      await fetchPlayers();
    } catch (error) {
      console.error("Error seeding players", error);
      setSeedResult('Error seeding players. Check console.');
    } finally {
      setSeeding(false);
    }
  };

  const filteredPlayers = players.filter(p => {
    const matchesRole = roleFilter === 'All' || p.playingRole === roleFilter;
    const matchesSearch =
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.jerseyNumber?.toString().includes(searchTerm) ||
      p.playingRole.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const roleCounts = players.reduce((acc, p) => {
    acc[p.playingRole] = (acc[p.playingRole] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Manage Players ({players.length})</h1>
        <div className="flex gap-2">
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50"
          >
            <Database size={18} />
            {seeding ? 'Seeding...' : 'Seed All Players (64)'}
          </button>
          <Link
            to="/admin/players/add"
            className="flex items-center gap-2 bg-cricket-green hover:bg-[#0c6632] text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plus size={20} />
            <span>Add Player</span>
          </Link>
        </div>
      </div>

      {seedResult && (
        <div className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded-md text-sm">
          {seedResult}
        </div>
      )}

      {/* Role Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {ALL_ROLES.map(role => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              roleFilter === role
                ? 'bg-cricket-gold text-cricket-dark'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {role === 'All' ? 'All' : role}
            <span className="ml-1 opacity-70">
              {role === 'All' ? players.length : (roleCounts[role] || 0)}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Filter size={14} />
            <span>{filteredPlayers.length} results</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs text-gray-400 uppercase bg-gray-800 border-b border-gray-700">
              <tr>
                <th className="px-4 py-3">Player</th>
                <th className="px-4 py-3 hidden sm:table-cell">Role</th>
                <th className="px-4 py-3 hidden md:table-cell">Jersey</th>
                <th className="px-4 py-3 hidden sm:table-cell">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">Loading players...</td>
                </tr>
              ) : filteredPlayers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">No players found.</td>
                </tr>
              ) : (
                filteredPlayers.map((player) => (
                  <tr key={player.playerId} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
                          {player.profilePhoto ? (
                            <img src={player.profilePhoto} alt={player.fullName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-cricket-gold font-bold">
                              {player.fullName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-white truncate">{player.fullName}</div>
                          <div className="text-xs text-gray-500 truncate sm:hidden">{player.playingRole} · {player.jerseyNumber != null ? `#${player.jerseyNumber}` : ''}</div>
                          <div className="text-xs hidden sm:block">{player.nickname || '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs">{player.playingRole}</span>
                    </td>
                    <td className="px-4 py-3 font-bold text-white hidden md:table-cell">
                      {player.jerseyNumber != null ? (player.jerseyNumber === 0 ? '00' : player.jerseyNumber) : '-'}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        player.status === 'Active' ? 'bg-green-900/50 text-green-400 border border-green-800' :
                        player.status === 'Injured' ? 'bg-red-900/50 text-red-400 border border-red-800' :
                        'bg-gray-800 text-gray-400 border border-gray-700'
                      }`}>
                        {player.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <Link
                          to={`/admin/players/edit/${player.playerId}`}
                          className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-md transition-colors"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(player.playerId)}
                          className="p-2 text-red-400 hover:bg-red-900/30 rounded-md transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
