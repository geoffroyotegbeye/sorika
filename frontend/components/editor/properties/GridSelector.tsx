'use client';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface GridSelectorProps {
  columns: number;
  rows: number;
  onColumnsChange: (cols: number) => void;
  onRowsChange: (rows: number) => void;
}

export function GridSelector({ columns, rows, onColumnsChange, onRowsChange }: GridSelectorProps) {
  const renderGrid = (count: number, type: 'columns' | 'rows') => {
    return (
      <div className="flex flex-wrap gap-1">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <Button
            key={num}
            type="button"
            variant={count === num ? 'default' : 'outline'}
            size="sm"
            onClick={() => type === 'columns' ? onColumnsChange(num) : onRowsChange(num)}
            className="w-8 h-8 p-0"
          >
            {num}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs mb-2 block">Colonnes: {columns}</Label>
        {renderGrid(columns, 'columns')}
      </div>

      <div>
        <Label className="text-xs mb-2 block">Lignes: {rows}</Label>
        {renderGrid(rows, 'rows')}
      </div>

      <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded">
        Grid: {columns} × {rows}
      </div>
    </div>
  );
}
