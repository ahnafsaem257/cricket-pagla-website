import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X, ArrowLeft } from 'lucide-react';
import { getTeamById, createTeam, updateTeam } from '../../services/teams/teamService';
import { getActivePlayers } from '../../services/players/playerService';
import { uploadImage } from '../../services/firebase/storage';
import type { Player } from '../../types';

export const TeamForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [captain, setCaptain] = useState('');
  const [viceCaptain, setViceCaptain] = useState('');
  const [logo, setLogo] = useState('');
  const [active, setActive] = useState(true);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [playerSearch, setPlayerSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getActivePlayers().then(setAllPlayers).catch(() => {});
    if (id) {
      getTeamById(id).then(team => {
        if (team) {
          setName(team.name);
          setShortName(team.shortName || '');
          setCaptain(team.captain || '');
          setViceCaptain(team.viceCaptain || '');
          setLogo(team.logo || '');
          setActive(team.active);
          setSelectedPlayerIds(team.playerIds || []);
        }
      });
    }
  }, [id]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, `teams/${Date.now()}`);
      setLogo(url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const togglePlayer = (playerId: string) => {
    setSelectedPlayerIds(prev =>
      prev.includes(playerId) ? prev.filter(id => id !== playerId) : [...prev, playerId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Team name is required'); return; }
    setSaving(true);
    setError('');

    try {
      const teamData = {
        name: name.trim(),
        shortName: shortName.trim() || undefined,
        captain: captain || undefined,
        viceCaptain: viceCaptain || undefined,
        logo: logo || undefined,
        active,
        playerIds: selectedPlayerIds,
        wins: 0, losses: 0, draws: 0, noResult: 0, points: 0,
      };

      if (isEdit && id) {
        await updateTeam(id, teamData);
      } else {
        await createTeam(teamData);
      }
      navigate('/admin/teams');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save team');
    } finally {
      setSaving(false);
    }
  };

  const filteredPlayers = allPlayers.filter(p =>
    p.fullName.toLowerCase().includes(playerSearch.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit Team' : 'Create Team'}</h1>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900 border border-gray-800 rounded-xl p-6">
        {/* Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Team Logo</label>
          <div className="flex items-center gap-4">
            {logo && (
              <div className="relative">
                <img src={logo} alt="Logo" className="w-16 h-16 rounded-lg object-contain bg-gray-800" />
                <button type="button" onClick={() => setLogo('')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5">
                  <X size={12} />
                </button>
              </div>
            )}
            <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 border border-gray-700 transition-colors">
              <Upload size={16} />
              {uploading ? 'Uploading...' : 'Upload Logo'}
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={uploading} />
            </label>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Team Name *</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required
            className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cricket-gold" />
        </div>

        {/* Short Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Short Name</label>
          <input type="text" value={shortName} onChange={e => setShortName(e.target.value)}
            className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cricket-gold" />
        </div>

        {/* Captain & Vice Captain */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Captain</label>
            <input type="text" value={captain} onChange={e => setCaptain(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cricket-gold" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Vice Captain</label>
            <input type="text" value={viceCaptain} onChange={e => setViceCaptain(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cricket-gold" />
          </div>
        </div>

        {/* Active Toggle */}
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setActive(!active)}
            className={`relative w-11 h-6 rounded-full transition-colors ${active ? 'bg-cricket-gold' : 'bg-gray-700'}`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${active ? 'left-6' : 'left-1'}`} />
          </button>
          <span className="text-sm text-gray-300">Active Team</span>
        </div>

        {/* Players */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Assign Players ({selectedPlayerIds.length} selected)</label>
          <input type="text" placeholder="Search players..." value={playerSearch} onChange={e => setPlayerSearch(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm mb-2 focus:outline-none focus:border-cricket-gold" />
          <div className="max-h-60 overflow-y-auto bg-gray-800/50 rounded-lg border border-gray-700">
            {filteredPlayers.map(player => (
              <label key={player.playerId} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-700/50 cursor-pointer border-b border-gray-700/30 last:border-0">
                <input
                  type="checkbox"
                  checked={selectedPlayerIds.includes(player.playerId)}
                  onChange={() => togglePlayer(player.playerId)}
                  className="rounded border-gray-600 bg-gray-800 text-cricket-gold focus:ring-cricket-gold"
                />
                <span className="text-white text-sm">{player.fullName}</span>
                <span className="text-gray-500 text-xs ml-auto">{player.playingRole}</span>
              </label>
            ))}
            {filteredPlayers.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">No players found</p>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="flex-1 bg-cricket-gold hover:bg-cricket-gold-light text-cricket-dark font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50">
            {saving ? 'Saving...' : isEdit ? 'Update Team' : 'Create Team'}
          </button>
          <button type="button" onClick={() => navigate('/admin/teams')}
            className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
