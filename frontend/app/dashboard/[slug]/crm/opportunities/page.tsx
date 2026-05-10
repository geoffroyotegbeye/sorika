'use client';

import { use, useEffect, useState } from 'react';
import { OpportunitiesKanban } from '@/components/crm/OpportunitiesKanban';

export default function OpportunitiesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return;
    const parsed = JSON.parse(userData);
    setCompany(parsed.companies?.find((c: any) => c.slug === slug) ?? null);
  }, [slug]);

  if (!company) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  );

  return (
    <div className="space-y-4 overflow-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Opportunités</h1>
      </div>
      <OpportunitiesKanban companyId={company.id} currency={company.currency ?? 'XOF'} />
    </div>
  );
}
