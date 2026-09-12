import React, { useEffect, useState } from 'react';
import { Award, Star, Trophy, Target, Activity } from 'lucide-react';
import { getAllPlayerOfMonth } from '../../services/playerOfMonth/playerOfMonthService';
import type { PlayerOfMonth } from '../../types';

export const PlayerOfMonthPage: React.FC = () => {
  const [records, setRecords] = useState<PlayerOfMonth[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPlayerOfMonth()
      .then(data => { setRecords(data.filter(r => r.published)); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-cricket-dark">
      {/* Hero */}
      <div className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cricket-gold/5 to-transparent" />
        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-cricket-gold/10 border border-cricket-gold/30 rounded-full px-4 py-1.5 mb-6">
            <Award size={16} className="text-cricket-gold" />
            <span className="text-cricket-gold text-sm font-medium">Player of the Month</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white uppercase tracking-tight mb-4">
            Player of the <span className="text-cricket-gold">Month</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Celebrating outstanding performances month by month
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-cricket-gold border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-400">Loading...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-20">
            <Award size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">No Player of the Month announced yet</p>
            <p className="text-gray-500 text-sm mt-1">Check back later for updates</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {records.map((record, i) => (
              <div key={record.id} className={`bg-gray-900 border rounded-2xl overflow-hidden ${i === 0 ? 'border-cricket-gold/30' : 'border-gray-800'}`}>
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Photo */}
                    <div className="relative flex-shrink-0">
                      {record.playerPhoto ? (
                        <img src={record.playerPhoto} alt={record.playerName}
                          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-cricket-gold shadow-xl" />
                      ) : (
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border-4 border-cricket-gold shadow-xl flex items-center justify-center">
                          <span className="text-4xl font-bold text-gray-500">{record.playerName.charAt(0)}</span>
                        </div>
                      )}
                      {i === 0 && (
                        <div className="absolute -top-2 -right-2 bg-cricket-gold text-cricket-dark w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
                          <Star size={20} />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="text-center sm:text-left flex-1">
                      <div className="text-cricket-gold font-bold text-sm uppercase tracking-wider mb-1">
                        {record.month} {record.year}
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">{record.playerName}</h2>
                      <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start text-sm text-gray-400">
                        {record.team && <span>{record.team}</span>}
                        {record.role && <span className="text-cricket-gold">{record.role}</span>}
                      </div>
                    </div>

                    {/* Points */}
                    <div className="text-center flex-shrink-0">
                      <div className="text-4xl font-extrabold text-cricket-gold">{record.totalPoints}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Points</div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-gray-800">
                    <StatMini icon={<Trophy size={14} />} label="Runs" value={record.runs || 0} />
                    <StatMini icon={<Target size={14} />} label="Wickets" value={record.wickets || 0} />
                    <StatMini icon={<Activity size={14} />} label="Catches" value={record.catches || 0} />
                    <StatMini icon={<Award size={14} />} label="Run Outs" value={record.runOuts || 0} />
                  </div>

                  {record.description && (
                    <p className="text-gray-400 text-sm mt-4 pt-4 border-t border-gray-800">{record.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StatMini: React.FC<{ icon: React.ReactNode; label: string; value: number }> = ({ icon, label, value }) => (
  <div className="bg-gray-800/50 rounded-xl p-3 text-center">
    <div className="text-cricket-gold mb-1 flex justify-center">{icon}</div>
    <div className="text-lg font-bold text-white">{value}</div>
    <div className="text-[10px] text-gray-400 uppercase">{label}</div>
  </div>
);
