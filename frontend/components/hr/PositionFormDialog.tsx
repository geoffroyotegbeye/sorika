'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { usePositions } from '@/hooks/usePositions';
import type { Position, PositionLevel } from '@/types/hr';

interface PositionFormDialogProps {
  companyId: string;
  position?: Position;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function PositionFormDialog({ companyId, position, onSuccess, trigger }: PositionFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState<PositionLevel | 'none'>('none');
  const [baseSalary, setBaseSalary] = useState('');

  const { createPosition, updatePosition } = usePositions(companyId);

  useEffect(() => {
    if (position) {
      setTitle(position.title);
      setDescription(position.description || '');
      setLevel(position.level || 'none');
      setBaseSalary(position.baseSalary?.toString() || '');
    }
  }, [position]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Veuillez renseigner le titre du poste');
      return;
    }

    try {
      const dto = {
        title: title.trim(),
        description: description.trim() || undefined,
        level: level === 'none' ? undefined : level,
        baseSalary: baseSalary ? parseFloat(baseSalary) : undefined,
      };

      if (position) {
        await updatePosition(position.id, dto);
        toast.success('Poste mis à jour');
      } else {
        await createPosition(dto);
        toast.success('Poste créé');
      }

      setOpen(false);
      resetForm();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setLevel('none');
    setBaseSalary('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (position ? (
          <Button variant="ghost" size="sm">
            Modifier
          </Button>
        ) : (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau poste
          </Button>
        ))}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{position ? 'Modifier le poste' : 'Créer un poste'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Titre du poste <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Directeur, Manager, Développeur..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">Niveau hiérarchique</Label>
            <Select value={level} onValueChange={(v) => setLevel(v as PositionLevel | 'none')}>
              <SelectTrigger id="level">
                <SelectValue placeholder="Sélectionner un niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucun</SelectItem>
                <SelectItem value="EXECUTIVE">Direction (Executive)</SelectItem>
                <SelectItem value="MANAGER">Management</SelectItem>
                <SelectItem value="STAFF">Personnel</SelectItem>
                <SelectItem value="INTERN">Stagiaire</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnel)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Responsabilités, compétences requises..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="baseSalary">Salaire de base (optionnel)</Label>
            <Input
              id="baseSalary"
              type="number"
              value={baseSalary}
              onChange={(e) => setBaseSalary(e.target.value)}
              placeholder="Ex: 500000"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">{position ? 'Mettre à jour' : 'Créer'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
