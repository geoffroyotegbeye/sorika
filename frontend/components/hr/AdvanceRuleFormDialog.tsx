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
    name: 'Règle d\'acompte',
    description: '',
    maxPercentage: 50,
    minDaysWorked: 15,
    allowedDaysOfMonth: Array.from({ length: 31 }, (_, i) => i + 1),
    requireManagerApproval: true,
  });
  const [isHalfSalary, setIsHalfSalary] = useState(false);
  const [baseSalaryDisplay, setBaseSalaryDisplay] = useState('');
  const [maxPercentageDisplay, setMaxPercentageDisplay] = useState('');
  const [companyUuid, setCompanyUuid] = useState<string>('');
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
      setIsHalfSalary(rule.maxPercentage === 50);
      setBaseSalaryDisplay(rule.baseSalary?.toString() || '');
      setMaxPercentageDisplay(rule.maxPercentage.toString());
    } else {
      setFormData({
        name: 'Règle d\'acompte',
        description: '',
        maxPercentage: 0,
        minDaysWorked: 15,
        allowedDaysOfMonth: Array.from({ length: 31 }, (_, i) => i + 1),
        requireManagerApproval: true,
      });
      setIsHalfSalary(false);
      setBaseSalaryDisplay('');
      setMaxPercentageDisplay('');
    }
  }, [rule]);

  // Récupérer l'UUID de l'entreprise à partir du slug
  useEffect(() => {
    const fetchCompanyUuid = async () => {
      if (!companyId) return;
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (!userData) return;
        const parsed = JSON.parse(userData);

        const response = await fetch(`http://localhost:3001/companies/slug/${companyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-user-id': parsed.user.id,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.id) {
            setCompanyUuid(data.id);
          }
        }
      } catch (err) {
        console.error('Erreur lors de la récupération de l\'UUID de l\'entreprise', err);
      }
    };

    fetchCompanyUuid();
  }, [companyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const submitData = {
        ...formData,
        baseSalary: Number(baseSalaryDisplay) || null,
        maxPercentage: isHalfSalary ? 50 : (Number(maxPercentageDisplay) || 0),
      };

      const url = rule 
        ? `http://localhost:3001/companies/${companyUuid}/hr/advance-rules/${rule.id}`
        : `http://localhost:3001/companies/${companyUuid}/hr/advance-rules`;
      
      const method = rule ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        onClose();
        window.location.reload();
      } else {
        console.error('Erreur lors de la création/modification de la règle');
      }
    } catch (err) {
      console.error('Erreur lors de la création/modification de la règle', err);
    } finally {
      setLoading(false);
    }
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
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isHalfSalary"
              checked={isHalfSalary}
              onCheckedChange={(checked) => {
                setIsHalfSalary(checked as boolean);
                if (checked) {
                  setMaxPercentageDisplay('50');
                  setFormData({ ...formData, maxPercentage: 50 });
                } else {
                  setFormData({ ...formData, maxPercentage: Number(maxPercentageDisplay) || 0 });
                }
              }}
            />
            <Label htmlFor="isHalfSalary" className="font-medium">Demi solde</Label>
          </div>
          <div>
            <Label htmlFor="baseSalary">Montant du salaire de base (FCFA)</Label>
            <div className="mt-2">
              <Input
                id="baseSalary"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={baseSalaryDisplay}
                onInput={(e) => {
                  const value = e.currentTarget.value.replace(/[^0-9]/g, '');
                  setBaseSalaryDisplay(value);
                }}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="maxPercentage">Pourcentage maximum du salaire de base (%)</Label>
            <div className="mt-2">
              <Input
                id="maxPercentage"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={maxPercentageDisplay}
                onInput={(e) => {
                  const value = e.currentTarget.value.replace(/[^0-9]/g, '');
                  setMaxPercentageDisplay(value);
                  setFormData({ ...formData, maxPercentage: Number(value) || 0 });
                  setIsHalfSalary(Number(value) === 50);
                }}
                disabled={isHalfSalary}
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
              {loading ? 'Enregistrement...' : rule ? 'Modifier' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
