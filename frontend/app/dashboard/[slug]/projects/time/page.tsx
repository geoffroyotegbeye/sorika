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
          <h1 className="text-2xl font-bold text-foreground">Suivi du temps</h1>
          <p className="text-sm text-muted-foreground mt-1">
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
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Aujourd'hui
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">0h</div>
            <p className="text-xs text-muted-foreground mt-1">Temps enregistré</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cette semaine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">0h</div>
            <p className="text-xs text-muted-foreground mt-1">Temps enregistré</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ce mois
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">0h</div>
            <p className="text-xs text-muted-foreground mt-1">Temps enregistré</p>
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
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              Aucune entrée de temps
            </p>
            <p className="text-xs text-muted-foreground">
              Commencez à enregistrer votre temps
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
