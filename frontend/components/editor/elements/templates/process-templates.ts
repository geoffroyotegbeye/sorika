import { List } from 'lucide-react';
import { LayoutTemplate } from '../layout-templates';

export const PROCESS_TEMPLATES: LayoutTemplate[] = [
  {
    id: 'process-3-steps',
    label: 'Processus 3 Étapes',
    category: 'Process',
    icon: List,
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
          styles: { desktop: { maxWidth: '1100px', margin: '0 auto' } },
          children: [
            {
              type: 'vflex',
              tag: 'div',
              styles: { desktop: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px', padding: '0', marginBottom: '64px' } },
              children: [
                { type: 'heading', tag: 'h2', content: 'Comment ça marche ?', styles: { desktop: { fontSize: '40px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0' }, mobile: { fontSize: '28px' } }, children: [] },
                { type: 'text', tag: 'div', content: 'Lancez votre site en 3 étapes simples.', styles: { desktop: { fontSize: '17px', color: '#475569', marginBottom: '0' } }, children: [] },
              ],
            },
            {
              type: 'grid',
              tag: 'div',
              styles: {
                desktop: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' },
                tablet: { gridTemplateColumns: '1fr', gap: '32px' },
                mobile: { gridTemplateColumns: '1fr', gap: '28px' },
              },
              children: [
                [{
                  type: 'vflex',
                  tag: 'div',
                  styles: { desktop: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px', padding: '0', position: 'relative' } },
                  children: [
                    {
                      type: 'div',
                      tag: 'div',
                      styles: { desktop: { width: '64px', height: '64px', backgroundColor: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '800', color: '#ffffff' } },
                      children: [{ type: 'text', tag: 'span', content: '1', styles: { desktop: { fontSize: '28px', fontWeight: '800', color: '#ffffff' } }, children: [] }],
                    },
                    { type: 'heading', tag: 'h3', content: 'Choisissez un template', styles: { desktop: { fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '0' } }, children: [] },
                    { type: 'text', tag: 'div', content: 'Parcourez notre bibliothèque de templates professionnels et sélectionnez celui qui correspond à votre vision.', styles: { desktop: { fontSize: '15px', color: '#64748b', lineHeight: '1.7', marginBottom: '0' } }, children: [] },
                  ],
                }],
                [{
                  type: 'vflex',
                  tag: 'div',
                  styles: { desktop: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px', padding: '0' } },
                  children: [
                    {
                      type: 'div',
                      tag: 'div',
                      styles: { desktop: { width: '64px', height: '64px', backgroundColor: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
                      children: [{ type: 'text', tag: 'span', content: '2', styles: { desktop: { fontSize: '28px', fontWeight: '800', color: '#ffffff' } }, children: [] }],
                    },
                    { type: 'heading', tag: 'h3', content: 'Personnalisez', styles: { desktop: { fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '0' } }, children: [] },
                    { type: 'text', tag: 'div', content: 'Modifiez les textes, couleurs, images et mise en page avec notre éditeur drag & drop intuitif.', styles: { desktop: { fontSize: '15px', color: '#64748b', lineHeight: '1.7', marginBottom: '0' } }, children: [] },
                  ],
                }],
                [{
                  type: 'vflex',
                  tag: 'div',
                  styles: { desktop: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px', padding: '0' } },
                  children: [
                    {
                      type: 'div',
                      tag: 'div',
                      styles: { desktop: { width: '64px', height: '64px', backgroundColor: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
                      children: [{ type: 'text', tag: 'span', content: '3', styles: { desktop: { fontSize: '28px', fontWeight: '800', color: '#ffffff' } }, children: [] }],
                    },
                    { type: 'heading', tag: 'h3', content: 'Publiez en ligne', styles: { desktop: { fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '0' } }, children: [] },
                    { type: 'text', tag: 'div', content: 'Cliquez sur publier et votre site est instantanément en ligne, accessible au monde entier.', styles: { desktop: { fontSize: '15px', color: '#64748b', lineHeight: '1.7', marginBottom: '0' } }, children: [] },
                  ],
                }],
              ],
            },
          ],
        },
      ],
    },
  },

  {
    id: 'process-timeline',
    label: 'Timeline Verticale',
    category: 'Process',
    icon: List,
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
          styles: { desktop: { maxWidth: '800px', margin: '0 auto' } },
          children: [
            {
              type: 'vflex',
              tag: 'div',
              styles: { desktop: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px', padding: '0', marginBottom: '56px' } },
              children: [
                { type: 'heading', tag: 'h2', content: 'Notre processus', styles: { desktop: { fontSize: '40px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0' }, mobile: { fontSize: '28px' } }, children: [] },
              ],
            },
            {
              type: 'vflex',
              tag: 'div',
              styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '32px', padding: '0' } },
              children: [
                {
                  type: 'hflex',
                  tag: 'div',
                  styles: { desktop: { display: 'flex', gap: '24px', padding: '0', alignItems: 'flex-start' } },
                  children: [
                    {
                      type: 'div',
                      tag: 'div',
                      styles: { desktop: { width: '48px', height: '48px', backgroundColor: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' } },
                      children: [{ type: 'text', tag: 'span', content: '1', styles: { desktop: { fontSize: '20px', fontWeight: '800', color: '#ffffff' } }, children: [] }],
                    },
                    {
                      type: 'vflex',
                      tag: 'div',
                      styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '8px', padding: '0', flex: '1' } },
                      children: [
                        { type: 'heading', tag: 'h3', content: 'Découverte', styles: { desktop: { fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '0' } }, children: [] },
                        { type: 'text', tag: 'div', content: 'Nous analysons vos besoins et objectifs pour créer une stratégie sur mesure.', styles: { desktop: { fontSize: '15px', color: '#64748b', lineHeight: '1.7', marginBottom: '0' } }, children: [] },
                      ],
                    },
                  ],
                },
                {
                  type: 'hflex',
                  tag: 'div',
                  styles: { desktop: { display: 'flex', gap: '24px', padding: '0', alignItems: 'flex-start' } },
                  children: [
                    {
                      type: 'div',
                      tag: 'div',
                      styles: { desktop: { width: '48px', height: '48px', backgroundColor: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' } },
                      children: [{ type: 'text', tag: 'span', content: '2', styles: { desktop: { fontSize: '20px', fontWeight: '800', color: '#ffffff' } }, children: [] }],
                    },
                    {
                      type: 'vflex',
                      tag: 'div',
                      styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '8px', padding: '0', flex: '1' } },
                      children: [
                        { type: 'heading', tag: 'h3', content: 'Conception', styles: { desktop: { fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '0' } }, children: [] },
                        { type: 'text', tag: 'div', content: 'Notre équipe design crée des maquettes qui reflètent votre identité de marque.', styles: { desktop: { fontSize: '15px', color: '#64748b', lineHeight: '1.7', marginBottom: '0' } }, children: [] },
                      ],
                    },
                  ],
                },
                {
                  type: 'hflex',
                  tag: 'div',
                  styles: { desktop: { display: 'flex', gap: '24px', padding: '0', alignItems: 'flex-start' } },
                  children: [
                    {
                      type: 'div',
                      tag: 'div',
                      styles: { desktop: { width: '48px', height: '48px', backgroundColor: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' } },
                      children: [{ type: 'text', tag: 'span', content: '3', styles: { desktop: { fontSize: '20px', fontWeight: '800', color: '#ffffff' } }, children: [] }],
                    },
                    {
                      type: 'vflex',
                      tag: 'div',
                      styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '8px', padding: '0', flex: '1' } },
                      children: [
                        { type: 'heading', tag: 'h3', content: 'Développement', styles: { desktop: { fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '0' } }, children: [] },
                        { type: 'text', tag: 'div', content: 'Nous construisons votre site avec les dernières technologies pour des performances optimales.', styles: { desktop: { fontSize: '15px', color: '#64748b', lineHeight: '1.7', marginBottom: '0' } }, children: [] },
                      ],
                    },
                  ],
                },
                {
                  type: 'hflex',
                  tag: 'div',
                  styles: { desktop: { display: 'flex', gap: '24px', padding: '0', alignItems: 'flex-start' } },
                  children: [
                    {
                      type: 'div',
                      tag: 'div',
                      styles: { desktop: { width: '48px', height: '48px', backgroundColor: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' } },
                      children: [{ type: 'text', tag: 'span', content: '4', styles: { desktop: { fontSize: '20px', fontWeight: '800', color: '#ffffff' } }, children: [] }],
                    },
                    {
                      type: 'vflex',
                      tag: 'div',
                      styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '8px', padding: '0', flex: '1' } },
                      children: [
                        { type: 'heading', tag: 'h3', content: 'Lancement', styles: { desktop: { fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '0' } }, children: [] },
                        { type: 'text', tag: 'div', content: 'Mise en ligne de votre site et accompagnement continu pour assurer votre succès.', styles: { desktop: { fontSize: '15px', color: '#64748b', lineHeight: '1.7', marginBottom: '0' } }, children: [] },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
];
