'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Calendar, User } from 'lucide-react';
import type { Task } from '@/types/projects';

interface TaskListViewProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  getStatusLabel: (status: string) => string;
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
}

export function TaskListView({
  tasks,
  onEdit,
  onDelete,
  getStatusLabel,
  getStatusColor,
  getPriorityColor,
}: TaskListViewProps) {
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/40 transition-colors"
        >
          <div className="flex items-center gap-4 flex-1">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">
                  {task.title}
                </h3>
                <Badge className={getStatusColor(task.status)}>
                  {getStatusLabel(task.status)}
                </Badge>
                <Badge className={getPriorityColor(task.priority)}>
                  {task.priority}
                </Badge>
              </div>
              {task.description && (
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {task.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {task.dueDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                  </span>
                )}
                {task.assignee && (
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {task.assignee.firstName} {task.assignee.lastName}
                  </span>
                )}
                {task.estimatedHours && (
                  <span>Estimé: {task.estimatedHours}h</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
              className="h-8 w-8 p-0 cursor-pointer"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task)}
              className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300 cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
