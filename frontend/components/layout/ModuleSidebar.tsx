'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LucideIcon, Grid3x3, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebar } from '@/hooks/useSidebar';

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
  const { isCollapsed, toggle, initialize } = useSidebar();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      const currentCompany = parsed.companies?.find((c: any) => c.slug === companySlug);
      setCompany(currentCompany);
    }
    // Initialiser l'état de la sidebar
    initialize();
  }, [companySlug, initialize]);

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Bouton Toggle en haut sur la bordure */}
      <button
        onClick={toggle}
        className="absolute -right-3 top-6 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-md hover:bg-sidebar-accent transition-colors"
        aria-label={isCollapsed ? "Ouvrir la sidebar" : "Fermer la sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>

      <div className={cn(
        "flex items-center border-b border-sidebar-border p-5 transition-all",
        isCollapsed ? "justify-center" : "gap-3"
      )}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700">
          <span className="text-base font-bold text-white">
            {company?.name?.[0]?.toUpperCase() || 'S'}
          </span>
        </div>
        {!isCollapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">
              {company?.name || 'Chargement...'}
            </p>
            <p className="truncate text-xs font-medium text-primary">{title}</p>
          </div>
        )}
      </div>

      <div className="border-b border-sidebar-border px-3 py-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/dashboard/${companySlug}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "w-full gap-2 border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isCollapsed ? "justify-center px-0" : "justify-start"
                  )}
                >
                  <Grid3x3 className="h-4 w-4 shrink-0" />
                  {!isCollapsed && "Tous les modules"}
                </Button>
              </Link>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                <p>Tous les modules</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        <TooltipProvider>
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                      isActive
                        ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
                      isCollapsed && 'justify-center'
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1">{item.name}</span>
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
                      </>
                    )}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">
                    <p>{item.name}</p>
                    {item.badge && <span className="ml-2 text-xs">({item.badge})</span>}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>
    </aside>
  );
}
