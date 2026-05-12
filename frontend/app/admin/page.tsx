'use client';

import { useEffect, useState } from 'react';
import { Users, Building2, TrendingUp, Package, ArrowUpRight, Layers } from 'lucide-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function getAdminHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const userData = localStorage.getItem('user');
    if (!userData) return {};
    const parsed = JSON.parse(userData);
    return { 'x-user-id': parsed.user?.id ?? '' };
  } catch {
    return {};
  }
}

const MODULE_LABELS: Record<string, string> = {
  LANDING_PAGE: 'Landing Page', MEDIA: 'Médias',       CRM: 'CRM',
  HR: 'RH',                     ACCOUNTING: 'Comptabilité', INVENTORY: 'Inventaire',
  POS: 'Point de Vente',        PROJECTS: 'Projets',   ANALYTICS: 'Analytics',
  ECOMMERCE: 'E-Commerce',      MESSAGING: 'Messagerie', BLOG: 'Blog',
};

const STAT_CARDS = [
  { key: 'totalUsers',     label: 'Utilisateurs',   subKey: 'newUsersThisMonth',     subLabel: 'ce mois', icon: Users,     accent: '#3b82f6', href: '/admin/users'     },
  { key: 'totalCompanies', label: 'Organisations',  subKey: 'newCompaniesThisMonth', subLabel: 'ce mois', icon: Building2, accent: '#2563eb', href: '/admin/companies' },
  { key: 'totalEmployees', label: 'Employés',       subKey: null,                    subLabel: 'Total plateforme', icon: TrendingUp, accent: '#0ea5e9', href: '/admin/companies' },
  { key: 'totalContacts',  label: 'Contacts CRM',   subKey: null,                    subLabel: 'Total plateforme', icon: Package,    accent: '#1d4ed8', href: '/admin/companies' },
];

export default function AdminDashboard() {
  const [stats,   setStats]   = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/admin/stats`, { headers: getAdminHeaders() })
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: 'var(--admin-spinner)' }} />
      </div>
    );
  }

  const sortedModules = Object.entries(stats?.moduleUsage ?? {}).sort(
    ([, a], [, b]) => (b as number) - (a as number),
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--admin-text)' }}>
          Vue d'ensemble
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--admin-text-muted)' }}>
          Activité globale de la plateforme Sorika
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => {
          const Icon  = card.icon;
          const value = stats?.[card.key] ?? 0;
          const sub   = card.subKey
            ? `+${stats?.[card.subKey] ?? 0} ${card.subLabel}`
            : card.subLabel;

          return (
            <Link
              key={card.key}
              href={card.href}
              className="rounded-xl p-5 transition-all group block"
              style={{
                background:  'var(--admin-surface)',
                border:      '1px solid var(--admin-border)',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor = 'var(--admin-border-2)')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor = 'var(--admin-border)')
              }
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: `${card.accent}18` }}
                >
                  <Icon className="w-5 h-5" style={{ color: card.accent }} />
                </div>
                <ArrowUpRight className="w-4 h-4 transition-colors" style={{ color: 'var(--admin-text-subtle)' }} />
              </div>
              <p className="text-3xl font-bold" style={{ color: 'var(--admin-text)' }}>
                {value.toLocaleString()}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--admin-text-muted)' }}>
                {card.label}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--admin-text-subtle)' }}>
                {sub}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Modules usage */}
        <div
          className="rounded-xl p-5"
          style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)' }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Layers className="w-4 h-4 text-blue-500" />
            <h2 className="font-semibold" style={{ color: 'var(--admin-text)' }}>
              Modules les plus utilisés
            </h2>
          </div>
          <div className="space-y-3">
            {sortedModules.length === 0 && (
              <p className="text-sm" style={{ color: 'var(--admin-text-subtle)' }}>
                Aucune donnée
              </p>
            )}
            {sortedModules.map(([mod, count]) => {
              const total = stats?.totalCompanies ?? 1;
              const pct   = Math.round(((count as number) / total) * 100);
              return (
                <div key={mod}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span style={{ color: 'var(--admin-text)' }}>
                      {MODULE_LABELS[mod] ?? mod}
                    </span>
                    <span style={{ color: 'var(--admin-text-muted)' }}>
                      {count as number} org. ({pct}%)
                    </span>
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: 'var(--admin-surface-2)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: 'var(--sorika-primary)' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent signups */}
        <div
          className="rounded-xl p-5"
          style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)' }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Users className="w-4 h-4 text-blue-500" />
            <h2 className="font-semibold" style={{ color: 'var(--admin-text)' }}>
              Inscriptions récentes
            </h2>
          </div>
          <div className="space-y-3">
            {(stats?.recentActivity ?? []).length === 0 && (
              <p className="text-sm" style={{ color: 'var(--admin-text-subtle)' }}>
                Aucune inscription récente
              </p>
            )}
            {(stats?.recentActivity ?? []).map((u: any) => (
              <div key={u.id} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: 'var(--admin-surface-2)', color: 'var(--admin-text)' }}
                >
                  {u.firstName?.[0] ?? u.email[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--admin-text)' }}>
                    {u.firstName ? `${u.firstName} ${u.lastName ?? ''}` : u.email}
                  </p>
                  <p className="text-xs truncate" style={{ color: 'var(--admin-text-subtle)' }}>
                    {u.memberships?.[0]?.company?.name ?? 'Aucune organisation'}
                  </p>
                </div>
                <p className="text-xs shrink-0" style={{ color: 'var(--admin-text-subtle)' }}>
                  {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
