'use client';

import { useState, useEffect } from 'react';
import { usePagesStore } from '@/lib/stores/pages-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, MoreVertical, Home, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ConfirmDialog } from './ConfirmDialog';

interface PageManagerProps {
  companyId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function PageManager({ companyId, isOpen, onClose }: PageManagerProps) {
  const { pages, currentPageSlug, setPages, setCurrentPage, addPage, removePage, updatePage } = usePagesStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletePageSlug, setDeletePageSlug] = useState<string | null>(null);
  const [editingPage, setEditingPage] = useState<any>(null);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');

  useEffect(() => {
    fetchPages();
  }, [companyId]);

  const fetchPages = async () => {
    try {
      const response = await fetch(`http://localhost:3001/companies/${companyId}/pages`);
      if (response.ok) {
        const data = await response.json();
        setPages(data);
        if (data.length > 0 && !currentPageSlug) {
          const homePage = data.find((p: any) => p.isHomePage);
          setCurrentPage(homePage?.slug || data[0].slug);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des pages:', error);
    }
  };

  const handleCreatePage = async () => {
    if (!newPageTitle || !newPageSlug) {
      toast.error('Titre et slug requis');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/companies/${companyId}/pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newPageTitle,
          slug: newPageSlug,
          elements: [],
          isHomePage: pages.length === 0,
        }),
      });

      if (response.ok) {
        const newPage = await response.json();
        addPage(newPage);
        setCurrentPage(newPage.slug);
        setIsCreateDialogOpen(false);
        setNewPageTitle('');
        setNewPageSlug('');
        toast.success('Page créée');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Erreur lors de la création');
      }
    } catch (error) {
      toast.error('Erreur réseau');
    }
  };

  const handleDeletePage = async (slug: string) => {
    setDeletePageSlug(slug);
  };

  const confirmDeletePage = async () => {
    if (!deletePageSlug) return;

    const isCurrentPage = currentPageSlug === deletePageSlug;

    try {
      const response = await fetch(`http://localhost:3001/companies/${companyId}/pages/${deletePageSlug}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        removePage(deletePageSlug);
        
        // Si on supprime la page active, la redirection est gérée automatiquement par le store
        if (isCurrentPage) {
          onClose(); // Fermer le panneau pour voir la nouvelle page
        }
        
        toast.success('Page supprimée');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      toast.error('Erreur réseau');
    } finally {
      setDeletePageSlug(null);
    }
  };

  const handleEditPage = (page: any) => {
    setEditingPage(page);
    setNewPageTitle(page.title);
    setNewPageSlug(page.slug);
    setIsEditDialogOpen(true);
  };

  const handleUpdatePage = async () => {
    if (!newPageTitle || !newPageSlug || !editingPage) return;

    try {
      const response = await fetch(`http://localhost:3001/companies/${companyId}/pages/${editingPage.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newPageTitle,
          slug: newPageSlug,
        }),
      });

      if (response.ok) {
        const updated = await response.json();
        updatePage(editingPage.slug, updated);
        if (currentPageSlug === editingPage.slug) {
          setCurrentPage(updated.slug);
        }
        setIsEditDialogOpen(false);
        setEditingPage(null);
        setNewPageTitle('');
        setNewPageSlug('');
        toast.success('Page modifiée');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Erreur lors de la modification');
      }
    } catch (error) {
      toast.error('Erreur réseau');
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={onClose}
        />
      )}
      
      <div className={cn(
        "fixed left-14 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 z-50 transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-[400px]"
      )}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Pages</h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsCreateDialogOpen(true)}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

      <div className="space-y-1">
        {pages.map((page) => (
          <div
            key={page.id}
            className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-slate-100 ${
              currentPageSlug === page.slug ? 'bg-blue-50 border border-blue-200' : ''
            }`}
            onClick={() => {
              setCurrentPage(page.slug);
              onClose();
            }}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {page.isHomePage && <Home className="h-3 w-3 text-blue-600 flex-shrink-0" />}
              <span className="text-sm truncate">{page.title}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEditPage(page)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </DropdownMenuItem>
                {!page.isHomePage && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDeletePage(page.slug)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
        </div>
      </div>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle page</DialogTitle>
            <DialogDescription>
              Créez une nouvelle page pour votre site
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={newPageTitle}
                onChange={(e) => {
                  setNewPageTitle(e.target.value);
                  setNewPageSlug(generateSlug(e.target.value));
                }}
                placeholder="À propos"
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                value={newPageSlug}
                onChange={(e) => setNewPageSlug(e.target.value)}
                placeholder="a-propos"
              />
              <p className="text-xs text-slate-500 mt-1">
                URL: /{newPageSlug || 'slug'}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreatePage}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la page</DialogTitle>
            <DialogDescription>
              Modifiez le titre et l'URL de la page
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Titre</Label>
              <Input
                id="edit-title"
                value={newPageTitle}
                onChange={(e) => setNewPageTitle(e.target.value)}
                placeholder="À propos"
              />
            </div>
            <div>
              <Label htmlFor="edit-slug">Slug (URL)</Label>
              <Input
                id="edit-slug"
                value={newPageSlug}
                onChange={(e) => setNewPageSlug(e.target.value)}
                placeholder="a-propos"
                disabled={editingPage?.isHomePage}
              />
              <p className="text-xs text-slate-500 mt-1">
                {editingPage?.isHomePage ? 'Le slug de la page d\'accueil ne peut pas être modifié' : `URL: /${newPageSlug || 'slug'}`}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdatePage}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deletePageSlug}
        onOpenChange={(open) => !open && setDeletePageSlug(null)}
        title="Supprimer cette page ?"
        description="Cette action est irréversible. Tous les éléments de la page seront supprimés."
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
        onConfirm={confirmDeletePage}
      />
    </>
  );
}
