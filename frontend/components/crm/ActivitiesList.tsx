'use client';

import { useEffect, useState, useMemo } from 'react';
import { Activity, ActivityType, ActivityStatus } from '@/types/crm';
import { useCRMActivities } from '@/hooks/useCRMActivities';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pencil,
  Trash2,
  CheckCircle,
  Phone,
  Mail,
  Calendar,
  ClipboardList,
  FileText,
} from 'lucide-react';
import { ActivityFormDialog } from './ActivityFormDialog';
import { DataGrid } from '@/components/data-grid';
import type { DataGridColumn } from '@/components/data-grid';
import { DateRangeFilter, type DateRange } from '@/components/ui/date-range-filter';

interface ActivitiesListProps {
  companyId: string;
}

const typeIcons: Record<ActivityType, React.ElementType> = {
  CALL: Phone,
  EMAIL: Mail,
  MEETING: Calendar,
  TASK: ClipboardList,
  NOTE: FileText,
};

const typeLabels: Record<ActivityType, string> = {
  CALL: 'Appel',
  EMAIL: 'Email',
  MEETING: 'Réunion',
  TASK: 'Tâche',
  NOTE: 'Note',
};

const statusColors: Record<ActivityStatus, string> = {
  PLANNED: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const statusLabels: Record<ActivityStatus, string> = {
  PLANNED: 'Planifiée',
  COMPLETED: 'Complétée',
  CANCELLED: 'Annulée',
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('fr-FR');
};

export function ActivitiesList({ companyId }: ActivitiesListProps) {
  const { activities, loading, fetchActivities, deleteActivity, completeActivity } =
    useCRMActivities(companyId);
  const [typeFilter, setTypeFilter] = useState<ActivityType | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<ActivityStatus | 'ALL'>('ALL');
  const [dateRange, setDateRange] = useState<DateRange>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const filters: any = {};
    if (typeFilter !== 'ALL') filters.type = typeFilter;
    if (statusFilter !== 'ALL') filters.status = statusFilter;
    fetchActivities(filters);
  }, [typeFilter, statusFilter, fetchActivities]);

  const handleDelete = async (activityId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette activité ?')) {
      await deleteActivity(activityId);
    }
  };

  const handleComplete = async (activityId: string) => {
    await completeActivity(activityId);
    fetchActivities();
  };

  const handleEdit = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedActivity(null);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedActivity(null);
    fetchActivities();
  };

  const filteredActivities = useMemo(() => {
    if (!dateRange) return activities;
    return activities.filter(a => {
      const d = (a.dueDate ?? a.createdAt)?.split('T')[0];
      if (!d) return true;
      return d >= dateRange.from && d <= dateRange.to;
    });
  }, [activities, dateRange]);

  const columns: DataGridColumn<Activity>[] = [
    {
      key: 'type',
      header: 'Type',
      render: (val) => {
        const Icon = typeIcons[val as ActivityType];
        return (
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-slate-400" />
            <span className="text-sm">{typeLabels[val as ActivityType]}</span>
          </div>
        );
      },
    },
    {
      key: 'subject',
      header: 'Sujet',
      render: (val) => <span className="font-medium">{val as string}</span>,
    },
    {
      key: 'contact',
      header: 'Contact / Entreprise',
      sortable: false,
      render: (_, row) => (
        <div className="text-sm">
          {row.contact && (
            <div>
              {row.contact.firstName} {row.contact.lastName}
            </div>
          )}
          {row.company && (
            <div className="text-slate-500">{row.company.name}</div>
          )}
          {!row.contact && !row.company && <span className="text-slate-400">—</span>}
        </div>
      ),
    },
    {
      key: 'dueDate',
      header: "Date d'échéance",
      render: (val) => <span>{formatDate(val as string | undefined)}</span>,
    },
    {
      key: 'status',
      header: 'Statut',
      render: (val) => (
        <Badge className={statusColors[val as ActivityStatus]}>
          {statusLabels[val as ActivityStatus]}
        </Badge>
      ),
    },
    {
      key: 'owner',
      header: 'Propriétaire',
      sortable: false,
      render: (_, row) =>
        row.owner
          ? `${row.owner.firstName || ''} ${row.owner.lastName || ''}`.trim() || row.owner.email
          : '—',
    },
    {
      key: 'id',
      header: 'Actions',
      sortable: false,
      searchable: false,
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2">
          {row.status === 'PLANNED' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleComplete(row.id)}
              title="Marquer comme complétée"
            >
              <CheckCircle className="h-4 w-4 text-green-500" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataGrid
        data={filteredActivities}
        columns={columns}
        loading={loading}
        searchPlaceholder="Rechercher une activité..."
        emptyMessage="Aucune activité trouvée"
        toolbar={
          <div className="flex flex-wrap items-center gap-2">
            <DateRangeFilter value={dateRange} onChange={setDateRange} />
            <Select
              value={typeFilter}
              onValueChange={(v) => setTypeFilter(v as ActivityType | 'ALL')}
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tous les types</SelectItem>
                <SelectItem value="CALL">Appel</SelectItem>
                <SelectItem value="EMAIL">Email</SelectItem>
                <SelectItem value="MEETING">Réunion</SelectItem>
                <SelectItem value="TASK">Tâche</SelectItem>
                <SelectItem value="NOTE">Note</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as ActivityStatus | 'ALL')}
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tous les statuts</SelectItem>
                <SelectItem value="PLANNED">Planifiée</SelectItem>
                <SelectItem value="COMPLETED">Complétée</SelectItem>
                <SelectItem value="CANCELLED">Annulée</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleCreate}>Nouvelle activité</Button>
          </div>
        }
      />

      <ActivityFormDialog
        companyId={companyId}
        activity={selectedActivity}
        open={isDialogOpen}
        onClose={handleDialogClose}
      />
    </>
  );
}
