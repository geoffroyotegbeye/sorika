'use client';

import { useParams } from 'next/navigation';
import { CRMStats } from '@/components/crm/CRMStats';

export default function CRMDashboardPage() {
  const params = useParams();
  const companyId = params.slug as string;

  return (
    <div>
      <CRMStats companyId={companyId} />
    </div>
  );
}
