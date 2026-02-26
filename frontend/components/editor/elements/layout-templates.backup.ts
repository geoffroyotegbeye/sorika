import { LucideIcon } from 'lucide-react';
import { HEADER_TEMPLATES } from './templates/header-templates';
import { HERO_TEMPLATES } from './templates/hero-templates';
import { FEATURE_TEMPLATES } from './templates/feature-templates';
import { PRICING_TEMPLATES } from './templates/pricing-templates';
import { TESTIMONIAL_TEMPLATES } from './templates/testimonial-templates';
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

export const LAYOUT_TEMPLATES: LayoutTemplate[] = [
  ...HEADER_TEMPLATES,
  ...HERO_TEMPLATES,
  ...FEATURE_TEMPLATES,
  ...PRICING_TEMPLATES,
  ...TESTIMONIAL_TEMPLATES,
  ...CTA_TEMPLATES,
  ...CONTACT_TEMPLATES,
  ...TEAM_TEMPLATES,
  ...FOOTER_TEMPLATES,
];
