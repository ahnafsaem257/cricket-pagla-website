import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Trophy, Bell, Users, Image, TrendingUp } from 'lucide-react';
import { getMatches } from '../../services/matches/matchService';
import { getNotices } from '../../services/notices/noticeService';
import { getPlayers } from '../../services/players/playerService';
import { getGalleryImages } from '../../services/gallery/galleryService';

export const ManagementDashboard: React.FC = () => {
  const { userData } = useAuth();
  const [stats, setStats] = useState({ matches: 0, notices: 0, players: 0, gallery: 0 });

  useEffect(() => {
    Promise.all([
      getMatches().catch(() => []),
      getNotices().catch(() => []),
      getPlayers().catch(() => []),
      getGalleryImages().catch(() => []),
    ]).then(([matches, notices, players, gallery]) => {
      setStats({
        matches: matches.length,
        notices: notices.length,
        players: players.length,
        gallery: gallery.length,
      });
    });
  }, []);

  const quickActions = [
    { label: 'Manage Players', desc: 'View and update player profiles', path: '/management/players', icon: <Users size={24} className="text-blue-500" /> },
    { label: 'Match Operations', desc: 'Update scores and results', path: '/management/matches', icon: <Trophy size={24} className="text-cricket-gold" /> },
    { label: 'Notices', desc: 'Create club announcements', path: '/management/notices', icon: <Bell size={24} className="text-red-500" /> },
    { label: 'Gallery', desc: 'Manage photo gallery', path: '/management/gallery', icon: <Image size={24} className="text-pink-500" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Management Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Hello, {userData?.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
          <div className="p-3 bg-gray-800 rounded-lg"><Users size={24} className="text-blue-500" /></div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Players</p>
            <h3 className="text-xl font-bold text-white">{stats.players}</h3>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
          <div className="p-3 bg-gray-800 rounded-lg"><Trophy size={24} className="text-cricket-gold" /></div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Matches</p>
            <h3 className="text-xl font-bold text-white">{stats.matches}</h3>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
          <div className="p-3 bg-gray-800 rounded-lg"><Bell size={24} className="text-red-500" /></div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Notices</p>
            <h3 className="text-xl font-bold text-white">{stats.notices}</h3>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
          <div className="p-3 bg-gray-800 rounded-lg"><Image size={24} className="text-pink-500" /></div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Gallery</p>
            <h3 className="text-xl font-bold text-white">{stats.gallery}</h3>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-cricket-gold" /> Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.path}
              className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition-colors border border-gray-700 hover:border-gray-600 group"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="group-hover:text-cricket-gold-light transition-colors">{action.icon}</span>
                <span className="font-medium text-white text-sm">{action.label}</span>
              </div>
              <div className="text-xs text-gray-400">{action.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
