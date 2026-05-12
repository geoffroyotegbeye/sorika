'use client';

import { use, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, TrendingUp, AlertTriangle, FolderTree, DollarSign } from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';

interface Company {
  id: string;
  slug: string;
  name: string;
  currency?: string;
}

export default function InventoryDashboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);
      const foundCompany = parsed.companies?.find((c: any) => c.slug === slug) ?? null;
      setCompany(foundCompany);
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
    }
  }, [slug]);

  const { stats, fetchStats } = useInventory(company?.id ?? '');

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
      <h1 className="text-xl font-semibold text-foreground">Tableau de bord</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Produits</CardTitle>
            <Package className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.activeProducts} actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Valeur du Stock</CardTitle>
            <DollarSign className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {fmt(stats.totalStockValue.saleValue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Coût: {fmt(stats.totalStockValue.costValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Stock Bas</CardTitle>
            <AlertTriangle className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.lowStockProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.outOfStockProducts} en rupture
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Catégories</CardTitle>
            <FolderTree className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.categories}</div>
            <p className="text-xs text-muted-foreground mt-1">Catégories actives</p>
          </CardContent>
        </Card>
      </div>

      {/* Mouvements récents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Mouvements récents</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentMovements.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Aucun mouvement récent</p>
          ) : (
            <div className="space-y-3">
              {stats.recentMovements.map((movement) => (
                <div
                  key={movement.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        movement.type === 'IN'
                          ? 'bg-green-100 text-green-600'
                          : movement.type === 'OUT'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{movement.product?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {movement.type === 'IN' ? 'Entrée' : movement.type === 'OUT' ? 'Sortie' : 'Ajustement'} •{' '}
                        {new Date(movement.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        movement.type === 'IN' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {movement.type === 'IN' ? '+' : movement.type === 'OUT' ? '-' : ''}
                      {movement.quantity} {movement.product?.unit}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Stock: {movement.stockAfter} {movement.product?.unit}
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
