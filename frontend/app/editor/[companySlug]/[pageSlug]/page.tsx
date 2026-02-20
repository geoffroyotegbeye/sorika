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
import { Loader2 } from 'lucide-react';

export default function EditorPageWithSlug() {
  const params = useParams();
  const companySlug = params.companySlug as string;
  const pageSlug = params.pageSlug as string;
  const [isLoading, setIsLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [isPagesOpen, setIsPagesOpen] = useState(false);
  const { setElements, hasUnsavedChanges } = useEditorStore();

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
        const companyRes = await fetch(`http://localhost:3001/companies/slug/${companySlug}`);
        if (!companyRes.ok) throw new Error('Company not found');
        
        const company = await companyRes.json();
        setCompanyId(company.id);

        const pageRes = await fetch(`http://localhost:3001/companies/${company.id}/pages/${pageSlug}`);
        if (pageRes.ok) {
          const page = await pageRes.json();
          setElements(page.elements || []);
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
        <PropertiesPanelNew />
      </div>
    </div>
  );
}
