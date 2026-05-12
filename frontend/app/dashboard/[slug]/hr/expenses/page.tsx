'use client';

import { use, useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Receipt } from 'lucide-react';
import { toast } from 'sonner';
import { useExpenses } from '@/hooks/useExpenses';
import { useHR } from '@/hooks/useHR';
import { useCompany } from '@/hooks/useCompany';
import { ExpensesList } from '@/components/hr/ExpensesList';
import { ExpenseFormDialog } from '@/components/hr/ExpenseFormDialog';
import { BillFormDialog } from '@/components/accounting/BillFormDialog';
import { DateRangeFilter, type DateRange } from '@/components/ui/date-range-filter';
import type { Expense } from '@/types/hr-extended';

export default function ExpensesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [formOpen, setFormOpen] = useState(false);
  const [localCompanyId, setLocalCompanyId] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange>(null);

  // Intégration RH → Comptabilité
  const [billDialogOpen, setBillDialogOpen] = useState(false);
  const [prefillBill, setPrefillBill] = useState<{
    supplierName?: string;
    notes?: string;
    items?: Array<{ description: string; quantity: number; unitPrice: number }>;
  } | null>(null);

  // Fetch company data with currency
  const { company, loading: companyLoading } = useCompany(slug);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return;
    const parsed = JSON.parse(userData);
    const currentCompany = parsed.companies?.find((c: any) => c.slug === slug);
    setLocalCompanyId(currentCompany?.id ?? '');
  }, [slug]);

  const {
    expenses,
    loading,
    fetchExpenses,
    createExpense,
    updateExpenseStatus,
    deleteExpense,
  } = useExpenses(localCompanyId);

  const { employees, fetchEmployees } = useHR(localCompanyId);

  useEffect(() => {
    if (localCompanyId) {
      fetchExpenses();
      fetchEmployees();
    }
  }, [localCompanyId, fetchExpenses, fetchEmployees]);

  const handleApprove = async (expenseId: string) => {
    try {
      await updateExpenseStatus(expenseId, { status: 'APPROVED' });
      toast.success('Note de frais approuvée');
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'approbation');
    }
  };

  const handleReject = async (expenseId: string) => {
    try {
      await updateExpenseStatus(expenseId, { status: 'REJECTED' });
      toast.success('Note de frais rejetée');
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors du rejet');
    }
  };

  const handleReimburse = async (expenseId: string) => {
    try {
      await updateExpenseStatus(expenseId, { status: 'REIMBURSED' });
      toast.success('Note de frais marquée comme remboursée');
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async (expenseId: string) => {
    try {
      await deleteExpense(expenseId);
      toast.success('Note de frais supprimée');
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la suppression');
    }
  };

  // Intégration RH → Comptabilité : pré-remplir une charge depuis une note de frais
  const handleSendToAccounting = (expense: Expense) => {
    const employeeName = expense.employee
      ? `${expense.employee.firstName} ${expense.employee.lastName}`
      : 'Employé';

    setPrefillBill({
      supplierName: employeeName,
      notes: `Note de frais RH — ${expense.title} (${expense.category})`,
      items: [{
        description: expense.title,
        quantity: 1,
        unitPrice: expense.amount,
      }],
    });
    setBillDialogOpen(true);
  };

  // useMemo AVANT le return conditionnel — règles des hooks
  const filteredExpenses = useMemo(() => {
    if (!dateRange) return expenses;
    return expenses.filter(e => {
      const d = e.date.split('T')[0];
      return d >= dateRange.from && d <= dateRange.to;
    });
  }, [expenses, dateRange]);

  if (companyLoading || !company) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-foreground">Notes de frais</h1>
        <div className="flex flex-wrap items-center gap-2">
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
          <Button onClick={() => setFormOpen(true)}>
            <Receipt className="h-4 w-4 mr-2" />
            Nouvelle note de frais
          </Button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      )}

      {/* List */}
      {!loading && (
        <ExpensesList
          expenses={filteredExpenses}
          currency={company.currency}
          onApprove={handleApprove}
          onReject={handleReject}
          onReimburse={handleReimburse}
          onDelete={handleDelete}
          onSendToAccounting={handleSendToAccounting}
        />
      )}

      {/* Form Dialog */}
      <ExpenseFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        employees={employees}
        defaultCurrency={company.currency}
        onCreate={createExpense}
      />

      {/* Intégration RH → Comptabilité */}
      {prefillBill && (
        <BillFormDialog
          companyId={localCompanyId}
          open={billDialogOpen}
          onClose={() => { setBillDialogOpen(false); setPrefillBill(null); }}
          currency={company.currency}
          prefill={prefillBill}
        />
      )}
    </div>
  );
}
