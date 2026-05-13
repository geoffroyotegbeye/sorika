'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { AdvanceRule, CreateAdvanceRuleDto } from '@/types/hr';

interface AdvanceRuleFormDialogProps {
  companyId: string;
  rule: AdvanceRule | null;
  open: boolean;
  onClose: () => void;
}

export function AdvanceRuleFormDialog({ companyId, rule, open, onClose }: AdvanceRuleFormDialogProps) {
  const [formData, setFormData] = useState<CreateAdvanceRuleDto>({
    name: '',
    description: '',
    maxPercentage: 50,
    minDaysWorked: 15,
    allowedDaysOfMonth: Array.from({ length: 31 }, (_, i) => i + 1),
    requireManagerApproval: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (rule) {
      setFormData({
        name: rule.name,
        description: rule.description || '',
        maxPercentage: rule.maxPercentage,
        minDaysWorked: rule.minDaysWorked,
        allowedDaysOfMonth: rule.allowedDaysOfMonth,
        requireManagerApproval: rule.requireManagerApproval,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        maxPercentage: 50,
        minDaysWorked: 15,
        allowedDaysOfMonth: Array.from({ length: 31 }, (_, i) => i + 1),
        requireManagerApproval: true,
      });
    }
  }, [rule]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement API call
    setLoading(false);
    onClose();
  };

  const toggleDay = (day: number) => {
    setFormData({
      ...formData,
      allowedDaysOfMonth: formData.allowedDaysOfMonth.includes(day)
        ? formData.allowedDaysOfMonth.filter(d => d !== day)
        : [...formData.allowedDaysOfMonth, day],
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{rule ? 'Modifier la règle' : 'Nouvelle règle d\'acompte'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom de la règle</Label>
            <div className="mt-2">
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <div className="mt-2">
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="maxPercentage">Pourcentage maximum du salaire mensuel (%)</Label>
            <div className="mt-2">
              <Input
                id="maxPercentage"
                type="number"
                value={formData.maxPercentage}
                onChange={(e) => setFormData({ ...formData, maxPercentage: Number(e.target.value) })}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="minDaysWorked">Nombre minimum de jours travaillés requis</Label>
            <div className="mt-2">
              <Input
                id="minDaysWorked"
                type="number"
                value={formData.minDaysWorked}
                onChange={(e) => setFormData({ ...formData, minDaysWorked: Number(e.target.value) })}
                required
              />
            </div>
          </div>
          <div>
            <Label>Jours du mois où les acomptes sont autorisés</Label>
            <div className="grid grid-cols-7 gap-2 mt-2">
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${day}`}
                    checked={formData.allowedDaysOfMonth.includes(day)}
                    onCheckedChange={() => toggleDay(day)}
                  />
                  <Label htmlFor={`day-${day}`} className="text-sm">{day}</Label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="requireManagerApproval"
              checked={formData.requireManagerApproval}
              onCheckedChange={(checked) => setFormData({ ...formData, requireManagerApproval: checked as boolean })}
            />
            <Label htmlFor="requireManagerApproval">Requiert l'approbation du manager</Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : rule ? 'Modifier' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
