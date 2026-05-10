'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LucideIcon, Grid3x3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface SidebarItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
}

interface ModuleSidebarProps {
  title: string;
  items: SidebarItem[];
  companySlug: string;
}

export function ModuleSidebar({ title, items, companySlug }: ModuleSidebarProps) {
  const pathname = usePathname();
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      const currentCompany = parsed.companies?.find((c: any) => c.slug === companySlug);
      setCompany(currentCompany);
    }
  }, [companySlug]);

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col">
      {/* En-tête avec nom de l'organisation */}
      <div className="flex items-center gap-3 p-5 border-b border-slate-100">
        <div className="h-9 w-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-base">
            {company?.name?.[0]?.toUpperCase() || 'S'}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm text-slate-900 truncate">
            {company?.name || 'Chargement...'}
          </p>
          <p className="text-xs text-blue-600 font-medium truncate">{title}</p>
        </div>
      </div>

      {/* Bouton retour aux modules */}
      <div className="px-3 py-3 border-b border-slate-100">
        <Link href={`/dashboard/${companySlug}`}>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2 text-slate-600 hover:text-slate-900"
          >
            <Grid3x3 className="h-4 w-4" />
            Tous les modules
          </Button>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-50'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className={cn(
                  'px-2 py-0.5 text-xs font-medium rounded-full',
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-slate-100 text-slate-600'
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
