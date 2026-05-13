'use client';

import { useParams } from 'next/navigation';
import { ActivitiesList } from '@/components/crm/ActivitiesList';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Activity } from '@/types/crm';
import { ActivityFormDialog } from '@/components/crm/ActivityFormDialog';
import { ActivityType, ActivityStatus } from '@/types/crm';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateRangeFilter, type DateRange } from '@/components/ui/date-range-filter';

export default function ActivitiesPage() {
  const params = useParams();
  const companyId = params.slug as string;
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<ActivityType | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<ActivityStatus | 'ALL'>('ALL');
  const [dateRange, setDateRange] = useState<DateRange>(null);

  const handleCreate = () => {
    setSelectedActivity(null);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedActivity(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activités"
        description="Suivez vos appels, emails et rendez-vous"
        breadcrumbs={[
          { label: 'CRM', href: `/dashboard/${companyId}/crm` },
          { label: 'Activités' },
        ]}
        actions={
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
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle activité
            </Button>
          </div>
        }
      />
      <ActivitiesList 
        companyId={companyId} 
        typeFilter={typeFilter} 
        statusFilter={statusFilter} 
        dateRange={dateRange}
        onCreate={handleCreate} 
      />
      <ActivityFormDialog
        companyId={companyId}
        activity={selectedActivity}
        open={isDialogOpen}
        onClose={handleDialogClose}
      />
    </div>
  );
}
