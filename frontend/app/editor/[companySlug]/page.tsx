'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { IconSidebar } from '@/components/editor/IconSidebar';
import { ElementsPanel } from '@/components/editor/ElementsPanel';
import { Canvas } from '@/components/editor/Canvas';
import { PropertiesPanel } from '@/components/editor/PropertiesPanel';
import { Toolbar } from '@/components/editor/Toolbar';
import { PageManager } from '@/components/editor/PageManager';
import { ConfirmDialog } from '@/components/editor/ConfirmDialog';
import { useEditorStore } from '@/lib/stores/editor-store';
import { usePagesStore } from '@/lib/stores/pages-store';
import { Loader2 } from 'lucide-react';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const companySlug = params.companySlug as string;
  const [isLoading, setIsLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [isPagesOpen, setIsPagesOpen] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const { setElements, elements, hasUnsavedChanges, setHasUnsavedChanges } = useEditorStore();
  const { currentPageSlug, setPages, setCurrentPage, pages } = usePagesStore();

  const handleSave = async () => {
    if (!companyId || !currentPageSlug) return;

    try {
      const response = await fetch(
        `http://localhost:3001/companies/${companyId}/pages/${currentPageSlug}/elements`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ elements }),
        }
      );

      if (response.ok) {
        setHasUnsavedChanges(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      return false;
    }
  };

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
    const fetchCompanyAndPages = async () => {
      try {
        // Récupérer le companyId depuis le slug
        const companyRes = await fetch(`http://localhost:3001/companies/slug/${companySlug}`);
        if (!companyRes.ok) throw new Error('Company not found');
        
        const company = await companyRes.json();
        setCompanyId(company.id);

        // Charger les pages
        const pagesRes = await fetch(`http://localhost:3001/companies/${company.id}/pages`);
        if (pagesRes.ok) {
          let pagesData = await pagesRes.json();
          
          // Si aucune page n'existe, créer une page d'accueil par défaut
          if (pagesData.length === 0) {
            const createRes = await fetch(`http://localhost:3001/companies/${company.id}/pages`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                title: 'Accueil',
                slug: 'accueil',
                description: 'Page d\'accueil',
                isHomePage: true,
              }),
            });
            
            if (createRes.ok) {
              const newPage = await createRes.json();
              pagesData = [newPage];
            }
          }
          
          setPages(pagesData);
          
          // Définir la page actuelle (home page ou première page)
          const homePage = pagesData.find((p: any) => p.isHomePage);
          const firstPage = pagesData[0];
          if (homePage) {
            setCurrentPage(homePage.slug);
          } else if (firstPage) {
            setCurrentPage(firstPage.slug);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyAndPages();
  }, [companySlug, setPages, setCurrentPage]);

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
      {/* Modal de confirmation pour modifications non enregistrées */}
      <ConfirmDialog
        open={showUnsavedDialog}
        onOpenChange={setShowUnsavedDialog}
        title="Modifications non enregistrées"
        description="Vous avez des modifications non enregistrées. Voulez-vous les enregistrer avant de continuer ?"
        confirmText="Enregistrer"
        cancelText="Ne pas enregistrer"
        variant="default"
        onConfirm={async () => {
          const saved = await handleSave();
          if (saved && pendingNavigation) {
            router.push(pendingNavigation);
          }
          setShowUnsavedDialog(false);
          setPendingNavigation(null);
        }}
        onCancel={() => {
          if (pendingNavigation) {
            setHasUnsavedChanges(false);
            router.push(pendingNavigation);
          }
          setShowUnsavedDialog(false);
          setPendingNavigation(null);
        }}
      />

      {/* Toolbar en haut */}
      <Toolbar companyId={companyId} companySlug={companySlug} pageSlug={currentPageSlug || 'default'} />

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
        <PropertiesPanel />
      </div>
    </div>
  );
}
