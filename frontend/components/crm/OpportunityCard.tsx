'use client';

import { Opportunity, OpportunityStage } from '@/types/crm';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, TrendingUp, Calendar, FileText } from 'lucide-react';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onClick?: () => void;
  onStageChange?: (newStage: OpportunityStage) => void;
  onCreateQuote?: (opportunity: Opportunity) => void;
}

const stageLabels: Record<OpportunityStage, string> = {
  LEAD: 'Lead',
  QUALIFIED: 'Qualifié',
  PROPOSAL: 'Proposition',
  NEGOTIATION: 'Négociation',
  WON: 'Gagné',
  LOST: 'Perdu',
};

export function OpportunityCard({
  opportunity,
  onClick,
  onStageChange,
  onCreateQuote,
}: OpportunityCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between">
          <h4
            className="font-medium text-sm line-clamp-2 flex-1"
            onClick={onClick}
          >
            {opportunity.title}
          </h4>
          {onStageChange && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {Object.entries(stageLabels).map(([stage, label]) => (
                  <DropdownMenuItem
                    key={stage}
                    onClick={() => onStageChange(stage as OpportunityStage)}
                  >
                    Déplacer vers {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="text-lg font-semibold text-foreground">
          {opportunity.amount.toLocaleString()} {opportunity.currency}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <TrendingUp className="h-3 w-3" />
          <span>{opportunity.probability}% de probabilité</span>
        </div>

        {opportunity.expectedCloseDate && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(opportunity.expectedCloseDate)}</span>
          </div>
        )}

        {opportunity.contact && (
          <div className="truncate text-xs text-muted-foreground">
            {opportunity.contact.firstName} {opportunity.contact.lastName}
          </div>
        )}

        {opportunity.company && (
          <Badge variant="outline" className="text-xs">
            {opportunity.company.name}
          </Badge>
        )}

        {/* Bouton Créer un devis — visible uniquement sur les opportunités WON */}
        {opportunity.stage === 'WON' && onCreateQuote && (
          <Button
            size="sm"
            variant="outline"
            className="mt-1 h-7 w-full border-green-600/40 text-xs text-green-700 hover:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-950/40"
            onClick={(e) => { e.stopPropagation(); onCreateQuote(opportunity); }}
          >
            <FileText className="h-3 w-3 mr-1" />
            Créer un devis
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
