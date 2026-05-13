import { ReactNode } from 'react';

export interface SortState {
  column: string | null;
  direction: 'asc' | 'desc' | null;
}

export interface ColumnFilterState {
  column: string | null;
  value: string;
}

export interface DataGridColumn<T> {
  key: keyof T & string;
  header: string;
  sortable?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  filterType?: 'string' | 'number';
  width?: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
}

export interface DataGridProps<T> {
  data: T[];
  columns: DataGridColumn<T>[];
  /** Nombre de lignes par page (défaut: 10) */
  pageSize?: number;
  /** Placeholder de la barre de recherche */
  searchPlaceholder?: string;
  /** Actions/boutons à droite de la barre de recherche */
  toolbar?: ReactNode;
  /** Afficher les checkboxes de sélection */
  selectable?: boolean;
  /** Callback quand la sélection change */
  onSelectionChange?: (rows: T[]) => void;
  /** État de chargement */
  loading?: boolean;
  /** Message quand aucune donnée */
  emptyMessage?: string;
  /** Icône quand aucune donnée */
  emptyIcon?: React.ComponentType<{ className?: string }>;
  /** Callback au clic sur une ligne */
  onRowClick?: (row: T) => void;
  /** Classe CSS supplémentaire */
  className?: string;
}
