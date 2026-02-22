'use client';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GridSelector } from './GridSelector';
import { Monitor, Smartphone, Tablet, Grid3x3, Box, Layers } from 'lucide-react';

interface LayoutSectionProps {
  styles: any;
  onStyleChange: (property: string, value: string) => void;
}

export function LayoutSection({ styles, onStyleChange }: LayoutSectionProps) {
  const displayOptions = [
    { value: 'block', label: 'Block', icon: Box },
    { value: 'flex', label: 'Flex', icon: Layers },
    { value: 'grid', label: 'Grid', icon: Grid3x3 },
    { value: 'none', label: 'None', icon: Monitor },
  ];

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs text-slate-500 uppercase mb-2 block">Position</Label>
        <select
          className="w-full h-9 px-3 rounded-md border text-sm"
          value={styles.position || 'static'}
          onChange={(e) => onStyleChange('position', e.target.value)}
        >
          <option value="static">Static</option>
          <option value="relative">Relative</option>
          <option value="absolute">Absolute</option>
          <option value="fixed">Fixed</option>
          <option value="sticky">Sticky</option>
        </select>
      </div>

      <div>
        <Label className="text-xs text-slate-500 uppercase mb-2 block">Display</Label>
        <div className="grid grid-cols-4 gap-1">
          {displayOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Button
                key={option.value}
                variant={styles.display === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => onStyleChange('display', option.value)}
                className="flex flex-col items-center gap-1 h-auto py-2"
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{option.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {styles.display === 'flex' && (
        <>
          <div>
            <Label className="text-xs">Flex Direction</Label>
            <select
              className="w-full h-9 px-3 rounded-md border text-sm mt-1"
              value={styles.flexDirection || 'row'}
              onChange={(e) => onStyleChange('flexDirection', e.target.value)}
            >
              <option value="row">Row</option>
              <option value="column">Column</option>
              <option value="row-reverse">Row Reverse</option>
              <option value="column-reverse">Column Reverse</option>
            </select>
          </div>

          <div>
            <Label className="text-xs">Justify Content</Label>
            <select
              className="w-full h-9 px-3 rounded-md border text-sm mt-1"
              value={styles.justifyContent || 'flex-start'}
              onChange={(e) => onStyleChange('justifyContent', e.target.value)}
            >
              <option value="flex-start">Start</option>
              <option value="center">Center</option>
              <option value="flex-end">End</option>
              <option value="space-between">Space Between</option>
              <option value="space-around">Space Around</option>
              <option value="space-evenly">Space Evenly</option>
            </select>
          </div>

          <div>
            <Label className="text-xs">Align Items</Label>
            <select
              className="w-full h-9 px-3 rounded-md border text-sm mt-1"
              value={styles.alignItems || 'stretch'}
              onChange={(e) => onStyleChange('alignItems', e.target.value)}
            >
              <option value="stretch">Stretch</option>
              <option value="flex-start">Start</option>
              <option value="center">Center</option>
              <option value="flex-end">End</option>
              <option value="baseline">Baseline</option>
            </select>
          </div>

          <div>
            <Label className="text-xs">Gap (px)</Label>
            <input
              type="number"
              className="w-full h-9 px-3 rounded-md border text-sm mt-1"
              value={parseInt(styles.gap) || 0}
              onChange={(e) => onStyleChange('gap', `${e.target.value}px`)}
              placeholder="20"
              min="0"
              step="1"
            />
          </div>
        </>
      )}

      {styles.display === 'grid' && (
        <>
          <GridSelector
            columns={parseInt((styles.gridTemplateColumns || '1fr').split(' ').length.toString())}
            rows={parseInt((styles.gridTemplateRows || 'auto').split(' ').length.toString())}
            onColumnsChange={(cols) => onStyleChange('gridTemplateColumns', Array(cols).fill('1fr').join(' '))}
            onRowsChange={(rows) => onStyleChange('gridTemplateRows', Array(rows).fill('auto').join(' '))}
          />

          <div>
            <Label className="text-xs mb-2 block">Largeur des colonnes</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={styles.gridTemplateColumns?.includes('1fr 1fr 1fr') ? 'default' : 'outline'}
                size="sm"
                onClick={() => onStyleChange('gridTemplateColumns', '1fr 1fr 1fr')}
                className="text-xs"
              >
                Égales
              </Button>
              <Button
                variant={styles.gridTemplateColumns?.includes('2fr 1fr') ? 'default' : 'outline'}
                size="sm"
                onClick={() => onStyleChange('gridTemplateColumns', '2fr 1fr 1fr')}
                className="text-xs"
              >
                Large + 2
              </Button>
              <Button
                variant={styles.gridTemplateColumns?.includes('1fr 2fr') ? 'default' : 'outline'}
                size="sm"
                onClick={() => onStyleChange('gridTemplateColumns', '1fr 2fr 1fr')}
                className="text-xs"
              >
                Milieu large
              </Button>
            </div>
            <Input
              type="text"
              className="h-9 px-3 rounded-md border text-xs mt-2"
              value={styles.gridTemplateColumns || '1fr'}
              onChange={(e) => onStyleChange('gridTemplateColumns', e.target.value)}
              placeholder="1fr 2fr 1fr"
            />
            <p className="text-xs text-slate-500 mt-1">
              Avancé: 1fr = flexible, 200px = fixe
            </p>
          </div>

          <div>
            <Label className="text-xs">Espacement - Gap (px)</Label>
            <div className="grid grid-cols-4 gap-1 mt-1">
              {['0px', '10px', '20px', '30px'].map((gap) => (
                <Button
                  key={gap}
                  variant={styles.gap === gap ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onStyleChange('gap', gap)}
                  className="text-xs"
                >
                  {gap}
                </Button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
