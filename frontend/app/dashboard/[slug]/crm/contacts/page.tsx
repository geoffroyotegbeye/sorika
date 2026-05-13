'use client';

import { useParams } from 'next/navigation';
import { ContactsList } from '@/components/crm/ContactsList';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Contact } from '@/types/crm';
import { ContactFormDialog } from '@/components/crm/ContactFormDialog';
import { ContactStatus } from '@/types/crm';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ContactsPage() {
  const params = useParams();
  const companyId = params.slug as string;
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ContactStatus | 'ALL'>('ALL');

  const handleCreate = () => {
    setSelectedContact(null);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedContact(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contacts"
        description="Gérez vos contacts et prospects"
        breadcrumbs={[
          { label: 'CRM', href: `/dashboard/${companyId}/crm` },
          { label: 'Contacts' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as ContactStatus | 'ALL')}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tous les statuts</SelectItem>
                <SelectItem value="LEAD">Lead</SelectItem>
                <SelectItem value="PROSPECT">Prospect</SelectItem>
                <SelectItem value="CLIENT">Client</SelectItem>
                <SelectItem value="PARTNER">Partenaire</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau contact
            </Button>
          </div>
        }
      />
      <ContactsList companyId={companyId} statusFilter={statusFilter} onCreate={handleCreate} />
      <ContactFormDialog
        companyId={companyId}
        contact={selectedContact}
        open={isDialogOpen}
        onClose={handleDialogClose}
      />
    </div>
  );
}
