'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { X, Plus } from 'lucide-react';
import { AnimationConfig, ActionType } from '@/lib/interactions/types';
import { useEditorStore } from '@/lib/stores/editor-store';

interface AnimationPanelProps {
  onSave: (config: { type: ActionType; config: any }) => void;
  onClose: () => void;
  initialAction?: { type: ActionType; config: any };
}

export function AnimationPanel({ onSave, onClose, initialAction }: AnimationPanelProps) {
  const { elements } = useEditorStore();
  const [actionType, setActionType] = useState<ActionType>(initialAction?.type || 'animate');
  const [animConfig, setAnimConfig] = useState<Partial<AnimationConfig>>({
    property: initialAction?.type === 'animate' ? initialAction.config.property : 'opacity',
    from: initialAction?.type === 'animate' ? initialAction.config.from : undefined,
    to: initialAction?.type === 'animate' ? initialAction.config.to : 1,
    duration: initialAction?.type === 'animate' ? initialAction.config.duration : 1,
    delay: initialAction?.type === 'animate' ? initialAction.config.delay : 0,
    ease: initialAction?.type === 'animate' ? initialAction.config.ease : 'power2.out',
  });
  const [navUrl, setNavUrl] = useState(initialAction?.type === 'navigate' ? initialAction.config.url : '');
  const [className, setClassName] = useState(initialAction?.type === 'toggle-class' ? initialAction.config.className : '');
  const [targetSelector, setTargetSelector] = useState(
    initialAction?.type === 'toggle-class' || initialAction?.type === 'show-hide' 
      ? initialAction.config.targetSelector 
      : ''
  );
  const [customCode, setCustomCode] = useState(initialAction?.type === 'custom-code' ? initialAction.config.code : '');

  const properties = [
    { value: 'opacity', label: 'Opacité' },
    { value: 'x', label: 'Position X' },
    { value: 'y', label: 'Position Y' },
    { value: 'scale', label: 'Échelle' },
    { value: 'rotation', label: 'Rotation' },
    { value: 'width', label: 'Largeur' },
    { value: 'height', label: 'Hauteur' },
  ];

  const eases = [
    'power1.out', 'power2.out', 'power3.out', 'power4.out',
    'back.out', 'elastic.out', 'bounce.out', 'circ.out',
    'expo.out', 'sine.out', 'linear'
  ];

  const getAllElements = () => {
    const result: any[] = [];
    const collect = (els: any[]) => {
      els.forEach(el => {
        result.push(el);
        if (el.children?.length > 0) collect(el.children);
      });
    };
    collect(elements);
    return result;
  };

  const handleSave = () => {
    let config: any;

    switch (actionType) {
      case 'animate':
        config = animConfig;
        break;
      case 'navigate':
        config = { url: navUrl, target: '_self' };
        break;
      case 'toggle-class':
        config = { className, targetSelector };
        break;
      case 'show-hide':
        config = { targetSelector, action: 'toggle' };
        break;
      case 'custom-code':
        config = { code: customCode };
        break;
    }

    onSave({ type: actionType, config });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg shadow-xl w-[500px] max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Configurer l'action</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <Label>Type d'action</Label>
            <Select value={actionType} onValueChange={(v) => setActionType(v as ActionType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="animate">Animer</SelectItem>
                <SelectItem value="navigate">Naviguer</SelectItem>
                <SelectItem value="toggle-class">Basculer classe</SelectItem>
                <SelectItem value="show-hide">Afficher/Masquer</SelectItem>
                <SelectItem value="custom-code">Code personnalisé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {actionType === 'animate' && (
            <>
              <div>
                <Label>Propriété</Label>
                <Select 
                  value={animConfig.property} 
                  onValueChange={(v) => setAnimConfig({ ...animConfig, property: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map(p => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>De (optionnel)</Label>
                <Input 
                  type="number" 
                  value={animConfig.from || ''} 
                  onChange={(e) => setAnimConfig({ ...animConfig, from: parseFloat(e.target.value) })}
                  placeholder="Laisser vide pour valeur actuelle"
                />
              </div>

              <div>
                <Label>À</Label>
                <Input 
                  type="number" 
                  value={animConfig.to} 
                  onChange={(e) => setAnimConfig({ ...animConfig, to: parseFloat(e.target.value) })}
                />
              </div>

              <div>
                <Label>Durée (secondes): {animConfig.duration}</Label>
                <Slider 
                  value={[animConfig.duration || 1]} 
                  onValueChange={([v]) => setAnimConfig({ ...animConfig, duration: v })}
                  min={0.1}
                  max={5}
                  step={0.1}
                />
              </div>

              <div>
                <Label>Délai (secondes): {animConfig.delay || 0}</Label>
                <Slider 
                  value={[animConfig.delay || 0]} 
                  onValueChange={([v]) => setAnimConfig({ ...animConfig, delay: v })}
                  min={0}
                  max={3}
                  step={0.1}
                />
              </div>

              <div>
                <Label>Transition</Label>
                <Select 
                  value={animConfig.ease} 
                  onValueChange={(v) => setAnimConfig({ ...animConfig, ease: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {eases.map(e => (
                      <SelectItem key={e} value={e}>{e}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {actionType === 'navigate' && (
            <div>
              <Label>URL</Label>
              <Input 
                value={navUrl} 
                onChange={(e) => setNavUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          )}

          {actionType === 'toggle-class' && (
            <>
              <div>
                <Label>Nom de la classe</Label>
                <Input 
                  value={className} 
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="active"
                />
              </div>
              <div>
                <Label>Sélecteur cible (optionnel)</Label>
                <Input 
                  value={targetSelector} 
                  onChange={(e) => setTargetSelector(e.target.value)}
                  placeholder=".mon-element ou #mon-id"
                />
              </div>
            </>
          )}

          {actionType === 'show-hide' && (
            <>
              <div>
                <Label>Élément cible</Label>
                <Select 
                  value={targetSelector} 
                  onValueChange={(v) => setTargetSelector(v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un élément" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAllElements().map(el => (
                      <SelectItem key={el.id} value={`[data-element-id="${el.id}"]`}>
                        {el.type} - {el.id.substring(0, 15)}...
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500 mt-1">
                  Sélectionnez l'élément à afficher/masquer
                </p>
              </div>
            </>
          )}

          {actionType === 'custom-code' && (
            <div>
              <Label>Code JavaScript</Label>
              <textarea 
                className="w-full h-32 p-2 border rounded font-mono text-sm"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="element.style.color = 'red';"
              />
              <p className="text-xs text-slate-500 mt-1">
                Variables disponibles: element, gsap
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 p-4 border-t">
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={handleSave}>Enregistrer</Button>
        </div>
      </div>
    </div>
  );
}
