# 🧪 Guide de Test - Drag & Drop

## Test Rapide (5 minutes)

### 1️⃣ Test Nouvelle Inscription
```bash
# Démarrer l'application
cd backend && npm run start:dev
cd frontend && npm run dev
```

1. Aller sur http://localhost:3000/register
2. Créer un nouveau compte (ex: test@test.com)
3. Après inscription, aller sur `/editor/{slug}`
4. **Vérifier** : Une section vide doit être présente automatiquement ✅

---

### 2️⃣ Test Drag & Drop - Cas Valides ✅

#### Test A : Container dans Section
1. Ouvrir l'éditeur
2. Glisser un **Container** depuis le panneau de gauche
3. Le déposer sur la **Section** (fond doit devenir vert clair)
4. **Résultat attendu** : Le container s'ajoute dans la section

#### Test B : Heading dans Container
1. Glisser un **Heading** depuis le panneau
2. Le déposer sur le **Container** créé précédemment
3. **Résultat attendu** : Le heading s'ajoute dans le container

#### Test C : VFlex dans Container
1. Glisser un **VFlex** depuis le panneau
2. Le déposer sur le **Container**
3. **Résultat attendu** : Le vflex s'ajoute dans le container

#### Test D : Paragraph dans VFlex
1. Glisser un **Paragraph** depuis le panneau
2. Le déposer sur le **VFlex**
3. **Résultat attendu** : Le paragraph s'ajoute dans le vflex

---

### 3️⃣ Test Drag & Drop - Cas Invalides ❌

#### Test E : Heading directement dans Section
1. Glisser un **Heading** depuis le panneau
2. Essayer de le déposer directement sur la **Section**
3. **Résultat attendu** : Aucun indicateur vert, drop refusé

#### Test F : Section dans Container
1. Glisser une **Section** depuis le panneau
2. Essayer de la déposer dans un **Container**
3. **Résultat attendu** : Aucun indicateur vert, drop refusé

---

### 4️⃣ Test Indicateurs Visuels

#### Indicateur "Inside" (drop dans l'élément)
- **Quand** : Survol d'un élément compatible
- **Visuel** : Bordure verte + fond vert clair
- **Exemple** : Container survolé avec un Heading en drag

#### Indicateur "Before" (drop avant l'élément)
- **Quand** : Survol de la moitié supérieure d'une section
- **Visuel** : Ligne verte horizontale en haut
- **Exemple** : Déposer une section avant une autre

#### Indicateur "After" (drop après l'élément)
- **Quand** : Survol de la moitié inférieure d'une section
- **Visuel** : Ligne verte horizontale en bas
- **Exemple** : Déposer une section après une autre

---

## 📊 Checklist de Validation

- [ ] Nouvelle inscription crée automatiquement la page d'accueil
- [ ] La page d'accueil contient une section vide
- [ ] Container peut être déposé dans Section
- [ ] Heading peut être déposé dans Container
- [ ] VFlex peut être déposé dans Container
- [ ] Paragraph peut être déposé dans VFlex
- [ ] Heading NE PEUT PAS être déposé directement dans Section
- [ ] Section NE PEUT PAS être déposée dans Container
- [ ] Indicateur vert s'affiche pour les drops valides
- [ ] Aucun indicateur pour les drops invalides
- [ ] Ligne verte s'affiche pour before/after

---

## 🐛 Problèmes Connus

### Si le drag & drop ne fonctionne toujours pas :

1. **Vérifier la console du navigateur**
   ```javascript
   // Ouvrir DevTools (F12)
   // Onglet Console
   // Chercher des erreurs rouges
   ```

2. **Vérifier que les données sont bien définies**
   ```javascript
   // Dans ElementsPanel.tsx, ligne ~90
   onDragStart={(e) => {
     e.dataTransfer.setData('elementType', item.type);
     e.dataTransfer.setData('elementTag', item.tag);
     console.log('Drag started:', item.type, item.tag); // Debug
   }}
   ```

3. **Vérifier que handleDragOver est appelé**
   ```javascript
   // Dans Canvas.tsx, ajouter un console.log
   const handleDragOver = (e: React.DragEvent) => {
     e.preventDefault();
     console.log('Drag over:', element.type); // Debug
     // ...
   }
   ```

---

## 🎯 Résultat Attendu Final

Après tous les tests, vous devriez avoir une structure comme :

```
Section
└── Container
    ├── Heading ("Mon titre")
    ├── VFlex
    │   └── Paragraph ("Mon texte")
    └── Button ("Cliquez ici")
```

---

## 📞 Support

Si un test échoue :
1. Vérifier la console du navigateur (F12)
2. Vérifier les logs du backend
3. Relire le fichier `DRAG_DROP_FIX.md`
4. Vérifier que les modifications ont bien été appliquées dans :
   - `backend/src/auth/auth.service.ts`
   - `frontend/components/editor/Canvas.tsx`

---

**Bonne chance ! 🚀**
