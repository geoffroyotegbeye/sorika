'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, RefreshCw, Package, ChevronRight, ChevronLeft } from 'lucide-react';
import type { InventoryProduct } from '@/types/inventory';

interface MovementFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    productId: string;
    type: 'IN' | 'OUT' | 'ADJUSTMENT';
    quantity: number;
    reason: string;
    reference?: string;
    unitCost?: number;
  }) => Promise<void>;
  products: InventoryProduct[];
  preSelectedProductId?: string; // Produit pré-sélectionné
}

export function MovementFormDialog({ open, onClose, onSubmit, products, preSelectedProductId }: MovementFormDialogProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    productId: preSelectedProductId || '',
    type: 'IN' as 'IN' | 'OUT' | 'ADJUSTMENT',
    quantity: '',
    reason: '',
    reference: '',
    unitCost: '',
  });

  // Mettre à jour le produit pré-sélectionné quand il change
  useEffect(() => {
    if (preSelectedProductId) {
      setFormData(prev => ({ ...prev, productId: preSelectedProductId }));
    }
  }, [preSelectedProductId]);

  const selectedProduct = products.find((p) => p.id === formData.productId);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit({
        productId: formData.productId,
        type: formData.type,
        quantity: parseFloat(formData.quantity),
        reason: formData.reason,
        reference: formData.reference || undefined,
        unitCost: formData.unitCost ? parseFloat(formData.unitCost) : undefined,
      });
      handleClose();
    } catch (error) {
      console.error('Error creating movement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setFormData({
      productId: '',
      type: 'IN',
      quantity: '',
      reason: '',
      reference: '',
      unitCost: '',
    });
    onClose();
  };

  const canGoToStep2 = formData.productId && formData.type;
  const canSubmit = canGoToStep2 && formData.quantity && parseFloat(formData.quantity) > 0;

  const movementTypes = [
    {
      value: 'IN',
      label: 'Entrée de stock',
      description: 'Réception, achat, retour client',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      value: 'OUT',
      label: 'Sortie de stock',
      description: 'Vente, perte, casse, vol',
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    {
      value: 'ADJUSTMENT',
      label: 'Ajustement',
      description: 'Correction, inventaire physique',
      icon: RefreshCw,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nouveau mouvement de stock</DialogTitle>
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

        {/* Étape 1 : Sélection produit et type */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Sélection du produit */}
            <div className="space-y-2">
              <Label>Produit *</Label>
              <Select
                value={formData.productId}
                onValueChange={(value) => setFormData({ ...formData, productId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un produit" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-slate-400" />
                        <span>{product.name}</span>
                        {product.sku && (
                          <span className="text-xs text-slate-500">({product.sku})</span>
                        )}
                        <span className="text-xs text-slate-500 ml-auto">
                          Stock: {product.stockQuantity} {product.unit}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedProduct && (
                <div className="mt-2 p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Stock actuel</span>
                    <span className="font-semibold text-slate-900">
                      {selectedProduct.stockQuantity} {selectedProduct.unit}
                    </span>
                  </div>
                  {selectedProduct.minStock && (
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-slate-600">Stock minimum</span>
                      <span className="text-slate-600">
                        {selectedProduct.minStock} {selectedProduct.unit}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Type de mouvement */}
            <div className="space-y-2">
              <Label>Type de mouvement *</Label>
              <div className="grid grid-cols-1 gap-3 mt-2">
                {movementTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = formData.type === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: type.value as any })}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        isSelected
                          ? `${type.borderColor} ${type.bgColor}`
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${isSelected ? type.bgColor : 'bg-slate-100'}`}>
                          <Icon className={`h-5 w-5 ${isSelected ? type.color : 'text-slate-500'}`} />
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${isSelected ? type.color : 'text-slate-900'}`}>
                            {type.label}
                          </p>
                          <p className="text-sm text-slate-500 mt-0.5">{type.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
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

        {/* Étape 2 : Détails du mouvement */}
        {step === 2 && (
          <div className="space-y-4">
            {/* Récapitulatif */}
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Produit</p>
                  <p className="font-medium text-slate-900">{selectedProduct?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600">Type</p>
                  <p className="font-medium text-slate-900">
                    {movementTypes.find((t) => t.value === formData.type)?.label}
                  </p>
                </div>
              </div>
            </div>

            {/* Quantité */}
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantité * ({selectedProduct?.unit})</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                min="0"
                step="0.01"
              />
              {formData.quantity && selectedProduct && (
                <p className="text-sm text-slate-600 mt-1">
                  Nouveau stock:{' '}
                  <span className="font-medium">
                    {formData.type === 'IN'
                      ? selectedProduct.stockQuantity + parseFloat(formData.quantity)
                      : formData.type === 'OUT'
                      ? selectedProduct.stockQuantity - parseFloat(formData.quantity)
                      : parseFloat(formData.quantity)}{' '}
                    {selectedProduct.unit}
                  </span>
                </p>
              )}
            </div>

            {/* Coût unitaire (optionnel pour les entrées) */}
            {formData.type === 'IN' && (
              <div className="space-y-2">
                <Label htmlFor="unitCost">Coût unitaire (XOF)</Label>
                <Input
                  id="unitCost"
                  type="number"
                  placeholder="0"
                  value={formData.unitCost}
                  onChange={(e) => setFormData({ ...formData, unitCost: e.target.value })}
                  min="0"
                  step="0.01"
                />
                {formData.unitCost && formData.quantity && (
                  <p className="text-sm text-slate-600 mt-1">
                    Coût total:{' '}
                    <span className="font-medium">
                      {(parseFloat(formData.unitCost) * parseFloat(formData.quantity)).toLocaleString()} XOF
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* Référence */}
            <div className="space-y-2">
              <Label htmlFor="reference">Référence (N° bon, facture...)</Label>
              <Input
                id="reference"
                placeholder="Ex: BON-2024-001"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              />
            </div>

            {/* Raison */}
            <div className="space-y-2">
              <Label htmlFor="reason">Raison / Commentaire *</Label>
              <Textarea
                id="reason"
                placeholder="Ex: Réception fournisseur, Vente client, Inventaire physique..."
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                rows={3}
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
