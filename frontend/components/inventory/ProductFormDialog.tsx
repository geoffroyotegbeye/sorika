'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useInventory } from '@/hooks/useInventory';
import type { InventoryProduct, ProductCategory, CreateProductDto } from '@/types/inventory';
import { toast } from 'sonner';
import { ChevronRight, ChevronLeft, Package, ImagePlus, X } from 'lucide-react';

interface ProductFormDialogProps {
  companyId: string;
  product: InventoryProduct | null;
  categories: ProductCategory[];
  open: boolean;
  onClose: () => void;
  currency: string;
}

export function ProductFormDialog({
  companyId,
  product,
  categories,
  open,
  onClose,
  currency,
}: ProductFormDialogProps) {
  const { createProduct, updateProduct } = useInventory(companyId);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<CreateProductDto>({
    name: '',
    sku: '',
    barcode: '',
    description: '',
    categoryId: '',
    salePrice: 0,
    costPrice: 0,
    stockQuantity: 0,
    minStock: 0,
    maxStock: undefined,
    unit: 'pièce',
    imageUrl: '',
    weight: undefined,
    isActive: true,
    isSellable: true,
    isPurchasable: true,
    isAvailableOnline: false,
    ecommerceDescription: '',
    ecommerceImages: [],
    packagingInfo: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        sku: product.sku || '',
        barcode: product.barcode || '',
        description: product.description || '',
        categoryId: product.categoryId || '',
        salePrice: product.salePrice,
        costPrice: product.costPrice || 0,
        stockQuantity: product.stockQuantity,
        minStock: product.minStock || 0,
        maxStock: product.maxStock,
        unit: product.unit,
        imageUrl: product.imageUrl || '',
        weight: product.weight,
        isActive: product.isActive,
        isSellable: product.isSellable,
        isPurchasable: product.isPurchasable,
        isAvailableOnline: product.isAvailableOnline || false,
        ecommerceDescription: product.ecommerceDescription || '',
        ecommerceImages: product.ecommerceImages || [],
        packagingInfo: product.packagingInfo || '',
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        barcode: '',
        description: '',
        categoryId: '',
        salePrice: 0,
        costPrice: 0,
        stockQuantity: 0,
        minStock: 0,
        maxStock: undefined,
        unit: 'pièce',
        imageUrl: '',
        weight: undefined,
        isActive: true,
        isSellable: true,
        isPurchasable: true,
        isAvailableOnline: false,
        ecommerceDescription: '',
        ecommerceImages: [],
        packagingInfo: '',
      });
    }
    setStep(1);
  }, [product, open]);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      if (product) {
        await updateProduct(product.id, formData);
        toast.success('Produit modifié');
      } else {
        await createProduct(formData);
        toast.success('Produit créé');
      }
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const userData = localStorage.getItem('user');
    const parsed = userData ? JSON.parse(userData) : null;
    const userId = parsed?.user?.id;

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/media/${companyId}/upload`, {
      method: 'POST',
      headers: {
        'x-user-id': userId || '',
        'x-company-id': companyId,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'upload de l\'image');
    }

    const media = await response.json();
    // Retourner l'URL complète du backend
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${media.url}`;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = [...(formData.ecommerceImages || [])];
    
    for (const file of files) {
      try {
        const url = await uploadImage(file);
        newImages.push(url);
      } catch (err) {
        console.error('Erreur upload image:', err);
        toast.error('Erreur lors de l\'upload de l\'image');
      }
    }
    
    setFormData({ ...formData, ecommerceImages: newImages });
  };

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  const canGoToStep2 = formData.name && formData.salePrice > 0;
  const canGoToStep3 = canGoToStep2;
  const canSubmit = canGoToStep2;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{product ? 'Modifier le produit' : 'Nouveau produit'}</DialogTitle>
        </DialogHeader>

        {/* Indicateur d'étapes */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 1 ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`}>
            1
          </div>
          <div className={`h-1 w-8 ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 2 ? 'bg-blue-600 text-white' : step > 2 ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
            2
          </div>
          <div className={`h-1 w-8 ${step >= 3 ? 'bg-blue-600' : 'bg-slate-200'}`} />
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
            3
          </div>
        </div>

        {/* Étape 1 : Informations de base */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Nom et identifiants */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du produit *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: iPhone 15 Pro"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU / Référence</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="CODE-001"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="barcode">Code-barres</Label>
                  <Input
                    id="barcode"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    placeholder="1234567890123"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Description détaillée du produit..."
              />
            </div>

            {/* Catégorie et unité */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoryId">Catégorie</Label>
                <Select
                  value={formData.categoryId || 'none'}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value === 'none' ? '' : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucune</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unité de mesure</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => setFormData({ ...formData, unit: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pièce">Pièce</SelectItem>
                    <SelectItem value="kg">Kilogramme (kg)</SelectItem>
                    <SelectItem value="g">Gramme (g)</SelectItem>
                    <SelectItem value="litre">Litre</SelectItem>
                    <SelectItem value="mètre">Mètre</SelectItem>
                    <SelectItem value="boîte">Boîte</SelectItem>
                    <SelectItem value="carton">Carton</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Image principale */}
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image principale</Label>
              <div className="space-y-2">
                {formData.imageUrl && (
                  <div className="relative w-32 h-32">
                    <img 
                      src={formData.imageUrl} 
                      alt="Image principale" 
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        console.error('Erreur de chargement de l\'image:', formData.imageUrl);
                        e.currentTarget.src = '';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: '' })}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const url = await uploadImage(file);
                          console.log('Image uploadée:', url);
                          setFormData({ ...formData, imageUrl: url });
                        } catch (err) {
                          console.error('Erreur upload:', err);
                          toast.error('Erreur lors de l\'upload de l\'image');
                        }
                      }
                    }}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Image principale affichée dans le tableau et l'inventaire
                </p>
              </div>
            </div>

            {/* Prix */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-slate-700">Prix</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salePrice">Prix de vente ({currency}) *</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="costPrice">Prix d'achat ({currency})</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              {formData.salePrice > 0 && (formData.costPrice ?? 0) > 0 && (
                <p className="text-sm text-slate-600">
                  Marge:{' '}
                  <span className="font-medium text-green-600">
                    {(
                      ((formData.salePrice - (formData.costPrice ?? 0)) / (formData.costPrice ?? 1)) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </p>
              )}
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

        {/* Étape 2 : Stock et options */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Récapitulatif */}
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{formData.name}</p>
                  <p className="text-sm text-slate-600">
                    Prix de vente: {formData.salePrice.toLocaleString()} {currency}
                  </p>
                </div>
              </div>
            </div>

            {/* Stock */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-slate-700">Gestion du stock</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stockQuantity">Stock initial</Label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    min="0"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minStock">Stock minimum</Label>
                  <Input
                    id="minStock"
                    type="number"
                    min="0"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxStock">Stock maximum</Label>
                  <Input
                    id="maxStock"
                    type="number"
                    min="0"
                    value={formData.maxStock || ''}
                    onChange={(e) => setFormData({ ...formData, maxStock: parseInt(e.target.value) || undefined })}
                  />
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-slate-700">Options</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <Label htmlFor="isActive" className="cursor-pointer">Produit actif</Label>
                    <p className="text-xs text-slate-500">Visible dans le catalogue</p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <Label htmlFor="isSellable" className="cursor-pointer">Peut être vendu</Label>
                    <p className="text-xs text-slate-500">Disponible à la vente</p>
                  </div>
                  <Switch
                    id="isSellable"
                    checked={formData.isSellable}
                    onCheckedChange={(checked) => setFormData({ ...formData, isSellable: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <Label htmlFor="isPurchasable" className="cursor-pointer">Peut être acheté</Label>
                    <p className="text-xs text-slate-500">Disponible à l'achat fournisseur</p>
                  </div>
                  <Switch
                    id="isPurchasable"
                    checked={formData.isPurchasable}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPurchasable: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div>
                    <Label htmlFor="isAvailableOnline" className="cursor-pointer">Disponible en ligne</Label>
                    <p className="text-xs text-slate-500">Vendable sur la boutique e-commerce</p>
                  </div>
                  <Switch
                    id="isAvailableOnline"
                    checked={formData.isAvailableOnline}
                    onCheckedChange={(checked) => setFormData({ ...formData, isAvailableOnline: checked })}
                  />
                </div>
              </div>
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
                <Button onClick={() => setStep(3)} disabled={!canGoToStep3}>
                  Suivant
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Étape 3 : Détails E-commerce */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-orange-200 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-orange-700" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{formData.name}</p>
                  <p className="text-sm text-slate-600">
                    Personnalisez l'affichage pour votre boutique en ligne
                  </p>
                </div>
              </div>
            </div>

            {/* Images e-commerce */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-slate-700">Images de la boutique</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-2">
                  {(formData.ecommerceImages || []).map((img: string, idx: number) => (
                    <div key={idx} className="relative group">
                      <img src={img} alt={`Image ${idx + 1}`} className="w-full h-24 object-cover rounded-lg" />
                      <button
                        onClick={() => {
                          const newImages = [...(formData.ecommerceImages || [])];
                          newImages.splice(idx, 1);
                          setFormData({ ...formData, ecommerceImages: newImages });
                        }}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="w-full h-24 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center hover:border-slate-400 transition-colors">
                      <ImagePlus className="h-6 w-6 text-slate-400" />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Cliquez sur le + pour ajouter des images (max 8 images)
                </p>
              </div>
            </div>

            {/* Description marketing */}
            <div className="space-y-2">
              <Label htmlFor="ecommerceDescription">Description marketing</Label>
              <Textarea
                id="ecommerceDescription"
                value={formData.ecommerceDescription || ''}
                onChange={(e) => setFormData({ ...formData, ecommerceDescription: e.target.value })}
                rows={4}
                placeholder="Description attractive pour votre boutique en ligne (avantages, caractéristiques...)"
              />
              <p className="text-xs text-muted-foreground">
                Cette description s'affichera sur la boutique en ligne
              </p>
            </div>

            {/* Informations packaging */}
            <div className="space-y-2">
              <Label htmlFor="packagingInfo">Informations packaging</Label>
              <Textarea
                id="packagingInfo"
                value={formData.packagingInfo || ''}
                onChange={(e) => setFormData({ ...formData, packagingInfo: e.target.value })}
                rows={3}
                placeholder="Détails sur le packaging (dimensions, poids, type d'emballage...)"
              />
              <p className="text-xs text-muted-foreground">
                Informations sur l'emballage pour la livraison
              </p>
            </div>

            <div className="flex justify-between gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleClose}>
                  Annuler
                </Button>
                <Button onClick={handleSubmit} disabled={!canSubmit || loading}>
                  {loading ? 'Enregistrement...' : product ? 'Modifier' : 'Créer'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
