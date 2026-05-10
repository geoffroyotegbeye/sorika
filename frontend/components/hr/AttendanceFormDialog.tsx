'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useAttendance } from '@/hooks/useAttendance';
import { useHR } from '@/hooks/useHR';
import type { AttendanceStatus } from '@/types/attendance';

interface AttendanceFormDialogProps {
  companyId: string;
  onSuccess?: () => void;
}

export function AttendanceFormDialog({ companyId, onSuccess }: AttendanceFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState('');
  const [date, setDate] = useState('');
  const [hoursWorked, setHoursWorked] = useState('');
  const [status, setStatus] = useState<AttendanceStatus>('PRESENT');
  const [notes, setNotes] = useState('');

  const { createAttendance } = useAttendance(companyId);
  const { employees, fetchEmployees } = useHR(companyId);

  useEffect(() => {
    if (companyId) {
      fetchEmployees();
    }
  }, [companyId, fetchEmployees]);

  useEffect(() => {
    if (open) {
      // Définir la date du jour par défaut
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!employeeId || !date || !hoursWorked) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const hours = parseFloat(hoursWorked);
    if (isNaN(hours) || hours <= 0 || hours > 24) {
      toast.error('Veuillez entrer un nombre d\'heures valide (0-24)');
      return;
    }

    try {
      await createAttendance({
        employeeId,
        date,
        status,
        hoursWorked: hours,
        notes: notes || undefined,
      });

      toast.success('Présence enregistrée');
      setOpen(false);
      resetForm();
      
      // Appeler le callback pour rafraîchir la liste
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const resetForm = () => {
    setEmployeeId('');
    setDate('');
    setHoursWorked('');
    setStatus('PRESENT');
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle présence
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Enregistrer une présence</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employee">
              Employé <span className="text-red-500">*</span>
            </Label>
            <Select value={employeeId} onValueChange={setEmployeeId}>
              <SelectTrigger id="employee">
                <SelectValue placeholder="Sélectionner un employé" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName}{emp.position?.title ? ` - ${emp.position.title}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">
              Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hoursWorked">
              Heures travaillées <span className="text-red-500">*</span>
            </Label>
            <Input
              id="hoursWorked"
              type="number"
              step="0.5"
              min="0"
              max="24"
              value={hoursWorked}
              onChange={(e) => setHoursWorked(e.target.value)}
              placeholder="Ex: 8"
            />
            <p className="text-xs text-slate-500">
              Nombre d'heures travaillées (0-24)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as AttendanceStatus)}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PRESENT">Présent</SelectItem>
                <SelectItem value="ABSENT">Absent</SelectItem>
                <SelectItem value="LATE">Retard</SelectItem>
                <SelectItem value="HALF_DAY">Demi-journée</SelectItem>
                <SelectItem value="REMOTE">Télétravail</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Remarques ou observations..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">Enregistrer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
