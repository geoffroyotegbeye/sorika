'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Advance, CreateAdvanceDto, AdvanceStatus } from '@/types/hr';

interface AdvanceFormDialogProps {
  companyId: string;
  advance: Advance | null;
  open: boolean;
  onClose: () => void;
}

export function AdvanceFormDialog({ companyId, advance, open, onClose }: AdvanceFormDialogProps) {
  const [formData, setFormData] = useState<CreateAdvanceDto>({
    employeeId: '',
    amount: 0,
    reason: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (advance) {
      setFormData({
        employeeId: advance.employeeId,
        amount: advance.amount,
        reason: advance.reason,
      });
    } else {
      setFormData({
        employeeId: '',
        amount: 0,
        reason: '',
      });
    }
  }, [advance]);

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
          <DialogTitle>{advance ? 'Modifier l\'acompte' : 'Nouvel acompte'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="employee">Employé</Label>
            <div className="mt-2">
              <Select
                value={formData.employeeId}
                onValueChange={(value) => setFormData({ ...formData, employeeId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un employé" />
                </SelectTrigger>
                <SelectContent>
                  {/* TODO: Load employees */}
                  <SelectItem value="1">Employé 1</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="amount">Montant (FCFA)</Label>
            <div className="mt-2">
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="reason">Raison</Label>
            <div className="mt-2">
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                required
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
