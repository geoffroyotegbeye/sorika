'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface SizeSectionProps {
  styles: any;
  onStyleChange: (property: string, value: string) => void;
}

export function SizeSection({ styles, onStyleChange }: SizeSectionProps) {
  const [unit, setUnit] = useState('px');

  const parseValue = (value: string) => {
    if (!value || value === 'auto' || value === 'none') return '';
    return parseInt(value) || '';
  };

  const handleChange = (property: string, numValue: string) => {
    if (numValue === '') {
      onStyleChange(property, 'auto');
    } else {
      onStyleChange(property, `${numValue}${unit}`);
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
          <option value="px">px</option>
          <option value="%">%</option>
          <option value="rem">rem</option>
          <option value="em">em</option>
          <option value="vh">vh</option>
          <option value="vw">vw</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Width</Label>
          <Input
            type="number"
            value={parseValue(styles.width)}
            onChange={(e) => handleChange('width', e.target.value)}
            placeholder="auto"
            className="h-8 text-xs mt-1"
            min="0"
          />
        </div>
        <div>
          <Label className="text-xs">Height</Label>
          <Input
            type="number"
            value={parseValue(styles.height)}
            onChange={(e) => handleChange('height', e.target.value)}
            placeholder="auto"
            className="h-8 text-xs mt-1"
            min="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Min Width</Label>
          <Input
            type="number"
            value={parseValue(styles.minWidth)}
            onChange={(e) => handleChange('minWidth', e.target.value)}
            placeholder="0"
            className="h-8 text-xs mt-1"
            min="0"
          />
        </div>
        <div>
          <Label className="text-xs">Min Height</Label>
          <Input
            type="number"
            value={parseValue(styles.minHeight)}
            onChange={(e) => handleChange('minHeight', e.target.value)}
            placeholder="0"
            className="h-8 text-xs mt-1"
            min="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Max Width</Label>
          <Input
            type="number"
            value={parseValue(styles.maxWidth)}
            onChange={(e) => handleChange('maxWidth', e.target.value)}
            placeholder="none"
            className="h-8 text-xs mt-1"
            min="0"
          />
        </div>
        <div>
          <Label className="text-xs">Max Height</Label>
          <Input
            type="number"
            value={parseValue(styles.maxHeight)}
            onChange={(e) => handleChange('maxHeight', e.target.value)}
            placeholder="none"
            className="h-8 text-xs mt-1"
            min="0"
          />
        </div>
      </div>

      <div>
        <Label className="text-xs">Overflow</Label>
        <select
          className="w-full h-9 px-3 rounded-md border text-sm mt-1"
          value={styles.overflow || 'visible'}
          onChange={(e) => onStyleChange('overflow', e.target.value)}
        >
          <option value="visible">Visible</option>
          <option value="hidden">Hidden</option>
          <option value="scroll">Scroll</option>
          <option value="auto">Auto</option>
        </select>
      </div>
    </div>
  );
}
