'use client';

import { Button } from '@/components/ui/button';
import { useEditorStore } from '@/lib/stores/editor-store';
import { ConfirmDialog } from './ConfirmDialog';
import { 
  Undo2, 
  Redo2, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Eye, 
  Save,
  Rocket,
  ArrowLeft,
  Tag
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface ToolbarProps {
  companyId: string | null;
  slug: string;
  pageSlug: string | null;
}

export function Toolbar({ companyId, slug, pageSlug }: ToolbarProps) {
  const router = useRouter();
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const { 
    currentBreakpoint, 
    setBreakpoint, 
    undo, 
    redo, 
    elements,
    history,
    historyIndex,
    showLabels,
    toggleLabels,
    markAsSaved
  } = useEditorStore();

  // Raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S : Sauvegarder
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      // Ctrl+Z : Annuler
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      // Ctrl+Shift+Z ou Ctrl+Y : Refaire
      if ((e.ctrlKey || e.metaKey) && (e.shiftKey && e.key === 'z' || e.key === 'y')) {
        e.preventDefault();
        redo();
      }
      // Ctrl+P : Aperçu
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        handlePreview();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [companyId, elements]);

  const handleSave = async () => {
    if (!companyId || !pageSlug) return;

    try {
      const response = await fetch(`http://localhost:3001/companies/${companyId}/pages/${pageSlug}/elements`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ elements }),
      });

      if (response.ok) {
        markAsSaved();
        toast.success('Modifications sauvegardées');
      } else {
        throw new Error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      toast.error('Impossible de sauvegarder');
    }
  };

  const handlePublish = async () => {
    if (!companyId) return;

    try {
      // Sauvegarder d'abord
      await handleSave();

      // Puis publier toutes les pages
      const response = await fetch(`http://localhost:3001/companies/${companyId}/pages/publish-all`, {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Site publié avec succès! 🎉');
      } else {
        throw new Error('Erreur lors de la publication');
      }
    } catch (error) {
      toast.error('Impossible de publier');
    }
  };

  const handlePreview = () => {
    window.open(`/preview/${slug}`, '_blank');
  };

  const handleBackToDashboard = () => {
    router.push(`/dashboard/${slug}`);
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4">
      {/* Gauche: Navigation */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackToDashboard}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au dashboard
        </Button>

        <div className="h-6 w-px bg-slate-200" />

        <Button
          variant="ghost"
          size="icon"
          onClick={undo}
          disabled={!canUndo}
          title="Annuler (Ctrl+Z)"
        >
          <Undo2 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={redo}
          disabled={!canRedo}
          title="Refaire (Ctrl+Shift+Z)"
        >
          <Redo2 className="h-4 w-4" />
        </Button>

        <div className="h-6 w-px bg-slate-200" />

        <Button
          variant={showLabels ? 'default' : 'ghost'}
          size="icon"
          onClick={toggleLabels}
          title="Afficher/Masquer les labels (L)"
        >
          <Tag className="h-4 w-4" />
        </Button>
      </div>

      {/* Centre: Breakpoints */}
      <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
        <Button
          variant={currentBreakpoint === 'desktop' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setBreakpoint('desktop')}
          className="gap-2"
        >
          <Monitor className="h-4 w-4" />
          Desktop
        </Button>
        <Button
          variant={currentBreakpoint === 'tablet' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setBreakpoint('tablet')}
          className="gap-2"
        >
          <Tablet className="h-4 w-4" />
          Tablet
        </Button>
        <Button
          variant={currentBreakpoint === 'mobile' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setBreakpoint('mobile')}
          className="gap-2"
        >
          <Smartphone className="h-4 w-4" />
          Mobile
        </Button>
      </div>

      {/* Droite: Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreview}
          className="gap-2"
          title="Aperçu (Ctrl+P)"
        >
          <Eye className="h-4 w-4" />
          Aperçu
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          className="gap-2"
          title="Sauvegarder (Ctrl+S)"
        >
          <Save className="h-4 w-4" />
          Sauvegarder
        </Button>

        <Button
          size="sm"
          onClick={() => setShowPublishDialog(true)}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Rocket className="h-4 w-4" />
          Publier
        </Button>
      </div>

      {/* Modal de confirmation de publication */}
      <ConfirmDialog
        open={showPublishDialog}
        onOpenChange={setShowPublishDialog}
        title="Publier votre site ?"
        description="Votre site sera visible publiquement à l'adresse sorika.bj/{slug}. Les modifications seront immédiatement disponibles."
        confirmText="Publier maintenant"
        cancelText="Annuler"
        variant="default"
        onConfirm={handlePublish}
      />
    </div>
  );
}
