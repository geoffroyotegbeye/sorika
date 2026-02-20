'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pipette } from 'lucide-react';
import { useState } from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const PRESET_COLORS = [
  '#000000', '#ffffff', '#f87171', '#fb923c', '#fbbf24', '#facc15',
  '#a3e635', '#4ade80', '#34d399', '#2dd4bf', '#22d3ee', '#38bdf8',
  '#60a5fa', '#818cf8', '#a78bfa', '#c084fc', '#e879f9', '#f472b6',
  '#fb7185', '#94a3b8', '#64748b', '#475569', '#334155', '#1e293b',
];

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const [showPalette, setShowPalette] = useState(false);

  const handleEyeDropper = async () => {
    if ('EyeDropper' in window) {
      try {
        // @ts-ignore
        const eyeDropper = new EyeDropper();
        const result = await eyeDropper.open();
        onChange(result.sRGBHex);
      } catch (e) {
        // Pipette annulée par l'utilisateur - ne rien faire
      }
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-xs">{label}</label>}
      
      <div className="flex gap-2">
        <Input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-9 p-1 cursor-pointer"
        />
        <Input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 h-9 text-xs font-mono"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleEyeDropper}
          className="h-9 w-9"
          title="Pipette"
          disabled={!('EyeDropper' in window)}
        >
          <Pipette className="h-4 w-4" />
        </Button>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setShowPalette(!showPalette)}
        className="w-full text-xs"
      >
        {showPalette ? 'Masquer' : 'Afficher'} la palette
      </Button>

      {showPalette && (
        <div className="grid grid-cols-8 gap-1 p-2 bg-slate-50 rounded-md">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              className="w-6 h-6 rounded border-2 border-slate-200 hover:border-blue-500 transition"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      )}
    </div>
  );
}
