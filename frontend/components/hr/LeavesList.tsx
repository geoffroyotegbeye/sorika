'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Trash2 } from 'lucide-react';
import { DataGrid } from '@/components/data-grid';
import type { DataGridColumn } from '@/components/data-grid';
import type { Leave } from '@/types/hr-extended';

interface LeavesListProps {
  leaves: Leave[];
  onApprove: (leaveId: string) => void;
  onReject: (leaveId: string) => void;
  onDelete: (leaveId: string) => void;
}

const STATUS_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'En attente' },
  APPROVED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approuvé' },
  REJECTED: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejeté' },
  CANCELLED: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Annulé' },
};

export function LeavesList({ leaves, onApprove, onReject, onDelete }: LeavesListProps) {
  const columns: DataGridColumn<Leave>[] = [
    {
      key: 'employee',
      header: 'Employé',
      render: (_, row) => (
        <p className="font-medium text-slate-800">
          {row.employee ? `${row.employee.firstName} ${row.employee.lastName}` : 'Inconnu'}
        </p>
      ),
    },
    {
      key: 'leaveType',
      header: 'Type',
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: row.leaveType?.color }} />
          <span className="text-sm text-slate-600">{row.leaveType?.name}</span>
        </div>
      ),
    },
    {
      key: 'startDate',
      header: 'Période',
      render: (_, row) => (
        <span className="text-slate-600">
          {new Date(row.startDate).toLocaleDateString('fr-FR')} –{' '}
          {new Date(row.endDate).toLocaleDateString('fr-FR')}
        </span>
      ),
    },
    {
      key: 'days',
      header: 'Jours',
      render: (val) => <span className="font-medium text-slate-800">{val as number}</span>,
    },
    {
      key: 'status',
      header: 'Statut',
      render: (val) => {
        const s = STATUS_BADGE[val as string];
        return <Badge className={`${s.bg} ${s.text}`}>{s.label}</Badge>;
      },
    },
    {
      key: 'id',
      header: 'Actions',
      sortable: false,
      searchable: false,
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2">
          {row.status === 'PENDING' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onApprove(row.id)}
                className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                title="Approuver"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReject(row.id)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                title="Rejeter"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
          {row.status !== 'APPROVED' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(row.id)}
              className="h-8 w-8 p-0 text-slate-600 hover:text-slate-700 hover:bg-slate-50"
              title="Supprimer"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataGrid
      data={leaves}
      columns={columns}
      searchPlaceholder="Rechercher un congé..."
      emptyMessage="Aucune demande de congé"
    />
  );
}
