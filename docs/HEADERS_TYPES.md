# Headers - Deux approches

## 🎯 Vue d'ensemble

Sorika propose **2 types de headers** pour répondre à différents besoins :

### 1. **Header Simple** (`responsive-header`)
Header configuré via propriétés - Rapide et simple

### 2. **Header Flexible** (`header-flex`) 
Header avec drag & drop complet - Flexibilité maximale

---

## 📋 Header Simple (responsive-header)

### Caractéristiques
- ✅ Configuration via panneau de propriétés
- ✅ Logo (texte ou image)
- ✅ Menu items avec styles personnalisés
- ✅ Layouts prédéfinis
- ✅ Responsive automatique

### Structure de données
```typescript
{
  type: 'responsive-header',
  logoConfig: {
    type: 'text' | 'image',
    content: string,
    imageUrl: string,
    href: string
  },
  menuItems: [
    {
      id: string,
      label: string,
      href: string,
      linkType: 'anchor' | 'internal' | 'external',
      // Styles personnalisés
      fontSize: '16px',
      fontWeight: '500',
      fontFamily: 'Inter',
      color: '#475569',
      hoverColor: '#3b82f6'
    }
  ],
  headerLayout: 'logo-left-menu-right' | ...
}
```

### Propriétés des menu items
- **Typographie** : fontSize, fontWeight, fontFamily
- **Couleurs** : color, hoverColor
- **Liens** : href, linkType (anchor/internal/external)

### Cas d'usage
- ✅ Sites simples avec navigation standard
- ✅ Besoin de rapidité
- ✅ Cohérence visuelle garantie

---

## 🎨 Header Flexible (header-flex)

### Caractéristiques
- ✅ Container avec zones drag & drop
- ✅ Éléments enfants cliquables individuellement
- ✅ Toutes les propriétés disponibles
- ✅ Animations, effets, interactions
- ✅ Flexibilité totale

### Structure
```
Header Flexible (header-flex)
├── Logo Zone (container)
│   ├── Image (cliquable, éditable)
│   └── ou Text (cliquable, éditable)
├── Nav Zone (hflex)
│   ├── Text Link (toutes propriétés)
│   ├── Text Link
│   └── Button
└── CTA Zone (container)
    └── Button (toutes propriétés)
```

### Avantages
- ✅ Chaque élément est sélectionnable
- ✅ Propriétés complètes (typo, couleurs, animations)
- ✅ Drag & drop pour réorganiser
- ✅ Ajout de n'importe quel élément

### Cas d'usage
- ✅ Sites complexes avec navigation avancée
- ✅ Besoin de personnalisation poussée
- ✅ Headers avec CTA, recherche, icônes

---

## 📊 Comparaison

| Aspect | Header Simple | Header Flexible |
|--------|---------------|-----------------|
| **Facilité** | ⭐⭐⭐⭐⭐ Très simple | ⭐⭐⭐ Moyen |
| **Rapidité** | ⭐⭐⭐⭐⭐ Instantané | ⭐⭐⭐ Plus long |
| **Flexibilité** | ⭐⭐⭐ Limitée | ⭐⭐⭐⭐⭐ Totale |
| **Personnalisation** | ⭐⭐⭐ Styles de base | ⭐⭐⭐⭐⭐ Complète |
| **Animations** | ❌ Non | ✅ Oui |
| **Éléments custom** | ❌ Non | ✅ Oui |

---

## 🚀 Implémentation

### Phase 1 : Header Simple (Option 1) ✅
- [x] Ajouter styles aux MenuItem
- [x] Panneau de propriétés avec typographie
- [x] Renderer avec styles appliqués
- [ ] Tests et validation

### Phase 2 : Header Flexible (Option 2) 🔄
- [ ] Créer type `header-flex`
- [ ] Zones drag & drop (logo, nav, cta)
- [ ] Accepter éléments enfants
- [ ] Renderer avec children
- [ ] Templates prédéfinis

---

## 💡 Recommandations

### Utilisez Header Simple si :
- Site vitrine classique
- Navigation simple (5-7 liens)
- Besoin de rapidité
- Pas d'animations complexes

### Utilisez Header Flexible si :
- Site e-commerce ou SaaS
- Navigation complexe (mega menu, dropdowns)
- Besoin d'animations
- Éléments custom (recherche, panier, profil)

---

## 🎯 Prochaines étapes

1. ✅ Finaliser Header Simple avec styles
2. 🔄 Créer Header Flexible inspiré des templates
3. 📝 Documentation utilisateur
4. 🎨 Templates pour les deux types
