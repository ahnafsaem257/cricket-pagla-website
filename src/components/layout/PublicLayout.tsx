import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, LayoutDashboard, ChevronDown, Mail, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getSiteSettings } from '../../services/site/siteService';
import type { SiteSettings } from '../../types';

export const PublicLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const { currentUser, userData } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    getSiteSettings().then(s => setSiteSettings(s)).catch(() => {});
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setMoreOpen(false);
  }, [location]);

  const primaryNav = [
    { name: 'Home', path: '/' },
    { name: 'Players', path: '/players' },
    { name: 'Teams', path: '/teams' },
    { name: 'Tournaments', path: '/tournaments' },
    { name: 'Matches', path: '/matches' },
  ];

  const moreNav = [
    { name: 'Statistics', path: '/statistics' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Notices', path: '/notices' },
    { name: 'About', path: '/about' },
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

  const isMoreActive = moreNav.some(n => isActive(n.path));

  return (
    <div className="min-h-screen flex flex-col bg-cricket-dark text-white">
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-cricket-dark/95 backdrop-blur-md border-b border-cricket-border shadow-lg shadow-black/20'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
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
                {primaryNav.map((link) => (
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
                {/* More Dropdown */}
                <li className="relative">
                  <button
                    onClick={() => setMoreOpen(!moreOpen)}
                    onBlur={() => setTimeout(() => setMoreOpen(false), 200)}
                    className={`relative px-3 py-2 text-sm font-medium transition-colors rounded-md flex items-center gap-1 ${
                      isMoreActive
                        ? 'text-cricket-gold'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    More
                    <ChevronDown size={14} className={`transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {moreOpen && (
                    <div className="absolute top-full right-0 mt-1 bg-gray-900 border border-gray-800 rounded-lg shadow-xl py-1 min-w-[160px]">
                      {moreNav.map((link) => (
                        <Link
                          key={link.name}
                          to={link.path}
                          onClick={() => setMoreOpen(false)}
                          className={`block px-4 py-2 text-sm transition-colors ${
                            isActive(link.path)
                              ? 'text-cricket-gold bg-cricket-gold/10'
                              : 'text-gray-300 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
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
                  <span>Player Login</span>
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
            isMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-cricket-dark border-t border-cricket-border px-4 py-4 space-y-1">
            {primaryNav.map((link) => (
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
            <div className="border-t border-cricket-border pt-2 mt-2">
              <p className="px-4 py-1 text-xs text-gray-500 uppercase tracking-wider">More</p>
              {moreNav.map((link) => (
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
            </div>

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
                  Player Login
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
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link to="/" className="flex items-center gap-2.5 mb-4">
                <img src="/logo.jpg" alt="Cricket Pagla" className="h-9 w-9 object-contain rounded-full border-2 border-cricket-gold/60" />
                <span className="font-bold text-lg text-white uppercase tracking-tight">Cricket Pagla</span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                {siteSettings?.aboutText?.slice(0, 150) || "More than cricket — it's a family. Passion, performance, and brotherhood on and off the field."}
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
                  { name: 'Statistics', path: '/statistics' },
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
                  { name: 'Gallery', path: '/gallery' },
                  { name: 'Notices', path: '/notices' },
                  { name: 'Player of the Month', path: '/player-of-the-month' },
                ].map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-gray-400 hover:text-cricket-gold text-sm transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Social */}
            <div>
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Connect</h3>
              <div className="space-y-2.5">
                {siteSettings?.contactEmail && (
                  <a href={`mailto:${siteSettings.contactEmail}`} className="flex items-center gap-2 text-gray-400 hover:text-cricket-gold text-sm transition-colors">
                    <Mail size={14} /> {siteSettings.contactEmail}
                  </a>
                )}
                {siteSettings?.contactPhone && (
                  <a href={`tel:${siteSettings.contactPhone}`} className="flex items-center gap-2 text-gray-400 hover:text-cricket-gold text-sm transition-colors">
                    <Phone size={14} /> {siteSettings.contactPhone}
                  </a>
                )}
                {siteSettings?.contactAddress && (
                  <p className="flex items-center gap-2 text-gray-400 text-sm">
                    <MapPin size={14} className="flex-shrink-0" /> {siteSettings.contactAddress}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 mt-4">
                {siteSettings?.facebookUrl && (
                  <a href={siteSettings.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-800 hover:bg-cricket-gold/20 flex items-center justify-center text-gray-400 hover:text-cricket-gold transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                )}
                {siteSettings?.instagramUrl && (
                  <a href={siteSettings.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-800 hover:bg-cricket-gold/20 flex items-center justify-center text-gray-400 hover:text-cricket-gold transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </a>
                )}
                {siteSettings?.youtubeUrl && (
                  <a href={siteSettings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-800 hover:bg-cricket-gold/20 flex items-center justify-center text-gray-400 hover:text-cricket-gold transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                )}
                {siteSettings?.whatsappNumber && (
                  <a href={`https://wa.me/${siteSettings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-800 hover:bg-cricket-gold/20 flex items-center justify-center text-gray-400 hover:text-cricket-gold transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="py-6 border-t border-cricket-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Cricket Pagla. All rights reserved.
            </p>
            <p className="text-gray-600 text-xs tracking-widest uppercase">
              {siteSettings?.heroSubtitle || 'Passion • Performance • Brotherhood'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
