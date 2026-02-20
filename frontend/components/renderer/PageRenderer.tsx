'use client';

import { CSSProperties } from 'react';

interface Element {
  id: string;
  type: string;
  tag: string;
  content?: string;
  attributes?: Record<string, string>;
  styles: {
    desktop: any;
    tablet?: any;
    mobile?: any;
  };
  children: Element[];
}

interface PageRendererProps {
  elements: Element[];
  globalStyles?: any;
  companySlug?: string;
  isPreview?: boolean;
}

export function PageRenderer({ elements, globalStyles, companySlug, isPreview = false }: PageRendererProps) {
  const renderElement = (element: Element): JSX.Element => {
    const Tag = element.tag as keyof JSX.IntrinsicElements;
    
    // Convertir les styles en CSSProperties
    const styles: CSSProperties = element.styles.desktop;

    // Pour les images
    if (element.tag === 'img') {
      return (
        <Tag
          key={element.id}
          style={styles}
          src={element.attributes?.src || 'https://via.placeholder.com/400x300'}
          alt={element.attributes?.alt || 'Image'}
        />
      );
    }

    // Pour les liens
    if (element.tag === 'a') {
      const href = element.attributes?.href || '#';
      const linkType = element.attributes?.linkType;
      
      // Déterminer le comportement du lien
      const isExternal = href.startsWith('http');
      const isAnchor = href.startsWith('#');
      const isInternal = href.startsWith('/') && !isExternal && !isAnchor;
      
      // Ajouter le préfixe company slug pour les liens internes
      let finalHref = href;
      if (isInternal && companySlug) {
        finalHref = isPreview 
          ? `/preview/${companySlug}${href}`
          : `/${companySlug}${href}`;
      }
      
      return (
        <Tag
          key={element.id}
          style={styles}
          href={finalHref}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          onClick={isAnchor ? (e) => {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
              targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          } : undefined}
        >
          {element.content}
          {element.children?.length > 0 && element.children.map(renderElement)}
        </Tag>
      );
    }

    // Pour les autres éléments
    return (
      <Tag key={element.id} style={styles}>
        {element.content}
        {element.children?.length > 0 && element.children.map(renderElement)}
      </Tag>
    );
  };

  return (
    <div className="min-h-screen">
      {elements.map(renderElement)}
    </div>
  );
}
