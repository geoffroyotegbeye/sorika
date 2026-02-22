'use client';

import { CSSProperties, useState, useEffect, useRef } from 'react';
import { interactionEngine } from '@/lib/interactions/engine';

interface Element {
  id: string;
  type: string;
  tag: string;
  content?: string;
  attributes?: Record<string, string>;
  interactions?: any[];
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
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const elementRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Appliquer les interactions
  useEffect(() => {
    const applyInteractions = (els: Element[]) => {
      els.forEach(el => {
        if (el.interactions && el.interactions.length > 0) {
          const domElement = elementRefs.current.get(el.id);
          if (domElement) {
            interactionEngine.setInteractions(el.id, el.interactions);
            interactionEngine.applyInteractions(el.id, domElement);
          }
        }
        if (el.children?.length > 0) {
          applyInteractions(el.children);
        }
      });
    };

    applyInteractions(elements);

    return () => {
      interactionEngine.clearAll();
    };
  }, [elements]);

  // Détecter si on est en mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Gérer le clic sur le bouton hamburger
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Si c'est un bouton hamburger
      if (target.tagName === 'BUTTON' && target.textContent === '☰') {
        e.preventDefault();
        const hflex = target.closest('[data-hflex-id]');
        if (hflex) {
          const hflexId = hflex.getAttribute('data-hflex-id');
          setOpenMenuId(prev => prev === hflexId ? null : hflexId);
        }
        return;
      }
      
      // Fermer le menu si on clique ailleurs
      if (openMenuId && !target.closest('nav')) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [openMenuId]);

  const renderElement = (element: Element, parentId?: string): JSX.Element => {
    const Tag = element.tag as keyof JSX.IntrinsicElements;
    
    // Convertir les styles en CSSProperties avec gestion responsive
    let styles: CSSProperties = { ...element.styles.desktop };
    
    // Appliquer les styles mobile si on est en mobile
    if (isMobile && element.styles.mobile) {
      styles = { ...styles, ...element.styles.mobile };
    }

    // Gérer l'affichage du menu mobile
    if (element.tag === 'nav' && isMobile && parentId && openMenuId === parentId) {
      styles = {
        ...styles,
        display: 'flex',
      };
    }

    // Pour les images
    if (element.tag === 'img') {
      return (
        <Tag
          key={element.id}
          ref={(el) => el && elementRefs.current.set(element.id, el)}
          data-element-id={element.id}
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
          ref={(el) => el && elementRefs.current.set(element.id, el)}
          data-element-id={element.id}
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

    // Pour les hflex, ajouter un data-hflex-id
    const hflexProps = element.type === 'hflex' ? { 'data-hflex-id': element.id } : {};

    // Pour les autres éléments
    return (
      <Tag 
        key={element.id} 
        ref={(el) => el && elementRefs.current.set(element.id, el)}
        data-element-id={element.id}
        style={styles} 
        {...hflexProps}
      >
        {element.content}
        {element.children?.length > 0 && element.children.map(child => renderElement(child, element.id))}
      </Tag>
    );
  };

  return (
    <div className="min-h-screen">
      {elements.map(renderElement)}
    </div>
  );
}
