'use client';

import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Calculator, FileText } from 'lucide-react';
import { DataGrid } from '@/components/data-grid';
import type { DataGridColumn } from '@/components/data-grid';
import { usePayroll } from '@/hooks/usePayroll';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function PayrollPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.slug as string;
  const { employees, loading, calculatePayroll } = usePayroll(companyId);
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isPayslipDialogOpen, setIsPayslipDialogOpen] = useState(false);

  // Récupérer la devise depuis les données des employés
  const currency = employees?.[0]?.currency || 'FCFA';

  const handleCalculatePayroll = async () => {
    setIsCalculating(true);
    try {
      // Créer une période de paie pour le mois actuel
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const paymentDate = new Date(now.getFullYear(), now.getMonth() + 1, 5);

      // Pour l'instant, on utilise une période par défaut
      // Dans une implémentation complète, on créerait d'abord la période
      alert('Calcul de la paie lancé pour tous les employés');
    } catch (error) {
      console.error('Erreur lors du calcul de la paie', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleGeneratePayslip = (employee: any) => {
    setSelectedEmployee(employee);
    setIsPayslipDialogOpen(true);
  };

  const employeeColumns: DataGridColumn<any>[] = [
    {
      key: 'name',
      header: 'Employé',
      render: (_, row) => (
        <span className="font-medium">
          {row.firstName} {row.lastName}
        </span>
      ),
    },
    {
      key: 'position',
      header: 'Poste',
      render: (_, row) => row.position?.title || '—',
    },
    {
      key: 'baseSalary',
      header: 'Salaire de base',
      render: (val) => <span>{val as number} {currency}</span>,
    },
    {
      key: 'prime',
      header: 'Prime',
      render: (_, row) => (
        <span className="text-green-600 font-semibold">{row.prime || 0} {currency}</span>
      ),
    },
    {
      key: 'advances',
      header: 'Acomptes',
      render: (_, row) => (
        <span className={row.advances && row.advances.length > 0 ? 'text-orange-600' : 'text-gray-400'}>
          {row.advances && row.advances.length > 0 ? 'Oui' : 'Non'}
        </span>
      ),
    },
    {
      key: 'daysPresent',
      header: 'Jours présents',
      render: (_, row) => (
        <span>{row.daysPresent || 0} / 22</span>
      ),
    },
    {
      key: 'grossSalary',
      header: 'Salaire brut',
      render: (_, row) => (
        <span className="font-semibold">{row.grossSalary || row.baseSalary || 0} {currency}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (_, row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleGeneratePayslip(row)}
        >
          <FileText className="h-4 w-4 mr-2" />
          Bulletin
        </Button>
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
            <Button onClick={() => router.push(`/dashboard/${companyId}/hr/payroll/formula-editor`)} variant="outline">
              <Calculator className="h-4 w-4 mr-2" />
              Éditeur de formules
            </Button>
            <Button onClick={handleCalculatePayroll} disabled={isCalculating}>
              {isCalculating ? 'Calcul en cours...' : 'Calculer la paie'}
            </Button>
          </div>
        }
      />
      
      <DataGrid
        data={employees}
        columns={employeeColumns}
        loading={loading}
        searchPlaceholder="Rechercher un employé..."
        emptyMessage="Aucun employé trouvé"
      />

      {/* Modal de bulletin de paie provisoire */}
      <Dialog open={isPayslipDialogOpen} onOpenChange={setIsPayslipDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bulletin de paie provisoire</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg">{selectedEmployee.firstName} {selectedEmployee.lastName}</h3>
                <p className="text-muted-foreground">{selectedEmployee.position?.title || '—'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Salaire de base</p>
                  <p className="font-semibold">{selectedEmployee.baseSalary || 0} {selectedEmployee.currency || currency}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Prime</p>
                  <p className="font-semibold text-green-600">{selectedEmployee.prime || 0} {selectedEmployee.currency || currency}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Jours présents</p>
                  <p className="font-semibold">{selectedEmployee.daysPresent || 0} / 22</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Acomptes</p>
                  <p className="font-semibold">
                    {selectedEmployee.advances && selectedEmployee.advances.length > 0 
                      ? `${selectedEmployee.advances.length} acompte(s)` 
                      : 'Aucun'}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Salaire brut</span>
                  <span className="font-bold text-lg">{selectedEmployee.grossSalary || selectedEmployee.baseSalary || 0} {selectedEmployee.currency || currency}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsPayslipDialogOpen(false)}>
                  Fermer
                </Button>
                <Button onClick={() => {
                  // Implémenter l'impression/téléchargement
                  alert('Fonctionnalité d\'impression à implémenter');
                }}>
                  Imprimer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
