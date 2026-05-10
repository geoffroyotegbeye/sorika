import { useState, useCallback } from 'react';
import {
  Opportunity,
  CreateOpportunityDto,
  UpdateOpportunityDto,
  UpdateStageDto,
  OpportunityStage,
} from '@/types/crm';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface UseOpportunitiesFilters {
  stage?: OpportunityStage;
  ownerId?: string;
  contactId?: string;
  companyId?: string;
  search?: string;
}

export function useCRMOpportunities(companyId: string) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOpportunities = useCallback(
    async (filters?: UseOpportunitiesFilters) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (filters?.stage) params.append('stage', filters.stage);
        if (filters?.ownerId) params.append('ownerId', filters.ownerId);
        if (filters?.contactId) params.append('contactId', filters.contactId);
        if (filters?.companyId) params.append('companyId', filters.companyId);
        if (filters?.search) params.append('search', filters.search);

        const queryString = params.toString();
        const url = `${API_URL}/companies/${companyId}/crm/opportunities${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': localStorage.getItem('userId') || '',
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des opportunités');
        }

        const data = await response.json();
        setOpportunities(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [companyId]
  );

  const getOpportunity = useCallback(
    async (opportunityId: string): Promise<Opportunity | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/companies/${companyId}/crm/opportunities/${opportunityId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': localStorage.getItem('userId') || '',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération de l\'opportunité');
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

  const createOpportunity = useCallback(
    async (data: CreateOpportunityDto): Promise<Opportunity | null> => {
      setLoading(true);
      setError(null);

      try {
        console.log('Creating opportunity with data:', data);
        console.log('API URL:', `${API_URL}/companies/${companyId}/crm/opportunities`);
        console.log('User ID:', localStorage.getItem('userId'));

        const response = await fetch(
          `${API_URL}/companies/${companyId}/crm/opportunities`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': localStorage.getItem('userId') || '',
            },
            body: JSON.stringify(data),
          }
        );

        console.log('Response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          throw new Error(errorData.message || 'Erreur lors de la création de l\'opportunité');
        }

        const newOpportunity = await response.json();
        console.log('New opportunity created:', newOpportunity);
        setOpportunities((prev) => {
          const updated = [newOpportunity, ...prev];
          console.log('Updated opportunities list:', updated);
          return updated;
        });
        return newOpportunity;
      } catch (err: any) {
        console.error('Create opportunity error:', err);
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [companyId]
  );

  const updateOpportunity = useCallback(
    async (
      opportunityId: string,
      data: UpdateOpportunityDto
    ): Promise<Opportunity | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/companies/${companyId}/crm/opportunities/${opportunityId}`,
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
          throw new Error(errorData.message || 'Erreur lors de la mise à jour de l\'opportunité');
        }

        const updatedOpportunity = await response.json();
        setOpportunities((prev) =>
          prev.map((o) => (o.id === opportunityId ? updatedOpportunity : o))
        );
        return updatedOpportunity;
      } catch (err: any) {
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [companyId]
  );

  const updateStage = useCallback(
    async (
      opportunityId: string,
      data: UpdateStageDto
    ): Promise<Opportunity | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/companies/${companyId}/crm/opportunities/${opportunityId}/stage`,
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
          throw new Error(errorData.message || 'Erreur lors du changement d\'étape');
        }

        const updatedOpportunity = await response.json();
        setOpportunities((prev) =>
          prev.map((o) => (o.id === opportunityId ? updatedOpportunity : o))
        );
        return updatedOpportunity;
      } catch (err: any) {
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [companyId]
  );

  const deleteOpportunity = useCallback(
    async (opportunityId: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/companies/${companyId}/crm/opportunities/${opportunityId}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': localStorage.getItem('userId') || '',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Erreur lors de la suppression de l\'opportunité');
        }

        setOpportunities((prev) => prev.filter((o) => o.id !== opportunityId));
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
    opportunities,
    loading,
    error,
    fetchOpportunities,
    getOpportunity,
    createOpportunity,
    updateOpportunity,
    updateStage,
    deleteOpportunity,
  };
}
