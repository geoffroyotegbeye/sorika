'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Trash2, Receipt, BookOpen } from 'lucide-react';
import { DataGrid } from '@/components/data-grid';
import type { DataGridColumn } from '@/components/data-grid';
import type { Expense } from '@/types/hr-extended';

interface ExpensesListProps {
  expenses: Expense[];
  currency: string;
  onApprove: (expenseId: string) => void;
  onReject: (expenseId: string) => void;
  onReimburse: (expenseId: string) => void;
  onDelete: (expenseId: string) => void;
  onSendToAccounting?: (expense: Expense) => void;
}

const STATUS_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'En attente' },
  APPROVED: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Approuvé' },
  REJECTED: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejeté' },
  REIMBURSED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Remboursé' },
};

const CATEGORY_LABELS: Record<string, string> = {
  TRANSPORT: 'Transport',
  MEAL: 'Repas',
  ACCOMMODATION: 'Hébergement',
  OTHER: 'Autre',
};

export function ExpensesList({
  expenses,
  currency,
  onApprove,
  onReject,
  onReimburse,
  onDelete,
  onSendToAccounting,
}: ExpensesListProps) {
  const columns: DataGridColumn<Expense>[] = [
    {
      key: 'employee',
      header: 'Employé',
      render: (_, row) => (
        <p className="font-medium text-foreground">
          {row.employee ? `${row.employee.firstName} ${row.employee.lastName}` : 'Inconnu'}
        </p>
      ),
    },
    {
      key: 'title',
      header: 'Titre',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <span className="text-foreground">{val as string}</span>
          {row.receiptUrl && (
            <a
              href={row.receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700"
              title="Voir le justificatif"
            >
              <Receipt className="h-4 w-4" />
            </a>
          )}
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Catégorie',
      render: (val) => (
        <span className="text-muted-foreground">{CATEGORY_LABELS[val as string] ?? val}</span>
      ),
    },
    {
      key: 'amount',
      header: 'Montant',
      render: (val) => (
        <span className="font-medium text-foreground">
          {(val as number).toLocaleString('fr-FR')} {currency}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (val) => (
        <span className="text-muted-foreground">
          {new Date(val as string).toLocaleDateString('fr-FR')}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Statut',
      render: (val) => {
        const s = STATUS_BADGE[val as string];
        return <Badge className={`${s.bg} ${s.text}`}>{s.label}</Badge>;
      },
    },
    {
      key: 'id',
      header: 'Actions',
      sortable: false,
      searchable: false,
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2">
          {row.status === 'PENDING' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onApprove(row.id)}
                className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                title="Approuver"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReject(row.id)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                title="Rejeter"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
          {row.status === 'APPROVED' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReimburse(row.id)}
              className="text-xs"
              title="Marquer comme remboursé"
            >
              Rembourser
            </Button>
          )}
          {row.status === 'APPROVED' && onSendToAccounting && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSendToAccounting(row)}
              className="h-8 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              title="Créer une charge comptable"
            >
              <BookOpen className="h-3.5 w-3.5 mr-1" />
              Comptabilité
            </Button>
          )}
          {row.status !== 'REIMBURSED' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(row.id)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
              title="Supprimer"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataGrid
      data={expenses}
      columns={columns}
      searchPlaceholder="Rechercher une note de frais..."
      emptyMessage="Aucune note de frais"
    />
  );
}
