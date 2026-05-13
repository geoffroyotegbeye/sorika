'use client';

import { use, useEffect, useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataGrid } from '@/components/data-grid/DataGrid';
import { usePOS } from '@/hooks/usePOS';
import type { CashSession } from '@/types/pos';
import {
  ClipboardCheck, Banknote, Users, Clock,
  TrendingUp, AlertCircle, CheckCircle2, X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/PageHeader';

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
const fmtTime = (d: string) =>
  new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
const duration = (open: string, close?: string | null) => {
  const ms = new Date(close ?? new Date()).getTime() - new Date(open).getTime();
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h${m.toString().padStart(2, '0')}`;
};

// ── Modal détail session ──────────────────────────────────────────────────────
function SessionDetailModal({ session, onClose }: { session: CashSession; onClose: () => void }) {
  const diff = session.difference ?? 0;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${session.status === 'OPEN' ? 'bg-emerald-100' : 'bg-muted'}`}>
              <Banknote className={`h-4 w-4 ${session.status === 'OPEN' ? 'text-emerald-600' : 'text-muted-foreground'}`} />
            </div>
            <div>
              <p className="font-bold text-foreground">{session.register?.name}</p>
              <p className="text-xs text-muted-foreground">{fmtDate(session.openedAt)}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-muted-foreground"><X className="h-5 w-5" /></button>
        </div>

        <div className="px-6 py-4 grid grid-cols-2 gap-3 border-b border-border">
          {[
            { label: 'Caissier',    value: session.cashier ? `${session.cashier.firstName} ${session.cashier.lastName}` : '—' },
            { label: 'Statut',      value: session.status === 'OPEN' ? '🟢 Ouverte' : '⚫ Fermée' },
            { label: 'Ouverture',   value: `${fmtDate(session.openedAt)} ${fmtTime(session.openedAt)}` },
            { label: 'Fermeture',   value: session.closedAt ? `${fmtDate(session.closedAt)} ${fmtTime(session.closedAt)}` : '—' },
            { label: 'Durée',       value: duration(session.openedAt, session.closedAt) },
            { label: 'Ventes',      value: `${session._count?.sales ?? 0}` },
          ].map((r) => (
            <div key={r.label} className="bg-muted/40 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">{r.label}</p>
              <p className="text-sm font-medium text-foreground">{r.value}</p>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 space-y-2">
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Fonds de départ</span><span className="font-medium">{fmt(session.openingAmount)} XOF</span></div>
          {session.closingAmount != null && (
            <>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Montant attendu</span><span className="font-medium">{fmt(session.expectedAmount ?? 0)} XOF</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Montant compté</span><span className="font-medium">{fmt(session.closingAmount)} XOF</span></div>
              <div className={`flex justify-between text-sm font-semibold rounded-lg px-3 py-2 ${diff === 0 ? 'bg-muted/40 text-foreground' : diff > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                <span>Écart</span>
                <span>{diff > 0 ? '+' : ''}{fmt(diff)} XOF</span>
              </div>
            </>
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
export default function SessionsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [companyId, setCompanyId] = useState('');
  const [sessions,  setSessions]  = useState<CashSession[]>([]);
  const [detail,    setDetail]    = useState<CashSession | null>(null);
  const { getSessions, loading } = usePOS(companyId);

  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (!raw) return;
    const co = JSON.parse(raw).companies?.find((c: any) => c.slug === slug);
    if (co) setCompanyId(co.id);
  }, [slug]);

  useEffect(() => {
    if (companyId) getSessions().then((d) => { if (d) setSessions(d); });
  }, [companyId]);

  const open   = sessions.filter((s) => s.status === 'OPEN');
  const closed = sessions.filter((s) => s.status === 'CLOSED');

  const columns = useMemo(() => [
    {
      key: 'register' as keyof CashSession & string,
      header: 'Caisse',
      render: (_: any, row: CashSession) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center shrink-0">
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="font-medium text-sm text-foreground">{row.register?.name ?? '—'}</p>
        </div>
      ),
    },
    {
      key: 'cashier' as keyof CashSession & string,
      header: 'Caissier',
      searchable: false,
      render: (_: any, row: CashSession) => (
        <p className="text-sm text-foreground">
          {row.cashier ? `${row.cashier.firstName} ${row.cashier.lastName}` : '—'}
        </p>
      ),
    },
    {
      key: 'openedAt' as keyof CashSession & string,
      header: 'Ouverture',
      render: (_: any, row: CashSession) => (
        <div>
          <p className="text-sm text-foreground">{fmtDate(row.openedAt)}</p>
          <p className="text-xs text-muted-foreground">{fmtTime(row.openedAt)}</p>
        </div>
      ),
    },
    {
      key: 'closedAt' as keyof CashSession & string,
      header: 'Durée',
      sortable: false,
      render: (_: any, row: CashSession) => (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          {duration(row.openedAt, row.closedAt)}
        </div>
      ),
    },
    {
      key: 'openingAmount' as keyof CashSession & string,
      header: 'Fonds départ',
      render: (_: any, row: CashSession) => (
        <p className="text-sm font-medium text-foreground">{fmt(row.openingAmount)} XOF</p>
      ),
    },
    {
      key: 'closingAmount' as keyof CashSession & string,
      header: 'Clôture',
      render: (_: any, row: CashSession) => (
        row.closingAmount != null
          ? <p className="text-sm font-medium text-foreground">{fmt(row.closingAmount)} XOF</p>
          : <span className="text-xs text-muted-foreground">—</span>
      ),
    },
    {
      key: 'difference' as keyof CashSession & string,
      header: 'Écart',
      render: (_: any, row: CashSession) => {
        const d = row.difference ?? 0;
        if (row.status === 'OPEN') return <span className="text-xs text-muted-foreground">—</span>;
        return (
          <span className={`text-sm font-semibold ${d === 0 ? 'text-muted-foreground' : d > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {d > 0 ? '+' : ''}{fmt(d)} XOF
          </span>
        );
      },
    },
    {
      key: 'status' as keyof CashSession & string,
      header: 'Statut',
      render: (_: any, row: CashSession) => (
        row.status === 'OPEN'
          ? <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Ouverte</Badge>
          : <Badge variant="outline" className="text-muted-foreground">Fermée</Badge>
      ),
    },
  ], []);

   return (
     <div className="space-y-6 p-4">
       <PageHeader
         title="Sessions de caisse"
         description="Historique des ouvertures et fermetures"
         breadcrumbs={[
           { label: 'POS', href: `/dashboard/${slug}/pos` },
           { label: 'Sessions' },
         ]}
       />

      {/* Sessions ouvertes */}
      {open.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <h2 className="font-semibold text-foreground">Sessions en cours ({open.length})</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {open.map((s) => (
              <Card
                key={s.id}
                className="border-emerald-200 bg-emerald-50 cursor-pointer hover:shadow-md transition-all"
                onClick={() => setDetail(s)}
              >
                <CardContent className="py-4 px-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Banknote className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{s.register?.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {s.cashier ? `${s.cashier.firstName} ${s.cashier.lastName}` : '—'}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-600 text-white">Live</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white rounded-lg py-2">
                      <p className="text-xs text-muted-foreground">Départ</p>
                      <p className="text-sm font-semibold text-foreground">{fmt(s.openingAmount)}</p>
                    </div>
                    <div className="bg-white rounded-lg py-2">
                      <p className="text-xs text-muted-foreground">Ventes</p>
                      <p className="text-sm font-semibold text-foreground">{s._count?.sales ?? 0}</p>
                    </div>
                    <div className="bg-white rounded-lg py-2">
                      <p className="text-xs text-muted-foreground">Durée</p>
                      <p className="text-sm font-semibold text-foreground">{duration(s.openedAt)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Historique via DataGrid */}
      <div>
        <h2 className="font-semibold text-foreground mb-3">Historique ({closed.length} sessions)</h2>
        <Card>
          <CardContent className="pt-4">
            <DataGrid<CashSession>
              data={closed}
              columns={columns}
              pageSize={10}
              loading={loading}
              searchPlaceholder="Rechercher par caisse ou caissier..."
              emptyMessage="Aucune session fermée"
              emptyIcon={ClipboardCheck}
              onRowClick={(row) => setDetail(row)}
            />
          </CardContent>
        </Card>
      </div>

      {detail && <SessionDetailModal session={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}
