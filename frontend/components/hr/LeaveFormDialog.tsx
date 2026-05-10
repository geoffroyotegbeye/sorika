'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import type { Employee } from '@/types/hr';
import type { LeaveType, CreateLeaveDto } from '@/types/hr-extended';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import { calculateWorkingDays } from '@/lib/workingDays';

interface LeaveFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: Employee[];
  leaveTypes: LeaveType[];
  publicHolidays?: string[]; // Liste des dates de jours fériés (format ISO)
  onCreate: (employeeId: string, dto: CreateLeaveDto) => Promise<void>;
}

export function LeaveFormDialog({
  open,
  onOpenChange,
  employees,
  leaveTypes,
  publicHolidays = [],
  onCreate,
}: LeaveFormDialogProps) {
  const [employeeId, setEmployeeId] = useState('');
  const [leaveTypeId, setLeaveTypeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [days, setDays] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  // Date minimale = aujourd'hui
  const today = new Date().toISOString().split('T')[0];

  // Préparer les options pour le combobox
  const employeeOptions: ComboboxOption[] = useMemo(() => 
    employees.map((emp) => ({
      value: emp.id,
      label: `${emp.firstName} ${emp.lastName}`,
    })),
    [employees]
  );

  const leaveTypeOptions: ComboboxOption[] = useMemo(() =>
    leaveTypes.map((type) => ({
      value: type.id,
      label: type.name,
      icon: (
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: type.color }}
        />
      ),
    })),
    [leaveTypes]
  );

  const resetForm = () => {
    setEmployeeId('');
    setLeaveTypeId('');
    setStartDate('');
    setEndDate('');
    setDays('');
    setReason('');
  };

  // Calculer automatiquement le nombre de jours ouvrés
  useEffect(() => {
    if (startDate && endDate) {
      const workingDays = calculateWorkingDays(startDate, endDate, publicHolidays);
      setDays(workingDays.toString());
    }
  }, [startDate, endDate, publicHolidays]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!employeeId || !leaveTypeId || !startDate || !endDate || !days) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    try {
      const dto: CreateLeaveDto = {
        leaveTypeId,
        startDate,
        endDate,
        days: parseFloat(days),
        reason: reason || undefined,
      };

      await onCreate(employeeId, dto);
      toast.success('Demande de congé créée');
      resetForm();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvelle demande de congé</DialogTitle>
          <DialogDescription>
            Créer une demande de congé pour un employé
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Employé */}
          <div className="space-y-2">
            <Label htmlFor="employee">Employé *</Label>
            <Combobox
              options={employeeOptions}
              value={employeeId}
              onValueChange={setEmployeeId}
              placeholder="Sélectionner un employé"
              searchPlaceholder="Rechercher un employé..."
              emptyText="Aucun employé trouvé"
              disabled={loading}
            />
          </div>

          {/* Type de congé */}
          <div className="space-y-2">
            <Label htmlFor="leaveType">Type de congé *</Label>
            <Combobox
              options={leaveTypeOptions}
              value={leaveTypeId}
              onValueChange={setLeaveTypeId}
              placeholder="Sélectionner un type"
              searchPlaceholder="Rechercher un type..."
              emptyText="Aucun type disponible"
              disabled={loading}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début *</Label>
              <Input
                id="startDate"
                type="date"
                min={today}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin *</Label>
              <Input
                id="endDate"
                type="date"
                min={startDate || today}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Nombre de jours */}
          <div className="space-y-2">
            <Label htmlFor="days">Nombre de jours ouvrés *</Label>
            <Input
              id="days"
              type="number"
              step="0.5"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              disabled={loading}
              readOnly
            />
            <p className="text-xs text-slate-500">
              Calculé automatiquement (jours ouvrés uniquement, hors weekends et jours fériés)
            </p>
          </div>

          {/* Raison */}
          <div className="space-y-2">
            <Label htmlFor="reason">Raison (optionnel)</Label>
            <Textarea
              id="reason"
              placeholder="Motif de la demande..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={loading}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Création...' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
