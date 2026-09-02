import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const PlayerDashboard: React.FC = () => {
  const { userData } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Player Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden col-span-1 lg:col-span-1">
          <div className="h-24 bg-cricket-gold relative">
            <div className="absolute -bottom-12 left-6 border-4 border-gray-900 rounded-full bg-white h-24 w-24 overflow-hidden">
               <img src={`https://ui-avatars.com/api/?name=${userData?.name?.replace(' ', '+')}&background=cfa830&color=0a4f27&size=256`} alt="Profile" />
            </div>
          </div>
          <div className="pt-16 pb-6 px-6">
            <h2 className="text-xl font-bold text-white">{userData?.name}</h2>
            <p className="text-sm text-cricket-green font-medium mb-4">{userData?.role}</p>
            
            <div className="space-y-3 border-t border-gray-800 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Status</span>
                <span className="text-green-400 font-medium">{userData?.status}</span>
              </div>
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
              <div className="text-3xl font-bold text-white mb-1">0</div>
              <div className="text-xs text-gray-400 uppercase">Matches</div>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg text-center">
              <div className="text-3xl font-bold text-white mb-1">0</div>
              <div className="text-xs text-gray-400 uppercase">Runs</div>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg text-center">
              <div className="text-3xl font-bold text-white mb-1">0</div>
              <div className="text-xs text-gray-400 uppercase">Wickets</div>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg text-center">
              <div className="text-3xl font-bold text-white mb-1">0</div>
              <div className="text-xs text-gray-400 uppercase">Catches</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
