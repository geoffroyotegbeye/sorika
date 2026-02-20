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

export default async function PreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getLandingPage(slug);
  
  if (!data) {
    notFound();
  }

  const { company, landingPage } = data;

  const elements = landingPage.elements || [];
  const globalStyles = landingPage.globalStyles || {};

  return (
    <>
      {/* Bannière de prévisualisation */}
      <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black px-4 py-2 text-center text-sm font-medium z-50">
        🔍 Mode Prévisualisation - Ce site n&apos;est pas encore publié
      </div>
      
      {landingPage.customCSS && (
        <style dangerouslySetInnerHTML={{ __html: landingPage.customCSS }} />
      )}

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: ${globalStyles.fonts?.primary || 'Inter, sans-serif'};
          padding-top: 40px;
        }
      `}</style>
      
      <PageRenderer elements={elements} globalStyles={globalStyles} />

      {landingPage.customJS && (
        <script dangerouslySetInnerHTML={{ __html: landingPage.customJS }} />
      )}
    </>
  );
}
