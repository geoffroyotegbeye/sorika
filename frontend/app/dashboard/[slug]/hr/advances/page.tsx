'use client';

import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Advance, AdvanceRule, AdvanceStatus } from '@/types/hr';
import { Badge } from '@/components/ui/badge';
import { DataGrid } from '@/components/data-grid';
import type { DataGridColumn } from '@/components/data-grid';
import { Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useAdvances } from '@/hooks/useAdvances';
import { AdvanceFormDialog } from '@/components/hr/AdvanceFormDialog';
import { AdvanceRuleFormDialog } from '@/components/hr/AdvanceRuleFormDialog';

export default function AdvancesPage() {
  const params = useParams();
  const companyId = params.slug as string;
  const { advances, advanceRules, loading, fetchAdvances, updateAdvance, deleteAdvance, createAdvanceRule } = useAdvances(companyId);
  const [selectedAdvance, setSelectedAdvance] = useState<Advance | null>(null);
  const [selectedRule, setSelectedRule] = useState<AdvanceRule | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false);

  const handleCreate = () => {
    // Vérifier si une règle existe avant d'ouvrir le formulaire
    if (!advanceRules || advanceRules.length === 0) {
      alert('Veuillez d\'abord définir une règle d\'acompte');
      return;
    }
    setSelectedAdvance(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (advance: Advance) => {
    setSelectedAdvance(advance);
    setIsDialogOpen(true);
  };

  const handleCreateRule = () => {
    // Récupérer la première règle existante pour modification
    if (advanceRules && advanceRules.length > 0) {
      setSelectedRule(advanceRules[0]);
    } else {
      setSelectedRule(null);
    }
    setIsRuleDialogOpen(true);
  };

  const handleEditRule = (rule: AdvanceRule) => {
    setSelectedRule(rule);
    setIsRuleDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedAdvance(null);
  };

  const handleRuleDialogClose = () => {
    setIsRuleDialogOpen(false);
    setSelectedRule(null);
  };

  const handleApprove = async (advanceId: string) => {
    await updateAdvance(advanceId, { status: 'APPROVED' });
  };

  const handleReject = async (advanceId: string) => {
    await updateAdvance(advanceId, { status: 'REJECTED' });
  };

  const handleDelete = async (advanceId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet acompte ?')) {
      await deleteAdvance(advanceId);
    }
  };

  const statusColors: Record<AdvanceStatus, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-blue-100 text-blue-800',
    REJECTED: 'bg-red-100 text-red-800',
    PAID: 'bg-green-100 text-green-800',
  };

  const statusLabels: Record<AdvanceStatus, string> = {
    PENDING: 'En attente',
    APPROVED: 'Approuvé',
    REJECTED: 'Rejeté',
    PAID: 'Payé',
  };

  const columns: DataGridColumn<Advance>[] = [
    {
      key: 'employee',
      header: 'Employé',
      render: (_, row) => (
        <span className="font-medium">
          {row.employee?.firstName} {row.employee?.lastName}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Montant',
      render: (val) => <span>{val as number} FCFA</span>,
    },
    {
      key: 'status',
      header: 'Statut',
      render: (val) => (
        <Badge className={statusColors[val as AdvanceStatus]}>
          {statusLabels[val as AdvanceStatus]}
        </Badge>
      ),
    },
    {
      key: 'requestDate',
      header: 'Date de demande',
      render: (val) => new Date(val as string).toLocaleDateString('fr-FR'),
    },
    {
      key: 'reason',
      header: 'Raison',
      render: (val) => (val as string) || '—',
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
                onClick={() => handleApprove(row.id)}
                title="Approuver"
              >
                <CheckCircle className="h-4 w-4 text-green-500" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleReject(row.id)}
                title="Rejeter"
              >
                <XCircle className="h-4 w-4 text-red-500" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Acomptes"
        description="Gérez les demandes d'acomptes des employés"
        breadcrumbs={[
          { label: 'RH', href: `/dashboard/${companyId}/hr` },
          { label: 'Acomptes' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button onClick={handleCreateRule} variant="outline">
              Règles d'acompte
            </Button>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvel acompte
            </Button>
          </div>
        }
      />
      <DataGrid
        data={advances}
        columns={columns}
        loading={loading}
        searchPlaceholder="Rechercher un acompte..."
        emptyMessage="Aucun acompte trouvé"
      />
      <AdvanceFormDialog
        companyId={companyId}
        advance={selectedAdvance}
        advanceRule={advanceRules && advanceRules.length > 0 ? advanceRules[0] : null}
        open={isDialogOpen}
        onClose={handleDialogClose}
      />
      <AdvanceRuleFormDialog
        companyId={companyId}
        rule={selectedRule}
        open={isRuleDialogOpen}
        onClose={handleRuleDialogClose}
      />
    </div>
  );
}
