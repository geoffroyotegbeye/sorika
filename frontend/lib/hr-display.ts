/** Libellé affichable pour le poste (relation Prisma ou chaîne legacy). */
export function formatJobPositionLabel(
  position: string | { title?: string | null } | null | undefined,
): string | null {
  if (position == null) return null;
  if (typeof position === 'string') return position.trim() || null;
  if (typeof position === 'object' && position.title) return String(position.title);
  return null;
}
