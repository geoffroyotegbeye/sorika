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
  LEAD: 'bg-slate-500',
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
                    <span className="text-sm text-slate-600">
                      {stage.count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className={`${stageColors[stage.stage] || 'bg-slate-500'} h-3 rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {stage.value.toLocaleString()} XOF
                  </div>
                </div>
              );
            })}
          </div>

          {/* Légende */}
          <div className="pt-4 border-t">
            <div className="grid grid-cols-2 gap-2">
              {stages.map((stage) => (
                <div key={stage.stage} className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded ${stageColors[stage.stage] || 'bg-slate-500'}`}
                  />
                  <span className="text-xs text-slate-600">
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
