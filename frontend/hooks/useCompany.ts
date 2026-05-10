import { useState, useEffect } from 'react';

export interface Company {
  id: string;
  name: string;
  slug: string;
  phoneNumber: string | null;
  address: string | null;
  currency: string;
  logo: string | null;
  modules: string[];
}

export function useCompany(slug: string) {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompany();
  }, [slug]);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/companies/slug/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Erreur lors du chargement');

      const data = await res.json();
      setCompany(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  return { company, loading, error, refetch: fetchCompany };
}
