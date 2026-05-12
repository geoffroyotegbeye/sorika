'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Building2, Users, Package, FileText,
  Briefcase, UserMinus, Check, X, Shield, FlaskConical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/editor/ConfirmDialog';
import Link from 'next/link';

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

const ALL_MODULES = [
  { key: 'LANDING_PAGE', label: 'Landing Page',         desc: 'Éditeur de site web no-code'       },
  { key: 'MEDIA',        label: 'Médias',               desc: 'Bibliothèque de fichiers'           },
  { key: 'CRM',          label: 'CRM',                  desc: 'Contacts et opportunités'           },
  { key: 'HR',           label: 'Ressources Humaines',  desc: 'Employés, congés, présences'        },
  { key: 'ACCOUNTING',   label: 'Comptabilité',         desc: 'Factures, devis, paiements'         },
  { key: 'INVENTORY',    label: 'Inventaire',           desc: 'Gestion des stocks'                 },
  { key: 'POS',          label: 'Point de Vente',       desc: 'Caisse enregistreuse'               },
  { key: 'PROJECTS',     label: 'Projets',              desc: 'Gestion de projets et tâches'       },
  { key: 'ANALYTICS',    label: 'Analytics',            desc: 'Tableaux de bord et statistiques'   },
  { key: 'ECOMMERCE',    label: 'E-Commerce',           desc: 'Boutique en ligne'                  },
  { key: 'MESSAGING',    label: 'Messagerie',           desc: 'Communication interne'              },
  { key: 'BLOG',         label: 'Blog',                 desc: 'Gestion de contenu'                 },
];

const ROLES = ['OWNER', 'ADMIN', 'STAFF'];

