import React, { useEffect, useState } from 'react';
import { Flag, Trophy, CalendarDays, Users } from 'lucide-react';
import { getPublishedTournaments } from '../../services/tournaments/tournamentService';
import type { Tournament } from '../../types';

const STATUS_STYLES: Record<string, string> = {
  Upcoming: 'bg-blue-900/60 text-blue-300 border-blue-700',
  Ongoing: 'bg-emerald-900/60 text-emerald-300 border-emerald-700 animate-pulse',
  Completed: 'bg-gray-800/60 text-gray-300 border-gray-600',
  Cancelled: 'bg-red-900/60 text-red-300 border-red-700',
};

export const TournamentsPage: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublishedTournaments()
      .then(data => { setTournaments(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-cricket-dark">
      <div className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cricket-gold/5 to-transparent" />
        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-cricket-gold/10 border border-cricket-gold/30 rounded-full px-4 py-1.5 mb-6">
            <Flag size={16} className="text-cricket-gold" />
            <span className="text-cricket-gold text-sm font-medium">{tournaments.length} Tournaments</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white uppercase tracking-tight mb-4">
            <span className="text-cricket-gold">Tournaments</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Our competitive journey across tournaments and series
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-cricket-gold border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-400">Loading tournaments...</p>
          </div>
        ) : tournaments.length === 0 ? (
          <div className="text-center py-20">
            <Flag size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">No tournaments found</p>
            <p className="text-gray-500 text-sm mt-1">Check back later for tournament updates</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {tournaments.map((tournament) => (
              <div key={tournament.tournamentId} className="card-hover bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                {tournament.logo && (
                  <div className="h-40 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <img src={tournament.logo} alt={tournament.name} className="h-28 w-28 object-contain" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-white font-bold text-lg">{tournament.name}</h3>
                    <span className={`flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${STATUS_STYLES[tournament.status]}`}>
                      {tournament.status}
                    </span>
                  </div>
                  {tournament.description && (
                    <p className="text-gray-400 text-sm line-clamp-2 mb-3">{tournament.description}</p>
                  )}
                  <div className="space-y-1.5 text-sm text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays size={12} />
                      <span>{tournament.startDate} {tournament.endDate ? `- ${tournament.endDate}` : ''}</span>
                    </div>
                    {tournament.venue && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-500">📍</span>
                        <span>{tournament.venue}</span>
                      </div>
                    )}
                    {tournament.teams && tournament.teams.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <Users size={12} />
                        <span>{tournament.teams.length} Teams</span>
                      </div>
                    )}
                  </div>
                  {tournament.status === 'Completed' && tournament.champion && (
                    <div className="mt-3 p-2 bg-cricket-gold/10 rounded-lg border border-cricket-gold/20">
                      <p className="text-cricket-gold text-sm font-medium flex items-center gap-1.5">
                        <Trophy size={14} /> Champion: {tournament.champion}
                      </p>
                    </div>
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
