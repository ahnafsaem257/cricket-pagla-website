import React, { useState, useEffect } from 'react';
import { Save, Globe, Phone, Mail, MapPin } from 'lucide-react';
import { getSiteSettings, updateSiteSettings } from '../../services/site/siteService';
import { getClubStats, updateClubStats } from '../../services/site/siteService';
import type { SiteSettings, ClubStats } from '../../types';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [stats, setStats] = useState<ClubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    Promise.all([getSiteSettings(), getClubStats()])
      .then(([s, cs]) => {
        setSettings(s ?? {
          id: 'main',
          heroTitle: 'Cricket Pagla',
          heroSubtitle: 'Passion • Performance • Brotherhood',
          heroImage: '',
          heroCtaText: '',
          heroCtaLink: '',
          heroSecondaryCtaText: '',
          heroSecondaryCtaLink: '',
          aboutTitle: 'About Cricket Pagla',
          aboutText: '',
          aboutImage: '',
          facebookUrl: '',
          instagramUrl: '',
          youtubeUrl: '',
          whatsappNumber: '',
          contactEmail: '',
          contactPhone: '',
          contactAddress: '',
          clubFounded: '',
          updatedAt: '',
        });
        setStats(cs ?? {
          id: 'main',
          totalPlayers: 0,
          totalMatches: 0,
          totalTournaments: 0,
          yearsActive: 0,
          totalWins: 0,
          updatedAt: '',
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSettingsChange = (field: keyof SiteSettings, value: string) => {
    if (settings) {
      setSettings({ ...settings, [field]: value });
    }
  };

  const handleStatsChange = (field: keyof ClubStats, value: number) => {
    if (stats) {
      setStats({ ...stats, [field]: value });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      if (settings) await updateSiteSettings(settings);
      if (stats) await updateClubStats(stats);
      setMessage('Settings saved successfully!');
    } catch {
      setMessage('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-cricket-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Site Settings</h1>
          <p className="text-gray-400 text-sm mt-1">Manage website content and club statistics</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-cricket-gold text-cricket-dark px-4 py-2 rounded-lg font-bold text-sm hover:bg-cricket-gold-light transition-colors disabled:opacity-50">
          <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-lg text-sm ${message.includes('success') ? 'bg-emerald-900/50 border border-emerald-500 text-emerald-200' : 'bg-red-900/50 border border-red-500 text-red-200'}`}>
          {message}
        </div>
      )}

      {/* Club Stats */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Club Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Total Players</label>
            <input type="number" value={stats?.totalPlayers ?? 0} onChange={e => handleStatsChange('totalPlayers', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cricket-gold" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Total Matches</label>
            <input type="number" value={stats?.totalMatches ?? 0} onChange={e => handleStatsChange('totalMatches', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cricket-gold" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Total Tournaments</label>
            <input type="number" value={stats?.totalTournaments ?? 0} onChange={e => handleStatsChange('totalTournaments', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cricket-gold" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Years Active</label>
            <input type="number" value={stats?.yearsActive ?? 0} onChange={e => handleStatsChange('yearsActive', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cricket-gold" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Total Wins</label>
            <input type="number" value={stats?.totalWins ?? 0} onChange={e => handleStatsChange('totalWins', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cricket-gold" />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Globe size={18} className="text-cricket-gold" /> Hero Section
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Hero Title</label>
            <input type="text" value={settings?.heroTitle ?? 'Cricket Pagla'} onChange={e => handleSettingsChange('heroTitle', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cricket-gold" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Hero Subtitle</label>
            <input type="text" value={settings?.heroSubtitle ?? 'Passion • Performance • Brotherhood'} onChange={e => handleSettingsChange('heroSubtitle', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cricket-gold" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Hero Image URL</label>
            <input type="text" value={settings?.heroImage ?? ''} onChange={e => handleSettingsChange('heroImage', e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cricket-gold" />
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">About Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">About Title</label>
            <input type="text" value={settings?.aboutTitle ?? 'About Cricket Pagla'} onChange={e => handleSettingsChange('aboutTitle', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cricket-gold" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">About Text</label>
            <textarea rows={4} value={settings?.aboutText ?? ''} onChange={e => handleSettingsChange('aboutText', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cricket-gold resize-none" />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Social Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Facebook URL</label>
            <input type="url" value={settings?.facebookUrl ?? ''} onChange={e => handleSettingsChange('facebookUrl', e.target.value)}
              placeholder="https://facebook.com/..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cricket-gold" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Instagram URL</label>
            <input type="url" value={settings?.instagramUrl ?? ''} onChange={e => handleSettingsChange('instagramUrl', e.target.value)}
              placeholder="https://instagram.com/..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cricket-gold" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">YouTube URL</label>
            <input type="url" value={settings?.youtubeUrl ?? ''} onChange={e => handleSettingsChange('youtubeUrl', e.target.value)}
              placeholder="https://youtube.com/..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cricket-gold" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">WhatsApp Number</label>
            <input type="text" value={settings?.whatsappNumber ?? ''} onChange={e => handleSettingsChange('whatsappNumber', e.target.value)}
              placeholder="+880..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cricket-gold" />
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Phone size={18} className="text-cricket-gold" /> Contact Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1 flex items-center gap-1"><Mail size={12} /> Email</label>
            <input type="email" value={settings?.contactEmail ?? ''} onChange={e => handleSettingsChange('contactEmail', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cricket-gold" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1 flex items-center gap-1"><Phone size={12} /> Phone</label>
            <input type="text" value={settings?.contactPhone ?? ''} onChange={e => handleSettingsChange('contactPhone', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cricket-gold" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-400 mb-1 flex items-center gap-1"><MapPin size={12} /> Address</label>
            <input type="text" value={settings?.contactAddress ?? ''} onChange={e => handleSettingsChange('contactAddress', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cricket-gold" />
          </div>
        </div>
      </div>
    </div>
  );
};
