'use client';

import { use } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Clock } from 'lucide-react';

export default function TimeTrackingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Suivi du temps</h1>
          <p className="text-sm text-slate-500 mt-1">
            Enregistrez le temps passé sur vos projets
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle entrée
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Aujourd'hui
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">0h</div>
            <p className="text-xs text-slate-500 mt-1">Temps enregistré</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Cette semaine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">0h</div>
            <p className="text-xs text-slate-500 mt-1">Temps enregistré</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Ce mois
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">0h</div>
            <p className="text-xs text-slate-500 mt-1">Temps enregistré</p>
          </CardContent>
        </Card>
      </div>

      {/* Entrées de temps */}
      <Card>
        <CardHeader>
          <CardTitle>Entrées récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-900 mb-1">
              Aucune entrée de temps
            </p>
            <p className="text-xs text-slate-500">
              Commencez à enregistrer votre temps
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
