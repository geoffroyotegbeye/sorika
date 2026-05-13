'use client';

import { use, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Package, TrendingUp, DollarSign, Users, Star } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import Link from 'next/link';

interface Company {
  id: string;
  slug: string;
  name: string;
  currency?: string;
}

export default function EcommerceDashboardPage({ params }: { params: Promise<{ slug: string }> }) {
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

  if (!company) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  const currency = company.currency ?? 'XOF';

  return (
    <div className="space-y-6">
      <PageHeader
        title="E-commerce"
        description="Gestion de votre boutique en ligne"
        breadcrumbs={[
          { label: 'E-commerce', href: `/dashboard/${slug}/ecommerce` },
          { label: 'Tableau de bord' },
        ]}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href={`/dashboard/${slug}/ecommerce/orders`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Commandes</CardTitle>
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">0</div>
              <p className="text-xs text-muted-foreground mt-1">Commandes totales</p>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/dashboard/${slug}/ecommerce/shop`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Produits</CardTitle>
              <Package className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">0</div>
              <p className="text-xs text-muted-foreground mt-1">Produits en vente</p>
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenus</CardTitle>
            <DollarSign className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">0 {currency}</div>
            <p className="text-xs text-muted-foreground mt-1">Revenus totaux</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avis</CardTitle>
            <Star className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">0</div>
            <p className="text-xs text-muted-foreground mt-1">Avis clients</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href={`/dashboard/${slug}/ecommerce/shop`}>
              <div className="p-4 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                <Package className="h-6 w-6 mb-2 text-blue-600" />
                <h3 className="font-semibold">Gérer les produits</h3>
                <p className="text-sm text-muted-foreground">Ajouter et modifier vos produits</p>
              </div>
            </Link>
            <Link href={`/dashboard/${slug}/ecommerce/orders`}>
              <div className="p-4 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                <ShoppingCart className="h-6 w-6 mb-2 text-green-600" />
                <h3 className="font-semibold">Voir les commandes</h3>
                <p className="text-sm text-muted-foreground">Gérer les commandes clients</p>
              </div>
            </Link>
            <Link href={`/dashboard/${slug}/inventory/products`}>
              <div className="p-4 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                <TrendingUp className="h-6 w-6 mb-2 text-purple-600" />
                <h3 className="font-semibold">Gérer le stock</h3>
                <p className="text-sm text-muted-foreground">Suivre les mouvements de stock</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