export default function CompanyDetailPage({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = use(params);
  const [company,       setCompany]       = useState<any>(null);
  const [members,       setMembers]       = useState<any[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [activeTab,     setActiveTab]     = useState<'modules' | 'members'>('modules');
  const [revokeTarget,  setRevokeTarget]  = useState<any>(null);
  const [savingModules, setSavingModules] = useState(false);
  const [localModules,  setLocalModules]  = useState<string[]>([]);
  const [hasChanges,    setHasChanges]    = useState(false);
  const [seeding,       setSeeding]       = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cRes, mRes] = await Promise.all([
        fetch(`${API_URL}/admin/companies/${companyId}`,         { headers: getAdminHeaders() }),
        fetch(`${API_URL}/admin/companies/${companyId}/members`, { headers: getAdminHeaders() }),
      ]);
      const cData = await cRes.json();
      const mData = await mRes.json();
      setCompany(cData);
      setLocalModules(cData.modules ?? []);
      setMembers(Array.isArray(mData) ? mData : []);
    } catch { toast.error('Erreur lors du chargement'); }
    finally  { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [companyId]);

  const toggleModule = (key: string) => {
    setLocalModules((prev) =>
      prev.includes(key) ? prev.filter((m) => m !== key) : [...prev, key],
    );
    setHasChanges(true);
  };

  const saveModules = async () => {
    setSavingModules(true);
    try {
      const res = await fetch(`${API_URL}/admin/companies/${companyId}/modules`, {
        method: 'PUT', headers: getAdminHeaders(),
        body: JSON.stringify({ modules: localModules }),
      });
      if (!res.ok) throw new Error();
      toast.success('Modules mis à jour');
      setHasChanges(false);
      fetchData();
    } catch { toast.error('Erreur lors de la sauvegarde'); }
    finally  { setSavingModules(false); }
  };

  const handleUpdateRole = async (userId: string, role: string) => {
    try {
      await fetch(`${API_URL}/admin/companies/${companyId}/members/${userId}/role`, {
        method: 'PATCH', headers: getAdminHeaders(),
        body: JSON.stringify({ role }),
      });
      toast.success('Rôle mis à jour');
      fetchData();
    } catch { toast.error('Erreur'); }
  };

  const handleRevoke = async () => {
    if (!revokeTarget) return;
    try {
      await fetch(`${API_URL}/admin/companies/${companyId}/members/${revokeTarget.user.id}`, {
        method: 'DELETE', headers: getAdminHeaders(),
      });
      toast.success('Accès révoqué');
      setRevokeTarget(null);
      fetchData();
    } catch { toast.error('Erreur'); }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch(`${API_URL}/admin/companies/${companyId}/seed`, {
        method: 'POST', headers: getAdminHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(`Données de test créées — ${data.summary.employees} employés, ${data.summary.contacts} contacts, ${data.summary.projects} projets...`);
      fetchData();
    } catch (e: any) { toast.error(e.message || 'Erreur lors du seed'); }
    finally { setSeeding(false); }
  };

  /* ── Shared styles ── */
  const surface  = { background: 'var(--admin-surface)',   border: '1px solid var(--admin-border)' };
  const surface2 = { background: 'var(--admin-surface-2)' };
  const textMain = { color: 'var(--admin-text)' };
  const textMuted= { color: 'var(--admin-text-muted)' };
  const textSub  = { color: 'var(--admin-text-subtle)' };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--admin-spinner)' }} />
      </div>
    );
  }

  if (!company) {
    return <div className="p-6 text-center text-sm" style={textSub}>Organisation introuvable</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/companies">
            <Button variant="ghost" size="icon" style={textMuted} className="hover:bg-[var(--admin-hover)]">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={surface2}>
              <Building2 className="w-5 h-5" style={textMuted} />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={textMain}>{company.name}</h1>
              <p className="text-sm" style={textMuted}>/{company.slug}</p>
            </div>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleSeed}
          disabled={seeding}
          className="flex items-center gap-2 border-dashed"
          style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-text-muted)' }}
          title="Insère des données de test réalistes pour tous les modules actifs"
        >
          <FlaskConical className="w-4 h-4" />
          {seeding ? 'Seeding...' : 'Seed données test'}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Membres',  value: company.members?.length ?? 0,      icon: Users    },
          { label: 'Employés', value: company._count?.employees ?? 0,     icon: Briefcase},
          { label: 'Contacts', value: company._count?.contacts  ?? 0,     icon: Package  },
          { label: 'Factures', value: company._count?.invoices  ?? 0,     icon: FileText },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl p-4" style={surface}>
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4 text-blue-500" />
                <span className="text-xs" style={textMuted}>{s.label}</span>
              </div>
              <p className="text-2xl font-bold" style={textMain}>{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 rounded-lg p-1 w-fit"
        style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)' }}
      >
        {(['modules', 'members'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize"
            style={
              activeTab === tab
                ? { background: '#1d4ed8', color: '#ffffff' }
                : { color: 'var(--admin-text-muted)' }
            }
          >
            {tab === 'modules' ? 'Modules' : 'Membres'}
          </button>
        ))}
      </div>

      {/* ── Modules tab ── */}
      {activeTab === 'modules' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={textMuted}>
              {localModules.length} module{localModules.length > 1 ? 's' : ''} actif{localModules.length > 1 ? 's' : ''}
            </p>
            {hasChanges && (
              <div className="flex gap-2">
                <Button
                  variant="ghost" size="sm" style={textMuted}
                  onClick={() => { setLocalModules(company.modules); setHasChanges(false); }}
                >
                  Annuler
                </Button>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={saveModules}
                  disabled={savingModules}
                >
                  {savingModules ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ALL_MODULES.map((mod) => {
              const isActive = localModules.includes(mod.key);
              return (
                <button
                  key={mod.key}
                  onClick={() => toggleModule(mod.key)}
                  className="flex items-start gap-3 p-4 rounded-xl text-left transition-all"
                  style={
                    isActive
                      ? { background: 'rgba(29,78,216,0.1)', border: '1px solid rgba(37,99,235,0.5)' }
                      : { ...surface }
                  }
                  onMouseEnter={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--admin-border-2)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--admin-border)';
                  }}
                >
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: isActive ? '#1d4ed8' : 'var(--admin-surface-2)' }}
                  >
                    {isActive
                      ? <Check className="w-3 h-3 text-white" />
                      : <X className="w-3 h-3" style={textSub} />
                    }
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={isActive ? { color: 'var(--admin-text)' } : textMuted}>
                      {mod.label}
                    </p>
                    <p className="text-xs mt-0.5" style={textSub}>{mod.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Members tab ── */}
      {activeTab === 'members' && (
        <div className="rounded-xl overflow-hidden" style={surface}>
          {members.length === 0 ? (
            <div className="text-center py-12 text-sm" style={textSub}>Aucun membre</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--admin-border)' }}>
                  {['Utilisateur', 'Rôle', 'Membre depuis', 'Actions'].map((h, i) => (
                    <th
                      key={h}
                      className={`text-left px-4 py-3 text-xs font-medium uppercase tracking-wider ${
                        i === 2 ? 'hidden md:table-cell' : i === 3 ? 'text-right' : ''
                      }`}
                      style={textMuted}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr
                    key={m.id}
                    style={{ borderBottom: '1px solid var(--admin-border)' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--admin-hover)')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{ background: 'var(--admin-surface-2)', color: 'var(--admin-text)' }}
                        >
                          {m.user.firstName?.[0] ?? m.user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={textMain}>
                            {m.user.firstName ? `${m.user.firstName} ${m.user.lastName ?? ''}` : '—'}
                          </p>
                          <p className="text-xs" style={textMuted}>{m.user.email}</p>
                        </div>
                        {m.user.isSuperAdmin && <Shield className="w-3 h-3 text-blue-500" />}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={m.role}
                        onChange={(e) => handleUpdateRole(m.user.id, e.target.value)}
                        className="text-sm rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ background: 'var(--admin-surface-2)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)' }}
                      >
                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm" style={textMuted}>
                        {new Date(m.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm" variant="ghost"
                        className="h-8 w-8 p-0 hover:text-red-500"
                        style={textMuted}
                        title="Révoquer l'accès"
                        onClick={() => setRevokeTarget(m)}
                      >
                        <UserMinus className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <ConfirmDialog
        open={!!revokeTarget}
        onOpenChange={(open) => !open && setRevokeTarget(null)}
        title="Révoquer l'accès ?"
        description={`${revokeTarget?.user?.email} n'aura plus accès à cette organisation.`}
        confirmText="Révoquer" cancelText="Annuler" variant="destructive"
        onConfirm={handleRevoke}
      />
    </div>
  );
}
