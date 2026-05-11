'use client';

import { use, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Banknote,
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  DollarSign,
  User,
  Percent,
  CreditCard,
  Smartphone,
  X,
  LogOut,
  LogIn,
} from 'lucide-react';
import { usePOS } from '@/hooks/usePOS';
import type { CashRegister, CashSession, CartItem } from '@/types/pos';

export default function CashierPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [companyId, setCompanyId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  
  // État de la session
  const [selectedRegister, setSelectedRegister] = useState<CashRegister | null>(null);
  const [currentSession, setCurrentSession] = useState<CashSession | null>(null);
  const [registers, setRegisters] = useState<CashRegister[]>([]);
  
  // État du panier
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  
  // Modals
  const [showOpenSession, setShowOpenSession] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [openingAmount, setOpeningAmount] = useState('');
  
  const pos = usePOS(companyId);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return;
    const parsed = JSON.parse(userData);
    const company = parsed.companies?.find((c: any) => c.slug === slug);
    if (company) {
      setCompanyId(company.id);
      setUserId(parsed.id);
    }
  }, [slug]);

  useEffect(() => {
    if (companyId) {
      loadRegisters();
    }
  }, [companyId]);

  const loadRegisters = async () => {
    const data = await pos.getRegisters();
    if (data) {
      const active = data.filter((r) => r.isActive);
      
      // Si aucune caisse n'existe, créer une caisse par défaut
      if (active.length === 0) {
        const defaultRegister = await pos.createRegister({
          name: 'Caisse 1',
          code: 'CASH-001',
          location: 'Magasin principal',
          isActive: true,
        });
        
        if (defaultRegister) {
          setRegisters([defaultRegister]);
        }
      } else {
        setRegisters(active);
      }
    }
  };

  const handleSelectRegister = async (register: CashRegister) => {
    setSelectedRegister(register);
    // Vérifier s'il y a une session ouverte
    try {
      const session = await pos.getCurrentSession(register.id);
      if (session) {
        setCurrentSession(session);
      } else {
        setShowOpenSession(true);
      }
    } catch (error) {
      // Aucune session ouverte, afficher le modal d'ouverture
      setShowOpenSession(true);
    }
  };

  const handleOpenSession = async () => {
    if (!selectedRegister || !openingAmount) return;
    
    const session = await pos.openSession({
      registerId: selectedRegister.id,
      cashierId: userId,
      openingAmount: parseFloat(openingAmount),
    });
    
    if (session) {
      setCurrentSession(session);
      setShowOpenSession(false);
      setOpeningAmount('');
    }
  };

  const handleCloseSession = async () => {
    if (!currentSession) return;
    
    const closingAmount = calculateTotal();
    await pos.closeSession(currentSession.id, {
      closingAmount,
      notes: 'Session fermée depuis l\'interface de caisse',
    });
    
    setCurrentSession(null);
    setSelectedRegister(null);
    setCart([]);
  };

  // Calculs du panier
  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity - item.discount), 0);
  };

  const calculateDiscountAmount = () => {
    return (calculateSubtotal() * discountPercent) / 100;
  };

  const calculateTaxAmount = () => {
    const afterDiscount = calculateSubtotal() - calculateDiscountAmount();
    return (afterDiscount * 18) / 100; // TVA 18%
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscountAmount() + calculateTaxAmount();
  };

  const addToCart = (product: any) => {
    const existing = cart.find((item) => item.productId === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          productName: product.name,
          productSku: product.sku,
          quantity: 1,
          unitPrice: product.sellingPrice,
          discount: 0,
          imageUrl: product.imageUrl,
          stockAvailable: product.quantity,
        },
      ]);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(
      cart.map((item) => {
        if (item.productId === productId) {
          const newQty = Math.max(1, Math.min(item.quantity + delta, item.stockAvailable));
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const handlePayment = async (method: 'CASH' | 'CARD' | 'MOBILE_MONEY') => {
    if (!currentSession || !selectedRegister || cart.length === 0) return;

    const saleData = {
      registerId: selectedRegister.id,
      sessionId: currentSession.id,
      cashierId: userId,
      customerId: selectedCustomer?.id,
      items: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
      })),
      discountPercent,
      paymentMethod: method,
      amountPaid: calculateTotal(),
    };

    const sale = await pos.createSale(saleData);
    
    if (sale) {
      // Réinitialiser le panier
      setCart([]);
      setDiscountPercent(0);
      setSelectedCustomer(null);
      setShowPayment(false);
      alert(`Vente ${sale.saleNumber} enregistrée avec succès !`);
    }
  };

  // Si aucune caisse sélectionnée
  if (!selectedRegister) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Interface de Caisse</h1>
          <p className="text-sm text-slate-500 mt-1">
            Sélectionnez une caisse pour commencer
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {registers.map((register) => (
            <Card
              key={register.id}
              className="cursor-pointer hover:border-emerald-500 transition-colors"
              onClick={() => handleSelectRegister(register)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Banknote className="h-5 w-5 text-emerald-600" />
                    {register.name}
                  </span>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
                    {register.code}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {register.location && (
                  <p className="text-sm text-slate-600">{register.location}</p>
                )}
                <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700">
                  Ouvrir cette caisse
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {registers.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Banknote className="h-16 w-16 mx-auto mb-4 text-slate-300" />
              <p className="text-slate-500 mb-4">
                Aucune caisse active disponible
              </p>
              <Button variant="outline" onClick={() => window.location.href = `/dashboard/${slug}/pos/registers`}>
                Gérer les caisses
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Modal d'ouverture de session
  if (showOpenSession) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ouvrir une session</h1>
          <p className="text-sm text-slate-500 mt-1">
            {selectedRegister.name} - {selectedRegister.code}
          </p>
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5 text-emerald-600" />
              Fonds de départ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Montant en caisse (XOF)
              </label>
              <Input
                type="number"
                placeholder="50000"
                value={openingAmount}
                onChange={(e) => setOpeningAmount(e.target.value)}
                className="text-lg"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setSelectedRegister(null);
                  setShowOpenSession(false);
                }}
              >
                Annuler
              </Button>
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={handleOpenSession}
                disabled={!openingAmount || pos.loading}
              >
                Ouvrir la session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Interface de vente principale
  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Colonne gauche : Recherche et produits */}
      <div className="flex-1 flex flex-col gap-4">
        {/* En-tête avec info session */}
        <Card>
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Banknote className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-semibold text-slate-900">{selectedRegister.name}</p>
                  <p className="text-xs text-slate-500">
                    Session ouverte à {new Date(currentSession?.openedAt || '').toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCloseSession}
                className="text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Fermer la session
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recherche de produits */}
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Rechercher un produit (nom, SKU, code-barres)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <div className="text-center py-12 text-slate-500">
              <Search className="h-16 w-16 mx-auto mb-4 text-slate-300" />
              <p>Recherchez un produit pour l'ajouter au panier</p>
              <p className="text-sm mt-2">
                Vous pouvez scanner un code-barres ou taper le nom/SKU
              </p>
            </div>
            {/* TODO: Afficher les résultats de recherche ici */}
          </CardContent>
        </Card>
      </div>

      {/* Colonne droite : Panier et paiement */}
      <div className="w-96 flex flex-col gap-4">
        {/* Panier */}
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-emerald-600" />
                Panier
              </span>
              <Badge variant="outline">{cart.length} article{cart.length > 1 ? 's' : ''}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {cart.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">Panier vide</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                {cart.map((item) => (
                  <div
                    key={item.productId}
                    className="p-3 border border-slate-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-slate-900">
                          {item.productName}
                        </p>
                        {item.productSku && (
                          <p className="text-xs text-slate-500">{item.productSku}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.productId)}
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.productId, -1)}
                          className="h-7 w-7 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.productId, 1)}
                          className="h-7 w-7 p-0"
                          disabled={item.quantity >= item.stockAvailable}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">
                        {(item.unitPrice * item.quantity).toLocaleString()} XOF
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Remise globale */}
            {cart.length > 0 && (
              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-slate-500" />
                  <Input
                    type="number"
                    placeholder="Remise %"
                    value={discountPercent || ''}
                    onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                    className="flex-1"
                    min="0"
                    max="100"
                  />
                </div>

                {/* Totaux */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Sous-total</span>
                    <span>{calculateSubtotal().toLocaleString()} XOF</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-orange-600">
                      <span>Remise ({discountPercent}%)</span>
                      <span>-{calculateDiscountAmount().toLocaleString()} XOF</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>TVA (18%)</span>
                    <span>{calculateTaxAmount().toLocaleString()} XOF</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t">
                    <span>Total</span>
                    <span>{calculateTotal().toLocaleString()} XOF</span>
                  </div>
                </div>

                {/* Boutons de paiement */}
                <div className="space-y-2 pt-2">
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => handlePayment('CASH')}
                    disabled={pos.loading}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Espèces
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handlePayment('CARD')}
                      disabled={pos.loading}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Carte
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handlePayment('MOBILE_MONEY')}
                      disabled={pos.loading}
                    >
                      <Smartphone className="h-4 w-4 mr-2" />
                      Mobile
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
