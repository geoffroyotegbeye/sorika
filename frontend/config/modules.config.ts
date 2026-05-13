import {
  LayoutDashboard,
  Users,
  Building2,
  TrendingUp,
  Calendar,
  ClipboardCheck,
  Receipt,
  Briefcase,
  Network,
  FileText,
  Image,
  ShoppingBag,
  BarChart3,
  MessageSquare,
  BookOpen,
  Calculator,
  CreditCard,
  ShoppingCart,
  Package,
  AlertTriangle,
  ArrowUpDown,
  FolderTree,
  Banknote,
  DollarSign,
  ListChecks,
  Star,
  Wallet,
  Settings,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface ModuleMenuItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
}

export interface ModuleConfig {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  menu: ModuleMenuItem[];
}

export const MODULES_CONFIG: Record<string, ModuleConfig> = {
  crm: {
    id: 'CRM',
    name: 'CRM',
    description: 'Gestion de la relation client',
    icon: Users,
    color: 'green',
    menu: [
      {
        name: 'Dashboard',
        href: '/crm',
        icon: LayoutDashboard,
      },
      {
        name: 'Contacts',
        href: '/crm/contacts',
        icon: Users,
      },
      {
        name: 'Entreprises',
        href: '/crm/companies',
        icon: Building2,
      },
      {
        name: 'Opportunités',
        href: '/crm/opportunities',
        icon: TrendingUp,
      },
      {
        name: 'Activités',
        href: '/crm/activities',
        icon: Calendar,
      },
    ],
  },
  hr: {
    id: 'HR',
    name: 'Ressources Humaines',
    description: 'Gestion des employés et départements',
    icon: Briefcase,
    color: 'teal',
    menu: [
      {
        name: 'Dashboard',
        href: '/hr',
        icon: LayoutDashboard,
      },
      {
        name: 'Employés',
        href: '/hr/employees',
        icon: Users,
      },
      {
        name: 'Départements',
        href: '/hr/departments',
        icon: Building2,
      },
      {
        name: 'Postes',
        href: '/hr/positions',
        icon: Briefcase,
      },
      {
        name: 'Organigramme',
        href: '/hr/organigramme',
        icon: Network,
      },
      {
        name: 'Présences',
        href: '/hr/attendance',
        icon: ClipboardCheck,
      },
      {
        name: 'Congés',
        href: '/hr/leaves',
        icon: Calendar,
      },
      {
        name: 'Notes de frais',
        href: '/hr/expenses',
        icon: Receipt,
      },
      {
        name: 'Acomptes',
        href: '/hr/advances',
        icon: Wallet,
      },
      {
        name: 'Paie',
        href: '/hr/payroll',
        icon: Calculator,
      },
    ],
  },
  accounting: {
    id: 'ACCOUNTING',
    name: 'Comptabilité',
    description: 'Facturation, devis et suivi financier',
    icon: Calculator,
    color: 'blue',
    menu: [
      { name: 'Dashboard', href: '/accounting', icon: LayoutDashboard },
      { name: 'Factures', href: '/accounting/invoices', icon: FileText },
      { name: 'Devis', href: '/accounting/quotes', icon: Receipt },
      { name: 'Charges', href: '/accounting/bills', icon: ShoppingCart },
      { name: 'Fournisseurs', href: '/accounting/suppliers', icon: Building2 },
    ],
  },
  'site-vitrine': {
    id: 'LANDING_PAGE',
    name: 'Site Vitrine',
    description: 'Éditeur no-code de votre site web',
    icon: FileText,
    color: 'blue',
    menu: [
      {
        name: 'Dashboard',
        href: '/site-vitrine',
        icon: LayoutDashboard,
      },
    ],
  },
  media: {
    id: 'MEDIA',
    name: 'Médiathèque',
    description: 'Images, vidéos et fichiers',
    icon: Image,
    color: 'purple',
    menu: [
      {
        name: 'Tous les médias',
        href: '/media',
        icon: Image,
      },
    ],
  },
  inventory: {
    id: 'INVENTORY',
    name: 'Inventaire',
    description: 'Gestion des stocks et produits',
    icon: Package,
    color: 'amber',
    menu: [
      {
        name: 'Dashboard',
        href: '/inventory',
        icon: LayoutDashboard,
      },
      {
        name: 'Produits',
        href: '/inventory/products',
        icon: Package,
      },
      {
        name: 'Catégories',
        href: '/inventory/categories',
        icon: FolderTree,
      },
      {
        name: 'Mouvements',
        href: '/inventory/movements',
        icon: ArrowUpDown,
      },
      {
        name: 'Alertes',
        href: '/inventory/alerts',
        icon: AlertTriangle,
      },
    ],
  },
  pos: {
    id: 'POS',
    name: 'Point de Vente',
    description: 'Caisse et ventes en magasin',
    icon: Banknote,
    color: 'emerald',
    menu: [
      {
        name: 'Dashboard',
        href: '/pos',
        icon: LayoutDashboard,
      },
      {
        name: 'Caisse',
        href: '/pos/cashier',
        icon: DollarSign,
      },
      {
        name: 'Caisses',
        href: '/pos/registers',
        icon: Banknote,
      },
      {
        name: 'Sessions',
        href: '/pos/sessions',
        icon: ClipboardCheck,
      },
      {
        name: 'Ventes',
        href: '/pos/sales',
        icon: ListChecks,
      },
    ],
  },
  analytics: {
    id: 'ANALYTICS',
    name: 'Analytics',
    description: 'Analyses et rapports avancés',
    icon: BarChart3,
    color: 'indigo',
    menu: [
      {
        name: 'Dashboard',
        href: '/analytics',
        icon: LayoutDashboard,
      },
      {
        name: 'Ventes & Performance',
        href: '/analytics/sales',
        icon: TrendingUp,
      },
      {
        name: 'Clients & CRM',
        href: '/analytics/customers',
        icon: Users,
      },
      {
        name: 'Produits & Inventaire',
        href: '/analytics/products',
        icon: Package,
      },
      {
        name: 'Équipe & RH',
        href: '/analytics/team',
        icon: Briefcase,
      },
      {
        name: 'Rapports',
        href: '/analytics/reports',
        icon: FileText,
      },
    ],
  },
  projects: {
    id: 'PROJECTS',
    name: 'Projets',
    description: 'Gestion de projets et tâches',
    icon: ListChecks,
    color: 'cyan',
    menu: [
      {
        name: 'Dashboard',
        href: '/projects',
        icon: LayoutDashboard,
      },
      {
        name: 'Projets',
        href: '/projects/list',
        icon: Briefcase,
      },
      {
        name: 'Tâches',
        href: '/projects/tasks',
        icon: ListChecks,
      },
      {
        name: 'Temps',
        href: '/projects/time',
        icon: Calendar,
      },
    ],
  },
  ecommerce: {
    id: 'ECOMMERCE',
    name: 'E-Commerce',
    description: 'Boutique et commandes en ligne',
    icon: ShoppingCart,
    color: 'orange',
    menu: [
      {
        name: 'Dashboard',
        href: '/ecommerce',
        icon: LayoutDashboard,
      },
      {
        name: 'Boutique',
        href: '/ecommerce/shop',
        icon: Package,
      },
      {
        name: 'Commandes',
        href: '/ecommerce/orders',
        icon: ShoppingCart,
      },
      {
        name: 'Codes promo',
        href: '/ecommerce/coupons',
        icon: Receipt,
      },
      {
        name: 'Avis',
        href: '/ecommerce/reviews',
        icon: Star,
      },
    ],
  },
};

// Helper pour obtenir le module actif depuis le pathname
export function getActiveModule(pathname: string): string | null {
  const match = pathname.match(/\/dashboard\/[^/]+\/([^/]+)/);
  return match ? match[1] : null;
}

// Helper pour obtenir la configuration d'un module
export function getModuleConfig(moduleKey: string): ModuleConfig | null {
  return MODULES_CONFIG[moduleKey] || null;
}
