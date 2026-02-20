'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ColorPicker } from './ColorPicker';
import { useState } from 'react';

interface BorderSectionProps {
  styles: any;
  onStyleChange: (property: string, value: string) => void;
}

export function BorderSection({ styles, onStyleChange }: BorderSectionProps) {
  const [unit, setUnit] = useState('px');

  const parseValue = (value: string) => {
    if (!value) return 0;
    return parseInt(value) || 0;
  };

  const handleChange = (property: string, numValue: string) => {
    const val = numValue === '' ? '0' : numValue;
    onStyleChange(property, `${val}${unit}`);
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
          <option value="rem">rem</option>
          <option value="%">%</option>
        </select>
      </div>

      <div>
        <Label className="text-xs">Border Radius</Label>
        <Input
          type="number"
          value={parseValue(styles.borderRadius)}
          onChange={(e) => handleChange('borderRadius', e.target.value)}
          className="h-9 text-xs mt-1"
          min="0"
        />
      </div>

      <div>
        <Label className="text-xs">Border Width</Label>
        <Input
          type="number"
          value={parseValue(styles.borderWidth)}
          onChange={(e) => handleChange('borderWidth', e.target.value)}
          className="h-9 text-xs mt-1"
          min="0"
        />
      </div>

      <div>
        <Label className="text-xs">Border Style</Label>
        <select
          className="w-full h-9 px-3 rounded-md border text-sm mt-1"
          value={styles.borderStyle || 'solid'}
          onChange={(e) => onStyleChange('borderStyle', e.target.value)}
        >
          <option value="none">None</option>
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
          <option value="double">Double</option>
        </select>
      </div>

      <ColorPicker
        label="Border Color"
        value={styles.borderColor || '#000000'}
        onChange={(val) => onStyleChange('borderColor', val)}
      />
    </div>
  );
}
