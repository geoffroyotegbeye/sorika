'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAccounting } from '@/hooks/useAccounting';
import type { Bill, CreateBillDto, AccountingLineItem } from '@/types/accounting';

interface Props {
  companyId: string;
  bill?: Bill | null;
  open: boolean;
  onClose: () => void;
  currency: string;
  prefill?: {
    supplierName?: string;
    notes?: string;
    items?: Array<{ description: string; quantity: number; unitPrice: number }>;
  };
}

interface LineItem extends AccountingLineItem {
  _id: string;
}

const emptyLine = (): LineItem => ({
  _id: Math.random().toString(36).slice(2),
  description: '',
  quantity: 1,
  unitPrice: 0,
  taxRateId: undefined,
});

export function BillFormDialog({ companyId, bill, open, onClose, currency, prefill }: Props) {
  const { createBill, updateBill, fetchTaxRates, fetchSuppliers, taxRates, suppliers, loading } = useAccounting(companyId);

  const [issueDate, setIssueDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [notes, setNotes] = useState('');
  const [lines, setLines] = useState<LineItem[]>([emptyLine()]);

  useEffect(() => {
    if (open) {
      fetchTaxRates();
      fetchSuppliers();
    }
  }, [open, fetchTaxRates, fetchSuppliers]);

  useEffect(() => {
    if (bill) {
      setIssueDate(bill.issueDate ? bill.issueDate.split('T')[0] : '');
      setDueDate(bill.dueDate ? bill.dueDate.split('T')[0] : '');
      setSupplierId(bill.supplierId ?? '');
      setSupplierName(bill.supplierName ?? '');
      setNotes(bill.notes ?? '');
      setLines(
        bill.items.map(item => ({
          _id: item.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          taxRateId: item.taxRateId,
        }))
      );
    } else if (prefill) {
      // Pré-remplissage depuis une note de frais RH
      setIssueDate(new Date().toISOString().split('T')[0]);
      setDueDate('');
      setSupplierId('');
      setSupplierName(prefill.supplierName ?? '');
      setNotes(prefill.notes ?? '');
      setLines(
        prefill.items && prefill.items.length > 0
          ? prefill.items.map(i => ({ _id: Math.random().toString(36).slice(2), description: i.description, quantity: i.quantity, unitPrice: i.unitPrice }))
          : [emptyLine()]
      );
    } else {
      setIssueDate('');
      setDueDate('');
      setSupplierId('');
      setSupplierName('');
      setNotes('');
      setLines([emptyLine()]);
    }
  }, [bill, open]);

  const updateLine = (id: string, field: keyof LineItem, value: any) => {
    setLines(prev => prev.map(l => (l._id === id ? { ...l, [field]: value } : l)));
  };

  const removeLine = (id: string) => {
    if (lines.length === 1) return;
    setLines(prev => prev.filter(l => l._id !== id));
  };

  const getLineTax = (line: LineItem): number => {
    if (!line.taxRateId) return 0;
    const tr = taxRates.find(t => t.id === line.taxRateId);
    if (!tr) return 0;
    return line.quantity * line.unitPrice * (tr.rate / 100);
  };

  const getLineTotal = (line: LineItem) => line.quantity * line.unitPrice + getLineTax(line);
  const subtotal = lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0);
  const taxTotal = lines.reduce((s, l) => s + getLineTax(l), 0);
  const total = subtotal + taxTotal;

  const supplierOptions: ComboboxOption[] = suppliers.map(s => ({ value: s.id, label: s.name }));

  const handleSupplierSelect = (id: string) => {
    setSupplierId(id);
    const s = suppliers.find(s => s.id === id);
    if (s) setSupplierName(s.name);
  };

  const fmt = (n: number) => n.toLocaleString('fr-FR') + ' ' + currency;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lines.some(l => !l.description.trim())) {
      toast.error('Chaque ligne doit avoir une description');
      return;
    }

    const dto: CreateBillDto = {
      issueDate: issueDate || undefined,
      dueDate: dueDate || undefined,
      supplierId: supplierId || undefined,
      supplierName: supplierName || undefined,
      notes: notes || undefined,
      items: lines.map(({ _id, ...rest }) => rest),
    };

    try {
      if (bill) {
        await updateBill(bill.id, dto as any);
        toast.success('Charge mise à jour');
      } else {
        await createBill(dto);
        toast.success('Charge créée');
      }
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Erreur');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{bill ? 'Modifier la charge' : prefill ? 'Nouvelle charge (depuis note de frais RH)' : 'Nouvelle charge'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Fournisseur */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fournisseur (liste)</Label>
              <Combobox
                options={supplierOptions}
                value={supplierId}
                onValueChange={handleSupplierSelect}
                placeholder="Sélectionner un fournisseur..."
                searchPlaceholder="Rechercher..."
                emptyText="Aucun fournisseur trouvé"
              />
            </div>
            <div className="space-y-2">
              <Label>Nom libre (si hors liste)</Label>
              <Input
                value={supplierName}
                onChange={e => setSupplierName(e.target.value)}
                placeholder="Nom du fournisseur"
              />
            </div>
            <div className="space-y-2">
              <Label>Date de la charge</Label>
              <Input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Date d'échéance</Label>
              <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
          </div>

          {/* Lignes */}
          <div className="space-y-2">
            <Label>Lignes</Label>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-slate-600 w-[40%]">Description</th>
                    <th className="px-3 py-2 text-left font-medium text-slate-600 w-[10%]">Qté</th>
                    <th className="px-3 py-2 text-left font-medium text-slate-600 w-[18%]">Prix unit.</th>
                    <th className="px-3 py-2 text-left font-medium text-slate-600 w-[18%]">TVA</th>
                    <th className="px-3 py-2 text-right font-medium text-slate-600 w-[10%]">Total</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lines.map(line => (
                    <tr key={line._id}>
                      <td className="px-2 py-1.5">
                        <Input
                          value={line.description}
                          onChange={e => updateLine(line._id, 'description', e.target.value)}
                          placeholder="Description..."
                          className="h-8 text-sm"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          value={line.quantity}
                          onChange={e => updateLine(line._id, 'quantity', parseFloat(e.target.value) || 0)}
                          className="h-8 text-sm"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          value={line.unitPrice}
                          onChange={e => updateLine(line._id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="h-8 text-sm"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <Select
                          value={line.taxRateId ?? 'none'}
                          onValueChange={v => updateLine(line._id, 'taxRateId', v === 'none' ? undefined : v)}
                        >
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue placeholder="Aucune" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Aucune</SelectItem>
                            {taxRates.map(tr => (
                              <SelectItem key={tr.id} value={tr.id}>
                                {tr.name} ({tr.rate}%)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-2 py-1.5 text-right font-medium text-slate-700">
                        {fmt(getLineTotal(line))}
                      </td>
                      <td className="px-1 py-1.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLine(line._id)}
                          disabled={lines.length === 1}
                          className="h-8 w-8 p-0 text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setLines(prev => [...prev, emptyLine()])}
              className="mt-1"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Ajouter une ligne
            </Button>
          </div>

          {/* Totaux */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Sous-total HT</span>
                <span>{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>TVA</span>
                <span>{fmt(taxTotal)}</span>
              </div>
              <div className="flex justify-between font-semibold text-slate-900 border-t pt-1">
                <span>Total TTC</span>
                <span>{fmt(total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              placeholder="Notes internes..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : bill ? 'Mettre à jour' : 'Créer la charge'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
