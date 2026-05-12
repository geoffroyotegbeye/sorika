'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PipelineStage {
  stage: string;
  count: number;
  value: number;
}

interface PipelineChartProps {
  stages: PipelineStage[];
  totalValue: number;
}

const stageLabels: Record<string, string> = {
  LEAD: 'Lead',
  QUALIFIED: 'Qualifié',
  PROPOSAL: 'Proposition',
  NEGOTIATION: 'Négociation',
  WON: 'Gagné',
  LOST: 'Perdu',
};

const stageColors: Record<string, string> = {
  LEAD: 'bg-muted-foreground',
  QUALIFIED: 'bg-blue-500',
  PROPOSAL: 'bg-yellow-500',
  NEGOTIATION: 'bg-orange-500',
  WON: 'bg-green-500',
  LOST: 'bg-red-500',
};

export function PipelineChart({ stages, totalValue }: PipelineChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition du Pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Graphique en barres horizontales */}
          <div className="space-y-3">
            {stages.map((stage) => {
              const percentage =
                totalValue > 0 ? (stage.value / totalValue) * 100 : 0;

              return (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">
                      {stageLabels[stage.stage] || stage.stage}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {stage.count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-muted">
                    <div
                      className={`${stageColors[stage.stage] || 'bg-muted-foreground'} h-3 rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {stage.value.toLocaleString()} XOF
                  </div>
                </div>
              );
            })}
          </div>

          {/* Légende */}
          <div className="pt-4 border-t border-border">
            <div className="grid grid-cols-2 gap-2">
              {stages.map((stage) => (
                <div key={stage.stage} className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded ${stageColors[stage.stage] || 'bg-muted-foreground'}`}
                  />
                  <span className="text-xs text-muted-foreground">
                    {stageLabels[stage.stage] || stage.stage}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
