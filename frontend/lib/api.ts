const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const userData = localStorage.getItem('user');
    if (!userData) return {};
    const parsed = JSON.parse(userData);
    const userId = parsed.user?.id;
    // Extraire le slug depuis l'URL : /dashboard/[slug]/...
    const pathParts = window.location.pathname.split('/');
    const dashboardIndex = pathParts.indexOf('dashboard');
    const slug = dashboardIndex !== -1 ? pathParts[dashboardIndex + 1] : null;
    const company = slug ? parsed.companies?.find((c: any) => c.slug === slug) : null;
    const companyId = company?.id;
    const headers: Record<string, string> = {};
    if (userId) headers['x-user-id'] = userId;
    if (companyId) headers['x-company-id'] = companyId;
    return headers;
  } catch {
    return {};
  }
}

async function apiClient<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Erreur réseau' }));
    throw new Error(err.message || `Erreur ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  
  // Vérifier si la réponse a du contenu
  const text = await res.text();
  if (!text || text.trim() === '') {
    return null as T;
  }
  
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('Failed to parse JSON:', text);
    throw new Error('Invalid JSON response');
  }
}

export const api = {
  get: <T>(path: string) => apiClient<T>(path),
  post: <T>(path: string, body: unknown) => apiClient<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) => apiClient<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) => apiClient<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  del: (path: string) => apiClient<void>(path, { method: 'DELETE' }),
};
