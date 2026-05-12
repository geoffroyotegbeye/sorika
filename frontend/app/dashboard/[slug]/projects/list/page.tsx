'use client';

import { use, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Briefcase, Calendar, Users } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import type { Project } from '@/types/projects';
import { Badge } from '@/components/ui/badge';
import { ProjectFormDialog } from '@/components/projects/ProjectFormDialog';
import { toast } from 'sonner';

export default function ProjectsListPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [companyId, setCompanyId] = useState('');
  const { projects, loading, fetchProjects, createProject, updateProject } =
    useProjects(companyId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);

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

  const handleCreate = () => {
    setEditProject(null);
    setDialogOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditProject(project);
    setDialogOpen(true);
  };

  const handleSubmit = async (data: Partial<Project>) => {
    try {
      if (editProject) {
        await updateProject(editProject.id, data);
        toast.success('Projet modifié avec succès');
      } else {
        await createProject(data);
        toast.success('Projet créé avec succès');
      }
      setDialogOpen(false);
    } catch (error) {
      toast.error('Une erreur est survenue');
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: 'En attente',
      IN_PROGRESS: 'En cours',
      ON_HOLD: 'En pause',
      COMPLETED: 'Terminé',
      CANCELLED: 'Annulé',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-muted text-foreground',
      IN_PROGRESS:
        'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-200',
      ON_HOLD:
        'bg-orange-100 text-orange-800 dark:bg-orange-950/45 dark:text-orange-200',
      COMPLETED:
        'bg-green-100 text-green-800 dark:bg-green-950/45 dark:text-green-200',
      CANCELLED:
        'bg-red-100 text-red-800 dark:bg-red-950/45 dark:text-red-200',
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
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tous les projets</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {projects.length} projet{projects.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau projet
        </Button>
      </div>

      {/* Liste des projets */}
      {projects.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">
            Aucun projet
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            Créez votre premier projet pour commencer
          </p>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Créer un projet
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleEdit(project)}
              className="cursor-pointer rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-md"
            >
              {/* En-tête */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(project.status)}>
                    {getStatusLabel(project.status)}
                  </Badge>
                  <Badge className={getPriorityColor(project.priority)}>
                    {project.priority}
                  </Badge>
                </div>
              </div>

              {/* Titre et description */}
              <h3 className="font-semibold text-foreground mb-1">
                {project.name}
              </h3>
              {project.code && (
                <p className="text-xs text-muted-foreground mb-2">{project.code}</p>
              )}
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {project.description || 'Aucune description'}
              </p>

              {/* Progression */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Progression</span>
                  <span className="text-xs font-semibold text-foreground">
                    {project.progress}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Métadonnées */}
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {project._count?.members || 0} membres
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {project._count?.tasks || 0} tâches
                </div>
              </div>

              {/* Client */}
              {project.client && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">Client</p>
                  <p className="text-sm font-medium text-foreground">
                    {project.client.name}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Dialog */}
      <ProjectFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        project={editProject}
      />
    </div>
  );
}
