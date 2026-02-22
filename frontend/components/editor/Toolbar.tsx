'use client';

import { Button } from '@/components/ui/button';
import { useEditorStore } from '@/lib/stores/editor-store';
import { ConfirmDialog } from './ConfirmDialog';
import { ExportButton } from './ExportButton';
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
  Tag,
  Share2,
  Check,
  Copy,
  EyeOff,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface ToolbarProps {
  companyId: string | null;
  companySlug: string;
  pageSlug: string | null;
}

export function Toolbar({ companyId, companySlug, pageSlug }: ToolbarProps) {
  const router = useRouter();
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [showUnpublishDialog, setShowUnpublishDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [copied, setCopied] = useState(false);
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
    markAsSaved,
    clipboard
  } = useEditorStore();

  // Vérifier si le site est publié
  useEffect(() => {
    const checkPublishStatus = async () => {
      if (!companyId || !pageSlug) return;
      
      try {
        const response = await fetch(`http://localhost:3001/companies/${companyId}/pages/${pageSlug}`);
        if (response.ok) {
          const page = await response.json();
          setIsPublished(page.isPublished);
        }
      } catch (error) {
        console.error('Erreur vérification statut:', error);
      }
    };

    checkPublishStatus();
  }, [companyId, pageSlug]);

  // Raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.shiftKey && e.key === 'z' || e.key === 'y')) {
        e.preventDefault();
        redo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        handlePreview();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [companyId, elements]);

  const handleSave = async () => {
    if (!companyId || !pageSlug) {
      console.log('Cannot save - companyId:', companyId, 'pageSlug:', pageSlug);
      toast.error('Impossible de sauvegarder: informations manquantes');
      return;
    }

    console.log('Saving to:', `http://localhost:3001/companies/${companyId}/pages/${pageSlug}/elements`);
    console.log('Elements:', elements);

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
        const errorData = await response.json().catch(() => ({}));
        console.error('Save error:', errorData);
        throw new Error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Save exception:', error);
      toast.error('Impossible de sauvegarder');
    }
  };

  const handlePublish = async () => {
    if (!companyId) return;

    try {
      await handleSave();

      const response = await fetch(`http://localhost:3001/companies/${companyId}/pages/publish-all`, {
        method: 'POST',
      });

      if (response.ok) {
        setIsPublished(true);
        toast.success('Site publié avec succès! 🎉');
      } else {
        throw new Error('Erreur lors de la publication');
      }
    } catch (error) {
      toast.error('Impossible de publier');
    }
  };

  const handleUnpublish = async () => {
    if (!companyId) return;

    try {
      const response = await fetch(`http://localhost:3001/companies/${companyId}/pages/unpublish-all`, {
        method: 'POST',
      });

      if (response.ok) {
        setIsPublished(false);
        toast.success('Site dépublié');
      } else {
        throw new Error('Erreur lors de la dépublication');
      }
    } catch (error) {
      toast.error('Impossible de dépublier');
    }
  };

  const handleOpenPublicSite = () => {
    const url = pageSlug 
      ? `${window.location.origin}/${companySlug}/${pageSlug}`
      : `${window.location.origin}/${companySlug}`;
    window.open(url, '_blank');
  };

  const handlePreview = () => {
    if (pageSlug) {
      window.open(`/preview/${companySlug}/${pageSlug}`, '_blank');
    } else {
      window.open(`/preview/${companySlug}`, '_blank');
    }
  };

  const handleShare = () => {
    setShowShareDialog(true);
  };

  const handleCopyLink = () => {
    const link = pageSlug 
      ? `${window.location.origin}/${companySlug}/${pageSlug}`
      : `${window.location.origin}/${companySlug}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Lien copié !');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBackToDashboard = () => {
    router.push(`/dashboard/${companySlug}`);
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
        {clipboard && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-700">
            <Copy className="h-3 w-3" />
            <span>{clipboard.type} copié</span>
          </div>
        )}
        
        <ExportButton />
        
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

        {isPublished ? (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUnpublishDialog(true)}
              className="gap-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
            >
              <EyeOff className="h-4 w-4" />
              Dépublier
            </Button>
            <Button
              size="sm"
              onClick={handleShare}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              <Share2 className="h-4 w-4" />
              Partager
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            onClick={() => setShowPublishDialog(true)}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Rocket className="h-4 w-4" />
            Publier
          </Button>
        )}
      </div>

      {/* Modal de confirmation de publication */}
      <ConfirmDialog
        open={showPublishDialog}
        onOpenChange={setShowPublishDialog}
        title="Publier votre site ?"
        description="Votre site sera visible publiquement à l'adresse sorika.bj/{companySlug}. Les modifications seront immédiatement disponibles."
        confirmText="Publier maintenant"
        cancelText="Annuler"
        variant="default"
        onConfirm={handlePublish}
      />

      {/* Modal de dépublication */}
      <ConfirmDialog
        open={showUnpublishDialog}
        onOpenChange={setShowUnpublishDialog}
        title="Dépublier votre site ?"
        description="Votre site ne sera plus accessible publiquement. Vous pourrez le republier à tout moment."
        confirmText="Dépublier"
        cancelText="Annuler"
        variant="destructive"
        onConfirm={handleUnpublish}
      />

      {/* Modal de partage */}
      <ConfirmDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        title="Partager votre site"
        description={
          <div className="space-y-3">
            <p className="text-sm text-slate-600">Votre site est en ligne ! Partagez ce lien :</p>
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border">
              <code className="flex-1 text-sm text-blue-600 font-mono">
                {typeof window !== 'undefined' 
                  ? pageSlug 
                    ? `${window.location.origin}/${companySlug}/${pageSlug}`
                    : `${window.location.origin}/${companySlug}`
                  : pageSlug
                    ? `sorika.bj/${companySlug}/${pageSlug}`
                    : `sorika.bj/${companySlug}`
                }
              </code>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopyLink}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    Copié
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copier
                  </>
                )}
              </Button>
            </div>
            <Button
              onClick={handleOpenPublicSite}
              className="w-full gap-2"
              variant="outline"
            >
              <ExternalLink className="h-4 w-4" />
              Ouvrir dans un nouvel onglet
            </Button>
          </div>
        }
        confirmText="Fermer"
        cancelText=""
        variant="default"
        onConfirm={() => setShowShareDialog(false)}
      />
    </div>
  );
}
