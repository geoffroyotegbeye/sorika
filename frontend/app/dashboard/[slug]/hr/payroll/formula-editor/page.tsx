'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Play, Save, Edit, MoreVertical } from 'lucide-react';
import { usePayrollFormulas } from '@/hooks/usePayrollFormulas';
import { PageHeader } from '@/components/layout/PageHeader';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';

interface FormulaVariable {
  id: string;
  name: string;
  code: string;
  type: 'FIXED' | 'PERCENTAGE' | 'FORMULA';
  value?: number;
  formula?: string;
  description?: string;
  positionId?: string;
  employeeId?: string;
}

export default function FormulaEditorPage() {
  const params = useParams();
  const companyId = params.slug as string;
  console.log('CompanyId from params:', companyId);
  const { variables, loading, error, fetchVariables, createVariable, updateVariable, deleteVariable, testFormula } = usePayrollFormulas(companyId);
  const [selectedVariable, setSelectedVariable] = useState<FormulaVariable | null>(null);
  const [isVariableDialogOpen, setIsVariableDialogOpen] = useState(false);
  const [isFormulaDialogOpen, setIsFormulaDialogOpen] = useState(false);
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(true);
  const [newVariable, setNewVariable] = useState<Partial<FormulaVariable>>({
    name: '',
    code: '',
    type: 'FIXED',
  });
  const [newFormula, setNewFormula] = useState({
    name: '',
    code: '',
    formula: '',
  });
  const [variableSearch, setVariableSearch] = useState('');
  const [assignmentType, setAssignmentType] = useState<'position' | 'employee'>('position');
  const [assignmentTargetId, setAssignmentTargetId] = useState<string>('');
  const [assignmentEmployeeIds, setAssignmentEmployeeIds] = useState<string[]>([]);
  const [notification, setNotification] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [testValues, setTestValues] = useState<Record<string, string>>({});
  const [testResult, setTestResult] = useState<{ success: boolean; result?: number; error?: string } | null>(null);
  const [isTestResultModalOpen, setIsTestResultModalOpen] = useState(false);
  const [isEditingFormula, setIsEditingFormula] = useState(false);
  const [positions, setPositions] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [companyUuid, setCompanyUuid] = useState<string>('');

  useEffect(() => {
    fetchVariables();
  }, [fetchVariables]);

  // Récupérer l'UUID de l'entreprise à partir du slug
  useEffect(() => {
    const fetchCompanyUuid = async () => {
      if (!companyId) return;
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (!userData) return;
        const parsed = JSON.parse(userData);

        console.log('Fetching company UUID for slug:', companyId);
        const response = await fetch(`http://localhost:3001/companies/slug/${companyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-user-id': parsed.user.id,
          },
        });

        console.log('Company UUID response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('Company data:', data);
          if (data && data.id) {
            setCompanyUuid(data.id);
            console.log('Company UUID set to:', data.id);
          } else {
            console.error('Company data does not contain id field');
          }
        } else {
          console.error('Erreur lors de la récupération de l\'UUID de l\'entreprise:', response.status);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération de l\'UUID de l\'entreprise', err);
      }
    };

    fetchCompanyUuid();
  }, [companyId]);

  useEffect(() => {
    if (companyUuid) {
      fetchPositions();
      fetchEmployees();
    }
  }, [companyUuid]);

  useEffect(() => {
    // Charger les valeurs par défaut des variables pour le test
    const defaultTestValues: Record<string, string> = {};
    variables.forEach(variable => {
      if (variable.type === 'FIXED' || variable.type === 'PERCENTAGE') {
        if (variable.value !== undefined && variable.value !== null) {
          defaultTestValues[variable.code] = variable.value.toString();
        }
      }
    });
    setTestValues(defaultTestValues);
  }, [variables]);

  useEffect(() => {
    // Mettre à jour les valeurs de test quand une formule est sélectionnée
    if (selectedVariable && selectedVariable.type === 'FORMULA' && selectedVariable.formula) {
      const usedVariables = extractVariablesFromFormula(selectedVariable.formula);
      const newTestValues: Record<string, string> = {};
      
      usedVariables.forEach(code => {
        const variable = variables.find(v => v.code === code);
        if (variable && (variable.type === 'FIXED' || variable.type === 'PERCENTAGE')) {
          if (variable.value !== undefined && variable.value !== null) {
            newTestValues[code] = variable.value.toString();
          }
        }
      });
      
      setTestValues(newTestValues);
    }
  }, [selectedVariable, variables]);

  const fetchPositions = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      console.log('Fetching positions for company UUID:', companyUuid);
      if (!companyUuid) {
        console.error('Company UUID is empty, cannot fetch positions');
        return;
      }

      const response = await fetch(`http://localhost:3001/companies/${companyUuid}/hr/positions`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
          'Cache-Control': 'no-cache',
        },
      });

      console.log('Positions response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Positions data:', data);
        setPositions(data || []);
      } else {
        console.error('Erreur lors du chargement des postes:', response.status);
        setPositions([]);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des postes', err);
      setPositions([]);
    }
  };

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      console.log('Fetching employees for company UUID:', companyUuid);
      if (!companyUuid) {
        console.error('Company UUID is empty, cannot fetch employees');
        return;
      }

      const response = await fetch(`http://localhost:3001/companies/${companyUuid}/hr/employees`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
          'Cache-Control': 'no-cache',
        },
      });

      console.log('Employees response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Employees data:', data);
        setEmployees(data || []);
      } else {
        console.error('Erreur lors du chargement des employés:', response.status);
        setEmployees([]);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des employés', err);
      setEmployees([]);
    }
  };

  const handleCreateVariable = () => {
    setIsCreateMode(true);
    setNewVariable({ name: '', code: '', type: 'FIXED' });
    setIsVariableDialogOpen(true);
  };

  const handleCreateFormula = () => {
    setNewFormula({ name: '', code: '', formula: '' });
    setIsEditingFormula(false);
    setIsFormulaDialogOpen(true);
  };

  const handleAssignment = (variable: FormulaVariable) => {
    setSelectedVariable(variable);
    setAssignmentType('position'); // Par défaut, afficher les postes
    setAssignmentTargetId('');
    setAssignmentEmployeeIds([]);
    // Recharger les postes et employés quand le modal s'ouvre
    fetchPositions();
    fetchEmployees();
    
    // Afficher un message de debug
    console.log('Company UUID:', companyUuid, 'Positions:', positions.length, 'Employees:', employees.length);
    if (positions.length === 0 && employees.length === 0) {
      showNotification('error', 'Aucun poste ou employé trouvé');
    }
    
    setIsAssignmentDialogOpen(true);
  };

  const handleEditVariable = (variable: FormulaVariable) => {
    if (variable.type === 'FORMULA') {
      // Utiliser le modal de création de formule pour l'édition
      setNewFormula({
        name: variable.name,
        code: variable.code,
        formula: variable.formula || '',
      });
      setIsEditingFormula(true);
      setIsFormulaDialogOpen(true);
    } else {
      // Utiliser le modal de variable standard pour les autres types
      setIsCreateMode(false);
      setNewVariable({ ...variable });
      setIsVariableDialogOpen(true);
    }
  };

  const showNotification = (type: 'error' | 'success', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveVariable = async () => {
    if (!newVariable.name || !newVariable.code) {
      showNotification('error', 'Veuillez remplir le nom et le code de la variable');
      return;
    }

    if (isCreateMode) {
      await createVariable(newVariable);
    } else {
      await updateVariable(selectedVariable!.id, newVariable);
    }

    setIsVariableDialogOpen(false);
    setSelectedVariable(null);
    setNewVariable({ name: '', code: '', type: 'FIXED' });
    showNotification('success', isCreateMode ? 'Variable créée avec succès' : 'Variable mise à jour');
  };

  const handleNameChange = (name: string) => {
    setNewVariable({ 
      ...newVariable, 
      name,
      code: name.toUpperCase().replace(/[^A-Z0-9]/g, '_')
    });
  };

  const handleFormulaNameChange = (name: string) => {
    setNewFormula({ 
      ...newFormula, 
      name,
      code: name.toUpperCase().replace(/[^A-Z0-9]/g, '_'),
    });
  };

  const handleCreateFormulaFromDialog = async () => {
    const missingFields = [];
    if (!newFormula.name) missingFields.push('Nom');
    if (!newFormula.code) missingFields.push('Code');
    if (!newFormula.formula) missingFields.push('Formule');

    if (missingFields.length > 0) {
      showNotification('error', `Champs manquants: ${missingFields.join(', ')}`);
      return;
    }

    const payload = {
      name: newFormula.name,
      code: newFormula.code,
      type: 'FORMULA' as const,
      formula: newFormula.formula,
    };

    try {
      await createVariable(payload);
      showNotification('success', 'Formule créée avec succès');
      setNewFormula({ name: '', code: '', formula: '' });
      setIsFormulaDialogOpen(false);
    } catch (error) {
      showNotification('error', 'Erreur lors de la création de la formule');
    }
  };

  const handleUpdateFormulaFromDialog = async () => {
    if (!selectedVariable) return;

    const missingFields = [];
    if (!newFormula.name) missingFields.push('Nom');
    if (!newFormula.code) missingFields.push('Code');
    if (!newFormula.formula) missingFields.push('Formule');

    if (missingFields.length > 0) {
      showNotification('error', `Champs manquants: ${missingFields.join(', ')}`);
      return;
    }

    const payload = {
      name: newFormula.name,
      code: newFormula.code,
      type: 'FORMULA' as const,
      formula: newFormula.formula,
    };

    try {
      await updateVariable(selectedVariable.id, payload);
      showNotification('success', 'Formule mise à jour avec succès');
      setNewFormula({ name: '', code: '', formula: '' });
      setIsFormulaDialogOpen(false);
      setSelectedVariable(null);
      setIsEditingFormula(false);
    } catch (error) {
      showNotification('error', 'Erreur lors de la mise à jour de la formule');
    }
  };

  const handleSaveAssignment = async () => {
    if (!selectedVariable) return;

    const payload: any = {
      positionId: undefined,
      employeeId: undefined,
    };

    if (assignmentType === 'position' && assignmentTargetId) {
      payload.positionId = assignmentTargetId;
    } else if (assignmentType === 'employee' && assignmentEmployeeIds.length > 0) {
      // Pour l'instant, on affecte à chaque employé individuellement
      // À améliorer pour une affectation groupée
      payload.employeeId = assignmentEmployeeIds[0];
    }

    try {
      if (assignmentType === 'employee' && assignmentEmployeeIds.length > 1) {
        // Affecter à plusieurs employés
        for (const employeeId of assignmentEmployeeIds) {
          await updateVariable(selectedVariable.id, { ...selectedVariable, employeeId, positionId: undefined });
        }
        showNotification('success', `Formule affectée à ${assignmentEmployeeIds.length} employé(s)`);
      } else if (assignmentType === 'position' && assignmentTargetId) {
        await updateVariable(selectedVariable.id, { ...selectedVariable, ...payload });
        showNotification('success', 'Formule affectée au poste');
      } else if (assignmentType === 'employee' && assignmentEmployeeIds.length === 1) {
        await updateVariable(selectedVariable.id, { ...selectedVariable, ...payload });
        showNotification('success', 'Formule affectée à l\'employé');
      } else {
        // Non affecté - supprimer les affectations existantes
        await updateVariable(selectedVariable.id, { ...selectedVariable, positionId: undefined, employeeId: undefined });
        showNotification('success', 'Formule non affectée');
      }
      setIsAssignmentDialogOpen(false);
    } catch (error) {
      showNotification('error', 'Erreur lors de l\'affectation');
    }
  };

  const handleDeleteVariable = async (id: string) => {
    await deleteVariable(id);
    if (selectedVariable?.id === id) {
      setSelectedVariable(null);
    }
  };

  const handleTestFormula = async () => {
    if (!selectedVariable || !selectedVariable.formula) return;

    // Convertir les valeurs de test en nombres
    const testData: Record<string, number> = {};
    Object.keys(testValues).forEach(key => {
      const value = parseFloat(testValues[key]);
      if (!isNaN(value)) {
        testData[key] = value;
      }
    });

    try {
      const result = await testFormula(selectedVariable.formula, testData);
      setTestResult({ success: true, result });
      setIsTestResultModalOpen(true);
    } catch (err) {
      setTestResult({ success: false, error: err instanceof Error ? err.message : 'Erreur inconnue' });
      setIsTestResultModalOpen(true);
    }
  };

  // Extraire les variables utilisées dans la formule
  const extractVariablesFromFormula = (formula: string): string[] => {
    const matches = formula.match(/\{([^}]+)\}/g);
    if (!matches) return [];
    return matches.map(match => match.replace(/[{}]/g, ''));
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
          notification.type === 'error' 
            ? 'bg-red-500 text-white' 
            : 'bg-green-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      <PageHeader
        title="Éditeur de formules de paie"
        description="Créez et gérez les variables et formules de calcul"
        breadcrumbs={[
          { label: 'RH', href: `/dashboard/${companyId}/hr` },
          { label: 'Paie', href: `/dashboard/${companyId}/hr/payroll` },
          { label: 'Éditeur de formules' },
        ]}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Panneau gauche - Variables (réduit) */}
        <div className="w-64 bg-background border-r flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Variables</h2>
            <Button size="sm" onClick={handleCreateVariable}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {variables.map((variable) => (
              <div
                key={variable.id}
                className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 cursor-pointer" onClick={() => handleEditVariable(variable)}>
                    <div className="font-medium text-sm">{variable.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {variable.type}
                      {variable.value !== undefined && variable.value !== null && ` : ${variable.value}`}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditVariable(variable)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Éditer
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleAssignment(variable)}
                        disabled={variable.type === 'FORMULA' || variable.value !== undefined && variable.value !== null}
                        className={variable.type === 'FORMULA' || variable.value !== undefined && variable.value !== null ? 'opacity-50 cursor-not-allowed' : ''}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Affectation
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteVariable(variable.id)} className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panneau centre - Test de formules */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Test de formules</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {selectedVariable ? (
              <div className="max-w-4xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedVariable.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {selectedVariable.type === 'FORMULA' && (
                      <>
                        <div>
                          <Label>Formule</Label>
                          <div className="mt-2 p-4 bg-muted rounded-lg border">
                            <Textarea
                              value={selectedVariable.formula || ''}
                              onChange={(e) => setSelectedVariable({ ...selectedVariable, formula: e.target.value })}
                              placeholder="Ex: {BASE_SALARY} * 0.1 + {PRIME_PERFORMANCE}"
                              className="font-mono"
                              rows={4}
                              disabled
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Valeurs de test</Label>
                          <div className="mt-2 p-4 bg-muted rounded-lg border">
                            <div className="text-xs text-muted-foreground mb-2">
                              Entrez les valeurs des variables pour tester la formule
                            </div>
                            {selectedVariable?.formula && extractVariablesFromFormula(selectedVariable.formula).length > 0 ? (
                              extractVariablesFromFormula(selectedVariable.formula).map((code) => {
                                const variable = variables.find(v => v.code === code);
                                return (
                                  <div key={code} className="mb-2">
                                    <Label htmlFor={`test-${code}`}>
                                      {variable?.name || code} ({`{${code}}`})
                                    </Label>
                                    <Input
                                      id={`test-${code}`}
                                      type="number"
                                      step="0.01"
                                      value={testValues[code] || variable?.value?.toString() || ''}
                                      onChange={(e) => setTestValues({ ...testValues, [code]: e.target.value })}
                                      placeholder={variable?.value?.toString() || '0'}
                                      className="mt-1"
                                    />
                                  </div>
                                );
                              })
                            ) : (
                              <div className="text-center text-muted-foreground text-sm py-4">
                                {selectedVariable?.formula ? 'Aucune variable utilisée dans cette formule' : 'Sélectionnez une formule pour tester'}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 justify-end pt-4">
                          <Button onClick={handleTestFormula}>
                            <Play className="w-4 h-4 mr-2" />
                            Run
                          </Button>
                        </div>
                      </>
                    )}

                    {selectedVariable.type !== 'FORMULA' && (
                      <div className="text-center text-muted-foreground">
                        <p>Sélectionnez une formule pour la tester</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <p>Sélectionnez une formule pour la tester</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Panneau droit - Formules */}
        <div className="w-80 bg-background border-l flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Formules</h2>
            <Button size="sm" onClick={handleCreateFormula}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {variables.filter(v => v.type === 'FORMULA').map((variable) => (
              <div
                key={variable.id}
                className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 cursor-pointer" onClick={() => setSelectedVariable(variable)}>
                    <div className="font-medium text-sm">{variable.name}</div>
                    <div className="text-xs text-muted-foreground mt-1 font-mono">
                      {variable.formula || 'Sans formule'}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditVariable(variable)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Éditer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAssignment(variable)}>
                        <Save className="h-4 w-4 mr-2" />
                        Affectation
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteVariable(variable.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
            {variables.filter(v => v.type === 'FORMULA').length === 0 && (
              <div className="text-center text-muted-foreground text-sm">
                Aucune formule créée
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de création/édition de variable */}
      <Dialog open={isVariableDialogOpen} onOpenChange={setIsVariableDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isCreateMode ? 'Nouvelle variable' : 'Éditer variable'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="varName">Nom</Label>
              <div className="mt-2">
                <Input
                  id="varName"
                  value={newVariable.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Prime de performance"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="varCode">Code</Label>
              <div className="mt-2">
                <Input
                  id="varCode"
                  value={newVariable.code}
                  onChange={(e) => setNewVariable({ ...newVariable, code: e.target.value })}
                  placeholder="PRIME_PERF"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="varType">Type</Label>
              <div className="mt-2">
                <Select
                  value={newVariable.type}
                  onValueChange={(value: any) => setNewVariable({ ...newVariable, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FIXED">Fixe</SelectItem>
                    <SelectItem value="PERCENTAGE">Pourcentage</SelectItem>
                    <SelectItem value="FORMULA">Formule</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {(newVariable.type === 'FIXED' || newVariable.type === 'PERCENTAGE') && (
              <div>
                <Label htmlFor="varValue">Valeur</Label>
                <div className="mt-2">
                  <Input
                    id="varValue"
                    type="number"
                    value={newVariable.value || ''}
                    onChange={(e) => setNewVariable({ ...newVariable, value: Number(e.target.value) })}
                    placeholder="50000"
                  />
                </div>
              </div>
            )}
            {newVariable.type === 'FORMULA' && (
              <div>
                <Label htmlFor="varFormula">Formule</Label>
                <div className="mt-2">
                  <Textarea
                    id="varFormula"
                    value={newVariable.formula || ''}
                    onChange={(e) => setNewVariable({ ...newVariable, formula: e.target.value })}
                    placeholder="Ex: {BASE_SALARY} * 0.1 + {PRIME}"
                    className="font-mono"
                    rows={4}
                  />
                </div>
              </div>
            )}
            <div>
              <Label htmlFor="varDescription">Description</Label>
              <div className="mt-2">
                <Textarea
                  id="varDescription"
                  value={newVariable.description || ''}
                  onChange={(e) => setNewVariable({ ...newVariable, description: e.target.value })}
                  placeholder="Description de la variable..."
                  rows={2}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVariableDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveVariable}>
              {isCreateMode ? 'Créer' : 'Sauvegarder'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de création/édition de formule */}
      <Dialog open={isFormulaDialogOpen} onOpenChange={setIsFormulaDialogOpen}>
        <DialogContent className="!w-[50rem] !max-w-none max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{isEditingFormula ? 'Éditer formule' : 'Nouvelle formule'}</DialogTitle>
          </DialogHeader>
          <div className="flex gap-6 flex-1 overflow-hidden">
            {/* Colonne gauche - Configuration */}
            <div className="w-1/3 space-y-4 overflow-y-auto">
              <div>
                <Label htmlFor="formulaName">Nom</Label>
                <Input
                  id="formulaName"
                  value={newFormula.name}
                  onChange={(e) => handleFormulaNameChange(e.target.value)}
                  placeholder="Prime de performance"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="formulaCode">Code</Label>
                <Input
                  id="formulaCode"
                  value={newFormula.code}
                  onChange={(e) => setNewFormula({ ...newFormula, code: e.target.value })}
                  placeholder="PRIME_PERF"
                  className="mt-2"
                />
              </div>
            </div>

            {/* Colonne droite - Calculatrice */}
            <div className="w-2/3 flex flex-col gap-4">
              {/* Écran d'affichage */}
              <div className="bg-muted rounded-lg p-4">
                <Label className="text-muted-foreground text-sm">Formule</Label>
                <Textarea
                  value={newFormula.formula}
                  onChange={(e) => setNewFormula({ ...newFormula, formula: e.target.value })}
                  placeholder="Ex: {SALAIRE} * 0.1 + {PRIME}"
                  className="bg-background text-foreground font-mono mt-2 border resize-none"
                  rows={3}
                />
              </div>

              {/* Zone de saisie de nombre */}
              <div>
                <Label>Nombre</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="formulaNumber"
                    type="number"
                    step="0.01"
                    placeholder="Entrez un nombre"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setNewFormula({ ...newFormula, formula: newFormula.formula + e.currentTarget.value });
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button
                    variant="default"
                    onClick={() => {
                      const input = document.getElementById('formulaNumber') as HTMLInputElement;
                      if (input && input.value) {
                        setNewFormula({ ...newFormula, formula: newFormula.formula + input.value });
                        input.value = '';
                      }
                    }}
                  >
                    Ajouter
                  </Button>
                </div>
              </div>

              {/* Opérateurs */}
              <div>
                <Label>Opérateurs</Label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {['+', '-', '*', '/', '(', ')', '>=', '<=', '==', '&&', '||'].map((op) => (
                    <Button
                      key={op}
                      variant="outline"
                      size="lg"
                      onClick={() => setNewFormula({ ...newFormula, formula: newFormula.formula + op })}
                    >
                      {op}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Variables */}
              <div className="flex-1 flex flex-col overflow-hidden min-h-[120px]">
                <Label>Variables</Label>
                <Input
                  placeholder="Rechercher une variable..."
                  value={variableSearch}
                  onChange={(e) => setVariableSearch(e.target.value)}
                  className="mt-2"
                />
                <div className="flex-1 overflow-y-auto mt-2 grid grid-cols-6 gap-2 min-h-[80px]">
                  {variables
                    .filter(v => 
                      v.name.toLowerCase().includes(variableSearch.toLowerCase()) ||
                      v.code.toLowerCase().includes(variableSearch.toLowerCase())
                    )
                    .map((v) => (
                    <Button
                      key={v.id}
                      variant="outline"
                      className="text-sm bg-white hover:bg-gray-100 border-gray-200 overflow-hidden text-ellipsis whitespace-nowrap "
                      onClick={() => setNewFormula({ ...newFormula, formula: newFormula.formula + `{${v.code}}` })}
                    >
                      {`{${v.code}}`}
                    </Button>
                  ))}
                  {variables.filter(v => 
                    v.name.toLowerCase().includes(variableSearch.toLowerCase()) ||
                    v.code.toLowerCase().includes(variableSearch.toLowerCase())
                  ).length === 0 && (
                    <div className="col-span-6 text-center text-muted-foreground text-sm py-4">
                      Aucune variable trouvée
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormulaDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={isEditingFormula ? handleUpdateFormulaFromDialog : handleCreateFormulaFromDialog}>
              {isEditingFormula ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de résultat du test de formule */}
      <Dialog open={isTestResultModalOpen} onOpenChange={setIsTestResultModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Résultat du test de formule</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {testResult?.success ? (
              <>
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="text-green-800 font-semibold text-lg mb-2">Succès</div>
                  <div className="text-3xl font-bold text-green-900">
                    {testResult.result !== undefined ? testResult.result.toFixed(2) : 'N/A'}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  La formule a été évaluée avec succès avec les valeurs de test fournies.
                </div>
              </>
            ) : (
              <>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="text-red-800 font-semibold text-lg mb-2">Erreur</div>
                  <div className="text-red-900">
                    {testResult?.error || 'Une erreur inconnue est survenue'}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Vérifiez que la formule est correcte et que toutes les variables utilisées ont des valeurs de test.
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsTestResultModalOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal d'affectation de formule */}
      <Dialog open={isAssignmentDialogOpen} onOpenChange={setIsAssignmentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Affecter : {selectedVariable?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Type d'affectation</Label>
              <div className="mt-2 flex gap-2">
                <Button
                  variant={assignmentType === 'position' ? 'default' : 'outline'}
                  onClick={() => {
                    setAssignmentType('position');
                    setAssignmentTargetId('');
                    setAssignmentEmployeeIds([]);
                  }}
                >
                  Poste
                </Button>
                <Button
                  variant={assignmentType === 'employee' ? 'default' : 'outline'}
                  onClick={() => {
                    setAssignmentType('employee');
                    setAssignmentTargetId('');
                    setAssignmentEmployeeIds([]);
                  }}
                >
                  Employé(s)
                </Button>
              </div>
            </div>

            {assignmentType === 'position' && (
              <div>
                <Label>Sélectionner un poste</Label>
                <div className="mt-2">
                  <Select
                    value={assignmentTargetId || "none"}
                    onValueChange={(value) => setAssignmentTargetId(value === "none" ? "" : value)}
                  >
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
              </div>
            )}

            {assignmentType === 'employee' && (
              <div>
                <Label>Sélectionner un ou plusieurs employés</Label>
                <div className="mt-2 max-h-60 overflow-y-auto space-y-2 border rounded-lg p-3">
                  {employees.map((emp) => (
                    <div key={emp.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`emp-${emp.id}`}
                        checked={assignmentEmployeeIds.includes(emp.id)}
                        onCheckedChange={(checked: boolean) => {
                          if (checked) {
                            setAssignmentEmployeeIds([...assignmentEmployeeIds, emp.id]);
                          } else {
                            setAssignmentEmployeeIds(assignmentEmployeeIds.filter(id => id !== emp.id));
                          }
                        }}
                      />
                      <label
                        htmlFor={`emp-${emp.id}`}
                        className="flex-1 cursor-pointer text-sm"
                      >
                        {emp.firstName} {emp.lastName}
                      </label>
                    </div>
                  ))}
                  {employees.length === 0 && (
                    <div className="text-center text-muted-foreground text-sm py-4">
                      Aucun employé disponible
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignmentDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleSaveAssignment} 
              disabled={
                (assignmentType === 'position' && !assignmentTargetId) ||
                (assignmentType === 'employee' && assignmentEmployeeIds.length === 0)
              }
            >
              Affecter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
