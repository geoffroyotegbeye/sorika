'use client';

import { use, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePOS } from '@/hooks/usePOS';
import type { POSDashboard } from '@/types/pos';
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Banknote,
  Users,
  Package,
} from 'lucide-react';

export default function POSDashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [companyId, setCompanyId] = useState<string>('');
  const [dashboard, setDashboard] = useState<POSDashboard | null>(null);
  const { getDashboard, loading } = usePOS(companyId);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return;
    const parsed = JSON.parse(userData);
    const company = parsed.companies?.find((c: any) => c.slug === slug);
    if (company) {
      setCompanyId(company.id);
    }
  }, [slug]);

  useEffect(() => {
    if (!companyId) return;
    loadDashboard();
  }, [companyId]);

  const loadDashboard = async () => {
    const data = await getDashboard();
    if (data) setDashboard(data);
  };

  if (loading || !dashboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Point de Vente</h1>
        <p className="text-sm text-slate-500 mt-1">
          Vue d'ensemble des ventes et sessions actives
        </p>
      </div>

      {/* Statistiques du jour */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Chiffre d'affaires
            </CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(dashboard.today.revenue)} XOF
            </div>
            <p className="text-xs text-slate-500 mt-1">Aujourd'hui</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Transactions
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {dashboard.today.transactions}
            </div>
            <p className="text-xs text-slate-500 mt-1">Ventes réalisées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Panier moyen
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(dashboard.today.averageBasket)} XOF
            </div>
            <p className="text-xs text-slate-500 mt-1">Par transaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Sessions ouvertes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5 text-emerald-600" />
            Sessions ouvertes ({dashboard.openSessions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dashboard.openSessions.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Banknote className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p className="text-sm">Aucune session ouverte</p>
              <p className="text-xs mt-1">
                Ouvrez une caisse pour commencer à vendre
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {dashboard.openSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Banknote className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {session.register?.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        <Users className="h-3 w-3 inline mr-1" />
                        {session.cashier?.firstName} {session.cashier?.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">
                      {session._count?.sales || 0} ventes
                    </p>
                    <p className="text-xs text-slate-500">
                      Ouvert à{' '}
                      {new Date(session.openedAt).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top produits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-amber-600" />
            Top produits du jour
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dashboard.topProducts.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Package className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p className="text-sm">Aucune vente aujourd'hui</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dashboard.topProducts.map((item, index) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-amber-100 rounded-lg flex items-center justify-center text-sm font-bold text-amber-600">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {item.product.name}
                      </p>
                      {item.product.sku && (
                        <p className="text-xs text-slate-500">
                          SKU: {item.product.sku}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">
                      {formatCurrency(item.revenue)} XOF
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.quantitySold} vendus
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
