export const getDefaultStyles = (type: string) => {
  const base = { display: 'block' };

  const styles: Record<string, any> = {
    'responsive-header': { 
      ...base, 
      width: '100%', 
      padding: '16px 20px', 
      backgroundColor: '#ffffff', 
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: '0',
      zIndex: '1000'
    },
    section: { ...base, padding: '80px 20px', backgroundColor: '#ffffff' },
    container: { ...base, maxWidth: '1200px', margin: '0 auto', padding: '20px' },
    grid: { display: 'grid', gridTemplateColumns: '1fr', gap: '20px', minHeight: '100px' },
    vflex: { display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' },
    hflex: { display: 'flex', flexDirection: 'row', gap: '16px', padding: '20px', alignItems: 'center' },
    div: { ...base, padding: '20px' },
    'link-block': { ...base, textDecoration: 'none', color: 'inherit' },
    button: { display: 'inline-block', padding: '12px 24px', backgroundColor: '#3b82f6', color: '#ffffff', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', border: 'none' },
    list: { ...base, paddingLeft: '20px' },
    heading: { ...base, fontSize: '32px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' },
    paragraph: { ...base, fontSize: '16px', lineHeight: '1.6', color: '#475569' },
    text: { display: 'inline', fontSize: '16px', color: '#1e293b' },
    'text-link': { display: 'inline', color: '#3b82f6', textDecoration: 'underline', cursor: 'pointer' },
    blockquote: { ...base, borderLeft: '4px solid #3b82f6', paddingLeft: '16px', fontStyle: 'italic', color: '#475569' },
    image: { ...base, width: '100%', height: 'auto', objectFit: 'cover', marginLeft: 'auto', marginRight: 'auto' },
    video: { ...base, width: '100%', height: 'auto', objectFit: 'cover' },
    form: { ...base, padding: '20px' },
    input: { ...base, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px' },
    textarea: { ...base, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px', minHeight: '100px' },
    checkbox: { display: 'inline-block', width: '16px', height: '16px' },
    'file-upload': { ...base, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px' },
    navbar: { ...base, padding: '16px 20px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' },
  };

  return styles[type] || base;
};

export const getDefaultContent = (type: string) => {
  const content: Record<string, string> = {
    'responsive-header': '',
    heading: 'Nouveau titre',
    paragraph: 'Nouveau paragraphe de texte.',
    text: 'Texte',
    button: 'Cliquez ici',
    'text-link': 'Lien',
    blockquote: 'Citation importante',
  };

  return content[type] || '';
};

export const getDefaultChildren = (type: string) => {
  // Pour les grids, initialiser avec un tableau de null (1 cellule par défaut)
  if (type === 'grid') {
    return [null];
  }
  return [];
};

export const getDefaultMenuItems = (type: string) => {
  if (type === 'responsive-header') {
    return [
      { id: 'menu-1', label: 'Accueil', href: '#' },
      { id: 'menu-2', label: 'Services', href: '#services' },
      { id: 'menu-3', label: 'À propos', href: '#about' },
      { id: 'menu-4', label: 'Contact', href: '#contact' },
    ];
  }
  return undefined;
};
