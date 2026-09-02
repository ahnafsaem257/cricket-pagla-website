import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, X, LogIn, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const PublicLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, userData } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Players', path: '/players' },
    { name: 'Matches', path: '/matches' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Notices', path: '/notices' },
  ];

  const getDashboardLink = () => {
    if (userData?.role === 'ADMIN') return '/admin/dashboard';
    if (userData?.role === 'MANAGEMENT') return '/management/dashboard';
    return '/player/dashboard';
  };

  return (
    <div className="min-h-screen flex flex-col bg-cricket-dark text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0a] border-b border-gray-800 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <img src="/logo.jpg" alt="Cricket Pagla Logo" className="h-10 w-10 object-contain rounded-full border border-cricket-gold" />
                <span className="font-bold text-xl tracking-tight text-white uppercase">Cricket Pagla</span>
              </Link>
            </div>
            
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-gray-300 hover:text-cricket-gold transition-colors font-medium">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              {currentUser ? (
                <Link to={getDashboardLink()} className="flex items-center gap-2 bg-cricket-gold hover:bg-yellow-600 text-cricket-dark px-4 py-2 rounded-md font-bold transition-colors">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              ) : (
                <Link to="/login" className="flex items-center gap-2 bg-cricket-gold hover:bg-yellow-600 text-cricket-dark px-4 py-2 rounded-md font-bold transition-colors">
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white focus:outline-none p-2"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#0a0a0a] border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-cricket-gold hover:bg-gray-800 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              
              {currentUser ? (
                <Link
                  to={getDashboardLink()}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 mt-4 rounded-md text-base font-bold bg-cricket-gold text-cricket-dark hover:bg-yellow-600 transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 mt-4 rounded-md text-base font-bold bg-cricket-gold text-cricket-dark hover:bg-yellow-600 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-[#020202] border-t border-gray-900 py-8 text-center text-gray-400">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} Cricket Pagla. All rights reserved.</p>
          <p className="mt-2 text-sm">Passion • Performance • Brotherhood</p>
        </div>
      </footer>
    </div>
  );
};
