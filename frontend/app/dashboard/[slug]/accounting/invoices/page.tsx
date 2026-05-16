'use client';

import { use, useEffect, useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataGrid } from '@/components/data-grid';
import type { DataGridColumn } from '@/components/data-grid';
import { useAccounting } from '@/hooks/useAccounting';
import { useCompany } from '@/hooks/useCompany';
import type { Invoice, InvoiceStatus } from '@/types/accounting';
import { InvoiceFormDialog } from '@/components/accounting/InvoiceFormDialog';
import { PaymentFormDialog } from '@/components/accounting/PaymentFormDialog';
import { DateRangeFilter, type DateRange } from '@/components/ui/date-range-filter';
import { PageHeader } from '@/components/layout/PageHeader';
import { Plus, CreditCard, Pencil, Trash2 } from 'lucide-react';

const STATUS_CONFIG: Record<InvoiceStatus, { label: string; className: string }> = {
  DRAFT:     { label: 'Brouillon',  className: 'bg-muted text-foreground' },
  SENT:      { label: 'Envoyée',    className: 'bg-blue-100 text-blue-700' },
  PAID:      { label: 'Payée',      className: 'bg-green-100 text-green-700' },
  PARTIAL:   { label: 'Partielle',  className: 'bg-yellow-100 text-yellow-700' },
  OVERDUE:   { label: 'En retard',  className: 'bg-red-100 text-red-700' },
  CANCELLED: { label: 'Annulée',    className: 'bg-muted text-muted-foreground' },
};

export default function InvoicesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [company, setCompany] = useState<any>(null);
  const { company: companyData } = useCompany(slug);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return;
    const parsed = JSON.parse(userData);
    setCompany(parsed.companies?.find((c: any) => c.slug === slug) ?? null);
  }, [slug]);

  const { invoices, loading, fetchInvoices, deleteInvoice } = useAccounting(company?.id ?? '');

  const [invoiceDialog, setInvoiceDialog] = useState(false);
  const [editInvoice, setEditInvoice] = useState<Invoice | null>(null);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>(null);

  useEffect(() => {
    if (company?.id) fetchInvoices();
  }, [company?.id, fetchInvoices]);

  // useMemo AVANT le return conditionnel — règles des hooks
  const filteredInvoices = useMemo(() => {
    if (!dateRange) return invoices;
    return invoices.filter(inv => {
      const d = inv.issueDate.split('T')[0];
      return d >= dateRange.from && d <= dateRange.to;
    });
  }, [invoices, dateRange]);

  if (!company) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>;

  const currency = companyData?.currency || company?.currency || 'FCFA';
  const fmt = (n: number) => n.toLocaleString('fr-FR') + ' ' + currency;

  const handleCloseInvoiceDialog = () => {
    setInvoiceDialog(false);
    setEditInvoice(null);
    fetchInvoices();
  };

  const handleClosePaymentDialog = () => {
    setPaymentDialog(false);
    setPaymentInvoice(null);
    fetchInvoices();
  };

  const columns: DataGridColumn<Invoice>[] = [
    {
      key: 'invoiceNumber',
      header: 'Numéro',
      render: (val) => <span className="font-mono font-medium text-foreground">{val as string}</span>,
    },
    {
      key: 'client',
      header: 'Client',
      sortable: false,
      render: (_, row) => <span>{row.client?.name ?? row.clientName ?? '—'}</span>,
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
      header: 'Total',
      render: (val) => <span className="font-medium">{fmt(val as number)}</span>,
    },
    {
      key: 'amountDue',
      header: 'Restant dû',
      render: (val) => <span className={(val as number) > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>{fmt(val as number)}</span>,
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
        const s = STATUS_CONFIG[val as InvoiceStatus];
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
          {row.amountDue > 0 && row.status !== 'CANCELLED' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setPaymentInvoice(row); setPaymentDialog(true); }}
              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              title="Enregistrer un paiement"
            >
              <CreditCard className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setEditInvoice(row); setInvoiceDialog(true); }}
            className="h-8 w-8 p-0"
            title="Modifier"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteInvoice(row.id)}
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
        title="Factures"
        description={`${filteredInvoices.length} facture${filteredInvoices.length > 1 ? 's' : ''}`}
        breadcrumbs={[
          { label: 'Comptabilité', href: `/dashboard/${slug}/accounting` },
          { label: 'Factures' },
        ]}
        actions={
          <>
            <DateRangeFilter value={dateRange} onChange={setDateRange} />
            <Button onClick={() => { setEditInvoice(null); setInvoiceDialog(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle facture
            </Button>
          </>
        }
      />

      <DataGrid
        data={filteredInvoices}
        columns={columns}
        loading={loading}
        searchPlaceholder="Rechercher une facture..."
        emptyMessage="Aucune facture"
      />

      <InvoiceFormDialog
        companyId={company.id}
        invoice={editInvoice}
        open={invoiceDialog}
        onClose={handleCloseInvoiceDialog}
        currency={currency}
      />

      {paymentInvoice && (
        <PaymentFormDialog
          companyId={company.id}
          invoice={paymentInvoice}
          open={paymentDialog}
          onClose={handleClosePaymentDialog}
          currency={currency}
        />
      )}
    </div>
  );
}
