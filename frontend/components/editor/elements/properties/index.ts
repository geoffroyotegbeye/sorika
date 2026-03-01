/**
 * Block Properties Index
 * 
 * Point d'entrée centralisé pour toutes les propriétés de blocs
 */

// Import des propriétés par catégorie
export * from './header-properties';
export * from './hero-properties';
export * from './banner-properties';
export * from './blog-properties';
export * from './contact-properties';
export * from './cta-properties';
export * from './features-properties';
export * from './footer-properties';
export * from './gallery-properties';
export * from './pricing-properties';
export * from './team-properties';
export * from './testimonials-properties';

// Import des définitions individuelles
import { HEADER_BLOCK_DEFINITIONS } from './header-properties';
import { HERO_BLOCK_DEFINITIONS } from './hero-properties';
import { BANNER_BLOCK_DEFINITIONS } from './banner-properties';
import { BLOG_BLOCK_DEFINITIONS } from './blog-properties';
import { CONTACT_BLOCK_DEFINITIONS } from './contact-properties';
import { CTA_BLOCK_DEFINITIONS } from './cta-properties';
import { FEATURES_BLOCK_DEFINITIONS } from './features-properties';
import { FOOTER_BLOCK_DEFINITIONS } from './footer-properties';
import { GALLERY_BLOCK_DEFINITIONS } from './gallery-properties';
import { PRICING_BLOCK_DEFINITIONS } from './pricing-properties';
import { TEAM_BLOCK_DEFINITIONS } from './team-properties';
import { TESTIMONIALS_BLOCK_DEFINITIONS } from './testimonials-properties';

import { BlockDefinition } from '../block-properties';

/**
 * Registre consolidé de toutes les définitions de blocs
 */
export const ALL_BLOCK_DEFINITIONS: Record<string, BlockDefinition> = {
  ...HEADER_BLOCK_DEFINITIONS,
  ...HERO_BLOCK_DEFINITIONS,
  ...BANNER_BLOCK_DEFINITIONS,
  ...BLOG_BLOCK_DEFINITIONS,
  ...CONTACT_BLOCK_DEFINITIONS,
  ...CTA_BLOCK_DEFINITIONS,
  ...FEATURES_BLOCK_DEFINITIONS,
  ...FOOTER_BLOCK_DEFINITIONS,
  ...GALLERY_BLOCK_DEFINITIONS,
  ...PRICING_BLOCK_DEFINITIONS,
  ...TEAM_BLOCK_DEFINITIONS,
  ...TESTIMONIALS_BLOCK_DEFINITIONS
};

/**
 * Obtenir toutes les définitions par catégorie
 */
export const BLOCK_DEFINITIONS_BY_CATEGORY = {
  Header: HEADER_BLOCK_DEFINITIONS,
  Hero: HERO_BLOCK_DEFINITIONS,
  Banner: BANNER_BLOCK_DEFINITIONS,
  Blog: BLOG_BLOCK_DEFINITIONS,
  Contact: CONTACT_BLOCK_DEFINITIONS,
  CTA: CTA_BLOCK_DEFINITIONS,
  Features: FEATURES_BLOCK_DEFINITIONS,
  Footer: FOOTER_BLOCK_DEFINITIONS,
  Gallery: GALLERY_BLOCK_DEFINITIONS,
  Pricing: PRICING_BLOCK_DEFINITIONS,
  Team: TEAM_BLOCK_DEFINITIONS,
  Testimonials: TESTIMONIALS_BLOCK_DEFINITIONS
};