'use client';

import { Label } from '@/components/ui/label';
import { UnitInput } from './UnitInput';

interface SizeSectionProps {
  styles: any;
  onStyleChange: (property: string, value: string) => void;
}

export function SizeSection({ styles, onStyleChange }: SizeSectionProps) {
  return (
    <div className="space-y-4">

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Width</Label>
          <UnitInput
            value={styles.width}
            onChange={(v) => onStyleChange('width', v)}
            defaultUnit="px"
            units={['px', '%', 'rem', 'em', 'vw', 'auto']}
          />
        </div>
        <div>
          <Label className="text-xs">Height</Label>
          <UnitInput
            value={styles.height}
            onChange={(v) => onStyleChange('height', v)}
            defaultUnit="px"
            units={['px', '%', 'rem', 'em', 'vh', 'auto']}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Min Width</Label>
          <UnitInput
            value={styles.minWidth}
            onChange={(v) => onStyleChange('minWidth', v)}
            defaultUnit="px"
            units={['px', '%', 'rem', 'em', 'vw', 'auto']}
          />
        </div>
        <div>
          <Label className="text-xs">Min Height</Label>
          <UnitInput
            value={styles.minHeight}
            onChange={(v) => onStyleChange('minHeight', v)}
            defaultUnit="px"
            units={['px', '%', 'rem', 'em', 'vh', 'auto']}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Max Width</Label>
          <UnitInput
            value={styles.maxWidth}
            onChange={(v) => onStyleChange('maxWidth', v)}
            defaultUnit="px"
            units={['px', '%', 'rem', 'em', 'vw', 'auto']}
          />
        </div>
        <div>
          <Label className="text-xs">Max Height</Label>
          <UnitInput
            value={styles.maxHeight}
            onChange={(v) => onStyleChange('maxHeight', v)}
            defaultUnit="px"
            units={['px', '%', 'rem', 'em', 'vh', 'auto']}
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
