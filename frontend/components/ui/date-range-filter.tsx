'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CalendarDays } from 'lucide-react';

export type DateRange = { from: string; to: string } | null;

type PresetKey = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom' | 'all';

const getPresetRange = (key: PresetKey): DateRange => {
  const now = new Date();
  switch (key) {
    case 'today': {
      const d = now.toISOString().split('T')[0];
      return { from: d, to: d };
    }
    case 'week': {
      const day = now.getDay() || 7;
      const mon = new Date(now); mon.setDate(now.getDate() - day + 1);
      const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
      return { from: mon.toISOString().split('T')[0], to: sun.toISOString().split('T')[0] };
    }
    case 'month': {
      const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const to   = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
      return { from, to };
    }
    case 'quarter': {
      const q = Math.floor(now.getMonth() / 3);
      const from = new Date(now.getFullYear(), q * 3, 1).toISOString().split('T')[0];
      const to   = new Date(now.getFullYear(), q * 3 + 3, 0).toISOString().split('T')[0];
      return { from, to };
    }
    case 'year': {
      const y = now.getFullYear();
      return { from: `${y}-01-01`, to: `${y}-12-31` };
    }
    default:
      return null;
  }
};

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [selected, setSelected] = useState<PresetKey>('all');

  const handleSelect = (key: string) => {
    const k = key as PresetKey;
    setSelected(k);
    if (k !== 'custom') {
      onChange(getPresetRange(k));
    }
  };

  const handleCustomApply = () => {
    if (customFrom && customTo && customFrom <= customTo) {
      onChange({ from: customFrom, to: customTo });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <CalendarDays className="h-4 w-4 text-slate-400 shrink-0" />
      <Select value={selected} onValueChange={handleSelect}>
        <SelectTrigger className="h-8 w-44 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les périodes</SelectItem>
          <SelectItem value="today">Aujourd'hui</SelectItem>
          <SelectItem value="week">Cette semaine</SelectItem>
          <SelectItem value="month">Ce mois</SelectItem>
          <SelectItem value="quarter">Ce trimestre</SelectItem>
          <SelectItem value="year">Cette année</SelectItem>
          <SelectItem value="custom">Période personnalisée…</SelectItem>
        </SelectContent>
      </Select>

      {selected === 'custom' && (
        <>
          <Input
            type="date"
            value={customFrom}
            onChange={e => setCustomFrom(e.target.value)}
            className="h-8 text-sm w-36"
          />
          <span className="text-slate-400 text-xs">—</span>
          <Input
            type="date"
            value={customTo}
            onChange={e => setCustomTo(e.target.value)}
            className="h-8 text-sm w-36"
          />
          <Button size="sm" className="h-8 text-xs px-3" onClick={handleCustomApply}>
            OK
          </Button>
        </>
      )}
    </div>
  );
}
