import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { createUserByAdmin } from '../../services/users/userService';
import type { UserRole } from '../../types';

const ROLES: UserRole[] = ['ADMIN', 'PLAYER', 'MANAGEMENT'];

export const UserForm: React.FC = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'PLAYER' as UserRole,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      await createUserByAdmin(formData.name, formData.email, formData.role);
      navigate('/admin/users');
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to create user');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/users" className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-white">Add New User</h1>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Full Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Mohammad Rahman"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. user@example.com"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Role *</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green"
            >
              {ROLES.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <p className="text-xs text-gray-500">
            Note: This creates a user profile. The user needs to register separately to set their password.
          </p>
        </div>

        <div className="p-4 bg-gray-800/50 border-t border-gray-800 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
          <Link to="/admin/users" className="px-6 py-2.5 rounded-md font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors text-center">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-cricket-green hover:bg-[#0c6632] text-white px-6 py-2.5 rounded-md font-medium transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
};
