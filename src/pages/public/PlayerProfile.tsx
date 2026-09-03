import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Shirt, User, Activity } from 'lucide-react';
import { getPlayerById } from '../../services/players/playerService';
import type { Player } from '../../types';

const ROLE_COLORS: Record<string, string> = {
  'All-Rounder': 'bg-emerald-900/60 text-emerald-300 border-emerald-700',
  'Batsman': 'bg-blue-900/60 text-blue-300 border-blue-700',
  'Bowler': 'bg-red-900/60 text-red-300 border-red-700',
  'Wicket Keeper': 'bg-purple-900/60 text-purple-300 border-purple-700',
  'Unspecified': 'bg-gray-800/60 text-gray-400 border-gray-600',
};

const ROLE_BG: Record<string, string> = {
  'All-Rounder': 'from-emerald-900/30 to-emerald-950/10',
  'Batsman': 'from-blue-900/30 to-blue-950/10',
  'Bowler': 'from-red-900/30 to-red-950/10',
  'Wicket Keeper': 'from-purple-900/30 to-purple-950/10',
  'Unspecified': 'from-gray-800/30 to-gray-900/10',
};

export const PlayerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getPlayerById(id)
      .then(data => {
        if (data) {
          setPlayer(data);
        } else {
          setError('Player not found');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load player');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cricket-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cricket-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="min-h-screen bg-cricket-dark flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400 text-lg">{error || 'Player not found'}</p>
        <Link to="/players" className="text-cricket-gold hover:underline flex items-center gap-2">
          <ArrowLeft size={18} /> Back to Squad
        </Link>
      </div>
    );
  }

  const roleColor = ROLE_COLORS[player.playingRole] || ROLE_COLORS['Unspecified'];
  const roleBg = ROLE_BG[player.playingRole] || ROLE_BG['Unspecified'];

  return (
    <div className="min-h-screen bg-cricket-dark">
      {/* Hero Banner */}
      <div className={`relative bg-gradient-to-b ${roleBg} py-12 sm:py-16`}>
        <div className="container mx-auto px-4">
          <Link to="/players" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm">Back to Squad</span>
          </Link>

          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8">
            {/* Profile Photo */}
            <div className="relative">
              {player.profilePhoto ? (
                <img
                  src={player.profilePhoto}
                  alt={player.fullName}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-cricket-gold shadow-2xl"
                />
              ) : (
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border-4 border-cricket-gold shadow-2xl flex items-center justify-center">
                  <span className="text-5xl sm:text-6xl font-bold text-gray-500">
                    {player.fullName.charAt(0)}
                  </span>
                </div>
              )}
              {player.jerseyNumber != null && (
                <div className="absolute -bottom-2 -right-2 bg-cricket-gold text-cricket-dark font-black text-lg w-12 h-12 rounded-full flex items-center justify-center shadow-xl border-2 border-cricket-dark">
                  {player.jerseyNumber === 0 ? '00' : player.jerseyNumber}
                </div>
              )}
            </div>

            {/* Name & Role */}
            <div className="text-center sm:text-left pb-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">{player.fullName}</h1>
              <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${roleColor}`}>
                  {player.playingRole}
                </span>
                {player.jerseyNumber != null && (
                  <span className="text-gray-400 text-sm flex items-center gap-1">
                    <Shirt size={14} />
                    Jersey #{player.jerseyNumber === 0 ? '00' : player.jerseyNumber}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Basic Info Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <User size={18} className="text-cricket-gold" />
              Player Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow label="Full Name" value={player.fullName} />
              {player.nickname && <InfoRow label="Nickname" value={player.nickname} />}
              {player.jerseyNumber != null && (
                <InfoRow label="Jersey Number" value={player.jerseyNumber === 0 ? '00' : `#${player.jerseyNumber}`} />
              )}
              <InfoRow label="Role" value={player.playingRole} />
              <InfoRow label="Team" value={player.team || 'Cricket Pagla'} />
              <InfoRow label="Status" value={player.status} />
              {player.battingStyle && <InfoRow label="Batting Style" value={player.battingStyle} />}
              {player.bowlingStyle && <InfoRow label="Bowling Style" value={player.bowlingStyle} />}
              {player.joiningDate && <InfoRow label="Joined" value={player.joiningDate} />}
              {player.bloodGroup && <InfoRow label="Blood Group" value={player.bloodGroup} />}
            </div>
          </div>

          {/* Bio */}
          {player.bio && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Activity size={18} className="text-cricket-gold" />
                About
              </h2>
              <p className="text-gray-300 leading-relaxed">{player.bio}</p>
            </div>
          )}

          {/* Career Stats Placeholder */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Career Statistics</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <StatBox label="Matches" value={0} />
              <StatBox label="Runs" value={0} />
              <StatBox label="Wickets" value={0} />
              <StatBox label="Catches" value={0} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
    <p className="text-white font-medium mt-0.5">{value}</p>
  </div>
);

const StatBox: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="bg-gray-800/50 rounded-lg p-4">
    <div className="text-2xl font-bold text-cricket-gold">{value}</div>
    <div className="text-xs text-gray-400 uppercase tracking-wide mt-1">{label}</div>
  </div>
);
