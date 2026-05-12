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
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-3 border-b border-sidebar-border p-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700">
          <span className="text-base font-bold text-white">
            {company?.name?.[0]?.toUpperCase() || 'S'}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-sidebar-foreground">
            {company?.name || 'Chargement...'}
          </p>
          <p className="truncate text-xs font-medium text-primary">{title}</p>
        </div>
      </div>

      <div className="border-b border-sidebar-border px-3 py-3">
        <Link href={`/dashboard/${companySlug}`}>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2 border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Grid3x3 className="h-4 w-4" />
            Tous les modules
          </Button>
        </Link>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                isActive
                  ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs font-medium',
                    isActive
                      ? 'bg-primary/20 text-primary'
                      : 'bg-foreground/10 text-sidebar-foreground/90',
                  )}
                >
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
