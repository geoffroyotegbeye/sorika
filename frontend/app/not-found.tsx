import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Illustration 404 */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-slate-200">404</h1>
          <div className="relative -mt-16">
            <div className="inline-block p-6 bg-white rounded-2xl shadow-lg">
              <div className="text-6xl">🔍</div>
            </div>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          Page introuvable
        </h2>
        <p className="text-slate-600 mb-8">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </Link>
          <Link href="/">
            <Button className="w-full sm:w-auto gap-2">
              <Home className="h-4 w-4" />
              Accueil
            </Button>
          </Link>
        </div>

        {/* Liens utiles */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500 mb-4">Liens utiles :</p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              Accueil
            </Link>
            <Link href="/login" className="text-blue-600 hover:text-blue-700">
              Connexion
            </Link>
            <a href="mailto:support@sorika.bj" className="text-blue-600 hover:text-blue-700">
              Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
