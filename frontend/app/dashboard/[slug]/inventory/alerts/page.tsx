'use client';

import { use, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useInventory } from '@/hooks/useInventory';
import type { StockAlert } from '@/types/inventory';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout/PageHeader';

export default function AlertsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return;
    const parsed = JSON.parse(userData);
    setCompany(parsed.companies?.find((c: any) => c.slug === slug) ?? null);
  }, [slug]);

  const { alerts, loading, fetchAlerts, resolveAlert } = useInventory(company?.id ?? '');
  const [showResolved, setShowResolved] = useState(false);

  useEffect(() => {
    if (company?.id) fetchAlerts({ isResolved: showResolved });
  }, [company?.id, showResolved, fetchAlerts]);

  if (!company) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  const handleResolve = async (id: string) => {
    try {
      await resolveAlert(id);
      toast.success('Alerte résolue');
    } catch (err: any) {
      toast.error(err.message || 'Erreur');
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'OUT_OF_STOCK':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'LOW_STOCK':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'OVERSTOCK':
        return <AlertTriangle className="h-5 w-5 text-blue-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'OUT_OF_STOCK':
        return 'border-red-200 bg-red-50';
      case 'LOW_STOCK':
        return 'border-orange-200 bg-orange-50';
      case 'OVERSTOCK':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-border bg-muted/40';
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Alertes de stock"
        description={`${alerts.length} alerte${alerts.length > 1 ? 's' : ''}`}
        breadcrumbs={[
          { label: 'Inventaire', href: `/dashboard/${slug}/inventory` },
          { label: 'Alertes' },
        ]}
        actions={
          <Button
            variant="outline"
            onClick={() => setShowResolved(!showResolved)}
          >
            {showResolved ? 'Masquer résolues' : 'Afficher résolues'}
          </Button>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : alerts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-muted-foreground">
              {showResolved ? 'Aucune alerte résolue' : 'Aucune alerte active'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Card key={alert.id} className={`border ${getAlertColor(alert.type)}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{alert.message}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>Produit: {alert.product?.name}</span>
                        {alert.product?.sku && <span>SKU: {alert.product.sku}</span>}
                        <span>Stock: {alert.product?.stockQuantity}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(alert.createdAt).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  {!alert.isResolved && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResolve(alert.id)}
                      className="ml-4"
                    >
                      Résoudre
                    </Button>
                  )}
                  {alert.isResolved && (
                    <CheckCircle className="h-5 w-5 text-green-600 ml-4" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
