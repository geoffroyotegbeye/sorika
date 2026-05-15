import { useState, useCallback } from 'react';

interface FormulaVariable {
  id: string;
  name: string;
  code: string;
  type: 'FIXED' | 'PERCENTAGE' | 'FORMULA';
  value?: number;
  formula?: string;
  description?: string;
  positionId?: string;
  employeeId?: string;
  order?: number;
  dependsOn?: string[];
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export function usePayrollFormulas(companyId: string) {
  const [variables, setVariables] = useState<FormulaVariable[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVariables = useCallback(async () => {
    if (!companyId) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyId}/hr/payroll-variables`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
        },
      });
      
      if (!response.ok) throw new Error('Erreur lors du chargement des variables');
      const data = await response.json();
      setVariables(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const createVariable = async (dto: Partial<FormulaVariable>) => {
    if (!companyId) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyId}/hr/payroll-variables`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
        },
        body: JSON.stringify(dto),
      });
      
      if (!response.ok) throw new Error('Erreur lors de la création');
      await fetchVariables();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const updateVariable = async (id: string, dto: Partial<FormulaVariable>) => {
    if (!companyId) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyId}/hr/payroll-variables/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
        },
        body: JSON.stringify(dto),
      });
      
      if (!response.ok) throw new Error('Erreur lors de la mise à jour');
      await fetchVariables();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const deleteVariable = async (id: string) => {
    if (!companyId) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyId}/hr/payroll-variables/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
        },
      });
      
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      await fetchVariables();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const testFormula = async (formula: string, testData?: Record<string, number>) => {
    if (!companyId) return;
    
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyId}/hr/payroll-variables/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
        },
        body: JSON.stringify({ formula, testData }),
      });
      
      if (!response.ok) throw new Error('Erreur lors du test');
      const data = await response.json();
      return data.result;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erreur inconnue');
    }
  };

  return {
    variables,
    loading,
    error,
    fetchVariables,
    createVariable,
    updateVariable,
    deleteVariable,
    testFormula,
  };
}
