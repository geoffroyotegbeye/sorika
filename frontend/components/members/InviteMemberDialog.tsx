'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import type { Role } from '@/types/members';

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (dto: { email: string; role: Role }) => Promise<void>;
}

export function InviteMemberDialog({ open, onOpenChange, onInvite }: InviteMemberDialogProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('STAFF');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('L\'email est requis');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error('Email invalide');
      return;
    }
    if (!role) {
      toast.error('Le rôle est requis');
      return;
    }

    setLoading(true);
    try {
      await onInvite({ email: email.trim(), role });
      toast.success('Invitation envoyée avec succès');
      setEmail('');
      setRole('STAFF');
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'envoi de l\'invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Inviter un membre</DialogTitle>
          <DialogDescription>
            Envoyez une invitation par email pour rejoindre votre organisation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email *</Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="collaborateur@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="invite-role">Rôle *</Label>
            <Select value={role} onValueChange={(v) => setRole(v as Role)} disabled={loading}>
              <SelectTrigger id="invite-role">
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="STAFF">Staff</SelectItem>
              </SelectContent>
            </Select>
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
              {loading ? 'Envoi...' : 'Inviter'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
