'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { IconSidebar } from '@/components/editor/IconSidebar';
import { ElementsPanel } from '@/components/editor/ElementsPanel';
import { Canvas } from '@/components/editor/Canvas';
import { PropertiesPanelNew } from '@/components/editor/PropertiesPanelNew';
import { Toolbar } from '@/components/editor/Toolbar';
import { PageManager } from '@/components/editor/PageManager';
import { useEditorStore } from '@/lib/stores/editor-store';
import { usePagesStore } from '@/lib/stores/pages-store';
import { Loader2 } from 'lucide-react';

export default function EditorPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [isLoading, setIsLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [isPagesOpen, setIsPagesOpen] = useState(false);
  const { setElements, elements, hasUnsavedChanges } = useEditorStore();
  const { currentPageSlug, getCurrentPage } = usePagesStore();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    const fetchLandingPage = async () => {
      try {
        // Récupérer le companyId depuis le slug
        const companyRes = await fetch(`http://localhost:3001/companies/slug/${slug}`);
        if (!companyRes.ok) throw new Error('Company not found');
        
        const company = await companyRes.json();
        setCompanyId(company.id);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLandingPage();
  }, [slug]);

  // Charger les éléments de la page actuelle
  useEffect(() => {
    if (!companyId || !currentPageSlug) return;

    const fetchPageElements = async () => {
      try {
        const response = await fetch(`http://localhost:3001/companies/${companyId}/pages/${currentPageSlug}`);
        
        if (response.ok) {
          const data = await response.json();
          const loadedElements = data.elements || [];
          
          // Si aucun élément, créer une section par défaut
          if (loadedElements.length === 0) {
            const defaultSection = {
              id: `section-${Date.now()}`,
              type: 'section',
              tag: 'section',
              content: '',
              styles: {
                desktop: {
                  display: 'block',
                  padding: '80px 20px',
                  backgroundColor: '#ffffff',
                  minHeight: '400px',
                },
              },
              children: [],
            };
            setElements([defaultSection]);
          } else {
            setElements(loadedElements);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la page:', error);
      }
    };

    fetchPageElements();
  }, [companyId, currentPageSlug, setElements]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600">Chargement de l'éditeur...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Toolbar en haut */}
      <Toolbar companyId={companyId} slug={slug} pageSlug={currentPageSlug} />

      {/* Layout principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Fine sidebar avec icône Pages */}
        <IconSidebar onPagesClick={() => setIsPagesOpen(!isPagesOpen)} />

        {/* Sliding panel Pages */}
        {companyId && (
          <PageManager 
            companyId={companyId} 
            isOpen={isPagesOpen}
            onClose={() => setIsPagesOpen(false)}
          />
        )}
        
        {/* Panneau éléments */}
        <ElementsPanel />

        {/* Canvas central */}
        <Canvas />

        {/* Panneau droit: Propriétés */}
        <PropertiesPanelNew />
      </div>
    </div>
  );
}
