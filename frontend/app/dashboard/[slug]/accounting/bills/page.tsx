'use client';

import { use, useEffect, useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataGrid } from '@/components/data-grid';
import type { DataGridColumn } from '@/components/data-grid';
import { useAccounting } from '@/hooks/useAccounting';
import { useCompany } from '@/hooks/useCompany';
import type { Bill, BillStatus } from '@/types/accounting';
import { BillFormDialog } from '@/components/accounting/BillFormDialog';
import { DateRangeFilter, type DateRange } from '@/components/ui/date-range-filter';
import { PageHeader } from '@/components/layout/PageHeader';
import { Plus, Pencil, Trash2, Check } from 'lucide-react';

const STATUS_CONFIG: Record<BillStatus, { label: string; className: string }> = {
  PENDING:   { label: 'En attente', className: 'bg-yellow-100 text-yellow-700' },
  APPROVED:  { label: 'Approuvée',  className: 'bg-blue-100 text-blue-700' },
  PAID:      { label: 'Payée',      className: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'Annulée',    className: 'bg-muted text-muted-foreground' },
};

export default function BillsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [company, setCompany] = useState<any>(null);
  const { company: companyData } = useCompany(slug);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return;
    const parsed = JSON.parse(userData);
    setCompany(parsed.companies?.find((c: any) => c.slug === slug) ?? null);
  }, [slug]);

  const { bills, loading, fetchBills, updateBill, deleteBill } = useAccounting(company?.id ?? '');

  const [billDialog, setBillDialog] = useState(false);
  const [editBill, setEditBill] = useState<Bill | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>(null);

  useEffect(() => {
    if (company?.id) fetchBills();
  }, [company?.id, fetchBills]);

  // useMemo AVANT le return conditionnel — règles des hooks
  const filteredBills = useMemo(() => {
    if (!dateRange) return bills;
    return bills.filter(b => {
      const d = b.issueDate.split('T')[0];
      return d >= dateRange.from && d <= dateRange.to;
    });
  }, [bills, dateRange]);

  if (!company) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>;

  const currency = companyData?.currency || company?.currency || 'FCFA';
  const fmt = (n: number) => n.toLocaleString('fr-FR') + ' ' + currency;

  const handleCloseDialog = () => {
    setBillDialog(false);
    setEditBill(null);
    fetchBills();
  };

  const columns: DataGridColumn<Bill>[] = [
    {
      key: 'billNumber',
      header: 'Référence',
      render: (val) => <span className="font-mono text-foreground">{(val as string) ?? '—'}</span>,
    },
    {
      key: 'supplier',
      header: 'Fournisseur',
      sortable: false,
      render: (_, row) => <span>{row.supplier?.name ?? row.supplierName ?? '—'}</span>,
    },
    {
      key: 'issueDate',
      header: 'Date',
      render: (val) => <span>{new Date(val as string).toLocaleDateString('fr-FR')}</span>,
    },
    {
      key: 'dueDate',
      header: 'Échéance',
      render: (val) => val ? <span>{new Date(val as string).toLocaleDateString('fr-FR')}</span> : <span className="text-muted-foreground">—</span>,
    },
    {
      key: 'total',
      header: 'Montant',
      render: (val) => <span className="font-medium">{fmt(val as number)}</span>,
    },
    {
      key: 'createdAt',
      header: 'Créé le',
      render: (val) => <span className="text-sm text-muted-foreground">{new Date(val as string).toLocaleDateString('fr-FR')}</span>,
    },
    {
      key: 'createdById',
      header: 'Créé par',
      render: (val) => <span className="text-sm text-muted-foreground">{val && typeof val === 'string' ? 'ID: ' + val.slice(0, 8) : '—'}</span>,
    },
    {
      key: 'status',
      header: 'Statut',
      render: (val) => {
        const s = STATUS_CONFIG[val as BillStatus];
        return <Badge className={s.className}>{s.label}</Badge>;
      },
    },
    {
      key: 'id',
      header: 'Actions',
      sortable: false,
      searchable: false,
      render: (_, row) => (
        <div className="flex justify-end gap-2">
          {row.status === 'PENDING' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateBill(row.id, { status: 'PAID' })}
              className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
              title="Marquer comme payée"
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setEditBill(row); setBillDialog(true); }}
            className="h-8 w-8 p-0"
            title="Modifier"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteBill(row.id)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Charges"
        description={`${filteredBills.length} charge${filteredBills.length > 1 ? 's' : ''}`}
        breadcrumbs={[
          { label: 'Comptabilité', href: `/dashboard/${slug}/accounting` },
          { label: 'Charges' },
        ]}
        actions={
          <>
            <DateRangeFilter value={dateRange} onChange={setDateRange} />
            <Button onClick={() => { setEditBill(null); setBillDialog(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle charge
            </Button>
          </>
        }
      />

      <DataGrid
        data={filteredBills}
        columns={columns}
        loading={loading}
        searchPlaceholder="Rechercher une charge..."
        emptyMessage="Aucune charge"
      />

      <BillFormDialog
        companyId={company.id}
        bill={editBill}
        open={billDialog}
        onClose={handleCloseDialog}
        currency={currency}
      />
    </div>
  );
}
