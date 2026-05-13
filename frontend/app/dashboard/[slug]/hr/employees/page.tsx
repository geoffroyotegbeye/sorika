'use client';

import { use, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { useHR } from '@/hooks/useHR';
import { usePositions } from '@/hooks/usePositions';
import { EmployeesList } from '@/components/hr/EmployeesList';
import { EmployeeFormDialog } from '@/components/hr/EmployeeFormDialogSteps';
import { ImportExportButtons } from '@/components/hr/ImportExportButtons';
import { PageHeader } from '@/components/layout/PageHeader';
import type { Employee } from '@/types/hr';

export default function EmployeesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [company, setCompany] = useState<any>(null);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return;
    const parsed = JSON.parse(userData);
    const currentCompany = parsed.companies?.find((c: any) => c.slug === slug);
    setCompany(currentCompany ?? null);
  }, [slug]);

  const {
    employees,
    departments,
    loading,
    fetchEmployees,
    fetchDepartments,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  } = useHR(company?.id ?? '');

  const { positions, fetchPositions } = usePositions(company?.id ?? '');

  useEffect(() => {
    if (company?.id) {
      fetchEmployees();
      fetchDepartments();
      fetchPositions();
    }
  }, [company?.id, fetchEmployees, fetchDepartments, fetchPositions]);

  const handleDelete = async (id: string) => {
    try {
      await deleteEmployee(id);
      toast.success('Employé supprimé');
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la suppression');
    }
  };

  const handleOpenCreate = () => {
    setEditEmployee(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (employee: Employee) => {
    setEditEmployee(employee);
    setFormOpen(true);
  };

  if (!company) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employés"
        description={`${employees.length} employé${employees.length > 1 ? 's' : ''}`}
        breadcrumbs={[
          { label: 'RH', href: `/dashboard/${slug}/hr` },
          { label: 'Employés' },
        ]}
        actions={
          <>
            <ImportExportButtons
              companyId={company.id}
              onImportComplete={() => {
                fetchEmployees();
                toast.success('Liste des employés actualisée');
              }}
            />
            <Button onClick={handleOpenCreate}>
              <UserPlus className="h-4 w-4 mr-2" />
              Ajouter un employé
            </Button>
          </>
        }
      />

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      )}

      {/* List */}
      {!loading && (
        <EmployeesList
          employees={employees}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Dialog */}
      <EmployeeFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditEmployee(null);
        }}
        employee={editEmployee}
        employees={employees}
        departments={departments}
        positions={positions}
        onCreate={createEmployee}
        onUpdate={updateEmployee}
      />
    </div>
  );
}
