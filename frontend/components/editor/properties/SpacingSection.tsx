'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Link2, Unlink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SpacingSectionProps {
  styles: any;
  onStyleChange: (property: string, value: string) => void;
}

export function SpacingSection({ styles, onStyleChange }: SpacingSectionProps) {
  const [unit, setUnit] = useState('rem');
  const [marginLinked, setMarginLinked] = useState(true);
  const [paddingLinked, setPaddingLinked] = useState(true);

  const parseValue = (value: string) => {
    if (!value) return 0;
    return parseInt(value) || 0;
  };

  const handleChange = (property: string, numValue: string) => {
    const val = numValue === '' ? '0' : numValue;
    onStyleChange(property, `${val}${unit}`);
  };

  const handleLinkedChange = (type: 'margin' | 'padding', numValue: string) => {
    const val = numValue === '' ? '0' : numValue;
    const value = `${val}${unit}`;
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
      {/* Unit Selector */}
      <div className="flex items-center gap-2">
        <Label className="text-xs text-slate-500">Unité:</Label>
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="h-7 px-2 rounded border text-xs bg-white"
        >
          <option value="rem">rem</option>
          <option value="px">px</option>
          <option value="%">%</option>
          <option value="em">em</option>
        </select>
      </div>

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
            <Input
              type="number"
              value={parseValue(styles.marginTop)}
              onChange={(e) => handleLinkedChange('margin', e.target.value)}
              className="h-8 text-xs mt-1"
            />
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            <div>
              <Label className="text-xs">Top</Label>
              <Input
                type="number"
                value={parseValue(styles.marginTop)}
                onChange={(e) => handleChange('marginTop', e.target.value)}
                className="h-8 text-xs mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Right</Label>
              <Input
                type="number"
                value={parseValue(styles.marginRight)}
                onChange={(e) => handleChange('marginRight', e.target.value)}
                className="h-8 text-xs mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Bottom</Label>
              <Input
                type="number"
                value={parseValue(styles.marginBottom)}
                onChange={(e) => handleChange('marginBottom', e.target.value)}
                className="h-8 text-xs mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Left</Label>
              <Input
                type="number"
                value={parseValue(styles.marginLeft)}
                onChange={(e) => handleChange('marginLeft', e.target.value)}
                className="h-8 text-xs mt-1"
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
            <Input
              type="number"
              value={parseValue(styles.paddingTop)}
              onChange={(e) => handleLinkedChange('padding', e.target.value)}
              className="h-8 text-xs mt-1"
            />
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            <div>
              <Label className="text-xs">Top</Label>
              <Input
                type="number"
                value={parseValue(styles.paddingTop)}
                onChange={(e) => handleChange('paddingTop', e.target.value)}
                className="h-8 text-xs mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Right</Label>
              <Input
                type="number"
                value={parseValue(styles.paddingRight)}
                onChange={(e) => handleChange('paddingRight', e.target.value)}
                className="h-8 text-xs mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Bottom</Label>
              <Input
                type="number"
                value={parseValue(styles.paddingBottom)}
                onChange={(e) => handleChange('paddingBottom', e.target.value)}
                className="h-8 text-xs mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Left</Label>
              <Input
                type="number"
                value={parseValue(styles.paddingLeft)}
                onChange={(e) => handleChange('paddingLeft', e.target.value)}
                className="h-8 text-xs mt-1"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
