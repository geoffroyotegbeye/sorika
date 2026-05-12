'use client';

import { useEffect, useState } from 'react';
import { Contact, ContactStatus } from '@/types/crm';
import { useCRMContacts } from '@/hooks/useCRMContacts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pencil, Trash2, Mail, Phone } from 'lucide-react';
import { ContactFormDialog } from './ContactFormDialog';
import { DataGrid } from '@/components/data-grid';
import type { DataGridColumn } from '@/components/data-grid';

interface ContactsListProps {
  companyId: string;
}

const statusColors: Record<ContactStatus, string> = {
  LEAD: 'bg-blue-100 text-blue-800',
  PROSPECT: 'bg-yellow-100 text-yellow-800',
  CLIENT: 'bg-green-100 text-green-800',
  PARTNER: 'bg-purple-100 text-purple-800',
};

const statusLabels: Record<ContactStatus, string> = {
  LEAD: 'Lead',
  PROSPECT: 'Prospect',
  CLIENT: 'Client',
  PARTNER: 'Partenaire',
};

export function ContactsList({ companyId }: ContactsListProps) {
  const { contacts, loading, fetchContacts, deleteContact } = useCRMContacts(companyId);
  const [statusFilter, setStatusFilter] = useState<ContactStatus | 'ALL'>('ALL');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const filters: any = {};
    if (statusFilter !== 'ALL') filters.status = statusFilter;
    fetchContacts(filters);
  }, [statusFilter, fetchContacts]);

  const handleDelete = async (contactId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
      await deleteContact(contactId);
    }
  };

  const handleEdit = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedContact(null);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedContact(null);
    fetchContacts();
  };

  const columns: DataGridColumn<Contact>[] = [
    {
      key: 'firstName',
      header: 'Nom',
      render: (_, row) => (
        <span className="font-medium">
          {row.firstName} {row.lastName}
        </span>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (val) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          {val as string}
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Téléphone',
      render: (val) =>
        val ? (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            {val as string}
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      key: 'status',
      header: 'Statut',
      render: (val) => (
        <Badge className={statusColors[val as ContactStatus]}>
          {statusLabels[val as ContactStatus]}
        </Badge>
      ),
    },
    {
      key: 'company',
      header: 'Entreprise',
      sortable: false,
      render: (_, row) => row.company?.name ?? <span className="text-muted-foreground">—</span>,
    },
    {
      key: 'owner',
      header: 'Propriétaire',
      sortable: false,
      render: (_, row) =>
        row.owner
          ? `${row.owner.firstName || ''} ${row.owner.lastName || ''}`.trim() || row.owner.email
          : '—',
    },
    {
      key: 'id',
      header: 'Actions',
      sortable: false,
      searchable: false,
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  const filterToolbar = (
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
  );

  return (
    <>
      <DataGrid
        data={contacts}
        columns={columns}
        loading={loading}
        searchPlaceholder="Rechercher un contact..."
        emptyMessage="Aucun contact trouvé"
        toolbar={
          <div className="flex items-center gap-2">
            {filterToolbar}
            <Button onClick={handleCreate}>Nouveau contact</Button>
          </div>
        }
      />

      <ContactFormDialog
        companyId={companyId}
        contact={selectedContact}
        open={isDialogOpen}
        onClose={handleDialogClose}
      />
    </>
  );
}
