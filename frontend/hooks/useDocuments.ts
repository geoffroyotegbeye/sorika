'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type { EmployeeDocument, CreateEmployeeDocumentDto } from '@/types/hr-extended';

interface UseDocumentsState {
  documents: EmployeeDocument[];
  loading: boolean;
  error: string | null;
}

export function useDocuments(companyId: string, employeeId: string) {
  const [state, setState] = useState<UseDocumentsState>({
    documents: [],
    loading: false,
    error: null,
  });

  const fetchDocuments = useCallback(async () => {
    if (!employeeId) return;
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await api.get<EmployeeDocument[]>(`/companies/${companyId}/hr/employees/${employeeId}/documents`);
      setState({ documents: data, loading: false, error: null });
    } catch (err: any) {
      setState((prev) => ({ ...prev, loading: false, error: err.message || 'Erreur lors du chargement' }));
    }
  }, [companyId, employeeId]);

  const createDocument = useCallback(async (dto: CreateEmployeeDocumentDto) => {
    await api.post(`/companies/${companyId}/hr/employees/${employeeId}/documents`, dto);
    await fetchDocuments();
  }, [companyId, employeeId, fetchDocuments]);

  const deleteDocument = useCallback(async (documentId: string) => {
    await api.del(`/companies/${companyId}/hr/documents/${documentId}`);
    await fetchDocuments();
  }, [companyId, fetchDocuments]);

  return {
    ...state,
    fetchDocuments,
    createDocument,
    deleteDocument,
  };
}
