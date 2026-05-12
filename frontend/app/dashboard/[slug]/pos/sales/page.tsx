'use client';

import { use, useEffect, useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataGrid } from '@/components/data-grid/DataGrid';
import { usePOS } from '@/hooks/usePOS';
import type { Sale } from '@/types/pos';
import {
  ListChecks, Eye, Receipt, X, ChevronDown,
  Download, ShoppingBag, TrendingUp, Package,
  DollarSign, CreditCard, Smartphone, Banknote,
} from 'lucide-react';

// ── Helpers ───────────────────────────────────────────────────────────────────
type Period = 'today' | 'week' | 'month' | 'custom';

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

const fmtTime = (d: string) =>
  new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

const METHOD_LABEL: Record<string, string> = {
  CASH: 'Espèces', CARD: 'Carte', MOBILE_MONEY: 'Mobile Money', MIXED: 'Mixte',
};
const METHOD_ICON: Record<string, React.ReactNode> = {
  CASH:         <DollarSign  className="h-3.5 w-3.5" />,
  CARD:         <CreditCard  className="h-3.5 w-3.5" />,
  MOBILE_MONEY: <Smartphone  className="h-3.5 w-3.5" />,
  MIXED:        <Banknote    className="h-3.5 w-3.5" />,
};

function periodRange(period: Period, from: string, to: string) {
  const now = new Date();
  if (period === 'today') {
    const s = new Date(now); s.setHours(0, 0, 0, 0);
    const e = new Date(now); e.setHours(23, 59, 59, 999);
    return { start: s, end: e };
  }
  if (period === 'week') {
    const s = new Date(now); s.setDate(now.getDate() - now.getDay() + 1); s.setHours(0, 0, 0, 0);
    const e = new Date(s); e.setDate(s.getDate() + 6); e.setHours(23, 59, 59, 999);
    return { start: s, end: e };
  }
  if (period === 'month') {
    return {
      start: new Date(now.getFullYear(), now.getMonth(), 1),
      end:   new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
    };
  }
  return {
    start: from ? new Date(from) : new Date(0),
    end:   to   ? new Date(to + 'T23:59:59') : new Date(),
  };
}

