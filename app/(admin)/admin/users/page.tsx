'use client';

import { useState, useEffect, useCallback } from 'react';

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  membershipTier: string;
  membershipExpiresAt: string | null;
  avatar: string | null;
  createdAt: string;
  _count: { enrollments: number };
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editRole, setEditRole] = useState('');
  const [editTier, setEditTier] = useState('');

  const fetchUsers = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (roleFilter) params.set('role', roleFilter);
    if (tierFilter) params.set('tier', tierFilter);

    fetch(`/api/admin/users?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setUsers(data.users || []);
        setTotal(data.total || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, roleFilter, tierFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSave = async (userId: string) => {
    await fetch(`/api/admin/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: editRole, membershipTier: editTier }),
    });
    setEditingUser(null);
    fetchUsers();
  };

  const openEdit = (user: User) => {
    setEditingUser(user.id);
    setEditRole(user.role);
    setEditTier(user.membershipTier);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Users</h1>
      <p className="text-muted text-sm mb-8">{total} total users</p>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 max-w-xs px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm placeholder:text-muted focus:outline-none focus:border-accent"
        />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm focus:outline-none focus:border-accent">
          <option value="">All Roles</option>
          <option value="STUDENT">Student</option>
          <option value="INSTRUCTOR">Instructor</option>
          <option value="ADMIN">Admin</option>
        </select>
        <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)} className="px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm focus:outline-none focus:border-accent">
          <option value="">All Tiers</option>
          <option value="FREE">Free</option>
          <option value="BASIC">Basic</option>
          <option value="PRO">Pro</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="glass-card p-8 text-center text-muted">Loading...</div>
      ) : (
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted text-left border-b border-surface-light">
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Tier</th>
                <th className="p-4 font-medium">Enrollments</th>
                <th className="p-4 font-medium">Joined</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-surface-light/50 hover:bg-surface-light/20">
                  <td className="p-4">
                    <p className="text-foreground font-medium">{u.name || 'N/A'}</p>
                  </td>
                  <td className="p-4 text-muted">{u.email}</td>
                  <td className="p-4">
                    {editingUser === u.id ? (
                      <select value={editRole} onChange={(e) => setEditRole(e.target.value)} className="px-2 py-1 bg-surface border border-surface-light rounded-lg text-xs text-foreground">
                        <option value="STUDENT">Student</option>
                        <option value="INSTRUCTOR">Instructor</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        u.role === 'ADMIN' ? 'text-accent bg-accent/10' :
                        u.role === 'INSTRUCTOR' ? 'text-blue-400 bg-blue-400/10' : 'text-muted'
                      }`}>{u.role}</span>
                    )}
                  </td>
                  <td className="p-4">
                    {editingUser === u.id ? (
                      <select value={editTier} onChange={(e) => setEditTier(e.target.value)} className="px-2 py-1 bg-surface border border-surface-light rounded-lg text-xs text-foreground">
                        <option value="FREE">Free</option>
                        <option value="BASIC">Basic</option>
                        <option value="PRO">Pro</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        u.membershipTier === 'PRO' ? 'text-purple-400 bg-purple-400/10' :
                        u.membershipTier === 'BASIC' ? 'text-blue-400 bg-blue-400/10' : 'text-muted'
                      }`}>{u.membershipTier}</span>
                    )}
                  </td>
                  <td className="p-4 text-muted">{u._count.enrollments}</td>
                  <td className="p-4 text-muted text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    {editingUser === u.id ? (
                      <div className="flex gap-2">
                        <button onClick={() => handleSave(u.id)} className="px-3 py-1.5 text-xs rounded-lg bg-accent text-white hover:bg-accent/90">Save</button>
                        <button onClick={() => setEditingUser(null)} className="px-3 py-1.5 text-xs rounded-lg bg-surface-light text-muted hover:text-foreground">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => openEdit(u)} className="px-3 py-1.5 text-xs rounded-lg bg-surface-light text-foreground hover:bg-accent/10 transition-colors">Edit</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
