'use client';

import { use, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, Calendar, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useProjects } from '@/hooks/useProjects';
import type { Task } from '@/types/projects';

export default function KanbanPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [companyId, setCompanyId] = useState('');
  const { projects, tasks, loading, fetchProjects, fetchTasks } =
    useProjects(companyId);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return;
    const parsed = JSON.parse(userData);
    const company = parsed.companies?.find((c: any) => c.slug === slug);
    if (company) {
      setCompanyId(company.id);
    }
  }, [slug]);

  useEffect(() => {
    if (companyId) {
      fetchProjects();
    }
  }, [companyId, fetchProjects]);

  useEffect(() => {
    if (companyId && projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [companyId, projects, selectedProjectId]);

  useEffect(() => {
    if (companyId && selectedProjectId) {
      fetchTasks(selectedProjectId);
    }
  }, [companyId, selectedProjectId, fetchTasks]);

  const columns = [
    { id: 'TODO', title: 'À faire', color: 'bg-slate-100' },
    { id: 'IN_PROGRESS', title: 'En cours', color: 'bg-blue-100' },
    { id: 'IN_REVIEW', title: 'En révision', color: 'bg-purple-100' },
    { id: 'DONE', title: 'Terminé', color: 'bg-green-100' },
  ];

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      LOW: 'bg-slate-100 text-slate-700',
      MEDIUM: 'bg-blue-100 text-blue-700',
      HIGH: 'bg-orange-100 text-orange-700',
      URGENT: 'bg-red-100 text-red-700',
    };
    return colors[priority] || 'bg-slate-100 text-slate-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Kanban</h1>
        <p className="text-sm text-slate-500 mt-1">
          Vue Kanban de vos tâches
        </p>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-4 gap-4">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          return (
            <Card key={column.id} className="border border-slate-200">
              <CardHeader className={`${column.color} pb-3`}>
                <CardTitle className="text-sm font-semibold text-slate-900 flex items-center justify-between">
                  <span>{column.title}</span>
                  <span className="text-xs font-normal text-slate-600">
                    {columnTasks.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {columnTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <LayoutDashboard className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">Aucune tâche</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {columnTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-3 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-sm font-semibold text-slate-900 line-clamp-2">
                            {task.title}
                          </h4>
                          <Badge
                            className={`${getPriorityColor(task.priority)} text-xs`}
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        {task.description && (
                          <p className="text-xs text-slate-600 line-clamp-2 mb-2">
                            {task.description}
                          </p>
                        )}
                        <div className="flex flex-col gap-1 text-xs text-slate-500">
                          {task.dueDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(task.dueDate).toLocaleDateString(
                                'fr-FR',
                              )}
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
    </div>
  );
}
