import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { getPlayers } from '../../services/players/playerService';
import { createPlayerOfMonth, updatePlayerOfMonth, getPlayerOfMonthById } from '../../services/playerOfMonth/playerOfMonthService';
import { ImageUploader } from '../../components/ui/ImageUploader';
import type { Player, PlayerOfMonth } from '../../types';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const PlayerOfMonthForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);

  const currentYear = new Date().getFullYear();
  const currentMonth = MONTHS[new Date().getMonth()];

  const [formData, setFormData] = useState<Partial<PlayerOfMonth>>({
    month: currentMonth,
    year: currentYear,
    playerId: '',
    playerName: '',
    playerPhoto: '',
    team: '',
    role: '',
    runs: 0,
    wickets: 0,
    catches: 0,
    runOuts: 0,
    totalPoints: 0,
    description: '',
    published: true,
  });

  useEffect(() => {
    getPlayers().then(data => setPlayers(data.filter(p => p.status === 'Active')));
    if (isEdit && id) {
      getPlayerOfMonthById(id)
        .then(data => { if (data) setFormData(data); setLoading(false); })
        .catch(() => { setError('Record not found'); setLoading(false); });
    }
  }, [id, isEdit]);

  const handlePlayerSelect = (playerId: string) => {
    const player = players.find(p => p.playerId === playerId);
    if (player) {
      setFormData(prev => ({
        ...prev,
        playerId: player.playerId,
        playerName: player.fullName,
        playerPhoto: player.profilePhoto || '',
        team: player.team || 'Cricket Pagla',
        role: player.playingRole,
      }));
    }
  };

  const calcPoints = (runs: number, wickets: number, catches: number, runOuts: number) => {
    return (runs || 0) + (wickets || 0) * 5 + (catches || 0) * 2 + (runOuts || 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const numFields = ['runs', 'wickets', 'catches', 'runOuts', 'totalPoints', 'year'];
    const val = numFields.includes(name) ? (value === '' ? 0 : parseInt(value) || 0) : value;
    setFormData(prev => {
      const updated = { ...prev, [name]: val };
      if (['runs', 'wickets', 'catches', 'runOuts'].includes(name)) {
        updated.totalPoints = calcPoints(
          name === 'runs' ? val as number : (prev.runs || 0),
          name === 'wickets' ? val as number : (prev.wickets || 0),
          name === 'catches' ? val as number : (prev.catches || 0),
          name === 'runOuts' ? val as number : (prev.runOuts || 0)
        );
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      if (isEdit && id) {
        await updatePlayerOfMonth(id, formData);
        setSuccess('Updated successfully!');
      } else {
        await createPlayerOfMonth(formData as Omit<PlayerOfMonth, 'id' | 'createdAt' | 'updatedAt'>);
        setSuccess('Created successfully!');
        setTimeout(() => navigate('/admin/player-of-the-month'), 1000);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-cricket-gold border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit' : 'Add'} Player of the Month</h1>
          <p className="text-gray-400 text-sm mt-1">Recognize outstanding monthly performance</p>
        </div>
      </div>

      {error && <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">{error}</div>}
      {success && <div className="bg-emerald-900/50 border border-emerald-500 text-emerald-200 px-4 py-3 rounded-lg text-sm">{success}</div>}

      <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Month *</label>
            <select name="month" value={formData.month || ''} onChange={handleChange} required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cricket-gold">
              {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Year *</label>
            <input type="number" name="year" value={formData.year || currentYear} onChange={handleChange} required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cricket-gold" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Select Player *</label>
          <select
            value={formData.playerId || ''}
            onChange={(e) => handlePlayerSelect(e.target.value)}
            required
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cricket-gold"
          >
            <option value="">-- Select Player --</option>
            {players.map(p => (
              <option key={p.playerId} value={p.playerId}>{p.fullName} ({p.playingRole})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Profile Photo</label>
          <ImageUploader
            storagePath="player-of-month"
            defaultImage={formData.playerPhoto}
            onUploadSuccess={(url) => setFormData(prev => ({ ...prev, playerPhoto: url }))}
            onUploadError={(err) => setError(err?.message || 'Image upload failed')}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Runs</label>
            <input type="number" name="runs" value={formData.runs || 0} onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cricket-gold" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Wickets</label>
            <input type="number" name="wickets" value={formData.wickets || 0} onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cricket-gold" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Catches</label>
            <input type="number" name="catches" value={formData.catches || 0} onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cricket-gold" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Run Outs</label>
            <input type="number" name="runOuts" value={formData.runOuts || 0} onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cricket-gold" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Total Points (auto-calculated)</label>
          <input type="number" name="totalPoints" value={formData.totalPoints || 0} readOnly
            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-cricket-gold text-sm font-bold cursor-not-allowed" />
          <p className="text-gray-600 text-xs mt-1">1 run = 1pt | 1 wicket = 5pt | 1 catch = 2pt | 1 run out = 1pt</p>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Description</label>
          <textarea name="description" rows={3} value={formData.description || ''} onChange={handleChange}
            placeholder="Why was this player selected?"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cricket-gold resize-none" />
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="published" checked={formData.published ?? true} onChange={e => setFormData(prev => ({ ...prev, published: e.target.checked }))}
              className="w-4 h-4 text-cricket-gold bg-gray-800 border-gray-700 rounded" />
            <span className="text-sm text-gray-300">Publish</span>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-800">
          <button type="button" onClick={() => navigate(-1)}
            className="px-4 py-2.5 text-gray-400 hover:text-white transition-colors text-sm text-center">Cancel</button>
          <button type="submit" disabled={saving}
            className="flex items-center justify-center gap-2 bg-cricket-gold text-cricket-dark px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-cricket-gold-light transition-colors disabled:opacity-50">
            <Save size={16} /> {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};
