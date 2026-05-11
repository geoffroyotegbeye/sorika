'use client';

import { use, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  TrendingUp,
  Target,
  Award,
  Building2,
  UserCheck,
} from 'lucide-react';
import { api } from '@/lib/api';

interface CRMAnalytics {
  contactsByStatus: Array<{ status: string; _count: number }>;
  opportunitiesByStage: Array<{
    stage: string;
    _count: number;
    _sum: { amount: number | null };
  }>;
  conversionRate: number;
  totalOpportunities: number;
  wonOpportunities: number;
}

export default function CustomersAnalyticsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [data, setData] = useState<CRMAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await api.get<CRMAnalytics>(
          `/companies/${slug}/analytics/crm`,
        );
        setData(result);
      } catch (error) {
        console.error('Error fetching CRM analytics:', error);
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

  const getStageLabel = (stage: string) => {
    const labels: Record<string, string> = {
      LEAD: 'Lead',
      QUALIFIED: 'Qualifié',
      PROPOSAL: 'Proposition',
      NEGOTIATION: 'Négociation',
      WON: 'Gagné',
      LOST: 'Perdu',
    };
    return labels[stage] || stage;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      ACTIVE: 'Actif',
      INACTIVE: 'Inactif',
      LEAD: 'Lead',
      CUSTOMER: 'Client',
    };
    return labels[status] || status;
  };

  const totalContacts = data?.contactsByStatus.reduce(
    (sum, item) => sum + item._count,
    0,
  ) || 0;

  const totalOpportunitiesValue =
    data?.opportunitiesByStage.reduce(
      (sum, item) => sum + (item._sum.amount || 0),
      0,
    ) || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Clients & CRM</h1>
        <p className="text-sm text-slate-500">
          Analyse de votre pipeline commercial et de vos contacts
        </p>
      </div>

      {/* KPIs CRM */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Contacts
              </CardTitle>
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {totalContacts}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Contacts dans la base
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">
                Opportunités
              </CardTitle>
              <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {data?.totalOpportunities || 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              En cours et clôturées
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">
                Taux de conversion
              </CardTitle>
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {data?.conversionRate.toFixed(1)}%
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {data?.wonOpportunities} opportunités gagnées
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">
                Valeur du pipeline
              </CardTitle>
              <div className="h-8 w-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <Award className="h-4 w-4 text-amber-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(totalOpportunitiesValue)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Montant total des opportunités
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analyses détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contacts par statut */}
        <Card className="border border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-900">
              Contacts par statut
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data && data.contactsByStatus.length > 0 ? (
              <div className="space-y-3">
                {data.contactsByStatus.map((item, index) => {
                  const percentage =
                    totalContacts > 0 ? (item._count / totalContacts) * 100 : 0;

                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700">
                          {getStatusLabel(item.status)}
                        </span>
                        <span className="text-sm text-slate-600">
                          {item._count} ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-8">
                Aucun contact disponible
              </p>
            )}
          </CardContent>
        </Card>

        {/* Opportunités par étape */}
        <Card className="border border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-900">
              Pipeline des opportunités
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data && data.opportunitiesByStage.length > 0 ? (
              <div className="space-y-3">
                {data.opportunitiesByStage.map((item, index) => {
                  const maxCount = Math.max(
                    ...data.opportunitiesByStage.map((s) => s._count),
                  );
                  const percentage =
                    maxCount > 0 ? (item._count / maxCount) * 100 : 0;

                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700">
                          {getStageLabel(item.stage)}
                        </span>
                        <span className="text-sm text-slate-600">
                          {item._count} • {formatCurrency(item._sum.amount || 0)}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${Math.max(percentage, 5)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-8">
                Aucune opportunité disponible
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Analyses avancées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-900">
              Segmentation clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500 text-center py-8">
              Analyse par secteur, taille et valeur - Disponible prochainement
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-900">
              Performance commerciale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500 text-center py-8">
              Taux de closing par commercial - Disponible prochainement
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
