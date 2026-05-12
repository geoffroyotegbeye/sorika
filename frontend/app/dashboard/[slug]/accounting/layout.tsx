'use client';

import { use } from 'react';
import { ModuleSidebar } from '@/components/layout/ModuleSidebar';
import { getModuleConfig } from '@/config/modules.config';

export default function AccountingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const moduleConfig = getModuleConfig('accounting');

  if (!moduleConfig) return <div>{children}</div>;

  const sidebarItems = moduleConfig.menu.map((item) => ({
    ...item,
    href: `/dashboard/${slug}${item.href}`,
  }));

  return (
    <div className="flex min-h-screen">
      <ModuleSidebar title={moduleConfig.name} items={sidebarItems} companySlug={slug} />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
