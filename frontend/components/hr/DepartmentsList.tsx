'use client';

import { Button } from '@/components/ui/button';
import { Pencil, Trash2, AlertCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { DataGrid } from '@/components/data-grid';
import type { DataGridColumn } from '@/components/data-grid';
import type { Department } from '@/types/hr';

interface DepartmentsListProps {
  departments: Department[];
  onEdit: (department: Department) => void;
  onDelete: (departmentId: string) => void;
}

export function DepartmentsList({ departments, onEdit, onDelete }: DepartmentsListProps) {
  const columns: DataGridColumn<Department>[] = [
    {
      key: 'name',
      header: 'Nom',
      render: (val) => <p className="font-medium text-foreground">{val as string}</p>,
    },
    {
      key: 'description',
      header: 'Description',
      render: (val) => (
        <p className="text-muted-foreground line-clamp-2">{(val as string) ?? '—'}</p>
      ),
    },
    {
      key: '_count',
      header: 'Employés',
      sortable: false,
      searchable: false,
      render: (_, row) => {
        const count = row._count?.employees ?? 0;
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {count}
          </span>
        );
      },
    },
    {
      key: 'id',
      header: 'Actions',
      sortable: false,
      searchable: false,
      render: (_, row) => {
        const employeeCount = row._count?.employees ?? 0;
        const canDelete = employeeCount === 0;
        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(row)}
              className="h-8 w-8 p-0"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(row.id)}
                      disabled={!canDelete}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </span>
                </TooltipTrigger>
                {!canDelete && (
                  <TooltipContent>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <p className="text-xs">
                        Impossible de supprimer : {employeeCount} employé(s) actif(s)
                      </p>
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ];

  return (
    <DataGrid
      data={departments}
      columns={columns}
      searchPlaceholder="Rechercher un département..."
      emptyMessage="Aucun département"
    />
  );
}
