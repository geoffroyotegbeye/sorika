'use client';

import { use, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, FileText, Receipt, AlertCircle, ShoppingCart } from 'lucide-react';
import { useAccounting } from '@/hooks/useAccounting';
import { PageHeader } from '@/components/layout/PageHeader';

export default function AccountingDashboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return;
    const parsed = JSON.parse(userData);
    const c = parsed.companies?.find((c: any) => c.slug === slug);
    setCompany(c ?? null);
  }, [slug]);

  const { stats, fetchStats } = useAccounting(company?.id ?? '');

  useEffect(() => {
    if (company?.id) fetchStats();
  }, [company?.id, fetchStats]);

  if (!company || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  const currency = company.currency ?? 'XOF';
  const fmt = (n: number) => n.toLocaleString('fr-FR') + ' ' + currency;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tableau de bord Comptabilité"
        description="Vue d'ensemble de votre activité financière"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">CA du mois</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{fmt(stats.monthRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">Factures payées ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">CA annuel</CardTitle>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{fmt(stats.yearRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">Factures payées cette année</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">À encaisser</CardTitle>
            <FileText className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{fmt(stats.totalReceivable)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.overdueInvoices > 0 && (
                <span className="text-red-600 font-medium">{stats.overdueInvoices} en retard · </span>
              )}
              Factures non payées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">À payer</CardTitle>
            <ShoppingCart className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{fmt(stats.totalPayable)}</div>
            <p className="text-xs text-muted-foreground mt-1">{stats.pendingBills} charge(s) en attente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Factures en retard</CardTitle>
            <AlertCircle className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdueInvoices}</div>
            <p className="text-xs text-muted-foreground mt-1">Nécessitent une relance</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
