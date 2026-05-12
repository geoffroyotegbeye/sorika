'use client';

import { use, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Briefcase,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function AnalyticsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [period, setPeriod] = useState('month');
  const { dashboard, revenueTrend, topProducts, loading, fetchDashboard, fetchRevenueTrend, fetchTopProducts } =
    useAnalytics(slug);

  useEffect(() => {
    fetchDashboard(period);
    fetchRevenueTrend(period);
    fetchTopProducts(5);
  }, [period, fetchDashboard, fetchRevenueTrend, fetchTopProducts]);

  if (loading && !dashboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const periodLabels: Record<string, string> = {
    today: "Aujourd'hui",
    week: '7 derniers jours',
    month: '30 derniers jours',
    year: 'Cette année',
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Vue d'ensemble de votre activité
          </p>
        </div>

        {/* Sélecteur de période */}
        <div className="flex gap-2">
          {['today', 'week', 'month', 'year'].map((p) => (
            <Button
              key={p}
              variant={period === p ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod(p)}
            >
              {periodLabels[p]}
            </Button>
          ))}
        </div>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Chiffre d'affaires */}
        <Card className="border border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Chiffre d'affaires
              </CardTitle>
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(dashboard?.sales.total || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {dashboard?.sales.count || 0} ventes
            </p>
          </CardContent>
        </Card>

        {/* Factures */}
        <Card className="border border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Factures
              </CardTitle>
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(dashboard?.invoices.total || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(dashboard?.invoices.paid || 0)} encaissé
            </p>
          </CardContent>
        </Card>

        {/* Clients */}
        <Card className="border border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Clients
              </CardTitle>
              <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {dashboard?.crm.contacts || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {dashboard?.crm.opportunitiesWon || 0} opportunités gagnées
            </p>
          </CardContent>
        </Card>

        {/* Produits */}
        <Card className="border border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Inventaire
              </CardTitle>
              <div className="h-8 w-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <Package className="h-4 w-4 text-amber-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {dashboard?.inventory.products || 0}
            </div>
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              {dashboard?.inventory.lowStockProducts || 0 > 0 && (
                <>
                  <AlertCircle className="h-3 w-3" />
                  {dashboard?.inventory.lowStockProducts} en rupture
                </>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques et détails */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution du CA */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Évolution du chiffre d'affaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            {revenueTrend.length > 0 ? (
              <div className="space-y-3">
                {revenueTrend.slice(-7).map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="text-xs text-muted-foreground w-24">
                      {new Date(item.date).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </div>
                    <div className="flex-1">
                      <div className="h-8 bg-muted rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-lg transition-all"
                          style={{
                            width: `${Math.min((item.revenue / Math.max(...revenueTrend.map((t) => t.revenue))) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-sm font-medium text-foreground w-32 text-right">
                      {formatCurrency(item.revenue)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucune donnée disponible
              </p>
            )}
          </CardContent>
        </Card>

        {/* Top produits */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-green-600" />
              Top 5 produits
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length > 0 ? (
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <div
                    key={product.productId}
                    className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg"
                  >
                    <div className="flex items-center justify-center h-8 w-8 bg-white rounded-lg border border-border text-sm font-semibold text-muted-foreground">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {product.productName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.quantitySold} vendus
                      </p>
                    </div>
                    <div className="text-sm font-semibold text-green-600">
                      {formatCurrency(product.revenue)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucune vente enregistrée
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Statistiques supplémentaires */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CRM */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-foreground">
              CRM
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Opportunités</span>
              <span className="font-medium text-foreground">
                {dashboard?.crm.opportunities || 0}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Valeur pipeline</span>
              <span className="font-medium text-foreground">
                {formatCurrency(dashboard?.crm.opportunitiesValue || 0)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Taux de conversion</span>
              <span className="font-medium text-green-600">
                {dashboard?.crm.opportunities
                  ? Math.round(
                      ((dashboard?.crm.opportunitiesWon || 0) /
                        dashboard.crm.opportunities) *
                        100,
                    )
                  : 0}
                %
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Inventaire */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-foreground">
              Inventaire
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Produits actifs</span>
              <span className="font-medium text-foreground">
                {dashboard?.inventory.products || 0}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Stock bas</span>
              <span className="font-medium text-red-600">
                {dashboard?.inventory.lowStockProducts || 0}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* RH */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-foreground">
              Ressources Humaines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Employés actifs</span>
              <span className="font-medium text-foreground">
                {dashboard?.hr.employees || 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
