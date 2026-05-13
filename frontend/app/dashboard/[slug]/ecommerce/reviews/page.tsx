'use client';

import { use, useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface Company {
  id: string;
  slug: string;
  name: string;
  currency?: string;
}

export default function ReviewsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);
      const foundCompany = parsed.companies?.find((c: any) => c.slug === slug) ?? null;
      setCompany(foundCompany);
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
    }
  }, [slug]);

  if (!company) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Avis clients"
        description="Gérez et modérez les avis de vos clients"
        breadcrumbs={[
          { label: 'E-commerce', href: `/dashboard/${slug}/ecommerce` },
          { label: 'Avis' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Liste des avis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Aucun avis pour le moment</h3>
            <p className="text-sm text-muted-foreground">
              Les avis de vos clients apparaîtront ici une fois qu'ils seront publiés.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
