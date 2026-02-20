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
}

export function PageRenderer({ elements, globalStyles }: PageRendererProps) {
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
      return (
        <Tag
          key={element.id}
          style={styles}
          href={element.attributes?.href || '#'}
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
