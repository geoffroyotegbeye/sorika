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
  ArrowRight,
  BriefcaseBusiness,
  Package,
  Calculator,
} from 'lucide-react';

const MODULE_CATEGORIES = [
  {
    name: 'Gestion',
    modules: [
      {
        id: 'CRM',
        name: 'CRM',
        description: 'Clients et prospects',
        icon: Users,
        color: 'green',
        href: (slug: string) => `/dashboard/${slug}/crm`,
      },
      {
        id: 'HR',
        name: 'Ressources Humaines',
        description: 'Employés et départements',
        icon: BriefcaseBusiness,
        color: 'teal',
        href: (slug: string) => `/dashboard/${slug}/hr`,
      },
      {
        id: 'ACCOUNTING',
        name: 'Comptabilité',
        description: 'Factures, devis et paiements',
        icon: Calculator,
        color: 'indigo',
        href: (slug: string) => `/dashboard/${slug}/accounting`,
      },
      {
        id: 'PROJECTS',
        name: 'Projets',
        description: 'Gestion de projets et tâches',
        icon: FileText,
        color: 'cyan',
        href: (slug: string) => `/dashboard/${slug}/projects`,
      },
    ],
  },
  {
    name: 'Commerce',
    modules: [
      {
        id: 'INVENTORY',
        name: 'Inventaire',
        description: 'Gestion des stocks et produits',
        icon: Package,
        color: 'amber',
        href: (slug: string) => `/dashboard/${slug}/inventory`,
      },
      {
        id: 'POS',
        name: 'Point de Vente',
        description: 'Caisse et ventes en magasin',
        icon: ShoppingBag,
        color: 'emerald',
        href: (slug: string) => `/dashboard/${slug}/pos`,
      },
      {
        id: 'ECOMMERCE',
        name: 'E-Commerce',
        description: 'Boutique et commandes',
        icon: ShoppingBag,
        color: 'orange',
        href: (slug: string) => `/dashboard/${slug}/shop`,
      },
    ],
  },
  {
    name: 'Contenu & Communication',
    modules: [
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
        id: 'BLOG',
        name: 'Blog',
        description: 'Articles et contenu',
        icon: FileText,
        color: 'yellow',
        href: (slug: string) => `/dashboard/${slug}/blog`,
      },
      {
        id: 'MESSAGING',
        name: 'Messagerie',
        description: 'Chat et formulaires de contact',
        icon: MessageSquare,
        color: 'pink',
        href: (slug: string) => `/dashboard/${slug}/messages`,
      },
    ],
  },
  {
    name: 'Analyse',
    modules: [
      {
        id: 'ANALYTICS',
        name: 'Analytics',
        description: 'Statistiques et performances',
        icon: BarChart3,
        color: 'cyan',
        href: (slug: string) => `/dashboard/${slug}/analytics`,
      },
    ],
  },
];

/** Pastels lisibles en clair + fonds plus saturés en sombre */
const COLORS: Record<string, { iconBg: string; icon: string }> = {
  blue: {
    iconBg: 'bg-blue-600/12 dark:bg-blue-400/20',
    icon: 'text-blue-600 dark:text-blue-300',
  },
  purple: {
    iconBg: 'bg-purple-600/12 dark:bg-purple-400/20',
    icon: 'text-purple-600 dark:text-purple-300',
  },
  green: {
    iconBg: 'bg-green-600/12 dark:bg-green-400/20',
    icon: 'text-green-600 dark:text-green-300',
  },
  orange: {
    iconBg: 'bg-orange-600/12 dark:bg-orange-400/20',
    icon: 'text-orange-600 dark:text-orange-300',
  },
  cyan: {
    iconBg: 'bg-cyan-600/12 dark:bg-cyan-400/20',
    icon: 'text-cyan-600 dark:text-cyan-300',
  },
  pink: {
    iconBg: 'bg-pink-600/12 dark:bg-pink-400/20',
    icon: 'text-pink-600 dark:text-pink-300',
  },
  yellow: {
    iconBg: 'bg-yellow-500/15 dark:bg-yellow-400/18',
    icon: 'text-yellow-700 dark:text-yellow-300',
  },
  teal: {
    iconBg: 'bg-teal-600/12 dark:bg-teal-400/20',
    icon: 'text-teal-600 dark:text-teal-300',
  },
  indigo: {
    iconBg: 'bg-indigo-600/12 dark:bg-indigo-400/20',
    icon: 'text-indigo-600 dark:text-indigo-300',
  },
  amber: {
    iconBg: 'bg-amber-600/12 dark:bg-amber-400/20',
    icon: 'text-amber-600 dark:text-amber-300',
  },
  emerald: {
    iconBg: 'bg-emerald-600/12 dark:bg-emerald-400/20',
    icon: 'text-emerald-600 dark:text-emerald-300',
  },
};

