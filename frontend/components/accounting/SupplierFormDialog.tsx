'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAccounting } from '@/hooks/useAccounting';
import type { Supplier } from '@/types/accounting';

interface Props {
  companyId: string;
  supplier?: Supplier | null;
  open: boolean;
  onClose: () => void;
}

export function SupplierFormDialog({ companyId, supplier, open, onClose }: Props) {
  const { createSupplier, updateSupplier, loading } = useAccounting(companyId);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (supplier) {
      setName(supplier.name);
      setEmail(supplier.email ?? '');
      setPhone(supplier.phone ?? '');
      setAddress(supplier.address ?? '');
      setTaxNumber(supplier.taxNumber ?? '');
      setNotes(supplier.notes ?? '');
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setTaxNumber('');
      setNotes('');
    }
  }, [supplier, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Le nom du fournisseur est requis');
      return;
    }

    const dto = {
      name: name.trim(),
      email: email || undefined,
      phone: phone || undefined,
      address: address || undefined,
      taxNumber: taxNumber || undefined,
      notes: notes || undefined,
    };

    try {
      if (supplier) {
        await updateSupplier(supplier.id, dto);
        toast.success('Fournisseur mis à jour');
      } else {
        await createSupplier(dto);
        toast.success('Fournisseur créé');
      }
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Erreur');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{supplier ? 'Modifier le fournisseur' : 'Nouveau fournisseur'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>
              Nom <span className="text-red-500">*</span>
            </Label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nom du fournisseur"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="contact@fournisseur.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Téléphone</Label>
              <Input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+221 77 000 00 00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Adresse</Label>
            <Textarea
              value={address}
              onChange={e => setAddress(e.target.value)}
              rows={2}
              placeholder="Adresse du fournisseur..."
            />
          </div>

          <div className="space-y-2">
            <Label>Numéro fiscal / NINEA</Label>
            <Input
              value={taxNumber}
              onChange={e => setTaxNumber(e.target.value)}
              placeholder="Numéro d'identification fiscale"
            />
          </div>

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
              {loading ? 'Enregistrement...' : supplier ? 'Mettre à jour' : 'Créer le fournisseur'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
