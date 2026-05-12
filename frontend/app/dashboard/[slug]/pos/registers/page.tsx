'use client';

import { use, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePOS } from '@/hooks/usePOS';
import type { CashRegister } from '@/types/pos';
import {
  Banknote, Plus, MapPin, CheckCircle2, XCircle,
  Edit2, Power, X, ShoppingCart, Clock, Save,
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

// ── Form modal ────────────────────────────────────────────────────────────────
function RegisterFormModal({
  register,
  onClose,
  onSave,
}: {
  register: CashRegister | null;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}) {
  const [form, setForm] = useState({
    name:     register?.name     ?? '',
    code:     register?.code     ?? '',
    location: register?.location ?? '',
    isActive: register?.isActive ?? true,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.name || !form.code) { toast.error('Nom et code obligatoires'); return; }
    setSaving(true);
    try { await onSave(form); onClose(); }
    catch { toast.error('Erreur lors de la sauvegarde'); }
    finally { setSaving(false); }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{register ? 'Modifier la caisse' : 'Nouvelle caisse'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Nom *</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Caisse principale" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Code *</label>
            <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="CASH-001" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Emplacement</label>
            <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Accueil, Caisse 1..." />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setForm({ ...form, isActive: !form.isActive })}
              className={`relative w-10 h-5 rounded-full transition-colors ${form.isActive ? 'bg-emerald-500' : 'bg-muted'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
            <span className="text-sm text-foreground">{form.isActive ? 'Active' : 'Inactive'}</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Annuler</Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />{saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function RegistersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [companyId,  setCompanyId]  = useState('');
  const [registers,  setRegisters]  = useState<CashRegister[]>([]);
  const [editTarget, setEditTarget] = useState<CashRegister | null | 'new'>('new' as any);
  const [showForm,   setShowForm]   = useState(false);

  const { getRegisters, createRegister, updateRegister, loading } = usePOS(companyId);

  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (!raw) return;
    const co = JSON.parse(raw).companies?.find((c: any) => c.slug === slug);
    if (co) setCompanyId(co.id);
  }, [slug]);

  useEffect(() => {
    if (companyId) getRegisters().then((d) => { if (d) setRegisters(d); });
  }, [companyId]);

  const reload = () => getRegisters().then((d) => { if (d) setRegisters(d); });

  const handleSave = async (data: any) => {
    if (editTarget && editTarget !== 'new' && (editTarget as CashRegister).id) {
      await updateRegister((editTarget as CashRegister).id, data);
      toast.success('Caisse mise à jour');
    } else {
      await createRegister(data);
      toast.success('Caisse créée');
    }
    await reload();
  };

  const handleToggle = async (r: CashRegister) => {
    await updateRegister(r.id, { isActive: !r.isActive });
    toast.success(r.isActive ? 'Caisse désactivée' : 'Caisse activée');
    await reload();
  };

  const active   = registers.filter((r) => r.isActive);
  const inactive = registers.filter((r) => !r.isActive);

  if (loading && registers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Caisses</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gestion des caisses enregistreuses</p>
        </div>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 gap-2"
          onClick={() => { setEditTarget(null); setShowForm(true); }}
        >
          <Plus className="h-4 w-4" />Nouvelle caisse
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total',    value: registers.length,  color: 'text-foreground',   bg: 'bg-muted/40'   },
          { label: 'Actives',  value: active.length,     color: 'text-emerald-700', bg: 'bg-emerald-50' },
          { label: 'Inactives',value: inactive.length,   color: 'text-muted-foreground',   bg: 'bg-muted/40'   },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="py-3 px-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Caisses actives */}
      {active.length > 0 && (
        <div>
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Caisses actives ({active.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {active.map((r) => (
              <Card key={r.id} className="border-border hover:shadow-md transition-all">
                <CardContent className="py-4 px-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <Banknote className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{r.name}</p>
                        <Badge variant="outline" className="text-xs mt-0.5">{r.code}</Badge>
                      </div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Active</Badge>
                  </div>

                  {r.location && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                      <MapPin className="h-3.5 w-3.5" />{r.location}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-muted/40 rounded-lg p-2.5 text-center">
                      <p className="text-xs text-muted-foreground mb-0.5 flex items-center justify-center gap-1"><Clock className="h-3 w-3" />Sessions</p>
                      <p className="font-bold text-foreground">{r._count?.sessions ?? 0}</p>
                    </div>
                    <div className="bg-muted/40 rounded-lg p-2.5 text-center">
                      <p className="text-xs text-muted-foreground mb-0.5 flex items-center justify-center gap-1"><ShoppingCart className="h-3 w-3" />Ventes</p>
                      <p className="font-bold text-foreground">{r._count?.sales ?? 0}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline" size="sm" className="flex-1 gap-1.5"
                      onClick={() => { setEditTarget(r); setShowForm(true); }}
                    >
                      <Edit2 className="h-3.5 w-3.5" />Modifier
                    </Button>
                    <Button
                      variant="outline" size="sm"
                      className="text-red-500 hover:text-red-600 hover:border-red-200"
                      onClick={() => handleToggle(r)}
                    >
                      <Power className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Caisses inactives */}
      {inactive.length > 0 && (
        <div>
          <h2 className="font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <XCircle className="h-4 w-4 text-muted-foreground" />
            Caisses inactives ({inactive.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {inactive.map((r) => (
              <Card key={r.id} className="border-border opacity-70">
                <CardContent className="py-4 px-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                        <Banknote className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-muted-foreground">{r.name}</p>
                        <Badge variant="outline" className="text-xs mt-0.5 text-muted-foreground">{r.code}</Badge>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-muted-foreground">Inactive</Badge>
                  </div>
                  {r.location && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                      <MapPin className="h-3.5 w-3.5" />{r.location}
                    </div>
                  )}
                  <Button
                    variant="outline" size="sm" className="w-full gap-1.5 text-emerald-600 hover:text-emerald-700 hover:border-emerald-200"
                    onClick={() => handleToggle(r)}
                  >
                    <Power className="h-3.5 w-3.5" />Réactiver
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Vide */}
      {registers.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <Banknote className="h-14 w-14 mx-auto mb-4 text-muted-foreground/40" />
            <p className="text-muted-foreground mb-1">Aucune caisse enregistrée</p>
            <p className="text-sm text-muted-foreground mb-5">Créez votre première caisse pour commencer à vendre</p>
            <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2" onClick={() => { setEditTarget(null); setShowForm(true); }}>
              <Plus className="h-4 w-4" />Créer une caisse
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modal */}
      {showForm && (
        <RegisterFormModal
          register={editTarget as CashRegister | null}
          onClose={() => { setShowForm(false); setEditTarget(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
