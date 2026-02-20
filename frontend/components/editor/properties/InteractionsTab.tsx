'use client';

import { Button } from '@/components/ui/button';
import { MousePointer2, Hand, DoorOpen, ArrowUpDown, Code } from 'lucide-react';

interface InteractionsTabProps {
  elementId: string;
}

export function InteractionsTab({ elementId }: InteractionsTabProps) {
  const triggers = [
    { id: 'click', label: 'Click', icon: MousePointer2, description: 'Déclenche au clic' },
    { id: 'hover', label: 'Hover', icon: Hand, description: 'Déclenche au survol' },
    { id: 'page-load', label: 'Page load', icon: DoorOpen, description: 'Déclenche au chargement' },
    { id: 'scroll', label: 'Scroll', icon: ArrowUpDown, description: 'Déclenche au scroll' },
    { id: 'custom', label: 'Custom event', icon: Code, description: 'Événement personnalisé' },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Hero Card */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-2xl">⚡</span>
          </div>
          <div>
            <h3 className="font-bold text-lg">Bring your site to life</h3>
            <p className="text-xs text-white/80">Powered by GSAP</p>
          </div>
        </div>
        <p className="text-sm text-white/90">
          Créez des animations et interactions avancées sans code
        </p>
      </div>

      {/* Triggers List */}
      <div>
        <h4 className="text-sm font-semibold mb-3">Trigger on...</h4>
        <div className="space-y-2">
          {triggers.map((trigger) => {
            const Icon = trigger.icon;
            return (
              <Button
                key={trigger.id}
                variant="outline"
                className="w-full justify-start gap-3 h-auto py-3"
                onClick={() => {
                  // TODO: Ouvrir le panneau de configuration d'animation
                  console.log('Configure animation for:', trigger.id);
                }}
              >
                <Icon className="h-5 w-5 text-slate-600" />
                <div className="text-left flex-1">
                  <div className="font-medium text-sm">{trigger.label}</div>
                  <div className="text-xs text-slate-500">{trigger.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Info */}
      <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600">
        <p className="font-medium mb-1">💡 Astuce</p>
        <p className="text-xs">
          Les interactions seront disponibles dans une prochaine version. 
          GSAP sera intégré pour des animations fluides et performantes.
        </p>
      </div>
    </div>
  );
}
