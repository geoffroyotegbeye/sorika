'use client';

import { use, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePOS } from '@/hooks/usePOS';
import type { CashSession } from '@/types/pos';
import { ClipboardCheck, Banknote, Users, TrendingUp, AlertCircle } from 'lucide-react';

export default function SessionsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [companyId, setCompanyId] = useState<string>('');
  const [sessions, setSessions] = useState<CashSession[]>([]);
  const { getSessions, loading } = usePOS(companyId);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return;
    const parsed = JSON.parse(userData);
    const company = parsed.companies?.find((c: any) => c.slug === slug);
    if (company) {
      setCompanyId(company.id);
    }
  }, [slug]);

  useEffect(() => {
    if (!companyId) return;
    loadSessions();
  }, [companyId]);

  const loadSessions = async () => {
    const data = await getSessions();
    if (data) setSessions(data);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  const openSessions = sessions.filter((s) => s.status === 'OPEN');
  const closedSessions = sessions.filter((s) => s.status === 'CLOSED');

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Sessions de caisse</h1>
        <p className="text-sm text-slate-500 mt-1">
          Historique des ouvertures et fermetures de caisse
        </p>
      </div>

      {/* Sessions ouvertes */}
      {openSessions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            Sessions ouvertes ({openSessions.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {openSessions.map((session) => (
              <Card key={session.id} className="border-emerald-200 bg-emerald-50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Banknote className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          {session.register?.name}
                        </CardTitle>
                        <p className="text-xs text-slate-600 mt-0.5">
                          <Users className="h-3 w-3 inline mr-1" />
                          {session.cashier?.firstName} {session.cashier?.lastName}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-600">Ouverte</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Ouvert le</span>
                      <span className="font-medium">
                        {formatDate(session.openedAt)} à {formatTime(session.openedAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Fonds de départ</span>
                      <span className="font-medium">
                        {formatCurrency(session.openingAmount)} XOF
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Ventes</span>
                      <span className="font-medium">
                        {session._count?.sales || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Sessions fermées */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">
          Historique ({closedSessions.length})
        </h2>
        {closedSessions.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <ClipboardCheck className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p className="text-slate-500">Aucune session fermée</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {closedSessions.map((session) => (
              <Card key={session.id}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Banknote className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {session.register?.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {session.cashier?.firstName} {session.cashier?.lastName} •{' '}
                          {formatDate(session.openedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Ventes</p>
                        <p className="font-medium text-slate-900">
                          {session._count?.sales || 0}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Attendu</p>
                        <p className="font-medium text-slate-900">
                          {formatCurrency(session.expectedAmount || 0)} XOF
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Compté</p>
                        <p className="font-medium text-slate-900">
                          {formatCurrency(session.closingAmount || 0)} XOF
                        </p>
                      </div>
                      {session.difference !== 0 && (
                        <div className="text-right">
                          <p className="text-xs text-slate-500">Écart</p>
                          <p
                            className={`font-medium ${
                              (session.difference || 0) > 0
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {(session.difference || 0) > 0 ? '+' : ''}
                            {formatCurrency(session.difference || 0)} XOF
                          </p>
                        </div>
                      )}
                      <Badge variant="outline">Fermée</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
