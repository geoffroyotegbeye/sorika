'use client';

import { Contact, ContactStatus } from '@/types/crm';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Mail, Phone, Building2 } from 'lucide-react';

interface ContactCardProps {
  contact: Contact;
  onClick?: () => void;
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

export function ContactCard({ contact, onClick }: ContactCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">
              {contact.firstName} {contact.lastName}
            </h3>
            <Badge className={`mt-1 ${statusColors[contact.status]}`}>
              {statusLabels[contact.status]}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span>{contact.email}</span>
        </div>
        {contact.phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{contact.phone}</span>
          </div>
        )}
        {contact.company && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>{contact.company.name}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