// ── Modal détail ──────────────────────────────────────────────────────────────
function SaleDetailModal({ sale, onClose }: { sale: Sale; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <p className="font-bold text-foreground text-lg">{sale.saleNumber}</p>
            <p className="text-sm text-muted-foreground">{fmtDate(sale.createdAt)} à {fmtTime(sale.createdAt)}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-muted-foreground"><X className="h-5 w-5" /></button>
        </div>

        <div className="px-6 py-4 grid grid-cols-2 gap-3 border-b border-border">
          {[
            { label: 'Caisse',    value: sale.register?.name ?? '—' },
            { label: 'Caissier',  value: sale.cashier ? `${sale.cashier.firstName} ${sale.cashier.lastName}` : '—' },
            { label: 'Paiement',  value: METHOD_LABEL[sale.paymentMethod] ?? sale.paymentMethod },
            { label: 'Client',    value: sale.customer ? `${sale.customer.firstName} ${sale.customer.lastName}` : 'Anonyme' },
          ].map((r) => (
            <div key={r.label} className="bg-muted/40 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">{r.label}</p>
              <p className="text-sm font-medium text-foreground">{r.value}</p>
            </div>
          ))}
        </div>

        {sale.items && sale.items.length > 0 && (
          <div className="px-6 py-4 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Articles</p>
            <div className="space-y-2">
              {(sale.items as any[]).map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-muted rounded text-xs flex items-center justify-center font-medium text-muted-foreground">{item.quantity}</span>
                    <span className="text-foreground">{item.productName}</span>
                    {item.productSku && <span className="text-muted-foreground text-xs">({item.productSku})</span>}
                  </div>
                  <span className="font-medium text-foreground">{fmt(item.total)} XOF</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="px-6 py-4 space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground"><span>Sous-total</span><span>{fmt(sale.subtotal)} XOF</span></div>
          {sale.discountAmount > 0 && (
            <div className="flex justify-between text-sm text-orange-600">
              <span>Remise {sale.discountPercent > 0 ? `(${sale.discountPercent}%)` : ''}</span>
              <span>-{fmt(sale.discountAmount)} XOF</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-muted-foreground"><span>TVA ({sale.taxPercent}%)</span><span>{fmt(sale.taxAmount)} XOF</span></div>
          <div className="flex justify-between font-bold text-base text-foreground pt-2 border-t border-border">
            <span>Total</span><span className="text-emerald-600">{fmt(sale.total)} XOF</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground"><span>Reçu</span><span>{fmt(sale.amountPaid)} XOF</span></div>
          {sale.changeAmount > 0 && (
            <div className="flex justify-between text-sm font-medium text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
              <span>Monnaie rendue</span><span>{fmt(sale.changeAmount)} XOF</span>
            </div>
          )}
        </div>

        <div className="px-6 pb-5">
          <Button className="w-full" variant="outline" onClick={onClose}>Fermer</Button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SalesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [companyId, setCompanyId] = useState('');
  const [sales,     setSales]     = useState<Sale[]>([]);
  const [detail,    setDetail]    = useState<Sale | null>(null);

  // Filtres
  const [period,      setPeriod]      = useState<Period>('today');
  const [fromDate,    setFromDate]    = useState('');
  const [toDate,      setToDate]      = useState('');
  const [method,      setMethod]      = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { getSales, loading } = usePOS(companyId);

  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (!raw) return;
    const co = JSON.parse(raw).companies?.find((c: any) => c.slug === slug);
    if (co) setCompanyId(co.id);
  }, [slug]);

  useEffect(() => {
    if (!companyId) return;
    getSales().then((d) => { if (d) setSales(d); });
  }, [companyId]);

  // ── Filtrage période + mode paiement ─────────────────────────────────────
  const filtered = useMemo(() => {
    const { start, end } = periodRange(period, fromDate, toDate);
    return sales.filter((s) => {
      const d = new Date(s.createdAt);
      if (d < start || d > end) return false;
      if (method && s.paymentMethod !== method) return false;
      return true;
    });
  }, [sales, period, fromDate, toDate, method]);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const completed = filtered.filter((s) => s.status === 'COMPLETED');
  const revenue   = completed.reduce((a, s) => a + s.total, 0);
  const avgBasket = completed.length > 0 ? revenue / completed.length : 0;

  // ── Export CSV ────────────────────────────────────────────────────────────
  const exportCSV = () => {
    const headers = ['Numéro', 'Date', 'Heure', 'Caisse', 'Caissier', 'Client', 'Paiement', 'Articles', 'Sous-total', 'Remise', 'TVA', 'Total', 'Statut'];
    const rows = filtered.map((s) => [
      s.saleNumber, fmtDate(s.createdAt), fmtTime(s.createdAt),
      s.register?.name ?? '', s.cashier ? `${s.cashier.firstName} ${s.cashier.lastName}` : '',
      s.customer ? `${s.customer.firstName} ${s.customer.lastName}` : 'Anonyme',
      METHOD_LABEL[s.paymentMethod] ?? s.paymentMethod,
      s._count?.items ?? 0, s.subtotal, s.discountAmount, s.taxAmount, s.total, s.status,
    ]);
    const csv  = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a'); a.href = url;
    a.download = `ventes-${period}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  // ── Colonnes DataGrid ─────────────────────────────────────────────────────
  const columns = useMemo(() => [
    {
      key: 'saleNumber' as keyof Sale & string,
      header: 'Vente',
      render: (_: any, row: Sale) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
            <Receipt className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">{row.saleNumber}</p>
            <p className="text-xs text-muted-foreground">{row._count?.items ?? 0} article{(row._count?.items ?? 0) > 1 ? 's' : ''}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'createdAt' as keyof Sale & string,
      header: 'Date',
      render: (_: any, row: Sale) => (
        <div>
          <p className="text-sm text-foreground">{fmtDate(row.createdAt)}</p>
          <p className="text-xs text-muted-foreground">{fmtTime(row.createdAt)}</p>
        </div>
      ),
    },
    {
      key: 'cashier' as keyof Sale & string,
      header: 'Caissier',
      searchable: false,
      render: (_: any, row: Sale) => (
        <p className="text-sm text-foreground">
          {row.cashier ? `${row.cashier.firstName} ${row.cashier.lastName}` : '—'}
        </p>
      ),
    },
    {
      key: 'customer' as keyof Sale & string,
      header: 'Client',
      searchable: false,
      render: (_: any, row: Sale) => (
        <p className="text-sm text-foreground">
          {row.customer ? `${row.customer.firstName} ${row.customer.lastName}` : <span className="text-muted-foreground">Anonyme</span>}
        </p>
      ),
    },
    {
      key: 'paymentMethod' as keyof Sale & string,
      header: 'Paiement',
      render: (_: any, row: Sale) => (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
          {METHOD_ICON[row.paymentMethod]}
          {METHOD_LABEL[row.paymentMethod] ?? row.paymentMethod}
        </span>
      ),
    },
    {
      key: 'total' as keyof Sale & string,
      header: 'Total',
      render: (_: any, row: Sale) => (
        <div className="text-right">
          <p className="font-bold text-emerald-600">{fmt(row.total)} XOF</p>
          {row.discountAmount > 0 && (
            <p className="text-xs text-orange-500">-{fmt(row.discountAmount)} remise</p>
          )}
        </div>
      ),
    },
    {
      key: 'status' as keyof Sale & string,
      header: 'Statut',
      render: (_: any, row: Sale) => (
        <>
          {row.status === 'COMPLETED' && <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Terminée</Badge>}
          {row.status === 'CANCELLED' && <Badge variant="outline" className="text-red-600 border-red-200">Annulée</Badge>}
          {row.status === 'REFUNDED'  && <Badge variant="outline" className="text-orange-600 border-orange-200">Remboursée</Badge>}
        </>
      ),
    },
    {
      key: 'id' as keyof Sale & string,
      header: '',
      sortable: false,
      searchable: false,
      width: '48px',
      render: (_: any, row: Sale) => (
        <Button
          variant="ghost" size="sm"
          className="h-7 w-7 p-0 text-muted-foreground hover:text-blue-600"
          onClick={(e) => { e.stopPropagation(); setDetail(row); }}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ], []);

  const PERIODS: { value: Period; label: string }[] = [
    { value: 'today',  label: "Aujourd'hui" },
    { value: 'week',   label: 'Cette semaine' },
    { value: 'month',  label: 'Ce mois' },
    { value: 'custom', label: 'Personnalisé' },
  ];

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ventes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Historique et analyse des ventes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <ChevronDown className={`h-4 w-4 mr-1.5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            Filtres
          </Button>
          <Button variant="outline" size="sm" onClick={exportCSV} disabled={filtered.length === 0}>
            <Download className="h-4 w-4 mr-1.5" />Export CSV
          </Button>
        </div>
      </div>

      {/* Filtres période */}
      <div className="flex flex-wrap gap-2 items-center">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              period === p.value
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-border text-muted-foreground hover:border-blue-300'
            }`}
          >
            {p.label}
          </button>
        ))}
        {period === 'custom' && (
          <div className="flex items-center gap-2">
            <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="h-8 text-sm w-36" />
            <span className="text-muted-foreground text-sm">→</span>
            <Input type="date" value={toDate}   onChange={(e) => setToDate(e.target.value)}   className="h-8 text-sm w-36" />
          </div>
        )}
      </div>

      {/* Filtres avancés */}
      {showFilters && (
        <Card>
          <CardContent className="py-3">
            <div className="flex flex-wrap gap-3 items-center">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="border border-border rounded-lg px-3 h-9 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tous les paiements</option>
                <option value="CASH">Espèces</option>
                <option value="CARD">Carte</option>
                <option value="MOBILE_MONEY">Mobile Money</option>
                <option value="MIXED">Mixte</option>
              </select>
              {method && (
                <Button variant="ghost" size="sm" onClick={() => setMethod('')}>
                  <X className="h-4 w-4 mr-1" />Réinitialiser
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Ventes',             value: filtered.length, icon: ShoppingBag, color: 'text-blue-600',    bg: 'bg-blue-50',    display: (v: number) => v.toString() },
          { label: "Chiffre d'affaires", value: revenue,         icon: TrendingUp,  color: 'text-emerald-600', bg: 'bg-emerald-50', display: (v: number) => `${fmt(v)} XOF` },
          { label: 'Panier moyen',       value: avgBasket,       icon: Package,     color: 'text-violet-600',  bg: 'bg-violet-50',  display: (v: number) => `${fmt(v)} XOF` },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center shrink-0`}>
                    <Icon className={`h-4 w-4 ${s.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="font-bold text-foreground">{s.display(s.value)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* DataGrid */}
      <Card>
        <CardContent className="pt-4">
          <DataGrid<Sale>
            data={filtered}
            columns={columns}
            pageSize={10}
            loading={loading}
            searchPlaceholder="Rechercher par numéro, caissier, client..."
            emptyMessage="Aucune vente sur cette période"
            emptyIcon={ListChecks}
            onRowClick={(row) => setDetail(row)}
          />
        </CardContent>
      </Card>

      {/* Modal détail */}
      {detail && <SaleDetailModal sale={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}
