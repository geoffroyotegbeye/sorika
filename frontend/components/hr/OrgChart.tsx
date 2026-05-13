'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Users } from 'lucide-react';
import type { Employee } from '@/types/hr';

interface OrgChartProps {
  employees: Employee[];
}

interface OrgNode {
  employee: Employee;
  subordinates: OrgNode[];
}

export function OrgChart({ employees }: OrgChartProps) {
  // Construire l'arbre hiérarchique
  const buildTree = (): OrgNode[] => {
    // Trouver les employés de niveau supérieur (sans manager)
    const topLevel = employees.filter((emp) => !emp.managerId);

    // Fonction récursive pour construire l'arbre
    const buildNode = (employee: Employee): OrgNode => {
      const subordinates = employees
        .filter((emp) => emp.managerId === employee.id)
        .map((emp) => buildNode(emp));

      return {
        employee,
        subordinates,
      };
    };

    return topLevel.map((emp) => buildNode(emp));
  };

  const tree = buildTree();

  if (tree.length === 0) {
    return (
      <Card className="p-12 text-center border-2 border-dashed border-border">
        <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Aucun employé
        </h3>
        <p className="text-sm text-muted-foreground">
          Commencez par ajouter des employés pour voir l'organigramme
        </p>
      </Card>
    );
  }

  return (
    <div className="overflow-x-auto pb-8 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-slate-100 dark:scrollbar-track-slate-800">
      <div className="inline-flex flex-col items-center min-w-full gap-16">
        {tree.map((node, index) => (
          <div key={node.employee.id} className="w-full flex flex-col items-center">
            {index > 0 && (
              <div className="mb-8">
                <div className="h-px w-64 bg-border dark:bg-slate-700 opacity-50" />
              </div>
            )}
            <OrgNode node={node} isLast={index === tree.length - 1} />
          </div>
        ))}
      </div>
    </div>
  );
}

interface OrgNodeProps {
  node: OrgNode;
  isLast?: boolean;
}

function OrgNode({ node, isLast = false }: OrgNodeProps) {
  const { employee, subordinates } = node;
  const hasSubordinates = subordinates.length > 0;

  return (
    <div className="flex flex-col items-center">
      {/* Carte de l'employé */}
      <EmployeeCard employee={employee} isManager={hasSubordinates} />

      {/* Ligne verticale vers les subordonnés */}
      {hasSubordinates && (
        <div className="w-0.5 h-8 bg-border dark:bg-slate-700" />
      )}

      {/* Subordonnés */}
      {hasSubordinates && (
        <div className="flex flex-col items-center w-full">
          {/* Ligne horizontale */}
          <div className="relative w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-border dark:bg-slate-700" />
            
            {/* Grille des subordonnés avec scroll horizontal */}
            <div className="inline-flex justify-center gap-6 pt-8 min-w-full px-4">
              {subordinates.map((subNode, index) => (
                <div key={subNode.employee.id} className="relative flex flex-col items-center shrink-0">
                  {/* Ligne verticale vers la ligne horizontale */}
                  <div className="absolute -top-8 left-1/2 w-0.5 h-8 bg-border dark:bg-slate-700" />
                  
                  {/* Noeud subordonné récursif */}
                  <OrgNode node={subNode} isLast={index === subordinates.length - 1} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface EmployeeCardProps {
  employee: Employee;
  isManager: boolean;
}

function EmployeeCard({ employee, isManager }: EmployeeCardProps) {
  return (
    <Card
      className={`
        relative w-56 p-3 transition-all hover:shadow-lg cursor-pointer
        ${
          isManager
            ? 'bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200 dark:from-blue-950/30 dark:to-blue-900/20 dark:border-blue-800'
            : 'bg-white dark:bg-slate-900 border-border'
        }
      `}
    >
      {/* Badge Manager */}
      {isManager && (
        <div className="absolute -top-2 -right-2">
          <Badge className="bg-blue-600 text-white dark:bg-blue-500">
            Manager
          </Badge>
        </div>
      )}

      {/* Avatar */}
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`
            h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm
            ${isManager ? 'bg-blue-600 dark:bg-blue-500' : 'bg-slate-600 dark:bg-slate-500'}
          `}
        >
          {employee.firstName[0]}
          {employee.lastName[0]}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-foreground truncate">
            {employee.firstName} {employee.lastName}
          </h3>
          {employee.position?.title && (
            <p className="text-xs text-muted-foreground truncate">
              {employee.position.title}
            </p>
          )}
        </div>
      </div>

      {/* Département */}
      {employee.department?.name && (
        <Badge variant="outline" className="mb-1.5 text-xs">
          {employee.department.name}
        </Badge>
      )}

      {/* Statut contrat */}
      {employee.contractType && (
        <div className="text-xs mb-1.5">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {employee.contractType}
          </span>
        </div>
      )}

      {/* Nombre de subordonnés */}
      {employee._count && employee._count.subordinates > 0 && (
        <div className="mt-2 pt-2 border-t border-border dark:border-slate-700">
          <div className="flex items-center gap-1.5 text-xs">
            <Users className="h-3 w-3 text-blue-600 dark:text-blue-400" />
            <span className="text-muted-foreground">
              {employee._count.subordinates}{' '}
              {employee._count.subordinates === 1 ? 'subordonné' : 'subordonnés'}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}
