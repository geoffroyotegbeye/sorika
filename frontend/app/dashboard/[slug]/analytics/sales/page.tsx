'use client';

import { use, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  CreditCard,
  Calendar,
} from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function SalesAnalyticsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { revenueTrend, loading, fetchRevenueTrend } = useAnalytics(slug);

  useEffect(() => {
    // Définir les dates par défaut (30 derniers jours)
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
    
    fetchRevenueTrend('month');
  }, [fetchRevenueTrend]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalRevenue = revenueTrend.reduce((sum, item) => sum + item.revenue, 0);
  const totalSales = revenueTrend.reduce((sum, item) => sum + item.count, 0);
  const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0;
  const bestDay = revenueTrend.length > 0 
    ? revenueTrend.reduce((max, item) => item.revenue > max.revenue ? item : max, revenueTrend[0])
    : null;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Ventes & Performance</h1>
        <p className="text-sm text-muted-foreground">
          Analyse détaillée de vos ventes et revenus
        </p>
      </div>

      {/* Filtres de période */}
      <Card className="border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-foreground">
            Période d'analyse
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Date de début</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Date de fin</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Appliquer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs de ventes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Sur la période sélectionnée
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Nombre de ventes
              </CardTitle>
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {totalSales}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Transactions réalisées
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Panier moyen
              </CardTitle>
              <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(averageTicket)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Montant moyen par vente
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Meilleur jour
              </CardTitle>
              <div className="h-8 w-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-amber-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {bestDay ? formatCurrency(bestDay.revenue) : '-'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {bestDay ? new Date(bestDay.date).toLocaleDateString('fr-FR') : 'Aucune donnée'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphique d'évolution détaillé */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">
            Évolution quotidienne du chiffre d'affaires
          </CardTitle>
        </CardHeader>
        <CardContent>
          {revenueTrend.length > 0 ? (
            <div className="space-y-2">
              {revenueTrend.map((item, index) => {
                const maxRevenue = Math.max(...revenueTrend.map((t) => t.revenue));
                const percentage = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
                
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="text-xs text-muted-foreground w-28">
                      {new Date(item.date).toLocaleDateString('fr-FR', {
                        weekday: 'short',
                        day: '2-digit',
                        month: 'short',
                      })}
                    </div>
                    <div className="flex-1">
                      <div className="h-10 bg-muted rounded-lg overflow-hidden relative">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg transition-all flex items-center px-3"
                          style={{ width: `${Math.max(percentage, 5)}%` }}
                        >
                          <span className="text-xs font-medium text-white">
                            {item.count} vente{item.count > 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-foreground w-32 text-right">
                      {formatCurrency(item.revenue)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              Aucune donnée disponible pour cette période
            </p>
          )}
        </CardContent>
      </Card>

      {/* Analyses par méthode de paiement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              Répartition par méthode de paiement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8">
              Données disponibles prochainement
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              Performance par caissier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8">
              Données disponibles prochainement
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
