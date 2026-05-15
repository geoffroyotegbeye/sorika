'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Combobox } from '@/components/ui/combobox';
import { Advance, CreateAdvanceDto, AdvanceStatus, AdvanceRule } from '@/types/hr';

interface AdvanceFormDialogProps {
  companyId: string;
  advance: Advance | null;
  advanceRule: AdvanceRule | null;
  open: boolean;
  onClose: () => void;
}

export function AdvanceFormDialog({ companyId, advance, advanceRule, open, onClose }: AdvanceFormDialogProps) {
  const [formData, setFormData] = useState<CreateAdvanceDto>({
    employeeId: '',
    amount: 0,
    reason: '',
  });
  const [amountDisplay, setAmountDisplay] = useState('');
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [companyUuid, setCompanyUuid] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<number | null>(null);

  useEffect(() => {
    if (advance) {
      setFormData({
        employeeId: advance.employeeId,
        amount: advance.amount,
        reason: advance.reason,
      });
      setAmountDisplay(advance.amount.toString());
    } else {
      setFormData({
        employeeId: '',
        amount: 0,
        reason: '',
      });
      setAmountDisplay('');
    }
  }, [advance]);

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

  // Récupérer la liste des employés
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!companyUuid) return;
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (!userData) return;
        const parsed = JSON.parse(userData);

        const response = await fetch(`http://localhost:3001/companies/${companyUuid}/hr/employees`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-user-id': parsed.user.id,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setEmployees(data || []);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des employés', err);
      }
    };

    fetchEmployees();
  }, [companyUuid]);

  // Calculer le montant maximum autorisé selon la règle
  useEffect(() => {
    if (advanceRule && advanceRule.baseSalary && advanceRule.maxPercentage) {
      const max = (advanceRule.baseSalary * advanceRule.maxPercentage) / 100;
      setMaxAmount(max);
    } else {
      setMaxAmount(null);
    }
  }, [advanceRule]);

  const employeeOptions = employees.map(emp => ({
    value: emp.id,
    label: `${emp.firstName} ${emp.lastName}`,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier si une règle existe
    if (!advanceRule) {
      alert('Veuillez d\'abord définir une règle d\'acompte');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const submitData = {
        ...formData,
        amount: Number(amountDisplay) || 0,
      };

      const url = advance 
        ? `http://localhost:3001/companies/${companyUuid}/hr/advances/${advance.id}`
        : `http://localhost:3001/companies/${companyUuid}/hr/advances`;
      
      const method = advance ? 'PATCH' : 'POST';

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
        console.error('Erreur lors de la création/modification de l\'acompte');
      }
    } catch (err) {
      console.error('Erreur lors de la création/modification de l\'acompte', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{advance ? 'Modifier l\'acompte' : 'Nouvel acompte'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="employee">Employé</Label>
            <div className="mt-2">
              <Combobox
                options={employeeOptions}
                value={formData.employeeId}
                onValueChange={(value) => setFormData({ ...formData, employeeId: value })}
                placeholder="Sélectionner un employé"
                searchPlaceholder="Rechercher un employé..."
                emptyText="Aucun employé trouvé"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="amount">Montant (FCFA)</Label>
            <div className="mt-2">
              <Input
                id="amount"
                type="number"
                value={amountDisplay}
                onChange={(e) => setAmountDisplay(e.target.value)}
                required
                max={maxAmount || undefined}
              />
              {maxAmount !== null && (
                <p className="text-sm text-gray-500 mt-1">
                  Montant maximum autorisé: {maxAmount} FCFA
                </p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="reason">Raison</Label>
            <div className="mt-2">
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : advance ? 'Modifier' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
