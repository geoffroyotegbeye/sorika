import { notFound } from 'next/navigation';
import { PageRenderer } from '@/components/renderer/PageRenderer';

async function getLandingPage(slug: string) {
  try {
    const companyRes = await fetch(`http://localhost:3001/companies/slug/${slug}`, {
      cache: 'no-store',
    });
    
    if (!companyRes.ok) return null;
    
    const company = await companyRes.json();
    
    const landingRes = await fetch(`http://localhost:3001/companies/${company.id}/landing-page`, {
      cache: 'no-store',
    });
    
    if (!landingRes.ok) return null;
    
    const landingPage = await landingRes.json();
    
    return { company, landingPage };
  } catch (error) {
    return null;
  }
}

export default async function PublicSitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getLandingPage(slug);
  
  if (!data) {
    notFound();
  }

  const { company, landingPage } = data;

  // Vérifier si le site est publié
  if (!landingPage.isPublished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Site en construction</h1>
          <p className="text-slate-600">Ce site sera bientôt disponible.</p>
        </div>
      </div>
    );
  }

  // Utiliser le nouveau moteur de rendu
  const elements = landingPage.elements || [];
  const globalStyles = landingPage.globalStyles || {};

  return (
    <>
      {/* CSS personnalisé */}
      {landingPage.customCSS && (
        <style dangerouslySetInnerHTML={{ __html: landingPage.customCSS }} />
      )}

      {/* Styles globaux */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: ${globalStyles.fonts?.primary || 'Inter, sans-serif'};
        }
      `}</style>
      
      {/* Rendu de la page */}
      <PageRenderer elements={elements} globalStyles={globalStyles} />

      {/* JavaScript personnalisé */}
      {landingPage.customJS && (
        <script dangerouslySetInnerHTML={{ __html: landingPage.customJS }} />
      )}
    </>
  );
}
