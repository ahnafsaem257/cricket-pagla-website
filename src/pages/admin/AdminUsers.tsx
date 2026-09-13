import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Trash2, UserCheck, UserX, Filter } from 'lucide-react';
import { getUsers, updateUserStatus, updateUserRole, deleteUser } from '../../services/users/userService';
import type { User, UserRole, UserStatus } from '../../types';

const ALL_ROLES: (UserRole | 'All')[] = ['All', 'ADMIN', 'PLAYER', 'MANAGEMENT'];
const ALL_STATUSES: (UserStatus | 'All')[] = ['All', 'ACTIVE', 'INACTIVE', 'DISABLED'];

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'All'>('All');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusToggle = async (uid: string, currentStatus: UserStatus) => {
    const newStatus: UserStatus = currentStatus === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    if (!window.confirm(`Are you sure you want to ${newStatus === 'ACTIVE' ? 'enable' : 'disable'} this user?`)) return;
    try {
      await updateUserStatus(uid, newStatus);
      setUsers(users.map(u => u.uid === uid ? { ...u, status: newStatus } : u));
    } catch (error) {
      console.error("Error updating user status", error);
      alert("Failed to update user status");
    }
  };

  const handleRoleChange = async (uid: string, newRole: UserRole) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    try {
      await updateUserRole(uid, newRole);
      setUsers(users.map(u => u.uid === uid ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error("Error updating user role", error);
      alert("Failed to update user role");
    }
  };

  const handleDelete = async (uid: string) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      await deleteUser(uid);
      setUsers(users.filter(u => u.uid !== uid));
    } catch (error) {
      console.error("Error deleting user", error);
      alert("Failed to delete user");
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesStatus && matchesSearch;
  });

  const roleCounts = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Manage Users ({users.length})</h1>
        <Link
          to="/admin/users/add"
          className="flex items-center gap-2 bg-cricket-green hover:bg-[#0c6632] text-white px-4 py-2 rounded-md transition-colors"
        >
          <Plus size={20} />
          <span>Add User</span>
        </Link>
      </div>

      {/* Role Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {ALL_ROLES.filter(r => r !== 'All').map(role => (
          <button
            key={role}
            onClick={() => setRoleFilter(roleFilter === role ? 'All' : role)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              roleFilter === role
                ? 'bg-cricket-gold text-cricket-dark'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {role}
            <span className="ml-1 opacity-70">{roleCounts[role] || 0}</span>
          </button>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cricket-green"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as UserStatus | 'All')}
                className="bg-gray-800 border border-gray-700 rounded-md text-white text-sm px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-cricket-green"
              >
                {ALL_STATUSES.map(s => (
                  <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
                ))}
              </select>
            </div>
            <span className="text-sm text-gray-400">{filteredUsers.length} results</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs text-gray-400 uppercase bg-gray-800 border-b border-gray-700">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3 hidden sm:table-cell">Role</th>
                <th className="px-4 py-3 hidden md:table-cell">Status</th>
                <th className="px-4 py-3 hidden lg:table-cell">Joined</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">Loading users...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">No users found.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.uid} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
                          {user.profilePhoto ? (
                            <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-cricket-gold font-bold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-white truncate">{user.name}</div>
                          <div className="text-xs text-gray-500 truncate sm:hidden">{user.role} · {user.status}</div>
                          <div className="text-xs text-gray-500 truncate hidden sm:block">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.uid, e.target.value as UserRole)}
                        className={`px-2 py-1 text-xs rounded-md border ${
                          user.role === 'ADMIN' ? 'bg-red-900/50 text-red-400 border-red-800' :
                          user.role === 'PLAYER' ? 'bg-green-900/50 text-green-400 border-green-800' :
                          'bg-blue-900/50 text-blue-400 border-blue-800'
                        } focus:outline-none focus:ring-1 focus:ring-cricket-gold`}
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="PLAYER">PLAYER</option>
                        <option value="MANAGEMENT">MANAGEMENT</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.status === 'ACTIVE' ? 'bg-green-900/50 text-green-400 border border-green-800' :
                        user.status === 'DISABLED' ? 'bg-red-900/50 text-red-400 border border-red-800' :
                        'bg-gray-800 text-gray-400 border border-gray-700'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs hidden lg:table-cell">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <button
                          onClick={() => handleStatusToggle(user.uid, user.status)}
                          className={`p-2 rounded-md transition-colors ${
                            user.status === 'ACTIVE'
                              ? 'text-yellow-400 hover:bg-yellow-900/30'
                              : 'text-green-400 hover:bg-green-900/30'
                          }`}
                          title={user.status === 'ACTIVE' ? 'Disable user' : 'Enable user'}
                        >
                          {user.status === 'ACTIVE' ? <UserX size={18} /> : <UserCheck size={18} />}
                        </button>
                        <button
                          onClick={() => handleDelete(user.uid)}
                          className="p-2 text-red-400 hover:bg-red-900/30 rounded-md transition-colors"
                          title="Delete user"
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
