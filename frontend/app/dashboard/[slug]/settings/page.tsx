'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Loader2, Save, Plus, Trash2, Calendar as CalendarIcon } from 'lucide-react';

interface CompanySettings {
  id: string;
  name: string;
  slug: string;
  phoneNumber: string | null;
  address: string | null;
  currency: string;
  logo: string | null;
  modules: string[];
}

interface PublicHoliday {
  id: string;
  name: string;
  date: string;
  isRecurring: boolean;
}

const CURRENCIES = [
  { value: 'XOF', label: 'XOF - Franc CFA (BCEAO)' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'USD', label: 'USD - Dollar américain' },
  { value: 'GBP', label: 'GBP - Livre sterling' },
  { value: 'CAD', label: 'CAD - Dollar canadien' },
  { value: 'CHF', label: 'CHF - Franc suisse' },
  { value: 'MAD', label: 'MAD - Dirham marocain' },
  { value: 'TND', label: 'TND - Dinar tunisien' },
];

export default function SettingsPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [holidays, setHolidays] = useState<PublicHoliday[]>([]);
  const [loadingHolidays, setLoadingHolidays] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [currency, setCurrency] = useState('XOF');
  const [logo, setLogo] = useState('');

  // Holiday form state
  const [holidayName, setHolidayName] = useState('');
  const [holidayDate, setHolidayDate] = useState('');
  const [addingHoliday, setAddingHoliday] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchHolidays();
  }, [slug]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/companies/slug/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Erreur lors du chargement');

      const data = await res.json();
      setSettings(data);
      setName(data.name);
      setPhoneNumber(data.phoneNumber || '');
      setAddress(data.address || '');
      setCurrency(data.currency);
      setLogo(data.logo || '');
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const fetchHolidays = async () => {
    try {
      setLoadingHolidays(true);
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);
      const company = parsed.companies?.find((c: any) => c.slug === slug);
      if (!company) return;

      const currentYear = new Date().getFullYear();
      const res = await fetch(
        `http://localhost:3001/companies/${company.id}/public-holidays?year=${currentYear}`,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'x-user-id': parsed.user.id,
          } 
        }
      );

      if (!res.ok) throw new Error('Erreur lors du chargement des jours fériés');

      const data = await res.json();
      setHolidays(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingHolidays(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!settings) return;

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const res = await fetch(`http://localhost:3001/companies/${settings.id}/settings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...(userId ? { 'x-user-id': userId } : {}),
        },
        body: JSON.stringify({
          name,
          phoneNumber: phoneNumber || null,
          address: address || null,
          currency,
          logo: logo || null,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Erreur lors de la sauvegarde');
      }

      const updated = await res.json();
      setSettings(updated);
      toast.success('Paramètres mis à jour');
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleInitializeDefaults = async () => {
    if (!settings) return;

    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const res = await fetch(
        `http://localhost:3001/companies/${settings.id}/public-holidays/initialize-defaults`,
        {
          method: 'POST',
          headers: { 
            Authorization: `Bearer ${token}`,
            'x-user-id': parsed.user.id,
          },
        }
      );

      if (!res.ok) throw new Error('Erreur lors de l\'initialisation');

      const result = await res.json();
      toast.success(`${result.created} jours fériés ajoutés`);
      fetchHolidays();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'initialisation');
    }
  };

  const handleAddHoliday = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!settings || !holidayName || !holidayDate) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      setAddingHoliday(true);
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const res = await fetch(`http://localhost:3001/companies/${settings.id}/public-holidays`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
        },
        body: JSON.stringify({
          name: holidayName,
          date: holidayDate,
          isRecurring: true,
        }),
      });

      if (!res.ok) throw new Error('Erreur lors de l\'ajout');

      toast.success('Jour férié ajouté');
      setHolidayName('');
      setHolidayDate('');
      fetchHolidays();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'ajout');
    } finally {
      setAddingHoliday(false);
    }
  };

  const handleDeleteHoliday = async (holidayId: string) => {
    if (!settings) return;

    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const res = await fetch(
        `http://localhost:3001/companies/${settings.id}/public-holidays/${holidayId}`,
        {
          method: 'DELETE',
          headers: { 
            Authorization: `Bearer ${token}`,
            'x-user-id': parsed.user.id,
          },
        }
      );

      if (!res.ok) throw new Error('Erreur lors de la suppression');

      toast.success('Jour férié supprimé');
      fetchHolidays();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Impossible de charger les paramètres</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Paramètres</h1>
      </div>

      <Accordion type="multiple" defaultValue={[]} className="space-y-4">
        {/* Informations générales */}
        <AccordionItem value="general" className="border rounded-lg">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Save className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="text-base font-semibold text-foreground">Informations générales</h3>
                <p className="text-sm text-muted-foreground">Nom, adresse, devise et logo de l'entreprise</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Separator className="mb-6" />
            <form onSubmit={handleSave} className="px-6 pb-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de l'entreprise *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Mon Entreprise"
                    disabled={saving}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Téléphone</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+229 XX XX XX XX"
                    disabled={saving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Adresse complète de l'entreprise"
                    disabled={saving}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Devise par défaut *</Label>
                  <Select value={currency} onValueChange={setCurrency} disabled={saving}>
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((curr) => (
                        <SelectItem key={curr.value} value={curr.value}>
                          {curr.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Cette devise sera utilisée par défaut pour les notes de frais et autres transactions
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">URL du logo</Label>
                  <Input
                    id="logo"
                    type="url"
                    value={logo}
                    onChange={(e) => setLogo(e.target.value)}
                    placeholder="https://..."
                    disabled={saving}
                  />
                  <p className="text-xs text-muted-foreground">
                    Uploadez d'abord le logo dans Médias, puis collez l'URL ici
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Identifiant unique (slug)</Label>
                  <Input
                    id="slug"
                    value={settings.slug}
                    disabled
                    className="bg-muted/40 text-muted-foreground"
                  />
                  <p className="text-xs text-muted-foreground">
                    L'identifiant unique ne peut pas être modifié
                  </p>
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </AccordionContent>
        </AccordionItem>

        {/* Jours fériés */}
        <AccordionItem value="holidays" className="border rounded-lg">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <CalendarIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-left">
                <h3 className="text-base font-semibold text-foreground">Jours fériés</h3>
                <p className="text-sm text-muted-foreground">
                  Configuration des jours fériés pour le calcul des congés
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Separator className="mb-6" />
            <div className="px-6 pb-6 space-y-6">
              {/* Bouton initialisation */}
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleInitializeDefaults}
                  disabled={loadingHolidays}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Jours fériés du Bénin
                </Button>
              </div>

              {/* Formulaire d'ajout */}
              <form onSubmit={handleAddHoliday} className="flex gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Nom du jour férié"
                    value={holidayName}
                    onChange={(e) => setHolidayName(e.target.value)}
                    disabled={addingHoliday}
                  />
                </div>
                <div className="w-48">
                  <Input
                    type="date"
                    value={holidayDate}
                    onChange={(e) => setHolidayDate(e.target.value)}
                    disabled={addingHoliday}
                  />
                </div>
                <Button type="submit" disabled={addingHoliday}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </form>

              <Separator />

              {/* Liste des jours fériés */}
              {loadingHolidays ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                </div>
              ) : holidays.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground text-sm">
                    Aucun jour férié configuré. Cliquez sur "Jours fériés du Bénin" pour ajouter les jours fériés par défaut.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {holidays.map((holiday) => (
                    <div
                      key={holiday.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/40"
                    >
                      <div>
                        <p className="font-medium text-foreground">{holiday.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(holiday.date).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteHoliday(holiday.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
