'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LayoutDashboard, Calendar, User } from 'lucide-react';
import type { Task } from '@/types/projects';

interface TaskKanbanViewProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  getPriorityColor: (priority: string) => string;
}

const COLUMNS = [
  { id: 'TODO', title: 'À faire', color: 'bg-muted text-foreground' },
  {
    id: 'IN_PROGRESS',
    title: 'En cours',
    color: 'bg-blue-100 text-blue-900 dark:bg-blue-950/50 dark:text-blue-100',
  },
  {
    id: 'IN_REVIEW',
    title: 'En révision',
    color: 'bg-purple-100 text-purple-900 dark:bg-purple-950/50 dark:text-purple-100',
  },
  {
    id: 'DONE',
    title: 'Terminé',
    color: 'bg-green-100 text-green-900 dark:bg-green-950/45 dark:text-green-100',
  },
];

export function TaskKanbanView({
  tasks,
  onTaskClick,
  getPriorityColor,
}: TaskKanbanViewProps) {
  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {COLUMNS.map((column) => {
        const columnTasks = getTasksByStatus(column.id);
        return (
          <Card key={column.id} className="border border-border">
            <CardHeader className={`${column.color} pb-3`}>
              <CardTitle className="flex items-center justify-between text-sm font-semibold">
                <span>{column.title}</span>
                <span className="text-xs font-normal opacity-70">
                  {columnTasks.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {columnTasks.length === 0 ? (
                <div className="text-center py-8">
                  <LayoutDashboard className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Aucune tâche</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => onTaskClick?.(task)}
                      className="cursor-pointer rounded-lg border border-border bg-card p-3 transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-semibold text-foreground line-clamp-2">
                          {task.title}
                        </h4>
                        <Badge
                          className={`${getPriorityColor(task.priority)} text-xs ml-2 shrink-0`}
                        >
                          {task.priority}
                        </Badge>
                      </div>
                      {task.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
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
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
