'use client';

import { use, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Package,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  BarChart3,
  Layers,
} from 'lucide-react';
import { api } from '@/lib/api';

interface InventoryAnalytics {
  totalProducts: number;
  totalValue: number;
  lowStockProducts: number;
  productsByCategory: Record<string, { count: number; value: number }>;
  lowStockList: Array<{
    id: string;
    name: string;
    stockQuantity: number;
    minStock: number | null;
  }>;
}

interface TopProduct {
  productId: string;
  productName: string;
  quantitySold: number;
  revenue: number;
}

export default function ProductsAnalyticsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [inventoryData, setInventoryData] = useState<InventoryAnalytics | null>(
    null,
  );
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inventory, top] = await Promise.all([
          api.get<InventoryAnalytics>(`/companies/${slug}/analytics/inventory`),
          api.get<TopProduct[]>(`/companies/${slug}/analytics/top-products`),
        ]);
        setInventoryData(inventory);
        setTopProducts(top);
      } catch (error) {
        console.error('Error fetching inventory analytics:', error);
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

  const categories = inventoryData
    ? Object.entries(inventoryData.productsByCategory)
    : [];
  const totalCategoryValue = categories.reduce(
    (sum, [, data]) => sum + data.value,
    0,
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Produits & Inventaire
        </h1>
        <p className="text-sm text-muted-foreground">
          Analyse de vos stocks et performance produits
        </p>
      </div>

      {/* KPIs Inventaire */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Produits
              </CardTitle>
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {inventoryData?.totalProducts || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Produits actifs</p>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Valeur du stock
              </CardTitle>
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(inventoryData?.totalValue || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Valeur totale</p>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Alertes stock
              </CardTitle>
              <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {inventoryData?.lowStockProducts || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Produits en rupture</p>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Catégories
              </CardTitle>
              <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Layers className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {categories.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Catégories actives</p>
          </CardContent>
        </Card>
      </div>

      {/* Top produits vendus */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">
            Top 10 des produits les plus vendus
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((product, index) => {
                const maxRevenue = Math.max(...topProducts.map((p) => p.revenue));
                const percentage =
                  maxRevenue > 0 ? (product.revenue / maxRevenue) * 100 : 0;

                return (
                  <div key={product.productId}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground w-6">
                          #{index + 1}
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {product.productName}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-muted-foreground">
                          {product.quantitySold} vendus
                        </span>
                        <span className="text-sm font-semibold text-foreground w-32 text-right">
                          {formatCurrency(product.revenue)}
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              Aucune vente enregistrée
            </p>
          )}
        </CardContent>
      </Card>

      {/* Analyses détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition par catégorie */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              Répartition par catégorie
            </CardTitle>
          </CardHeader>
          <CardContent>
            {categories.length > 0 ? (
              <div className="space-y-3">
                {categories.map(([name, data], index) => {
                  const percentage =
                    totalCategoryValue > 0
                      ? (data.value / totalCategoryValue) * 100
                      : 0;

                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">
                          {name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {data.count} produits • {formatCurrency(data.value)}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
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
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucune catégorie disponible
              </p>
            )}
          </CardContent>
        </Card>

        {/* Produits en alerte */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              Produits en rupture de stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            {inventoryData && inventoryData.lowStockList.length > 0 ? (
              <div className="space-y-2">
                {inventoryData.lowStockList.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-2 bg-red-50 rounded-lg border border-red-100"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Stock actuel: {product.stockQuantity} • Min:{' '}
                        {product.minStock || 0}
                      </p>
                    </div>
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucun produit en alerte
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
              Rentabilité par produit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8">
              Analyse marge vs coût - Disponible prochainement
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              Rotation des stocks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8">
              Vitesse de rotation par produit - Disponible prochainement
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
