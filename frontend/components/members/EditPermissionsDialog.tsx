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
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import type { Member, Role, ModuleAction, Permissions } from '@/types/members';

const MODULES = ['LANDING_PAGE', 'HR', 'CRM', 'MEDIA'] as const;
const ACTIONS: ModuleAction[] = ['READ', 'CREATE', 'UPDATE', 'DELETE'];

const MODULE_LABELS: Record<string, string> = {
  LANDING_PAGE: 'Site Vitrine',
  HR: 'Ressources Humaines',
  CRM: 'CRM',
  MEDIA: 'Médiathèque',
};

const ACTION_LABELS: Record<ModuleAction, string> = {
  READ: 'Lire',
  CREATE: 'Créer',
  UPDATE: 'Modifier',
  DELETE: 'Supprimer',
};

interface EditPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member | null;
  onUpdate: (membershipId: string, dto: { role?: Role; permissions?: Permissions }) => Promise<void>;
}

export function EditPermissionsDialog({ open, onOpenChange, member, onUpdate }: EditPermissionsDialogProps) {
  const [role, setRole] = useState<Role>('STAFF');
  const [permissions, setPermissions] = useState<Permissions>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (member) {
      setRole(member.role);
      setPermissions(member.permissions ? { ...member.permissions } : {});
    }
  }, [member]);

  const toggleAction = (module: string, action: ModuleAction) => {
    setPermissions((prev) => {
      const current = prev[module] ?? [];
      const has = current.includes(action);
      return {
        ...prev,
        [module]: has ? current.filter((a) => a !== action) : [...current, action],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;

    setLoading(true);
    try {
      await onUpdate(member.id, { role, permissions });
      toast.success('Permissions mises à jour');
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Modifier les permissions</DialogTitle>
          <DialogDescription>
            Modifiez le rôle et les permissions de{' '}
            <span className="font-medium">
              {member.firstName || member.lastName
                ? `${member.firstName ?? ''} ${member.lastName ?? ''}`.trim()
                : member.email}
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Rôle */}
          <div className="space-y-2">
            <Label htmlFor="edit-role">Rôle</Label>
            <Select value={role} onValueChange={(v) => setRole(v as Role)} disabled={loading}>
              <SelectTrigger id="edit-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="STAFF">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Grille permissions */}
          <div className="space-y-4">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Permissions par module</p>
            {MODULES.map((mod) => (
              <div key={mod} className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {MODULE_LABELS[mod]}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {ACTIONS.map((action) => {
                    const checked = (permissions[mod] ?? []).includes(action);
                    return (
                      <div key={action} className="flex items-center gap-2">
                        <Switch
                          id={`${mod}-${action}`}
                          checked={checked}
                          onCheckedChange={() => toggleAction(mod, action)}
                          disabled={loading}
                        />
                        <Label htmlFor={`${mod}-${action}`} className="text-sm cursor-pointer">
                          {ACTION_LABELS[action]}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

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
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
