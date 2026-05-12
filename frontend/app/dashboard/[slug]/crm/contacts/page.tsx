'use client';

import { useParams } from 'next/navigation';
import { ContactsList } from '@/components/crm/ContactsList';

export default function ContactsPage() {
  const params = useParams();
  const companyId = params.slug as string;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Contacts</h1>
      </div>
      <ContactsList companyId={companyId} />
    </div>
  );
}
