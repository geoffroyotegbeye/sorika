'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PayrollVariable, CreatePayrollVariableDto } from '@/types/hr';

interface PayrollVariableFormDialogProps {
  companyId: string;
  variable: PayrollVariable | null;
  open: boolean;
  onClose: () => void;
}

export function PayrollVariableFormDialog({ companyId, variable, open, onClose }: PayrollVariableFormDialogProps) {
  const [formData, setFormData] = useState<CreatePayrollVariableDto>({
    name: '',
    code: '',
    type: 'FIXED',
    value: 0,
    formula: '',
    description: '',
    appliesTo: 'ALL',
    positionId: '',
    departmentId: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (variable) {
      setFormData({
        name: variable.name,
        code: variable.code,
        type: variable.type,
        value: variable.value || 0,
        formula: variable.formula || '',
        description: variable.description || '',
        appliesTo: 'ALL',
        positionId: '',
        departmentId: '',
      });
    } else {
      setFormData({
        name: '',
        code: '',
        type: 'FIXED',
        value: 0,
        formula: '',
        description: '',
        appliesTo: 'ALL',
        positionId: '',
        departmentId: '',
      });
    }
  }, [variable]);

  const generateCodeFromName = (name: string): string => {
    return name
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^A-Z0-9\s]/g, '') // Keep only letters, numbers and spaces
      .trim()
      .replace(/\s+/g, '_'); // Replace spaces with underscores
  };

  const handleNameChange = (name: string) => {
    setFormData({ ...formData, name, code: generateCodeFromName(name) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement API call
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{variable ? 'Modifier la variable' : 'Nouvelle variable de calcul'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom de la variable</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Ex: Prime de performance"
              required
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="code">Code unique</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="Ex: PRIME_DE_PERFORMANCE"
              required
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">Généré automatiquement à partir du nom (modifiable)</p>
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: 'FIXED' | 'PERCENTAGE') => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FIXED">Fixe</SelectItem>
                <SelectItem value="PERCENTAGE">Pourcentage</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {formData.type === 'FIXED' && (
            <div>
              <Label htmlFor="value">Valeur (FCFA)</Label>
              <Input
                id="value"
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                required
                className="mt-2"
              />
            </div>
          )}
          {formData.type === 'PERCENTAGE' && (
            <div>
              <Label htmlFor="value">Pourcentage (%)</Label>
              <Input
                id="value"
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                required
                className="mt-2"
              />
            </div>
          )}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : variable ? 'Modifier' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
