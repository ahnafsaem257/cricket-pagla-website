import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const PublicLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, userData } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Players', path: '/players' },
    { name: 'Teams', path: '/teams' },
    { name: 'Tournaments', path: '/tournaments' },
    { name: 'Matches', path: '/matches' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Notices', path: '/notices' },
  ];

  const getDashboardLink = () => {
    if (userData?.role === 'ADMIN') return '/admin/dashboard';
    if (userData?.role === 'MANAGEMENT') return '/management/dashboard';
    return '/player/dashboard';
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cricket-dark text-white">
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-cricket-dark/95 backdrop-blur-md border-b border-cricket-border shadow-lg shadow-black/20'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <img
                src="/logo.jpg"
                alt="Cricket Pagla Logo"
                className="h-9 w-9 lg:h-10 lg:w-10 object-contain rounded-full border-2 border-cricket-gold/60"
              />
              <div className="hidden sm:block">
                <span className="font-bold text-lg tracking-tight text-white uppercase leading-none">
                  Cricket Pagla
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className={`relative px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                        isActive(link.path)
                          ? 'text-cricket-gold'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      {link.name}
                      {isActive(link.path) && (
                        <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-cricket-gold rounded-full" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Desktop Auth Button */}
            <div className="hidden lg:flex items-center">
              {currentUser ? (
                <Link
                  to={getDashboardLink()}
                  className="flex items-center gap-2 bg-cricket-gold hover:bg-cricket-gold-light text-cricket-dark px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 hover:shadow-lg hover:shadow-cricket-gold/20"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-cricket-gold hover:bg-cricket-gold-light text-cricket-dark px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 hover:shadow-lg hover:shadow-cricket-gold/20"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white focus:outline-none p-2 rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-cricket-dark border-t border-cricket-border px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-cricket-gold/10 text-cricket-gold border-l-2 border-cricket-gold'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-3 border-t border-cricket-border">
              {currentUser ? (
                <Link
                  to={getDashboardLink()}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-base font-bold bg-cricket-gold text-cricket-dark hover:bg-cricket-gold-light transition-colors text-center"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-base font-bold bg-cricket-gold text-cricket-dark hover:bg-cricket-gold-light transition-colors text-center"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-cricket-darker border-t border-cricket-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer */}
          <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link to="/" className="flex items-center gap-2.5 mb-4">
                <img src="/logo.jpg" alt="Cricket Pagla" className="h-9 w-9 object-contain rounded-full border-2 border-cricket-gold/60" />
                <span className="font-bold text-lg text-white uppercase tracking-tight">Cricket Pagla</span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                More than cricket — it's a family. Passion, performance, and brotherhood on and off the field.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h3>
              <ul className="space-y-2.5">
                {[
                  { name: 'Players', path: '/players' },
                  { name: 'Teams', path: '/teams' },
                  { name: 'Tournaments', path: '/tournaments' },
                  { name: 'Matches', path: '/matches' },
                  { name: 'Gallery', path: '/gallery' },
                ].map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-gray-400 hover:text-cricket-gold text-sm transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Community */}
            <div>
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Community</h3>
              <ul className="space-y-2.5">
                {[
                  { name: 'About Us', path: '/about' },
                  { name: 'Notices', path: '/notices' },
                  { name: 'Login', path: '/login' },
                ].map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-gray-400 hover:text-cricket-gold text-sm transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Connect</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Join Cricket Pagla and become part of a growing family of passionate cricketers.
              </p>
              <div className="mt-4">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 bg-cricket-gold hover:bg-cricket-gold-light text-cricket-dark px-4 py-2 rounded-lg text-sm font-bold transition-all"
                >
                  Join Now
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="py-6 border-t border-cricket-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Cricket Pagla. All rights reserved.
            </p>
            <p className="text-gray-600 text-xs tracking-widest uppercase">
              Passion &bull; Performance &bull; Brotherhood
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
