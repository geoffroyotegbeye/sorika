# 🌐 Compatibilité Navigateurs - Drag & Drop

## ⚠️ Problème Safari

### Symptôme
Le drag & drop ne fonctionne pas correctement dans Safari. Le fond vert ne s'affiche pas lors du survol d'un élément avec un élément en cours de drag.

### Cause
Safari a des **restrictions de sécurité** sur l'API Drag & Drop :
- `dataTransfer.getData()` ne fonctionne **que dans l'événement `onDrop`**
- Dans `onDragOver`, Safari ne permet pas de lire les données pour des raisons de sécurité
- Cela empêche de valider la compatibilité parent-enfant pendant le drag

### Solution Appliquée
Au lieu de valider pendant `onDragOver`, on accepte tous les drops sur les conteneurs et on valide dans `onDrop` :

```typescript
const handleDragOver = (e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  
  // Safari ne permet pas de lire dataTransfer.getData() ici
  // On accepte tous les drops, la validation se fait dans onDrop
  if (canContainChildren(element.type)) {
    setDropTargetId(element.id);
    setDropPosition('inside');
  }
};

const handleDrop = (e: React.DragEvent) => {
  // Ici, Safari permet de lire les données
  const draggedType = e.dataTransfer.getData('elementType');
  const canAccept = canAcceptChild(element.type, draggedType);
  
  if (canAccept) {
    addElement(newElement, element.id);
  }
};
```

---

## ✅ Navigateurs Testés

| Navigateur | Version | Drag & Drop | Indicateurs Visuels | Notes |
|------------|---------|-------------|---------------------|-------|
| **Chrome** | 120+ | ✅ Fonctionne | ✅ Fond vert visible | Recommandé |
| **Firefox** | 120+ | ✅ Fonctionne | ✅ Fond vert visible | Recommandé |
| **Edge** | 120+ | ✅ Fonctionne | ✅ Fond vert visible | Recommandé |
| **Safari** | 17+ | ⚠️ Limité | ⚠️ Pas d'indicateur pendant drag | Fonctionne mais UX dégradée |

---

## 🔧 Workaround pour Safari

### Option 1 : Accepter l'UX dégradée (actuel)
- Le drag & drop fonctionne
- Pas d'indicateur visuel pendant le drag
- Validation au moment du drop

### Option 2 : Utiliser un flag global (futur)
```typescript
// Dans ElementsPanel.tsx
let currentDragType: string | null = null;

onDragStart={(e) => {
  currentDragType = item.type;
  e.dataTransfer.setData('elementType', item.type);
}}

onDragEnd={() => {
  currentDragType = null;
}}

// Dans Canvas.tsx
const handleDragOver = (e: React.DragEvent) => {
  // Utiliser la variable globale au lieu de dataTransfer
  if (currentDragType && canAcceptChild(element.type, currentDragType)) {
    setDropTargetId(element.id);
  }
};
```

### Option 3 : Utiliser effectAllowed/dropEffect
```typescript
onDragStart={(e) => {
  e.dataTransfer.effectAllowed = 'copy';
  e.dataTransfer.setData('text/plain', item.type); // Fallback
}}

const handleDragOver = (e: React.DragEvent) => {
  e.dataTransfer.dropEffect = 'copy';
  // Safari permet de lire effectAllowed
};
```

---

## 📱 Mobile

Le drag & drop HTML5 **ne fonctionne pas sur mobile** (iOS/Android).

### Solutions pour le mobile :
1. **Touch events** : Implémenter avec `onTouchStart`, `onTouchMove`, `onTouchEnd`
2. **Bibliothèque** : Utiliser `react-beautiful-dnd` ou `@dnd-kit/core` (déjà installé !)
3. **Boutons** : Ajouter des boutons "Ajouter avant/après" pour mobile

---

## 🎯 Recommandations

### Pour les utilisateurs
- **Utiliser Chrome, Firefox ou Edge** pour la meilleure expérience
- Safari fonctionne mais avec une UX dégradée (pas d'indicateur visuel)

### Pour le développement
1. **Court terme** : Garder la solution actuelle (fonctionne partout)
2. **Moyen terme** : Implémenter le workaround avec flag global pour Safari
3. **Long terme** : Migrer vers `@dnd-kit/core` pour :
   - Support mobile
   - Meilleure compatibilité Safari
   - Animations fluides
   - Accessibilité (clavier)

---

## 📚 Ressources

- [MDN - Drag & Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
- [Safari Drag & Drop Limitations](https://bugs.webkit.org/show_bug.cgi?id=11957)
- [@dnd-kit Documentation](https://docs.dndkit.com/)

---

**Dernière mise à jour** : 20 février 2026  
**Testé sur** : Chrome 120, Safari 17, Firefox 120, Edge 120
