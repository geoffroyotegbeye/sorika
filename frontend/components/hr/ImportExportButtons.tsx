'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface ImportExportButtonsProps {
  companyId: string;
  onImportComplete: () => void;
}

export function ImportExportButtons({ companyId, onImportComplete }: ImportExportButtonsProps) {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = () => {
    const a = document.createElement('a');
    a.href = '/templates/employees-template.csv';
    a.download = 'modele-employes.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Modèle téléchargé');
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const userData = localStorage.getItem('user');
      if (!userData) throw new Error('Non authentifié');
      const user = JSON.parse(userData);

      const res = await fetch(`/api/companies/${companyId}/hr/employees/export`, {
        headers: {
          'x-user-id': user.id,
        },
      });

      if (!res.ok) {
        throw new Error('Erreur lors de l\'export');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Export réussi');
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'export');
    } finally {
      setExporting(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Veuillez sélectionner un fichier CSV');
      return;
    }

    setImporting(true);
    try {
      const csvContent = await file.text();

      const userData = localStorage.getItem('user');
      if (!userData) throw new Error('Non authentifié');
      const user = JSON.parse(userData);

      const res = await fetch(`/api/companies/${companyId}/hr/employees/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
        },
        body: JSON.stringify({ csvContent }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Erreur lors de l\'import');
      }

      const result = await res.json();

      if (result.errors.length > 0) {
        toast.warning(`Import terminé : ${result.success} réussis, ${result.errors.length} erreurs`, {
          description: result.errors.slice(0, 3).join('\n'),
        });
      } else {
        toast.success(`${result.success} employé(s) importé(s) avec succès`);
      }

      onImportComplete();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'import');
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownloadTemplate}
      >
        <FileText className="h-4 w-4 mr-2" />
        Modèle CSV
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleExport}
        disabled={exporting}
      >
        <Download className="h-4 w-4 mr-2" />
        {exporting ? 'Export...' : 'Exporter'}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleImportClick}
        disabled={importing}
      >
        <Upload className="h-4 w-4 mr-2" />
        {importing ? 'Import...' : 'Importer'}
      </Button>
    </div>
  );
}
