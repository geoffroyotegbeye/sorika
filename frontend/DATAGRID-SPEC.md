# 📊 Spécification DataGrid Réutilisable

## Objectif
Créer un composant DataGrid unique et réutilisable pour toute l'application avec :
- Recherche optimale
- Tri des colonnes
- Pagination
- Actions personnalisables
- Sélection multiple
- États (loading, empty)

## Fonctionnalités

### 1. Recherche
- Recherche globale dans toutes les colonnes searchable
- Recherche en temps réel (debounced)
- Highlight des résultats

### 2. Tri
- Tri par colonne (asc/desc)
- Indicateur visuel de tri
- Tri multiple (futur)

### 3. Pagination
- Nombre d'éléments par page configurable
- Navigation (précédent, suivant, numéros de page)
- Affichage du total

### 4. Actions
- Actions par ligne (modifier, supprimer, voir)
- Actions groupées (sélection multiple)
- Permissions intégrées

### 5. Personnalisation
- Colonnes configurables
- Rendu personnalisé par cellule
- Largeur des colonnes
- Alignement du texte

## Structure des fichiers

```
components/data-grid/
├── types.ts              # Types TypeScript
├── DataGrid.tsx          # Composant principal
├── DataGridHeader.tsx    # En-tête avec recherche
├── DataGridTable.tsx     # Table avec tri
├── DataGridPagination.tsx # Pagination
├── DataGridEmpty.tsx     # État vide
└── index.ts              # Exports
```

## Utilisation

```tsx
<DataGrid
  data={employees}
  columns={[
    { key: 'firstName', label: 'Prénom', sortable: true, searchable: true },
    { key: 'email', label: 'Email', sortable: true },
    { 
      key: 'status', 
      label: 'Statut',
      render: (value) => <Badge>{value}</Badge>
    },
  ]}
  actions={[
    { label: 'Modifier', icon: Edit, onClick: handleEdit },
    { label: 'Supprimer', icon: Trash, onClick: handleDelete, variant: 'destructive' },
  ]}
  searchable
  sortable
  paginated
  pageSize={10}
/>
```

## Prochaines étapes
1. Créer les types (✅ fait)
2. Créer DataGrid.tsx
3. Créer les sous-composants
4. Créer des exemples
5. Documenter l'utilisation
