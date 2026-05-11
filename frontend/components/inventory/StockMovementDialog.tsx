'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInventory } from '@/hooks/useInventory';
import type { InventoryProduct, MovementType } from '@/types/inventory';
import { toast } from 'sonner';

interface StockMovementDialogProps {
  companyId: string;
  product: InventoryProduct;
  open: boolean;
  onClose: () => void;
}

export function StockMovementDialog({
  companyId,
  product,
  open,
  onClose,
}: StockMovementDialogProps) {
  const { createMovement } = useInventory(companyId);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    type: 'IN' as MovementType,
    quantity: 0,
    reason: '',
    reference: '',
    notes: '',
    unitCost: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.quantity <= 0) {
      toast.error('La quantité doit être supérieure à 0');
      return;
    }

    setLoading(true);

    try {
      await createMovement(product.id, formData);
      toast.success('Mouvement enregistré');
      onClose();
      setFormData({
        type: 'IN',
        quantity: 0,
        reason: '',
        reference: '',
        notes: '',
        unitCost: 0,
      });
    } catch (err: any) {
      toast.error(err.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Mouvement de stock</DialogTitle>
          <p className="text-sm text-slate-500">
            {product.name} • Stock actuel: {product.stockQuantity} {product.unit}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">Type de mouvement *</Label>
            <Select
              value={formData.type}
              onValueChange={(value: MovementType) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IN">Entrée (réception)</SelectItem>
                <SelectItem value="OUT">Sortie (vente/utilisation)</SelectItem>
                <SelectItem value="ADJUSTMENT">Ajustement (inventaire)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="quantity">
              Quantité ({product.unit}) *
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
              required
            />
            {formData.type === 'ADJUSTMENT' && (
              <p className="text-xs text-slate-500 mt-1">
                Pour un ajustement, indiquez la nouvelle quantité totale
              </p>
            )}
          </div>

          {formData.type === 'IN' && (
            <div>
              <Label htmlFor="unitCost">Coût unitaire (optionnel)</Label>
              <Input
                id="unitCost"
                type="number"
                step="0.01"
                min="0"
                value={formData.unitCost}
                onChange={(e) => setFormData({ ...formData, unitCost: parseFloat(e.target.value) || 0 })}
              />
            </div>
          )}

          <div>
            <Label htmlFor="reason">Raison</Label>
            <Input
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Ex: Réception commande, Vente, Inventaire..."
            />
          </div>

          <div>
            <Label htmlFor="reference">Référence</Label>
            <Input
              id="reference"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              placeholder="Ex: Facture #123, Bon de livraison..."
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          {/* Aperçu */}
          <div className="bg-slate-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-slate-700 mb-2">Aperçu</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Stock actuel:</span>
                <span className="font-medium">{product.stockQuantity} {product.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">
                  {formData.type === 'IN' ? 'Entrée' : formData.type === 'OUT' ? 'Sortie' : 'Ajustement'}:
                </span>
                <span className={`font-medium ${formData.type === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
                  {formData.type === 'IN' ? '+' : formData.type === 'OUT' ? '-' : ''}
                  {formData.quantity} {product.unit}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-900 font-medium">Nouveau stock:</span>
                <span className="font-bold text-slate-900">
                  {formData.type === 'ADJUSTMENT'
                    ? formData.quantity
                    : formData.type === 'IN'
                    ? product.stockQuantity + formData.quantity
                    : product.stockQuantity - formData.quantity}{' '}
                  {product.unit}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
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
