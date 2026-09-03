import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { getPlayerById, createPlayer, updatePlayer } from '../../services/players/playerService';
import { ImageUploader } from '../../components/ui/ImageUploader';
import type { Player } from '../../types';

export const PlayerForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<Partial<Player>>({
    fullName: '',
    nickname: '',
    jerseyNumber: null,
    playingRole: 'Batsman',
    battingStyle: 'Right Hand',
    bowlingStyle: 'Right Arm Medium',
    status: 'Active',
    joiningDate: new Date().toISOString().split('T')[0],
    profilePhoto: '',
    team: 'Cricket Pagla',
    phone: '',
    address: '',
    emergencyContact: '',
    bloodGroup: '',
    bio: ''
  });

  useEffect(() => {
    if (isEditing && id) {
      getPlayerById(id).then(data => {
        if (data) {
          setFormData(data);
        } else {
          setError("Player not found");
        }
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setError("Error loading player");
        setLoading(false);
      });
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'jerseyNumber' ? (value === '' ? null : parseInt(value) || 0) : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (isEditing && id) {
        await updatePlayer(id, formData);
      } else {
        await createPlayer(formData as any);
      }
      navigate('/admin/players');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save player');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/players" className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-white">{isEditing ? 'Edit Player' : 'Add New Player'}</h1>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column - Photo */}
          <div className="md:col-span-1 space-y-4">
            <label className="block text-sm font-medium text-gray-400">Profile Photo</label>
            <ImageUploader 
              storagePath="players"
              defaultImage={formData.profilePhoto}
              onUploadSuccess={(url) => setFormData(prev => ({ ...prev, profilePhoto: url }))}
              onUploadError={(err) => setError(err?.message || 'Image upload failed. Please try again.')}
            />
          </div>

          {/* Right Column - Form Fields */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">Full Name *</label>
              <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Nickname</label>
              <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Jersey Number</label>
              <input type="number" name="jerseyNumber" value={formData.jerseyNumber ?? ''} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Playing Role</label>
              <select name="playingRole" value={formData.playingRole} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green">
                <option value="Batsman">Batsman</option>
                <option value="Bowler">Bowler</option>
                <option value="All-Rounder">All-Rounder</option>
                <option value="Wicket Keeper">Wicket Keeper</option>
                <option value="Unspecified">Unspecified</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Batting Style</label>
              <select name="battingStyle" value={formData.battingStyle ?? ''} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green">
                <option value="">Not Set</option>
                <option value="Right Hand">Right Hand</option>
                <option value="Left Hand">Left Hand</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Bowling Style</label>
              <select name="bowlingStyle" value={formData.bowlingStyle ?? ''} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green">
                <option value="">Not Set</option>
                <option value="Right Arm Fast">Right Arm Fast</option>
                <option value="Right Arm Medium">Right Arm Medium</option>
                <option value="Right Arm Spin">Right Arm Spin</option>
                <option value="Left Arm Fast">Left Arm Fast</option>
                <option value="Left Arm Medium">Left Arm Medium</option>
                <option value="Left Arm Spin">Left Arm Spin</option>
                <option value="Off Spin">Off Spin</option>
                <option value="Leg Spin">Leg Spin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Injured">Injured</option>
                <option value="Retired">Retired</option>
              </select>
            </div>

            <div className="sm:col-span-2 pt-4 border-t border-gray-800">
              <h3 className="text-md font-medium text-white mb-4">Private Information</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Blood Group</label>
              <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">Bio</label>
              <textarea name="bio" rows={3} value={formData.bio} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green" />
            </div>

          </div>
        </div>
        
        <div className="p-4 bg-gray-800/50 border-t border-gray-800 flex justify-end gap-4">
          <Link to="/admin/players" className="px-6 py-2 rounded-md font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
            Cancel
          </Link>
          <button type="submit" disabled={saving} className="flex items-center gap-2 bg-cricket-green hover:bg-[#0c6632] text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50">
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Player'}
          </button>
        </div>
      </form>
    </div>
  );
};
