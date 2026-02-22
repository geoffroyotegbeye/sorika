'use client';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Link2, Unlink } from 'lucide-react';
import { UnitInput } from './UnitInput';

interface SpacingSectionProps {
  styles: any;
  onStyleChange: (property: string, value: string) => void;
}

export function SpacingSection({ styles, onStyleChange }: SpacingSectionProps) {
  const [marginLinked, setMarginLinked] = useState(true);
  const [paddingLinked, setPaddingLinked] = useState(true);

  const parseValue = (value: string) => {
    if (!value) return '';
    return value;
  };

  const handleLinkedChange = (type: 'margin' | 'padding', value: string) => {
    if (type === 'margin') {
      onStyleChange('marginTop', value);
      onStyleChange('marginRight', value);
      onStyleChange('marginBottom', value);
      onStyleChange('marginLeft', value);
    } else {
      onStyleChange('paddingTop', value);
      onStyleChange('paddingRight', value);
      onStyleChange('paddingBottom', value);
      onStyleChange('paddingLeft', value);
    }
  };

  return (
    <div className="space-y-4">

      {/* Margin */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-xs text-slate-500 uppercase">Margin</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setMarginLinked(!marginLinked)}
            className="h-6 w-6 p-0"
            title={marginLinked ? 'Délier les valeurs' : 'Lier les valeurs'}
          >
            {marginLinked ? <Link2 className="h-3 w-3" /> : <Unlink className="h-3 w-3" />}
          </Button>
        </div>
        {marginLinked ? (
          <div>
            <Label className="text-xs">Tous les côtés</Label>
            <UnitInput
              value={parseValue(styles.marginTop)}
              onChange={(v) => handleLinkedChange('margin', v)}
              defaultUnit="px"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Top</Label>
              <UnitInput
                value={parseValue(styles.marginTop)}
                onChange={(v) => onStyleChange('marginTop', v)}
                defaultUnit="px"
              />
            </div>
            <div>
              <Label className="text-xs">Right</Label>
              <UnitInput
                value={parseValue(styles.marginRight)}
                onChange={(v) => onStyleChange('marginRight', v)}
                defaultUnit="px"
              />
            </div>
            <div>
              <Label className="text-xs">Bottom</Label>
              <UnitInput
                value={parseValue(styles.marginBottom)}
                onChange={(v) => onStyleChange('marginBottom', v)}
                defaultUnit="px"
              />
            </div>
            <div>
              <Label className="text-xs">Left</Label>
              <UnitInput
                value={parseValue(styles.marginLeft)}
                onChange={(v) => onStyleChange('marginLeft', v)}
                defaultUnit="px"
              />
            </div>
          </div>
        )}
      </div>

      {/* Padding */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-xs text-slate-500 uppercase">Padding</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setPaddingLinked(!paddingLinked)}
            className="h-6 w-6 p-0"
            title={paddingLinked ? 'Délier les valeurs' : 'Lier les valeurs'}
          >
            {paddingLinked ? <Link2 className="h-3 w-3" /> : <Unlink className="h-3 w-3" />}
          </Button>
        </div>
        {paddingLinked ? (
          <div>
            <Label className="text-xs">Tous les côtés</Label>
            <UnitInput
              value={parseValue(styles.paddingTop)}
              onChange={(v) => handleLinkedChange('padding', v)}
              defaultUnit="px"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Top</Label>
              <UnitInput
                value={parseValue(styles.paddingTop)}
                onChange={(v) => onStyleChange('paddingTop', v)}
                defaultUnit="px"
              />
            </div>
            <div>
              <Label className="text-xs">Right</Label>
              <UnitInput
                value={parseValue(styles.paddingRight)}
                onChange={(v) => onStyleChange('paddingRight', v)}
                defaultUnit="px"
              />
            </div>
            <div>
              <Label className="text-xs">Bottom</Label>
              <UnitInput
                value={parseValue(styles.paddingBottom)}
                onChange={(v) => onStyleChange('paddingBottom', v)}
                defaultUnit="px"
              />
            </div>
            <div>
              <Label className="text-xs">Left</Label>
              <UnitInput
                value={parseValue(styles.paddingLeft)}
                onChange={(v) => onStyleChange('paddingLeft', v)}
                defaultUnit="px"
              />
            </div>
          </div>
        )}
      </div>

      {/* Position (Top, Right, Bottom, Left) */}
      <div>
        <Label className="text-xs text-slate-500 uppercase mb-2 block">Position</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Top</Label>
            <UnitInput
              value={parseValue(styles.top)}
              onChange={(v) => onStyleChange('top', v)}
              defaultUnit="px"
              units={['px', '%', 'rem', 'em', 'vh', 'auto']}
            />
          </div>
          <div>
            <Label className="text-xs">Right</Label>
            <UnitInput
              value={parseValue(styles.right)}
              onChange={(v) => onStyleChange('right', v)}
              defaultUnit="px"
              units={['px', '%', 'rem', 'em', 'vw', 'auto']}
            />
          </div>
          <div>
            <Label className="text-xs">Bottom</Label>
            <UnitInput
              value={parseValue(styles.bottom)}
              onChange={(v) => onStyleChange('bottom', v)}
              defaultUnit="px"
              units={['px', '%', 'rem', 'em', 'vh', 'auto']}
            />
          </div>
          <div>
            <Label className="text-xs">Left</Label>
            <UnitInput
              value={parseValue(styles.left)}
              onChange={(v) => onStyleChange('left', v)}
              defaultUnit="px"
              units={['px', '%', 'rem', 'em', 'vw', 'auto']}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
