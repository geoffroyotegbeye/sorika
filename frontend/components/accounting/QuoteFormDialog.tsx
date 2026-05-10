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
import { useCRMCompanies } from '@/hooks/useCRMCompanies';
import type { Quote, CreateQuoteDto, AccountingLineItem } from '@/types/accounting';

interface Props {
  companyId: string;
  quote?: Quote | null;
  open: boolean;
  onClose: () => void;
  currency: string;
  prefill?: {
    clientId?: string;
    clientName?: string;
    clientEmail?: string;
    notes?: string;
    items?: Array<{ description: string; quantity: number; unitPrice: number }>;
  };
}

interface LineItem extends AccountingLineItem { _id: string; }
const emptyLine = (): LineItem => ({ _id: Math.random().toString(36).slice(2), description: '', quantity: 1, unitPrice: 0 });

export function QuoteFormDialog({ companyId, quote, open, onClose, currency, prefill }: Props) {
  const { createQuote, updateQuote, fetchTaxRates, taxRates, loading } = useAccounting(companyId);
  const { companies, fetchCompanies } = useCRMCompanies(companyId);

  const [expiryDate, setExpiryDate] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [lines, setLines] = useState<LineItem[]>([emptyLine()]);

  useEffect(() => {
    if (open) { fetchTaxRates(); fetchCompanies(); }
  }, [open, fetchTaxRates, fetchCompanies]);

  useEffect(() => {
    if (quote) {
      setExpiryDate(quote.expiryDate ? quote.expiryDate.split('T')[0] : '');
      setClientId(quote.clientId ?? '');
      setClientName(quote.clientName ?? '');
      setClientEmail(quote.clientEmail ?? '');
      setClientAddress(quote.clientAddress ?? '');
      setNotes(quote.notes ?? '');
      setLines(quote.items.map(i => ({ _id: i.id, description: i.description, quantity: i.quantity, unitPrice: i.unitPrice, taxRateId: i.taxRateId })));
    } else if (prefill) {
      // Pré-remplissage depuis une opportunité CRM
      setExpiryDate('');
      setClientId(prefill.clientId ?? '');
      setClientName(prefill.clientName ?? '');
      setClientEmail(prefill.clientEmail ?? '');
      setClientAddress('');
      setNotes(prefill.notes ?? '');
      setLines(
        prefill.items && prefill.items.length > 0
          ? prefill.items.map(i => ({ _id: Math.random().toString(36).slice(2), description: i.description, quantity: i.quantity, unitPrice: i.unitPrice }))
          : [emptyLine()]
      );
    } else {
      setExpiryDate(''); setClientId(''); setClientName(''); setClientEmail(''); setClientAddress(''); setNotes('');
      setLines([emptyLine()]);
    }
  }, [quote, open]);

  const updateLine = (id: string, field: keyof LineItem, value: any) =>
    setLines(prev => prev.map(l => l._id === id ? { ...l, [field]: value } : l));

  const getLineTax = (line: LineItem) => {
    if (!line.taxRateId) return 0;
    const tr = taxRates.find(t => t.id === line.taxRateId);
    return tr ? line.quantity * line.unitPrice * (tr.rate / 100) : 0;
  };

  const subtotal = lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0);
  const taxTotal = lines.reduce((s, l) => s + getLineTax(l), 0);
  const total = subtotal + taxTotal;

  const clientOptions: ComboboxOption[] = companies.map(c => ({ value: c.id, label: c.name }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lines.some(l => !l.description.trim())) { toast.error('Chaque ligne doit avoir une description'); return; }

    const dto: CreateQuoteDto = {
      expiryDate: expiryDate || undefined,
      clientId: clientId || undefined,
      clientName: clientName || undefined,
      clientEmail: clientEmail || undefined,
      clientAddress: clientAddress || undefined,
      notes: notes || undefined,
      items: lines.map(({ _id, ...rest }) => rest),
    };

    try {
      if (quote) { await updateQuote(quote.id, dto); toast.success('Devis mis à jour'); }
      else { await createQuote(dto); toast.success('Devis créé'); }
      onClose();
    } catch (err: any) { toast.error(err.message || 'Erreur'); }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{quote ? 'Modifier le devis' : prefill ? 'Nouveau devis (depuis opportunité CRM)' : 'Nouveau devis'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Client (CRM)</Label>
              <Combobox options={clientOptions} value={clientId} onValueChange={id => { setClientId(id); const c = companies.find(c => c.id === id); if (c) setClientName(c.name); }} placeholder="Sélectionner..." searchPlaceholder="Rechercher..." emptyText="Aucun client" />
            </div>
            <div className="space-y-2">
              <Label>Nom libre</Label>
              <Input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Nom du client" />
            </div>
            <div className="space-y-2">
              <Label>Email client</Label>
              <Input type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="email@client.com" />
            </div>
            <div className="space-y-2">
              <Label>Date d'expiration</Label>
              <Input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Adresse client</Label>
            <Textarea value={clientAddress} onChange={e => setClientAddress(e.target.value)} rows={2} placeholder="Adresse..." />
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
                      <td className="px-2 py-1.5"><Input value={line.description} onChange={e => updateLine(line._id, 'description', e.target.value)} placeholder="Description..." className="h-8 text-sm" /></td>
                      <td className="px-2 py-1.5"><Input type="number" min="0" step="0.01" value={line.quantity} onChange={e => updateLine(line._id, 'quantity', parseFloat(e.target.value) || 0)} className="h-8 text-sm" /></td>
                      <td className="px-2 py-1.5"><Input type="number" min="0" step="0.01" value={line.unitPrice} onChange={e => updateLine(line._id, 'unitPrice', parseFloat(e.target.value) || 0)} className="h-8 text-sm" /></td>
                      <td className="px-2 py-1.5">
                        <Select value={line.taxRateId ?? 'none'} onValueChange={v => updateLine(line._id, 'taxRateId', v === 'none' ? undefined : v)}>
                          <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Aucune" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Aucune</SelectItem>
                            {taxRates.map(t => <SelectItem key={t.id} value={t.id}>{t.name} ({t.rate}%)</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-2 py-1.5 text-right font-medium">{(line.quantity * line.unitPrice + getLineTax(line)).toLocaleString('fr-FR')}</td>
                      <td className="px-1 py-1.5"><Button type="button" variant="ghost" size="sm" onClick={() => lines.length > 1 && setLines(prev => prev.filter(l => l._id !== line._id))} className="h-8 w-8 p-0 text-slate-400 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => setLines(prev => [...prev, emptyLine()])}>
              <Plus className="h-4 w-4 mr-1" /> Ajouter une ligne
            </Button>
          </div>

          <div className="flex justify-end">
            <div className="w-64 space-y-1 text-sm">
              <div className="flex justify-between text-slate-600"><span>Sous-total</span><span>{subtotal.toLocaleString('fr-FR')} {currency}</span></div>
              <div className="flex justify-between text-slate-600"><span>TVA</span><span>{taxTotal.toLocaleString('fr-FR')} {currency}</span></div>
              <div className="flex justify-between font-semibold text-slate-900 border-t pt-1"><span>Total</span><span>{total.toLocaleString('fr-FR')} {currency}</span></div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Conditions, mentions..." />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Enregistrement...' : 'Enregistrer'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
