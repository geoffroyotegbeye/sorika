'use client';

import { useParams } from 'next/navigation';
import { ActivitiesList } from '@/components/crm/ActivitiesList';

export default function ActivitiesPage() {
  const params = useParams();
  const companyId = params.slug as string;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Activités</h1>
      </div>
      <ActivitiesList companyId={companyId} />
    </div>
  );
}
