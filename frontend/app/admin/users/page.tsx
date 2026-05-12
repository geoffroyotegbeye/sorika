'use client';

import { useEffect, useState } from 'react';
import {
  Search, Shield, ShieldOff, Trash2, KeyRound,
  ChevronDown, Building2, UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/editor/ConfirmDialog';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function getAdminHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const userData = localStorage.getItem('user');
    if (!userData) return {};
    const parsed = JSON.parse(userData);
    return { 'x-user-id': parsed.user?.id ?? '', 'Content-Type': 'application/json' };
  } catch { return {}; }
}

export default function AdminUsersPage() {
  const [users,             setUsers]             = useState<any[]>([]);
  const [loading,           setLoading]           = useState(true);
  const [search,            setSearch]            = useState('');
  const [deleteUserId,      setDeleteUserId]      = useState<string | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<any>(null);
  const [newPassword,       setNewPassword]       = useState('');
  const [expandedUser,      setExpandedUser]      = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/admin/users`, { headers: getAdminHeaders() });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch { toast.error('Erreur lors du chargement'); }
    finally  { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async () => {
    if (!deleteUserId) return;
    try {
      await fetch(`${API_URL}/admin/users/${deleteUserId}`, { method: 'DELETE', headers: getAdminHeaders() });
      toast.success('Utilisateur supprimé');
      fetchUsers();
    } catch { toast.error('Erreur lors de la suppression'); }
    finally  { setDeleteUserId(null); }
  };

  const handleToggleSuperAdmin = async (userId: string, current: boolean) => {
    try {
      await fetch(`${API_URL}/admin/users/${userId}/super-admin`, {
        method: 'PUT', headers: getAdminHeaders(),
        body: JSON.stringify({ isSuperAdmin: !current }),
      });
      toast.success(current ? 'Droits Super Admin retirés' : 'Super Admin accordé');
      fetchUsers();
    } catch { toast.error('Erreur'); }
  };

  const handleResetPassword = async () => {
    if (!resetPasswordUser || !newPassword) return;
    try {
      const res = await fetch(`${API_URL}/admin/users/${resetPasswordUser.id}/reset-password`, {
        method: 'PUT', headers: getAdminHeaders(),
        body: JSON.stringify({ newPassword }),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.message); }
      toast.success("Mot de passe réinitialisé — l'utilisateur devra le changer à la connexion");
      setResetPasswordUser(null);
      setNewPassword('');
    } catch (e: any) { toast.error(e.message || 'Erreur'); }
  };

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      `${u.firstName ?? ''} ${u.lastName ?? ''}`.toLowerCase().includes(search.toLowerCase()),
  );

  /* ── Shared inline styles ── */
  const surface  = { background: 'var(--admin-surface)',   border: '1px solid var(--admin-border)' };
  const surface2 = { background: 'var(--admin-surface-2)' };
  const textMain = { color: 'var(--admin-text)' };
  const textMuted= { color: 'var(--admin-text-muted)' };
  const textSub  = { color: 'var(--admin-text-subtle)' };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={textMain}>Utilisateurs</h1>
        <p className="text-sm mt-1" style={textMuted}>{users.length} utilisateurs inscrits</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={textSub} />
        <input
          type="text"
          placeholder="Rechercher par email ou nom..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ ...surface, ...textMain }}
        />
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={surface}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--admin-spinner)' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-sm" style={textSub}>Aucun utilisateur trouvé</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--admin-border)' }}>
                {['Utilisateur', 'Organisations', 'Inscrit le', 'Statut', 'Actions'].map((h, i) => (
                  <th
                    key={h}
                    className={`text-left px-4 py-3 text-xs font-medium uppercase tracking-wider ${
                      i === 1 ? 'hidden md:table-cell' : i === 2 ? 'hidden lg:table-cell' : i === 4 ? 'text-right' : ''
                    }`}
                    style={textMuted}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <>
                  <tr
                    key={user.id}
                    className="cursor-pointer transition-colors"
                    style={{ borderBottom: '1px solid var(--admin-border)' }}
                    onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--admin-hover)')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                  >
                    {/* User */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{ background: 'var(--admin-surface-2)', color: 'var(--admin-text)' }}
                        >
                          {user.firstName?.[0] ?? user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={textMain}>
                            {user.firstName ? `${user.firstName} ${user.lastName ?? ''}` : '—'}
                          </p>
                          <p className="text-xs" style={textMuted}>{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Orgs */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {user.memberships.slice(0, 2).map((m: any) => (
                          <span
                            key={m.company.id}
                            className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded"
                            style={{ background: 'var(--admin-surface-2)', color: 'var(--admin-text-muted)' }}
                          >
                            <Building2 className="w-3 h-3" />
                            {m.company.name}
                          </span>
                        ))}
                        {user.memberships.length > 2 && (
                          <span className="text-xs" style={textSub}>+{user.memberships.length - 2}</span>
                        )}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-sm" style={textMuted}>
                        {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      {user.isSuperAdmin ? (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-blue-600/15 text-blue-500">
                          <Shield className="w-3 h-3" /> Super Admin
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                          style={{ background: 'var(--admin-surface-2)', color: 'var(--admin-text-muted)' }}
                        >
                          <UserCheck className="w-3 h-3" /> Utilisateur
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div
                        className="flex items-center justify-end gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          size="sm" variant="ghost"
                          className="h-8 w-8 p-0 hover:text-blue-500"
                          style={textMuted}
                          title={user.isSuperAdmin ? 'Retirer Super Admin' : 'Promouvoir Super Admin'}
                          onClick={() => handleToggleSuperAdmin(user.id, user.isSuperAdmin)}
                        >
                          {user.isSuperAdmin ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm" variant="ghost"
                          className="h-8 w-8 p-0 hover:text-amber-500"
                          style={textMuted}
                          title="Réinitialiser le mot de passe"
                          onClick={() => setResetPasswordUser(user)}
                        >
                          <KeyRound className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm" variant="ghost"
                          className="h-8 w-8 p-0 hover:text-red-500"
                          style={textMuted}
                          title="Supprimer"
                          onClick={() => setDeleteUserId(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <ChevronDown
                          className="w-4 h-4 transition-transform"
                          style={{
                            color:     'var(--admin-text-subtle)',
                            transform: expandedUser === user.id ? 'rotate(180deg)' : 'rotate(0deg)',
                          }}
                        />
                      </div>
                    </td>
                  </tr>

                  {/* Expanded */}
                  {expandedUser === user.id && (
                    <tr key={`${user.id}-exp`} style={{ background: 'var(--admin-surface-2)', borderBottom: '1px solid var(--admin-border)' }}>
                      <td colSpan={5} className="px-4 py-4">
                        <p className="text-xs font-medium uppercase tracking-wider mb-3" style={textMuted}>
                          Organisations ({user.memberships.length})
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {user.memberships.map((m: any) => (
                            <div
                              key={m.company.id}
                              className="rounded-lg p-3 flex items-start gap-3"
                              style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)' }}
                            >
                              <Building2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate" style={textMain}>{m.company.name}</p>
                                <p className="text-xs" style={textMuted}>{m.role}</p>
                                <p className="text-xs mt-1" style={textSub}>{m.company.modules?.length ?? 0} modules actifs</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteUserId}
        onOpenChange={(open) => !open && setDeleteUserId(null)}
        title="Supprimer cet utilisateur ?"
        description="Cette action est irréversible. L'utilisateur et tous ses accès seront supprimés."
        confirmText="Supprimer" cancelText="Annuler" variant="destructive"
        onConfirm={handleDelete}
      />

      {/* Reset password */}
      <Dialog open={!!resetPasswordUser} onOpenChange={(open) => { if (!open) { setResetPasswordUser(null); setNewPassword(''); } }}>
        <DialogContent style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)' }}>
          <DialogHeader>
            <DialogTitle style={{ color: 'var(--admin-text)' }}>Réinitialiser le mot de passe</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm" style={textMuted}>
              Utilisateur : <span className="font-medium" style={textMain}>{resetPasswordUser?.email}</span>
            </p>
            <div>
              <label className="text-sm block mb-1.5" style={textMuted}>Nouveau mot de passe</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 caractères"
                className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ background: 'var(--admin-surface-2)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)' }}
              />
            </div>
            <p className="text-xs text-amber-500">
              L'utilisateur sera forcé de changer son mot de passe à la prochaine connexion.
            </p>
          </div>
          <DialogFooter>
            <Button variant="ghost" style={textMuted} onClick={() => { setResetPasswordUser(null); setNewPassword(''); }}>
              Annuler
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleResetPassword} disabled={newPassword.length < 6}>
              Réinitialiser
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
