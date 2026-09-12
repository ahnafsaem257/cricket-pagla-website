import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Award, Target, Activity, BarChart3 } from 'lucide-react';
import { getActivePlayers } from '../../services/players/playerService';
import type { Player } from '../../types';

export const StatisticsPage: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActivePlayers()
      .then(data => { setPlayers(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const hasStats = players.some(p => (p.runs && p.runs > 0) || (p.wickets && p.wickets > 0) || (p.catches && p.catches > 0));

  const battingLeaders = [...players]
    .filter(p => p.runs && p.runs > 0)
    .sort((a, b) => (b.runs || 0) - (a.runs || 0))
    .slice(0, 10);

  const bowlingLeaders = [...players]
    .filter(p => p.wickets && p.wickets > 0)
    .sort((a, b) => (b.wickets || 0) - (a.wickets || 0))
    .slice(0, 10);

  const fieldingLeaders = [...players]
    .filter(p => (p.catches && p.catches > 0) || (p.runOuts && p.runOuts > 0))
    .sort((a, b) => ((b.catches || 0) + (b.runOuts || 0)) - ((a.catches || 0) + (a.runOuts || 0)))
    .slice(0, 10);

  const overallRankings = [...players]
    .filter(p => p.totalPoints && p.totalPoints > 0)
    .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0))
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-cricket-dark">
      {/* Hero */}
      <div className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cricket-gold/5 to-transparent" />
        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-cricket-gold/10 border border-cricket-gold/30 rounded-full px-4 py-1.5 mb-6">
            <BarChart3 size={16} className="text-cricket-gold" />
            <span className="text-cricket-gold text-sm font-medium">Player Statistics</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white uppercase tracking-tight mb-4">
            Statistics & <span className="text-cricket-gold">Rankings</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Comprehensive player statistics and performance rankings
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-cricket-gold border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-400">Loading statistics...</p>
          </div>
        ) : !hasStats ? (
          <div className="text-center py-20">
            <BarChart3 size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">Statistics will appear after match data is added</p>
            <p className="text-gray-500 text-sm mt-1">Admin can add player statistics from the admin panel</p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-10">
            {/* Batting Leaders */}
            {battingLeaders.length > 0 && (
              <section>
                <h2 className="text-2xl font-extrabold text-white uppercase mb-6 flex items-center gap-3">
                  <TrendingUp size={24} className="text-cricket-gold" />
                  Batting <span className="text-cricket-gold">Leaders</span>
                </h2>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="px-4 py-3 text-xs text-gray-400 uppercase tracking-wider font-medium">#</th>
                          <th className="px-4 py-3 text-xs text-gray-400 uppercase tracking-wider font-medium">Player</th>
                          <th className="px-4 py-3 text-xs text-gray-400 uppercase tracking-wider font-medium">Team</th>
                          <th className="px-4 py-3 text-xs text-gray-400 uppercase tracking-wider font-medium text-right">Runs</th>
                          <th className="px-4 py-3 text-xs text-gray-400 uppercase tracking-wider font-medium text-right">Avg</th>
                          <th className="px-4 py-3 text-xs text-gray-400 uppercase tracking-wider font-medium text-right">SR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {battingLeaders.map((player, i) => (
                          <tr key={player.playerId} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                            <td className="px-4 py-3">
                              <span className={`font-bold text-sm ${i < 3 ? 'text-cricket-gold' : 'text-gray-400'}`}>{i + 1}</span>
                            </td>
                            <td className="px-4 py-3">
                              <Link to={`/players/${player.playerId}`} className="flex items-center gap-3 group">
                                {player.profilePhoto ? (
                                  <img src={player.profilePhoto} alt={player.fullName} className="w-8 h-8 rounded-full object-cover" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                                    <span className="text-xs font-bold text-gray-500">{player.fullName.charAt(0)}</span>
                                  </div>
                                )}
                                <span className="text-white font-medium text-sm group-hover:text-cricket-gold transition-colors">{player.fullName}</span>
                              </Link>
                            </td>
                            <td className="px-4 py-3 text-gray-400 text-sm">{player.team || 'Cricket Pagla'}</td>
                            <td className="px-4 py-3 text-white font-bold text-sm text-right">{player.runs}</td>
                            <td className="px-4 py-3 text-gray-300 text-sm text-right">{player.battingAverage?.toFixed(1) || '-'}</td>
                            <td className="px-4 py-3 text-gray-300 text-sm text-right">{player.strikeRate?.toFixed(1) || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* Bowling Leaders */}
            {bowlingLeaders.length > 0 && (
              <section>
                <h2 className="text-2xl font-extrabold text-white uppercase mb-6 flex items-center gap-3">
                  <Target size={24} className="text-cricket-gold" />
                  Bowling <span className="text-cricket-gold">Leaders</span>
                </h2>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="px-4 py-3 text-xs text-gray-400 uppercase tracking-wider font-medium">#</th>
                          <th className="px-4 py-3 text-xs text-gray-400 uppercase tracking-wider font-medium">Player</th>
                          <th className="px-4 py-3 text-xs text-gray-400 uppercase tracking-wider font-medium">Team</th>
                          <th className="px-4 py-3 text-xs text-gray-400 uppercase tracking-wider font-medium text-right">Wickets</th>
                          <th className="px-4 py-3 text-xs text-gray-400 uppercase tracking-wider font-medium text-right">Avg</th>
                          <th className="px-4 py-3 text-xs text-gray-400 uppercase tracking-wider font-medium text-right">Econ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bowlingLeaders.map((player, i) => (
                          <tr key={player.playerId} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                            <td className="px-4 py-3">
                              <span className={`font-bold text-sm ${i < 3 ? 'text-cricket-gold' : 'text-gray-400'}`}>{i + 1}</span>
                            </td>
                            <td className="px-4 py-3">
                              <Link to={`/players/${player.playerId}`} className="flex items-center gap-3 group">
                                {player.profilePhoto ? (
                                  <img src={player.profilePhoto} alt={player.fullName} className="w-8 h-8 rounded-full object-cover" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                                    <span className="text-xs font-bold text-gray-500">{player.fullName.charAt(0)}</span>
                                  </div>
                                )}
                                <span className="text-white font-medium text-sm group-hover:text-cricket-gold transition-colors">{player.fullName}</span>
                              </Link>
                            </td>
                            <td className="px-4 py-3 text-gray-400 text-sm">{player.team || 'Cricket Pagla'}</td>
                            <td className="px-4 py-3 text-white font-bold text-sm text-right">{player.wickets}</td>
                            <td className="px-4 py-3 text-gray-300 text-sm text-right">{player.bowlingAverage?.toFixed(1) || '-'}</td>
                            <td className="px-4 py-3 text-gray-300 text-sm text-right">{player.economy?.toFixed(2) || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* Fielding Leaders */}
            {fieldingLeaders.length > 0 && (
              <section>
                <h2 className="text-2xl font-extrabold text-white uppercase mb-6 flex items-center gap-3">
                  <Award size={24} className="text-cricket-gold" />
                  Fielding <span className="text-cricket-gold">Leaders</span>
                </h2>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="px-4 py-3 text-xs text-gray-400 uppercase tracking-wider font-medium">#</th>
                          <th className="px-4 py-3 text-xs text-gray-400 uppercase tracking-wider font-medium">Player</th>
                          <th className="px-4 py-3 text-xs text-gray-400 uppercase tracking-wider font-medium">Team</th>
                          <th className="px-4 py-3 text-xs text-gray-400 uppercase tracking-wider font-medium text-right">Catches</th>
                          <th className="px-4 py-3 text-xs text-gray-400 uppercase tracking-wider font-medium text-right">Run Outs</th>
                          <th className="px-4 py-3 text-xs text-gray-400 uppercase tracking-wider font-medium text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fieldingLeaders.map((player, i) => (
                          <tr key={player.playerId} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                            <td className="px-4 py-3">
                              <span className={`font-bold text-sm ${i < 3 ? 'text-cricket-gold' : 'text-gray-400'}`}>{i + 1}</span>
                            </td>
                            <td className="px-4 py-3">
                              <Link to={`/players/${player.playerId}`} className="flex items-center gap-3 group">
                                {player.profilePhoto ? (
                                  <img src={player.profilePhoto} alt={player.fullName} className="w-8 h-8 rounded-full object-cover" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                                    <span className="text-xs font-bold text-gray-500">{player.fullName.charAt(0)}</span>
                                  </div>
                                )}
                                <span className="text-white font-medium text-sm group-hover:text-cricket-gold transition-colors">{player.fullName}</span>
                              </Link>
                            </td>
                            <td className="px-4 py-3 text-gray-400 text-sm">{player.team || 'Cricket Pagla'}</td>
                            <td className="px-4 py-3 text-white font-bold text-sm text-right">{player.catches || 0}</td>
                            <td className="px-4 py-3 text-white font-bold text-sm text-right">{player.runOuts || 0}</td>
                            <td className="px-4 py-3 text-cricket-gold font-bold text-sm text-right">{(player.catches || 0) + (player.runOuts || 0)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* Overall Rankings */}
            {overallRankings.length > 0 && (
              <section>
                <h2 className="text-2xl font-extrabold text-white uppercase mb-6 flex items-center gap-3">
                  <Activity size={24} className="text-cricket-gold" />
                  Overall <span className="text-cricket-gold">Rankings</span>
                </h2>
                <p className="text-gray-400 text-sm mb-4">Based on: 1 run = 1 pt | 1 wicket = 5 pts | 1 catch = 2 pts | 1 run out = 1 pt</p>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="px-4 py-3 text-xs text-gray-400 uppercase tracking-wider font-medium">#</th>
                          <th className="px-4 py-3 text-xs text-gray-400 uppercase tracking-wider font-medium">Player</th>
                          <th className="px-4 py-3 text-xs text-gray-400 uppercase tracking-wider font-medium">Team</th>
                          <th className="px-4 py-3 text-xs text-gray-400 uppercase tracking-wider font-medium text-right">Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {overallRankings.map((player, i) => (
                          <tr key={player.playerId} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                            <td className="px-4 py-3">
                              <span className={`font-bold text-sm ${i < 3 ? 'text-cricket-gold' : 'text-gray-400'}`}>{i + 1}</span>
                            </td>
                            <td className="px-4 py-3">
                              <Link to={`/players/${player.playerId}`} className="flex items-center gap-3 group">
                                {player.profilePhoto ? (
                                  <img src={player.profilePhoto} alt={player.fullName} className="w-8 h-8 rounded-full object-cover" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                                    <span className="text-xs font-bold text-gray-500">{player.fullName.charAt(0)}</span>
                                  </div>
                                )}
                                <span className="text-white font-medium text-sm group-hover:text-cricket-gold transition-colors">{player.fullName}</span>
                              </Link>
                            </td>
                            <td className="px-4 py-3 text-gray-400 text-sm">{player.team || 'Cricket Pagla'}</td>
                            <td className="px-4 py-3 text-cricket-gold font-bold text-sm text-right">{player.totalPoints}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
