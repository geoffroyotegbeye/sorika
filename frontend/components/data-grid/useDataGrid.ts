import { useState, useMemo, useCallback } from 'react';
import { SortState, DataGridColumn } from './types';

interface UseDataGridOptions<T> {
  data: T[];
  columns: DataGridColumn<T>[];
  pageSize?: number;
}

export function useDataGrid<T>({ data, columns, pageSize = 8 }: UseDataGridOptions<T>) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortState>({ column: null, direction: null });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<T[]>([]);

  // Colonnes searchable
  const searchableColumns = useMemo(
    () => columns.filter((c) => c.searchable !== false),
    [columns]
  );

  // Filtrage par recherche
  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((row: any) =>
      searchableColumns.some((col) => {
        const val = row[col.key];
        return val != null && String(val).toLowerCase().includes(q);
      })
    );
  }, [data, search, searchableColumns]);

  // Tri
  const sorted = useMemo(() => {
    if (!sort.column || !sort.direction) return filtered;
    return [...filtered].sort((a: any, b: any) => {
      const aVal = a[sort.column!] ?? '';
      const bVal = b[sort.column!] ?? '';
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sort.direction === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sort]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  // Réinitialiser la page quand la recherche change
  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  // Toggle tri
  const handleSort = useCallback((column: string) => {
    setSort((prev) => {
      if (prev.column !== column) return { column, direction: 'asc' };
      if (prev.direction === 'asc') return { column, direction: 'desc' };
      return { column: null, direction: null };
    });
  }, []);

  // Sélection
  const toggleRow = useCallback((row: T) => {
    setSelected((prev) =>
      prev.includes(row) ? prev.filter((r) => r !== row) : [...prev, row]
    );
  }, []);

  const toggleAll = useCallback(() => {
    setSelected((prev) => (prev.length === paginated.length ? [] : [...paginated]));
  }, [paginated]);

  const isSelected = useCallback((row: T) => selected.includes(row), [selected]);

  return {
    search, handleSearch,
    sort, handleSort,
    page, setPage, totalPages,
    rows: paginated,
    totalRows: sorted.length,
    selected, toggleRow, toggleAll, isSelected,
  };
}
