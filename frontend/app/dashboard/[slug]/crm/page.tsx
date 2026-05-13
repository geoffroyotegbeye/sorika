'use client';

import { useParams } from 'next/navigation';
import { CRMStats } from '@/components/crm/CRMStats';
import { PageHeader } from '@/components/layout/PageHeader';

export default function CRMDashboardPage() {
  const params = useParams();
  const companyId = params.slug as string;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tableau de bord CRM"
        description="Vue d'ensemble de votre activité commerciale"
      />
      <CRMStats companyId={companyId} />
    </div>
  );
}
