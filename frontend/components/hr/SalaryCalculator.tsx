'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, Plus, Trash2, Play, Clock, User, Briefcase } from 'lucide-react';
import { PayrollVariable, Employee } from '@/types/hr';
import { usePayroll } from '@/hooks/usePayroll';
import { useAttendance } from '@/hooks/useAttendance';
import { useEmployees } from '@/hooks/useEmployees';
import { useParams } from 'next/navigation';

interface SalaryCalculatorProps {
  companyId: string;
  open: boolean;
  onClose: () => void;
}

interface VariableValue {
  variableId: string;
  name: string;
  code: string;
  value: number;
}

interface FormulaPart {
  type: 'variable' | 'operator' | 'number';
  value: string;
  display: string;
}

export function SalaryCalculator({ companyId, open, onClose }: SalaryCalculatorProps) {
  const { payrollVariables } = usePayroll(companyId);
  const { attendances, fetchAttendances } = useAttendance(companyId);
  const { employees, fetchEmployees } = useEmployees(companyId);
  
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [selectedPositionId, setSelectedPositionId] = useState<string>('');
  const [baseSalary, setBaseSalary] = useState<number>(0);
  const [hourlyRate, setHourlyRate] = useState<number>(0);
  const [weeklyHours, setWeeklyHours] = useState<number>(40);
  const [totalHoursWorked, setTotalHoursWorked] = useState<number>(0);
  const [variableValues, setVariableValues] = useState<VariableValue[]>([]);
  const [formulaParts, setFormulaParts] = useState<FormulaPart[]>([]);
  const [calculatedSalary, setCalculatedSalary] = useState<number | null>(null);
  const [calculationBreakdown, setCalculationBreakdown] = useState<string[]>([]);
  const [calculationMode, setCalculationMode] = useState<'fixed' | 'hourly'>('fixed');
  const [targetType, setTargetType] = useState<'employee' | 'position'>('employee');

  useEffect(() => {
    if (payrollVariables.length > 0) {
      const initialValues = payrollVariables.map(v => ({
        variableId: v.id,
        name: v.name,
        code: v.code,
        value: v.value || 0,
      }));
      setVariableValues(initialValues);
    }
  }, [payrollVariables]);

  useEffect(() => {
    if (companyId) {
      fetchEmployees();
    }
  }, [companyId, fetchEmployees]);

  const loadEmployeeData = async (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    const employee = employees.find((e: Employee) => e.id === employeeId);
    if (employee?.salary) {
      setBaseSalary(employee.salary);
      setHourlyRate(employee.salary / 160);
    }
    
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    
    await fetchAttendances(startDate, endDate, employeeId);
    
    const totalHours = attendances
      .filter(a => a.employeeId === employeeId && a.hoursWorked)
      .reduce((sum, a) => sum + (a.hoursWorked || 0), 0);
    setTotalHoursWorked(totalHours);
  };

  const addFormulaPart = (part: FormulaPart) => {
    setFormulaParts([...formulaParts, part]);
  };

  const removeFormulaPart = (index: number) => {
    setFormulaParts(formulaParts.filter((_, i) => i !== index));
  };

  const buildFormulaString = () => {
    return formulaParts.map(p => p.value).join(' ');
  };

  const calculateSalary = () => {
    try {
      const variables: Record<string, number> = {};

      if (calculationMode === 'hourly') {
        variables['HOURLY_RATE'] = hourlyRate;
        variables['WEEKLY_HOURS'] = weeklyHours;
        variables['TOTAL_HOURS_WORKED'] = totalHoursWorked;
        variables['WEEKS_WORKED'] = totalHoursWorked / weeklyHours;
      } else {
        variables['BASE_SALARY'] = baseSalary;
      }

      variableValues.forEach(v => {
        variables[v.code] = v.value;
      });

      const formulaString = buildFormulaString();
      let expression = formulaString;
      Object.keys(variables).forEach(code => {
        const regex = new RegExp(`\\b${code}\\b`, 'g');
        expression = expression.replace(regex, variables[code].toString());
      });

      const result = eval(expression);
      setCalculatedSalary(result);

      const breakdown: string[] = [];
      breakdown.push(`Cible: ${targetType === 'employee' ? 'Employé' : 'Poste'}`);
      breakdown.push(targetType === 'employee' 
        ? `Employé: ${employees.find((e: Employee) => e.id === selectedEmployeeId)?.firstName} ${employees.find((e: Employee) => e.id === selectedEmployeeId)?.lastName}`
        : `Poste: ${selectedPositionId}`);
      
      if (calculationMode === 'hourly') {
        breakdown.push(`Mode: Calcul horaire`);
        breakdown.push(`Taux horaire: ${hourlyRate} FCFA`);
        breakdown.push(`Heures hebdomadaires: ${weeklyHours}h`);
        breakdown.push(`Heures travaillées: ${totalHoursWorked}h`);
        breakdown.push(`Semaines travaillées: ${(totalHoursWorked / weeklyHours).toFixed(2)}`);
      } else {
        breakdown.push(`Mode: Salaire fixe`);
        breakdown.push(`Salaire de base: ${baseSalary} FCFA`);
      }
      
      variableValues.forEach(v => {
        breakdown.push(`${v.name} (${v.code}): ${v.value} FCFA`);
      });
      
      breakdown.push(`Formule: ${formulaString}`);
      breakdown.push(`Résultat: ${result.toLocaleString()} FCFA`);
      
      setCalculationBreakdown(breakdown);
    } catch (error) {
      console.error('Erreur de calcul:', error);
      alert('Erreur dans la formule de calcul');
    }
  };

  const addVariable = (variable: PayrollVariable) => {
    if (!variableValues.find(v => v.variableId === variable.id)) {
      setVariableValues([
        ...variableValues,
        {
          variableId: variable.id,
          name: variable.name,
          code: variable.code,
          value: variable.value || 0,
        },
      ]);
    }
  };

  const removeVariable = (variableId: string) => {
    setVariableValues(variableValues.filter(v => v.variableId !== variableId));
  };

  const updateVariableValue = (variableId: string, value: number) => {
    setVariableValues(
      variableValues.map(v =>
        v.variableId === variableId ? { ...v, value } : v
      )
    );
  };

  const availableVariables = payrollVariables.filter(
    v => !variableValues.find(vv => vv.variableId === v.id)
  );

  const operators = [
    { symbol: '+', label: 'Addition' },
    { symbol: '-', label: 'Soustraction' },
    { symbol: '*', label: 'Multiplication' },
    { symbol: '/', label: 'Division' },
    { symbol: '(', label: 'Parenthèse ouvrante' },
    { symbol: ')', label: 'Parenthèse fermante' },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1100px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <Calculator className="h-5 w-5 inline mr-2" />
            Calculateur de salaire
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Sélection de la cible */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cible du calcul</CardTitle>
              <CardDescription>Sélectionnez un employé ou un poste pour le calcul</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Select value={targetType} onValueChange={(value: 'employee' | 'position') => setTargetType(value)}>
                  <SelectTrigger className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">
                      <User className="h-4 w-4 mr-2 inline" />
                      Employé
                    </SelectItem>
                    <SelectItem value="position">
                      <Briefcase className="h-4 w-4 mr-2 inline" />
                      Poste
                    </SelectItem>
                  </SelectContent>
                </Select>
                {targetType === 'employee' && (
                  <Select value={selectedEmployeeId} onValueChange={loadEmployeeData}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Sélectionner un employé" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((e: Employee) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.firstName} {e.lastName} - {e.position?.title || 'Sans poste'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {targetType === 'position' && (
                  <Select value={selectedPositionId} onValueChange={setSelectedPositionId}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Sélectionner un poste" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* TODO: Load positions */}
                      <SelectItem value="1">Développeur</SelectItem>
                      <SelectItem value="2">Designer</SelectItem>
                      <SelectItem value="3">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Mode de calcul */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mode de calcul</CardTitle>
              <CardDescription>Choisissez le mode de calcul du salaire</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Select value={calculationMode} onValueChange={(value: 'fixed' | 'hourly') => setCalculationMode(value)}>
                  <SelectTrigger className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Salaire fixe mensuel</SelectItem>
                    <SelectItem value="hourly">Calcul horaire (heures travaillées)</SelectItem>
                  </SelectContent>
                </Select>
                {calculationMode === 'hourly' && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Basé sur les heures de présence
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Salaire de base ou Taux horaire */}
          {calculationMode === 'fixed' ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Salaire de base</CardTitle>
                <CardDescription>Salaire mensuel de base</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Label htmlFor="baseSalary" className="w-32">Montant (FCFA)</Label>
                  <Input
                    id="baseSalary"
                    type="number"
                    value={baseSalary}
                    onChange={(e) => setBaseSalary(Number(e.target.value))}
                    className="flex-1"
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Calcul horaire</CardTitle>
                <CardDescription>Paramètres pour le calcul basé sur les heures travaillées</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label htmlFor="hourlyRate" className="w-40">Taux horaire (FCFA)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Label htmlFor="weeklyHours" className="w-40">Heures/semaine</Label>
                  <Input
                    id="weeklyHours"
                    type="number"
                    value={weeklyHours}
                    onChange={(e) => setWeeklyHours(Number(e.target.value))}
                    className="flex-1"
                  />
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Heures travaillées ce mois:</span>
                      <span className="font-medium">{totalHoursWorked}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Semaines travaillées:</span>
                      <span className="font-medium">{(totalHoursWorked / weeklyHours).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Builder de formule */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Builder de formule</CardTitle>
              <CardDescription>Construisez votre formule en ajoutant des variables et des opérateurs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Zone de formule */}
              <div className="p-4 bg-muted rounded-lg min-h-[60px] flex flex-wrap gap-2 items-center">
                {formulaParts.length === 0 ? (
                  <span className="text-muted-foreground text-sm">Cliquez sur les boutons ci-dessous pour construire votre formule</span>
                ) : (
                  formulaParts.map((part, index) => (
                    <Badge
                      key={index}
                      variant={part.type === 'operator' ? 'outline' : 'secondary'}
                      className="cursor-pointer"
                      onClick={() => removeFormulaPart(index)}
                    >
                      {part.display} <Trash2 className="h-3 w-3 ml-1" />
                    </Badge>
                  ))
                )}
              </div>

              {/* Opérateurs */}
              <div>
                <Label className="mb-2 block">Opérateurs</Label>
                <div className="flex flex-wrap gap-2">
                  {operators.map(op => (
                    <Button
                      key={op.symbol}
                      variant="outline"
                      size="sm"
                      onClick={() => addFormulaPart({
                        type: 'operator',
                        value: op.symbol,
                        display: op.symbol,
                      })}
                    >
                      {op.symbol}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Variables système */}
              <div>
                <Label className="mb-2 block">Variables système</Label>
                <div className="flex flex-wrap gap-2">
                  {calculationMode === 'hourly' ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addFormulaPart({
                          type: 'variable',
                          value: 'HOURLY_RATE',
                          display: 'Taux horaire',
                        })}
                      >
                        Taux horaire
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addFormulaPart({
                          type: 'variable',
                          value: 'TOTAL_HOURS_WORKED',
                          display: 'Heures travaillées',
                        })}
                      >
                        Heures travaillées
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addFormulaPart({
                        type: 'variable',
                        value: 'BASE_SALARY',
                        display: 'Salaire de base',
                      })}
                    >
                      Salaire de base
                    </Button>
                  )}
                </div>
              </div>

              {/* Variables personnalisées */}
              {variableValues.length > 0 && (
                <div>
                  <Label className="mb-2 block">Variables personnalisées</Label>
                  <div className="flex flex-wrap gap-2">
                    {variableValues.map(v => (
                      <Button
                        key={v.variableId}
                        variant="outline"
                        size="sm"
                        onClick={() => addFormulaPart({
                          type: 'variable',
                          value: v.code,
                          display: v.name,
                        })}
                      >
                        {v.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Variables de calcul */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Variables de calcul</CardTitle>
              <CardDescription>Ajoutez des variables personnalisées</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableVariables.length > 0 && (
                <div className="flex items-center gap-2">
                  <Select onValueChange={(value) => {
                    const variable = payrollVariables.find(v => v.id === value);
                    if (variable) addVariable(variable);
                  }}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Ajouter une variable" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableVariables.map(v => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.name} ({v.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {variableValues.length > 0 && (
                <div className="space-y-3">
                  {variableValues.map(v => (
                    <div key={v.variableId} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{v.name}</span>
                          <Badge variant="secondary" className="text-xs">{v.code}</Badge>
                        </div>
                      </div>
                      <Input
                        type="number"
                        value={v.value}
                        onChange={(e) => updateVariableValue(v.variableId, Number(e.target.value))}
                        className="w-32"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariable(v.variableId)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Button onClick={calculateSalary} className="w-full" size="lg">
            <Play className="h-4 w-4 mr-2" />
            Calculer le salaire
          </Button>

          {/* Résultat */}
          {calculatedSalary !== null && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-lg text-green-800">Résultat du calcul</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-3xl font-bold text-green-800">
                  {calculatedSalary.toLocaleString()} FCFA
                </div>
                <div className="space-y-1 text-sm text-green-700">
                  {calculationBreakdown.map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
