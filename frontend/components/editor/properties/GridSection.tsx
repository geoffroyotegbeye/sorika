'use client';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Grid3x3, Grid2x2, LayoutGrid } from 'lucide-react';

interface GridSectionProps {
  styles: any;
  onStyleChange: (property: string, value: string) => void;
}

export function GridSection({ styles, onStyleChange }: GridSectionProps) {
  const currentCols = (styles.gridTemplateColumns || '1fr').split(' ').length;

  const setColumns = (cols: number) => {
    onStyleChange('gridTemplateColumns', `repeat(${cols}, 1fr)`);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Colonnes</Label>
        <div className="grid grid-cols-4 gap-2">
          <Button
            type="button"
            variant={currentCols === 1 ? 'default' : 'outline'}
            size="sm"
            onClick={() => setColumns(1)}
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="text-xs">1</span>
          </Button>
          <Button
            type="button"
            variant={currentCols === 2 ? 'default' : 'outline'}
            size="sm"
            onClick={() => setColumns(2)}
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <Grid2x2 className="h-4 w-4" />
            <span className="text-xs">2</span>
          </Button>
          <Button
            type="button"
            variant={currentCols === 3 ? 'default' : 'outline'}
            size="sm"
            onClick={() => setColumns(3)}
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <Grid3x3 className="h-4 w-4" />
            <span className="text-xs">3</span>
          </Button>
          <Button
            type="button"
            variant={currentCols === 4 ? 'default' : 'outline'}
            size="sm"
            onClick={() => setColumns(4)}
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <Grid3x3 className="h-4 w-4" />
            <span className="text-xs">4</span>
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Gap (espacement)</Label>
        <div className="grid grid-cols-4 gap-2">
          {['0px', '8px', '16px', '24px', '32px'].map((gap) => (
            <Button
              key={gap}
              type="button"
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

      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          💡 <strong>Astuce :</strong> Changez de breakpoint (Desktop/Tablet/Mobile) pour définir un nombre de colonnes différent sur chaque appareil.
        </p>
      </div>
    </div>
  );
}
