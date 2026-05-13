import { useState, useCallback } from 'react';
import { Employee } from '@/types/hr';

export function useEmployees(companyId: string) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = useCallback(async () => {
    if (!companyId) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyId}/hr/employees`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
        },
      });
      
      if (!response.ok) throw new Error('Erreur lors du chargement des employés');
      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const createEmployee = async (dto: any) => {
    if (!companyId) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyId}/hr/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
        },
        body: JSON.stringify(dto),
      });
      if (!response.ok) throw new Error('Erreur lors de la création');
      await fetchEmployees();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = async (id: string, dto: any) => {
    if (!companyId) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyId}/hr/employees/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
        },
        body: JSON.stringify(dto),
      });
      if (!response.ok) throw new Error('Erreur lors de la mise à jour');
      await fetchEmployees();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id: string) => {
    if (!companyId) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyId}/hr/employees/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
        },
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      await fetchEmployees();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  };
}
