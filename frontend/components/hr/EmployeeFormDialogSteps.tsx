'use client';

import { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import type { Employee, Department, Position, CreateEmployeeDto, UpdateEmployeeDto, ContractType } from '@/types/hr';

interface EmployeeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  employees: Employee[];
  departments: Department[];
  positions: Position[];
  onCreate: (dto: CreateEmployeeDto) => Promise<void>;
  onUpdate: (employeeId: string, dto: UpdateEmployeeDto) => Promise<void>;
}

const CONTRACT_TYPES: ContractType[] = ['CDI', 'CDD', 'FREELANCE', 'STAGE', 'ALTERNANCE', 'PRESTATION'];

const CONTRACT_LABELS: Record<ContractType, string> = {
  CDI: 'CDI',
  CDD: 'CDD',
  FREELANCE: 'Freelance',
  STAGE: 'Stage',
  ALTERNANCE: 'Alternance',
  PRESTATION: 'Prestation de service',
};

export function EmployeeFormDialog({
  open,
  onOpenChange,
  employee,
  employees,
  departments,
  positions,
  onCreate,
  onUpdate,
}: EmployeeFormDialogProps) {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [positionId, setPositionId] = useState<string>('');
  const [hireDate, setHireDate] = useState('');
  const [departmentId, setDepartmentId] = useState<string>('');
  const [contractType, setContractType] = useState<string>('');
  const [salary, setSalary] = useState('');
  const [managerId, setManagerId] = useState<string>('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const isEdit = !!employee;

  useEffect(() => {
    if (employee) {
      setFirstName(employee.firstName);
      setLastName(employee.lastName);
      setPositionId(employee.positionId ?? '');
      setHireDate(employee.hireDate.split('T')[0]);
      setDepartmentId(employee.departmentId ?? '');
      setContractType(employee.contractType ?? '');
      setSalary(employee.salary?.toString() ?? '');
      setManagerId(employee.managerId ?? '');
      setIsActive(employee.isActive);
    } else {
      resetForm();
    }
  }, [employee]);

  useEffect(() => {
    if (open) {
      setStep(1);
    }
  }, [open]);

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setPositionId('');
    setHireDate('');
    setDepartmentId('');
    setContractType('');
    setSalary('');
    setManagerId('');
    setIsActive(true);
    setStep(1);
  };

  const handleNext = () => {
    if (!firstName.trim() || !lastName.trim() || !hireDate) {
      toast.error('Prénom, nom et date d\'embauche sont requis');
      return;
    }
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim() || !hireDate) {
      toast.error('Prénom, nom et date d\'embauche sont requis');
      return;
    }

    setLoading(true);
    try {
      const dto: CreateEmployeeDto | UpdateEmployeeDto = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        positionId: positionId || undefined,
        hireDate,
        isActive,
        departmentId: departmentId || undefined,
        contractType: contractType ? (contractType as ContractType) : undefined,
        salary: salary ? parseFloat(salary) : undefined,
        managerId: managerId || undefined,
      };

      if (isEdit) {
        await onUpdate(employee.id, dto);
        toast.success('Employé mis à jour');
      } else {
        await onCreate(dto as CreateEmployeeDto);
        toast.success('Employé créé');
      }

      resetForm();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Modifier l\'employé' : 'Ajouter un employé'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Modifiez les informations de l\'employé' : 'Créez une nouvelle fiche employé'}
          </DialogDescription>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-4">
          <div className={`flex-1 h-1 rounded ${step >= 1 ? 'bg-blue-600' : 'bg-slate-200'}`} />
          <div className={`flex-1 h-1 rounded ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Étape 1 : Informations de base */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Poste</Label>
                <Select value={positionId || 'none'} onValueChange={(v) => setPositionId(v === 'none' ? '' : v)} disabled={loading}>
                  <SelectTrigger id="position">
                    <SelectValue placeholder="Sélectionner un poste" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun</SelectItem>
                    {positions.map((pos) => (
                      <SelectItem key={pos.id} value={pos.id}>
                        {pos.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hireDate">Date d'embauche *</Label>
                <Input
                  id="hireDate"
                  type="date"
                  value={hireDate}
                  onChange={(e) => setHireDate(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contractType">Type de contrat</Label>
                <Select value={contractType || 'none'} onValueChange={(v) => setContractType(v === 'none' ? '' : v)} disabled={loading}>
                  <SelectTrigger id="contractType">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun</SelectItem>
                    {CONTRACT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {CONTRACT_LABELS[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => onOpenChange(false)}
                  disabled={loading}
                >
                  Annuler
                </Button>
                <Button type="button" className="flex-1" onClick={handleNext} disabled={loading}>
                  Suivant
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Étape 2 : Organisation et détails */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="department">Département</Label>
                <Select value={departmentId || 'none'} onValueChange={(v) => setDepartmentId(v === 'none' ? '' : v)} disabled={loading}>
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Sélectionner un département" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="manager">Manager (Chef hiérarchique)</Label>
                <Select value={managerId || 'none'} onValueChange={(v) => setManagerId(v === 'none' ? '' : v)} disabled={loading}>
                  <SelectTrigger id="manager">
                    <SelectValue placeholder="Sélectionner un manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun</SelectItem>
                    {employees
                      .filter((emp) => emp.id !== employee?.id)
                      .map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.firstName} {emp.lastName}
                          {emp.position?.title && ` - ${emp.position.title}`}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Salaire (optionnel)</Label>
                <Input
                  id="salary"
                  type="number"
                  placeholder="Ex: 45000"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <Label htmlFor="isActive" className="text-sm font-normal cursor-pointer">
                  Employé actif
                </Label>
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                  disabled={loading}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleBack}
                  disabled={loading}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer'}
                </Button>
              </div>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
