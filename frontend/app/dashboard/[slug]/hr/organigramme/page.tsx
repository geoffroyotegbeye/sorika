'use client';

import { use, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useHR } from '@/hooks/useHR';
import { Users, User, ChevronDown, ChevronRight } from 'lucide-react';
import type { Employee } from '@/types/hr';

interface TeamNode {
  manager: Employee;
  subordinates: Employee[];
}

export default function OrganigrammePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [company, setCompany] = useState<any>(null);
  const [expandedManagers, setExpandedManagers] = useState<Set<string>>(new Set());

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return;
    const parsed = JSON.parse(userData);
    const currentCompany = parsed.companies?.find((c: any) => c.slug === slug);
    setCompany(currentCompany ?? null);
  }, [slug]);

  const { employees, loading, fetchEmployees } = useHR(company?.id ?? '');

  useEffect(() => {
    if (company?.id) {
      fetchEmployees();
    }
  }, [company?.id, fetchEmployees]);

  // Construire la structure hiérarchique
  const buildHierarchy = (): { topLevel: Employee[]; teams: TeamNode[] } => {
    // Employés sans manager (top level)
    const topLevel = employees.filter((emp) => !emp.managerId);

    // Managers avec leurs équipes
    const managersWithTeams = employees
      .filter((emp) => emp._count && emp._count.subordinates > 0)
      .map((manager) => ({
        manager,
        subordinates: employees.filter((emp) => emp.managerId === manager.id),
      }));

    return { topLevel, teams: managersWithTeams };
  };

  const toggleManager = (managerId: string) => {
    setExpandedManagers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(managerId)) {
        newSet.delete(managerId);
      } else {
        newSet.add(managerId);
      }
      return newSet;
    });
  };

  if (!company) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const { topLevel, teams } = buildHierarchy();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Organigramme</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total employés</p>
                <p className="text-2xl font-bold text-foreground">{employees.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Managers</p>
                <p className="text-2xl font-bold text-foreground">{teams.length}</p>
              </div>
              <User className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sans manager</p>
                <p className="text-2xl font-bold text-foreground">{topLevel.length}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employés sans manager (Top Level) */}
      {topLevel.length > 0 && (
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-foreground">
              Direction / Sans manager assigné
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {topLevel.map((emp) => (
                <div
                  key={emp.id}
                  className="p-4 border border-border rounded-lg bg-muted/40 hover:bg-muted transition-colors"
                >
                  <p className="font-semibold text-foreground">
                    {emp.firstName} {emp.lastName}
                  </p>
                  {emp.position?.title && (
                    <p className="text-sm text-muted-foreground mt-1">{emp.position.title}</p>
                  )}
                  {emp.department?.name && (
                    <Badge variant="outline" className="mt-2 text-xs">
                      {emp.department.name}
                    </Badge>
                  )}
                  {emp._count && emp._count.subordinates > 0 && (
                    <p className="text-xs text-blue-600 mt-2">
                      {emp._count.subordinates} {emp._count.subordinates === 1 ? 'subordonné' : 'subordonnés'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Équipes (Managers et leurs subordonnés) */}
      {teams.length > 0 && (
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-foreground">
              Équipes et hiérarchie
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {teams.map((team) => {
                const isExpanded = expandedManagers.has(team.manager.id);

                return (
                  <div key={team.manager.id} className="p-4">
                    {/* Manager */}
                    <div
                      className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                      onClick={() => toggleManager(team.manager.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                          {team.manager.firstName[0]}
                          {team.manager.lastName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {team.manager.firstName} {team.manager.lastName}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {team.manager.position?.title && (
                              <span className="text-sm text-muted-foreground">
                                {team.manager.position.title}
                              </span>
                            )}
                            {team.manager.department?.name && (
                              <Badge variant="outline" className="text-xs">
                                {team.manager.department.name}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-blue-600">
                          {team.subordinates.length} {team.subordinates.length === 1 ? 'membre' : 'membres'}
                        </Badge>
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    {/* Membres de l'équipe */}
                    {isExpanded && (
                      <div className="mt-4 ml-8 space-y-2">
                        {team.subordinates.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center gap-3 p-3 border border-border rounded-lg bg-white hover:bg-muted/40 transition-colors"
                          >
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sm font-medium">
                              {member.firstName[0]}
                              {member.lastName[0]}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">
                                {member.firstName} {member.lastName}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                {member.position?.title && (
                                  <span className="text-xs text-muted-foreground">
                                    {member.position.title}
                                  </span>
                                )}
                                {member.department?.name && (
                                  <Badge variant="outline" className="text-xs">
                                    {member.department.name}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {member._count && member._count.subordinates > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {member._count.subordinates} sous-équipe
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message si aucune équipe */}
      {teams.length === 0 && topLevel.length === 0 && (
        <Card className="border border-border">
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Aucun employé enregistré</p>
            <p className="text-sm text-muted-foreground mt-1">
              Commencez par ajouter des employés et définir leurs managers
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