const RECENT_KEY = (slug: string) => `sorika_recent_apps_${slug}`;

function saveRecentApp(slug: string, moduleId: string) {
  try {
    const existing: string[] = JSON.parse(localStorage.getItem(RECENT_KEY(slug)) || '[]');
    const updated = [moduleId, ...existing.filter((id) => id !== moduleId)].slice(0, 4);
    localStorage.setItem(RECENT_KEY(slug), JSON.stringify(updated));
  } catch {}
}

export default function DashboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return;
    const parsed = JSON.parse(userData);
    const localCompany = parsed.companies?.find((c: any) => c.slug === slug);
    if (!localCompany) return;

    // Affichage immédiat depuis localStorage (pas de flash)
    setCompany(localCompany);

    // Fetch les modules frais depuis l'API pour être toujours à jour
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/companies/slug/${slug}`)
      .then((r) => r.ok ? r.json() : null)
      .then((fresh) => {
        if (!fresh) return;
        // Mettre à jour le state avec les modules frais
        setCompany((prev: any) => ({ ...prev, modules: fresh.modules }));
        // Mettre à jour le localStorage pour que le layout soit aussi cohérent
        try {
          const raw = localStorage.getItem('user');
          if (!raw) return;
          const data = JSON.parse(raw);
          data.companies = data.companies.map((c: any) =>
            c.slug === slug ? { ...c, modules: fresh.modules } : c
          );
          localStorage.setItem('user', JSON.stringify(data));
        } catch {}
      })
      .catch(() => {}); // silencieux — on garde les données localStorage en fallback
  }, [slug]);

  if (!company) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  // Organiser les modules par catégorie
  const categorizedModules = MODULE_CATEGORIES.map(category => ({
    ...category,
    modules: category.modules.filter(m => company.modules?.includes(m.id)),
  })).filter(category => category.modules.length > 0);

  const handleAppClick = (moduleId: string, href: string) => {
    saveRecentApp(slug, moduleId);
    window.location.href = href;
  };

  return (
    <div className="space-y-2">
      {/* Applications par catégorie */}
      {categorizedModules.map((category) => (
        <Card key={category.name} className="border border-border">
          <CardHeader className="pb-0.5 pt-2 px-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {category.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-2 pt-1.5">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              {category.modules.map((mod) => {
                const c = COLORS[mod.color];
                const Icon = mod.icon;
                return (
                  <button
                    key={mod.id}
                    onClick={() => handleAppClick(mod.id, mod.href(slug))}
                    type="button"
                    className="group flex w-full items-center gap-3 rounded-lg border border-border bg-card p-3 text-left text-card-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-accent/60 dark:hover:bg-accent/30"
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${c.iconBg}`}
                    >
                      <Icon className={`h-4 w-4 ${c.icon}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{mod.name}</p>
                      <p className="text-xs text-muted-foreground truncate leading-tight">{mod.description}</p>
                    </div>
                    <ArrowRight className={`h-3.5 w-3.5 ${c.icon} opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0`} />
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
