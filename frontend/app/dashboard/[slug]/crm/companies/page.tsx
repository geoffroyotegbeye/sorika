'use client';

import { useParams } from 'next/navigation';
import { CompaniesList } from '@/components/crm/CompaniesList';

export default function CompaniesPage() {
  const params = useParams();
  const companyId = params.slug as string;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Entreprises</h1>
      </div>
      <CompaniesList companyId={companyId} />
    </div>
  );
}
