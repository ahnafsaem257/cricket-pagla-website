import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, X } from 'lucide-react';
import { ImageUploader } from '../../components/ui/ImageUploader';
import { getTournamentById, createTournament, updateTournament } from '../../services/tournaments/tournamentService';
import type { Tournament } from '../../types';

const FORMATS: Tournament['format'][] = ['T20', 'ODI', 'Test', 'Friendly', 'Series'];

export const TournamentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [teamInput, setTeamInput] = useState('');

  const [formData, setFormData] = useState<Partial<Tournament>>({
    name: '',
    description: '',
    logo: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    venue: '',
    organizer: '',
    format: 'T20',
    teams: [],
    status: 'Upcoming',
    published: false,
  });

  useEffect(() => {
    if (isEditing && id) {
      getTournamentById(id).then(data => {
        if (data) {
          setFormData(data);
          setTeamInput((data.teams || []).join(', '));
        } else {
          setError('Tournament not found');
        }
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setError('Error loading tournament');
        setLoading(false);
      });
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTeamsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTeamInput(value);
    const teams = value
      .split(',')
      .map(team => team.trim())
      .filter(Boolean);
    setFormData(prev => ({ ...prev, teams }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (isEditing && id) {
        await updateTournament(id, formData);
      } else {
        await createTournament(formData as any);
      }
      navigate('/admin/tournaments');
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to save tournament');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/tournaments" className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-white">{isEditing ? 'Edit Tournament' : 'Add New Tournament'}</h1>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-4">
            <label className="block text-sm font-medium text-gray-400">Tournament Logo</label>
            <ImageUploader
              storagePath="tournaments"
              defaultImage={formData.logo}
              onUploadSuccess={(url) => setFormData(prev => ({ ...prev, logo: url }))}
              onUploadError={(err) => setError(err?.message || 'Logo upload failed. Please try again.')}
            />
          </div>

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">Tournament Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Pagla Premier League 2026"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Start Date *</label>
              <input
                type="date"
                name="startDate"
                required
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Format</label>
              <select
                name="format"
                value={formData.format}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green"
              >
                {FORMATS.map(fmt => (
                  <option key={fmt} value={fmt}>{fmt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Venue</label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="e.g. City Ground"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Organizer</label>
              <input
                type="text"
                name="organizer"
                value={formData.organizer}
                onChange={handleChange}
                placeholder="e.g. Cricket Pagla Committee"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">Participating Teams</label>
              <input
                type="text"
                name="teams"
                value={teamInput}
                onChange={handleTeamsChange}
                placeholder="e.g. Cricket Pagla, Metro Tigers, United CC"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green"
              />
              {formData.teams && formData.teams.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.teams.map(team => (
                    <span
                      key={team}
                      className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-gray-800 text-gray-300 border border-gray-700"
                    >
                      {team}
                      <button
                        type="button"
                        onClick={() => {
                          const next = formData.teams!.filter(t => t !== team);
                          setFormData(prev => ({ ...prev, teams: next }));
                          setTeamInput(next.join(', '));
                        }}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">Separate team names with commas.</p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="About the tournament..."
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green"
              />
            </div>

            <div className="sm:col-span-2 flex items-center">
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={formData.published}
                onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                className="h-4 w-4 text-cricket-green focus:ring-cricket-green border-gray-700 rounded bg-gray-800"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-400">Publish to public?</label>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-800/50 border-t border-gray-800 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
          <Link to="/admin/tournaments" className="px-6 py-2.5 rounded-md font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors text-center">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-cricket-green hover:bg-[#0c6632] text-white px-6 py-2.5 rounded-md font-medium transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Saving...' : 'Save Tournament'}
          </button>
        </div>
      </form>
    </div>
  );
};