import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Shield, Star, Users } from 'lucide-react';
import { getTeamById } from '../../services/teams/teamService';
import { getPlayers } from '../../services/players/playerService';
import type { Team, Player } from '../../types';

export const TeamDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([getTeamById(id), getPlayers()])
      .then(([teamData, allPlayers]) => {
        setTeam(teamData);
        if (teamData?.playerIds) {
          setPlayers(allPlayers.filter(p => teamData.playerIds?.includes(p.playerId)));
        } else {
          setPlayers(allPlayers.filter(p => p.teamId === id || p.team === teamData?.name));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cricket-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cricket-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-cricket-dark flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400 text-lg">Team not found</p>
        <Link to="/teams" className="text-cricket-gold hover:underline flex items-center gap-2">
          <ArrowLeft size={18} /> Back to Teams
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cricket-dark">
      <div className="relative py-12 sm:py-16 bg-gradient-to-b from-cricket-gold/5 to-transparent">
        <div className="container mx-auto px-4">
          <Link to="/teams" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm">Back to Teams</span>
          </Link>

          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gray-800 border-2 border-cricket-gold/30 flex items-center justify-center overflow-hidden">
              {team.logo ? (
                <img src={team.logo} alt={team.name} className="w-full h-full object-contain" />
              ) : (
                <Shield size={48} className="text-gray-600" />
              )}
            </div>
            <div className="text-center sm:text-left pb-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{team.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 justify-center sm:justify-start">
                {team.captain && (
                  <span className="text-gray-400 text-sm flex items-center gap-1">
                    <Star size={14} className="text-cricket-gold" /> Captain: {team.captain}
                  </span>
                )}
                {team.viceCaptain && (
                  <span className="text-gray-400 text-sm flex items-center gap-1">
                    <Star size={14} className="text-gray-500" /> Vice Captain: {team.viceCaptain}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-10">
          <StatCard label="Played" value={(team.wins || 0) + (team.losses || 0) + (team.draws || 0) + (team.noResult || 0)} />
          <StatCard label="Wins" value={team.wins || 0} />
          <StatCard label="Losses" value={team.losses || 0} />
          <StatCard label="Points" value={team.points || 0} />
        </div>

        <h2 className="text-2xl font-bold text-white mb-6">Squad</h2>
        {players.length === 0 ? (
          <div className="text-center py-12 bg-gray-900 rounded-2xl border border-gray-800">
            <Users size={36} className="mx-auto text-gray-600 mb-3" />
            <p className="text-gray-400">No players assigned to this team yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {players.map(player => (
              <Link
                key={player.playerId}
                to={`/players/${player.playerId}`}
                className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center hover:border-cricket-gold/30 transition-all group"
              >
                {player.profilePhoto ? (
                  <img src={player.profilePhoto} alt={player.fullName} className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-gray-700 group-hover:border-cricket-gold/50" />
                ) : (
                  <div className="w-16 h-16 rounded-full mx-auto bg-gray-800 flex items-center justify-center border-2 border-gray-700 group-hover:border-cricket-gold/50">
                    <span className="text-xl font-bold text-gray-600">{player.fullName.charAt(0)}</span>
                  </div>
                )}
                <h3 className="text-white font-medium text-sm mt-3 truncate">{player.fullName}</h3>
                {player.jerseyNumber != null && (
                  <p className="text-cricket-gold text-xs mt-1">#{player.jerseyNumber === 0 ? '00' : player.jerseyNumber}</p>
                )}
                <p className="text-gray-500 text-xs mt-0.5">{player.playingRole}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
    <div className="text-2xl font-bold text-cricket-gold">{value}</div>
    <div className="text-xs text-gray-400 uppercase tracking-wide mt-1">{label}</div>
  </div>
);
