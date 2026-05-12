'use client';

import { useEffect, useState } from 'react';
import { ClientCompany, CompanySize } from '@/types/crm';
import { useCRMCompanies } from '@/hooks/useCRMCompanies';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pencil, Trash2, Building2, Users } from 'lucide-react';
import { CompanyFormDialog } from './CompanyFormDialog';
import { DataGrid } from '@/components/data-grid';
import type { DataGridColumn } from '@/components/data-grid';

interface CompaniesListProps {
  companyId: string;
}

const sizeLabels: Record<CompanySize, string> = {
  SMALL: 'Petite (1-10)',
  MEDIUM: 'Moyenne (11-50)',
  LARGE: 'Grande (51-200)',
  ENTERPRISE: 'Entreprise (200+)',
};

export function CompaniesList({ companyId }: CompaniesListProps) {
  const { companies, loading, fetchCompanies, deleteCompany } = useCRMCompanies(companyId);
  const [sizeFilter, setSizeFilter] = useState<CompanySize | 'ALL'>('ALL');
  const [selectedCompany, setSelectedCompany] = useState<ClientCompany | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const filters: any = {};
    if (sizeFilter !== 'ALL') filters.size = sizeFilter;
    fetchCompanies(filters);
  }, [sizeFilter, fetchCompanies]);

  const handleDelete = async (clientCompanyId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette entreprise ?')) {
      await deleteCompany(clientCompanyId);
    }
  };

  const handleEdit = (company: ClientCompany) => {
    setSelectedCompany(company);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedCompany(null);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedCompany(null);
    fetchCompanies();
  };

  const columns: DataGridColumn<ClientCompany>[] = [
    {
      key: 'name',
      header: 'Nom',
      render: (val) => (
        <div className="flex items-center gap-2 font-medium">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          {val as string}
        </div>
      ),
    },
    {
      key: 'industry',
      header: 'Secteur',
      render: (val) => (val ? <span>{val as string}</span> : <span className="text-muted-foreground">—</span>),
    },
    {
      key: 'size',
      header: 'Taille',
      render: (val) =>
        val ? (
          <Badge variant="outline">{sizeLabels[val as CompanySize]}</Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      key: '_count',
      header: 'Contacts',
      sortable: false,
      searchable: false,
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4 text-muted-foreground" />
          {row._count?.contacts || 0}
        </div>
      ),
    },
    {
      key: '_count',
      header: 'Opportunités',
      sortable: false,
      searchable: false,
      render: (_, row) => <span>{row._count?.opportunities || 0}</span>,
    },
    {
      key: 'owner',
      header: 'Propriétaire',
      sortable: false,
      render: (_, row) =>
        row.owner
          ? `${row.owner.firstName || ''} ${row.owner.lastName || ''}`.trim() || row.owner.email
          : '—',
    },
    {
      key: 'id',
      header: 'Actions',
      sortable: false,
      searchable: false,
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataGrid
        data={companies}
        columns={columns}
        loading={loading}
        searchPlaceholder="Rechercher une entreprise..."
        emptyMessage="Aucune entreprise trouvée"
        toolbar={
          <div className="flex items-center gap-2">
            <Select
              value={sizeFilter}
              onValueChange={(v) => setSizeFilter(v as CompanySize | 'ALL')}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Taille" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Toutes les tailles</SelectItem>
                <SelectItem value="SMALL">Petite (1-10)</SelectItem>
                <SelectItem value="MEDIUM">Moyenne (11-50)</SelectItem>
                <SelectItem value="LARGE">Grande (51-200)</SelectItem>
                <SelectItem value="ENTERPRISE">Entreprise (200+)</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleCreate}>Nouvelle entreprise</Button>
          </div>
        }
      />

      <CompanyFormDialog
        companyId={companyId}
        company={selectedCompany}
        open={isDialogOpen}
        onClose={handleDialogClose}
      />
    </>
  );
}
