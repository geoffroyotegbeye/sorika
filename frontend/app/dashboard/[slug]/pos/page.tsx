'use client';

import { use, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePOS } from '@/hooks/usePOS';
import type { POSDashboard } from '@/types/pos';
import {
  DollarSign, ShoppingCart, TrendingUp, Banknote,
  Users, Package, ArrowRight, Clock, AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

export default function POSDashboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [companyId, setCompanyId] = useState('');
  const [dashboard, setDashboard] = useState<POSDashboard | null>(null);
  const { getDashboard, loading } = usePOS(companyId);

  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (!raw) return;
    const co = JSON.parse(raw).companies?.find((c: any) => c.slug === slug);
    if (co) setCompanyId(co.id);
  }, [slug]);

  useEffect(() => {
    if (companyId) getDashboard().then((d) => { if (d) setDashboard(d); });
  }, [companyId]);

  if (loading || !dashboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
      </div>
    );
  }

  const stats = [
    {
      label: "Chiffre d'affaires",
      value: `${fmt(dashboard.today.revenue)} XOF`,
      sub: "Aujourd'hui",
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      label: 'Transactions',
      value: dashboard.today.transactions.toString(),
      sub: 'Ventes réalisées',
      icon: ShoppingCart,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      label: 'Panier moyen',
      value: `${fmt(dashboard.today.averageBasket)} XOF`,
      sub: 'Par transaction',
      icon: TrendingUp,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      border: 'border-violet-100',
    },
  ];

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Point de Vente</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Vue d'ensemble — {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <Link href={`/dashboard/${slug}/pos/cashier`}>
          <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
            <ShoppingCart className="h-4 w-4" />
            Ouvrir la caisse
          </Button>
        </Link>
      </div>

      {/* Stats du jour */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className={`border ${s.border}`}>
              <CardContent className="pt-5 pb-4 px-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{s.label}</p>
                    <p className="text-2xl font-bold text-foreground">{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
                  </div>
                  <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sessions ouvertes */}
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Banknote className="h-5 w-5 text-emerald-600" />
                <h2 className="font-semibold text-foreground">Sessions ouvertes</h2>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  {dashboard.openSessions.length}
                </Badge>
              </div>
              <Link href={`/dashboard/${slug}/pos/sessions`}>
                <Button variant="ghost" size="sm" className="text-muted-foreground gap-1 h-7">
                  Voir tout <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            {dashboard.openSessions.length === 0 ? (
              <div className="text-center py-8">
                <Banknote className="h-10 w-10 mx-auto mb-2 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Aucune session ouverte</p>
                <p className="text-xs text-muted-foreground mt-1">Ouvrez une caisse pour commencer</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dashboard.openSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Banknote className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground">{session.register?.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {session.cashier ? `${session.cashier.firstName} ${session.cashier.lastName}` : 'Caissier inconnu'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">{session._count?.sales ?? 0} ventes</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                        <Clock className="h-3 w-3" />
                        {new Date(session.openedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
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
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-amber-600" />
                <h2 className="font-semibold text-foreground">Top produits du jour</h2>
              </div>
            </div>

            {dashboard.topProducts.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-10 w-10 mx-auto mb-2 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Aucune vente aujourd'hui</p>
              </div>
            ) : (
              <div className="space-y-2">
                {dashboard.topProducts.map((item, i) => (
                  <div key={item.product?.id ?? i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/40 transition-colors">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      i === 0 ? 'bg-amber-100 text-amber-700' :
                      i === 1 ? 'bg-muted text-muted-foreground' :
                      i === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-muted/40 text-muted-foreground'
                    }`}>
                      #{i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{item.product?.name ?? '—'}</p>
                      {item.product?.sku && <p className="text-xs text-muted-foreground">{item.product.sku}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-foreground">{fmt(item.revenue)} XOF</p>
                      <p className="text-xs text-muted-foreground">{item.quantitySold} vendus</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Raccourcis */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Caisse',    href: `/dashboard/${slug}/pos/cashier`,   icon: ShoppingCart, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Ventes',   href: `/dashboard/${slug}/pos/sales`,      icon: TrendingUp,   color: 'text-blue-600',    bg: 'bg-blue-50'    },
          { label: 'Sessions', href: `/dashboard/${slug}/pos/sessions`,   icon: Clock,        color: 'text-violet-600',  bg: 'bg-violet-50'  },
          { label: 'Caisses',  href: `/dashboard/${slug}/pos/registers`,  icon: Banknote,     color: 'text-amber-600',   bg: 'bg-amber-50'   },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.label} href={item.href}>
              <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
                <CardContent className="py-4 px-4 flex items-center gap-3">
                  <div className={`w-9 h-9 ${item.bg} rounded-lg flex items-center justify-center shrink-0`}>
                    <Icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                  <span className="font-medium text-sm text-foreground">{item.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground ml-auto" />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
