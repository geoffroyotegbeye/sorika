'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PayrollPeriod, CreatePayrollPeriodDto } from '@/types/hr';

interface PayrollPeriodFormDialogProps {
  companyId: string;
  period: PayrollPeriod | null;
  open: boolean;
  onClose: () => void;
}

export function PayrollPeriodFormDialog({ companyId, period, open, onClose }: PayrollPeriodFormDialogProps) {
  const [formData, setFormData] = useState<CreatePayrollPeriodDto>({
    name: '',
    startDate: '',
    endDate: '',
    paymentDate: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (period) {
      setFormData({
        name: period.name,
        startDate: period.startDate,
        endDate: period.endDate,
        paymentDate: period.paymentDate,
      });
    } else {
      setFormData({
        name: '',
        startDate: '',
        endDate: '',
        paymentDate: '',
      });
    }
  }, [period]);

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
          <DialogTitle>{period ? 'Modifier la période' : 'Nouvelle période de paie'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom de la période</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Janvier 2025"
              required
            />
          </div>
          <div>
            <Label htmlFor="startDate">Date de début</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="endDate">Date de fin</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="paymentDate">Date de paiement</Label>
            <Input
              id="paymentDate"
              type="date"
              value={formData.paymentDate}
              onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : period ? 'Modifier' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
