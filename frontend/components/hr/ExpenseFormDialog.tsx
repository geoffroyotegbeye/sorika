'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { toast } from 'sonner';
import type { Employee } from '@/types/hr';
import type { CreateExpenseDto, ExpenseCategory } from '@/types/hr-extended';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';

interface ExpenseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: Employee[];
  defaultCurrency: string;
  onCreate: (employeeId: string, dto: CreateExpenseDto) => Promise<void>;
}

const CATEGORIES: { value: ExpenseCategory; label: string }[] = [
  { value: 'TRANSPORT', label: 'Transport' },
  { value: 'MEAL', label: 'Repas' },
  { value: 'ACCOMMODATION', label: 'Hébergement' },
  { value: 'OTHER', label: 'Autre' },
];

export function ExpenseFormDialog({
  open,
  onOpenChange,
  employees,
  defaultCurrency,
  onCreate,
}: ExpenseFormDialogProps) {
  const [employeeId, setEmployeeId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(defaultCurrency);
  const [category, setCategory] = useState<ExpenseCategory>('OTHER');
  const [date, setDate] = useState('');
  const [receiptUrl, setReceiptUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Date maximale = aujourd'hui (pas de dépenses futures)
  const today = new Date().toISOString().split('T')[0];

  // Update currency when defaultCurrency changes
  useEffect(() => {
    setCurrency(defaultCurrency);
  }, [defaultCurrency]);

  // Préparer les options pour le combobox
  const employeeOptions: ComboboxOption[] = useMemo(() =>
    employees.map((emp) => ({
      value: emp.id,
      label: `${emp.firstName} ${emp.lastName}`,
    })),
    [employees]
  );

  const resetForm = () => {
    setEmployeeId('');
    setTitle('');
    setDescription('');
    setAmount('');
    setCurrency(defaultCurrency);
    setCategory('OTHER');
    setDate('');
    setReceiptUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!employeeId || !title || !amount || !category || !date) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    try {
      const dto: CreateExpenseDto = {
        title,
        description: description || undefined,
        amount: parseFloat(amount),
        currency,
        category,
        date,
        receiptUrl: receiptUrl || undefined,
      };

      await onCreate(employeeId, dto);
      toast.success('Note de frais créée');
      resetForm();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvelle note de frais</DialogTitle>
          <DialogDescription>
            Créer une note de frais pour un employé
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Employé */}
          <div className="space-y-2">
            <Label htmlFor="employee">Employé *</Label>
            <Combobox
              options={employeeOptions}
              value={employeeId}
              onValueChange={setEmployeeId}
              placeholder="Sélectionner un employé"
              searchPlaceholder="Rechercher un employé..."
              emptyText="Aucun employé trouvé"
              disabled={loading}
            />
          </div>

          {/* Titre */}
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              placeholder="Ex: Taxi pour rendez-vous client"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnel)</Label>
            <Textarea
              id="description"
              placeholder="Détails de la dépense..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows={2}
            />
          </div>

          {/* Montant et Devise */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="amount">Montant *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Devise</Label>
              <Input
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Catégorie */}
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie *</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as ExpenseCategory)} disabled={loading}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date de la dépense *</Label>
            <Input
              id="date"
              type="date"
              max={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-slate-500">
              La date ne peut pas être dans le futur
            </p>
          </div>

          {/* Justificatif */}
          <div className="space-y-2">
            <Label htmlFor="receiptUrl">URL du justificatif (optionnel)</Label>
            <Input
              id="receiptUrl"
              type="url"
              placeholder="https://..."
              value={receiptUrl}
              onChange={(e) => setReceiptUrl(e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-slate-500">
              Uploadez d'abord le fichier dans Médias, puis collez l'URL ici
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Création...' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
