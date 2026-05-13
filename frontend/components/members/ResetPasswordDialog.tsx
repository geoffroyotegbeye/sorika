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
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Eye, EyeOff, RefreshCw, Copy } from 'lucide-react';
import type { ResetPasswordDto, ResetPasswordResponse, Member } from '@/types/members';

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member | null;
  onReset: (membershipId: string, dto: ResetPasswordDto) => Promise<ResetPasswordResponse>;
}

function generatePassword(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function ResetPasswordDialog({ open, onOpenChange, member, onReset }: ResetPasswordDialogProps) {
  const [password, setPassword] = useState('');
  const [passwordMode, setPasswordMode] = useState<'manual' | 'auto'>('auto');
  const [showPassword, setShowPassword] = useState(false);
  const [mustChangePassword, setMustChangePassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);

  const handleGenerate = () => {
    const newPassword = generatePassword();
    setPassword(newPassword);
    setShowPassword(true);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié dans le presse-papier');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!member) return;

    if (passwordMode === 'manual' && password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setLoading(true);
    try {
      const dto: ResetPasswordDto = {
        newPassword: passwordMode === 'manual' ? password : undefined,
        mustChangePassword,
      };
      const result = await onReset(member.id, dto);

      if (result.generatedPassword) {
        setGeneratedPassword(result.generatedPassword);
        toast.success('Mot de passe réinitialisé. Notez le nouveau mot de passe ci-dessous.', { duration: 5000 });
      } else {
        toast.success('Mot de passe réinitialisé avec succès');
        resetForm();
        onOpenChange(false);
      }
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPassword('');
    setPasswordMode('auto');
    setShowPassword(false);
    setMustChangePassword(true);
    setGeneratedPassword(null);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  if (!member) return null;

  const displayName =
    member.firstName || member.lastName
      ? `${member.firstName ?? ''} ${member.lastName ?? ''}`.trim()
      : member.email;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Réinitialiser le mot de passe</DialogTitle>
          <DialogDescription>
            Réinitialisez le mot de passe de <strong>{displayName}</strong>
          </DialogDescription>
        </DialogHeader>

        {generatedPassword ? (
          <div className="space-y-4 mt-2">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50 rounded-lg p-4 space-y-3">
              <p className="text-sm font-medium text-green-900 dark:text-green-400">Mot de passe réinitialisé !</p>
              <div className="space-y-2">
                <Label className="text-green-800 dark:text-green-500">Nouveau mot de passe</Label>
                <div className="flex gap-2">
                  <Input
                    value={generatedPassword}
                    readOnly
                    className="font-mono bg-white dark:bg-slate-900"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopy(generatedPassword)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-green-700 dark:text-green-600">
                  ⚠️ Notez ce mot de passe maintenant. Il ne sera plus affiché.
                </p>
              </div>
            </div>
            <Button onClick={handleClose} className="w-full">
              Fermer
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-3">
              <Label>Nouveau mot de passe</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={passwordMode === 'auto' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPasswordMode('auto')}
                  disabled={loading}
                  className="flex-1"
                >
                  Générer automatiquement
                </Button>
                <Button
                  type="button"
                  variant={passwordMode === 'manual' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPasswordMode('manual')}
                  disabled={loading}
                  className="flex-1"
                >
                  Saisir manuellement
                </Button>
              </div>

              {passwordMode === 'manual' && (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Minimum 8 caractères"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleGenerate}
                    disabled={loading}
                    title="Générer un mot de passe"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <Label htmlFor="mustChange" className="text-sm font-normal cursor-pointer">
                Forcer le changement à la prochaine connexion
              </Label>
              <Switch
                id="mustChange"
                checked={mustChangePassword}
                onCheckedChange={setMustChangePassword}
                disabled={loading}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleClose}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? 'Réinitialisation...' : 'Réinitialiser'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
