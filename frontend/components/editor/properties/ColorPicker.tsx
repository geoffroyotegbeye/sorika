'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pipette, Palette } from 'lucide-react';
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

const COLOR_PALETTES = [
  { name: 'Velours Nuit', colors: ['#0F172A', '#1E293B', '#334155', '#64748B', '#F8FAFC'] },
  { name: 'Crème & Or', colors: ['#FFF7ED', '#FED7AA', '#FDBA74', '#FB923C', '#7C2D12'] },
  { name: 'Émeraude Doux', colors: ['#022C22', '#065F46', '#10B981', '#6EE7B7', '#ECFDF5'] },
  { name: 'Indigo Royal', colors: ['#1E1B4B', '#312E81', '#4F46E5', '#A5B4FC', '#EEF2FF'] },
  { name: 'Sable Moderne', colors: ['#292524', '#57534E', '#A8A29E', '#E7E5E4', '#FAFAF9'] },
  { name: 'Rosé Premium', colors: ['#4C0519', '#9D174D', '#EC4899', '#F9A8D4', '#FDF2F8'] },
  { name: 'Océan Minimal', colors: ['#082F49', '#0369A1', '#0EA5E9', '#7DD3FC', '#F0F9FF'] },
  { name: 'Forêt Luxe', colors: ['#052E16', '#166534', '#22C55E', '#86EFAC', '#F0FDF4'] },
  { name: 'Café Designer', colors: ['#1C1917', '#44403C', '#78716C', '#D6D3D1', '#FAFAF9'] },
  { name: 'Lavande Digitale', colors: ['#2E1065', '#6D28D9', '#A78BFA', '#DDD6FE', '#F5F3FF'] },
  { name: 'Dark Neon', colors: ['#020617', '#0F172A', '#22C55E', '#38BDF8', '#E2E8F0'] },
  { name: 'Glacier Soft', colors: ['#083344', '#0891B2', '#22D3EE', '#A5F3FC', '#ECFEFF'] },
  { name: 'Graphite Pro', colors: ['#09090B', '#27272A', '#52525B', '#A1A1AA', '#FAFAFA'] },
  { name: 'Sunset UI', colors: ['#431407', '#C2410C', '#FB923C', '#FDBA74', '#FFF7ED'] },
  { name: 'Arctic Clean', colors: ['#0C4A6E', '#0284C7', '#38BDF8', '#BAE6FD', '#F0F9FF'] },
  { name: 'Minimal Peach', colors: ['#431407', '#EA580C', '#FDBA74', '#FED7AA', '#FFFBEB'] },
  { name: 'Noir & Champagne', colors: ['#0A0A0A', '#262626', '#D4AF37', '#F5E6C4', '#FAFAFA'] },
  { name: 'Bleu Impérial', colors: ['#172554', '#1D4ED8', '#60A5FA', '#BFDBFE', '#EFF6FF'] },
  { name: 'Bronze Chic', colors: ['#1C1917', '#92400E', '#D97706', '#FBBF24', '#FFFBEB'] },
  { name: 'Rubis Moderne', colors: ['#450A0A', '#B91C1C', '#EF4444', '#FCA5A5', '#FEF2F2'] },
  { name: 'Pastel Pro', colors: ['#334155', '#64748B', '#94A3B8', '#CBD5E1', '#F8FAFC'] },
  { name: 'Menthe Soft', colors: ['#064E3B', '#059669', '#34D399', '#A7F3D0', '#ECFDF5'] },
  { name: 'Aurore Gradient', colors: ['#0F172A', '#9333EA', '#EC4899', '#F472B6', '#FAE8FF'] },
  { name: 'Nuage Moderne', colors: ['#111827', '#374151', '#9CA3AF', '#E5E7EB', '#FFFFFF'] },
];

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const [showModal, setShowModal] = useState(false);

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
          onClick={async () => {
            if ('EyeDropper' in window) {
              try {
                // @ts-ignore
                const eyeDropper = new EyeDropper();
                const result = await eyeDropper.open();
                onChange(result.sRGBHex);
              } catch (e) {}
            }
          }}
          className="h-9 w-9"
          title="Pipette"
          disabled={!('EyeDropper' in window)}
        >
          <Pipette className="h-4 w-4" />
        </Button>
      </div>

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

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setShowModal(true)}
        className="w-full gap-2"
      >
        <Palette className="h-4 w-4" />
        Afficher plus de palettes
      </Button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg shadow-xl w-[600px] max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h3 className="font-semibold">Palettes de couleurs</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            <div className="p-4 space-y-3">
              {COLOR_PALETTES.map((palette) => (
                <div key={palette.name} className="border rounded-lg p-3 hover:border-blue-500 transition">
                  <div className="text-xs font-medium text-slate-600 mb-2">{palette.name}</div>
                  <div className="flex gap-1">
                    {palette.colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => {
                          onChange(color);
                          setShowModal(false);
                        }}
                        className="flex-1 h-12 rounded border-2 border-slate-200 hover:border-blue-500 transition"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
