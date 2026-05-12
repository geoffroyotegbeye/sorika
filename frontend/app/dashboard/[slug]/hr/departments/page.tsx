'use client';

import { use, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { useHR } from '@/hooks/useHR';
import { DepartmentsList } from '@/components/hr/DepartmentsList';
import { DepartmentFormDialog } from '@/components/hr/DepartmentFormDialog';
import type { Department } from '@/types/hr';

export default function DepartmentsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [company, setCompany] = useState<any>(null);
  const [editDepartment, setEditDepartment] = useState<Department | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return;
    const parsed = JSON.parse(userData);
    const currentCompany = parsed.companies?.find((c: any) => c.slug === slug);
    setCompany(currentCompany ?? null);
  }, [slug]);

  const {
    departments,
    loading,
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  } = useHR(company?.id ?? '');

  useEffect(() => {
    if (company?.id) {
      fetchDepartments();
    }
  }, [company?.id]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDepartment(id);
      toast.success('Département supprimé');
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la suppression');
    }
  };

  const handleOpenCreate = () => {
    setEditDepartment(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (department: Department) => {
    setEditDepartment(department);
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Départements</h1>
        <Button onClick={handleOpenCreate}>
          <Building2 className="h-4 w-4 mr-2" />
          Ajouter un département
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      )}

      {/* List */}
      {!loading && (
        <DepartmentsList
          departments={departments}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Dialog */}
      <DepartmentFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditDepartment(null);
        }}
        department={editDepartment}
        onCreate={createDepartment}
        onUpdate={updateDepartment}
      />
    </div>
  );
}
