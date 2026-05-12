'use client';

import { use, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataGrid } from '@/components/data-grid';
import type { DataGridColumn } from '@/components/data-grid';
import { useAccounting } from '@/hooks/useAccounting';
import type { Supplier } from '@/types/accounting';
import { SupplierFormDialog } from '@/components/accounting/SupplierFormDialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function SuppliersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return;
    const parsed = JSON.parse(userData);
    setCompany(parsed.companies?.find((c: any) => c.slug === slug) ?? null);
  }, [slug]);

  const { suppliers, loading, fetchSuppliers, deleteSupplier } = useAccounting(company?.id ?? '');

  const [supplierDialog, setSupplierDialog] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    if (company?.id) fetchSuppliers();
  }, [company?.id, fetchSuppliers]);

  if (!company) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>;

  const handleCloseDialog = () => {
    setSupplierDialog(false);
    setEditSupplier(null);
    fetchSuppliers();
  };

  const columns: DataGridColumn<Supplier>[] = [
    {
      key: 'name',
      header: 'Nom',
      render: (val) => <span className="font-medium text-foreground">{val as string}</span>,
    },
    {
      key: 'email',
      header: 'Email',
      render: (val) => <span>{(val as string) ?? '—'}</span>,
    },
    {
      key: 'phone',
      header: 'Téléphone',
      render: (val) => <span>{(val as string) ?? '—'}</span>,
    },
    {
      key: 'taxNumber',
      header: 'N° fiscal',
      render: (val) => <span className="text-muted-foreground">{(val as string) ?? '—'}</span>,
    },
    {
      key: 'id',
      header: 'Actions',
      sortable: false,
      searchable: false,
      render: (_, row) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setEditSupplier(row); setSupplierDialog(true); }}
            className="h-8 w-8 p-0"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteSupplier(row.id)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Fournisseurs</h1>
        <Button onClick={() => { setEditSupplier(null); setSupplierDialog(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau fournisseur
        </Button>
      </div>

      <DataGrid
        data={suppliers}
        columns={columns}
        loading={loading}
        searchPlaceholder="Rechercher un fournisseur..."
        emptyMessage="Aucun fournisseur"
      />

      <SupplierFormDialog
        companyId={company.id}
        supplier={editSupplier}
        open={supplierDialog}
        onClose={handleCloseDialog}
      />
    </div>
  );
}
