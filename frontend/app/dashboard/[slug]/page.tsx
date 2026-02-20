'use client';

import { use } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Eye, Settings, Zap } from 'lucide-react';

export default function DashboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Tableau de bord
        </h1>
        <p className="text-slate-600">
          Bienvenue sur votre espace Sorika
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              Votre site web
            </CardTitle>
            <CardDescription>
              Votre site est en ligne et accessible
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-600">URL:</span>
              <code className="bg-white px-2 py-1 rounded border text-blue-600">
                sorika.bj/{slug}
              </code>
            </div>
            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <a href={`/${slug}`} target="_blank">
                  <Eye className="h-4 w-4 mr-2" />
                  Voir mon site
                </a>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <a href={`/editor/${slug}`}>
                  <Settings className="h-4 w-4 mr-2" />
                  Modifier
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-slate-600" />
              Modules actifs
            </CardTitle>
            <CardDescription>
              Les fonctionnalités de votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium">Landing Page</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Actif
                </span>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Activer plus de modules
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Visiteurs (7 jours)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-slate-500 mt-1">Bientôt disponible</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Messages reçus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-slate-500 mt-1">Aucun message</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Statut du site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-lg font-semibold">En ligne</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Tout fonctionne</p>
          </CardContent>
        </Card>
      </div>

      {/* Getting started */}
      <Card>
        <CardHeader>
          <CardTitle>Premiers pas</CardTitle>
          <CardDescription>
            Configurez votre site en quelques étapes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="h-8 w-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold">
                ✓
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Créer votre compte</p>
                <p className="text-xs text-slate-500">Terminé</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 border-2 border-blue-200 bg-blue-50 rounded-lg">
              <div className="h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Personnaliser votre site</p>
                <p className="text-xs text-slate-500">En cours</p>
              </div>
              <Button size="sm" asChild>
                <a href={`/editor/${slug}`}>
                  Commencer
                </a>
              </Button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg opacity-50">
              <div className="h-8 w-8 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Partager votre site</p>
                <p className="text-xs text-slate-500">À venir</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
