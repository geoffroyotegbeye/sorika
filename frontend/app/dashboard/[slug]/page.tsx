'use client';

import { use, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LayoutTemplate,
  Image,
  Users,
  ShoppingBag,
  BarChart3,
  MessageSquare,
  FileText,
  Clock,
  ArrowRight,
  BriefcaseBusiness,
} from 'lucide-react';

const ALL_MODULES = [
  {
    id: 'LANDING_PAGE',
    name: 'Site Vitrine',
    description: 'Éditeur no-code de votre site web',
    icon: LayoutTemplate,
    color: 'blue',
    href: (slug: string) => `/dashboard/${slug}/site-vitrine`,
  },
  {
    id: 'MEDIA',
    name: 'Médiathèque',
    description: 'Images, vidéos et fichiers',
    icon: Image,
    color: 'purple',
    href: (slug: string) => `/dashboard/${slug}/media`,
  },
  {
    id: 'CRM',
    name: 'CRM',
    description: 'Clients et prospects',
    icon: Users,
    color: 'green',
    href: (slug: string) => `/dashboard/${slug}/crm`,
  },
  {
    id: 'ECOMMERCE',
    name: 'E-Commerce',
    description: 'Boutique et commandes',
    icon: ShoppingBag,
    color: 'orange',
    href: (slug: string) => `/dashboard/${slug}/shop`,
  },
  {
    id: 'ANALYTICS',
    name: 'Analytics',
    description: 'Statistiques et performances',
    icon: BarChart3,
    color: 'cyan',
    href: (slug: string) => `/dashboard/${slug}/analytics`,
  },
  {
    id: 'MESSAGING',
    name: 'Messagerie',
    description: 'Chat et formulaires de contact',
    icon: MessageSquare,
    color: 'pink',
    href: (slug: string) => `/dashboard/${slug}/messages`,
  },
  {
    id: 'BLOG',
    name: 'Blog',
    description: 'Articles et contenu',
    icon: FileText,
    color: 'yellow',
    href: (slug: string) => `/dashboard/${slug}/blog`,
  },
  {
    id: 'HR',
    name: 'Ressources Humaines',
    description: 'Employés et départements',
    icon: BriefcaseBusiness,
    color: 'teal',
    href: (slug: string) => `/dashboard/${slug}/hr/employees`,
  },
];

const COLORS: Record<string, { bg: string; icon: string; border: string; hover: string }> = {
  blue:   { bg: 'bg-blue-50',   icon: 'text-blue-600',   border: 'border-blue-100',   hover: 'hover:border-blue-300 hover:bg-blue-50' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-100', hover: 'hover:border-purple-300 hover:bg-purple-50' },
  green:  { bg: 'bg-green-50',  icon: 'text-green-600',  border: 'border-green-100',  hover: 'hover:border-green-300 hover:bg-green-50' },
  orange: { bg: 'bg-orange-50', icon: 'text-orange-600', border: 'border-orange-100', hover: 'hover:border-orange-300 hover:bg-orange-50' },
  cyan:   { bg: 'bg-cyan-50',   icon: 'text-cyan-600',   border: 'border-cyan-100',   hover: 'hover:border-cyan-300 hover:bg-cyan-50' },
  pink:   { bg: 'bg-pink-50',   icon: 'text-pink-600',   border: 'border-pink-100',   hover: 'hover:border-pink-300 hover:bg-pink-50' },
  yellow: { bg: 'bg-yellow-50', icon: 'text-yellow-600', border: 'border-yellow-100', hover: 'hover:border-yellow-300 hover:bg-yellow-50' },
  teal:   { bg: 'bg-teal-50',   icon: 'text-teal-600',   border: 'border-teal-100',   hover: 'hover:border-teal-300 hover:bg-teal-50' },
};

const RECENT_KEY = (slug: string) => `sorika_recent_apps_${slug}`;

function saveRecentApp(slug: string, moduleId: string) {
  try {
    const existing: string[] = JSON.parse(localStorage.getItem(RECENT_KEY(slug)) || '[]');
    const updated = [moduleId, ...existing.filter((id) => id !== moduleId)].slice(0, 4);
    localStorage.setItem(RECENT_KEY(slug), JSON.stringify(updated));
  } catch {}
}

function getRecentApps(slug: string): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY(slug)) || '[]');
  } catch {
    return [];
  }
}

export default function DashboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [company, setCompany] = useState<any>(null);
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return;
    const parsed = JSON.parse(userData);
    const currentCompany = parsed.companies?.find((c: any) => c.slug === slug);
    setCompany(currentCompany);
    setRecentIds(getRecentApps(slug));
  }, [slug]);

  if (!company) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  const activeModules = ALL_MODULES.filter((m) => company.modules?.includes(m.id));
  const recentModules = recentIds
    .map((id) => activeModules.find((m) => m.id === id))
    .filter(Boolean) as typeof ALL_MODULES;

  const handleAppClick = (moduleId: string, href: string) => {
    saveRecentApp(slug, moduleId);
    window.location.href = href;
  };

  return (
    <div className="space-y-6">
      {/* Récemment visités */}
      {recentModules.length > 0 && (
        <Card className="border border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-500 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Récemment visités
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {recentModules.map((mod) => {
                const c = COLORS[mod.color];
                const Icon = mod.icon;
                return (
                  <button
                    key={mod.id}
                    onClick={() => handleAppClick(mod.id, mod.href(slug))}
                    className={`group flex flex-col items-center gap-2 p-4 rounded-xl border ${c.border} bg-white ${c.hover} transition-all text-center w-full`}
                  >
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${c.bg}`}>
                      <Icon className={`h-5 w-5 ${c.icon}`} />
                    </div>
                    <span className="text-xs font-medium text-slate-700">{mod.name}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Applications disponibles */}
      <Card className="border border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-500">
            Applications disponibles
          </CardTitle>
        </CardHeader>
        <CardContent className="max-h-[calc(100vh-280px)] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeModules.map((mod) => {
              const c = COLORS[mod.color];
              const Icon = mod.icon;
              return (
                <button
                  key={mod.id}
                  onClick={() => handleAppClick(mod.id, mod.href(slug))}
                  className={`group flex items-center gap-4 p-4 rounded-xl border ${c.border} bg-white ${c.hover} transition-all text-left w-full`}
                >
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${c.bg}`}>
                    <Icon className={`h-5 w-5 ${c.icon}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{mod.name}</p>
                    <p className="text-xs text-slate-400 truncate">{mod.description}</p>
                  </div>
                  <ArrowRight className={`h-4 w-4 ${c.icon} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0`} />
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
