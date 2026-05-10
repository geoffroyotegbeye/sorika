'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Leave, LeaveType, CreateLeaveDto, UpdateLeaveStatusDto } from '@/types/hr-extended';

interface UseLeavesState {
  leaves: Leave[];
  leaveTypes: LeaveType[];
  loading: boolean;
  error: string | null;
}

export function useLeaves(companyId: string) {
  const [state, setState] = useState<UseLeavesState>({
    leaves: [],
    leaveTypes: [],
    loading: false,
    error: null,
  });

  const fetchLeaveTypes = useCallback(async () => {
    try {
      const data = await api.get<LeaveType[]>(`/companies/${companyId}/hr/leave-types`);
      setState((prev) => ({ ...prev, leaveTypes: data }));
    } catch (err: any) {
      console.error('Error fetching leave types:', err);
    }
  }, [companyId]);

  const fetchLeaves = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await api.get<Leave[]>(`/companies/${companyId}/hr/leaves`);
      setState((prev) => ({ ...prev, leaves: data, loading: false, error: null }));
    } catch (err: any) {
      setState((prev) => ({ ...prev, loading: false, error: err.message || 'Erreur lors du chargement' }));
    }
  }, [companyId]);

  const createLeave = useCallback(async (employeeId: string, dto: CreateLeaveDto) => {
    await api.post(`/companies/${companyId}/hr/employees/${employeeId}/leaves`, dto);
    await fetchLeaves();
  }, [companyId, fetchLeaves]);

  const updateLeaveStatus = useCallback(async (leaveId: string, dto: UpdateLeaveStatusDto) => {
    await api.patch(`/companies/${companyId}/hr/leaves/${leaveId}/status`, dto);
    await fetchLeaves();
  }, [companyId, fetchLeaves]);

  const deleteLeave = useCallback(async (leaveId: string) => {
    await api.del(`/companies/${companyId}/hr/leaves/${leaveId}`);
    await fetchLeaves();
  }, [companyId, fetchLeaves]);

  return {
    ...state,
    fetchLeaveTypes,
    fetchLeaves,
    createLeave,
    updateLeaveStatus,
    deleteLeave,
  };
}
