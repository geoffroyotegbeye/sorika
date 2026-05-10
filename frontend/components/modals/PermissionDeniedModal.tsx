'use client';

import { Shield, Lock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface PermissionDeniedModalProps {
  open: boolean;
  onClose: () => void;
  action?: string;
  requiredPermission?: string;
}

export function PermissionDeniedModal({
  open,
  onClose,
  action = 'cette action',
  requiredPermission,
}: PermissionDeniedModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
            <Lock className="h-8 w-8 text-red-600" />
          </div>
          <DialogTitle className="text-center text-xl">
            Permission refusée
          </DialogTitle>
          <DialogDescription className="text-center">
            Vous n'avez pas les permissions nécessaires pour {action}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Détails */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-slate-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">
                  Accès restreint
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  Cette fonctionnalité nécessite des permissions spéciales qui n'ont pas été attribuées à votre compte.
                </p>
              </div>
            </div>

            {requiredPermission && (
              <div className="pt-3 border-t border-slate-200">
                <p className="text-xs text-slate-500">Permission requise :</p>
                <p className="text-sm font-mono text-slate-700 mt-1">
                  {requiredPermission}
                </p>
              </div>
            )}
          </div>

          {/* Message d'aide */}
          <div className="text-sm text-slate-600 text-center">
            Contactez votre administrateur pour obtenir les permissions nécessaires.
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Fermer
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                window.location.href = 'mailto:support@sorika.bj?subject=Demande de permissions';
              }}
            >
              Contacter l'admin
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
