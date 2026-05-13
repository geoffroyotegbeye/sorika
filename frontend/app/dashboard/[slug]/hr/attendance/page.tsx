'use client';

import { use, useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAttendance } from '@/hooks/useAttendance';
import { AttendanceFormDialog } from '@/components/hr/AttendanceFormDialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { DataGrid } from '@/components/data-grid';
import type { DataGridColumn } from '@/components/data-grid';
import { DateRangeFilter, type DateRange } from '@/components/ui/date-range-filter';
import { formatJobPositionLabel } from '@/lib/hr-display';
import { PageHeader } from '@/components/layout/PageHeader';
import type { AttendanceStatus } from '@/types/attendance';

const STATUS_CONFIG: Record<AttendanceStatus, { bg: string; text: string; label: string }> = {
  PRESENT:  { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Présent' },
  ABSENT:   { bg: 'bg-red-100',    text: 'text-red-700',    label: 'Absent' },
  LATE:     { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Retard' },
  HALF_DAY: { bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'Demi-journée' },
  REMOTE:   { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Télétravail' },
};

export default function AttendancePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [company, setCompany] = useState<any>(null);
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const now = new Date();
    return {
      from: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0],
      to:   new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0],
    };
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [attendanceToDelete, setAttendanceToDelete] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return;
    const parsed = JSON.parse(userData);
    const currentCompany = parsed.companies?.find((c: any) => c.slug === slug);
    setCompany(currentCompany ?? null);
  }, [slug]);

  const { attendances, loading, fetchAttendances, deleteAttendance } = useAttendance(company?.id ?? '');

  useEffect(() => {
    if (company?.id && dateRange) {
      fetchAttendances(dateRange.from, dateRange.to);
    }
  }, [company?.id, dateRange, fetchAttendances]);

  const handleDelete = async (attendanceId: string) => {
    try {
      await deleteAttendance(attendanceId);
      toast.success('Pointage supprimé');
      setDeleteDialogOpen(false);
      setAttendanceToDelete(null);
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la suppression');
    }
  };

  if (!company) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  const columns: DataGridColumn<(typeof attendances)[0]>[] = [
    {
      key: 'employee',
      header: 'Employé',
      render: (_, row) => {
        const pos = formatJobPositionLabel(row.employee?.position);
        return (
          <div>
            <p className="font-medium text-foreground">
              {row.employee
                ? `${row.employee.firstName} ${row.employee.lastName}`
                : 'Inconnu'}
            </p>
            {pos ? <p className="text-xs text-muted-foreground">{pos}</p> : null}
          </div>
        );
      },
    },
    {
      key: 'date',
      header: 'Date',
      render: (val) => (
        <span className="text-foreground">
          {new Date(val as string).toLocaleDateString('fr-FR', {
            weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
          })}
        </span>
      ),
    },
    {
      key: 'hoursWorked',
      header: 'Heures',
      render: (val) => (
        <span className="font-medium text-foreground">
          {val ? `${(val as number).toFixed(1)}h` : '—'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Statut',
      render: (val) => {
        const s = STATUS_CONFIG[val as AttendanceStatus];
        return <Badge className={`${s.bg} ${s.text}`}>{s.label}</Badge>;
      },
    },
    {
      key: 'notes',
      header: 'Notes',
      sortable: false,
      render: (val) => (
        <span className="text-muted-foreground max-w-xs truncate block">{(val as string) || '—'}</span>
      ),
    },
    {
      key: 'id',
      header: 'Actions',
      sortable: false,
      searchable: false,
      render: (_, row) => (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setAttendanceToDelete(row.id); setDeleteDialogOpen(true); }}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Présences"
        description="Gestion des pointages et présences"
        breadcrumbs={[
          { label: 'RH', href: `/dashboard/${slug}/hr` },
          { label: 'Présences' },
        ]}
        actions={
          <>
            <DateRangeFilter value={dateRange} onChange={setDateRange} />
            <AttendanceFormDialog
              companyId={company.id}
              onSuccess={() => {
                if (dateRange) fetchAttendances(dateRange.from, dateRange.to);
              }}
            />
          </>
        }
      />
      <DataGrid
        data={attendances}
        columns={columns}
        loading={loading}
        searchPlaceholder="Rechercher..."
        emptyMessage="Aucun pointage pour cette période"
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => attendanceToDelete && handleDelete(attendanceToDelete)}
        title="Supprimer le pointage"
        description="Êtes-vous sûr de vouloir supprimer ce pointage ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
      />
    </div>
  );
}
