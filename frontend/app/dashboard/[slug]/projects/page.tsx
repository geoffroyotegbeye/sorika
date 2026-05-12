'use client';

import { use, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Briefcase,
  ListChecks,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Plus,
} from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { ProjectFormDialog } from '@/components/projects/ProjectFormDialog';
import { toast } from 'sonner';
import type { Project } from '@/types/projects';
import { useRouter } from 'next/navigation';

export default function ProjectsDashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const [companyId, setCompanyId] = useState('');
  const { stats, projects, loading, fetchStats, fetchProjects, createProject } =
    useProjects(companyId);
  const [dialogOpen, setDialogOpen] = useState(false);

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
      fetchStats();
      fetchProjects();
    }
  }, [companyId, fetchStats, fetchProjects]);

  const handleCreateProject = async (data: Partial<Project>) => {
    try {
      await createProject(data);
      toast.success('Projet créé avec succès');
      setDialogOpen(false);
    } catch (error) {
      toast.error('Une erreur est survenue');
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  const activeProjects = projects.filter((p) => p.status === 'IN_PROGRESS');

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projets</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Vue d'ensemble de vos projets et tâches
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau projet
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Projets actifs
            </CardTitle>
            <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Briefcase className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.activeProjects}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Sur {stats.totalProjects} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tâches
            </CardTitle>
            <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <ListChecks className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.completedTasks}/{stats.totalTasks}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.totalTasks > 0
                ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
                : 0}
              % terminées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Temps total
            </CardTitle>
            <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {Math.round(stats.totalTimeLogged)}h
            </div>
            <p className="text-xs text-muted-foreground mt-1">Temps enregistré</p>
          </CardContent>
        </Card>
      </div>

      {/* Projets actifs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-foreground">
              Projets en cours
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/dashboard/${slug}/projects/list`)}
            >
              Voir tous
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {activeProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                Aucun projet actif
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Créez un nouveau projet pour commencer
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Créer un projet
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {activeProjects.slice(0, 5).map((project) => {
                const priorityColors = {
                  LOW: 'bg-muted text-foreground',
                  MEDIUM: 'bg-blue-100 text-blue-700',
                  HIGH: 'bg-orange-100 text-orange-700',
                  URGENT: 'bg-red-100 text-red-700',
                };

                return (
                  <div
                    key={project.id}
                    onClick={() =>
                      router.push(`/dashboard/${slug}/projects/list`)
                    }
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/40 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Briefcase className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">
                            {project.name}
                          </h3>
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${priorityColors[project.priority]}`}
                          >
                            {project.priority}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {project.description || 'Aucune description'}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <ListChecks className="h-3 w-3" />
                            {project._count?.tasks || 0} tâches
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {project.progress}% complété
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Barre de progression */}
                    <div className="w-32 ml-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">
                          Progression
                        </span>
                        <span className="text-xs font-semibold text-foreground">
                          {project.progress}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistiques par statut */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                En attente
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {projects.filter((p) => p.status === 'PENDING').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                En pause
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {projects.filter((p) => p.status === 'ON_HOLD').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Terminés
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.completedProjects}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Annulés
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {projects.filter((p) => p.status === 'CANCELLED').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog */}
      <ProjectFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreateProject}
        project={null}
      />
    </div>
  );
}
