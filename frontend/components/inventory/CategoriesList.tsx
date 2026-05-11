'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolderTree, Pencil, Trash2 } from 'lucide-react';
import type { ProductCategory } from '@/types/inventory';

interface CategoriesListProps {
  categories: ProductCategory[];
  onEdit: (category: ProductCategory) => void;
  onDelete: (id: string) => void;
}

export function CategoriesList({ categories, onEdit, onDelete }: CategoriesListProps) {
  if (categories.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <FolderTree className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">Aucune catégorie</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => (
        <Card key={category.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <FolderTree className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{category.description}</p>
                  )}
                  <p className="text-xs text-slate-400 mt-2">
                    {category._count?.products || 0} produit{(category._count?.products || 0) > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="flex gap-1 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(category)}
                  className="h-8 w-8 p-0"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(category.id)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
