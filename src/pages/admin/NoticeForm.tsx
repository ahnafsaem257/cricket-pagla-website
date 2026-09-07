import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { getNoticeById, createNotice, updateNotice } from '../../services/notices/noticeService';
import type { Notice } from '../../types';

const CATEGORIES: Notice['category'][] = ['General', 'Match', 'Training', 'Tournament', 'Meeting', 'Important'];
const PRIORITIES: Notice['priority'][] = ['Normal', 'Important', 'Urgent'];

export const NoticeForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<Partial<Notice>>({
    title: '',
    description: '',
    category: 'General',
    priority: 'Normal',
    date: new Date().toISOString().split('T')[0],
    status: 'published',
  });

  useEffect(() => {
    if (isEditing && id) {
      getNoticeById(id).then(data => {
        if (data) {
          setFormData(data);
        } else {
          setError('Notice not found');
        }
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setError('Error loading notice');
        setLoading(false);
      });
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (isEditing && id) {
        await updateNotice(id, formData);
      } else {
        await createNotice(formData as any);
      }
      navigate('/admin/notices');
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to save notice');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/notices" className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-white">{isEditing ? 'Edit Notice' : 'Post New Notice'}</h1>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Notice Title *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Practice cancelled tomorrow"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Description *</label>
            <textarea
              name="description"
              required
              rows={5}
              value={formData.description}
              onChange={handleChange}
              placeholder="Write the full notice details here..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green"
              >
                {PRIORITIES.map(pri => (
                  <option key={pri} value={pri}>{pri}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Date *</label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center">
              <input
                type="radio"
                id="published"
                name="status"
                value="published"
                checked={formData.status === 'published'}
                onChange={handleChange}
                className="h-4 w-4 text-cricket-green focus:ring-cricket-green border-gray-700 bg-gray-800"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-400">Publish to public</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="draft"
                name="status"
                value="draft"
                checked={formData.status === 'draft'}
                onChange={handleChange}
                className="h-4 w-4 text-cricket-green focus:ring-cricket-green border-gray-700 bg-gray-800"
              />
              <label htmlFor="draft" className="ml-2 block text-sm text-gray-400">Save as draft</label>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-800/50 border-t border-gray-800 flex justify-end gap-4">
          <Link to="/admin/notices" className="px-6 py-2 rounded-md font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-cricket-green hover:bg-[#0c6632] text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Saving...' : 'Save Notice'}
          </button>
        </div>
      </form>
    </div>
  );
};