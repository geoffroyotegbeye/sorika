import { useState, useCallback } from 'react';
import {
  ClientCompany,
  CreateClientCompanyDto,
  UpdateClientCompanyDto,
  CompanySize,
} from '@/types/crm';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface UseCompaniesFilters {
  ownerId?: string;
  industry?: string;
  size?: CompanySize;
  search?: string;
}

export function useCRMCompanies(companyId: string) {
  const [companies, setCompanies] = useState<ClientCompany[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = useCallback(
    async (filters?: UseCompaniesFilters) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (filters?.ownerId) params.append('ownerId', filters.ownerId);
        if (filters?.industry) params.append('industry', filters.industry);
        if (filters?.size) params.append('size', filters.size);
        if (filters?.search) params.append('search', filters.search);

        const queryString = params.toString();
        const url = `${API_URL}/companies/${companyId}/crm/client-companies${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': localStorage.getItem('userId') || '',
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des entreprises');
        }

        const data = await response.json();
        setCompanies(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [companyId]
  );

  const getCompany = useCallback(
    async (clientCompanyId: string): Promise<ClientCompany | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/companies/${companyId}/crm/client-companies/${clientCompanyId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': localStorage.getItem('userId') || '',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération de l\'entreprise');
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

  const createCompany = useCallback(
    async (data: CreateClientCompanyDto): Promise<ClientCompany | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/companies/${companyId}/crm/client-companies`,
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
          throw new Error(errorData.message || 'Erreur lors de la création de l\'entreprise');
        }

        const newCompany = await response.json();
        setCompanies((prev) => [newCompany, ...prev]);
        return newCompany;
      } catch (err: any) {
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [companyId]
  );

  const updateCompany = useCallback(
    async (
      clientCompanyId: string,
      data: UpdateClientCompanyDto
    ): Promise<ClientCompany | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/companies/${companyId}/crm/client-companies/${clientCompanyId}`,
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
          throw new Error(errorData.message || 'Erreur lors de la mise à jour de l\'entreprise');
        }

        const updatedCompany = await response.json();
        setCompanies((prev) =>
          prev.map((c) => (c.id === clientCompanyId ? updatedCompany : c))
        );
        return updatedCompany;
      } catch (err: any) {
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [companyId]
  );

  const deleteCompany = useCallback(
    async (clientCompanyId: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/companies/${companyId}/crm/client-companies/${clientCompanyId}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': localStorage.getItem('userId') || '',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Erreur lors de la suppression de l\'entreprise');
        }

        setCompanies((prev) => prev.filter((c) => c.id !== clientCompanyId));
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
    companies,
    loading,
    error,
    fetchCompanies,
    getCompany,
    createCompany,
    updateCompany,
    deleteCompany,
  };
}
