import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Star } from 'lucide-react';
import { getActiveTeams } from '../../services/teams/teamService';
import type { Team } from '../../types';

export const TeamsPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActiveTeams()
      .then(data => { setTeams(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-cricket-dark">
      <div className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cricket-gold/5 to-transparent" />
        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-cricket-gold/10 border border-cricket-gold/30 rounded-full px-4 py-1.5 mb-6">
            <Shield size={16} className="text-cricket-gold" />
            <span className="text-cricket-gold text-sm font-medium">{teams.length} Teams</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white uppercase tracking-tight mb-4">
            Our <span className="text-cricket-gold">Teams</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            The squads that represent Cricket Pagla on the field
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-cricket-gold border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-400">Loading teams...</p>
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center py-20">
            <Shield size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">No teams found</p>
            <p className="text-gray-500 text-sm mt-1">Teams will appear here once created by admin</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {teams.map((team) => (
              <Link
                key={team.teamId}
                to={`/teams/${team.teamId}`}
                className="card-hover bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden group"
              >
                <div className="relative h-40 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  {team.logo ? (
                    <img src={team.logo} alt={team.name} className="h-24 w-24 object-contain" />
                  ) : (
                    <Shield size={64} className="text-gray-700 group-hover:text-gray-600 transition-colors" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-5">
                  <h3 className="text-white font-bold text-lg mb-2">{team.name}</h3>
                  {team.captain && (
                    <p className="text-gray-400 text-sm flex items-center gap-1.5">
                      <Star size={12} className="text-cricket-gold" />
                      Captain: {team.captain}
                    </p>
                  )}
                  <div className="grid grid-cols-4 gap-2 mt-4 text-center">
                    <StatMini label="M" value={(team.wins || 0) + (team.losses || 0) + (team.draws || 0) + (team.noResult || 0)} />
                    <StatMini label="W" value={team.wins || 0} />
                    <StatMini label="L" value={team.losses || 0} />
                    <StatMini label="Pts" value={team.points || 0} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StatMini: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="bg-gray-800/50 rounded-lg py-2">
    <div className="text-cricket-gold font-bold text-sm">{value}</div>
    <div className="text-gray-500 text-[10px] uppercase">{label}</div>
  </div>
);
