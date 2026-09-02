import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldCheck, Trophy, Bell, Users } from 'lucide-react';

export const ManagementDashboard: React.FC = () => {
  const { userData } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Management Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Hello, {userData?.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-cricket-green transition-colors">
          <Users size={32} className="text-blue-500 mb-3" />
          <h3 className="text-lg font-bold text-white">Manage Players</h3>
          <p className="text-xs text-gray-400 mt-2">View and update player profiles</p>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-cricket-green transition-colors">
          <Trophy size={32} className="text-cricket-gold mb-3" />
          <h3 className="text-lg font-bold text-white">Match Operations</h3>
          <p className="text-xs text-gray-400 mt-2">Update scores and results</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-cricket-green transition-colors">
          <Bell size={32} className="text-red-500 mb-3" />
          <h3 className="text-lg font-bold text-white">Notices</h3>
          <p className="text-xs text-gray-400 mt-2">Create club announcements</p>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-cricket-green transition-colors">
          <ShieldCheck size={32} className="text-cricket-green mb-3" />
          <h3 className="text-lg font-bold text-white">Permissions</h3>
          <p className="text-xs text-gray-400 mt-2">Review your access level</p>
        </div>
      </div>
    </div>
  );
};
