import { useState, useCallback } from 'react';
import {
  Contact,
  CreateContactDto,
  UpdateContactDto,
  ContactStatus,
  ContactSource,
} from '@/types/crm';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface UseContactsFilters {
  status?: ContactStatus;
  ownerId?: string;
  search?: string;
}

export function useCRMContacts(companyId: string) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = useCallback(
    async (filters?: UseContactsFilters) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.ownerId) params.append('ownerId', filters.ownerId);
        if (filters?.search) params.append('search', filters.search);

        const queryString = params.toString();
        const url = `${API_URL}/companies/${companyId}/crm/contacts${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': localStorage.getItem('userId') || '',
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des contacts');
        }

        const data = await response.json();
        setContacts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [companyId]
  );

  const getContact = useCallback(
    async (contactId: string): Promise<Contact | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/companies/${companyId}/crm/contacts/${contactId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': localStorage.getItem('userId') || '',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération du contact');
        }

        return await response.json();
      } catch (err: any) {
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [companyId]
  );

  const createContact = useCallback(
    async (data: CreateContactDto): Promise<Contact | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/companies/${companyId}/crm/contacts`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': localStorage.getItem('userId') || '',
            },
            body: JSON.stringify(data),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erreur lors de la création du contact');
        }

        const newContact = await response.json();
        setContacts((prev) => [newContact, ...prev]);
        return newContact;
      } catch (err: any) {
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [companyId]
  );

  const updateContact = useCallback(
    async (contactId: string, data: UpdateContactDto): Promise<Contact | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/companies/${companyId}/crm/contacts/${contactId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': localStorage.getItem('userId') || '',
            },
            body: JSON.stringify(data),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erreur lors de la mise à jour du contact');
        }

        const updatedContact = await response.json();
        setContacts((prev) =>
          prev.map((c) => (c.id === contactId ? updatedContact : c))
        );
        return updatedContact;
      } catch (err: any) {
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [companyId]
  );

  const deleteContact = useCallback(
    async (contactId: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/companies/${companyId}/crm/contacts/${contactId}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': localStorage.getItem('userId') || '',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Erreur lors de la suppression du contact');
        }

        setContacts((prev) => prev.filter((c) => c.id !== contactId));
        return true;
      } catch (err: any) {
        setError(err.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [companyId]
  );

  return {
    contacts,
    loading,
    error,
    fetchContacts,
    getContact,
    createContact,
    updateContact,
    deleteContact,
  };
}
