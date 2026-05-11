'use client';

import { useEffect, useState } from 'react';
import { Opportunity, OpportunityStage } from '@/types/crm';
import { useCRMOpportunities } from '@/hooks/useCRMOpportunities';
import { Button } from '@/components/ui/button';
import { Plus, Info } from 'lucide-react';
import { OpportunityCard } from './OpportunityCard';
import { OpportunityFormDialog } from './OpportunityFormDialog';
import { QuoteFormDialog } from '@/components/accounting/QuoteFormDialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface OpportunitiesKanbanProps {
  companyId: string;
  currency?: string;
}

const stages: { value: OpportunityStage; label: string; color: string; description: string }[] = [
  { 
    value: 'LEAD', 
    label: 'Lead', 
    color: 'bg-slate-100',
    description: 'Premiers contacts, prospects non qualifiés'
  },
  { 
    value: 'QUALIFIED', 
    label: 'Qualifié', 
    color: 'bg-blue-100',
    description: 'Prospects qualifiés avec budget et besoin confirmés'
  },
  { 
    value: 'PROPOSAL', 
    label: 'Proposition', 
    color: 'bg-yellow-100',
    description: 'Proposition commerciale envoyée au client'
  },
  { 
    value: 'NEGOTIATION', 
    label: 'Négociation', 
    color: 'bg-orange-100',
    description: 'En cours de négociation des termes et conditions'
  },
  { 
    value: 'WON', 
    label: 'Gagné', 
    color: 'bg-green-100',
    description: 'Affaire conclue avec succès'
  },
  { 
    value: 'LOST', 
    label: 'Perdu', 
    color: 'bg-red-100',
    description: 'Opportunité perdue ou abandonnée'
  },
];

export function OpportunitiesKanban({ companyId, currency = 'XOF' }: OpportunitiesKanbanProps) {
  const { opportunities, loading, error, fetchOpportunities, updateStage } =
    useCRMOpportunities(companyId);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Intégration CRM → Comptabilité
  const [quoteOpportunity, setQuoteOpportunity] = useState<Opportunity | null>(null);
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);

  useEffect(() => {
    console.log('OpportunitiesKanban mounted, fetching opportunities for company:', companyId);
    fetchOpportunities();
  }, [fetchOpportunities]);

  useEffect(() => {
    console.log('Opportunities updated:', opportunities);
  }, [opportunities]);

  const getOpportunitiesByStage = (stage: OpportunityStage) => {
    return opportunities.filter((opp) => opp.stage === stage);
  };

  const getTotalValueByStage = (stage: OpportunityStage) => {
    return getOpportunitiesByStage(stage).reduce(
      (sum, opp) => sum + opp.amount,
      0
    );
  };

  const handleCreate = () => {
    setSelectedOpportunity(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedOpportunity(null);
    fetchOpportunities();
  };

  const handleStageChange = async (opportunityId: string, newStage: OpportunityStage) => {
    await updateStage(opportunityId, { stage: newStage });
    fetchOpportunities();
  };

  const handleCreateQuote = (opportunity: Opportunity) => {
    setQuoteOpportunity(opportunity);
    setQuoteDialogOpen(true);
  };

  if (loading) {
    return <div className="text-center py-8 text-slate-500">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Erreur: {error}</p>
        <Button onClick={() => fetchOpportunities()}>Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header fixe */}
      <div className="flex justify-end shrink-0">
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle opportunité
        </Button>
      </div>

      {/* Zone colonnes — parent fixe dans la largeur de l'écran, scroll X interne */}
      <div className="w-full overflow-x-auto overflow-y-hidden" style={{ height: 'calc(100vh - 220px)' }}>
        <div className="flex gap-3 h-full px-0.5 pb-2" style={{ minWidth: `${stages.length * 220}px` }}>
          {stages.map((stage) => {
            const stageOpportunities = getOpportunitiesByStage(stage.value);
            const totalValue = getTotalValueByStage(stage.value);

            return (
              <div key={stage.value} className="flex flex-col w-52 shrink-0 h-full">
                {/* En-tête colonne */}
                <div className={`${stage.color} rounded-t-lg px-3 py-2.5 shrink-0`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">{stage.label}</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-slate-500 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{stage.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    {stageOpportunities.length} opportunité
                    {stageOpportunities.length > 1 ? 's' : ''}
                  </div>
                  <div className="text-xs font-medium">
                    {totalValue.toLocaleString()} {currency}
                  </div>
                </div>

                {/* Corps colonne — prend toute la hauteur restante, scroll vertical */}
                <div className="border border-t-0 rounded-b-lg bg-slate-50 overflow-y-auto overflow-x-hidden flex-1">
                  <div className="p-2 space-y-2">
                    {stageOpportunities.map((opportunity) => (
                      <OpportunityCard
                        key={opportunity.id}
                        opportunity={opportunity}
                        onClick={() => handleEdit(opportunity)}
                        onStageChange={(newStage) =>
                          handleStageChange(opportunity.id, newStage)
                        }
                        onCreateQuote={handleCreateQuote}
                      />
                    ))}
                    {stageOpportunities.length === 0 && (
                      <p className="text-xs text-slate-400 text-center py-6">Aucune opportunité</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <OpportunityFormDialog
        companyId={companyId}
        opportunity={selectedOpportunity}
        open={isDialogOpen}
        onClose={handleDialogClose}
      />

      {/* Intégration CRM → Comptabilité : pré-remplissage depuis l'opportunité */}
      {quoteOpportunity && (
        <QuoteFormDialog
          companyId={companyId}
          open={quoteDialogOpen}
          onClose={() => { setQuoteDialogOpen(false); setQuoteOpportunity(null); }}
          currency={currency}
          prefill={{
            clientId: quoteOpportunity.company?.id,
            clientName: quoteOpportunity.company?.name ?? quoteOpportunity.contact
              ? `${quoteOpportunity.contact!.firstName} ${quoteOpportunity.contact!.lastName}`
              : quoteOpportunity.title,
            clientEmail: quoteOpportunity.contact?.email,
            notes: `Devis généré depuis l'opportunité CRM : ${quoteOpportunity.title}`,
            items: [{
              description: quoteOpportunity.title,
              quantity: 1,
              unitPrice: quoteOpportunity.amount,
            }],
          }}
        />
      )}
    </div>
  );
}
