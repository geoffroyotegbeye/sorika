'use client';

import { ClientCompany, CompanySize } from '@/types/crm';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Building2, Globe, Users, TrendingUp } from 'lucide-react';

interface CompanyCardProps {
  company: ClientCompany;
  onClick?: () => void;
}

const sizeLabels: Record<CompanySize, string> = {
  SMALL: 'Petite',
  MEDIUM: 'Moyenne',
  LARGE: 'Grande',
  ENTERPRISE: 'Entreprise',
};

export function CompanyCard({ company, onClick }: CompanyCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold text-lg">{company.name}</h3>
          </div>
          {company.size && (
            <Badge variant="outline">{sizeLabels[company.size]}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {company.industry && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>{company.industry}</span>
          </div>
        )}
        {company.website && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="h-4 w-4" />
            <span className="truncate">{company.website}</span>
          </div>
        )}
        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{company._count?.contacts || 0} contacts</span>
          </div>
          <div>
            <span>{company._count?.opportunities || 0} opportunités</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
