import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getPlayerByUserId } from '../../services/players/playerService';
import { getPlayerPerformances } from '../../services/matches/performanceService';
import { Trophy, Target, Activity, Award } from 'lucide-react';
import type { Player, MatchPerformance } from '../../types';

export const PlayerDashboard: React.FC = () => {
  const { userData } = useAuth();
  const [player, setPlayer] = useState<Player | null>(null);
  const [performances, setPerformances] = useState<MatchPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData?.uid) {
      getPlayerByUserId(userData.uid)
        .then(async (pData) => {
          if (pData) {
            setPlayer(pData);
            try {
              const perfs = await getPlayerPerformances(pData.playerId);
              setPerformances(perfs);
            } catch {
              // performances may not exist yet
            }
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [userData]);

  const totalRuns = performances.reduce((sum, p) => sum + (p.runs || 0), 0);
  const totalWickets = performances.reduce((sum, p) => sum + (p.wickets || 0), 0);
  const totalCatches = performances.reduce((sum, p) => sum + (p.catches || 0), 0);
  const totalMatches = performances.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-cricket-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Player Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden col-span-1">
          <div className="h-24 bg-cricket-gold relative">
            <div className="absolute -bottom-12 left-6 border-4 border-gray-900 rounded-full bg-white h-24 w-24 overflow-hidden">
              {player?.profilePhoto ? (
                <img src={player.profilePhoto} alt={player.fullName} className="w-full h-full object-cover" />
              ) : (
                <img src={`https://ui-avatars.com/api/?name=${userData?.name?.replace(' ', '+')}&background=d4af37&color=050505&size=256`} alt="Profile" />
              )}
            </div>
          </div>
          <div className="pt-16 pb-6 px-6">
            <h2 className="text-xl font-bold text-white">{player?.fullName || userData?.name}</h2>
            <p className="text-sm text-cricket-gold font-medium mb-4">{player?.playingRole || userData?.role}</p>
            
            <div className="space-y-3 border-t border-gray-800 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Status</span>
                <span className="text-green-400 font-medium">{player?.status || userData?.status}</span>
              </div>
              {player?.jerseyNumber != null && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Jersey</span>
                  <span className="text-gray-200">#{player.jerseyNumber === 0 ? '00' : player.jerseyNumber}</span>
                </div>
              )}
              {player?.team && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Team</span>
                  <span className="text-gray-200">{player.team}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Joined</span>
                <span className="text-gray-200">
                  {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 col-span-1 lg:col-span-2">
          <h3 className="text-lg font-bold text-white mb-6">Career Overview</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-800 rounded-lg text-center">
              <Trophy className="mx-auto h-6 w-6 text-cricket-gold mb-2" />
              <div className="text-3xl font-bold text-white mb-1">{player?.matches || totalMatches}</div>
              <div className="text-xs text-gray-400 uppercase">Matches</div>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg text-center">
              <Target className="mx-auto h-6 w-6 text-cricket-gold mb-2" />
              <div className="text-3xl font-bold text-white mb-1">{player?.runs || totalRuns}</div>
              <div className="text-xs text-gray-400 uppercase">Runs</div>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg text-center">
              <Activity className="mx-auto h-6 w-6 text-cricket-gold mb-2" />
              <div className="text-3xl font-bold text-white mb-1">{player?.wickets || totalWickets}</div>
              <div className="text-xs text-gray-400 uppercase">Wickets</div>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg text-center">
              <Award className="mx-auto h-6 w-6 text-cricket-gold mb-2" />
              <div className="text-3xl font-bold text-white mb-1">{player?.catches || totalCatches}</div>
              <div className="text-xs text-gray-400 uppercase">Catches</div>
            </div>
          </div>

          {player?.totalPoints ? (
            <div className="mt-4 p-4 bg-cricket-gold/10 rounded-lg border border-cricket-gold/20">
              <div className="flex items-center justify-between">
                <span className="text-cricket-gold font-medium">Total Points</span>
                <span className="text-cricket-gold font-bold text-xl">{player.totalPoints}</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
