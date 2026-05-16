'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { ChevronLeft, ChevronRight, UserCircle } from 'lucide-react';
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
      setSalary(employee.baseSalary?.toString() ?? '');
      setManagerId(employee.managerId ?? '');
      setIsActive(employee.isActive);
    } else {
      resetForm();
    }
    setStep(1);
  }, [employee, open]);

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
  };

  const handleClose = () => {
    setStep(1);
    onOpenChange(false);
  };

  const handleSubmit = async () => {
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
        baseSalary: salary ? parseFloat(salary) : undefined,
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
      handleClose();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const canGoToStep2 = firstName.trim() !== '' && lastName.trim() !== '' && hireDate !== '';

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="!max-w-xl max-h-[85vh] overflow-y-auto w-full">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Modifier l\'employé' : 'Ajouter un employé'}</DialogTitle>
        </DialogHeader>

        {/* Indicateur d'étapes */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 1 ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`}>
            1
          </div>
          <div className={`h-1 w-12 ${step === 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
            2
          </div>
        </div>

        {/* Étape 1 : Informations de base */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prénom *</Label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Prénom de l'employé"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Nom *</Label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Nom de l'employé"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Poste</Label>
                <Select value={positionId || 'none'} onValueChange={(v) => setPositionId(v === 'none' ? '' : v)}>
                  <SelectTrigger>
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
                <Label>Date d'embauche *</Label>
                <Input
                  type="date"
                  value={hireDate}
                  onChange={(e) => setHireDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Département</Label>
                <Select value={departmentId || 'none'} onValueChange={(v) => setDepartmentId(v === 'none' ? '' : v)}>
                  <SelectTrigger>
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
                <Label>Manager (Chef hiérarchique)</Label>
                <Select value={managerId || 'none'} onValueChange={(v) => setManagerId(v === 'none' ? '' : v)}>
                  <SelectTrigger>
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
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={handleClose}>
                Annuler
              </Button>
              <Button onClick={() => setStep(2)} disabled={!canGoToStep2}>
                Suivant
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Étape 2 : Contrat et rémunération */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Récapitulatif employé */}
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{firstName} {lastName}</p>
                  {positionId && (
                    <p className="text-sm text-slate-600">
                      {positions.find(p => p.id === positionId)?.title}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type de contrat</Label>
                <Select value={contractType || 'none'} onValueChange={(v) => setContractType(v === 'none' ? '' : v)}>
                  <SelectTrigger>
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
              <div className="space-y-2">
                <Label>Salaire de base (optionnel)</Label>
                <Input
                  type="number"
                  placeholder="Ex: 45000"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <Label className="text-sm font-medium">Employé actif</Label>
                <p className="text-xs text-slate-500">L'employé peut se connecter et apparaît dans les listes</p>
              </div>
              <Switch
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>

            <div className="flex justify-between gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleClose}>
                  Annuler
                </Button>
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
