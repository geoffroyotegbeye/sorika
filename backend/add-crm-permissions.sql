-- Script pour ajouter les permissions CRM à tous les memberships existants
-- À exécuter dans votre base de données PostgreSQL

-- Mettre à jour tous les memberships pour ajouter les permissions CRM
UPDATE "Membership"
SET permissions = jsonb_set(
  COALESCE(permissions::jsonb, '{}'::jsonb),
  '{CRM}',
  '["READ", "CREATE", "UPDATE", "DELETE"]'::jsonb,
  true
)
WHERE permissions::jsonb -> 'CRM' IS NULL;

-- Vérifier les résultats
SELECT 
  m.id,
  u.email,
  c.name as company_name,
  m.permissions
FROM "Membership" m
JOIN "User" u ON m."userId" = u.id
JOIN "Company" c ON m."companyId" = c.id;
