'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ShadowPresets } from './ShadowPresets';
import { RotateCw, Move, ZoomIn } from 'lucide-react';
import { useState } from 'react';

interface EffectsSectionProps {
  styles: any;
  onStyleChange: (property: string, value: string) => void;
}

export function EffectsSection({ styles, onStyleChange }: EffectsSectionProps) {
  const opacity = parseFloat(styles.opacity || '1');
  const [transformType, setTransformType] = useState<'rotate' | 'scale' | 'translate'>('rotate');
  const [rotateValue, setRotateValue] = useState(0);
  const [scaleValue, setScaleValue] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  const applyTransform = () => {
    let transform = '';
    if (transformType === 'rotate') {
      transform = `rotate(${rotateValue}deg)`;
    } else if (transformType === 'scale') {
      transform = `scale(${scaleValue})`;
    } else if (transformType === 'translate') {
      transform = `translate(${translateX}px, ${translateY}px)`;
    }
    onStyleChange('transform', transform);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs mb-2 block">Opacity: {Math.round(opacity * 100)}%</Label>
        <Slider
          value={[opacity]}
          onValueChange={([value]) => onStyleChange('opacity', value.toString())}
          min={0}
          max={1}
          step={0.01}
          className="w-full"
        />
      </div>

      <div>
        <Label className="text-xs mb-2 block">Box Shadow</Label>
        <ShadowPresets
          currentValue={styles.boxShadow}
          onSelect={(val) => onStyleChange('boxShadow', val)}
        />
      </div>

      <div>
        <Label className="text-xs mb-2 block">Transform</Label>
        <div className="grid grid-cols-3 gap-1 mb-2">
          <Button
            variant={transformType === 'rotate' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTransformType('rotate')}
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button
            variant={transformType === 'scale' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTransformType('scale')}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant={transformType === 'translate' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTransformType('translate')}
          >
            <Move className="h-4 w-4" />
          </Button>
        </div>

        {transformType === 'rotate' && (
          <div>
            <Label className="text-xs">Rotation (deg)</Label>
            <Input
              type="number"
              value={rotateValue}
              onChange={(e) => setRotateValue(Number(e.target.value))}
              onBlur={applyTransform}
              className="h-8 text-xs mt-1"
            />
          </div>
        )}

        {transformType === 'scale' && (
          <div>
            <Label className="text-xs">Scale</Label>
            <Input
              type="number"
              value={scaleValue}
              onChange={(e) => setScaleValue(Number(e.target.value))}
              onBlur={applyTransform}
              step="0.1"
              min="0.1"
              className="h-8 text-xs mt-1"
            />
          </div>
        )}

        {transformType === 'translate' && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">X (px)</Label>
              <Input
                type="number"
                value={translateX}
                onChange={(e) => setTranslateX(Number(e.target.value))}
                onBlur={applyTransform}
                className="h-8 text-xs mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Y (px)</Label>
              <Input
                type="number"
                value={translateY}
                onChange={(e) => setTranslateY(Number(e.target.value))}
                onBlur={applyTransform}
                className="h-8 text-xs mt-1"
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <Label className="text-xs mb-2 block">Transition</Label>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStyleChange('transition', 'all 0.2s ease')}
          >
            Fast
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStyleChange('transition', 'all 0.3s ease')}
          >
            Normal
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStyleChange('transition', 'all 0.5s ease')}
          >
            Slow
          </Button>
        </div>
      </div>

      <div>
        <Label className="text-xs">Cursor</Label>
        <select
          className="w-full h-9 px-3 rounded-md border text-sm mt-1"
          value={styles.cursor || 'default'}
          onChange={(e) => onStyleChange('cursor', e.target.value)}
        >
          <option value="default">Default</option>
          <option value="pointer">Pointer</option>
          <option value="text">Text</option>
          <option value="move">Move</option>
          <option value="not-allowed">Not Allowed</option>
          <option value="grab">Grab</option>
        </select>
      </div>
    </div>
  );
}
