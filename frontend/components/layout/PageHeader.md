# PageHeader Component

Composant d'en-tête réutilisable pour toutes les pages du dashboard. Assure une présentation uniforme.

## Props

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `title` | `string` | ✅ | Titre principal de la page |
| `description` | `string` | ❌ | Description ou sous-titre (ex: nombre d'éléments) |
| `breadcrumbs` | `BreadcrumbItem[]` | ❌ | Fil d'Ariane pour la navigation |
| `actions` | `React.ReactNode` | ❌ | Boutons ou actions à droite (ex: Créer, Exporter) |
| `children` | `React.ReactNode` | ❌ | Contenu personnalisé sous le titre |

## Exemples d'utilisation

### 1. Simple (titre uniquement)
```tsx
<PageHeader title="Tableau de bord" />
```

### 2. Avec description
```tsx
<PageHeader 
  title="Projets" 
  description="12 projets actifs"
/>
```

### 3. Avec fil d'Ariane
```tsx
<PageHeader 
  title="Détails du projet"
  breadcrumbs={[
    { label: 'Projets', href: '/dashboard/company/projects' },
    { label: 'Mon Projet', href: '/dashboard/company/projects/123' },
    { label: 'Détails' }, // Dernier élément sans href = page actuelle
  ]}
/>
```

### 4. Avec actions (boutons)
```tsx
<PageHeader 
  title="Clients"
  description="45 clients"
  actions={
    <Button onClick={handleCreate}>
      <Plus className="h-4 w-4 mr-2" />
      Nouveau client
    </Button>
  }
/>
```

### 5. Avec plusieurs actions
```tsx
<PageHeader 
  title="Factures"
  description="128 factures"
  breadcrumbs={[
    { label: 'Comptabilité', href: '/dashboard/company/accounting' },
    { label: 'Factures' },
  ]}
  actions={
    <>
      <Button variant="outline" onClick={handleExport}>
        <Download className="h-4 w-4 mr-2" />
        Exporter
      </Button>
      <Button onClick={handleCreate}>
        <Plus className="h-4 w-4 mr-2" />
        Nouvelle facture
      </Button>
    </>
  }
/>
```

### 6. Avec contenu personnalisé (children)
```tsx
<PageHeader 
  title="Statistiques"
  description="Vue d'ensemble"
>
  {/* Onglets ou filtres personnalisés */}
  <Tabs value={activeTab} onValueChange={setActiveTab}>
    <TabsList>
      <TabsTrigger value="week">Semaine</TabsTrigger>
      <TabsTrigger value="month">Mois</TabsTrigger>
      <TabsTrigger value="year">Année</TabsTrigger>
    </TabsList>
  </Tabs>
</PageHeader>
```

## Migration rapide

### Avant
```tsx
<div className="flex items-center justify-between mb-6">
  <div>
    <h1 className="text-2xl font-bold">Titre</h1>
    <p className="text-sm text-muted-foreground">Description</p>
  </div>
  <Button>Action</Button>
</div>
```

### Après
```tsx
<PageHeader
  title="Titre"
  description="Description"
  actions={<Button>Action</Button>}
/>
```

## Style et hauteur

Le composant utilise :
- `pb-6` : padding bottom de 1.5rem
- `border-b` : bordure inférieure pour séparer du contenu
- Hauteur dynamique selon le contenu (titre + description + breadcrumbs)
- Responsive : actions passent en colonne sur mobile si nécessaire

## Dark Mode

Le composant est entièrement compatible dark mode avec les classes Tailwind :
- `text-foreground` pour le titre
- `text-muted-foreground` pour la description
- `border-border` pour la bordure
