import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Trophy, Flag, Image, Bell, TrendingUp, Shield, UserCircle, Award } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getPlayers } from '../../services/players/playerService';
import { getMatches } from '../../services/matches/matchService';
import { getTournaments } from '../../services/tournaments/tournamentService';
import { getTeams } from '../../services/teams/teamService';
import { getNotices } from '../../services/notices/noticeService';
import { getGalleryImages } from '../../services/gallery/galleryService';
import { getUsers } from '../../services/users/userService';

export const AdminDashboard: React.FC = () => {
  const { userData } = useAuth();
  const [stats, setStats] = useState({
    users: 0, players: 0, matches: 0, tournaments: 0, teams: 0, gallery: 0, notices: 0,
  });

  useEffect(() => {
    Promise.all([
      getUsers().catch(() => []),
      getPlayers().catch(() => []),
      getMatches().catch(() => []),
      getTournaments().catch(() => []),
      getTeams().catch(() => []),
      getGalleryImages().catch(() => []),
      getNotices().catch(() => []),
    ]).then(([users, players, matches, tournaments, teams, gallery, notices]) => {
      setStats({
        users: users.length,
        players: players.length,
        matches: matches.length,
        tournaments: tournaments.length,
        teams: teams.length,
        gallery: gallery.length,
        notices: notices.length,
      });
    });
  }, []);

  const statCards = [
    { title: 'Users', value: stats.users, icon: <Users size={24} className="text-blue-500" /> },
    { title: 'Players', value: stats.players, icon: <UserCircle size={24} className="text-cricket-gold" /> },
    { title: 'Teams', value: stats.teams, icon: <Shield size={24} className="text-purple-500" /> },
    { title: 'Matches', value: stats.matches, icon: <Trophy size={24} className="text-emerald-500" /> },
    { title: 'Tournaments', value: stats.tournaments, icon: <Flag size={24} className="text-orange-500" /> },
    { title: 'Gallery Photos', value: stats.gallery, icon: <Image size={24} className="text-pink-500" /> },
    { title: 'Notices', value: stats.notices, icon: <Bell size={24} className="text-red-500" /> },
  ];

  const quickActions = [
    { label: 'Add Player', desc: 'Register new club member', path: '/admin/players/add', icon: <UserCircle size={18} /> },
    { label: 'Add Team', desc: 'Create a new team', path: '/admin/teams/add', icon: <Shield size={18} /> },
    { label: 'New Match', desc: 'Schedule an upcoming match', path: '/admin/matches/add', icon: <Trophy size={18} /> },
    { label: 'New Tournament', desc: 'Create a tournament', path: '/admin/tournaments/add', icon: <Flag size={18} /> },
    { label: 'Player of Month', desc: 'Set monthly award', path: '/admin/player-of-the-month/add', icon: <Award size={18} /> },
    { label: 'Post Notice', desc: 'Announce to all members', path: '/admin/notices/add', icon: <Bell size={18} /> },
    { label: 'Upload Photos', desc: 'Add to gallery', path: '/admin/gallery', icon: <Image size={18} /> },
    { label: 'Site Settings', desc: 'Manage website content', path: '/admin/settings', icon: <TrendingUp size={18} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Welcome back, {userData?.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
            <div className="p-3 bg-gray-800 rounded-lg">
              {stat.icon}
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">{stat.title}</p>
              <h3 className="text-xl font-bold text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-cricket-gold" /> Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.path}
              className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition-colors border border-gray-700 hover:border-gray-600 group"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-cricket-gold group-hover:text-cricket-gold-light transition-colors">{action.icon}</span>
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
