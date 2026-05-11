'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import { Plus, Trash2, ChevronRight, ChevronLeft, FileText } from 'lucide-react';
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

  const [step, setStep] = useState(1);
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
    setStep(1);
  }, [quote, open]);

  const updateLine = (id: string, field: keyof LineItem, value: any) =>
    setLines(prev => prev.map(l => l._id === id ? { ...l, [field]: value } : l));

  const removeLine = (id: string) => {
    if (lines.length === 1) return;
    setLines(prev => prev.filter(l => l._id !== id));
  };

  const getLineTax = (line: LineItem) => {
    if (!line.taxRateId) return 0;
    const tr = taxRates.find(t => t.id === line.taxRateId);
    return tr ? line.quantity * line.unitPrice * (tr.rate / 100) : 0;
  };

  const getLineTotal = (line: LineItem) => line.quantity * line.unitPrice + getLineTax(line);
  const subtotal = lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0);
  const taxTotal = lines.reduce((s, l) => s + getLineTax(l), 0);
  const total = subtotal + taxTotal;

  const clientOptions: ComboboxOption[] = companies.map(c => ({ value: c.id, label: c.name }));

  const handleClientSelect = (id: string) => {
    setClientId(id);
    const c = companies.find(c => c.id === id);
    if (c) setClientName(c.name);
  };

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  const handleSubmit = async () => {
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
      handleClose();
    } catch (err: any) { toast.error(err.message || 'Erreur'); }
  };

  const canGoToStep2 = clientName.trim() !== '';
  const canSubmit = canGoToStep2 && lines.some(l => l.description.trim() !== '');

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="!max-w-5xl max-h-[85vh] overflow-y-auto w-full">
        <DialogHeader>
          <DialogTitle>{quote ? 'Modifier le devis' : prefill ? 'Nouveau devis (depuis opportunité CRM)' : 'Nouveau devis'}</DialogTitle>
        </DialogHeader>

        {/* Indicateur d'étapes */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 1 ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`}>
            1
          </div>
          <div className={`h-1 w-12 ${step === 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
            2
          </div>
        </div>

        {/* Étape 1 : Informations client */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Client (depuis CRM)</Label>
                <Combobox 
                  options={clientOptions} 
                  value={clientId} 
                  onValueChange={handleClientSelect} 
                  placeholder="Sélectionner un client..." 
                  searchPlaceholder="Rechercher..." 
                  emptyText="Aucun client trouvé" 
                />
              </div>
              <div className="space-y-2">
                <Label>Nom du client *</Label>
                <Input 
                  value={clientName} 
                  onChange={e => setClientName(e.target.value)} 
                  placeholder="Nom du client" 
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email client</Label>
                <Input 
                  type="email" 
                  value={clientEmail} 
                  onChange={e => setClientEmail(e.target.value)} 
                  placeholder="email@client.com" 
                />
              </div>
              <div className="space-y-2">
                <Label>Date d'expiration</Label>
                <Input 
                  type="date" 
                  value={expiryDate} 
                  onChange={e => setExpiryDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Adresse client</Label>
              <Textarea 
                value={clientAddress} 
                onChange={e => setClientAddress(e.target.value)} 
                rows={3} 
                placeholder="Adresse complète du client..." 
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={handleClose}>
                Annuler
              </Button>
              <Button onClick={() => setStep(2)} disabled={!canGoToStep2}>
                Suivant
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Étape 2 : Lignes et détails */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Récapitulatif client */}
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{clientName}</p>
                  {clientEmail && <p className="text-sm text-slate-600">{clientEmail}</p>}
                </div>
              </div>
            </div>

            {/* Lignes du devis */}
            <div className="space-y-3">
              <Label>Lignes du devis</Label>
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
                            type="number" min="0" step="0.01" 
                            value={line.quantity} 
                            onChange={e => updateLine(line._id, 'quantity', parseFloat(e.target.value) || 0)} 
                            className="h-8 text-sm" 
                          />
                        </td>
                        <td className="px-2 py-1.5">
                          <Input 
                            type="number" min="0" step="0.01" 
                            value={line.unitPrice} 
                            onChange={e => updateLine(line._id, 'unitPrice', parseFloat(e.target.value) || 0)} 
                            className="h-8 text-sm" 
                          />
                        </td>
                        <td className="px-2 py-1.5">
                          <Select value={line.taxRateId ?? 'none'} onValueChange={v => updateLine(line._id, 'taxRateId', v === 'none' ? undefined : v)}>
                            <SelectTrigger className="h-8 text-sm">
                              <SelectValue placeholder="Aucune" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Aucune</SelectItem>
                              {taxRates.map(t => (
                                <SelectItem key={t.id} value={t.id}>{t.name} ({t.rate}%)</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-2 py-1.5 text-right font-medium text-slate-900">
                          {getLineTotal(line).toLocaleString('fr-FR')}
                        </td>
                        <td className="px-1 py-1.5">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeLine(line._id)} 
                            className="h-8 w-8 p-0 text-slate-400 hover:text-red-500"
                            title="Supprimer"
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
              >
                <Plus className="h-4 w-4 mr-1" /> Ajouter une ligne
              </Button>
            </div>

            {/* Totaux */}
            <div className="flex justify-end">
              <div className="w-64 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Sous-total</span>
                  <span>{subtotal.toLocaleString('fr-FR')} {currency}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>TVA</span>
                  <span>{taxTotal.toLocaleString('fr-FR')} {currency}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg text-slate-900 border-t pt-2">
                  <span>Total</span>
                  <span>{total.toLocaleString('fr-FR')} {currency}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label>Notes et conditions</Label>
              <Textarea 
                value={notes} 
                onChange={e => setNotes(e.target.value)} 
                rows={3} 
                placeholder="Conditions de paiement, validité du devis..." 
              />
            </div>

            <div className="flex justify-between gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleClose}>
                  Annuler
                </Button>
                <Button onClick={handleSubmit} disabled={!canSubmit || loading}>
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
