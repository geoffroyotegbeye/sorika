'use client';

import { useEffect, useState } from 'react';
import { CRMStats as CRMStatsType } from '@/types/crm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, TrendingUp, Calendar, AlertCircle, Trophy } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface CRMStatsProps {
  companyId: string;
}

export function CRMStats({ companyId }: CRMStatsProps) {
  const [stats, setStats] = useState<CRMStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          `${API_URL}/companies/${companyId}/crm/stats`,
          {
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': localStorage.getItem('userId') || '',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [companyId]);

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Chargement...</div>;
  }

  if (!stats) {
    return <div className="text-center py-8 text-muted-foreground">Aucune donnée disponible</div>;
  }

  return (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Contacts
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.contacts.total}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats.contacts.byStatus.LEAD || 0} leads,{' '}
              {stats.contacts.byStatus.CLIENT || 0} clients
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Entreprises
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.companies.total}</div>
            <div className="text-xs text-muted-foreground mt-1">Entreprises clientes</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pipeline
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.pipeline.totalValue.toLocaleString()} XOF
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Taux de conversion: {stats.pipeline.conversionRate}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Deals Gagnés
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pipeline.wonDeals.count}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats.pipeline.wonDeals.value.toLocaleString()} XOF
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activités */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Aujourd'hui
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activities.today}</div>
            <div className="text-xs text-muted-foreground mt-1">Activités prévues</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cette semaine
            </CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activities.thisWeek}</div>
            <div className="text-xs text-muted-foreground mt-1">Activités à venir</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En retard
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activities.overdue}</div>
            <div className="text-xs text-muted-foreground mt-1">Activités en retard</div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline par étape */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline par étape</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.pipeline.byStage.map((stage) => (
              <div key={stage.stage} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{stage.stage}</span>
                    <span className="text-sm text-muted-foreground">
                      {stage.count} opportunité{stage.count > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(stage.value / stats.pipeline.totalValue) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <span className="ml-4 text-sm font-medium">
                  {stage.value.toLocaleString()} XOF
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top commerciaux */}
      {stats.topSalespeople.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Commerciaux</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topSalespeople.map((salesperson, index) => (
                <div
                  key={salesperson.user.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">
                        {salesperson.user.firstName} {salesperson.user.lastName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {salesperson.dealsWon} deal{salesperson.dealsWon > 1 ? 's' : ''}{' '}
                        gagné{salesperson.dealsWon > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {salesperson.revenue.toLocaleString()} XOF
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
