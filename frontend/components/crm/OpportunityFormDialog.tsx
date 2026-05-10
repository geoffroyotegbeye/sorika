'use client';

import { useEffect, useState } from 'react';
import { Opportunity, OpportunityStage } from '@/types/crm';
import { useCRMOpportunities } from '@/hooks/useCRMOpportunities';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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

interface OpportunityFormDialogProps {
  companyId: string;
  opportunity?: Opportunity | null;
  open: boolean;
  onClose: () => void;
}

export function OpportunityFormDialog({
  companyId,
  opportunity,
  open,
  onClose,
}: OpportunityFormDialogProps) {
  const { createOpportunity, updateOpportunity, loading } = useCRMOpportunities(companyId);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    probability: '50',
    stage: 'LEAD' as OpportunityStage,
    expectedCloseDate: '',
    notes: '',
  });

  useEffect(() => {
    if (opportunity) {
      setFormData({
        title: opportunity.title,
        amount: opportunity.amount.toString(),
        probability: opportunity.probability.toString(),
        stage: opportunity.stage,
        expectedCloseDate: opportunity.expectedCloseDate
          ? opportunity.expectedCloseDate.split('T')[0]
          : '',
        notes: opportunity.notes || '',
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        probability: '50',
        stage: 'LEAD',
        expectedCloseDate: '',
        notes: '',
      });
    }
  }, [opportunity, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: any = {
      title: formData.title,
      amount: parseFloat(formData.amount),
      probability: parseInt(formData.probability),
      stage: formData.stage,
      expectedCloseDate: formData.expectedCloseDate || undefined,
      notes: formData.notes || undefined,
    };

    console.log('Submitting opportunity:', data);

    let result;
    if (opportunity) {
      result = await updateOpportunity(opportunity.id, data);
    } else {
      result = await createOpportunity(data);
    }

    console.log('Opportunity result:', result);

    if (result) {
      onClose();
    } else {
      console.error('Failed to save opportunity');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {opportunity ? 'Modifier l\'opportunité' : 'Nouvelle opportunité'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Montant (XOF) *</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="probability">Probabilité (%) *</Label>
              <Input
                id="probability"
                type="number"
                min="0"
                max="100"
                value={formData.probability}
                onChange={(e) =>
                  setFormData({ ...formData, probability: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stage">Étape *</Label>
              <Select
                value={formData.stage}
                onValueChange={(value) =>
                  setFormData({ ...formData, stage: value as OpportunityStage })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LEAD">Lead</SelectItem>
                  <SelectItem value="QUALIFIED">Qualifié</SelectItem>
                  <SelectItem value="PROPOSAL">Proposition</SelectItem>
                  <SelectItem value="NEGOTIATION">Négociation</SelectItem>
                  <SelectItem value="WON">Gagné</SelectItem>
                  <SelectItem value="LOST">Perdu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedCloseDate">Date de closing prévue</Label>
              <Input
                id="expectedCloseDate"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={formData.expectedCloseDate}
                onChange={(e) =>
                  setFormData({ ...formData, expectedCloseDate: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
