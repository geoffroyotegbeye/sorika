'use client';

import { use, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePOS } from '@/hooks/usePOS';
import type { CashRegister } from '@/types/pos';
import { Banknote, Plus, MapPin, CheckCircle, XCircle } from 'lucide-react';

export default function RegistersPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [companyId, setCompanyId] = useState<string>('');
  const [registers, setRegisters] = useState<CashRegister[]>([]);
  const { getRegisters, loading } = usePOS(companyId);

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
    loadRegisters();
  }, [companyId]);

  const loadRegisters = async () => {
    const data = await getRegisters();
    if (data) setRegisters(data);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Caisses</h1>
          <p className="text-sm text-slate-500 mt-1">
            Gestion des caisses enregistreuses
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle caisse
        </Button>
      </div>

      {/* Liste des caisses */}
      {registers.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Banknote className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p className="text-slate-500 mb-4">Aucune caisse enregistrée</p>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Créer la première caisse
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {registers.map((register) => (
            <Card key={register.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Banknote className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{register.name}</CardTitle>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Code: {register.code}
                      </p>
                    </div>
                  </div>
                  {register.isActive ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-slate-300" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {register.location && (
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                    <MapPin className="h-4 w-4" />
                    {register.location}
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-slate-500">Sessions</p>
                    <p className="font-medium text-slate-900">
                      {register._count?.sessions || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Ventes</p>
                    <p className="font-medium text-slate-900">
                      {register._count?.sales || 0}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Modifier
                  </Button>
                  <Button
                    variant={register.isActive ? 'outline' : 'default'}
                    size="sm"
                    className="flex-1"
                  >
                    {register.isActive ? 'Désactiver' : 'Activer'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
