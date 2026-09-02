import React, { useEffect, useState } from 'react';
import { Users, Search } from 'lucide-react';
import { getPlayers } from '../../services/players/playerService';
import type { Player } from '../../types';

export const Players: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getPlayers().then(data => {
      // Only show Active or Injured players publicly (hide Inactive/Retired unless desired)
      setPlayers(data.filter(p => p.status === 'Active' || p.status === 'Injured'));
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const filteredPlayers = players.filter(p => 
    p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.playingRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.jerseyNumber.toString().includes(searchTerm)
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <Users className="mx-auto h-12 w-12 text-cricket-gold mb-4" />
        <h1 className="text-4xl font-bold text-white uppercase tracking-tight">Our Players</h1>
        <p className="mt-4 text-gray-400">The heart and soul of Cricket Pagla</p>
        
        <div className="max-w-md mx-auto mt-8 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, role, or jersey..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-full text-white focus:outline-none focus:border-cricket-green focus:ring-1 focus:ring-cricket-green transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-12">Loading players...</div>
      ) : filteredPlayers.length === 0 ? (
        <div className="text-center text-gray-400 py-12">No players found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlayers.map((player) => (
            <div key={player.playerId} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-cricket-green transition-colors group cursor-pointer">
              <div className="h-64 bg-gray-800 relative overflow-hidden">
                {player.profilePhoto ? (
                  <img 
                    src={player.profilePhoto} 
                    alt={player.fullName} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <img 
                    src={`https://ui-avatars.com/api/?name=${player.fullName.replace(' ', '+')}&background=0a4f27&color=fff&size=256`} 
                    alt={player.fullName} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="absolute top-4 right-4 bg-cricket-gold text-cricket-dark font-bold w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
                  {player.jerseyNumber}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-1 truncate">{player.fullName}</h3>
                <p className="text-cricket-green font-medium mb-3">{player.playingRole}</p>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>Batting: {player.battingStyle}</p>
                  <p>Bowling: {player.bowlingStyle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
