'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAccounting } from '@/hooks/useAccounting';
import type { Invoice, CreatePaymentDto, PaymentMethod } from '@/types/accounting';

const METHOD_LABELS: Record<PaymentMethod, string> = {
  CASH: 'Espèces',
  BANK_TRANSFER: 'Virement bancaire',
  CHECK: 'Chèque',
  MOBILE_MONEY: 'Mobile Money',
  CARD: 'Carte bancaire',
};

interface Props {
  companyId: string;
  invoice: Invoice;
  open: boolean;
  onClose: () => void;
  currency: string;
}

export function PaymentFormDialog({ companyId, invoice, open, onClose, currency }: Props) {
  const { addPayment, loading } = useAccounting(companyId);

  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('BANK_TRANSFER');
  const [reference, setReference] = useState('');
  const [paidAt, setPaidAt] = useState('');
  const [notes, setNotes] = useState('');

  const fmt = (n: number) => n.toLocaleString('fr-FR') + ' ' + currency;

  useEffect(() => {
    if (open) {
      // Pré-remplir avec le montant restant dû
      setAmount(invoice.amountDue > 0 ? String(invoice.amountDue) : '');
      setMethod('BANK_TRANSFER');
      setReference('');
      setPaidAt(new Date().toISOString().split('T')[0]);
      setNotes('');
    }
  }, [open, invoice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      toast.error('Le montant doit être supérieur à 0');
      return;
    }
    if (parsedAmount > invoice.amountDue) {
      toast.error(`Le montant ne peut pas dépasser le restant dû (${fmt(invoice.amountDue)})`);
      return;
    }

    const dto: CreatePaymentDto = {
      amount: parsedAmount,
      method,
      reference: reference || undefined,
      paidAt: paidAt || undefined,
      notes: notes || undefined,
    };

    try {
      await addPayment(invoice.id, dto);
      toast.success('Paiement enregistré');
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Erreur');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Enregistrer un paiement</DialogTitle>
        </DialogHeader>

        {/* Résumé facture */}
        <div className="bg-slate-50 rounded-lg p-3 text-sm space-y-1">
          <div className="flex justify-between text-slate-600">
            <span>Facture</span>
            <span className="font-mono font-medium text-slate-900">{invoice.invoiceNumber}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Total</span>
            <span>{fmt(invoice.total)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Déjà payé</span>
            <span className="text-green-600">{fmt(invoice.amountPaid)}</span>
          </div>
          <div className="flex justify-between font-semibold text-slate-900 border-t pt-1">
            <span>Restant dû</span>
            <span className="text-red-600">{fmt(invoice.amountDue)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>
              Montant <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                type="number"
                min={0.01}
                step="0.01"
                max={invoice.amountDue}
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0"
                required
                className="pr-16"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                {currency}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Mode de paiement</Label>
            <Select value={method} onValueChange={v => setMethod(v as PaymentMethod)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(METHOD_LABELS) as PaymentMethod[]).map(m => (
                  <SelectItem key={m} value={m}>
                    {METHOD_LABELS[m]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date du paiement</Label>
              <Input type="date" value={paidAt} onChange={e => setPaidAt(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Référence</Label>
              <Input
                value={reference}
                onChange={e => setReference(e.target.value)}
                placeholder="N° chèque, virement..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              placeholder="Notes sur ce paiement..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : 'Enregistrer le paiement'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
