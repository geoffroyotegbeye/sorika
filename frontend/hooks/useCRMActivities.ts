import { useState, useCallback } from 'react';
import {
  Activity,
  CreateActivityDto,
  UpdateActivityDto,
  ActivityType,
  ActivityStatus,
} from '@/types/crm';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface UseActivitiesFilters {
  type?: ActivityType;
  status?: ActivityStatus;
  ownerId?: string;
  contactId?: string;
  companyId?: string;
  opportunityId?: string;
  search?: string;
}

export function useCRMActivities(companyId: string) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(
    async (filters?: UseActivitiesFilters) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (filters?.type) params.append('type', filters.type);
        if (filters?.status) params.append('status', filters.status);
        if (filters?.ownerId) params.append('ownerId', filters.ownerId);
        if (filters?.contactId) params.append('contactId', filters.contactId);
        if (filters?.companyId) params.append('companyId', filters.companyId);
        if (filters?.opportunityId) params.append('opportunityId', filters.opportunityId);
        if (filters?.search) params.append('search', filters.search);

        const queryString = params.toString();
        const url = `${API_URL}/companies/${companyId}/crm/activities${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': localStorage.getItem('userId') || '',
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des activités');
        }

        const data = await response.json();
        setActivities(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [companyId]
  );

  const getActivity = useCallback(
    async (activityId: string): Promise<Activity | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/companies/${companyId}/crm/activities/${activityId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': localStorage.getItem('userId') || '',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération de l\'activité');
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

  const createActivity = useCallback(
    async (data: CreateActivityDto): Promise<Activity | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/companies/${companyId}/crm/activities`,
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
          throw new Error(errorData.message || 'Erreur lors de la création de l\'activité');
        }

        const newActivity = await response.json();
        setActivities((prev) => [newActivity, ...prev]);
        return newActivity;
      } catch (err: any) {
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [companyId]
  );

  const updateActivity = useCallback(
    async (
      activityId: string,
      data: UpdateActivityDto
    ): Promise<Activity | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/companies/${companyId}/crm/activities/${activityId}`,
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
          throw new Error(errorData.message || 'Erreur lors de la mise à jour de l\'activité');
        }

        const updatedActivity = await response.json();
        setActivities((prev) =>
          prev.map((a) => (a.id === activityId ? updatedActivity : a))
        );
        return updatedActivity;
      } catch (err: any) {
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [companyId]
  );

  const completeActivity = useCallback(
    async (activityId: string): Promise<Activity | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/companies/${companyId}/crm/activities/${activityId}/complete`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': localStorage.getItem('userId') || '',
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erreur lors de la complétion de l\'activité');
        }

        const completedActivity = await response.json();
        setActivities((prev) =>
          prev.map((a) => (a.id === activityId ? completedActivity : a))
        );
        return completedActivity;
      } catch (err: any) {
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [companyId]
  );

  const deleteActivity = useCallback(
    async (activityId: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/companies/${companyId}/crm/activities/${activityId}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': localStorage.getItem('userId') || '',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Erreur lors de la suppression de l\'activité');
        }

        setActivities((prev) => prev.filter((a) => a.id !== activityId));
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
    activities,
    loading,
    error,
    fetchActivities,
    getActivity,
    createActivity,
    updateActivity,
    completeActivity,
    deleteActivity,
  };
}
