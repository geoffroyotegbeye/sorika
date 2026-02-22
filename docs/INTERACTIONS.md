# Système d'Interactions - Sorika

## Vue d'ensemble

Le système d'interactions de Sorika permet de créer des animations et interactions avancées **sans écrire de code JavaScript**. Il génère automatiquement du code JS professionnel basé sur GSAP.

## Architecture

### Composants principaux

1. **InteractionEngine** (`lib/interactions/engine.ts`)
   - Moteur central qui gère toutes les interactions
   - Génère et exécute du code JavaScript
   - Utilise GSAP pour les animations

2. **Types** (`lib/interactions/types.ts`)
   - Définitions TypeScript pour les interactions
   - 5 types de triggers
   - 5 types d'actions

3. **InteractionsTab** (`components/editor/properties/InteractionsTab.tsx`)
   - Interface utilisateur pour configurer les interactions
   - Liste des interactions actives
   - Boutons pour ajouter de nouvelles interactions

4. **AnimationPanel** (`components/editor/properties/AnimationPanel.tsx`)
   - Panneau modal pour configurer les actions
   - Interface visuelle pour tous les paramètres

## Types de Triggers

### 1. Click
Déclenche l'action au clic sur l'élément.

```typescript
trigger: 'click'
```

### 2. Hover
Déclenche l'action au survol de l'élément.

```typescript
trigger: 'hover'
```

### 3. Page Load
Déclenche l'action au chargement de la page.

```typescript
trigger: 'page-load'
```

### 4. Scroll
Déclenche l'action pendant le scroll (avec ScrollTrigger de GSAP).

```typescript
trigger: 'scroll',
triggerConfig: {
  scrollStart: 80, // Commence à 80% du viewport
  scrollEnd: 20    // Termine à 20% du viewport
}
```

### 5. Custom Event
Déclenche l'action sur un événement personnalisé.

```typescript
trigger: 'custom',
triggerConfig: {
  eventName: 'myCustomEvent'
}
```

## Types d'Actions

### 1. Animate
Anime une propriété CSS avec GSAP.

**Propriétés disponibles:**
- `opacity` - Opacité (0 à 1)
- `x` - Position horizontale (pixels)
- `y` - Position verticale (pixels)
- `scale` - Échelle (0.5 = 50%, 2 = 200%)
- `rotation` - Rotation (degrés)
- `width` - Largeur
- `height` - Hauteur

**Paramètres:**
- `property` - Propriété à animer
- `from` - Valeur de départ (optionnel)
- `to` - Valeur d'arrivée
- `duration` - Durée en secondes
- `delay` - Délai avant démarrage
- `ease` - Type d'easing (power2.out, bounce.out, etc.)
- `repeat` - Nombre de répétitions (-1 = infini)
- `yoyo` - Retour en arrière après animation

**Exemple:**
```typescript
{
  type: 'animate',
  config: {
    property: 'opacity',
    from: 0,
    to: 1,
    duration: 1,
    ease: 'power2.out'
  }
}
```

### 2. Navigate
Navigue vers une URL.

**Paramètres:**
- `url` - URL de destination
- `target` - `_self` (même onglet) ou `_blank` (nouvel onglet)

**Exemple:**
```typescript
{
  type: 'navigate',
  config: {
    url: 'https://example.com',
    target: '_blank'
  }
}
```

### 3. Toggle Class
Ajoute/retire une classe CSS.

**Paramètres:**
- `className` - Nom de la classe
- `targetSelector` - Sélecteur CSS de la cible (optionnel, par défaut = élément actuel)

**Exemple:**
```typescript
{
  type: 'toggle-class',
  config: {
    className: 'active',
    targetSelector: '.menu'
  }
}
```

### 4. Show/Hide
Affiche ou cache un élément avec animation.

**Paramètres:**
- `targetSelector` - Sélecteur CSS de l'élément
- `action` - `show`, `hide`, ou `toggle`

**Exemple:**
```typescript
{
  type: 'show-hide',
  config: {
    targetSelector: '#modal',
    action: 'toggle'
  }
}
```

### 5. Custom Code
Exécute du code JavaScript personnalisé.

**Variables disponibles:**
- `element` - L'élément DOM
- `gsap` - La bibliothèque GSAP

**Exemple:**
```typescript
{
  type: 'custom-code',
  config: {
    code: `
      element.style.color = 'red';
      gsap.to(element, { rotation: 360, duration: 2 });
    `
  }
}
```

## Utilisation

### 1. Dans l'éditeur

1. Sélectionner un élément
2. Aller dans l'onglet "Actions"
3. Cliquer sur un trigger (Click, Hover, etc.)
4. Configurer l'action dans le panneau
5. Sauvegarder

### 2. Code généré

Le système génère automatiquement du code JavaScript propre:

```javascript
// Interactions for element: button-123
const element = document.querySelector('[data-element-id="button-123"]');

// Interaction 1: click
element.addEventListener('click', () => {
  gsap.to(element, {
    opacity: 1,
    duration: 1,
    ease: "power2.out"
  });
});
```

### 3. Visualisation du code

Cliquer sur "View Generated Code" dans l'onglet Actions pour voir le code JavaScript généré.

## Exemples d'utilisation

### Fade In au chargement
```typescript
{
  trigger: 'page-load',
  actions: [{
    type: 'animate',
    config: {
      property: 'opacity',
      from: 0,
      to: 1,
      duration: 1
    }
  }]
}
```

### Slide In au scroll
```typescript
{
  trigger: 'scroll',
  triggerConfig: { scrollStart: 80, scrollEnd: 20 },
  actions: [{
    type: 'animate',
    config: {
      property: 'x',
      from: -100,
      to: 0,
      duration: 1
    }
  }]
}
```

### Bouton avec effet hover
```typescript
{
  trigger: 'hover',
  actions: [{
    type: 'animate',
    config: {
      property: 'scale',
      to: 1.1,
      duration: 0.3
    }
  }]
}
```

### Navigation au clic
```typescript
{
  trigger: 'click',
  actions: [{
    type: 'navigate',
    config: {
      url: '/contact',
      target: '_self'
    }
  }]
}
```

## Stockage

Les interactions sont stockées dans la propriété `interactions` de chaque élément:

```typescript
{
  id: 'button-123',
  type: 'button',
  interactions: [
    {
      id: 'interaction-456',
      trigger: 'click',
      actions: [...]
    }
  ],
  ...
}
```

## Performance

- GSAP est optimisé pour les performances
- Les animations utilisent le GPU quand possible
- ScrollTrigger est lazy-loaded
- Cleanup automatique des event listeners

## Limitations actuelles

- Pas de timeline complexe (séquences)
- Pas d'animations sur path SVG
- Pas de morphing
- Pas de parallax avancé

## Évolutions futures

- [ ] Timeline builder visuel
- [ ] Animations SVG avancées
- [ ] Morphing de formes
- [ ] Parallax configurateur
- [ ] Presets d'animations
- [ ] Import/export d'interactions
