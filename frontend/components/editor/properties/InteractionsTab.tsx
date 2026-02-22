'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MousePointer2, Hand, DoorOpen, ArrowUpDown, Code, Plus, Trash2, Eye, Pencil } from 'lucide-react';
import { useEditorStore } from '@/lib/stores/editor-store';
import { Interaction, TriggerType } from '@/lib/interactions/types';
import { AnimationPanel } from './AnimationPanel';
import { interactionEngine } from '@/lib/interactions/engine';

interface InteractionsTabProps {
  elementId: string;
}

export function InteractionsTab({ elementId }: InteractionsTabProps) {
  const { elements, updateElementInteractions } = useEditorStore();
  const [showPanel, setShowPanel] = useState(false);
  const [currentTrigger, setCurrentTrigger] = useState<TriggerType>('click');
  const [editingInteraction, setEditingInteraction] = useState<Interaction | null>(null);
  const [showCode, setShowCode] = useState(false);

  const findElement = (items: any[], id: string): any => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children?.length > 0) {
        const found = findElement(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const element = findElement(elements, elementId);
  const interactions = element?.interactions || [];

  const triggers = [
    { id: 'click', label: 'Clic', icon: MousePointer2, description: 'Déclenche au clic' },
    { id: 'hover', label: 'Survol', icon: Hand, description: 'Déclenche au survol' },
    { id: 'page-load', label: 'Chargement', icon: DoorOpen, description: 'Déclenche au chargement' },
    { id: 'scroll', label: 'Défilement', icon: ArrowUpDown, description: 'Déclenche au scroll' },
    { id: 'custom', label: 'Personnalisé', icon: Code, description: 'Événement personnalisé' },
  ];

  const handleAddInteraction = (trigger: TriggerType) => {
    setCurrentTrigger(trigger);
    setEditingInteraction(null);
    setShowPanel(true);
  };

  const handleEditInteraction = (interaction: Interaction) => {
    setCurrentTrigger(interaction.trigger);
    setEditingInteraction(interaction);
    setShowPanel(true);
  };

  const handleSaveAction = (actionConfig: { type: any; config: any }) => {
    let updated;
    
    if (editingInteraction) {
      // Modifier l'interaction existante
      updated = interactions.map((i: Interaction) => 
        i.id === editingInteraction.id 
          ? { ...i, actions: [actionConfig] }
          : i
      );
    } else {
      // Ajouter une nouvelle interaction
      const newInteraction: Interaction = {
        id: `interaction-${Date.now()}`,
        trigger: currentTrigger,
        actions: [actionConfig],
      };
      updated = [...interactions, newInteraction];
    }

    updateElementInteractions(elementId, updated);
    interactionEngine.setInteractions(elementId, updated);
    setEditingInteraction(null);
  };

  const handleDeleteInteraction = (interactionId: string) => {
    const updated = interactions.filter((i: Interaction) => i.id !== interactionId);
    updateElementInteractions(elementId, updated);
    interactionEngine.setInteractions(elementId, updated);
  };

  const getTriggerLabel = (trigger: string) => {
    const labels: Record<string, string> = {
      'click': 'Clic',
      'hover': 'Survol',
      'page-load': 'Chargement',
      'scroll': 'Défilement',
      'custom': 'Personnalisé'
    };
    return labels[trigger] || trigger;
  };

  const generatedCode = interactionEngine.generateCode(elementId);

  return (
    <div className="p-4 space-y-6">
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-2xl">⚡</span>
          </div>
          <div>
            <h3 className="font-bold text-lg">Donnez vie à votre site</h3>
            <p className="text-xs text-white/80">Propulsé par GSAP</p>
          </div>
        </div>
        <p className="text-sm text-white/90">
          Créez des animations et interactions avancées sans code
        </p>
      </div>

      {interactions.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Interactions actives</h4>
          {interactions.map((interaction: Interaction) => (
            <div key={interaction.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <div className="font-medium text-sm">{getTriggerLabel(interaction.trigger)}</div>
                <div className="text-xs text-slate-500">
                  {interaction.actions.length} action(s)
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditInteraction(interaction)}
                >
                  <Pencil className="h-4 w-4 text-blue-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteInteraction(interaction.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div>
        <h4 className="text-sm font-semibold mb-3">Ajouter une interaction</h4>
        <div className="space-y-2">
          {triggers.map((trigger) => {
            const Icon = trigger.icon;
            return (
              <Button
                key={trigger.id}
                variant="outline"
                className="w-full justify-start gap-3 h-auto py-3"
                onClick={() => handleAddInteraction(trigger.id as TriggerType)}
              >
                <Icon className="h-5 w-5 text-slate-600" />
                <div className="text-left flex-1">
                  <div className="font-medium text-sm">{trigger.label}</div>
                  <div className="text-xs text-slate-500">{trigger.description}</div>
                </div>
                <Plus className="h-4 w-4" />
              </Button>
            );
          })}
        </div>
      </div>

      {generatedCode && (
        <div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowCode(!showCode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {showCode ? 'Masquer' : 'Voir'} le code généré
          </Button>
          {showCode && (
            <pre className="mt-2 p-3 bg-slate-900 text-white text-xs rounded overflow-x-auto">
              {generatedCode}
            </pre>
          )}
        </div>
      )}

      {showPanel && (
        <AnimationPanel
          onSave={handleSaveAction}
          onClose={() => {
            setShowPanel(false);
            setEditingInteraction(null);
          }}
          initialAction={editingInteraction?.actions[0]}
        />
      )}
    </div>
  );
}
