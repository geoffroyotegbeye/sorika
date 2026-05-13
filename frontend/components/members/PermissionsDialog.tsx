'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { Member, PredefinedRole, UpdatePermissionsDto } from '@/types/members';
import { Shield, Check } from 'lucide-react';

interface PermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member | null;
  roles: PredefinedRole[];
  onUpdate: (membershipId: string, dto: UpdatePermissionsDto) => Promise<void>;
}

export function PermissionsDialog({
  open,
  onOpenChange,
  member,
  roles,
  onUpdate,
}: PermissionsDialogProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (member && roles.length > 0) {
      // Essayer de détecter le rôle actuel
      const currentRole = roles.find((role) =>
        JSON.stringify(role.permissions) === JSON.stringify(member.permissions)
      );
      setSelectedRoleId(currentRole?.id ?? 'CUSTOM');
    }
  }, [member, roles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!member || !selectedRoleId) {
      toast.error('Veuillez sélectionner un rôle');
      return;
    }

    setLoading(true);
    try {
      const dto: UpdatePermissionsDto = {
        roleType: selectedRoleId as any,
      };

      await onUpdate(member.id, dto);
      toast.success('Permissions mises à jour');
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = roles.find((r) => r.id === selectedRoleId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gérer les permissions</DialogTitle>
          <DialogDescription>
            {member && `Modifier les permissions de ${member.firstName} ${member.lastName}`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Sélection du rôle */}
          <div className="space-y-2">
            <Label htmlFor="role">Rôle prédéfini</Label>
            <Select value={selectedRoleId} onValueChange={setSelectedRoleId} disabled={loading}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span className="font-medium">{role.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedRole && (
              <p className="text-sm text-slate-500 dark:text-slate-400">{selectedRole.description}</p>
            )}
          </div>

          {/* Aperçu des permissions */}
          {selectedRole && (
            <div className="space-y-3 border rounded-lg p-4 bg-slate-50 dark:bg-slate-900/50">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                Permissions incluses
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(selectedRole.permissions).map(([module, actions]) => (
                  <div key={module} className="space-y-1">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400">{module}</p>
                    <div className="flex flex-wrap gap-1">
                      {(actions as string[]).map((action) => (
                        <Badge key={action} variant="secondary" className="text-xs">
                          {action}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" className="flex-1" disabled={loading || !selectedRoleId}>
              {loading ? 'Enregistrement...' : 'Mettre à jour'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
