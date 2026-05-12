'use client';

import { useEffect, useState } from 'react';
import { Search, Eye, Trash2, Building2 } from 'lucide-react';
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

const MODULE_LABELS: Record<string, string> = {
  LANDING_PAGE: 'Landing Page', MEDIA: 'Médias',       CRM: 'CRM',
  HR: 'RH',                     ACCOUNTING: 'Comptabilité', INVENTORY: 'Inventaire',
  POS: 'POS',                   PROJECTS: 'Projets',   ANALYTICS: 'Analytics',
  ECOMMERCE: 'E-Commerce',      MESSAGING: 'Messagerie', BLOG: 'Blog',
};

// Couleurs adaptées light/dark via opacité
const MODULE_COLORS: Record<string, { bg: string; text: string }> = {
  LANDING_PAGE: { bg: 'rgba(59,130,246,0.12)',  text: '#3b82f6' },
  MEDIA:        { bg: 'rgba(100,116,139,0.12)', text: '#64748b' },
  CRM:          { bg: 'rgba(16,185,129,0.12)',  text: '#10b981' },
  HR:           { bg: 'rgba(249,115,22,0.12)',  text: '#f97316' },
  ACCOUNTING:   { bg: 'rgba(234,179,8,0.12)',   text: '#ca8a04' },
  INVENTORY:    { bg: 'rgba(6,182,212,0.12)',   text: '#06b6d4' },
  POS:          { bg: 'rgba(236,72,153,0.12)',  text: '#ec4899' },
  PROJECTS:     { bg: 'rgba(37,99,235,0.12)',   text: '#2563eb' },
  ANALYTICS:    { bg: 'rgba(99,102,241,0.12)',  text: '#6366f1' },
  ECOMMERCE:    { bg: 'rgba(239,68,68,0.12)',   text: '#ef4444' },
  MESSAGING:    { bg: 'rgba(20,184,166,0.12)',  text: '#14b8a6' },
  BLOG:         { bg: 'rgba(245,158,11,0.12)',  text: '#f59e0b' },
};

export default function AdminCompaniesPage() {
  const [companies,        setCompanies]        = useState<any[]>([]);
  const [loading,          setLoading]          = useState(true);
  const [search,           setSearch]           = useState('');
  const [deleteCompanyId,  setDeleteCompanyId]  = useState<string | null>(null);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/admin/companies`, { headers: getAdminHeaders() });
      const data = await res.json();
      setCompanies(Array.isArray(data) ? data : []);
    } catch { toast.error('Erreur lors du chargement'); }
    finally  { setLoading(false); }
  };

  useEffect(() => { fetchCompanies(); }, []);

  const handleDelete = async () => {
    if (!deleteCompanyId) return;
    try {
      await fetch(`${API_URL}/admin/companies/${deleteCompanyId}`, { method: 'DELETE', headers: getAdminHeaders() });
      toast.success('Organisation supprimée');
      fetchCompanies();
    } catch { toast.error('Erreur lors de la suppression'); }
    finally  { setDeleteCompanyId(null); }
  };

  const filtered = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase()),
  );

  const surface  = { background: 'var(--admin-surface)',   border: '1px solid var(--admin-border)' };
  const textMain = { color: 'var(--admin-text)' };
  const textMuted= { color: 'var(--admin-text-muted)' };
  const textSub  = { color: 'var(--admin-text-subtle)' };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={textMain}>Organisations</h1>
        <p className="text-sm mt-1" style={textMuted}>{companies.length} organisations enregistrées</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={textSub} />
        <input
          type="text"
          placeholder="Rechercher par nom ou slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ ...surface, ...textMain }}
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--admin-spinner)' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-sm" style={textSub}>Aucune organisation trouvée</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((company) => (
            <div
              key={company.id}
              className="rounded-xl p-5 transition-all"
              style={surface}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--admin-border-2)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--admin-border)')}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: 'var(--admin-surface-2)' }}
                  >
                    {company.logo ? (
                      <img src={company.logo} alt={company.name} className="w-8 h-8 rounded object-cover" />
                    ) : (
                      <Building2 className="w-5 h-5" style={textMuted} />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold" style={textMain}>{company.name}</p>
                    <p className="text-xs" style={textMuted}>/{company.slug}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Link href={`/admin/companies/${company.id}`}>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:text-blue-500" style={textMuted}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    size="sm" variant="ghost"
                    className="h-8 w-8 p-0 hover:text-red-500"
                    style={textMuted}
                    onClick={() => setDeleteCompanyId(company.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: 'Membres',  value: company.members.length },
                  { label: 'Employés', value: company._count?.employees ?? 0 },
                  { label: 'Contacts', value: company._count?.contacts  ?? 0 },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg p-2 text-center" style={{ background: 'var(--admin-surface-2)' }}>
                    <p className="text-lg font-bold" style={textMain}>{s.value}</p>
                    <p className="text-xs" style={textMuted}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Modules */}
              <div>
                <p className="text-xs mb-2" style={textSub}>
                  {company.modules.length} module{company.modules.length > 1 ? 's' : ''} actif{company.modules.length > 1 ? 's' : ''}
                </p>
                <div className="flex flex-wrap gap-1">
                  {company.modules.slice(0, 6).map((mod: string) => {
                    const c = MODULE_COLORS[mod] ?? { bg: 'rgba(100,116,139,0.12)', text: '#64748b' };
                    return (
                      <span
                        key={mod}
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: c.bg, color: c.text }}
                      >
                        {MODULE_LABELS[mod] ?? mod}
                      </span>
                    );
                  })}
                  {company.modules.length > 6 && (
                    <span className="text-xs px-1" style={textSub}>+{company.modules.length - 6}</span>
                  )}
                </div>
              </div>

              <p className="text-xs mt-3" style={textSub}>
                Créée le {new Date(company.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteCompanyId}
        onOpenChange={(open) => !open && setDeleteCompanyId(null)}
        title="Supprimer cette organisation ?"
        description="Cette action est irréversible. Toutes les données (pages, employés, contacts, etc.) seront supprimées."
        confirmText="Supprimer" cancelText="Annuler" variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
