'use client';

import { useEffect, useState } from 'react';
import { Activity, ActivityType, ActivityStatus } from '@/types/crm';
import { useCRMActivities } from '@/hooks/useCRMActivities';
import { useCRMContacts } from '@/hooks/useCRMContacts';
import { useCRMCompanies } from '@/hooks/useCRMCompanies';
import { useCRMOpportunities } from '@/hooks/useCRMOpportunities';
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

interface ActivityFormDialogProps {
  companyId: string;
  activity?: Activity | null;
  open: boolean;
  onClose: () => void;
}

export function ActivityFormDialog({
  companyId,
  activity,
  open,
  onClose,
}: ActivityFormDialogProps) {
  const { createActivity, updateActivity, loading } = useCRMActivities(companyId);
  const { contacts, fetchContacts } = useCRMContacts(companyId);
  const { companies, fetchCompanies } = useCRMCompanies(companyId);
  const { opportunities, fetchOpportunities } = useCRMOpportunities(companyId);
  
  const [formData, setFormData] = useState({
    type: 'TASK' as ActivityType,
    subject: '',
    description: '',
    status: 'PLANNED' as ActivityStatus,
    dueDate: '',
    duration: '',
    contactId: 'none',
    companyId: 'none',
    opportunityId: 'none',
  });

  useEffect(() => {
    if (open) {
      // Charger les données pour les selects
      fetchContacts();
      fetchCompanies();
      fetchOpportunities();
    }
    
    if (activity) {
      setFormData({
        type: activity.type,
        subject: activity.subject,
        description: activity.description || '',
        status: activity.status,
        dueDate: activity.dueDate ? activity.dueDate.split('T')[0] : '',
        duration: activity.duration?.toString() || '',
        contactId: activity.contactId || 'none',
        companyId: activity.companyId || 'none',
        opportunityId: activity.opportunityId || 'none',
      });
    } else {
      setFormData({
        type: 'TASK',
        subject: '',
        description: '',
        status: 'PLANNED',
        dueDate: '',
        duration: '',
        contactId: 'none',
        companyId: 'none',
        opportunityId: 'none',
      });
    }
  }, [activity, open, fetchContacts, fetchCompanies, fetchOpportunities]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: any = {
      type: formData.type,
      subject: formData.subject,
      description: formData.description || undefined,
      status: formData.status,
      dueDate: formData.dueDate || undefined,
      duration: formData.duration ? parseInt(formData.duration) : undefined,
      contactId: formData.contactId !== 'none' ? formData.contactId : undefined,
      companyId: formData.companyId !== 'none' ? formData.companyId : undefined,
      opportunityId: formData.opportunityId !== 'none' ? formData.opportunityId : undefined,
    };

    if (activity) {
      await updateActivity(activity.id, data);
    } else {
      await createActivity(data);
    }

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {activity ? 'Modifier l\'activité' : 'Nouvelle activité'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value as ActivityType })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CALL">Appel</SelectItem>
                  <SelectItem value="EMAIL">Email</SelectItem>
                  <SelectItem value="MEETING">Réunion</SelectItem>
                  <SelectItem value="TASK">Tâche</SelectItem>
                  <SelectItem value="NOTE">Note</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as ActivityStatus })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PLANNED">Planifiée</SelectItem>
                  <SelectItem value="COMPLETED">Complétée</SelectItem>
                  <SelectItem value="CANCELLED">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Sujet *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactId">Contact (facultatif)</Label>
              <Select
                value={formData.contactId}
                onValueChange={(value) =>
                  setFormData({ ...formData, contactId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un contact" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun</SelectItem>
                  {contacts.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.firstName} {contact.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyId">Entreprise (facultatif)</Label>
              <Select
                value={formData.companyId}
                onValueChange={(value) =>
                  setFormData({ ...formData, companyId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une entreprise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucune</SelectItem>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="opportunityId">Opportunité (facultatif)</Label>
              <Select
                value={formData.opportunityId}
                onValueChange={(value) =>
                  setFormData({ ...formData, opportunityId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une opportunité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucune</SelectItem>
                  {opportunities.map((opportunity) => (
                    <SelectItem key={opportunity.id} value={opportunity.id}>
                      {opportunity.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Date d'échéance</Label>
              <Input
                id="dueDate"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Durée (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="0"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
              />
            </div>
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
