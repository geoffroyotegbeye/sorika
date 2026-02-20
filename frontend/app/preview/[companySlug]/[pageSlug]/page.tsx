import { notFound } from 'next/navigation';
import { PageRenderer } from '@/components/renderer/PageRenderer';

async function getPageData(companySlug: string, pageSlug: string) {
  try {
    const companyRes = await fetch(`http://localhost:3001/companies/slug/${companySlug}`, {
      cache: 'no-store',
    });
    
    if (!companyRes.ok) return null;
    const company = await companyRes.json();
    
    const pageRes = await fetch(`http://localhost:3001/companies/${company.id}/pages/${pageSlug}`, {
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

export default async function PreviewPageWithSlug({ params }: { params: Promise<{ companySlug: string; pageSlug: string }> }) {
  const { companySlug, pageSlug } = await params;
  const data = await getPageData(companySlug, pageSlug);
  
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Page introuvable</h1>
          <p className="text-slate-600">La page "{pageSlug}" n'existe pas.</p>
        </div>
      </div>
    );
  }

  const { company, page } = data;
  const elements = page.elements || [];

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black px-4 py-2 text-center text-sm font-medium z-50">
        🔍 Mode Prévisualisation - {page.title}
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
          </div>
        </div>
      ) : (
        <PageRenderer elements={elements} globalStyles={{}} companySlug={companySlug} isPreview={true} />
      )}
    </>
  );
}
