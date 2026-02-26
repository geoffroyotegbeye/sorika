import { HelpCircle } from 'lucide-react';
import { LayoutTemplate } from '../layout-templates';

export const FAQ_TEMPLATES: LayoutTemplate[] = [
  {
    id: 'faq-accordion',
    label: 'FAQ Accordéon',
    category: 'FAQ',
    icon: HelpCircle,
    template: {
      type: 'section',
      tag: 'section',
      styles: {
        desktop: { display: 'block', padding: '96px 20px', backgroundColor: '#ffffff' },
        tablet: { padding: '64px 20px' },
        mobile: { padding: '48px 16px' },
      },
      children: [
        {
          type: 'container',
          tag: 'div',
          styles: { desktop: { maxWidth: '800px', margin: '0 auto' } },
          children: [
            {
              type: 'vflex',
              tag: 'div',
              styles: {
                desktop: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px', padding: '0', marginBottom: '56px' },
              },
              children: [
                { type: 'heading', tag: 'h2', content: 'Questions fréquentes', styles: { desktop: { fontSize: '40px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0' }, mobile: { fontSize: '28px' } }, children: [] },
                { type: 'text', tag: 'div', content: 'Tout ce que vous devez savoir sur notre plateforme.', styles: { desktop: { fontSize: '17px', color: '#475569', marginBottom: '0' } }, children: [] },
              ],
            },
            {
              type: 'vflex',
              tag: 'div',
              styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '12px', padding: '0' } },
              children: [
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: { desktop: { padding: '24px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' } },
                  children: [
                    { type: 'heading', tag: 'h3', content: 'Comment démarrer avec la plateforme ?', styles: { desktop: { fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '0' } }, children: [] },
                    { type: 'text', tag: 'div', content: 'Créez un compte gratuit, choisissez un template et commencez à personnaliser votre site en quelques clics. Aucune compétence technique requise.', styles: { desktop: { fontSize: '15px', color: '#64748b', lineHeight: '1.7', marginBottom: '0' } }, children: [] },
                  ],
                },
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: { desktop: { padding: '24px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' } },
                  children: [
                    { type: 'heading', tag: 'h3', content: 'Puis-je utiliser mon propre nom de domaine ?', styles: { desktop: { fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '0' } }, children: [] },
                    { type: 'text', tag: 'div', content: 'Oui, tous les plans payants incluent la possibilité de connecter votre propre domaine. Le plan gratuit utilise un sous-domaine.', styles: { desktop: { fontSize: '15px', color: '#64748b', lineHeight: '1.7', marginBottom: '0' } }, children: [] },
                  ],
                },
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: { desktop: { padding: '24px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' } },
                  children: [
                    { type: 'heading', tag: 'h3', content: 'Puis-je changer de plan à tout moment ?', styles: { desktop: { fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '0' } }, children: [] },
                    { type: 'text', tag: 'div', content: 'Absolument. Vous pouvez upgrader ou downgrader votre plan à tout moment depuis votre tableau de bord.', styles: { desktop: { fontSize: '15px', color: '#64748b', lineHeight: '1.7', marginBottom: '0' } }, children: [] },
                  ],
                },
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: { desktop: { padding: '24px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' } },
                  children: [
                    { type: 'heading', tag: 'h3', content: 'Le support technique est-il inclus ?', styles: { desktop: { fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '0' } }, children: [] },
                    { type: 'text', tag: 'div', content: 'Oui, tous les plans incluent un support par email. Les plans Pro et Business bénéficient d\'un support prioritaire.', styles: { desktop: { fontSize: '15px', color: '#64748b', lineHeight: '1.7', marginBottom: '0' } }, children: [] },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },

  {
    id: 'faq-two-columns',
    label: 'FAQ 2 Colonnes',
    category: 'FAQ',
    icon: HelpCircle,
    template: {
      type: 'section',
      tag: 'section',
      styles: {
        desktop: { display: 'block', padding: '96px 20px', backgroundColor: '#f8fafc' },
        tablet: { padding: '64px 20px' },
        mobile: { padding: '48px 16px' },
      },
      children: [
        {
          type: 'container',
          tag: 'div',
          styles: { desktop: { maxWidth: '1100px', margin: '0 auto' } },
          children: [
            {
              type: 'vflex',
              tag: 'div',
              styles: { desktop: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px', padding: '0', marginBottom: '56px' } },
              children: [
                { type: 'heading', tag: 'h2', content: 'Besoin d\'aide ?', styles: { desktop: { fontSize: '40px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0' }, mobile: { fontSize: '28px' } }, children: [] },
                { type: 'text', tag: 'div', content: 'Consultez nos réponses aux questions les plus courantes.', styles: { desktop: { fontSize: '17px', color: '#475569', marginBottom: '0' } }, children: [] },
              ],
            },
            {
              type: 'grid',
              tag: 'div',
              styles: {
                desktop: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' },
                mobile: { gridTemplateColumns: '1fr' },
              },
              children: [
                [{
                  type: 'vflex',
                  tag: 'div',
                  styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '16px', padding: '0' } },
                  children: [
                    {
                      type: 'vflex',
                      tag: 'div',
                      styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '8px', padding: '0' } },
                      children: [
                        { type: 'heading', tag: 'h3', content: 'Combien coûte l\'hébergement ?', styles: { desktop: { fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '0' } }, children: [] },
                        { type: 'text', tag: 'div', content: 'L\'hébergement est inclus dans tous nos plans. Pas de frais cachés.', styles: { desktop: { fontSize: '15px', color: '#64748b', lineHeight: '1.7', marginBottom: '0' } }, children: [] },
                      ],
                    },
                    {
                      type: 'vflex',
                      tag: 'div',
                      styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '8px', padding: '0' } },
                      children: [
                        { type: 'heading', tag: 'h3', content: 'Puis-je exporter mon site ?', styles: { desktop: { fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '0' } }, children: [] },
                        { type: 'text', tag: 'div', content: 'Oui, vous pouvez exporter le code HTML/CSS de votre site à tout moment.', styles: { desktop: { fontSize: '15px', color: '#64748b', lineHeight: '1.7', marginBottom: '0' } }, children: [] },
                      ],
                    },
                    {
                      type: 'vflex',
                      tag: 'div',
                      styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '8px', padding: '0' } },
                      children: [
                        { type: 'heading', tag: 'h3', content: 'Y a-t-il une limite de pages ?', styles: { desktop: { fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '0' } }, children: [] },
                        { type: 'text', tag: 'div', content: 'Le plan gratuit est limité à 5 pages. Les plans payants sont illimités.', styles: { desktop: { fontSize: '15px', color: '#64748b', lineHeight: '1.7', marginBottom: '0' } }, children: [] },
                      ],
                    },
                  ],
                }],
                [{
                  type: 'vflex',
                  tag: 'div',
                  styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '16px', padding: '0' } },
                  children: [
                    {
                      type: 'vflex',
                      tag: 'div',
                      styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '8px', padding: '0' } },
                      children: [
                        { type: 'heading', tag: 'h3', content: 'Le site est-il optimisé SEO ?', styles: { desktop: { fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '0' } }, children: [] },
                        { type: 'text', tag: 'div', content: 'Oui, tous les sites sont optimisés pour le référencement avec balises méta, sitemap et données structurées.', styles: { desktop: { fontSize: '15px', color: '#64748b', lineHeight: '1.7', marginBottom: '0' } }, children: [] },
                      ],
                    },
                    {
                      type: 'vflex',
                      tag: 'div',
                      styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '8px', padding: '0' } },
                      children: [
                        { type: 'heading', tag: 'h3', content: 'Puis-je ajouter du code personnalisé ?', styles: { desktop: { fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '0' } }, children: [] },
                        { type: 'text', tag: 'div', content: 'Oui, les plans Pro et Business permettent d\'ajouter du CSS et JavaScript personnalisé.', styles: { desktop: { fontSize: '15px', color: '#64748b', lineHeight: '1.7', marginBottom: '0' } }, children: [] },
                      ],
                    },
                    {
                      type: 'vflex',
                      tag: 'div',
                      styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '8px', padding: '0' } },
                      children: [
                        { type: 'heading', tag: 'h3', content: 'Comment annuler mon abonnement ?', styles: { desktop: { fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '0' } }, children: [] },
                        { type: 'text', tag: 'div', content: 'Vous pouvez annuler à tout moment depuis votre compte. Aucun engagement.', styles: { desktop: { fontSize: '15px', color: '#64748b', lineHeight: '1.7', marginBottom: '0' } }, children: [] },
                      ],
                    },
                  ],
                }],
              ],
            },
          ],
        },
      ],
    },
  },
];
