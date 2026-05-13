'use client';

import { use } from 'react';
import { ModuleSidebar } from '@/components/layout/ModuleSidebar';
import { getModuleConfig } from '@/config/modules.config';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/hooks/useSidebar';

export default function ProjectsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const moduleConfig = getModuleConfig('projects');
  const { isCollapsed } = useSidebar();

  if (!moduleConfig) {
    return <div>{children}</div>;
  }

  // Convertir les items du menu en format attendu par ModuleSidebar
  const sidebarItems = moduleConfig.menu.map((item) => ({
    ...item,
    href: `/dashboard/${slug}${item.href}`,
  }));

  return (
    <div className="flex min-h-screen bg-background">
      <ModuleSidebar
        title={moduleConfig.name}
        items={sidebarItems}
        companySlug={slug}
      />
      <div className={cn(
        "min-h-screen flex-1 overflow-auto bg-background p-4 lg:p-6 transition-all duration-300",
        isCollapsed ? "pl-16" : "pl-64"
      )}>
        {children}
      </div>
    </div>
  );
}
