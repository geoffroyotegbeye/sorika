/**
 * Définition des rôles prédéfinis avec leurs permissions
 */

export const MODULES = {
  LANDING_PAGE: 'LANDING_PAGE',
  MEDIA: 'MEDIA',
  CRM: 'CRM',
  HR: 'HR',
  ECOMMERCE: 'ECOMMERCE',
  ANALYTICS: 'ANALYTICS',
  MESSAGING: 'MESSAGING',
  BLOG: 'BLOG',
} as const;

export const ACTIONS = {
  READ: 'READ',
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  MANAGE: 'MANAGE', // Toutes les actions
} as const;

export type ModuleName = keyof typeof MODULES;
export type ActionName = keyof typeof ACTIONS;

export type PermissionsMap = Record<string, string[]>;

/**
 * Rôle AdminAccess : Toutes les permissions sur tous les modules
 */
export const ADMIN_ACCESS_PERMISSIONS: PermissionsMap = {
  LANDING_PAGE: ['READ', 'CREATE', 'UPDATE', 'DELETE', 'MANAGE'],
  MEDIA: ['READ', 'CREATE', 'UPDATE', 'DELETE', 'MANAGE'],
  CRM: ['READ', 'CREATE', 'UPDATE', 'DELETE', 'MANAGE'],
  HR: ['READ', 'CREATE', 'UPDATE', 'DELETE', 'MANAGE'],
  ECOMMERCE: ['READ', 'CREATE', 'UPDATE', 'DELETE', 'MANAGE'],
  ANALYTICS: ['READ', 'CREATE', 'UPDATE', 'DELETE', 'MANAGE'],
  MESSAGING: ['READ', 'CREATE', 'UPDATE', 'DELETE', 'MANAGE'],
  BLOG: ['READ', 'CREATE', 'UPDATE', 'DELETE', 'MANAGE'],
};

/**
 * Rôle ReadOnly : Lecture seule sur tous les modules
 */
export const READ_ONLY_PERMISSIONS: PermissionsMap = {
  LANDING_PAGE: ['READ'],
  MEDIA: ['READ'],
  CRM: ['READ'],
  HR: ['READ'],
  ECOMMERCE: ['READ'],
  ANALYTICS: ['READ'],
  MESSAGING: ['READ'],
  BLOG: ['READ'],
};

/**
 * Rôle Editor : Lecture et modification (sans suppression)
 */
export const EDITOR_PERMISSIONS: PermissionsMap = {
  LANDING_PAGE: ['READ', 'CREATE', 'UPDATE'],
  MEDIA: ['READ', 'CREATE', 'UPDATE'],
  CRM: ['READ', 'CREATE', 'UPDATE'],
  HR: ['READ', 'CREATE', 'UPDATE'],
  ECOMMERCE: ['READ', 'CREATE', 'UPDATE'],
  ANALYTICS: ['READ'],
  MESSAGING: ['READ', 'CREATE', 'UPDATE'],
  BLOG: ['READ', 'CREATE', 'UPDATE'],
};

/**
 * Définition des rôles disponibles
 */
export const PREDEFINED_ROLES = {
  ADMIN_ACCESS: {
    name: 'AdminAccess',
    description: 'Accès administrateur complet avec toutes les permissions',
    permissions: ADMIN_ACCESS_PERMISSIONS,
  },
  EDITOR: {
    name: 'Editor',
    description: 'Peut créer et modifier du contenu (sans suppression)',
    permissions: EDITOR_PERMISSIONS,
  },
  READ_ONLY: {
    name: 'ReadOnly',
    description: 'Lecture seule sur tous les modules',
    permissions: READ_ONLY_PERMISSIONS,
  },
} as const;

export type PredefinedRoleName = keyof typeof PREDEFINED_ROLES;

/**
 * Obtenir les permissions d'un rôle prédéfini
 */
export function getRolePermissions(roleName: PredefinedRoleName): PermissionsMap {
  return PREDEFINED_ROLES[roleName].permissions;
}

/**
 * Vérifier si un utilisateur a une permission spécifique
 */
export function hasPermission(
  permissions: PermissionsMap,
  module: string,
  action: string,
): boolean {
  return permissions[module]?.includes(action) ?? false;
}

/**
 * Fusionner plusieurs ensembles de permissions
 */
export function mergePermissions(...permissionSets: PermissionsMap[]): PermissionsMap {
  const merged: PermissionsMap = {};

  for (const permissions of permissionSets) {
    for (const [module, actions] of Object.entries(permissions)) {
      if (!merged[module]) {
        merged[module] = [];
      }
      // Ajouter les actions uniques
      for (const action of actions) {
        if (!merged[module].includes(action)) {
          merged[module].push(action);
        }
      }
    }
  }

  return merged;
}
