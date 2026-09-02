import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { getPlayers, deletePlayer } from '../../services/players/playerService';
import type { Player } from '../../types';

export const AdminPlayers: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredPlayers = players.filter(p => 
    p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.jerseyNumber.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Manage Players</h1>
        <Link 
          to="/admin/players/add" 
          className="flex items-center gap-2 bg-cricket-green hover:bg-[#0c6632] text-white px-4 py-2 rounded-md transition-colors"
        >
          <Plus size={20} />
          <span>Add Player</span>
        </Link>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
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
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs text-gray-400 uppercase bg-gray-800 border-b border-gray-700">
              <tr>
                <th className="px-6 py-4">Player</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Jersey</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
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
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                        {player.profilePhoto ? (
                          <img src={player.profilePhoto} alt={player.fullName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-cricket-gold font-bold">
                            {player.fullName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-white">{player.fullName}</div>
                        <div className="text-xs">{player.nickname || '-'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{player.playingRole}</td>
                    <td className="px-6 py-4 font-bold text-white">{player.jerseyNumber}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        player.status === 'Active' ? 'bg-green-900/50 text-green-400 border border-green-800' :
                        player.status === 'Injured' ? 'bg-red-900/50 text-red-400 border border-red-800' :
                        'bg-gray-800 text-gray-400 border border-gray-700'
                      }`}>
                        {player.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
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
