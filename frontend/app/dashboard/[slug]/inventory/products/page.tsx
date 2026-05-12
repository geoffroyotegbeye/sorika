'use client';

import { use, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataGrid } from '@/components/data-grid';
import type { DataGridColumn } from '@/components/data-grid';
import { useInventory } from '@/hooks/useInventory';
import type { InventoryProduct } from '@/types/inventory';
import { ProductFormDialog } from '@/components/inventory/ProductFormDialog';
import { MovementFormDialog } from '@/components/inventory/MovementFormDialog';
import { Plus, Package, AlertTriangle, ArrowUpDown, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Company {
  id: string;
  slug: string;
  currency?: string;
}

export default function ProductsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);
      setCompany(parsed.companies?.find((c: any) => c.slug === slug) ?? null);
    } catch (err) {
      console.error('Erreur:', err);
    }
  }, [slug]);

  const {
    products,
    categories,
    movements,
    loading,
    fetchProducts,
    fetchCategories,
    fetchMovements,
    deleteProduct,
    createMovement,
  } = useInventory(company?.id ?? '');

  const [productDialog, setProductDialog] = useState(false);
  const [editProduct, setEditProduct] = useState<InventoryProduct | null>(null);
  const [movementDialog, setMovementDialog] = useState(false);
  const [movementProduct, setMovementProduct] = useState<InventoryProduct | null>(null);

  useEffect(() => {
    if (company?.id) {
      fetchProducts();
      fetchCategories();
    }
  }, [company?.id, fetchProducts, fetchCategories]);

  if (!company) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  const currency = company.currency ?? 'XOF';
  const fmt = (n: number) => n.toLocaleString('fr-FR') + ' ' + currency;

  const handleCloseDialog = () => {
    setProductDialog(false);
    setEditProduct(null);
    fetchProducts();
  };

  const handleCloseMovementDialog = () => {
    setMovementDialog(false);
    setMovementProduct(null);
    fetchProducts();
  };

  const columns: DataGridColumn<InventoryProduct>[] = [
    {
      key: 'name',
      header: 'Produit',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          {row.imageUrl ? (
            <img src={row.imageUrl} alt={val as string} className="h-10 w-10 rounded object-cover" />
          ) : (
            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
              <Package className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <div>
            <p className="font-medium text-foreground">{val as string}</p>
            {row.sku && <p className="text-xs text-muted-foreground">SKU: {row.sku}</p>}
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Catégorie',
      sortable: false,
      render: (_, row) => (
        <span className="text-sm">{row.category?.name ?? '—'}</span>
      ),
    },
    {
      key: 'stockQuantity',
      header: 'Stock',
      render: (val, row) => {
        const stock = val as number;
        const isLow = row.minStock && stock <= row.minStock;
        const isOut = stock === 0;

        return (
          <div className="flex items-center gap-2">
            <span className={`font-medium ${isOut ? 'text-red-600' : isLow ? 'text-orange-600' : 'text-foreground'}`}>
              {stock} {row.unit}
            </span>
            {isOut && <AlertTriangle className="h-4 w-4 text-red-600" />}
            {isLow && !isOut && <AlertTriangle className="h-4 w-4 text-orange-600" />}
          </div>
        );
      },
    },
    {
      key: 'salePrice',
      header: 'Prix de vente',
      render: (val) => <span className="font-medium">{fmt(val as number)}</span>,
    },
    {
      key: 'costPrice',
      header: 'Prix d\'achat',
      render: (val) => <span className="text-muted-foreground">{val ? fmt(val as number) : '—'}</span>,
    },
    {
      key: 'isActive',
      header: 'Statut',
      render: (val) => (
        <Badge className={val ? 'bg-green-100 text-green-700' : 'bg-muted text-foreground'}>
          {val ? 'Actif' : 'Inactif'}
        </Badge>
      ),
    },
    {
      key: 'id',
      header: 'Actions',
      sortable: false,
      searchable: false,
      render: (_, row) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setMovementProduct(row);
              setMovementDialog(true);
            }}
            className="h-8 w-8 p-0"
            title="Mouvement de stock"
          >
            <ArrowUpDown className="h-4 w-4 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditProduct(row);
              setProductDialog(true);
            }}
            className="h-8 w-8 p-0"
            title="Modifier"
          >
            <Pencil className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteProduct(row.id)}
            className="h-8 w-8 p-0"
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Produits</h1>
        <Button
          onClick={() => {
            setEditProduct(null);
            setProductDialog(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau produit
        </Button>
      </div>

      <DataGrid
        data={products}
        columns={columns}
        loading={loading}
        searchPlaceholder="Rechercher un produit..."
        emptyMessage="Aucun produit"
      />

      <ProductFormDialog
        companyId={company.id}
        product={editProduct}
        categories={categories}
        open={productDialog}
        onClose={handleCloseDialog}
        currency={currency}
      />

      <MovementFormDialog
        open={movementDialog}
        onClose={handleCloseMovementDialog}
        onSubmit={async (data) => {
          const { productId, ...movementDto } = data;
          await createMovement(productId, movementDto);
          await fetchProducts();
          await fetchMovements();
        }}
        products={products}
        preSelectedProductId={movementProduct?.id}
      />
    </div>
  );
}
