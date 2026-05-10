'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  Home, Users, FileText, Image, UserCircle, Briefcase,
  Calculator, ShoppingCart, BarChart3, MessageSquare, BookOpen,
  Settings, Receipt, CreditCard, Building2, ClipboardList,
  Calendar, User, LayoutTemplate,
} from 'lucide-react';

interface SearchItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  href: string;
  group: string;
}

interface GlobalSearchProps {
  slug: string;
  modules: string[];
}

export function GlobalSearch({ slug, modules }: GlobalSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  // Cmd+K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(o => !o);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Réinitialiser la query à la fermeture
  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const go = useCallback((href: string) => {
    setOpen(false);
    router.push(href);
  }, [router]);

  const d = (path: string) => `/dashboard/${slug}${path}`;

  const allItems: SearchItem[] = [
    // Général
    { id: 'home',     label: 'Tableau de bord',  icon: Home,          href: d(''),              group: 'Général' },
    { id: 'members',  label: 'Membres',           icon: Users,         href: d('/members'),      group: 'Général' },
    { id: 'settings', label: 'Paramètres',        icon: Settings,      href: d('/settings'),     group: 'Général' },

    // Site vitrine
    ...(modules.includes('LANDING_PAGE') ? [
      { id: 'site',   label: 'Site Vitrine',      icon: LayoutTemplate, href: d('/site-vitrine'), group: 'Site Vitrine' },
    ] : []),

    // Médias
    ...(modules.includes('MEDIA') ? [
      { id: 'media',  label: 'Médiathèque',       icon: Image,         href: d('/media'),        group: 'Médias' },
    ] : []),

    // CRM
    ...(modules.includes('CRM') ? [
      { id: 'crm',          label: 'CRM — Vue d\'ensemble',  icon: UserCircle,   href: d('/crm'),                  group: 'CRM' },
      { id: 'crm-contacts', label: 'CRM — Contacts',         icon: User,         href: d('/crm/contacts'),         group: 'CRM' },
      { id: 'crm-companies',label: 'CRM — Entreprises',      icon: Building2,    href: d('/crm/companies'),        group: 'CRM' },
      { id: 'crm-opps',     label: 'CRM — Opportunités',     icon: ClipboardList,href: d('/crm/opportunities'),    group: 'CRM' },
      { id: 'crm-activities',label: 'CRM — Activités',       icon: Calendar,     href: d('/crm/activities'),       group: 'CRM' },
    ] : []),

    // RH
    ...(modules.includes('HR') ? [
      { id: 'hr',           label: 'RH — Vue d\'ensemble',   icon: Briefcase,    href: d('/hr'),                   group: 'RH' },
      { id: 'hr-employees', label: 'RH — Employés',          icon: Users,        href: d('/hr/employees'),         group: 'RH' },
      { id: 'hr-depts',     label: 'RH — Départements',      icon: Building2,    href: d('/hr/departments'),       group: 'RH' },
      { id: 'hr-positions', label: 'RH — Postes',            icon: ClipboardList,href: d('/hr/positions'),         group: 'RH' },
      { id: 'hr-leaves',    label: 'RH — Congés',            icon: Calendar,     href: d('/hr/leaves'),            group: 'RH' },
      { id: 'hr-attendance',label: 'RH — Présences',         icon: User,         href: d('/hr/attendance'),        group: 'RH' },
      { id: 'hr-expenses',  label: 'RH — Notes de frais',    icon: Receipt,      href: d('/hr/expenses'),          group: 'RH' },
      { id: 'hr-org',       label: 'RH — Organigramme',      icon: Briefcase,    href: d('/hr/organigramme'),      group: 'RH' },
    ] : []),

    // Comptabilité
    ...(modules.includes('ACCOUNTING') ? [
      { id: 'acc',          label: 'Comptabilité — Vue d\'ensemble', icon: Calculator, href: d('/accounting'),              group: 'Comptabilité' },
      { id: 'acc-invoices', label: 'Comptabilité — Factures',        icon: FileText,   href: d('/accounting/invoices'),     group: 'Comptabilité' },
      { id: 'acc-quotes',   label: 'Comptabilité — Devis',           icon: FileText,   href: d('/accounting/quotes'),       group: 'Comptabilité' },
      { id: 'acc-bills',    label: 'Comptabilité — Charges',         icon: Receipt,    href: d('/accounting/bills'),        group: 'Comptabilité' },
      { id: 'acc-suppliers',label: 'Comptabilité — Fournisseurs',    icon: Building2,  href: d('/accounting/suppliers'),    group: 'Comptabilité' },
      { id: 'acc-payments', label: 'Comptabilité — Paiements',       icon: CreditCard, href: d('/accounting/payments'),     group: 'Comptabilité' },
    ] : []),
  ];

  // Grouper
  const groups = Array.from(new Set(allItems.map(i => i.group)));

  // Filtrage manuel à partir de 2 caractères
  const filtered = query.length >= 2
    ? allItems.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredGroups = Array.from(new Set(filtered.map(i => i.group)));

  return (
    <>
      {/* Input déclencheur dans la topbar */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 w-full max-w-md px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-400 hover:border-blue-300 hover:bg-white transition-colors text-left"
      >
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <span className="flex-1">Rechercher...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs font-mono bg-slate-200 text-slate-500 rounded">
          <span>⌘</span><span>K</span>
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <VisuallyHidden>
          <DialogTitle>Recherche globale</DialogTitle>
        </VisuallyHidden>
        <CommandInput
          placeholder="Tapez au moins 2 caractères..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {query.length < 2 ? (
            <div className="py-8 text-center text-sm text-slate-400">
              Commencez à écrire pour rechercher…
            </div>
          ) : filtered.length === 0 ? (
            <CommandEmpty>Aucun résultat pour « {query} ».</CommandEmpty>
          ) : (
            filteredGroups.map((group, i) => (
              <span key={group}>
                {i > 0 && <CommandSeparator />}
                <CommandGroup heading={group}>
                  {filtered.filter(item => item.group === group).map(item => {
                    const Icon = item.icon;
                    return (
                      <CommandItem
                        key={item.id}
                        value={item.label}
                        onSelect={() => go(item.href)}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <Icon className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>{item.label}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </span>
            ))
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
