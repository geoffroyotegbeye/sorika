# Test du système de propriétés de bloc

## ✅ Corrections appliquées

### 1. Hook `useBlockProperties` corrigé
- ✅ Support des deux APIs (string et options)
- ✅ Chargement automatique des propriétés par défaut
- ✅ État `properties` et `isLoading` ajoutés
- ✅ Fonctions `updateProperty` et `resetProperties` ajoutées

### 2. `BlockPropertiesIntegration` corrigé
- ✅ Appel correct du hook avec options
- ✅ Mise à jour de la sélection via `updateBlockSelection`
- ✅ Application correcte des propriétés au DOM

### 3. `SelectionContextAnalyzer` amélioré
- ✅ Méthode statique `analyze()` ajoutée pour compatibilité
- ✅ Extraction du `templateId` depuis `data-template-id`

### 4. `BlockPropertyManager` corrigé
- ✅ Mapping CSS direct (backgroundColor au lieu de background-color)
- ✅ Support des unités pour height
- ✅ Application correcte des propriétés boolean

## 🧪 Comment tester

### Test 1 : Sélection d'un header
```typescript
// 1. Ajouter un header depuis les templates
// 2. Cliquer sur le header dans le canvas
// 3. Vérifier que le panneau affiche :
//    - "Header Clair" ou "Header Sombre"
//    - Les propriétés : height, position, backgroundColor, etc.
```

### Test 2 : Modification d'une propriété
```typescript
// 1. Sélectionner un header
// 2. Changer "Hauteur du header" (range slider)
// 3. Vérifier que la hauteur change en temps réel dans le canvas
// 4. Changer "Couleur de fond"
// 5. Vérifier que la couleur change immédiatement
```

### Test 3 : Changement de bloc
```typescript
// 1. Sélectionner un header (voir ses propriétés)
// 2. Cliquer sur un autre bloc (hero, pricing, etc.)
// 3. Vérifier que les propriétés changent automatiquement
// 4. Les valeurs doivent être différentes pour chaque bloc
```

### Test 4 : Réinitialisation
```typescript
// 1. Modifier plusieurs propriétés d'un bloc
// 2. Cliquer sur le bouton "↻" (réinitialiser)
// 3. Vérifier que toutes les propriétés reviennent aux valeurs par défaut
```

## 🐛 Debug

### Si les propriétés ne s'affichent pas :
1. Ouvrir la console (F12)
2. Chercher les logs "Debug - Propriétés du bloc"
3. Vérifier :
   - `templateId` est bien défini
   - `propertiesCount` > 0
   - `hasDefinition` = true

### Si les changements ne s'appliquent pas :
1. Vérifier que l'élément a `data-template-id` :
   ```javascript
   document.querySelector('[data-template-id]')
   ```
2. Vérifier les logs dans la console
3. Inspecter l'élément pour voir si les styles sont appliqués

### Console debug :
```javascript
// Dans la console du navigateur
localStorage.setItem('block-properties-debug', 'true');
// Recharger la page
```

## 📝 Checklist de vérification

- [ ] Le panneau s'affiche quand je clique sur un bloc
- [ ] Les propriétés changent quand je change de bloc
- [ ] Les modifications s'appliquent en temps réel dans le canvas
- [ ] Le bouton de réinitialisation fonctionne
- [ ] Pas d'erreurs dans la console
- [ ] Les valeurs par défaut sont correctes

## 🔍 Points d'attention

1. **data-template-id** : Tous les templates doivent avoir cet attribut
2. **Mapping CSS** : Vérifier que les propriétés sont bien mappées
3. **Breakpoints** : Les propriétés s'appliquent au breakpoint actuel
4. **Performance** : Les changements doivent être instantanés

## 🚀 Prochaines étapes

Si tout fonctionne :
1. Ajouter plus de propriétés aux blocs existants
2. Créer des propriétés pour les nouveaux blocs
3. Améliorer le mapping CSS pour les cas complexes
4. Ajouter la persistance des propriétés
