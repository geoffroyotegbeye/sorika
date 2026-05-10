'use client';

import { useEffect, useState } from 'react';
import { ClientCompany, CompanySize } from '@/types/crm';
import { useCRMCompanies } from '@/hooks/useCRMCompanies';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

interface CompanyFormDialogProps {
  companyId: string;
  company?: ClientCompany | null;
  open: boolean;
  onClose: () => void;
}

export function CompanyFormDialog({
  companyId,
  company,
  open,
  onClose,
}: CompanyFormDialogProps) {
  const { createCompany, updateCompany, loading } = useCRMCompanies(companyId);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    size: '' as CompanySize | '',
    website: '',
    address: '',
    phone: '',
    notes: '',
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        industry: company.industry || '',
        size: company.size || '',
        website: company.website || '',
        address: company.address || '',
        phone: company.phone || '',
        notes: company.notes || '',
      });
    } else {
      setFormData({
        name: '',
        industry: '',
        size: '',
        website: '',
        address: '',
        phone: '',
        notes: '',
      });
    }
  }, [company, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: any = {
      ...formData,
      size: formData.size || undefined,
    };

    if (company) {
      await updateCompany(company.id, data);
    } else {
      await createCompany(data);
    }

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {company ? 'Modifier l\'entreprise' : 'Nouvelle entreprise'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de l'entreprise *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Secteur d'activité</Label>
              <Input
                id="industry"
                value={formData.industry}
                onChange={(e) =>
                  setFormData({ ...formData, industry: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Taille</Label>
              <Select
                value={formData.size}
                onValueChange={(value) =>
                  setFormData({ ...formData, size: value as CompanySize })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une taille" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SMALL">Petite (1-10)</SelectItem>
                  <SelectItem value="MEDIUM">Moyenne (11-50)</SelectItem>
                  <SelectItem value="LARGE">Grande (51-200)</SelectItem>
                  <SelectItem value="ENTERPRISE">Entreprise (200+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">Site web</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
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
