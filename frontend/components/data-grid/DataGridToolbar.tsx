'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ReactNode } from 'react';

interface DataGridToolbarProps {
  search: string;
  onSearch: (value: string) => void;
  searchPlaceholder?: string;
  toolbar?: ReactNode;
  totalRows: number;
  filteredRows: number;
}

export function DataGridToolbar({
  search,
  onSearch,
  searchPlaceholder = 'Rechercher...',
  toolbar,
  totalRows,
  filteredRows,
}: DataGridToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 pb-4">
      {/* Recherche */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-9 pr-9"
        />
        {search && (
          <button
            onClick={() => onSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* Compteur */}
        {search && (
          <span className="text-sm text-muted-foreground">
            {filteredRows} / {totalRows} résultats
          </span>
        )}
        {/* Actions personnalisées */}
        {toolbar}
      </div>
    </div>
  );
}
