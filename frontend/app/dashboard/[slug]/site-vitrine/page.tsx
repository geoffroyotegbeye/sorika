'use client';

import { use, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Monitor, Smartphone, Edit3, ExternalLink, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SiteVitrinePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [company, setCompany] = useState<any>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return;
    const parsed = JSON.parse(userData);
    const currentCompany = parsed.companies?.find((c: any) => c.slug === slug);
    setCompany(currentCompany ?? null);

    // Vérifier si l'utilisateur a déjà commencé à éditer
    // TODO: Remplacer par un vrai check API
    const hasEditedBefore = localStorage.getItem(`site_edited_${slug}`) === 'true';
    setHasStarted(hasEditedBefore);
  }, [slug]);

  const handleEdit = () => {
    // Marquer comme commencé
    localStorage.setItem(`site_edited_${slug}`, 'true');
    router.push(`/editor/${slug}`);
  };

  const handlePreview = () => {
    // Ouvrir le site en prévisualisation dans un nouvel onglet
    window.open(`https://sorika.bj/${slug}`, '_blank');
  };

  if (!company) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Site Vitrine</h1>
          <p className="text-sm text-slate-500 mt-1">
            Créez et gérez votre site web professionnel
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handlePreview}>
            <Globe className="h-4 w-4 mr-2" />
            Voir le site
          </Button>
          <Button onClick={handleEdit}>
            <Edit3 className="h-4 w-4 mr-2" />
            {hasStarted ? 'Continuer à éditer' : 'Commencer à éditer'}
          </Button>
        </div>
      </div>

      {/* Preview Mode Toggle */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant={previewMode === 'desktop' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPreviewMode('desktop')}
        >
          <Monitor className="h-4 w-4 mr-2" />
          Desktop
        </Button>
        <Button
          variant={previewMode === 'mobile' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPreviewMode('mobile')}
        >
          <Smartphone className="h-4 w-4 mr-2" />
          Mobile
        </Button>
      </div>

      {/* Preview Container */}
      <Card className="border border-slate-200 bg-slate-50">
        <CardContent className="p-8">
          <div className="flex items-center justify-center min-h-[600px]">
            {previewMode === 'desktop' ? (
              <div className="w-full max-w-6xl bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden">
                <div className="h-8 bg-slate-100 border-b border-slate-200 flex items-center gap-2 px-4">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="bg-white rounded px-3 py-1 text-xs text-slate-500 border border-slate-200">
                      sorika.bj/{slug}
                    </div>
                  </div>
                </div>
                <iframe
                  src={`https://sorika.bj/${slug}`}
                  className="w-full h-[600px] bg-white"
                  title="Prévisualisation Desktop"
                />
              </div>
            ) : (
              <div className="relative">
                <div className="w-[375px] h-[667px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl">
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-slate-900 rounded-b-3xl z-10" />
                    <iframe
                      src={`https://sorika.bj/${slug}`}
                      className="w-full h-full bg-white"
                      title="Prévisualisation Mobile"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Statut</p>
                <p className="text-lg font-semibold text-slate-900">
                  {hasStarted ? 'En cours' : 'Non démarré'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center">
                <ExternalLink className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">URL du site</p>
                <p className="text-sm font-medium text-slate-900 truncate">
                  sorika.bj/{slug}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <Edit3 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Dernière modification</p>
                <p className="text-sm font-medium text-slate-900">
                  {hasStarted ? 'Aujourd\'hui' : 'Jamais'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
