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
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Eye, EyeOff, RefreshCw, Copy } from 'lucide-react';
import type { CreateMemberDto, CreateMemberResponse, Role } from '@/types/members';

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (dto: CreateMemberDto) => Promise<CreateMemberResponse>;
}

function generatePassword(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function AddMemberDialog({ open, onOpenChange, onCreate }: AddMemberDialogProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordMode, setPasswordMode] = useState<'manual' | 'auto'>('auto');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Role>('STAFF');
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

    if (!email.trim() || !firstName.trim() || !lastName.trim()) {
      toast.error('Email, prénom et nom sont requis');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error('Email invalide');
      return;
    }
    if (passwordMode === 'manual' && password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setLoading(true);
    try {
      const dto: CreateMemberDto = {
        email: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim() || undefined,
        password: passwordMode === 'manual' ? password : undefined,
        role,
        mustChangePassword,
      };
      const result = await onCreate(dto);
      
      if (result.generatedPassword) {
        setGeneratedPassword(result.generatedPassword);
        toast.success('Membre créé avec succès. Notez le mot de passe généré ci-dessous.', { duration: 5000 });
      } else {
        toast.success('Membre créé avec succès');
        resetForm();
        onOpenChange(false);
      }
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setFirstName('');
    setLastName('');
    setUsername('');
    setPassword('');
    setPasswordMode('auto');
    setShowPassword(false);
    setRole('STAFF');
    setMustChangePassword(true);
    setGeneratedPassword(null);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un membre</DialogTitle>
          <DialogDescription>
            Créez un compte pour un nouveau membre de votre organisation.
          </DialogDescription>
        </DialogHeader>

        {generatedPassword ? (
          <div className="space-y-4 mt-2">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
              <p className="text-sm font-medium text-green-900">Membre créé avec succès !</p>
              <div className="space-y-2">
                <Label className="text-green-800">Mot de passe généré</Label>
                <div className="flex gap-2">
                  <Input
                    value={generatedPassword}
                    readOnly
                    className="font-mono bg-white"
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
                <p className="text-xs text-green-700">
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom *</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom *</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="collaborateur@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Nom d'utilisateur (optionnel)</Label>
              <Input
                id="username"
                placeholder="john_doe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rôle *</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)} disabled={loading}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="STAFF">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 border-t pt-4">
              <Label>Mot de passe</Label>
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
                <div className="space-y-2">
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
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <Label htmlFor="mustChange" className="text-sm font-normal cursor-pointer">
                Forcer le changement à la première connexion
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
                {loading ? 'Création...' : 'Créer le membre'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
