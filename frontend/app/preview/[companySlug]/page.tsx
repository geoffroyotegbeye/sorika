import { notFound } from 'next/navigation';
import { PageRenderer } from '@/components/renderer/PageRenderer';

async function getPageData(companySlug: string) {
  try {
    // 1. Récupérer la company
    const companyRes = await fetch(`http://localhost:3001/companies/slug/${companySlug}`, {
      cache: 'no-store',
    });
    
    if (!companyRes.ok) return null;
    const company = await companyRes.json();
    
    // 2. Récupérer la page d'accueil
    const pageRes = await fetch(`http://localhost:3001/companies/${company.id}/pages/home`, {
      cache: 'no-store',
    });
    
    if (!pageRes.ok) return null;
    const page = await pageRes.json();
    
    return { company, page };
  } catch (error) {
    console.error('Erreur preview:', error);
    return null;
  }
}

export default async function PreviewPage({ params }: { params: Promise<{ companySlug: string }> }) {
  const { companySlug } = await params;
  const data = await getPageData(companySlug);
  
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Site introuvable</h1>
          <p className="text-slate-600">Le site "{companySlug}" n'existe pas.</p>
        </div>
      </div>
    );
  }

  const { company, page } = data;
  const elements = page.elements || [];

  console.log('Preview - Company:', company.name);
  console.log('Preview - Page:', page.title);
  console.log('Preview - Elements:', elements.length);

  return (
    <>
      {/* Bannière de prévisualisation */}
      <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black px-4 py-2 text-center text-sm font-medium z-50">
        🔍 Mode Prévisualisation - Ce site n&apos;est pas encore publié
      </div>
      
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: Inter, sans-serif;
          padding-top: 40px;
        }
      `}</style>
      
      {elements.length === 0 ? (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Page vide</h1>
            <p className="text-slate-600">Aucun élément sur cette page.</p>
            <p className="text-sm text-slate-500 mt-2">Retournez dans l'éditeur pour ajouter du contenu.</p>
          </div>
        </div>
      ) : (
        <PageRenderer elements={elements} globalStyles={{}} companySlug={companySlug} isPreview={true} />
      )}
    </>
  );
}
