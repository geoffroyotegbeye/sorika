'use client';

import { use, useEffect, useState } from 'react';
import { usePositions } from '@/hooks/usePositions';
import { PositionFormDialog } from '@/components/hr/PositionFormDialog';
import { PositionsList } from '@/components/hr/PositionsList';
import { PageHeader } from '@/components/layout/PageHeader';

export default function PositionsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return;
    const parsed = JSON.parse(userData);
    const currentCompany = parsed.companies?.find((c: any) => c.slug === slug);
    setCompany(currentCompany ?? null);
  }, [slug]);

  const { positions, loading, fetchPositions } = usePositions(company?.id ?? '');

  useEffect(() => {
    if (company?.id) {
      fetchPositions();
    }
  }, [company?.id, fetchPositions]);

  if (!company) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Postes"
        description={`${positions.length} poste${positions.length > 1 ? 's' : ''}`}
        breadcrumbs={[
          { label: 'RH', href: `/dashboard/${slug}/hr` },
          { label: 'Postes' },
        ]}
        actions={<PositionFormDialog companyId={company.id} onSuccess={fetchPositions} />}
      />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <PositionsList
          companyId={company.id}
          companySlug={slug}
          positions={positions}
          onRefresh={fetchPositions}
        />
      )}
    </div>
  );
}
