'use client';

import { ChevronUp, ChevronDown, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { useDataGrid } from './useDataGrid';
import { DataGridToolbar } from './DataGridToolbar';
import { DataGridEmpty } from './DataGridEmpty';
import { DataGridLoading } from './DataGridLoading';
import { DataGridPagination } from './DataGridPagination';
import { DataGridProps } from './types';

export function DataGrid<T extends object>({
  data,
  columns,
  pageSize = 8,
  searchPlaceholder,
  toolbar,
  selectable = false,
  onSelectionChange,
  loading = false,
  emptyMessage,
  emptyIcon,
  onRowClick,
  className,
}: DataGridProps<T>) {
  const {
    search, handleSearch,
    sort, handleSort,
    page, setPage, totalPages,
    rows,
    totalRows,
    selected, toggleRow, toggleAll, isSelected,
    columnFilter, handleColumnFilter, handleColumnFilterValue,
  } = useDataGrid({ data, columns, pageSize });

  // Notifier le parent quand la sélection change
  const handleToggleRow = (row: T) => {
    toggleRow(row);
    if (onSelectionChange) {
      const next = selected.includes(row)
        ? selected.filter((r) => r !== row)
        : [...selected, row];
      onSelectionChange(next);
    }
  };

  const handleToggleAll = () => {
    toggleAll();
    if (onSelectionChange) {
      const next = selected.length === rows.length ? [] : [...rows];
      onSelectionChange(next);
    }
  };

  const allSelected = rows.length > 0 && selected.length === rows.length;
  const someSelected = selected.length > 0 && selected.length < rows.length;

  return (
    <>
      {/* Toolbar */}
      <DataGridToolbar
        search={search}
        onSearch={handleSearch}
        searchPlaceholder={searchPlaceholder}
        toolbar={toolbar}
        totalRows={data.length}
        filteredRows={totalRows}
      />

      {/* Table */}
      <div className={cn('overflow-x-auto', className)}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {selectable && (
                <th className="w-10 px-4 py-3">
                  <Checkbox
                    checked={allSelected}
                    ref={(el) => {
                      if (el) (el as any).indeterminate = someSelected;
                    }}
                    onCheckedChange={handleToggleAll}
                    aria-label="Tout sélectionner"
                  />
                </th>
              )}
              {columns.map((col, idx) => (
                <th
                  key={`${col.key}-${idx}`}
                  style={col.width ? { width: col.width } : undefined}
                  className={cn(
                    'px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap',
                    col.filterable !== false && col.key !== 'actions' &&
                      'cursor-pointer select-none hover:text-foreground'
                  )}
                  onClick={() => {
                    if (col.filterable !== false && col.key !== 'actions') handleColumnFilter(col.key);
                  }}
                >
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1">
                      {col.header}
                      {col.sortable !== false && (
                        <span onClick={(e) => {
                          e.stopPropagation();
                          handleSort(col.key);
                        }}>
                          <SortIcon column={col.key} sort={sort} />
                        </span>
                      )}
                    </span>
                    {columnFilter.column === col.key && col.key !== 'actions' && (
                      <div className="overflow-hidden relative">
                        <input
                          type={col.filterType === 'number' ? 'number' : 'text'}
                          placeholder="Filtrer..."
                          value={columnFilter.value}
                          onChange={(e) => handleColumnFilterValue(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full px-6 py-1 text-xs border-b border-primary focus:outline-none focus:border-primary bg-transparent transition-all pr-8"
                        />
                        {columnFilter.value && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleColumnFilterValue('');
                            }}
                            className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <DataGridLoading cols={columns.length + (selectable ? 1 : 0)} />
            ) : rows.length === 0 ? (
              <DataGridEmpty message={emptyMessage} icon={emptyIcon as any} />
            ) : (
              rows.map((row, i) => (
                <tr
                  key={i}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'border-b border-border transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-muted/50',
                    isSelected(row) && 'bg-primary/10 hover:bg-primary/10'
                  )}
                >
                  {selectable && (
                    <td className="w-10 px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelected(row)}
                        onCheckedChange={() => handleToggleRow(row)}
                        aria-label="Sélectionner la ligne"
                      />
                    </td>
                  )}
                  {columns.map((col, idx) => (
                    <td key={`${col.key}-${idx}`} className="px-4 py-3 text-foreground">
                      {col.render
                        ? col.render(row[col.key as keyof T], row)
                        : (row[col.key as keyof T] as React.ReactNode) ?? '—'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && totalRows > 0 && (
        <DataGridPagination
          page={page}
          totalPages={totalPages}
          totalRows={totalRows}
          pageSize={pageSize}
          onPage={setPage}
        />
      )}
    </>
  );
}

// Icône de tri
function SortIcon({ column, sort }: { column: string; sort: { column: string | null; direction: string | null } }) {
  if (sort.column !== column)
    return <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />;
  if (sort.direction === 'asc')
    return <ChevronUp className="h-3.5 w-3.5 text-primary" />;
  return <ChevronDown className="h-3.5 w-3.5 text-primary" />;
}
