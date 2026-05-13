import { useState, useEffect, useCallback } from 'react';
import { Advance, AdvanceRule, CreateAdvanceDto, UpdateAdvanceDto, CreateAdvanceRuleDto, UpdateAdvanceRuleDto } from '@/types/hr';

export function useAdvances(companyId: string) {
  const [advances, setAdvances] = useState<Advance[]>([]);
  const [advanceRules, setAdvanceRules] = useState<AdvanceRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdvances = useCallback(async () => {
    if (!companyId) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyId}/hr/advances`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
        },
      });
      
      if (!response.ok) throw new Error('Erreur lors du chargement des acomptes');
      const data = await response.json();
      setAdvances(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const fetchAdvanceRules = useCallback(async () => {
    if (!companyId) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyId}/hr/advance-rules`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
        },
      });
      
      if (!response.ok) throw new Error('Erreur lors du chargement des règles d\'acomptes');
      const data = await response.json();
      setAdvanceRules(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const createAdvance = async (dto: any) => {
    if (!companyId) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyId}/hr/advances`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
        },
        body: JSON.stringify(dto),
      });
      if (!response.ok) throw new Error('Erreur lors de la création');
      await fetchAdvances();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const updateAdvance = async (id: string, dto: any) => {
    if (!companyId) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyId}/hr/advances/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
        },
        body: JSON.stringify(dto),
      });
      if (!response.ok) throw new Error('Erreur lors de la mise à jour');
      await fetchAdvances();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const deleteAdvance = async (id: string) => {
    if (!companyId) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyId}/hr/advances/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
        },
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      await fetchAdvances();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const createAdvanceRule = async (dto: any) => {
    if (!companyId) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyId}/hr/advance-rules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
        },
        body: JSON.stringify(dto),
      });
      if (!response.ok) throw new Error('Erreur lors de la création');
      await fetchAdvanceRules();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const updateAdvanceRule = async (id: string, dto: any) => {
    if (!companyId) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyId}/hr/advance-rules/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
        },
        body: JSON.stringify(dto),
      });
      if (!response.ok) throw new Error('Erreur lors de la mise à jour');
      await fetchAdvanceRules();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const deleteAdvanceRule = async (id: string) => {
    if (!companyId) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyId}/hr/advance-rules/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
        },
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      await fetchAdvanceRules();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvances();
    fetchAdvanceRules();
  }, [companyId]);

  return {
    advances,
    advanceRules,
    loading,
    error,
    fetchAdvances,
    fetchAdvanceRules,
    createAdvance,
    updateAdvance,
    deleteAdvance,
    createAdvanceRule,
    updateAdvanceRule,
    deleteAdvanceRule,
  };
}
