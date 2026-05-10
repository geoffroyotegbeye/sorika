'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import type { Department, CreateDepartmentDto, UpdateDepartmentDto } from '@/types/hr';

interface DepartmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
  onCreate: (dto: CreateDepartmentDto) => Promise<void>;
  onUpdate: (departmentId: string, dto: UpdateDepartmentDto) => Promise<void>;
}

export function DepartmentFormDialog({
  open,
  onOpenChange,
  department,
  onCreate,
  onUpdate,
}: DepartmentFormDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const isEdit = !!department;

  useEffect(() => {
    if (department) {
      setName(department.name);
      setDescription(department.description ?? '');
    } else {
      resetForm();
    }
  }, [department]);

  const resetForm = () => {
    setName('');
    setDescription('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Le nom du département est requis');
      return;
    }

    setLoading(true);
    try {
      const dto: CreateDepartmentDto | UpdateDepartmentDto = {
        name: name.trim(),
        description: description.trim() || undefined,
      };

      if (isEdit) {
        await onUpdate(department.id, dto);
        toast.success('Département mis à jour');
      } else {
        await onCreate(dto as CreateDepartmentDto);
        toast.success('Département créé');
      }

      resetForm();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Modifier le département' : 'Ajouter un département'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Modifiez les informations du département' : 'Créez un nouveau département'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nom *</Label>
            <Input
              id="name"
              placeholder="Ex: Développement"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Description du département (optionnel)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
