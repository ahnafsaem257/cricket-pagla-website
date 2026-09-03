import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { getPlayers } from '../../services/players/playerService';
import type { Player, PlayingRole } from '../../types';

const ROLE_TABS: { label: string; value: PlayingRole | 'All' }[] = [
  { label: 'All', value: 'All' },
  { label: 'All Rounders', value: 'All-Rounder' },
  { label: 'Batters', value: 'Batsman' },
  { label: 'Bowlers', value: 'Bowler' },
  { label: 'Wicket Keepers', value: 'Wicket Keeper' },
  { label: 'Unspecified', value: 'Unspecified' },
];

type SortOption = 'role' | 'az' | 'jersey';

const ROLE_COLORS: Record<string, string> = {
  'All-Rounder': 'bg-emerald-900/60 text-emerald-300 border-emerald-700',
  'Batsman': 'bg-blue-900/60 text-blue-300 border-blue-700',
  'Bowler': 'bg-red-900/60 text-red-300 border-red-700',
  'Wicket Keeper': 'bg-purple-900/60 text-purple-300 border-purple-700',
  'Unspecified': 'bg-gray-800/60 text-gray-400 border-gray-600',
};

const ROLE_ICONS: Record<string, string> = {
  'All-Rounder': '⚡',
  'Batsman': '🏏',
  'Bowler': '🎯',
  'Wicket Keeper': '🧤',
  'Unspecified': '👤',
};

export const Players: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<PlayingRole | 'All'>('All');
  const [sortBy, setSortBy] = useState<SortOption>('az');
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getPlayers().then(data => {
      setPlayers(data.filter(p => p.status === 'Active' || p.status === 'Injured'));
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const filteredPlayers = players
    .filter(p => activeTab === 'All' || p.playingRole === activeTab)
    .filter(p => {
      if (!searchTerm) return true;
      const s = searchTerm.toLowerCase();
      return (
        p.fullName.toLowerCase().includes(s) ||
        p.playingRole.toLowerCase().includes(s) ||
        (p.jerseyNumber != null && p.jerseyNumber.toString().includes(s)) ||
        (p.nickname && p.nickname.toLowerCase().includes(s))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'az') return a.fullName.localeCompare(b.fullName);
      if (sortBy === 'jersey') return (a.jerseyNumber ?? 9999) - (b.jerseyNumber ?? 9999);
      if (sortBy === 'role') return a.playingRole.localeCompare(b.playingRole);
      return 0;
    });

  const roleCounts = players.reduce((acc, p) => {
    acc[p.playingRole] = (acc[p.playingRole] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      tabsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-cricket-dark">
      {/* Hero */}
      <div className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cricket-green/10 to-transparent" />
        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-cricket-gold/10 border border-cricket-gold/30 rounded-full px-4 py-1.5 mb-6">
            <Users size={16} className="text-cricket-gold" />
            <span className="text-cricket-gold text-sm font-medium">{players.length} Players</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white uppercase tracking-tight mb-4">
            Cricket <span className="text-cricket-gold">Pagla</span> Squad
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Meet the warriors who carry the passion of Cricket Pagla on the field
          </p>
        </div>
      </div>

      {/* Search + Sort */}
      <div className="container mx-auto px-4 -mt-4">
        <div className="flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search by name, role, or jersey..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cricket-gold focus:ring-1 focus:ring-cricket-gold transition-all"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-cricket-gold cursor-pointer"
          >
            <option value="az">A-Z</option>
            <option value="role">Role</option>
            <option value="jersey">Jersey</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 mt-6">
        <div className="relative max-w-4xl mx-auto">
          <button
            onClick={() => scrollTabs('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 bg-gray-800 hover:bg-gray-700 rounded-full p-1.5 hidden sm:block"
          >
            <ChevronLeft size={16} className="text-gray-400" />
          </button>
          <div
            ref={tabsRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 px-2 sm:px-6 justify-center"
          >
            {ROLE_TABS.map(tab => {
              const count = tab.value === 'All'
                ? players.length
                : (roleCounts[tab.value] || 0);
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.value
                      ? 'bg-cricket-gold text-cricket-dark shadow-lg shadow-cricket-gold/20'
                      : 'bg-gray-800/80 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-1.5 text-xs ${activeTab === tab.value ? 'text-cricket-dark/70' : 'text-gray-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
          <button
            onClick={() => scrollTabs('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 bg-gray-800 hover:bg-gray-700 rounded-full p-1.5 hidden sm:block"
          >
            <ChevronRight size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Players Grid */}
      <div className="container mx-auto px-4 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-cricket-gold border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-400">Loading squad...</p>
          </div>
        ) : filteredPlayers.length === 0 ? (
          <div className="text-center py-20">
            <Users size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">No players found</p>
            <p className="text-gray-500 text-sm mt-1">Try a different search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {filteredPlayers.map((player) => (
              <PlayerCard key={player.playerId} player={player} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const PlayerCard: React.FC<{ player: Player }> = ({ player }) => {
  const roleColor = ROLE_COLORS[player.playingRole] || ROLE_COLORS['Unspecified'];
  const roleIcon = ROLE_ICONS[player.playingRole] || '👤';

  return (
    <Link
      to={`/players/${player.playerId}`}
      className="group relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-cricket-gold/50 transition-all duration-300 hover:shadow-xl hover:shadow-cricket-gold/5 hover:-translate-y-1 block"
    >
      {/* Photo */}
      <div className="relative aspect-square overflow-hidden bg-gray-800">
        {player.profilePhoto ? (
          <img
            src={player.profilePhoto}
            alt={player.fullName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <span className="text-5xl sm:text-6xl font-bold text-gray-700 group-hover:text-gray-600 transition-colors">
              {player.fullName.charAt(0)}
            </span>
          </div>
        )}

        {/* Jersey Number Badge */}
        {player.jerseyNumber != null && (
          <div className="absolute top-2.5 right-2.5 bg-cricket-gold text-cricket-dark font-black text-xs w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
            {player.jerseyNumber === 0 ? '00' : player.jerseyNumber}
          </div>
        )}

        {/* Role Icon */}
        <div className="absolute bottom-2.5 left-2.5 text-lg">{roleIcon}</div>
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4">
        <h3 className="text-white font-bold text-sm sm:text-base truncate leading-tight">{player.fullName}</h3>
        <div className="mt-1.5">
          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium border ${roleColor}`}>
            {player.playingRole}
          </span>
        </div>
      </div>
    </Link>
  );
};
