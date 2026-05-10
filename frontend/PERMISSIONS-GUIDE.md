# 🔐 Guide d'utilisation du système de permissions

## Composants créés

### 1. Page 404 (`app/not-found.tsx`)
Page affichée automatiquement pour les routes inexistantes.

### 2. Modal de permission refusée (`components/modals/PermissionDeniedModal.tsx`)
Modal qui s'affiche quand un utilisateur tente une action sans permission.

### 3. Hook usePermission (`hooks/usePermission.ts`)
Hook personnalisé pour gérer facilement les vérifications de permissions.

## Comment utiliser

### Exemple simple dans un composant

```tsx
'use client';

import { Button } from '@/components/ui/button';
import { PermissionDeniedModal } from '@/components/modals/PermissionDeniedModal';
import { usePermission } from '@/hooks/usePermission';

export function MyComponent() {
  const { showPermissionModal, permissionDetails, checkPermission, closeModal } = usePermission();
  
  // Récupérer les permissions de l'utilisateur
  const userPermissions = {
    canDelete: false,  // Exemple: pas de permission
    canEdit: true,     // Exemple: a la permission
  };

  const handleDelete = () => {
    // Vérifier la permission avant l'action
    if (checkPermission(
      userPermissions.canDelete,
      'supprimer cet élément',
      'HR:DELETE_EMPLOYEE'  // Optionnel: nom technique de la permission
    )) {
      // Action autorisée
      deleteItem();
    }
    // Si refusé, la modal s'affiche automatiquement
  };

  return (
    <>
      <Button onClick={handleDelete}>Supprimer</Button>
      
      <PermissionDeniedModal
        open={showPermissionModal}
        onClose={closeModal}
        action={permissionDetails.action}
        requiredPermission={permissionDetails.requiredPermission}
      />
    </>
  );
}
```

### Intégration avec le backend

```tsx
// Récupérer les permissions depuis le backend
const checkUserPermission = (module: string, action: string) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const company = user.companies?.find((c: any) => c.slug === companySlug);
  
  if (!company?.permissions) return false;
  
  const permissions = JSON.parse(company.permissions);
  return permissions[module]?.includes(action) || false;
};

// Utilisation
const canDelete = checkUserPermission('HR', 'DELETE');
if (checkPermission(canDelete, 'supprimer cet employé', 'HR:DELETE')) {
  // Action autorisée
}
```

## Exemples d'utilisation par module

### CRM
```tsx
const canCreateContact = checkUserPermission('CRM', 'CREATE');
const canDeleteOpportunity = checkUserPermission('CRM', 'DELETE');
```

### RH
```tsx
const canCreateEmployee = checkUserPermission('HR', 'CREATE');
const canDeleteEmployee = checkUserPermission('HR', 'DELETE');
```

## Personnalisation de la modal

```tsx
<PermissionDeniedModal
  open={showModal}
  onClose={closeModal}
  action="créer un nouvel employé"
  requiredPermission="HR:CREATE_EMPLOYEE"
/>
```

## Page 404

La page 404 est automatiquement affichée pour toute route inexistante.
Aucune configuration nécessaire !

## Notes importantes

- ✅ Toujours vérifier les permissions AVANT d'exécuter une action
- ✅ Utiliser des messages clairs pour l'utilisateur
- ✅ Indiquer la permission technique requise pour faciliter le support
- ✅ Le bouton "Contacter l'admin" envoie un email à support@sorika.bj
