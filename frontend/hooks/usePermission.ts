'use client';

import { useState, useCallback } from 'react';

export function usePermission() {
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionDetails, setPermissionDetails] = useState<{
    action: string;
    requiredPermission?: string;
  }>({
    action: 'cette action',
  });

  const checkPermission = useCallback((
    hasPermission: boolean,
    action: string,
    requiredPermission?: string
  ): boolean => {
    if (!hasPermission) {
      setPermissionDetails({ action, requiredPermission });
      setShowPermissionModal(true);
      return false;
    }
    return true;
  }, []);

  const closeModal = useCallback(() => {
    setShowPermissionModal(false);
  }, []);

  return {
    showPermissionModal,
    permissionDetails,
    checkPermission,
    closeModal,
  };
}
