'use client';

import { use, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ListChecks, LayoutGrid, List } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProjects } from '@/hooks/useProjects';
import { TaskFormDialog } from '@/components/projects/TaskFormDialog';
import { PageHeader } from '@/components/layout/PageHeader';
import { TaskListView } from '@/components/projects/TaskListView';
import { TaskKanbanView } from '@/components/projects/TaskKanbanView';
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
    fetchAllTasks,
    createTask,
    updateTask,
    deleteTask,
  } = useProjects(companyId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');

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
      fetchAllTasks();
    }
  }, [companyId, fetchProjects, fetchAllTasks]);

  const handleCreate = () => {
    if (projects.length === 0) {
      toast.error('Créez d\'abord un projet avant d\'ajouter des tâches');
      return;
    }
    setEditTask(null);
    setDialogOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditTask(task);
    setDialogOpen(true);
  };

  const handleSubmit = async (projectId: string, data: Partial<Task>) => {
    console.log('Submitting task:', { projectId, data, companyId });
    try {
      if (editTask) {
        await updateTask(projectId, editTask.id, data);
        toast.success('Tâche modifiée avec succès');
      } else {
        await createTask(projectId, data);
        toast.success('Tâche créée avec succès');
      }
      setDialogOpen(false);
      fetchAllTasks(); // Rafraîchir toutes les tâches
    } catch (error: any) {
      console.error('Error submitting task:', error);
      toast.error(error?.message || 'Une erreur est survenue');
    }
  };

  const handleDelete = async (task: Task) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) return;
    try {
      await deleteTask(task.projectId, task.id);
      toast.success('Tâche supprimée avec succès');
      fetchAllTasks(); // Rafraîchir toutes les tâches
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
      TODO: 'bg-muted text-foreground',
      IN_PROGRESS:
        'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-200',
      IN_REVIEW:
        'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-200',
      DONE:
        'bg-green-100 text-green-800 dark:bg-green-950/45 dark:text-green-200',
    };
    return colors[status] || 'bg-muted text-foreground';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      LOW: 'bg-muted text-foreground',
      MEDIUM:
        'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-200',
      HIGH:
        'bg-orange-100 text-orange-800 dark:bg-orange-950/45 dark:text-orange-200',
      URGENT:
        'bg-red-100 text-red-800 dark:bg-red-950/45 dark:text-red-200',
    };
    return colors[priority] || 'bg-muted text-foreground';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tâches"
        description={`${tasks.length} tâche${tasks.length > 1 ? 's' : ''}`}
        breadcrumbs={[
          { label: 'Projets', href: `/dashboard/${slug}/projects` },
          { label: 'Tâches' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            {/* Sélecteur de vue */}
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'list' | 'kanban')}>
              <TabsList>
                <TabsTrigger value="list" className="gap-2">
                  <List className="h-4 w-4" />
                  Liste
                </TabsTrigger>
                <TabsTrigger value="kanban" className="gap-2">
                  <LayoutGrid className="h-4 w-4" />
                  Kanban
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button onClick={handleCreate} className="cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle tâche
            </Button>
          </div>
        }
      />

      {/* Contenu */}
      {tasks.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <ListChecks className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                Aucune tâche
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Créez votre première tâche pour commencer
              </p>
              <Button onClick={handleCreate} className="cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                Créer une tâche
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {viewMode === 'list' && (
            <TaskListView
              tasks={tasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
              getStatusLabel={getStatusLabel}
              getStatusColor={getStatusColor}
              getPriorityColor={getPriorityColor}
            />
          )}

          {viewMode === 'kanban' && (
            <TaskKanbanView
              tasks={tasks}
              onTaskClick={handleEdit}
              getPriorityColor={getPriorityColor}
            />
          )}
        </>
      )}

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
