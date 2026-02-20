'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle2, Loader2, ArrowLeft, Eye, EyeOff, User, Building2 } from 'lucide-react';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredCompany, setRegisteredCompany] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      modules: ['LANDING_PAGE'],
    },
  });

  const companyName = watch('companyName');
  const companySlug = watch('companySlug');

  const generateSlug = (name: string) => {
    const baseSlug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Ajouter un identifiant court unique (5 caractères)
    const uniqueId = Math.random().toString(36).substring(2, 7);
    return `${baseSlug}-${uniqueId}`;
  };

  const handleCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    // Toujours générer le slug automatiquement
    setValue('companySlug', generateSlug(name));
  };

  const handleNextTab = async () => {
    const isValid = await trigger(['email', 'password', 'confirmPassword', 'firstName', 'lastName']);
    if (isValid) {
      setActiveTab('company');
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      const { confirmPassword, ...submitData } = data;
      
      const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'inscription');
      }

      const result = await response.json();
      setRegisteredCompany(result);
      setShowSuccessModal(true);
      toast.success('Compte créé avec succès!');
    } catch (err: any) {
      toast.error(err.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    if (registeredCompany) {
      window.location.href = `/dashboard/${registeredCompany.company.slug}`;
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-12">
        <a 
          href="/" 
          className="fixed top-6 left-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Retour à l'accueil</span>
        </a>

        <Card className="w-full max-w-2xl shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">S</span>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">
              Bienvenue sur Sorika
            </CardTitle>
            <CardDescription className="text-base">
              Créez votre compte en 2 étapes simples
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="personal" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Informations personnelles
                  </TabsTrigger>
                  <TabsTrigger value="company" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Votre entreprise
                  </TabsTrigger>
                </TabsList>

                {/* Onglet 1: Informations personnelles */}
                <TabsContent value="personal" className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="vous@exemple.com"
                      {...register('email')}
                      disabled={isLoading}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...register('password')}
                        disabled={isLoading}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...register('confirmPassword')}
                        disabled={isLoading}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        placeholder="Jean"
                        {...register('firstName')}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        placeholder="Dupont"
                        {...register('lastName')}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <Button 
                    type="button" 
                    onClick={handleNextTab} 
                    className="w-full" 
                    size="lg"
                    disabled={isLoading}
                  >
                    Suivant
                  </Button>
                </TabsContent>

                {/* Onglet 2: Informations entreprise */}
                <TabsContent value="company" className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nom de l'entreprise *</Label>
                    <Input
                      id="companyName"
                      placeholder="Mon Restaurant"
                      {...register('companyName', {
                        onChange: handleCompanyNameChange,
                      })}
                      disabled={isLoading}
                    />
                    {errors.companyName && (
                      <p className="text-sm text-destructive">{errors.companyName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companySlug">
                      URL de votre site *
                      <span className="ml-2 text-xs text-muted-foreground font-normal">
                        sorika.bj/<span className="font-mono font-semibold text-foreground">
                          {companySlug || 'votre-url'}
                        </span>
                      </span>
                    </Label>
                    <Input
                      id="companySlug"
                      placeholder="mon-restaurant"
                      {...register('companySlug')}
                      disabled={isLoading}
                    />
                    {errors.companySlug && (
                      <p className="text-sm text-destructive">{errors.companySlug.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">
                      Téléphone WhatsApp <span className="text-muted-foreground">(optionnel)</span>
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="+229 XX XX XX XX"
                      {...register('phoneNumber')}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setActiveTab('personal')} 
                      className="flex-1" 
                      size="lg"
                      disabled={isLoading}
                    >
                      Retour
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1" 
                      size="lg" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Création...
                        </>
                      ) : (
                        'Créer mon compte'
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Vous avez déjà un compte?{' '}
                <a href="/login" className="text-primary hover:underline font-medium">
                  Se connecter
                </a>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Modal de succès */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-center text-2xl">Compte créé avec succès!</DialogTitle>
            <DialogDescription className="text-center">
              Votre entreprise <span className="font-semibold">{registeredCompany?.company.name}</span> est prête.
              <br />
              Votre site est accessible sur:{' '}
              <span className="font-mono text-sm font-semibold text-foreground">
                sorika.bj/{registeredCompany?.company.slug}
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 mt-4">
            <Button onClick={handleGoToDashboard} size="lg" className="w-full">
              Accéder au tableau de bord
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowSuccessModal(false)}
              className="w-full"
            >
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
