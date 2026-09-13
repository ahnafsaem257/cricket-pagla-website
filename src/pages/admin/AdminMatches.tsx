import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { getMatches, deleteMatch } from '../../services/matches/matchService';
import type { Match } from '../../types';

export const AdminMatches: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const data = await getMatches();
      setMatches(data);
    } catch (error) {
      console.error("Error fetching matches", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this match?")) {
      try {
        await deleteMatch(id);
        setMatches(matches.filter(m => m.matchId !== id));
      } catch (error) {
        console.error("Error deleting match", error);
        alert("Failed to delete match");
      }
    }
  };

  const filteredMatches = matches.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.teamA.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.teamB.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Manage Matches</h1>
        <Link 
          to="/admin/matches/add" 
          className="flex items-center gap-2 bg-cricket-green hover:bg-[#0c6632] text-white px-4 py-2 rounded-md transition-colors"
        >
          <Plus size={20} />
          <span>Add Match</span>
        </Link>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search matches..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs text-gray-400 uppercase bg-gray-800 border-b border-gray-700">
              <tr>
                <th className="px-4 py-3">Match</th>
                <th className="px-4 py-3 hidden sm:table-cell">Date & Time</th>
                <th className="px-4 py-3 hidden md:table-cell">Type</th>
                <th className="px-4 py-3 hidden sm:table-cell">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">Loading matches...</td>
                </tr>
              ) : filteredMatches.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">No matches found.</td>
                </tr>
              ) : (
                filteredMatches.map((match) => (
                  <tr key={match.matchId} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="px-4 py-3">
                      <div className="font-bold text-white mb-1 truncate">{match.title}</div>
                      <div className="text-xs text-gray-500">{match.teamA} vs {match.teamB}</div>
                      <div className="text-xs text-gray-500 sm:hidden mt-0.5">{match.date}</div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <CalendarIcon size={14} className="text-gray-500" />
                        <span>{match.date} {match.time && `| ${match.time}`}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">{match.matchType}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        match.status === 'Completed' ? 'bg-green-900/50 text-green-400 border border-green-800' :
                        match.status === 'Live' ? 'bg-red-900/50 text-red-400 border border-red-800' :
                        match.status === 'Upcoming' ? 'bg-blue-900/50 text-blue-400 border border-blue-800' :
                        'bg-gray-800 text-gray-400 border border-gray-700'
                      }`}>
                        {match.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <Link 
                          to={`/admin/matches/edit/${match.matchId}`}
                          className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-md transition-colors"
                        >
                          <Edit size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(match.matchId)}
                          className="p-2 text-red-400 hover:bg-red-900/30 rounded-md transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
