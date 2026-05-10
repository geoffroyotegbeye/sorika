'use client';

import { use, useEffect, useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataGrid } from '@/components/data-grid';
import type { DataGridColumn } from '@/components/data-grid';
import { useAccounting } from '@/hooks/useAccounting';
import type { Quote, QuoteStatus } from '@/types/accounting';
import { QuoteFormDialog } from '@/components/accounting/QuoteFormDialog';
import { DateRangeFilter, type DateRange } from '@/components/ui/date-range-filter';
import { Plus } from 'lucide-react';

const STATUS_CONFIG: Record<QuoteStatus, { label: string; className: string }> = {
  DRAFT:     { label: 'Brouillon',  className: 'bg-slate-100 text-slate-700' },
  SENT:      { label: 'Envoyé',     className: 'bg-blue-100 text-blue-700' },
  ACCEPTED:  { label: 'Accepté',    className: 'bg-green-100 text-green-700' },
  REFUSED:   { label: 'Refusé',     className: 'bg-red-100 text-red-700' },
  EXPIRED:   { label: 'Expiré',     className: 'bg-orange-100 text-orange-700' },
  CONVERTED: { label: 'Converti',   className: 'bg-purple-100 text-purple-700' },
};

export default function QuotesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return;
    const parsed = JSON.parse(userData);
    setCompany(parsed.companies?.find((c: any) => c.slug === slug) ?? null);
  }, [slug]);

  const { quotes, loading, fetchQuotes, convertQuote, deleteQuote } = useAccounting(company?.id ?? '');

  const [quoteDialog, setQuoteDialog] = useState(false);
  const [editQuote, setEditQuote] = useState<Quote | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>(null);

  useEffect(() => {
    if (company?.id) fetchQuotes();
  }, [company?.id, fetchQuotes]);

  // useMemo AVANT le return conditionnel — règles des hooks
  const filteredQuotes = useMemo(() => {
    if (!dateRange) return quotes;
    return quotes.filter(q => {
      const d = q.issueDate.split('T')[0];
      return d >= dateRange.from && d <= dateRange.to;
    });
  }, [quotes, dateRange]);

  if (!company) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>;

  const currency = company.currency ?? 'XOF';
  const fmt = (n: number) => n.toLocaleString('fr-FR') + ' ' + currency;

  const handleCloseDialog = () => {
    setQuoteDialog(false);
    setEditQuote(null);
    fetchQuotes();
  };

  const columns: DataGridColumn<Quote>[] = [
    {
      key: 'quoteNumber',
      header: 'Numéro',
      render: (val) => <span className="font-mono font-medium text-slate-900">{val as string}</span>,
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
      key: 'expiryDate',
      header: 'Expiration',
      render: (val) => val ? <span>{new Date(val as string).toLocaleDateString('fr-FR')}</span> : <span className="text-slate-400">—</span>,
    },
    {
      key: 'total',
      header: 'Total',
      render: (val) => <span className="font-medium">{fmt(val as number)}</span>,
    },
    {
      key: 'status',
      header: 'Statut',
      render: (val) => {
        const s = STATUS_CONFIG[val as QuoteStatus];
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
          {row.status !== 'CONVERTED' && row.status !== 'REFUSED' && (
            <Button variant="outline" size="sm" onClick={() => convertQuote(row.id)} className="h-8">
              → Facture
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setEditQuote(row); setQuoteDialog(true); }}
            className="h-8 text-slate-600"
          >
            Modifier
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteQuote(row.id)}
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
        <h1 className="text-xl font-semibold text-slate-900">Devis</h1>
        <div className="flex flex-wrap items-center gap-2">
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
          <Button onClick={() => { setEditQuote(null); setQuoteDialog(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau devis
          </Button>
        </div>
      </div>

      <DataGrid
        data={filteredQuotes}
        columns={columns}
        loading={loading}
        searchPlaceholder="Rechercher un devis..."
        emptyMessage="Aucun devis"
      />

      <QuoteFormDialog
        companyId={company.id}
        quote={editQuote}
        open={quoteDialog}
        onClose={handleCloseDialog}
        currency={currency}
      />
    </div>
  );
}
