'use client';

import { use, useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useLeaves } from '@/hooks/useLeaves';
import { useHR } from '@/hooks/useHR';
import { LeavesList } from '@/components/hr/LeavesList';
import { LeaveFormDialog } from '@/components/hr/LeaveFormDialog';
import { DateRangeFilter, type DateRange } from '@/components/ui/date-range-filter';
import { PageHeader } from '@/components/layout/PageHeader';

export default function LeavesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [company, setCompany] = useState<any>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [publicHolidays, setPublicHolidays] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return;
    const parsed = JSON.parse(userData);
    const currentCompany = parsed.companies?.find((c: any) => c.slug === slug);
    setCompany(currentCompany ?? null);
  }, [slug]);

  const {
    leaves,
    leaveTypes,
    loading,
    fetchLeaveTypes,
    fetchLeaves,
    createLeave,
    updateLeaveStatus,
    deleteLeave,
  } = useLeaves(company?.id ?? '');

  const { employees, fetchEmployees } = useHR(company?.id ?? '');

  useEffect(() => {
    if (company?.id) {
      fetchLeaveTypes();
      fetchLeaves();
      fetchEmployees();
      fetchPublicHolidays();
    }
  }, [company?.id, fetchLeaveTypes, fetchLeaves, fetchEmployees]);

  const fetchPublicHolidays = async () => {
    if (!company?.id) return;
    
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const currentYear = new Date().getFullYear();
      const res = await fetch(
        `http://localhost:3001/companies/${company.id}/public-holidays?year=${currentYear}`,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'x-user-id': parsed.user.id,
          } 
        }
      );

      if (res.ok) {
        const data = await res.json();
        // Extraire uniquement les dates au format ISO
        const dates = data.map((h: any) => h.date.split('T')[0]);
        setPublicHolidays(dates);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des jours fériés:', err);
    }
  };

  const handleApprove = async (leaveId: string) => {
    try {
      await updateLeaveStatus(leaveId, { status: 'APPROVED' });
      toast.success('Congé approuvé');
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'approbation');
    }
  };

  const handleReject = async (leaveId: string) => {
    try {
      await updateLeaveStatus(leaveId, { status: 'REJECTED' });
      toast.success('Congé rejeté');
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors du rejet');
    }
  };

  const handleDelete = async (leaveId: string) => {
    try {
      await deleteLeave(leaveId);
      toast.success('Demande supprimée');
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la suppression');
    }
  };

  // useMemo AVANT le return conditionnel — règles des hooks
  const filteredLeaves = useMemo(() => {
    if (!dateRange) return leaves;
    return leaves.filter(l => {
      const d = l.startDate.split('T')[0];
      return d >= dateRange.from && d <= dateRange.to;
    });
  }, [leaves, dateRange]);

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
        title="Congés"
        description="Gestion des demandes de congés"
        breadcrumbs={[
          { label: 'RH', href: `/dashboard/${slug}/hr` },
          { label: 'Congés' },
        ]}
        actions={
          <>
            <DateRangeFilter value={dateRange} onChange={setDateRange} />
            <Button onClick={() => setFormOpen(true)}>
              <Calendar className="h-4 w-4 mr-2" />
              Nouvelle demande
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
        <LeavesList
          leaves={filteredLeaves}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
        />
      )}

      {/* Form Dialog */}
      <LeaveFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        employees={employees}
        leaveTypes={leaveTypes}
        publicHolidays={publicHolidays}
        onCreate={createLeave}
      />
    </div>
  );
}
