'use client';

import { use, useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Plus, Eye, EyeOff, ShoppingCart, Store, Image as ImageIcon, X, Box, Tag, DollarSign, Package as PackageIcon } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Company {
  id: string;
  slug: string;
  name: string;
  currency?: string;
}

interface Product {
  id: string;
  name: string;
  sku: string | null;
  salePrice: number;
  stockQuantity: number;
  isAvailableOnline: boolean;
  ecommerceDescription: string | null;
  imageUrl: string | null;
  ecommerceImages?: any;
  packagingInfo?: string;
  costPrice?: number;
  description?: string | null;
  minStock?: number;
  maxStock?: number;
}

export default function ShopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [company, setCompany] = useState<Company | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);
      const foundCompany = parsed.companies?.find((c: any) => c.slug === slug) ?? null;
      setCompany(foundCompany);
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
    }
  }, [slug]);

  useEffect(() => {
    if (company?.id) {
      fetchProducts();
    }
  }, [company?.id]);

  const fetchProducts = async () => {
    if (!company) return;
    try {
      const userData = localStorage.getItem('user');
      const parsed = userData ? JSON.parse(userData) : null;
      const userId = parsed?.user?.id;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/companies/${company.id}/inventory/products`, {
        headers: {
          'x-user-id': userId || '',
          'x-company-id': company.id,
        },
      });
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error('Erreur lors du chargement des produits:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleOnlineAvailability = async (productId: string, currentValue: boolean) => {
    if (!company) return;
    try {
      const userData = localStorage.getItem('user');
      const parsed = userData ? JSON.parse(userData) : null;
      const userId = parsed?.user?.id;

      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/companies/${company.id}/inventory/products/${productId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': userId || '',
          'x-company-id': company.id,
        },
        body: JSON.stringify({ isAvailableOnline: !currentValue }),
      });
      fetchProducts();
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
    }
  };

  if (!company || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  const currency = company.currency ?? 'XOF';
  const availableProducts = products.filter(p => p.isAvailableOnline);
  const unavailableProducts = products.filter(p => !p.isAvailableOnline);

  const getDisplayImage = (product: Product) => {
    if (product.ecommerceImages && Array.isArray(product.ecommerceImages) && product.ecommerceImages.length > 0) {
      const url = product.ecommerceImages[0];
      // Si l'URL est relative (commence par /uploads), ajouter l'URL du backend
      if (url.startsWith('/uploads')) {
        return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${url}`;
      }
      // Si l'URL est déjà complète, la retourner telle quelle
      return url;
    }
    if (product.imageUrl) {
      // Si l'URL est relative, ajouter l'URL du backend
      if (product.imageUrl.startsWith('/uploads')) {
        return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${product.imageUrl}`;
      }
      // Si l'URL est déjà complète, la retourner telle quelle
      return product.imageUrl;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Boutique"
        description="Gérez les produits disponibles à la vente en ligne"
        breadcrumbs={[
          { label: 'E-commerce', href: `/dashboard/${slug}/ecommerce` },
          { label: 'Boutique' },
        ]}
        actions={
          <Link href={`/dashboard/${slug}/inventory/products`}>
            <Button className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Gérer les produits
            </Button>
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Disponibles en ligne</CardTitle>
            <div className="p-2 bg-green-200 rounded-lg">
              <Store className="h-5 w-5 text-green-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">{availableProducts.length}</div>
            <p className="text-xs text-green-700 mt-1">Produits vendables</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">En inventaire</CardTitle>
            <div className="p-2 bg-blue-200 rounded-lg">
              <Package className="h-5 w-5 text-blue-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{unavailableProducts.length}</div>
            <p className="text-xs text-blue-700 mt-1">Non disponibles en ligne</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Total produits</CardTitle>
            <div className="p-2 bg-purple-200 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-purple-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">{products.length}</div>
            <p className="text-xs text-purple-700 mt-1">Catalogue complet</p>
          </CardContent>
        </Card>
      </div>

      {/* Produits disponibles en ligne */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Store className="h-5 w-5 text-green-600" />
            Produits disponibles en ligne
          </h2>
          <Badge className="bg-green-100 text-green-700 border-green-300">
            {availableProducts.length} produit{availableProducts.length > 1 ? 's' : ''}
          </Badge>
        </div>

        {availableProducts.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <Store className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2 text-muted-foreground">Aucun produit en ligne</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Sélectionnez des produits de l'inventaire pour les rendre disponibles à la vente.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {availableProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedProduct(product)}>
                <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200">
                  {getDisplayImage(product) ? (
                    <img 
                      src={getDisplayImage(product)} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-16 w-16 text-slate-300" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-green-500 text-white border-green-600">
                      En ligne
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
                  {product.sku && (
                    <p className="text-xs text-muted-foreground mb-2">SKU: {product.sku}</p>
                  )}
                  {product.ecommerceDescription && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {product.ecommerceDescription}
                    </p>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        {product.salePrice.toLocaleString('fr-FR')} {currency}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Stock: {product.stockQuantity}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOnlineAvailability(product.id, true);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                  >
                    <EyeOff className="h-4 w-4" />
                    Retirer de la boutique
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Produits non disponibles */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            Produits en inventaire
          </h2>
          <Badge className="bg-blue-100 text-blue-700 border-blue-300">
            {unavailableProducts.length} produit{unavailableProducts.length > 1 ? 's' : ''}
          </Badge>
        </div>

        {unavailableProducts.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2 text-muted-foreground">Tous les produits sont en ligne</h3>
              <p className="text-sm text-muted-foreground">
                Tous vos produits de l'inventaire sont disponibles à la vente.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {unavailableProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow opacity-75 cursor-pointer" onClick={() => setSelectedProduct(product)}>
                <div className="relative h-48 bg-gradient-to-br from-slate-50 to-slate-100">
                  {getDisplayImage(product) ? (
                    <img 
                      src={getDisplayImage(product)} 
                      alt={product.name} 
                      className="w-full h-full object-cover grayscale"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-16 w-16 text-slate-300" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-slate-500 text-white border-slate-600">
                      Hors ligne
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
                  {product.sku && (
                    <p className="text-xs text-muted-foreground mb-2">SKU: {product.sku}</p>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-2xl font-bold text-slate-700">
                        {product.salePrice.toLocaleString('fr-FR')} {currency}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Stock: {product.stockQuantity}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOnlineAvailability(product.id, false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
                  >
                    <Eye className="h-4 w-4" />
                    Ajouter à la boutique
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal détails produit */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails du produit</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-6">
              {/* Image principale */}
              <div className="relative h-64 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden">
                {getDisplayImage(selectedProduct) ? (
                  <img 
                    src={getDisplayImage(selectedProduct)} 
                    alt={selectedProduct.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-24 w-24 text-slate-300" />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <Badge className={selectedProduct.isAvailableOnline ? "bg-green-500 text-white border-green-600" : "bg-slate-500 text-white border-slate-600"}>
                    {selectedProduct.isAvailableOnline ? "En ligne" : "Hors ligne"}
                  </Badge>
                </div>
              </div>

              {/* Images multiples */}
              {selectedProduct.ecommerceImages && Array.isArray(selectedProduct.ecommerceImages) && selectedProduct.ecommerceImages.length > 1 && (
                <div className="space-y-2">
                  <h3 className="font-medium text-sm text-slate-700">Galerie d'images</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {selectedProduct.ecommerceImages.map((img: string, idx: number) => (
                      <img 
                        key={idx}
                        src={img.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${img}` : img}
                        alt={`Image ${idx + 1}`}
                        className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Informations principales */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{selectedProduct.name}</h3>
                  {selectedProduct.sku && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Tag className="h-4 w-4" />
                      SKU: {selectedProduct.sku}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-2 text-3xl font-bold text-green-600">
                    <DollarSign className="h-6 w-6" />
                    {selectedProduct.salePrice.toLocaleString('fr-FR')} {currency}
                  </div>
                  {selectedProduct.costPrice && (
                    <p className="text-sm text-muted-foreground">
                      Prix d'achat: {selectedProduct.costPrice.toLocaleString('fr-FR')} {currency}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              {selectedProduct.description && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-slate-700">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>
                </div>
              )}

              {/* Description marketing */}
              {selectedProduct.ecommerceDescription && (
                <div className="space-y-2 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
                  <h4 className="font-medium text-sm text-slate-700">Description marketing</h4>
                  <p className="text-sm text-slate-900">{selectedProduct.ecommerceDescription}</p>
                </div>
              )}

              {/* Informations stock */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="text-center">
                  <PackageIcon className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold text-slate-900">{selectedProduct.stockQuantity}</p>
                  <p className="text-xs text-muted-foreground">Stock actuel</p>
                </div>
                {selectedProduct.minStock && (
                  <div className="text-center">
                    <Box className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                    <p className="text-2xl font-bold text-slate-900">{selectedProduct.minStock}</p>
                    <p className="text-xs text-muted-foreground">Stock minimum</p>
                  </div>
                )}
                {selectedProduct.maxStock && (
                  <div className="text-center">
                    <Box className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                    <p className="text-2xl font-bold text-slate-900">{selectedProduct.maxStock}</p>
                    <p className="text-xs text-muted-foreground">Stock maximum</p>
                  </div>
                )}
              </div>

              {/* Packaging info */}
              {selectedProduct.packagingInfo && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-slate-700">Informations packaging</h4>
                  <p className="text-sm text-muted-foreground">{selectedProduct.packagingInfo}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Link href={`/dashboard/${slug}/inventory/products`}>
                  <Button variant="outline">
                    Voir dans l'inventaire
                  </Button>
                </Link>
                <Button
                  onClick={() => {
                    toggleOnlineAvailability(selectedProduct.id, selectedProduct.isAvailableOnline);
                    setSelectedProduct(null);
                  }}
                  className={selectedProduct.isAvailableOnline ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                >
                  {selectedProduct.isAvailableOnline ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Retirer de la boutique
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Ajouter à la boutique
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
