'use client';

import { use, useEffect, useState } from 'react';
import { OpportunitiesKanban } from '@/components/crm/OpportunitiesKanban';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface Company {
  id: string;
  slug: string;
  name: string;
  currency?: string;
}

interface UserData {
  companies?: Company[];
}

export default function OpportunitiesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [company, setCompany] = useState<Company | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        setError('Données utilisateur non trouvées');
        return;
      }
      
      const parsed: UserData = JSON.parse(userData);
      const foundCompany = parsed.companies?.find((c) => c.slug === slug) ?? null;
      
      if (!foundCompany) {
        setError('Entreprise non trouvée');
      }
      
      setCompany(foundCompany);
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError('Erreur lors du chargement des données');
    }
  }, [slug]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <p className="text-sm text-muted-foreground">Veuillez vérifier vos données de connexion</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden gap-6">
      <PageHeader
        title="Opportunités"
        description="Gérez votre pipeline de ventes"
        breadcrumbs={[
          { label: 'CRM', href: `/dashboard/${slug}/crm` },
          { label: 'Opportunités' },
        ]}
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle opportunité
          </Button>
        }
      />
      <div className="flex-1 min-h-0 overflow-hidden">
        <OpportunitiesKanban companyId={company.id} currency={company.currency ?? 'XOF'} />
      </div>
    </div>
  );
}
