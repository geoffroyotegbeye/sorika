'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditorIndexPage() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers la première company (à adapter selon votre logique)
    // Pour l'instant, on suppose qu'il y a une company par défaut
    router.push('/editor/default');
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center">
      <p>Redirection...</p>
    </div>
  );
}
