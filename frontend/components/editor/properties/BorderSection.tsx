'use client';

import { Label } from '@/components/ui/label';
import { ColorPicker } from './ColorPicker';
import { UnitInput } from './UnitInput';

interface BorderSectionProps {
  styles: any;
  onStyleChange: (property: string, value: string) => void;
}

export function BorderSection({ styles, onStyleChange }: BorderSectionProps) {
  return (
    <div className="space-y-4">

      <div>
        <Label className="text-xs">Border Radius</Label>
        <UnitInput
          value={styles.borderRadius}
          onChange={(v) => onStyleChange('borderRadius', v)}
          defaultUnit="px"
          units={['px', 'rem', '%', 'em']}
        />
      </div>

      <div>
        <Label className="text-xs">Border Width</Label>
        <UnitInput
          value={styles.borderWidth}
          onChange={(v) => onStyleChange('borderWidth', v)}
          defaultUnit="px"
          units={['px', 'rem', 'em']}
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
