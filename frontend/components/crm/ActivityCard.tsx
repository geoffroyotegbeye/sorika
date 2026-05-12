'use client';

import { Activity, ActivityType, ActivityStatus } from '@/types/crm';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, Calendar, ClipboardList, FileText, Clock } from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
  onClick?: () => void;
}

const typeIcons: Record<ActivityType, any> = {
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

export function ActivityCard({ activity, onClick }: ActivityCardProps) {
  const Icon = typeIcons[activity.type];

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{typeLabels[activity.type]}</span>
          </div>
          <Badge className={statusColors[activity.status]}>
            {statusLabels[activity.status]}
          </Badge>
        </div>

        <h4 className="font-medium text-sm">{activity.subject}</h4>

        {activity.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {activity.description}
          </p>
        )}

        {activity.dueDate && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(activity.dueDate)}</span>
          </div>
        )}

        {activity.duration && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{activity.duration} min</span>
          </div>
        )}

        {(activity.contact || activity.company) && (
          <div className="border-t border-border pt-1 text-xs text-muted-foreground">
            {activity.contact && (
              <div>
                {activity.contact.firstName} {activity.contact.lastName}
              </div>
            )}
            {activity.company && <div>{activity.company.name}</div>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
