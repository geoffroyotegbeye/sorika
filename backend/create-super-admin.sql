-- Script SQL pour créer/promouvoir un Super Admin
-- Exécutez ce script dans votre base de données PostgreSQL

-- Option 1: Promouvoir un utilisateur existant par email
UPDATE "User" 
SET "isSuperAdmin" = true 
WHERE email = 'votre-email@example.com';

-- Option 2: Créer un nouveau Super Admin directement
-- (Remplacez le mot de passe hashé par un vrai hash bcrypt)
INSERT INTO "User" (id, email, password, "firstName", "lastName", "isSuperAdmin", "createdAt")
VALUES (
  gen_random_uuid(),
  'admin@sorika.bj',
  '$2b$10$YourHashedPasswordHere',
  'Super',
  'Admin',
  true,
  NOW()
);
