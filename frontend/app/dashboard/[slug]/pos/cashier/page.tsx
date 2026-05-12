'use client';

import { use, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Banknote, Search, ShoppingCart, Plus, Minus,
  DollarSign, Percent, CreditCard, Smartphone,
  X, LogOut, LogIn, Package, CheckCircle2,
} from 'lucide-react';
import { usePOS } from '@/hooks/usePOS';
import { api } from '@/lib/api';
import type { CashRegister, CashSession, CartItem } from '@/types/pos';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// ── Modal confirmation vente ──────────────────────────────────────────────────
function SaleSuccessModal({
  sale,
  onClose,
}: {
  sale: { saleNumber: string; total: number; amountPaid: number; changeAmount: number; paymentMethod: string };
  onClose: () => void;
}) {
  const methodLabel: Record<string, string> = {
    CASH: 'Espèces', CARD: 'Carte bancaire', MOBILE_MONEY: 'Mobile Money',
  };
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header vert */}
        <div className="bg-emerald-500 px-6 py-8 text-center">
          <CheckCircle2 className="h-16 w-16 text-white mx-auto mb-3" />
          <p className="text-white font-bold text-xl">Vente enregistrée !</p>
          <p className="text-emerald-100 text-sm mt-1">{sale.saleNumber}</p>
        </div>

        {/* Détails */}
        <div className="px-6 py-5 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Mode de paiement</span>
            <span className="font-medium text-foreground">{methodLabel[sale.paymentMethod] ?? sale.paymentMethod}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="font-bold text-foreground text-base">{sale.total.toLocaleString()} XOF</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Reçu</span>
            <span className="font-medium text-foreground">{sale.amountPaid.toLocaleString()} XOF</span>
          </div>
          {sale.changeAmount > 0 && (
            <div className="flex justify-between text-sm bg-amber-50 rounded-lg px-3 py-2">
              <span className="text-amber-700 font-medium">Monnaie à rendre</span>
              <span className="font-bold text-amber-700 text-base">{sale.changeAmount.toLocaleString()} XOF</span>
            </div>
          )}
        </div>

        {/* Action */}
        <div className="px-6 pb-6">
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 text-base"
            onClick={onClose}
            autoFocus
          >
            Nouvelle vente
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CashierPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [companyId, setCompanyId] = useState<string>('');
  const [userId,    setUserId]    = useState<string>('');

  // Session
  const [selectedRegister, setSelectedRegister] = useState<CashRegister | null>(null);
  const [currentSession,   setCurrentSession]   = useState<CashSession | null>(null);
  const [registers,        setRegisters]        = useState<CashRegister[]>([]);
  const [showOpenSession,  setShowOpenSession]  = useState(false);
  const [openingAmount,    setOpeningAmount]    = useState('');

  // Recherche produits
  const [searchQuery,   setSearchQuery]   = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching,     setSearching]     = useState(false);

  // Panier
  const [cart,            setCart]            = useState<CartItem[]>([]);
  const [discountPercent, setDiscountPercent] = useState(0);

  // Modal confirmation vente
  const [lastSale, setLastSale] = useState<any>(null);

  const pos = usePOS(companyId);

  // ── Auth ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return;
    const parsed = JSON.parse(userData);
    const company = parsed.companies?.find((c: any) => c.slug === slug);
    if (!company) return;
    setCompanyId(company.id);

    const currentUserId = parsed.user?.id;
    if (currentUserId) {
      fetch(`${API_URL}/companies/${company.id}/hr/employees`, {
        headers: { 'x-user-id': currentUserId, 'x-company-id': company.id },
      })
        .then((r) => r.ok ? r.json() : [])
        .then((employees: any[]) => {
          const linked = employees.find((e: any) => e.userId === currentUserId);
          if (linked) setUserId(linked.id);
        })
        .catch(() => {});
    }
  }, [slug]);

  useEffect(() => {
    if (companyId) loadRegisters();
  }, [companyId]);

  // ── Recherche produits (debounce 300ms) ───────────────────────────────────
  useEffect(() => {
    if (!companyId || !searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await api.get<any[]>(
          `/companies/${companyId}/inventory/products?search=${encodeURIComponent(searchQuery)}&isActive=true`,
        );
        setSearchResults(results ?? []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, companyId]);

  // ── Caisses ───────────────────────────────────────────────────────────────
  const loadRegisters = async () => {
    const data = await pos.getRegisters();
    if (!data) return;
    const active = data.filter((r) => r.isActive);
    if (active.length === 0) {
      const def = await pos.createRegister({ name: 'Caisse 1', code: 'CASH-001', location: 'Magasin principal', isActive: true });
      if (def) setRegisters([def]);
    } else {
      setRegisters(active);
    }
  };

  const handleSelectRegister = async (register: CashRegister) => {
    setSelectedRegister(register);
    const session = await pos.getCurrentSession(register.id);
    if (session) setCurrentSession(session);
    else setShowOpenSession(true);
  };

  const handleOpenSession = async () => {
    if (!selectedRegister || !openingAmount) return;
    const session = await pos.openSession({
      registerId:    selectedRegister.id,
      cashierId:     userId || undefined,
      openingAmount: parseFloat(openingAmount),
    } as any);
    if (session) { setCurrentSession(session); setShowOpenSession(false); setOpeningAmount(''); }
  };

  const handleCloseSession = async () => {
    if (!currentSession) return;
    const closingAmount = cart.reduce((s, i) => s + i.unitPrice * i.quantity - i.discount, 0);
    await pos.closeSession(currentSession.id, {
      closingAmount,
      notes: "Session fermée depuis l'interface de caisse",
    });
    setCurrentSession(null); setSelectedRegister(null); setCart([]);
  };

  // ── Panier ────────────────────────────────────────────────────────────────
  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: Math.min(i.quantity + 1, i.stockAvailable) }
            : i,
        );
      }
      return [...prev, {
        productId:      product.id,
        productName:    product.name,
        productSku:     product.sku ?? '',
        quantity:       1,
        unitPrice:      product.salePrice,
        discount:       0,
        imageUrl:       product.imageUrl,
        stockAvailable: product.stockQuantity,
      }];
    });
    setSearchQuery('');
    setSearchResults([]);
  };

  const updateQuantity = (productId: string, delta: number) =>
    setCart((prev) =>
      prev.map((i) =>
        i.productId === productId
          ? { ...i, quantity: Math.max(1, Math.min(i.quantity + delta, i.stockAvailable)) }
          : i,
      ),
    );

  const removeFromCart = (productId: string) =>
    setCart((prev) => prev.filter((i) => i.productId !== productId));

  // ── Calculs ───────────────────────────────────────────────────────────────
  const subtotal        = cart.reduce((s, i) => s + i.unitPrice * i.quantity - i.discount, 0);
  const discountAmount  = (subtotal * discountPercent) / 100;
  const taxAmount       = ((subtotal - discountAmount) * 18) / 100;
  const total           = subtotal - discountAmount + taxAmount;

  // ── Paiement ──────────────────────────────────────────────────────────────
  const handlePayment = async (method: 'CASH' | 'CARD' | 'MOBILE_MONEY') => {
    if (!currentSession || !selectedRegister || cart.length === 0) return;
    const sale = await pos.createSale({
      registerId:     selectedRegister.id,
      sessionId:      currentSession.id,
      cashierId:      userId,
      items:          cart.map((i) => ({ productId: i.productId, quantity: i.quantity, unitPrice: i.unitPrice, discount: i.discount })),
      discountPercent,
      paymentMethod:  method,
      amountPaid:     total,
    });
    if (sale) {
      setLastSale(sale);
      setCart([]);
      setDiscountPercent(0);
    }
  };

  // ── Sélection caisse ──────────────────────────────────────────────────────
  if (!selectedRegister) {
    return (
      <div className="space-y-6 p-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Interface de Caisse</h1>
          <p className="text-sm text-muted-foreground mt-1">Sélectionnez une caisse pour commencer</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {registers.map((r) => (
            <Card key={r.id} className="cursor-pointer hover:border-emerald-500 transition-colors" onClick={() => handleSelectRegister(r)}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><Banknote className="h-5 w-5 text-emerald-600" />{r.name}</span>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700">{r.code}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {r.location && <p className="text-sm text-muted-foreground">{r.location}</p>}
                <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700">Ouvrir cette caisse</Button>
              </CardContent>
            </Card>
          ))}
        </div>
        {registers.length === 0 && (
          <Card><CardContent className="py-12 text-center">
            <Banknote className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">Aucune caisse active</p>
            <Button variant="outline" onClick={() => window.location.href = `/dashboard/${slug}/pos/registers`}>Gérer les caisses</Button>
          </CardContent></Card>
        )}
      </div>
    );
  }

  // ── Ouverture session ─────────────────────────────────────────────────────
  if (showOpenSession) {
    return (
      <div className="space-y-6 p-4">
        <h1 className="text-2xl font-bold text-foreground">Ouvrir une session</h1>
        <Card className="max-w-md mx-auto">
          <CardHeader><CardTitle className="flex items-center gap-2"><LogIn className="h-5 w-5 text-emerald-600" />Fonds de départ</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Montant en caisse (XOF)</label>
              <Input type="number" placeholder="50000" value={openingAmount} onChange={(e) => setOpeningAmount(e.target.value)} className="text-lg" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => { setSelectedRegister(null); setShowOpenSession(false); }}>Annuler</Button>
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={handleOpenSession} disabled={!openingAmount || pos.loading}>Ouvrir la session</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Interface de vente ────────────────────────────────────────────────────
  return (
    <div className="flex gap-4 h-full p-4 overflow-hidden">

      {/* Modal confirmation */}
      {lastSale && (
        <SaleSuccessModal
          sale={lastSale}
          onClose={() => setLastSale(null)}
        />
      )}

      {/* ── Colonne gauche : recherche + produits ── */}
      <div className="flex-1 flex flex-col gap-3 min-w-0">

        {/* Info session */}
        <Card className="shrink-0">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Banknote className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-semibold text-foreground">{selectedRegister.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Ouverte à {new Date(currentSession?.openedAt || '').toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleCloseSession} className="text-red-600 hover:text-red-700">
                <LogOut className="h-4 w-4 mr-2" />Fermer la session
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recherche */}
        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader className="pb-2 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un produit (nom, SKU, code-barres)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                autoFocus
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto pt-0">
            {/* État vide */}
            {!searchQuery && (
              <div className="text-center py-10 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
                <p className="text-sm">Tapez pour rechercher un produit</p>
              </div>
            )}

            {/* Chargement */}
            {searching && (
              <div className="text-center py-6 text-muted-foreground text-sm">Recherche...</div>
            )}

            {/* Résultats */}
            {!searching && searchQuery && searchResults.length === 0 && (
              <div className="text-center py-6 text-muted-foreground text-sm">
                <Package className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                Aucun produit trouvé pour « {searchQuery} »
              </div>
            )}

            {!searching && searchResults.length > 0 && (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-2">
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    disabled={product.stockQuantity === 0}
                    className="text-left p-3 border border-border rounded-lg hover:border-emerald-400 hover:bg-emerald-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <p className="font-medium text-sm text-foreground truncate">{product.name}</p>
                    {product.sku && <p className="text-xs text-muted-foreground truncate">{product.sku}</p>}
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm font-bold text-emerald-700">
                        {product.salePrice.toLocaleString()} XOF
                      </p>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        product.stockQuantity === 0
                          ? 'bg-red-100 text-red-600'
                          : product.stockQuantity <= (product.minStock ?? 0)
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {product.stockQuantity === 0 ? 'Rupture' : `Stock: ${product.stockQuantity}`}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Colonne droite : panier ── */}
      <div className="w-80 xl:w-96 flex flex-col gap-3 shrink-0">
        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader className="pb-2 shrink-0">
            <CardTitle className="flex items-center justify-between text-base">
              <span className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-emerald-600" />Panier
              </span>
              <Badge variant="outline">{cart.length} article{cart.length > 1 ? 's' : ''}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col overflow-hidden pt-0">
            {cart.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <ShoppingCart className="h-10 w-10 mx-auto mb-2" />
                  <p className="text-sm">Panier vide</p>
                </div>
              </div>
            ) : (
              <>
                {/* Articles */}
                <div className="flex-1 overflow-y-auto space-y-2 mb-3">
                  {cart.map((item) => (
                    <div key={item.productId} className="p-2.5 border border-border rounded-lg">
                      <div className="flex items-start justify-between mb-1.5">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">{item.productName}</p>
                          {item.productSku && <p className="text-xs text-muted-foreground">{item.productSku}</p>}
                        </div>
                        <button onClick={() => removeFromCart(item.productId)} className="text-red-400 hover:text-red-600 ml-2 shrink-0">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => updateQuantity(item.productId, -1)} className="h-6 w-6 rounded border border-border flex items-center justify-center hover:bg-muted">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.productId, 1)} disabled={item.quantity >= item.stockAvailable} className="h-6 w-6 rounded border border-border flex items-center justify-center hover:bg-muted disabled:opacity-40">
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-foreground">
                          {(item.unitPrice * item.quantity).toLocaleString()} XOF
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totaux + paiement */}
                <div className="border-t pt-3 space-y-3 shrink-0">
                  {/* Remise */}
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-muted-foreground shrink-0" />
                    <Input
                      type="number" placeholder="Remise %" min="0" max="100"
                      value={discountPercent || ''}
                      onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                      className="h-8 text-sm"
                    />
                  </div>

                  {/* Récap */}
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Sous-total</span><span>{subtotal.toLocaleString()} XOF</span>
                    </div>
                    {discountPercent > 0 && (
                      <div className="flex justify-between text-orange-600">
                        <span>Remise ({discountPercent}%)</span><span>-{discountAmount.toLocaleString()} XOF</span>
                      </div>
                    )}
                    <div className="flex justify-between text-muted-foreground">
                      <span>TVA (18%)</span><span>{taxAmount.toLocaleString()} XOF</span>
                    </div>
                    <div className="flex justify-between font-bold text-base text-foreground pt-1 border-t">
                      <span>Total</span><span>{total.toLocaleString()} XOF</span>
                    </div>
                  </div>

                  {/* Boutons paiement */}
                  <div className="space-y-2">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => handlePayment('CASH')} disabled={pos.loading}>
                      <DollarSign className="h-4 w-4 mr-2" />Espèces
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" onClick={() => handlePayment('CARD')} disabled={pos.loading}>
                        <CreditCard className="h-4 w-4 mr-1" />Carte
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handlePayment('MOBILE_MONEY')} disabled={pos.loading}>
                        <Smartphone className="h-4 w-4 mr-1" />Mobile
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
