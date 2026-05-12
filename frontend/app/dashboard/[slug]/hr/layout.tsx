'use client';

import { use } from 'react';
import { ModuleSidebar } from '@/components/layout/ModuleSidebar';
import { getModuleConfig } from '@/config/modules.config';

export default function HRLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const moduleConfig = getModuleConfig('hr');

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
      <div className="min-h-screen flex-1 overflow-auto bg-background pl-64 p-4 lg:p-6">
        {children}
      </div>
    </div>
  );
}
