import React from 'react';
import { Users, Trophy, Flag, Image, Bell, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { userData } = useAuth();

  const statCards = [
    { title: 'Total Users', value: '45', icon: <Users size={24} className="text-blue-500" /> },
    { title: 'Total Players', value: '38', icon: <Users size={24} className="text-cricket-green" /> },
    { title: 'Matches Played', value: '124', icon: <Trophy size={24} className="text-cricket-gold" /> },
    { title: 'Active Tournaments', value: '2', icon: <Flag size={24} className="text-purple-500" /> },
    { title: 'Gallery Photos', value: '450', icon: <Image size={24} className="text-pink-500" /> },
    { title: 'Active Notices', value: '5', icon: <Bell size={24} className="text-red-500" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Welcome back, {userData?.name}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center gap-4">
            <div className="p-4 bg-gray-800 rounded-lg">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-cricket-green" /> Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition-colors border border-gray-700">
              <div className="font-medium text-white">Add Player</div>
              <div className="text-xs text-gray-400 mt-1">Register new club member</div>
            </button>
            <button className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition-colors border border-gray-700">
              <div className="font-medium text-white">New Match</div>
              <div className="text-xs text-gray-400 mt-1">Schedule an upcoming match</div>
            </button>
            <button className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition-colors border border-gray-700">
              <div className="font-medium text-white">Post Notice</div>
              <div className="text-xs text-gray-400 mt-1">Announce to all members</div>
            </button>
            <button className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition-colors border border-gray-700">
              <div className="font-medium text-white">Upload Photos</div>
              <div className="text-xs text-gray-400 mt-1">Add to gallery</div>
            </button>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-4 pb-4 border-b border-gray-800 last:border-0 last:pb-0">
                <div className="w-2 h-2 mt-2 rounded-full bg-cricket-green" />
                <div>
                  <p className="text-sm font-medium text-gray-200">System updated match result</p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
