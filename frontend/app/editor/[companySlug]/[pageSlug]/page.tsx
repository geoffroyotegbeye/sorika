'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { IconSidebar } from '@/components/editor/IconSidebar';
import { ElementsPanel } from '@/components/editor/ElementsPanel';
import { Canvas } from '@/components/editor/Canvas';
import { PropertiesPanel } from '@/components/editor/PropertiesPanel';
import { Toolbar } from '@/components/editor/Toolbar';
import { PageManager } from '@/components/editor/PageManager';
import { useEditorStore } from '@/lib/stores/editor-store';
import { usePagesStore } from '@/lib/stores/pages-store';
import { Loader2 } from 'lucide-react';

export default function EditorPageWithSlug() {
  const params = useParams();
  const router = useRouter();
  const companySlug = params.companySlug as string;
  const pageSlug = params.pageSlug as string;
  const [isLoading, setIsLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [isPagesOpen, setIsPagesOpen] = useState(false);
  const { setElements, hasUnsavedChanges, selectedElementId, copyElement, pasteElement, elements, clipboard } = useEditorStore();
  const { currentPageSlug } = usePagesStore();

  // Raccourcis clavier pour copier/coller
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorer si on est dans un input ou textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      // Ctrl+C ou Cmd+C pour copier
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedElementId) {
        e.preventDefault();
        copyElement(selectedElementId);
        console.log('Élément copié:', selectedElementId);
      }

      // Ctrl+V ou Cmd+V pour coller
      if ((e.ctrlKey || e.metaKey) && e.key === 'v' && clipboard) {
        e.preventDefault();
        
        // Vérifier si l'élément sélectionné peut contenir des enfants
        const canContainChildren = (type: string) => {
          return ['section', 'container', 'grid', 'vflex', 'hflex', 'div', 'link-block', 'navbar', 'header', 'footer'].includes(type);
        };
        
        // Trouver l'élément sélectionné
        const findElement = (items: any[], id: string | null): any => {
          if (!id) return null;
          for (const item of items) {
            if (item.id === id) return item;
            if (item.children?.length > 0) {
              const found = findElement(item.children, id);
              if (found) return found;
            }
          }
          return null;
        };
        
        const selectedElement = findElement(elements, selectedElementId);
        
        if (selectedElement && canContainChildren(selectedElement.type)) {
          // Coller dans l'élément sélectionné
          pasteElement(selectedElementId || undefined);
          console.log('Élément collé dans:', selectedElementId);
        } else {
          // Coller à la racine si aucun élément valide n'est sélectionné
          pasteElement(undefined);
          console.log('Élément collé à la racine');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, copyElement, pasteElement, elements, clipboard]);

  // Redirection automatique si la page active change
  useEffect(() => {
    if (currentPageSlug && currentPageSlug !== pageSlug) {
      router.push(`/editor/${companySlug}/${currentPageSlug}`);
    }
  }, [currentPageSlug, pageSlug, companySlug, router]);

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
    const fetchData = async () => {
      try {
        console.log('Fetching company with slug:', companySlug);
        const companyRes = await fetch(`http://localhost:3001/companies/slug/${companySlug}`);
        if (!companyRes.ok) throw new Error('Company not found');
        
        const company = await companyRes.json();
        console.log('Company found:', company);
        setCompanyId(company.id);

        console.log('Fetching page with slug:', pageSlug);
        const pageRes = await fetch(`http://localhost:3001/companies/${company.id}/pages/${pageSlug}`);
        if (pageRes.ok) {
          const page = await pageRes.json();
          console.log('Page data received:', page);
          console.log('Elements to set:', page.elements);
          setElements(page.elements || []);
        } else {
          console.log('Page not found, status:', pageRes.status);
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [companySlug, pageSlug, setElements]);

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
      <Toolbar companyId={companyId} companySlug={companySlug} pageSlug={pageSlug} />

      <div className="flex-1 flex overflow-hidden">
        <IconSidebar onPagesClick={() => setIsPagesOpen(!isPagesOpen)} />

        {companyId && (
          <PageManager 
            companyId={companyId} 
            isOpen={isPagesOpen}
            onClose={() => setIsPagesOpen(false)}
          />
        )}
        
        <ElementsPanel />
        <Canvas />
        <PropertiesPanel />
      </div>
    </div>
  );
}
