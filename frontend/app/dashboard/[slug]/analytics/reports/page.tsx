'use client';

import { use, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  BarChart3,
  TrendingUp,
  Users,
  Package,
  DollarSign,
  FileSpreadsheet,
  File,
} from 'lucide-react';

export default function ReportsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [reportType, setReportType] = useState('');
  const [period, setPeriod] = useState('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [format, setFormat] = useState('pdf');

  const reportTypes = [
    {
      id: 'sales',
      name: 'Rapport de ventes',
      description: 'Analyse complète des ventes et du chiffre d\'affaires',
      icon: TrendingUp,
      color: 'blue',
    },
    {
      id: 'crm',
      name: 'Rapport CRM',
      description: 'Pipeline commercial et performance des opportunités',
      icon: Users,
      color: 'green',
    },
    {
      id: 'inventory',
      name: 'Rapport d\'inventaire',
      description: 'État des stocks et mouvements de produits',
      icon: Package,
      color: 'amber',
    },
    {
      id: 'financial',
      name: 'Rapport financier',
      description: 'Factures, devis et analyse financière',
      icon: DollarSign,
      color: 'purple',
    },
    {
      id: 'hr',
      name: 'Rapport RH',
      description: 'Employés, présences et masse salariale',
      icon: Users,
      color: 'teal',
    },
    {
      id: 'global',
      name: 'Rapport global',
      description: 'Vue d\'ensemble de toutes les activités',
      icon: BarChart3,
      color: 'indigo',
    },
  ];

  const handleGenerateReport = () => {
    // TODO: Implémenter la génération de rapport
    console.log('Generating report:', {
      reportType,
      period,
      startDate,
      endDate,
      format,
    });
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Rapports</h1>
        <p className="text-sm text-muted-foreground">
          Générez et exportez vos rapports d'analyse
        </p>
      </div>

      {/* Types de rapports disponibles */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">
          Types de rapports disponibles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            const isSelected = reportType === report.id;
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600',
              green: 'bg-green-100 text-green-600',
              amber: 'bg-amber-100 text-amber-600',
              purple: 'bg-purple-100 text-purple-600',
              teal: 'bg-teal-100 text-teal-600',
              indigo: 'bg-indigo-100 text-indigo-600',
            };

            return (
              <Card
                key={report.id}
                className={`cursor-pointer transition-all border-2 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-border hover:border-muted-foreground/30'
                }`}
                onClick={() => setReportType(report.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                        colorClasses[report.color as keyof typeof colorClasses]
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground mb-1">
                        {report.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {report.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Configuration du rapport */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">
            Configuration du rapport
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Période prédéfinie */}
          <div className="space-y-2">
            <Label>Période prédéfinie</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Aujourd'hui</SelectItem>
                <SelectItem value="week">7 derniers jours</SelectItem>
                <SelectItem value="month">30 derniers jours</SelectItem>
                <SelectItem value="quarter">3 derniers mois</SelectItem>
                <SelectItem value="year">12 derniers mois</SelectItem>
                <SelectItem value="custom">Période personnalisée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Période personnalisée */}
          {period === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date de début</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Date de fin</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Format d'export */}
          <div className="space-y-2">
            <Label>Format d'export</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setFormat('pdf')}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                  format === 'pdf'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-border hover:border-muted-foreground/30'
                }`}
              >
                <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <File className="h-5 w-5 text-red-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">PDF</p>
                  <p className="text-xs text-muted-foreground">Document imprimable</p>
                </div>
              </button>

              <button
                onClick={() => setFormat('excel')}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                  format === 'excel'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-border hover:border-muted-foreground/30'
                }`}
              >
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileSpreadsheet className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">Excel</p>
                  <p className="text-xs text-muted-foreground">Feuille de calcul</p>
                </div>
              </button>
            </div>
          </div>

          {/* Bouton de génération */}
          <div className="pt-4 border-t border-border">
            <Button
              onClick={handleGenerateReport}
              disabled={!reportType}
              className="w-full"
              size="lg"
            >
              <Download className="h-4 w-4 mr-2" />
              Générer et télécharger le rapport
            </Button>
            {!reportType && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                Veuillez sélectionner un type de rapport
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Rapports récents */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">
            Rapports récents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              Aucun rapport généré
            </p>
            <p className="text-xs text-muted-foreground">
              Vos rapports générés apparaîtront ici
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Rapports programmés */}
      <Card className="border border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-foreground">
              Rapports programmés
            </CardTitle>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Programmer un rapport
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              Aucun rapport programmé
            </p>
            <p className="text-xs text-muted-foreground">
              Programmez des rapports automatiques hebdomadaires ou mensuels
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
