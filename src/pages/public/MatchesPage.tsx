import React, { useEffect, useState } from 'react';
import { Trophy, CalendarDays, MapPin, Clock, Filter } from 'lucide-react';
import { getMatches } from '../../services/matches/matchService';
import type { Match, MatchStatus } from '../../types';

const STATUS_STYLES: Record<MatchStatus, string> = {
  Upcoming: 'bg-blue-900/60 text-blue-300 border-blue-700',
  Live: 'bg-red-900/60 text-red-300 border-red-700 animate-pulse',
  Completed: 'bg-emerald-900/60 text-emerald-300 border-emerald-700',
  Postponed: 'bg-yellow-900/60 text-yellow-300 border-yellow-700',
  Cancelled: 'bg-gray-800/60 text-gray-400 border-gray-600',
};

type FilterStatus = 'All' | MatchStatus;
const STATUS_OPTIONS: FilterStatus[] = ['All', 'Upcoming', 'Live', 'Completed'];

export const MatchesPage: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('All');

  useEffect(() => {
    getMatches()
      .then(data => { setMatches(data.filter(m => m.published)); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = activeFilter === 'All' ? matches : matches.filter(m => m.status === activeFilter);

  return (
    <div className="min-h-screen bg-cricket-dark">
      {/* Hero */}
      <div className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cricket-gold/5 to-transparent" />
        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-cricket-gold/10 border border-cricket-gold/30 rounded-full px-4 py-1.5 mb-6">
            <Trophy size={16} className="text-cricket-gold" />
            <span className="text-cricket-gold text-sm font-medium">{matches.length} Matches</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white uppercase tracking-tight mb-4">
            Match <span className="text-cricket-gold">Schedule</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Follow all upcoming, live, and completed matches of Cricket Pagla
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="container mx-auto px-4 mt-2">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 justify-center max-w-4xl mx-auto">
          <Filter size={16} className="text-gray-500 flex-shrink-0" />
          {STATUS_OPTIONS.map(status => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                activeFilter === status
                  ? 'bg-cricket-gold text-cricket-dark shadow-lg shadow-cricket-gold/20'
                  : 'bg-gray-800/80 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Matches List */}
      <div className="container mx-auto px-4 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-cricket-gold border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-400">Loading matches...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Trophy size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">No matches found</p>
            <p className="text-gray-500 text-sm mt-1">Check back later for match updates</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-4">
            {filtered.map(match => (
              <MatchCard key={match.matchId} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const MatchCard: React.FC<{ match: Match }> = ({ match }) => {
  const isCompleted = match.status === 'Completed';

  return (
    <div className={`bg-gray-900 border rounded-2xl p-5 sm:p-6 hover:border-gray-700 transition-all ${isCompleted ? 'border-gray-800' : 'border-gray-800'}`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-white font-bold text-lg sm:text-xl">{match.title}</h3>
          {match.competition && (
            <p className="text-cricket-gold text-sm mt-0.5">{match.competition}</p>
          )}
        </div>
        <span className={`flex-shrink-0 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${STATUS_STYLES[match.status]}`}>
          {match.status === 'Live' && <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-1.5 animate-pulse" />}
          {match.status}
        </span>
      </div>

      {/* Teams VS */}
      <div className="flex items-center gap-3 sm:gap-4 mb-4">
        <div className="flex-1 text-right">
          <span className="text-white font-bold text-base sm:text-lg">{match.teamA}</span>
        </div>
        <div className="flex-shrink-0 px-3 py-1 bg-gray-800 rounded-lg">
          <span className="text-gray-400 font-extrabold text-sm">VS</span>
        </div>
        <div className="flex-1 text-left">
          <span className="text-white font-bold text-base sm:text-lg">{match.teamB}</span>
        </div>
      </div>

      {/* Scores */}
      {(match.teamAScore != null || match.teamBScore != null) && (
        <div className="bg-gray-800/50 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 text-right">
              {match.teamAScore != null && (
                <div>
                  <span className="text-white font-mono font-bold text-lg">
                    {match.teamAScore}/{match.teamAWickets}
                  </span>
                  <span className="text-gray-400 text-sm ml-2">({match.teamAOvers} ov)</span>
                </div>
              )}
            </div>
            <div className="flex-shrink-0 text-gray-600 font-bold text-xs">INNINGS</div>
            <div className="flex-1 text-left">
              {match.teamBScore != null && (
                <div>
                  <span className="text-white font-mono font-bold text-lg">
                    {match.teamBScore}/{match.teamBWickets}
                  </span>
                  <span className="text-gray-400 text-sm ml-2">({match.teamBOvers} ov)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {match.resultSummary && (
        <div className="mb-3 p-2.5 bg-cricket-gold/10 rounded-lg border border-cricket-gold/20">
          <p className="text-cricket-gold text-sm font-medium text-center">{match.resultSummary}</p>
        </div>
      )}

      {match.winner && !match.resultSummary && (
        <p className="text-cricket-gold text-sm font-medium mb-3 text-center">
          🏆 Winner: {match.winner}
        </p>
      )}

      {match.manOfTheMatch && (
        <p className="text-gray-400 text-xs mb-3 text-center">
          ⭐ Player of the Match: <span className="text-white font-medium">{match.manOfTheMatch}</span>
        </p>
      )}

      {/* Match Details */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-gray-500 text-xs pt-3 border-t border-gray-800/50">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays size={12} />
          {new Date(match.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
        {match.time && (
          <span className="inline-flex items-center gap-1.5">
            <Clock size={12} />
            {match.time}
          </span>
        )}
        {match.venue && (
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={12} />
            {match.venue}
          </span>
        )}
        <span className="px-2 py-0.5 bg-gray-800 rounded-full text-gray-400">
          {match.matchType}
        </span>
      </div>
    </div>
  );
};
