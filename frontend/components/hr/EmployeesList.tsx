'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { DataGrid } from '@/components/data-grid';
import type { DataGridColumn } from '@/components/data-grid';
import type { Employee } from '@/types/hr';

interface EmployeesListProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employeeId: string) => void;
}

const CONTRACT_LABELS: Record<string, string> = {
  CDI: 'CDI',
  CDD: 'CDD',
  FREELANCE: 'Freelance',
  STAGE: 'Stage',
  ALTERNANCE: 'Alternance',
  PRESTATION: 'Prestation',
};

const columns: DataGridColumn<Employee>[] = [
  {
    key: 'firstName',
    header: 'Nom',
    render: (_, row) => (
      <p className="font-medium text-foreground">
        {row.firstName} {row.lastName}
      </p>
    ),
  },
  {
    key: 'position',
    header: 'Poste',
    sortable: false,
    render: (_, row) => (
      <span className="text-muted-foreground">{row.position?.title || '—'}</span>
    ),
  },
  {
    key: 'department',
    header: 'Département',
    sortable: false,
    render: (_, row) => (
      <span className="text-muted-foreground">{row.department?.name ?? '—'}</span>
    ),
  },
  {
    key: 'manager',
    header: 'Manager',
    sortable: false,
    render: (_, row) =>
      row.manager ? (
        <div>
          <p className="text-foreground font-medium text-sm">
            {row.manager.firstName} {row.manager.lastName}
          </p>
          {row.manager.position?.title && (
            <p className="text-muted-foreground text-xs">{row.manager.position.title}</p>
          )}
        </div>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    key: '_count',
    header: 'Équipe',
    sortable: false,
    render: (_, row) =>
      row._count?.subordinates ? (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800">
          {row._count.subordinates} {row._count.subordinates === 1 ? 'personne' : 'personnes'}
        </Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    key: 'contractType',
    header: 'Contrat',
    render: (val) =>
      val ? (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
          {CONTRACT_LABELS[val as string] ?? val}
        </span>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    key: 'isActive',
    header: 'Statut',
    render: (val) => (
      <Badge variant={val ? 'default' : 'secondary'}>
        {val ? 'Actif' : 'Inactif'}
      </Badge>
    ),
  },
  {
    key: 'hireDate',
    header: "Date d'embauche",
    render: (val) => (
      <span className="text-muted-foreground">
        {val ? new Date(val as string).toLocaleDateString('fr-FR') : '—'}
      </span>
    ),
  },
];

export function EmployeesList({ employees, onEdit, onDelete }: EmployeesListProps) {
  const columnsWithActions: DataGridColumn<Employee>[] = [
    ...columns,
    {
      key: 'id',
      header: 'Actions',
      sortable: false,
      searchable: false,
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(row)} className="h-8 w-8 p-0">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(row.id)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataGrid
      data={employees}
      columns={columnsWithActions}
      searchPlaceholder="Rechercher un employé..."
      emptyMessage="Aucun employé"
    />
  );
}
