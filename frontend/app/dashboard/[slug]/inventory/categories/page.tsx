'use client';

import { use, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';
import { CategoriesList } from '@/components/inventory/CategoriesList';
import { CategoryFormDialog } from '@/components/inventory/CategoryFormDialog';
import type { ProductCategory } from '@/types/inventory';

export default function CategoriesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return;
    const parsed = JSON.parse(userData);
    setCompany(parsed.companies?.find((c: any) => c.slug === slug) ?? null);
  }, [slug]);

  const { categories, loading, fetchCategories, deleteCategory } = useInventory(company?.id ?? '');
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [editCategory, setEditCategory] = useState<ProductCategory | null>(null);

  useEffect(() => {
    if (company?.id) fetchCategories();
  }, [company?.id, fetchCategories]);

  if (!company) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  const handleCloseDialog = () => {
    setCategoryDialog(false);
    setEditCategory(null);
    fetchCategories();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Catégories</h1>
        <Button onClick={() => { setEditCategory(null); setCategoryDialog(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle catégorie
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <CategoriesList
          categories={categories}
          onEdit={(cat) => { setEditCategory(cat); setCategoryDialog(true); }}
          onDelete={deleteCategory}
        />
      )}

      <CategoryFormDialog
        companyId={company.id}
        category={editCategory}
        categories={categories}
        open={categoryDialog}
        onClose={handleCloseDialog}
      />
    </div>
  );
}
