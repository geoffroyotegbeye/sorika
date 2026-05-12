'use client';

import { use, useEffect, useState } from 'react';
import { DataGrid } from '@/components/data-grid';
import type { DataGridColumn } from '@/components/data-grid';
import { useInventory } from '@/hooks/useInventory';
import type { StockMovement } from '@/types/inventory';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MovementFormDialog } from '@/components/inventory/MovementFormDialog';
import { TrendingUp, TrendingDown, RefreshCw, Plus } from 'lucide-react';

export default function MovementsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [company, setCompany] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return;
    const parsed = JSON.parse(userData);
    setCompany(parsed.companies?.find((c: any) => c.slug === slug) ?? null);
  }, [slug]);

  const { movements, products, loading, fetchMovements, fetchProducts, createMovement } = useInventory(company?.id ?? '');

  useEffect(() => {
    if (company?.id) {
      fetchMovements();
      fetchProducts();
    }
  }, [company?.id, fetchMovements, fetchProducts]);

  const handleCreateMovement = async (data: any) => {
    const { productId, ...movementDto } = data;
    await createMovement(productId, movementDto);
    await fetchMovements();
    await fetchProducts();
  };

  if (!company) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  const columns: DataGridColumn<StockMovement>[] = [
    {
      key: 'type',
      header: 'Type',
      render: (val) => {
        const type = val as string;
        const map = {
          IN: { label: 'Entrée', icon: TrendingUp, className: 'bg-green-100 text-green-700' },
          OUT: { label: 'Sortie', icon: TrendingDown, className: 'bg-red-100 text-red-700' },
          ADJUSTMENT: { label: 'Ajustement', icon: RefreshCw, className: 'bg-blue-100 text-blue-700' },
        } as const;
        const config =
          map[type as keyof typeof map] ??
          { label: type, icon: RefreshCw, className: 'bg-muted text-muted-foreground' };

        const Icon = config.icon;
        return (
          <Badge className={config.className}>
            <Icon className="h-3 w-3 mr-1" />
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: 'product',
      header: 'Produit',
      sortable: false,
      render: (_, row) => (
        <div>
          <p className="font-medium text-foreground">{row.product?.name}</p>
          {row.product?.sku && <p className="text-xs text-muted-foreground">SKU: {row.product.sku}</p>}
        </div>
      ),
    },
    {
      key: 'quantity',
      header: 'Quantité',
      render: (val, row) => (
        <span className={`font-medium ${row.type === 'IN' ? 'text-green-600' : row.type === 'OUT' ? 'text-red-600' : 'text-blue-600'}`}>
          {row.type === 'IN' ? '+' : row.type === 'OUT' ? '-' : ''}
          {val as number} {row.product?.unit}
        </span>
      ),
    },
    {
      key: 'stockBefore',
      header: 'Stock avant',
      render: (val, row) => <span>{val as number} {row.product?.unit}</span>,
    },
    {
      key: 'stockAfter',
      header: 'Stock après',
      render: (val, row) => <span className="font-medium">{val as number} {row.product?.unit}</span>,
    },
    {
      key: 'reason',
      header: 'Raison',
      render: (val) => <span className="text-sm">{(val as string) || '—'}</span>,
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (val) => <span className="text-sm">{new Date(val as string).toLocaleString('fr-FR')}</span>,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Mouvements de stock</h1>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouveau mouvement
        </Button>
      </div>

      <DataGrid
        data={movements}
        columns={columns}
        loading={loading}
        searchPlaceholder="Rechercher un mouvement..."
        emptyMessage="Aucun mouvement"
      />

      <MovementFormDialog
        open={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreateMovement}
        products={products}
      />
    </div>
  );
}
