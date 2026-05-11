'use client';

import { use, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePOS } from '@/hooks/usePOS';
import type { Sale } from '@/types/pos';
import { ListChecks, Eye, Receipt, Users, Banknote } from 'lucide-react';

export default function SalesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [companyId, setCompanyId] = useState<string>('');
  const [sales, setSales] = useState<Sale[]>([]);
  const { getSales, loading } = usePOS(companyId);

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
    loadSales();
  }, [companyId]);

  const loadSales = async () => {
    const data = await getSales();
    if (data) setSales(data);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge className="bg-green-600">Terminée</Badge>;
      case 'CANCELLED':
        return <Badge variant="outline" className="text-red-600 border-red-600">Annulée</Badge>;
      case 'REFUNDED':
        return <Badge variant="outline" className="text-orange-600 border-orange-600">Remboursée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'CASH':
        return 'Espèces';
      case 'CARD':
        return 'Carte';
      case 'MOBILE_MONEY':
        return 'Mobile Money';
      case 'MIXED':
        return 'Mixte';
      default:
        return method;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ventes</h1>
          <p className="text-sm text-slate-500 mt-1">
            Historique des ventes en magasin
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Filtrer</Button>
          <Button variant="outline">Exporter</Button>
        </div>
      </div>

      {/* Liste des ventes */}
      {sales.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <ListChecks className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p className="text-slate-500">Aucune vente enregistrée</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sales.map((sale) => (
            <Card key={sale.id} className="hover:shadow-md transition-shadow">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  {/* Informations principales */}
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Receipt className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900">
                          {sale.saleNumber}
                        </p>
                        {getStatusBadge(sale.status)}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                        <span>
                          {formatDate(sale.createdAt)} à {formatTime(sale.createdAt)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Banknote className="h-3 w-3" />
                          {sale.register?.name}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {sale.cashier?.firstName} {sale.cashier?.lastName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Détails de la vente */}
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Articles</p>
                      <p className="font-medium text-slate-900">
                        {sale._count?.items || 0}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Paiement</p>
                      <p className="font-medium text-slate-900">
                        {getPaymentMethodLabel(sale.paymentMethod)}
                      </p>
                    </div>
                    {sale.customer && (
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Client</p>
                        <p className="font-medium text-slate-900">
                          {sale.customer.firstName} {sale.customer.lastName}
                        </p>
                      </div>
                    )}
                    <div className="text-right min-w-[120px]">
                      <p className="text-xs text-slate-500">Total</p>
                      <p className="text-lg font-bold text-emerald-600">
                        {formatCurrency(sale.total)} XOF
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="h-4 w-4" />
                      Détails
                    </Button>
                  </div>
                </div>

                {/* Informations supplémentaires */}
                {sale.discountAmount > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-slate-500">
                        Sous-total: {formatCurrency(sale.subtotal)} XOF
                      </span>
                      <span className="text-orange-600">
                        Remise: -{formatCurrency(sale.discountAmount)} XOF
                        {sale.discountPercent > 0 && ` (${sale.discountPercent}%)`}
                      </span>
                      <span className="text-slate-500">
                        TVA: {formatCurrency(sale.taxAmount)} XOF
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
