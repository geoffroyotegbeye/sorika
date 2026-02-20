'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Shield, ShieldOff, Eye, LogOut, Users, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/editor/ConfirmDialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'companies'>('users');
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [deleteCompanyId, setDeleteCompanyId] = useState<string | null>(null);
  const [viewCompany, setViewCompany] = useState<any>(null);

  useEffect(() => {
    fetchUsers();
    fetchCompanies();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch('http://localhost:3001/admin/users');
    const data = await res.json();
    setUsers(data);
  };

  const fetchCompanies = async () => {
    const res = await fetch('http://localhost:3001/admin/companies');
    const data = await res.json();
    setCompanies(data);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Déconnexion réussie');
    router.push('/login');
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    
    try {
      await fetch(`http://localhost:3001/admin/users/${deleteUserId}`, { method: 'DELETE' });
      toast.success('Utilisateur supprimé');
      fetchUsers();
    } catch (error) {
      toast.error('Erreur');
    } finally {
      setDeleteUserId(null);
    }
  };

  const handleDeleteCompany = async () => {
    if (!deleteCompanyId) return;
    
    try {
      await fetch(`http://localhost:3001/admin/companies/${deleteCompanyId}`, { method: 'DELETE' });
      toast.success('Entreprise supprimée');
      fetchCompanies();
    } catch (error) {
      toast.error('Erreur');
    } finally {
      setDeleteCompanyId(null);
    }
  };

  const handleToggleSuperAdmin = async (userId: string, isSuperAdmin: boolean) => {
    try {
      await fetch(`http://localhost:3001/admin/users/${userId}/super-admin`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isSuperAdmin: !isSuperAdmin }),
      });
      toast.success(isSuperAdmin ? 'Super Admin retiré' : 'Super Admin ajouté');
      fetchUsers();
    } catch (error) {
      toast.error('Erreur');
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold">🔐 Admin</h2>
        </div>
        
        <nav className="flex-1 px-4">
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === 'users' ? 'bg-blue-600' : 'hover:bg-slate-800'
            }`}
          >
            <Users className="h-5 w-5" />
            <span>Utilisateurs</span>
            <span className="ml-auto bg-slate-700 px-2 py-1 rounded text-xs">{users.length}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('companies')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === 'companies' ? 'bg-blue-600' : 'hover:bg-slate-800'
            }`}
          >
            <Building2 className="h-5 w-5" />
            <span>Entreprises</span>
            <span className="ml-auto bg-slate-700 px-2 py-1 rounded text-xs">{companies.length}</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-slate-800"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <h1 className="text-3xl font-bold mb-8">
          {activeTab === 'users' ? 'Gestion des utilisateurs' : 'Gestion des entreprises'}
        </h1>

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Nom</th>
                  <th className="p-4 text-left">Entreprises</th>
                  <th className="p-4 text-left">Rôle</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{user.firstName} {user.lastName}</td>
                    <td className="p-4">
                      {user.memberships.map((m: any) => m.company.name).join(', ')}
                    </td>
                    <td className="p-4">
                      {user.isSuperAdmin && (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                          SUPER ADMIN
                        </span>
                      )}
                    </td>
                    <td className="p-4 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleSuperAdmin(user.id, user.isSuperAdmin)}
                      >
                        {user.isSuperAdmin ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteUserId(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'companies' && (
          <div className="bg-white rounded-lg shadow">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-4 text-left">Nom</th>
                  <th className="p-4 text-left">Slug</th>
                  <th className="p-4 text-left">Membres</th>
                  <th className="p-4 text-left">Pages</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.id} className="border-t">
                    <td className="p-4">{company.name}</td>
                    <td className="p-4">{company.slug}</td>
                    <td className="p-4">{company.members.length}</td>
                    <td className="p-4">{company._count.pages}</td>
                    <td className="p-4 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setViewCompany(company)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteCompanyId(company.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteUserId}
        onOpenChange={(open) => !open && setDeleteUserId(null)}
        title="Supprimer cet utilisateur ?"
        description="Cette action est irréversible. Toutes les données de l'utilisateur seront supprimées."
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
        onConfirm={handleDeleteUser}
      />

      <ConfirmDialog
        open={!!deleteCompanyId}
        onOpenChange={(open) => !open && setDeleteCompanyId(null)}
        title="Supprimer cette entreprise ?"
        description="Cette action est irréversible. Toutes les pages, produits et données seront supprimés."
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
        onConfirm={handleDeleteCompany}
      />

      <Dialog open={!!viewCompany} onOpenChange={(open) => !open && setViewCompany(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewCompany?.name} - Détails</DialogTitle>
          </DialogHeader>
          {viewCompany && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Informations</h3>
                <p><strong>Slug:</strong> {viewCompany.slug}</p>
                <p><strong>Téléphone:</strong> {viewCompany.phoneNumber || 'N/A'}</p>
                <p><strong>Modules:</strong> {viewCompany.modules.join(', ')}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Pages ({viewCompany._count.pages})</h3>
                {viewCompany.pages?.map((page: any) => (
                  <div key={page.id} className="border p-3 rounded mb-2">
                    <p><strong>{page.title}</strong> - /{page.slug || '(accueil)'}</p>
                    <p className="text-sm text-slate-600">
                      Éléments: {Array.isArray(page.elements) ? page.elements.length : 0}
                    </p>
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-blue-600">Voir JSON</summary>
                      <pre className="text-xs bg-slate-100 p-2 rounded mt-2 overflow-x-auto">
                        {JSON.stringify(page.elements, null, 2)}
                      </pre>
                    </details>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-semibold mb-2">Membres ({viewCompany.members.length})</h3>
                {viewCompany.members.map((m: any) => (
                  <p key={m.id} className="text-sm">
                    {m.user.email} - {m.role}
                  </p>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
