'use client';

import { use, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useHR } from '@/hooks/useHR';
import { Users, User } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { OrgChart } from '@/components/hr/OrgChart';
import type { Employee } from '@/types/hr';

export default function OrganigrammePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return;
    const parsed = JSON.parse(userData);
    const currentCompany = parsed.companies?.find((c: any) => c.slug === slug);
    setCompany(currentCompany ?? null);
  }, [slug]);

  const { employees, loading, fetchEmployees } = useHR(company?.id ?? '');

  useEffect(() => {
    if (company?.id) {
      fetchEmployees();
    }
  }, [company?.id, fetchEmployees]);

  if (!company) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  const managers = employees.filter((emp) => emp._count && emp._count.subordinates > 0).length;
  const topLevelCount = employees.filter((emp) => !emp.managerId).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Organigramme"
        description="Structure hiérarchique de l'entreprise"
        breadcrumbs={[
          { label: 'RH', href: `/dashboard/${slug}/hr` },
          { label: 'Organigramme' },
        ]}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total employés</p>
                <p className="text-2xl font-bold text-foreground">{employees.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Managers</p>
                <p className="text-2xl font-bold text-foreground">{managers}</p>
              </div>
              <User className="h-8 w-8 text-purple-500 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Direction</p>
                <p className="text-2xl font-bold text-foreground">{topLevelCount}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Organigramme visuel */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <OrgChart employees={employees} />
      )}
    </div>
  );
}
