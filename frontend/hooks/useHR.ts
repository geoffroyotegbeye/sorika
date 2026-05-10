'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type {
  Employee,
  Department,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from '@/types/hr';

interface UseHRState {
  employees: Employee[];
  departments: Department[];
  loading: boolean;
  error: string | null;
}

export function useHR(companyId: string) {
  const [state, setState] = useState<UseHRState>({
    employees: [],
    departments: [],
    loading: false,
    error: null,
  });

  // ─── Employees ───────────────────────────────────────────────────────────────

  const fetchEmployees = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await api.get<Employee[]>(`/companies/${companyId}/hr/employees`);
      setState((prev) => ({ ...prev, employees: data, loading: false }));
    } catch (err: any) {
      setState((prev) => ({ ...prev, loading: false, error: err.message || 'Erreur lors du chargement' }));
    }
  }, [companyId]);

  const createEmployee = useCallback(async (dto: CreateEmployeeDto) => {
    await api.post(`/companies/${companyId}/hr/employees`, dto);
    await fetchEmployees();
  }, [companyId, fetchEmployees]);

  const updateEmployee = useCallback(async (employeeId: string, dto: UpdateEmployeeDto) => {
    await api.patch(`/companies/${companyId}/hr/employees/${employeeId}`, dto);
    await fetchEmployees();
  }, [companyId, fetchEmployees]);

  const deleteEmployee = useCallback(async (employeeId: string) => {
    await api.del(`/companies/${companyId}/hr/employees/${employeeId}`);
    await fetchEmployees();
  }, [companyId, fetchEmployees]);

  const linkEmployeeToUser = useCallback(async (employeeId: string, userId: string) => {
    await api.patch(`/companies/${companyId}/hr/employees/${employeeId}/link-user`, { userId });
    await fetchEmployees();
  }, [companyId, fetchEmployees]);

  // ─── Departments ─────────────────────────────────────────────────────────────

  const fetchDepartments = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await api.get<Department[]>(`/companies/${companyId}/hr/departments`);
      setState((prev) => ({ ...prev, departments: data, loading: false }));
    } catch (err: any) {
      setState((prev) => ({ ...prev, loading: false, error: err.message || 'Erreur lors du chargement' }));
    }
  }, [companyId]);

  const createDepartment = useCallback(async (dto: CreateDepartmentDto) => {
    await api.post(`/companies/${companyId}/hr/departments`, dto);
    await fetchDepartments();
  }, [companyId, fetchDepartments]);

  const updateDepartment = useCallback(async (departmentId: string, dto: UpdateDepartmentDto) => {
    await api.patch(`/companies/${companyId}/hr/departments/${departmentId}`, dto);
    await fetchDepartments();
  }, [companyId, fetchDepartments]);

  const deleteDepartment = useCallback(async (departmentId: string) => {
    await api.del(`/companies/${companyId}/hr/departments/${departmentId}`);
    await fetchDepartments();
  }, [companyId, fetchDepartments]);

  return {
    ...state,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    linkEmployeeToUser,
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  };
}
