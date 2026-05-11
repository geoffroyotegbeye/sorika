'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInventory } from '@/hooks/useInventory';
import type { ProductCategory } from '@/types/inventory';
import { toast } from 'sonner';

interface CategoryFormDialogProps {
  companyId: string;
  category: ProductCategory | null;
  categories: ProductCategory[];
  open: boolean;
  onClose: () => void;
}

export function CategoryFormDialog({
  companyId,
  category,
  categories,
  open,
  onClose,
}: CategoryFormDialogProps) {
  const { createCategory, updateCategory } = useInventory(companyId);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentId: '',
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        parentId: category.parentId || '',
      });
    } else {
      setFormData({ name: '', description: '', parentId: '' });
    }
  }, [category, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (category) {
        await updateCategory(category.id, formData);
        toast.success('Catégorie modifiée');
      } else {
        await createCategory(formData);
        toast.success('Catégorie créée');
      }
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les catégories pour éviter les boucles
  const availableParents = categories.filter((c) => c.id !== category?.id);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{category ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de la catégorie *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Électronique, Vêtements..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Description de la catégorie..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentId">Catégorie parente</Label>
            <Select
              value={formData.parentId || 'none'}
              onValueChange={(value) => setFormData({ ...formData, parentId: value === 'none' ? '' : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Aucune (catégorie racine)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucune (catégorie racine)</SelectItem>
                {availableParents.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500">
              Laissez vide pour créer une catégorie principale
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : category ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
