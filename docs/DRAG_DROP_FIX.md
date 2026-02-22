# 🔧 Corrections Drag & Drop et Page d'Accueil

## ✅ Problèmes Résolus

### 1. **Page d'accueil non créée à l'inscription**

**Problème** : Lors de l'inscription, seule la LandingPage (ancien système) était créée, mais pas la Page d'accueil (nouveau système éditeur).

**Solution** : Ajout de la création automatique de la page d'accueil dans `auth.service.ts`

```typescript
// 5. Créer la page d'accueil avec une section par défaut
await tx.page.create({
  data: {
    companyId: company.id,
    slug: '',
    title: 'Accueil',
    description: 'Page d\'accueil',
    isHomePage: true,
    isPublished: false,
    elements: [
      {
        id: `section-${Date.now()}`,
        type: 'section',
        tag: 'section',
        content: '',
        styles: {
          desktop: {
            display: 'block',
            width: '100%',
            padding: '80px 20px',
            backgroundColor: '#ffffff',
            minHeight: '400px',
          },
        },
        children: [],
      },
    ],
  },
});
```

**Résultat** : Maintenant, chaque nouvelle inscription crée automatiquement une page d'accueil avec une section vide prête à être éditée.

---

### 2. **Drag & Drop ne fonctionne pas**

**Problème** : Les éléments ne pouvaient pas être glissés-déposés dans les conteneurs parents (section, container, vflex, hflex, etc.)

**Causes identifiées** :
1. La vérification `canAcceptChild()` n'était pas appelée dans `handleDrop()`
2. Les données de drag n'étaient pas correctement lues (problème de casse dans `dataTransfer.types`)
3. Pas d'indicateur visuel pour montrer où l'élément sera déposé

**Solutions appliquées** :

#### a) Correction de la lecture des données de drag
```typescript
// Avant
const draggedType = e.dataTransfer.getData('elementType');

// Après (vérifie d'abord si les données existent)
const draggedType = e.dataTransfer.types.includes('elementtype') ? 
  e.dataTransfer.getData('elementType') : null;
```

#### b) Validation stricte dans handleDrop
```typescript
const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  
  const draggedType = e.dataTransfer.getData('elementType');
  const draggedTag = e.dataTransfer.getData('elementTag');
  
  // Vérifier que les données existent
  if (!draggedType || !draggedTag) {
    setDropTargetId(null);
    setDropPosition(null);
    return;
  }
  
  // Créer l'élément avec ID unique
  const newElement = {
    id: `${draggedType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: draggedType,
    tag: draggedTag,
    content: getDefaultContent(draggedType),
    styles: { desktop: getDefaultStyles(draggedType) },
    children: [],
  };

  // Vérifier la compatibilité parent-enfant
  if (dropPosition === 'inside' && canContainChildren(element.type) && canAcceptChild(element.type, draggedType)) {
    addElement(newElement, element.id);
  } else if (dropPosition === 'before') {
    addElementAt(newElement, parentId, element.id, 'before');
  } else if (dropPosition === 'after') {
    addElementAt(newElement, parentId, element.id, 'after');
  }

  setDropTargetId(null);
  setDropPosition(null);
};
```

#### c) Indicateurs visuels de drop
```typescript
// Ligne verte avant l'élément
{isDropTarget && dropPosition === 'before' && (
  <div style={{
    position: 'absolute',
    top: '-2px',
    left: 0,
    right: 0,
    height: '4px',
    backgroundColor: '#10b981',
    zIndex: 1000,
  }} />
)}

// Ligne verte après l'élément
{isDropTarget && dropPosition === 'after' && (
  <div style={{
    position: 'absolute',
    bottom: '-2px',
    left: 0,
    right: 0,
    height: '4px',
    backgroundColor: '#10b981',
    zIndex: 1000,
  }} />
)}

// Fond vert pour drop inside
backgroundColor: isDropTarget && dropPosition === 'inside' ? 'rgba(16, 185, 129, 0.05)' : ...
```

---

## 🎯 Règles de Compatibilité Parent-Enfant

### Header
- ✅ Peut contenir : `container`, `vflex`, `hflex`, `navbar`, `div`

### Section
- ✅ Peut contenir : `container`, `vflex`, `hflex`, `grid`, `div`

### Container / VFlex / HFlex / Div
- ✅ Peut contenir : Tout sauf `section`

### Grid
- ✅ Peut contenir : Tout sauf `section`, `container`

### Link-block
- ✅ Peut contenir : `heading`, `paragraph`, `text`, `image`, `div`, `vflex`, `hflex`

### Form
- ✅ Peut contenir : `input`, `textarea`, `checkbox`, `file-upload`, `button`, `div`, `vflex`, `hflex`

### List
- ✅ Peut contenir : `div`, `text`, `text-link`

### Navbar
- ✅ Peut contenir : `link-block`, `text-link`, `button`, `div`, `hflex`

---

## 🧪 Tests à Effectuer

### Test 1 : Nouvelle inscription
1. Créer un nouveau compte
2. Vérifier que la page d'accueil est créée automatiquement
3. Vérifier qu'elle contient une section vide

### Test 2 : Drag & Drop dans Section
1. Glisser un `container` dans une `section` → ✅ Doit fonctionner
2. Glisser un `heading` directement dans une `section` → ❌ Ne doit pas fonctionner
3. Glisser un `heading` dans un `container` → ✅ Doit fonctionner

### Test 3 : Drag & Drop dans Container
1. Glisser un `vflex` dans un `container` → ✅ Doit fonctionner
2. Glisser un `heading` dans un `container` → ✅ Doit fonctionner
3. Glisser une `section` dans un `container` → ❌ Ne doit pas fonctionner

### Test 4 : Indicateurs visuels
1. Survoler un élément compatible → Bordure verte + fond vert clair
2. Survoler un élément incompatible → Aucun indicateur
3. Drop before/after → Ligne verte horizontale

---

## 📝 Script de Migration

Un script a été créé pour ajouter les pages d'accueil manquantes :

```bash
cd backend
npx ts-node scripts/create-missing-home-pages.ts
```

**Résultat** : Toutes les entreprises existantes ont déjà leur page d'accueil ✅

---

## 🚀 Prochaines Améliorations

1. **Drag & Drop avancé**
   - Réorganiser les éléments existants (pas seulement ajouter)
   - Drag & drop entre différents parents
   - Indicateur de position plus précis (ligne entre les éléments)

2. **Validation visuelle**
   - Curseur "interdit" quand le drop n'est pas possible
   - Message tooltip expliquant pourquoi le drop est refusé

3. **Undo/Redo**
   - Améliorer l'historique pour le drag & drop
   - Raccourcis clavier Ctrl+Z / Ctrl+Y

4. **Performance**
   - Optimiser le rendu lors du drag (éviter les re-renders)
   - Virtualisation pour les grandes listes d'éléments

---

**Date** : 20 février 2026  
**Version** : 0.3.1 (Corrections Drag & Drop)
