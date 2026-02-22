# Header Simple - Implémentation Option 1

## ✅ Ce qui a été fait

### 1. Structure de données
- ✅ Ajout des propriétés de style dans `MenuItem` interface
- ✅ fontSize, fontWeight, fontFamily, color, hoverColor

### 2. Propriétés actuelles
- ✅ Logo (texte/image avec upload)
- ✅ Menu items (label, href, linkType)
- ✅ Layouts (5 dispositions)
- ✅ Sections disponibles (dropdown automatique)
- ✅ Global (afficher sur toutes les pages)

## 🔄 À faire pour Option 1

### Ajouter dans ResponsiveHeaderProperties.tsx

Dans chaque menu item, ajouter une section "Style" avec :

```tsx
<Accordion type="single" collapsible>
  <AccordionItem value="style">
    <AccordionTrigger className="text-xs">Style du lien</AccordionTrigger>
    <AccordionContent className="space-y-2">
      {/* Taille de police */}
      <div>
        <Label className="text-xs">Taille</Label>
        <Select
          value={item.fontSize || '15px'}
          onValueChange={(value) => updateMenuItem(item.id, { fontSize: value })}
        >
          <SelectItem value="12px">12px</SelectItem>
          <SelectItem value="14px">14px</SelectItem>
          <SelectItem value="15px">15px (défaut)</SelectItem>
          <SelectItem value="16px">16px</SelectItem>
          <SelectItem value="18px">18px</SelectItem>
        </Select>
      </div>

      {/* Poids de police */}
      <div>
        <Label className="text-xs">Poids</Label>
        <Select
          value={item.fontWeight || '500'}
          onValueChange={(value) => updateMenuItem(item.id, { fontWeight: value })}
        >
          <SelectItem value="400">Normal</SelectItem>
          <SelectItem value="500">Medium (défaut)</SelectItem>
          <SelectItem value="600">Semi-bold</SelectItem>
          <SelectItem value="700">Bold</SelectItem>
        </Select>
      </div>

      {/* Couleur */}
      <div>
        <Label className="text-xs">Couleur</Label>
        <Input
          type="color"
          value={item.color || '#475569'}
          onChange={(e) => updateMenuItem(item.id, { color: e.target.value })}
        />
      </div>

      {/* Couleur hover */}
      <div>
        <Label className="text-xs">Couleur au survol</Label>
        <Input
          type="color"
          value={item.hoverColor || '#3b82f6'}
          onChange={(e) => updateMenuItem(item.id, { hoverColor: e.target.value })}
        />
      </div>
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

### Mettre à jour ResponsiveHeaderRenderer.tsx

Appliquer les styles dans `renderMenuItem()` :

```tsx
const linkStyle = {
  color: item.color || '#475569',
  textDecoration: 'none',
  fontSize: item.fontSize || '15px',
  fontWeight: item.fontWeight || '500',
  fontFamily: item.fontFamily || 'inherit',
  transition: 'color 0.2s',
};

// Au survol
onMouseEnter={(e) => {
  e.currentTarget.style.color = item.hoverColor || '#3b82f6';
}}
onMouseLeave={(e) => {
  e.currentTarget.style.color = item.color || '#475569';
}}
```

## 🎨 Option 2 - Header Flexible

À créer après Option 1 :

1. Nouveau type `header-flex`
2. Structure avec containers drag & drop
3. Accepte éléments enfants (text-link, button, image, etc.)
4. Chaque élément cliquable avec toutes les propriétés
5. Templates inspirés des layouts existants

## 📝 Noms suggérés

- **Header Simple** : "Header (Configuration rapide)"
- **Header Flexible** : "Header (Drag & Drop)"

Cela permet à l'utilisateur de choisir selon ses besoins.
