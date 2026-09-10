import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, Users, Trophy, Image, Bell, Settings, 
  LogOut, Menu, X, ChevronRight, UserCircle, Flag, Shield 
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Players', path: '/admin/players', icon: <UserCircle size={20} /> },
    { name: 'Teams', path: '/admin/teams', icon: <Shield size={20} /> },
    { name: 'Matches', path: '/admin/matches', icon: <Trophy size={20} /> },
    { name: 'Tournaments', path: '/admin/tournaments', icon: <Flag size={20} /> },
    { name: 'Gallery', path: '/admin/gallery', icon: <Image size={20} /> },
    { name: 'Notices', path: '/admin/notices', icon: <Bell size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  const playerLinks = [
    { name: 'Dashboard', path: '/player/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'My Profile', path: '/player/profile', icon: <UserCircle size={20} /> },
    { name: 'My Matches', path: '/player/matches', icon: <Trophy size={20} /> },
    { name: 'Notices', path: '/player/notices', icon: <Bell size={20} /> },
  ];

  const managementLinks = [
    { name: 'Dashboard', path: '/management/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Players', path: '/management/players', icon: <UserCircle size={20} /> },
    { name: 'Matches', path: '/management/matches', icon: <Trophy size={20} /> },
    { name: 'Notices', path: '/management/notices', icon: <Bell size={20} /> },
    { name: 'Gallery', path: '/management/gallery', icon: <Image size={20} /> },
  ];

  let links = playerLinks;
  if (userData?.role === 'ADMIN') links = adminLinks;
  else if (userData?.role === 'MANAGEMENT') links = managementLinks;

  return (
    <div className="min-h-screen bg-gray-900 flex text-gray-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800">
          <span className="text-xl font-bold text-cricket-gold uppercase tracking-wider">Cricket Pagla</span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4 border-b border-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cricket-green flex items-center justify-center text-white font-bold text-lg">
            {userData?.name?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{userData?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{userData?.role.toLowerCase()}</p>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {links.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-cricket-green text-white font-medium' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
                {isActive && <ChevronRight size={16} className="ml-auto" />}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-left text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-md transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-950">
        <header className="h-16 flex items-center justify-between px-4 lg:px-8 border-b border-gray-800 bg-gray-900">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-400 hover:text-white p-2 -ml-2"
          >
            <Menu size={24} />
          </button>
          
          <div className="ml-auto flex items-center gap-4">
            <Link to="/" className="text-sm text-gray-400 hover:text-cricket-gold transition-colors">
              View Site
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
