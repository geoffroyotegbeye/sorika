import { notFound } from 'next/navigation';
import { PageRenderer } from '@/components/renderer/PageRenderer';

async function getPageData(companySlug: string, pageSlug: string) {
  try {
    // 1. Récupérer la company
    const companyRes = await fetch(`http://localhost:3001/companies/slug/${companySlug}`, {
      cache: 'no-store',
    });
    
    if (!companyRes.ok) return null;
    const company = await companyRes.json();
    
    // 2. Récupérer la page spécifique
    const pageRes = await fetch(`http://localhost:3001/companies/${company.id}/pages/${pageSlug}`, {
      cache: 'no-store',
    });
    
    if (!pageRes.ok) return null;
    const page = await pageRes.json();
    
    return { company, page };
  } catch (error) {
    console.error('Erreur chargement page:', error);
    return null;
  }
}

export default async function SubPage({ 
  params 
}: { 
  params: Promise<{ slug: string; pageSlug: string }> 
}) {
  const { slug: companySlug, pageSlug } = await params;
  const data = await getPageData(companySlug, pageSlug);
  
  if (!data) {
    notFound();
  }

  const { company, page } = data;

  // Vérifier si la page est publiée
  if (!page.isPublished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Page en construction</h1>
          <p className="text-slate-600">Cette page sera bientôt disponible.</p>
        </div>
      </div>
    );
  }

  const elements = page.elements || [];

  return (
    <>
      {/* Styles globaux */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: Inter, sans-serif;
        }
      `}</style>
      
      {/* Rendu de la page */}
      <PageRenderer elements={elements} globalStyles={{}} companySlug={companySlug} />
    </>
  );
}
