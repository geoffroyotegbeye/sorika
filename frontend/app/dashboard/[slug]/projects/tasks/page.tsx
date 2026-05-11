'use client';

import { use, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ListChecks, Edit, Trash2, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProjects } from '@/hooks/useProjects';
import { TaskFormDialog } from '@/components/projects/TaskFormDialog';
import type { Task } from '@/types/projects';
import { toast } from 'sonner';

export default function TasksPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [companyId, setCompanyId] = useState('');
  const {
    projects,
    tasks,
    loading,
    fetchProjects,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  } = useProjects(companyId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
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

  const handleCreate = () => {
    setEditTask(null);
    setDialogOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditTask(task);
    setDialogOpen(true);
  };

  const handleSubmit = async (projectId: string, data: Partial<Task>) => {
    try {
      if (editTask) {
        await updateTask(projectId, editTask.id, data);
        toast.success('Tâche modifiée avec succès');
      } else {
        await createTask(projectId, data);
        toast.success('Tâche créée avec succès');
      }
      setDialogOpen(false);
    } catch (error) {
      toast.error('Une erreur est survenue');
    }
  };

  const handleDelete = async (task: Task) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) return;
    try {
      await deleteTask(task.projectId, task.id);
      toast.success('Tâche supprimée avec succès');
    } catch (error) {
      toast.error('Une erreur est survenue');
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      TODO: 'À faire',
      IN_PROGRESS: 'En cours',
      IN_REVIEW: 'En révision',
      DONE: 'Terminé',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      TODO: 'bg-slate-100 text-slate-700',
      IN_PROGRESS: 'bg-blue-100 text-blue-700',
      IN_REVIEW: 'bg-purple-100 text-purple-700',
      DONE: 'bg-green-100 text-green-700',
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Toutes les tâches</h1>
          <p className="text-sm text-slate-500 mt-1">
            {tasks.length} tâche{tasks.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={handleCreate} className="cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle tâche
        </Button>
      </div>

      {/* Contenu */}
      <Card>
        <CardHeader>
          <CardTitle>Tâches</CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ListChecks className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-900 mb-1">
                Aucune tâche
              </p>
              <p className="text-xs text-slate-500 mb-4">
                Créez votre première tâche pour commencer
              </p>
              <Button onClick={handleCreate} className="cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                Créer une tâche
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">
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
                        <p className="text-sm text-slate-600 line-clamp-1">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-slate-500">
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
                      onClick={() => handleEdit(task)}
                      className="h-8 w-8 p-0 cursor-pointer"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(task)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog */}
      <TaskFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        task={editTask}
        projects={projects}
      />
    </div>
  );
}
