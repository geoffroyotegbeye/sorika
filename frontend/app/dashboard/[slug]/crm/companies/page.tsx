'use client';

import { useParams } from 'next/navigation';
import { CompaniesList } from '@/components/crm/CompaniesList';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { ClientCompany } from '@/types/crm';
import { CompanyFormDialog } from '@/components/crm/CompanyFormDialog';
import { CompanySize } from '@/types/crm';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function CompaniesPage() {
  const params = useParams();
  const companyId = params.slug as string;
  const [selectedCompany, setSelectedCompany] = useState<ClientCompany | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sizeFilter, setSizeFilter] = useState<CompanySize | 'ALL'>('ALL');

  const handleCreate = () => {
    setSelectedCompany(null);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedCompany(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Entreprises"
        description="Gérez vos entreprises clientes"
        breadcrumbs={[
          { label: 'CRM', href: `/dashboard/${companyId}/crm` },
          { label: 'Entreprises' },
        ]}
        actions={
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
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle entreprise
            </Button>
          </div>
        }
      />
      <CompaniesList companyId={companyId} sizeFilter={sizeFilter} onCreate={handleCreate} />
      <CompanyFormDialog
        companyId={companyId}
        company={selectedCompany}
        open={isDialogOpen}
        onClose={handleDialogClose}
      />
    </div>
  );
}
