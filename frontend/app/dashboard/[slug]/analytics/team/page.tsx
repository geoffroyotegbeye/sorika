'use client';

import { use, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  Briefcase,
  DollarSign,
  TrendingUp,
  Building2,
  UserCheck,
} from 'lucide-react';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/layout/PageHeader';

interface HRAnalytics {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  employeesByDepartment: Record<string, number>;
  totalSalary: number;
}

export default function TeamAnalyticsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [data, setData] = useState<HRAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await api.get<HRAnalytics>(
          `/companies/${slug}/analytics/hr`,
        );
        setData(result);
      } catch (error) {
        console.error('Error fetching HR analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const departments = data
    ? Object.entries(data.employeesByDepartment).sort(
        ([, a], [, b]) => b - a,
      )
    : [];

  const averageSalary =
    data && data.activeEmployees > 0
      ? data.totalSalary / data.activeEmployees
      : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

   return (
     <div className="space-y-6">
       <PageHeader
         title="Équipe & RH"
         description="Analyse de vos ressources humaines et performance d'équipe"
         breadcrumbs={[
           { label: 'Analytics', href: `/dashboard/${slug}/analytics` },
           { label: 'Équipe' },
         ]}
       />

      {/* KPIs RH */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Employés
              </CardTitle>
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {data?.totalEmployees || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {data?.activeEmployees || 0} actifs
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Employés actifs
              </CardTitle>
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {data?.activeEmployees || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {data?.inactiveEmployees || 0} inactifs
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Masse salariale
              </CardTitle>
              <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(data?.totalSalary || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total mensuel</p>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Salaire moyen
              </CardTitle>
              <div className="h-8 w-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-amber-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(averageSalary)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Par employé actif</p>
          </CardContent>
        </Card>
      </div>

      {/* Analyses détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition par département */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              Répartition par département
            </CardTitle>
          </CardHeader>
          <CardContent>
            {departments.length > 0 ? (
              <div className="space-y-3">
                {departments.map(([name, count], index) => {
                  const maxCount = Math.max(...departments.map(([, c]) => c));
                  const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">
                            {name}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {count} employé{count > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${Math.max(percentage, 10)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucun département disponible
              </p>
            )}
          </CardContent>
        </Card>

        {/* Statut des employés */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              Statut des employés
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <UserCheck className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Employés actifs
                      </p>
                      <p className="text-xs text-muted-foreground">
                        En poste actuellement
                      </p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-700">
                    {data.activeEmployees}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/40 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Employés inactifs
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Démissions ou licenciements
                      </p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {data.inactiveEmployees}
                  </div>
                </div>

                {data.totalEmployees > 0 && (
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">
                        Taux d'activité
                      </span>
                      <span className="text-xs font-semibold text-foreground">
                        {((data.activeEmployees / data.totalEmployees) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{
                          width: `${(data.activeEmployees / data.totalEmployees) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucune donnée disponible
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Analyses avancées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              Performance par employé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8">
              Ventes et CA par employé - Disponible prochainement
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              Présences et absences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8">
              Taux de présence et congés - Disponible prochainement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Coûts RH */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">
            Analyse des coûts RH
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
              <p className="text-xs text-muted-foreground mb-1">Masse salariale totale</p>
              <p className="text-xl font-bold text-purple-700">
                {formatCurrency(data?.totalSalary || 0)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Par mois</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-muted-foreground mb-1">Coût annuel estimé</p>
              <p className="text-xl font-bold text-blue-700">
                {formatCurrency((data?.totalSalary || 0) * 12)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Sur 12 mois</p>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
              <p className="text-xs text-muted-foreground mb-1">Coût moyen par employé</p>
              <p className="text-xl font-bold text-amber-700">
                {formatCurrency(averageSalary)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Salaire mensuel moyen</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
