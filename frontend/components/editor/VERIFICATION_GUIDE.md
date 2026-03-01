# Guide de Vérification - Système de Propriétés Modulaires

Ce guide vous permet de vérifier que le système de propriétés des blocs fonctionne correctement avec la nouvelle architecture modulaire.

## 🧪 Tests à effectuer

### 1. Test de base - Chargement des propriétés

```typescript
import { getBlockDefinition, getAllTemplateIds } from './elements/block-property-registry';

// Vérifier que les blocs sont chargés
console.log('Blocs disponibles:', getAllTemplateIds());

// Tester un bloc spécifique
const heroDefinition = getBlockDefinition('hero-centered');
console.log('Propriétés Hero:', heroDefinition?.properties);
```

**Résultat attendu :** 
- Liste de tous les template IDs (hero-centered, banner-announcement, etc.)
- Propriétés du bloc hero avec groupes (layout, appearance, content, typography)

### 2. Test d'interface - Panneau de propriétés

```tsx
import { BlockPropertyPanel } from './properties/BlockPropertyPanel';

// Utiliser le composant de test
<BlockPropertiesTest />
```

**Résultat attendu :**
- Panneau affiche les bonnes propriétés selon le bloc sélectionné
- Changement de bloc = changement des propriétés affichées
- Groupes de propriétés correctement organisés

### 3. Test par catégorie de blocs

#### Header (header-nav-light, header-nav-dark)
**Propriétés attendues :**
- `layout` : height, position
- `appearance` : backgroundColor, showBorder, borderColor  
- `branding` : logoSize

#### Hero (hero-centered, hero-split, hero-gradient-dark)
**Propriétés attendues :**
- `layout` : minHeight, paddingTop, paddingBottom, textAlign
- `appearance` : backgroundColor, backgroundType
- `content` : showBadge, badgeText, showSubtitle, showButtons, buttonLayout
- `typography` : titleSize

#### CTA (cta-centered, cta-split)
**Propriétés attendues :**
- `layout` : layout, padding
- `appearance` : backgroundColor, backgroundType, textColor
- `content` : showSubtitle, buttonCount, buttonLayout, showTrustSignals
- `typography` : titleSize

### 4. Test de fonctionnalité

#### Changement de propriétés
1. Sélectionner un bloc Hero
2. Modifier la propriété `backgroundColor`
3. Vérifier que la valeur est mise à jour
4. Changer pour un bloc CTA
5. Vérifier que les propriétés changent complètement

#### Types de propriétés
- **Color** : Sélecteur de couleur + palette
- **Range** : Slider avec valeur affichée
- **Select** : Dropdown avec options
- **Boolean** : Checkbox stylisé
- **Text** : Input texte avec placeholder
- **Number** : Input numérique avec unité

## 🔍 Points de vérification

### ✅ Architecture modulaire
- [ ] Chaque type de bloc a son propre fichier dans `properties/`
- [ ] Le fichier `index.ts` consolide tous les exports
- [ ] Le registre principal utilise les imports modulaires
- [ ] Compatibilité maintenue avec l'API existante

### ✅ Fonctionnalité
- [ ] `getBlockDefinition()` retourne la bonne définition
- [ ] `getAllTemplateIds()` liste tous les blocs
- [ ] `getAllCategories()` liste toutes les catégories
- [ ] `getTemplateInfo()` retourne nom, catégorie, icône

### ✅ Interface utilisateur
- [ ] Le panneau affiche les bonnes propriétés selon le bloc
- [ ] Les groupes sont correctement organisés
- [ ] Les labels et descriptions sont affichés
- [ ] Les contrôles fonctionnent (couleur, range, select, etc.)
- [ ] Les valeurs par défaut sont appliquées

### ✅ Intégration
- [ ] `BlockPropertiesIntegration` fonctionne avec la nouvelle API
- [ ] `EditorWithBlockProperties` affiche le bon panneau
- [ ] Les templates ont les attributs `data-template-id`

## 🐛 Problèmes courants et solutions

### Problème : "Aucune propriété disponible"
**Cause :** Le bloc n'est pas trouvé dans le registre
**Solution :** 
1. Vérifier que le template a `data-template-id`
2. Vérifier que le bloc est dans un fichier `*-properties.ts`
3. Vérifier l'export dans `properties/index.ts`

### Problème : Propriétés non groupées
**Cause :** Propriétés sans attribut `group`
**Solution :** Ajouter `group: 'layout'|'appearance'|'content'|'typography'`

### Problème : Contrôles ne fonctionnent pas
**Cause :** Type de propriété non supporté ou mal défini
**Solution :** Vérifier le type dans `BlockProperty` union type

## 📊 Métriques de succès

- **14 catégories** de blocs supportées
- **200+ propriétés** définies au total
- **6 types** de contrôles de propriétés
- **4-8 groupes** de propriétés par bloc
- **100% compatibilité** avec l'API existante

## 🚀 Test rapide

Pour un test rapide, utilisez le composant de démonstration :

```tsx
import { ModularPropertiesDemo } from './examples/ModularPropertiesDemo';

// Dans votre app
<ModularPropertiesDemo />
```

Ce composant vous permet de :
1. Voir tous les blocs disponibles
2. Sélectionner différents blocs
3. Voir leurs propriétés spécifiques
4. Tester les contrôles en temps réel
5. Voir les valeurs JSON en direct

## ✅ Validation finale

Le système fonctionne correctement si :

1. **Chaque bloc** affiche ses propres propriétés spécifiques
2. **Changer de bloc** change complètement le panneau de propriétés
3. **Les groupes** organisent logiquement les propriétés
4. **Les contrôles** permettent de modifier les valeurs
5. **L'architecture** est modulaire et maintenable

---

**🎉 Si tous ces tests passent, le système de propriétés modulaires fonctionne parfaitement !**