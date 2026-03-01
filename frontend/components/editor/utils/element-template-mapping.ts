/**
 * Mapping entre les types d'éléments de l'éditeur et les templates de propriétés
 */

export const ELEMENT_TYPE_TO_TEMPLATE: Record<string, string> = {
  // Headers
  'header': 'header-nav-light',
  'navbar': 'header-nav-light',
  
  // Hero sections
  'hero': 'hero-centered',
  'hero-section': 'hero-centered',
  'section': 'hero-centered', // Par défaut pour les sections
  
  // Banners
  'banner': 'banner-announcement',
  'announcement': 'banner-announcement',
  
  // Blog
  'blog': 'blog-grid',
  'blog-post': 'blog-card',
  'article': 'blog-card',
  
  // Contact
  'contact': 'contact-form',
  'contact-form': 'contact-form',
  
  // CTA
  'cta': 'cta-centered',
  'call-to-action': 'cta-centered',
  'button': 'cta-centered', // Les boutons utilisent les propriétés CTA
  
  // Features
  'features': 'features-grid',
  'feature': 'features-grid',
  
  // Footer
  'footer': 'footer-links',
  
  // Gallery
  'gallery': 'gallery-grid',
  'image-gallery': 'gallery-grid',
  
  // Pricing
  'pricing': 'pricing-table',
  'pricing-table': 'pricing-table',
  
  // Team
  'team': 'team-grid',
  'team-member': 'team-grid',
  
  // Testimonials
  'testimonials': 'testimonials-slider',
  'testimonial': 'testimonials-slider',
  'reviews': 'testimonials-slider',
  
  // Éléments génériques
  'container': 'hero-centered',
  'div': 'hero-centered',
  'text': 'hero-centered',
  'heading': 'hero-centered',
  'paragraph': 'hero-centered'
};

/**
 * Détection intelligente du template basée sur le contenu et les classes CSS
 */
export function detectTemplateFromElement(element: any): string {
  // 1. Si l'élément a déjà un templateId, l'utiliser
  if (element.templateId) {
    return element.templateId;
  }
  
  // 2. Vérifier les attributs data-template-id
  if (element.attributes?.['data-template-id']) {
    return element.attributes['data-template-id'];
  }
  
  // 3. Détection basée sur les classes CSS
  const classes = element.attributes?.class || '';
  
  // Headers
  if (classes.includes('header') || classes.includes('navbar') || element.tag === 'header') {
    return 'header-nav-light';
  }
  
  // Hero sections
  if (classes.includes('hero') || classes.includes('jumbotron')) {
    return 'hero-centered';
  }
  
  // CTA/Buttons
  if (classes.includes('cta') || classes.includes('call-to-action') || element.tag === 'button') {
    return 'cta-centered';
  }
  
  // Pricing
  if (classes.includes('pricing') || classes.includes('price')) {
    return 'pricing-table';
  }
  
  // Gallery
  if (classes.includes('gallery') || classes.includes('grid') && classes.includes('image')) {
    return 'gallery-grid';
  }
  
  // Footer
  if (classes.includes('footer') || element.tag === 'footer') {
    return 'footer-links';
  }
  
  // 4. Détection basée sur le contenu
  const content = element.content?.toLowerCase() || '';
  
  if (content.includes('contact') || content.includes('formulaire')) {
    return 'contact-form';
  }
  
  if (content.includes('témoignage') || content.includes('avis') || content.includes('review')) {
    return 'testimonials-slider';
  }
  
  if (content.includes('équipe') || content.includes('team')) {
    return 'team-grid';
  }
  
  if (content.includes('blog') || content.includes('article')) {
    return 'blog-grid';
  }
  
  // 5. Fallback sur le type d'élément
  return ELEMENT_TYPE_TO_TEMPLATE[element.type] || 'hero-centered';
}

/**
 * Obtient le templateId approprié pour un élément
 */
export function getTemplateIdForElement(element: any): string {
  return detectTemplateFromElement(element);
}

/**
 * Met à jour un élément avec le templateId approprié
 */
export function ensureElementHasTemplateId(element: any): any {
  return {
    ...element,
    templateId: getTemplateIdForElement(element)
  };
}

/**
 * Obtient des informations sur le template détecté
 */
export function getTemplateDetectionInfo(element: any): {
  templateId: string;
  detectionMethod: string;
  confidence: 'high' | 'medium' | 'low';
} {
  let detectionMethod = 'fallback';
  let confidence: 'high' | 'medium' | 'low' = 'low';
  
  if (element.templateId) {
    detectionMethod = 'explicit templateId';
    confidence = 'high';
  } else if (element.attributes?.['data-template-id']) {
    detectionMethod = 'data-template-id attribute';
    confidence = 'high';
  } else if (element.attributes?.class) {
    detectionMethod = 'CSS classes';
    confidence = 'medium';
  } else if (element.content) {
    detectionMethod = 'content analysis';
    confidence = 'medium';
  }
  
  return {
    templateId: getTemplateIdForElement(element),
    detectionMethod,
    confidence
  };
}