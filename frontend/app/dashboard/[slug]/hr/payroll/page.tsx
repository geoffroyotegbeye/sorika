'use client';

import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus, Calculator } from 'lucide-react';
import { useState } from 'react';
import { PayrollPeriod, PayrollEntry, PayrollStatus, PayrollVariable } from '@/types/hr';
import { Badge } from '@/components/ui/badge';
import { DataGrid } from '@/components/data-grid';
import type { DataGridColumn } from '@/components/data-grid';
import { Pencil, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePayroll } from '@/hooks/usePayroll';
import { PayrollPeriodFormDialog } from '@/components/hr/PayrollPeriodFormDialog';
import { PayrollVariableFormDialog } from '@/components/hr/PayrollVariableFormDialog';
import { SalaryCalculator } from '@/components/hr/SalaryCalculator';

export default function PayrollPage() {
  const params = useParams();
  const companyId = params.slug as string;
  const { payrollPeriods, payrollEntries, payrollVariables, loading, fetchPayrollPeriods, fetchPayrollVariables, createPayrollPeriod, updatePayrollPeriod, deletePayrollPeriod, calculatePayroll, validatePayroll, createPayrollVariable, updatePayrollVariable, deletePayrollVariable } = usePayroll(companyId);
  const [selectedPeriod, setSelectedPeriod] = useState<PayrollPeriod | null>(null);
  const [selectedVariable, setSelectedVariable] = useState<PayrollVariable | null>(null);
  const [isPeriodDialogOpen, setIsPeriodDialogOpen] = useState(false);
  const [isVariableDialogOpen, setIsVariableDialogOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  const handleCreatePeriod = () => {
    setSelectedPeriod(null);
    setIsPeriodDialogOpen(true);
  };

  const handleEditPeriod = (period: PayrollPeriod) => {
    setSelectedPeriod(period);
    setIsPeriodDialogOpen(true);
  };

  const handleCreateVariable = () => {
    setSelectedVariable(null);
    setIsVariableDialogOpen(true);
  };

  const handleEditVariable = (variable: PayrollVariable) => {
    setSelectedVariable(variable);
    setIsVariableDialogOpen(true);
  };

  const handlePeriodDialogClose = () => {
    setIsPeriodDialogOpen(false);
    setSelectedPeriod(null);
  };

  const handleVariableDialogClose = () => {
    setIsVariableDialogOpen(false);
    setSelectedVariable(null);
  };

  const handleCalculate = async (periodId: string) => {
    await calculatePayroll(periodId);
  };

  const handleValidate = async (periodId: string) => {
    await validatePayroll(periodId);
  };

  const handleDeletePeriod = async (periodId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette période ?')) {
      await deletePayrollPeriod(periodId);
    }
  };

  const handleDeleteVariable = async (variableId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette variable ?')) {
      await deletePayrollVariable(variableId);
    }
  };

  const statusColors: Record<PayrollStatus, string> = {
    DRAFT: 'bg-gray-100 text-gray-800',
    CALCULATED: 'bg-blue-100 text-blue-800',
    VALIDATED: 'bg-purple-100 text-purple-800',
    PAID: 'bg-green-100 text-green-800',
  };

  const statusLabels: Record<PayrollStatus, string> = {
    DRAFT: 'Brouillon',
    CALCULATED: 'Calculé',
    VALIDATED: 'Validé',
    PAID: 'Payé',
  };

  const periodColumns: DataGridColumn<PayrollPeriod>[] = [
    {
      key: 'name',
      header: 'Période',
      render: (val) => <span className="font-medium">{val as string}</span>,
    },
    {
      key: 'startDate',
      header: 'Date de début',
      render: (val) => new Date(val as string).toLocaleDateString('fr-FR'),
    },
    {
      key: 'endDate',
      header: 'Date de fin',
      render: (val) => new Date(val as string).toLocaleDateString('fr-FR'),
    },
    {
      key: 'paymentDate',
      header: 'Date de paiement',
      render: (val) => new Date(val as string).toLocaleDateString('fr-FR'),
    },
    {
      key: 'status',
      header: 'Statut',
      render: (val) => (
        <Badge className={statusColors[val as PayrollStatus]}>
          {statusLabels[val as PayrollStatus]}
        </Badge>
      ),
    },
    {
      key: 'id',
      header: 'Actions',
      sortable: false,
      searchable: false,
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2">
          {row.status === 'DRAFT' && (
            <Button variant="ghost" size="sm" onClick={() => handleCalculate(row.id)} title="Calculer">
              <Calculator className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => handleEditPeriod(row)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDeletePeriod(row.id)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  const variableColumns: DataGridColumn<PayrollVariable>[] = [
    {
      key: 'name',
      header: 'Nom',
      render: (val) => <span className="font-medium">{val as string}</span>,
    },
    {
      key: 'code',
      header: 'Code',
      render: (val) => <code className="text-xs bg-muted px-1 py-0.5 rounded">{val as string}</code>,
    },
    {
      key: 'type',
      header: 'Type',
      render: (val) => (
        <Badge variant="outline">{val as string}</Badge>
      ),
    },
    {
      key: 'value',
      header: 'Valeur',
      render: (val) => (val !== null ? val as number : '—'),
    },
    {
      key: 'formula',
      header: 'Formule',
      render: (val) => (val ? <code className="text-xs bg-muted px-1 py-0.5 rounded">{val as string}</code> : '—'),
    },
    {
      key: 'appliesTo',
      header: "S'applique à",
      render: (val) => <Badge variant="secondary">{val as string}</Badge>,
    },
    {
      key: 'id',
      header: 'Actions',
      sortable: false,
      searchable: false,
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleEditVariable(row)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDeleteVariable(row.id)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Paie"
        description="Gérez les périodes de paie et les variables de calcul"
        breadcrumbs={[
          { label: 'RH', href: `/dashboard/${companyId}/hr` },
          { label: 'Paie' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsCalculatorOpen(true)} variant="outline">
              <Calculator className="h-4 w-4 mr-2" />
              Calculateur salaire
            </Button>
            <Button onClick={handleCreateVariable} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Variable de calcul
            </Button>
            <Button onClick={handleCreatePeriod}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle période
            </Button>
          </div>
        }
      />
      <Tabs defaultValue="periods" className="space-y-4">
        <TabsList>
          <TabsTrigger value="periods">Périodes de paie</TabsTrigger>
          <TabsTrigger value="variables">Variables de calcul</TabsTrigger>
        </TabsList>
        <TabsContent value="periods">
          <DataGrid
            data={payrollPeriods}
            columns={periodColumns}
            loading={loading}
            searchPlaceholder="Rechercher une période..."
            emptyMessage="Aucune période trouvée"
          />
        </TabsContent>
        <TabsContent value="variables">
          <DataGrid
            data={payrollVariables}
            columns={variableColumns}
            loading={loading}
            searchPlaceholder="Rechercher une variable..."
            emptyMessage="Aucune variable trouvée"
          />
        </TabsContent>
      </Tabs>
      <PayrollPeriodFormDialog
        companyId={companyId}
        period={selectedPeriod}
        open={isPeriodDialogOpen}
        onClose={handlePeriodDialogClose}
      />
      <PayrollVariableFormDialog
        companyId={companyId}
        variable={selectedVariable}
        open={isVariableDialogOpen}
        onClose={handleVariableDialogClose}
      />
      <SalaryCalculator
        companyId={companyId}
        open={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />
    </div>
  );
}
