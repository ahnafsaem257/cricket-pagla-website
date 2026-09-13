import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { getMatchById, createMatch, updateMatch } from '../../services/matches/matchService';
import type { Match } from '../../types';

export const MatchForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<Partial<Match>>({
    title: '',
    date: '',
    time: '',
    venue: '',
    teamA: 'Cricket Pagla',
    teamB: '',
    competition: '',
    matchType: 'T20',
    tossWinner: '',
    tossDecision: 'Bat',
    status: 'Upcoming',
    published: false,
    winner: '',
    resultSummary: '',
    teamAScore: 0,
    teamAOvers: 0,
    teamAWickets: 0,
    teamBScore: 0,
    teamBOvers: 0,
    teamBWickets: 0,
    manOfTheMatch: '',
    description: ''
  });

  useEffect(() => {
    if (isEditing && id) {
      getMatchById(id).then(data => {
        if (data) {
          setFormData(data);
        } else {
          setError("Match not found");
        }
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setError("Error loading match");
        setLoading(false);
      });
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (isEditing && id) {
        await updateMatch(id, formData);
      } else {
        await createMatch(formData as any);
      }
      navigate('/admin/matches');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save match');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/matches" className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-white">{isEditing ? 'Edit Match' : 'Add New Match'}</h1>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 space-y-8">
          
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4 pb-2 border-b border-gray-800">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-1">Match Title *</label>
                <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="e.g. Final vs Team X" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Date *</label>
                <input type="date" name="date" required value={formData.date} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Time</label>
                <input type="time" name="time" value={formData.time} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Venue *</label>
                <input type="text" name="venue" required value={formData.venue} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Match Type</label>
                <select name="matchType" value={formData.matchType} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green">
                  <option value="T20">T20</option>
                  <option value="ODI">ODI</option>
                  <option value="Test">Test</option>
                  <option value="Friendly">Friendly</option>
                  <option value="Practice">Practice</option>
                  <option value="Tournament">Tournament</option>
                  <option value="Series">Series</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Team A</label>
                <input type="text" name="teamA" value={formData.teamA} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Team B (Opponent)</label>
                <input type="text" name="teamB" required value={formData.teamB} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green">
                  <option value="Upcoming">Upcoming</option>
                  <option value="Live">Live</option>
                  <option value="Completed">Completed</option>
                  <option value="Postponed">Postponed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex items-center mt-6">
                <input type="checkbox" id="published" name="published" checked={formData.published} onChange={handleChange} className="h-4 w-4 text-cricket-green focus:ring-cricket-green border-gray-700 rounded bg-gray-800" />
                <label htmlFor="published" className="ml-2 block text-sm text-gray-400">Publish this match to public?</label>
              </div>
            </div>
          </div>

          {/* Results Info (Only if completed) */}
          {(formData.status === 'Completed' || formData.status === 'Live') && (
            <div>
              <h3 className="text-lg font-medium text-white mb-4 pb-2 border-b border-gray-800">Match Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Team A Score */}
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 space-y-4">
                  <h4 className="font-bold text-cricket-gold">{formData.teamA} Score</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Runs</label>
                      <input type="number" name="teamAScore" value={formData.teamAScore} onChange={handleChange} className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Wickets</label>
                      <input type="number" name="teamAWickets" value={formData.teamAWickets} onChange={handleChange} max="10" min="0" className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Overs</label>
                      <input type="number" step="0.1" name="teamAOvers" value={formData.teamAOvers} onChange={handleChange} className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none" />
                    </div>
                  </div>
                </div>

                {/* Team B Score */}
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 space-y-4">
                  <h4 className="font-bold text-cricket-gold">{formData.teamB || 'Team B'} Score</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Runs</label>
                      <input type="number" name="teamBScore" value={formData.teamBScore} onChange={handleChange} className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Wickets</label>
                      <input type="number" name="teamBWickets" value={formData.teamBWickets} onChange={handleChange} max="10" min="0" className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Overs</label>
                      <input type="number" step="0.1" name="teamBOvers" value={formData.teamBOvers} onChange={handleChange} className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none" />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Result Summary</label>
                    <input type="text" name="resultSummary" placeholder="e.g. Cricket Pagla won by 14 runs" value={formData.resultSummary} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Man of the Match</label>
                    <input type="text" name="manOfTheMatch" value={formData.manOfTheMatch} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1">Description / Match Report</label>
            <textarea name="description" rows={4} value={formData.description} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green" />
          </div>

        </div>
        
        <div className="p-4 bg-gray-800/50 border-t border-gray-800 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
          <Link to="/admin/matches" className="px-6 py-2.5 rounded-md font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors text-center">
            Cancel
          </Link>
          <button type="submit" disabled={saving} className="flex items-center justify-center gap-2 bg-cricket-green hover:bg-[#0c6632] text-white px-6 py-2.5 rounded-md font-medium transition-colors disabled:opacity-50">
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Match'}
          </button>
        </div>
      </form>
    </div>
  );
};
