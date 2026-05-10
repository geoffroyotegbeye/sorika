'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { usePositions } from '@/hooks/usePositions';
import { PositionFormDialog } from './PositionFormDialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { DataGrid } from '@/components/data-grid';
import type { DataGridColumn } from '@/components/data-grid';
import type { Position } from '@/types/hr';

interface PositionsListProps {
  companyId: string;
  positions: Position[];
  onRefresh: () => void;
}

const LEVEL_LABELS: Record<string, string> = {
  EXECUTIVE: 'Direction',
  MANAGER: 'Management',
  STAFF: 'Personnel',
  INTERN: 'Stagiaire',
};

const LEVEL_COLORS: Record<string, string> = {
  EXECUTIVE: 'bg-purple-100 text-purple-700',
  MANAGER: 'bg-blue-100 text-blue-700',
  STAFF: 'bg-green-100 text-green-700',
  INTERN: 'bg-orange-100 text-orange-700',
};

export function PositionsList({ companyId, positions, onRefresh }: PositionsListProps) {
  const { deletePosition } = usePositions(companyId);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [positionToDelete, setPositionToDelete] = useState<string | null>(null);

  const handleDelete = async (positionId: string) => {
    try {
      await deletePosition(positionId);
      toast.success('Poste supprimé');
      setDeleteDialogOpen(false);
      setPositionToDelete(null);
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la suppression');
    }
  };

  const columns: DataGridColumn<Position>[] = [
    {
      key: 'title',
      header: 'Titre du poste',
      render: (val) => <p className="font-medium text-slate-900">{val as string}</p>,
    },
    {
      key: 'level',
      header: 'Niveau',
      render: (val) => {
        const level = val as string | null;
        return (
          <Badge className={LEVEL_COLORS[level ?? ''] ?? 'bg-slate-100 text-slate-700'}>
            {LEVEL_LABELS[level ?? ''] ?? level ?? '—'}
          </Badge>
        );
      },
    },
    {
      key: 'description',
      header: 'Description',
      render: (val) => (
        <p className="text-slate-600 max-w-md truncate">{(val as string) || '—'}</p>
      ),
    },
    {
      key: '_count',
      header: 'Employés',
      sortable: false,
      searchable: false,
      render: (_, row) => (
        <div className="flex items-center gap-2 text-slate-600">
          <Users className="h-4 w-4" />
          <span>{row._count?.employees || 0}</span>
        </div>
      ),
    },
    {
      key: 'id',
      header: 'Actions',
      sortable: false,
      searchable: false,
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2">
          <PositionFormDialog companyId={companyId} position={row} onSuccess={onRefresh} />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setPositionToDelete(row.id);
              setDeleteDialogOpen(true);
            }}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataGrid
        data={positions}
        columns={columns}
        searchPlaceholder="Rechercher un poste..."
        emptyMessage="Aucun poste créé"
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => positionToDelete && handleDelete(positionToDelete)}
        title="Supprimer le poste"
        description="Êtes-vous sûr de vouloir supprimer ce poste ? Les employés assignés à ce poste devront être réaffectés."
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
      />
    </>
  );
}
