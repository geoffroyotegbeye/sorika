'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface ShadowPresetsProps {
  onSelect: (shadow: string) => void;
  currentValue?: string;
}

const SHADOW_PRESETS = [
  { name: 'None', value: 'none' },
  { name: 'Small', value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
  { name: 'Medium', value: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
  { name: 'Large', value: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' },
  { name: 'XL', value: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
  { name: 'Inner', value: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)' },
];

export function ShadowPresets({ onSelect, currentValue }: ShadowPresetsProps) {
  return (
    <div className="space-y-2">
      <Label className="text-xs">Presets</Label>
      <div className="grid grid-cols-3 gap-2">
        {SHADOW_PRESETS.map((preset) => (
          <Button
            key={preset.name}
            type="button"
            variant={currentValue === preset.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSelect(preset.value)}
            className="text-xs"
          >
            {preset.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
