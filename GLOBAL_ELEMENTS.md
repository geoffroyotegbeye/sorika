# Éléments Globaux

## Concept

Les **éléments globaux** permettent de définir des composants (navbar, header, footer) qui apparaissent automatiquement sur **toutes les pages** du site sans avoir à les reconfigurer à chaque fois.

## Utilisation

### 1. Marquer un élément comme global

Dans l'éditeur :
1. Sélectionnez un élément (navbar, header, ou section)
2. Ouvrez le panneau de propriétés (à droite)
3. Allez dans l'onglet **Style**
4. Ouvrez la section **Global**
5. Cochez "Afficher sur toutes les pages"

### 2. Sauvegarde automatique

Lorsque vous sauvegardez la page :
- Les éléments marqués comme globaux sont extraits
- Ils sont stockés au niveau de la Company (pas de la Page)
- Ils sont automatiquement retirés des éléments de la page

### 3. Injection automatique

Quand une page est chargée (éditeur, preview, ou public) :
- Les éléments globaux sont récupérés depuis Company
- Ils sont injectés **au début** de la page
- Ils apparaissent sur toutes les pages du site

## Cas d'usage typiques

### Navbar
```
✅ Créez votre navbar sur la page d'accueil
✅ Marquez-la comme globale
✅ Elle apparaît automatiquement sur toutes les pages
```

### Footer
```
✅ Créez votre footer sur n'importe quelle page
✅ Marquez-le comme global
✅ Il apparaît en bas de toutes les pages
```

## Architecture technique

### Base de données
```prisma
model Company {
  globalElements Json @default("[]") // Éléments globaux
}
```

### Backend
- `extractGlobalElements()` : Extrait les éléments avec `isGlobal: true`
- `getGlobalElements()` : Récupère les éléments globaux d'une company
- Les endpoints `/home` et `/:slug` injectent automatiquement les globaux

### Frontend
- Propriété `isGlobal` ajoutée aux éléments
- Section "Global" dans PropertiesPanelNew pour navbar/header/section
- Aucune modification nécessaire dans le renderer

## Avantages

✅ **Cohérence** : Navbar/footer identiques sur toutes les pages
✅ **Productivité** : Configurez une seule fois
✅ **Maintenance** : Modifiez à un seul endroit
✅ **Flexibilité** : Activez/désactivez facilement

## Limitations

- Les éléments globaux apparaissent toujours **au début** de la page
- Pour un footer, utilisez `position: fixed; bottom: 0` ou placez-le manuellement
- Maximum recommandé : 1-2 éléments globaux (navbar + footer)
