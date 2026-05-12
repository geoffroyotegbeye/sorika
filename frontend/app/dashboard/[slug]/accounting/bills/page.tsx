'use client';

import { use, useEffect, useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataGrid } from '@/components/data-grid';
import type { DataGridColumn } from '@/components/data-grid';
import { useAccounting } from '@/hooks/useAccounting';
import type { Bill, BillStatus } from '@/types/accounting';
import { BillFormDialog } from '@/components/accounting/BillFormDialog';
import { DateRangeFilter, type DateRange } from '@/components/ui/date-range-filter';
import { Plus } from 'lucide-react';

const STATUS_CONFIG: Record<BillStatus, { label: string; className: string }> = {
  PENDING:   { label: 'En attente', className: 'bg-yellow-100 text-yellow-700' },
  APPROVED:  { label: 'Approuvée',  className: 'bg-blue-100 text-blue-700' },
  PAID:      { label: 'Payée',      className: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'Annulée',    className: 'bg-muted text-muted-foreground' },
};

export default function BillsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [company, setCompany] = useState<any>(null);

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

  const currency = company.currency ?? 'XOF';
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
              variant="outline"
              size="sm"
              onClick={() => updateBill(row.id, { status: 'PAID' })}
              className="h-8"
            >
              Marquer payée
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setEditBill(row); setBillDialog(true); }}
            className="h-8 text-muted-foreground"
          >
            Modifier
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteBill(row.id)}
            className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Supprimer
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-foreground">Charges</h1>
        <div className="flex flex-wrap items-center gap-2">
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
          <Button onClick={() => { setEditBill(null); setBillDialog(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle charge
          </Button>
        </div>
      </div>

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
