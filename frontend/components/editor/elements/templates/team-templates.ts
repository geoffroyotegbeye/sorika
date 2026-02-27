import { Users, LucideIcon } from 'lucide-react';

export interface LayoutTemplate {
  id: string;
  label: string;
  category: string;
  icon: LucideIcon;
  template: any;
}

export const TEAM_TEMPLATES: LayoutTemplate[] = [
  {
    id: 'team-grid',
    label: 'Équipe Grille',
    category: 'Team',
    icon: Users,
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
              styles: { desktop: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px', padding: '0', marginBottom: '56px' } },
              children: [
                { type: 'heading', tag: 'h2', content: 'Notre équipe', styles: { desktop: { fontSize: '40px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0' }, mobile: { fontSize: '28px' } }, children: [] },
                { type: 'text', tag: 'div', content: 'Des experts passionnés au service de votre réussite digitale.', styles: { desktop: { fontSize: '17px', color: '#475569', marginBottom: '0' } }, children: [] },
              ],
            },
            {
              type: 'grid',
              tag: 'div',
              styles: {
                desktop: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' },
                tablet: { gridTemplateColumns: 'repeat(2, 1fr)' },
                mobile: { gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' },
              },
              children: [
                // Membre 1
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: { desktop: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px', padding: '24px 16px', borderRadius: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' } },
                  children: [
                    { type: 'div', tag: 'div', styles: { desktop: { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' } }, children: [{ type: 'text', tag: 'span', content: '👩‍💼', styles: { desktop: { fontSize: '28px' } }, children: [] }] },
                    { type: 'vflex', tag: 'div', styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '4px', padding: '0' } }, children: [{ type: 'text', tag: 'span', content: 'Awa Diallo', styles: { desktop: { fontSize: '15px', fontWeight: '700', color: '#0f172a' } }, children: [] }, { type: 'text', tag: 'span', content: 'CEO & Fondatrice', styles: { desktop: { fontSize: '13px', color: '#64748b' } }, children: [] }] },
                  ],
                },
                // Membre 2
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: { desktop: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px', padding: '24px 16px', borderRadius: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' } },
                  children: [
                    { type: 'div', tag: 'div', styles: { desktop: { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, children: [{ type: 'text', tag: 'span', content: '👨‍💻', styles: { desktop: { fontSize: '28px' } }, children: [] }] },
                    { type: 'vflex', tag: 'div', styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '4px', padding: '0' } }, children: [{ type: 'text', tag: 'span', content: 'Moussa Traoré', styles: { desktop: { fontSize: '15px', fontWeight: '700', color: '#0f172a' } }, children: [] }, { type: 'text', tag: 'span', content: 'Lead Developer', styles: { desktop: { fontSize: '13px', color: '#64748b' } }, children: [] }] },
                  ],
                },
                // Membre 3
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: { desktop: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px', padding: '24px 16px', borderRadius: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' } },
                  children: [
                    { type: 'div', tag: 'div', styles: { desktop: { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, children: [{ type: 'text', tag: 'span', content: '👩‍🎨', styles: { desktop: { fontSize: '28px' } }, children: [] }] },
                    { type: 'vflex', tag: 'div', styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '4px', padding: '0' } }, children: [{ type: 'text', tag: 'span', content: 'Fatoumata Ba', styles: { desktop: { fontSize: '15px', fontWeight: '700', color: '#0f172a' } }, children: [] }, { type: 'text', tag: 'span', content: 'Head of Design', styles: { desktop: { fontSize: '13px', color: '#64748b' } }, children: [] }] },
                  ],
                },
                // Membre 4
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: { desktop: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px', padding: '24px 16px', borderRadius: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' } },
                  children: [
                    { type: 'div', tag: 'div', styles: { desktop: { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#fef9c3', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, children: [{ type: 'text', tag: 'span', content: '👨‍📊', styles: { desktop: { fontSize: '28px' } }, children: [] }] },
                    { type: 'vflex', tag: 'div', styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '4px', padding: '0' } }, children: [{ type: 'text', tag: 'span', content: 'Issouf Coulibaly', styles: { desktop: { fontSize: '15px', fontWeight: '700', color: '#0f172a' } }, children: [] }, { type: 'text', tag: 'span', content: 'Growth Manager', styles: { desktop: { fontSize: '13px', color: '#64748b' } }, children: [] }] },
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