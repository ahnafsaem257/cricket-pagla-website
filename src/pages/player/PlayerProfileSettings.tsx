import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getPlayerByUserId, updatePlayer } from '../../services/players/playerService';
import { ImageUploader } from '../../components/ui/ImageUploader';
import type { Player } from '../../types';

export const PlayerProfileSettings: React.FC = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [player, setPlayer] = useState<Player | null>(null);

  const [formData, setFormData] = useState<Partial<Player>>({});

  useEffect(() => {
    if (currentUser) {
      getPlayerByUserId(currentUser.uid)
        .then(data => {
          if (data) {
            setPlayer(data);
            setFormData(data);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError("Error loading player profile");
          setLoading(false);
        });
    }
  }, [currentUser]);

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
    setSuccessMessage('');
    setSaving(true);

    try {
      if (player && player.playerId) {
        // Only allow updating certain fields for security
        const updates = {
          fullName: formData.fullName,
          nickname: formData.nickname,
          jerseyNumber: formData.jerseyNumber,
          playingRole: formData.playingRole,
          battingStyle: formData.battingStyle,
          bowlingStyle: formData.bowlingStyle,
          phone: formData.phone,
          address: formData.address,
          emergencyContact: formData.emergencyContact,
          bloodGroup: formData.bloodGroup,
          bio: formData.bio,
          profilePhoto: formData.profilePhoto,
        };
        await updatePlayer(player.playerId, updates);
        setSuccessMessage('Profile updated successfully!');
      } else {
        setError('Player profile not found. Please contact admin.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white p-8">Loading profile...</div>;

  if (!player) return <div className="text-white p-8">No player profile linked to your account.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded-md text-sm">
          {successMessage}
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
              <input type="text" name="fullName" required value={formData.fullName || ''} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Nickname</label>
              <input type="text" name="nickname" value={formData.nickname || ''} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Jersey Number</label>
              <input type="number" name="jerseyNumber" value={formData.jerseyNumber ?? ''} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Playing Role</label>
              <select name="playingRole" value={formData.playingRole || ''} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green">
                <option value="Batsman">Batsman</option>
                <option value="Bowler">Bowler</option>
                <option value="All-Rounder">All-Rounder</option>
                <option value="Wicket Keeper">Wicket Keeper</option>
                <option value="Unspecified">Unspecified</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Batting Style</label>
              <select name="battingStyle" value={formData.battingStyle || ''} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green">
                <option value="">Not Set</option>
                <option value="Right Hand">Right Hand</option>
                <option value="Left Hand">Left Hand</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Bowling Style</label>
              <select name="bowlingStyle" value={formData.bowlingStyle || ''} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green">
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

            <div className="sm:col-span-2 pt-4 border-t border-gray-800">
              <h3 className="text-md font-medium text-white mb-4">Contact Information</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
              <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Blood Group</label>
              <input type="text" name="bloodGroup" value={formData.bloodGroup || ''} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
              <input type="text" name="address" value={formData.address || ''} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">Emergency Contact</label>
              <input type="text" name="emergencyContact" value={formData.emergencyContact || ''} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green" />
            </div>

            <div className="sm:col-span-2 pt-4 border-t border-gray-800">
              <h3 className="text-md font-medium text-white mb-4">About Me</h3>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">Bio</label>
              <textarea name="bio" rows={3} value={formData.bio || ''} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green" />
            </div>

          </div>
        </div>
        
        <div className="p-4 bg-gray-800/50 border-t border-gray-800 flex justify-end gap-4">
          <button type="submit" disabled={saving} className="flex items-center gap-2 bg-cricket-green hover:bg-[#0c6632] text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50">
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};
