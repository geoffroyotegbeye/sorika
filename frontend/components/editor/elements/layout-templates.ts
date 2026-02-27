import {
  LucideIcon,
} from 'lucide-react';

// Import all template collections
import { HEADER_TEMPLATES } from './templates/header-templates';
import { HERO_TEMPLATES } from './templates/hero-templates';
import { BLOG_TEMPLATES } from './templates/blog-templates';
import { GALLERY_TEMPLATES } from './templates/gallery-templates';
import { BANNER_TEMPLATES } from './templates/banner-templates';
import { FEATURES_TEMPLATES } from './templates/features-templates';
import { PRICING_TEMPLATES } from './templates/pricing-templates';
import { TESTIMONIALS_TEMPLATES } from './templates/testimonials-templates';
import { CTA_TEMPLATES } from './templates/cta-templates';
import { CONTACT_TEMPLATES } from './templates/contact-templates';
import { TEAM_TEMPLATES } from './templates/team-templates';
import { FOOTER_TEMPLATES } from './templates/footer-templates';

export interface LayoutTemplate {
  id: string;
  label: string;
  category: string;
  icon: LucideIcon;
  template: any;
}

// ─────────────────────────────────────────────
// COULEURS & TOKENS GLOBAUX (cohérence visuelle)
// ─────────────────────────────────────────────
// Primaire  : #2563eb (bleu professionnel)
// Accentué  : #7c3aed (violet)
// Neutre dk : #0f172a / #1e293b
// Neutre md : #475569 / #94a3b8
// Neutre lt : #f1f5f9 / #ffffff
// Success   : #10b981
// Warning   : #f59e0b

export const LAYOUT_TEMPLATES: LayoutTemplate[] = [
  ...HEADER_TEMPLATES,
  ...HERO_TEMPLATES,
  ...BLOG_TEMPLATES,
  ...GALLERY_TEMPLATES,
  ...BANNER_TEMPLATES,
  ...FEATURES_TEMPLATES,
  ...PRICING_TEMPLATES,
  ...TESTIMONIALS_TEMPLATES,
  ...CTA_TEMPLATES,
  ...CONTACT_TEMPLATES,
  ...TEAM_TEMPLATES,
  ...FOOTER_TEMPLATES,
];