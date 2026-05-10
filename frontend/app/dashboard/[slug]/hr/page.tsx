'use client';

import { use, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, DollarSign, TrendingUp, Building2 } from 'lucide-react';
import { useAttendance } from '@/hooks/useAttendance';

export default function HRDashboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return;
    const parsed = JSON.parse(userData);
    const currentCompany = parsed.companies?.find((c: any) => c.slug === slug);
    setCompany(currentCompany ?? null);
  }, [slug]);

  const { stats, fetchStats } = useAttendance(company?.id ?? '');

  useEffect(() => {
    if (company?.id) {
      fetchStats();
    }
  }, [company?.id, fetchStats]);

  if (!company || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Effectif total */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Effectif Total</CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.totalEmployees}</div>
            <p className="text-xs text-slate-500 mt-1">
              {stats.activeEmployees} actifs
            </p>
          </CardContent>
        </Card>

        {/* Taux de présence */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Taux de Présence</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.attendanceRate}%</div>
            <p className="text-xs text-slate-500 mt-1">Ce mois-ci</p>
          </CardContent>
        </Card>

        {/* Congés en cours */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Congés en Cours</CardTitle>
            <Calendar className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.ongoingLeaves}</div>
            <p className="text-xs text-slate-500 mt-1">
              {stats.pendingLeaves} en attente
            </p>
          </CardContent>
        </Card>

        {/* Notes de frais */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Notes de Frais</CardTitle>
            <DollarSign className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.pendingExpenses}</div>
            <p className="text-xs text-slate-500 mt-1">En attente de validation</p>
          </CardContent>
        </Card>

        {/* Départements */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Départements</CardTitle>
            <Building2 className="h-5 w-5 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.departments.length === 0 ? (
                <p className="text-sm text-slate-500">Aucun département configuré</p>
              ) : (
                stats.departments.map((dept) => (
                  <div key={dept.id} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">{dept.name}</span>
                    <span className="text-sm text-slate-500">
                      {dept.employeeCount} {dept.employeeCount > 1 ? 'employés' : 'employé'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
