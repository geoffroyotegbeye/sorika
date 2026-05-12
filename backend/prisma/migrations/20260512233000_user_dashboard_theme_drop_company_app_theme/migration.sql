-- Préférence thème par utilisateur
ALTER TABLE "User" ADD COLUMN "dashboardTheme" TEXT NOT NULL DEFAULT 'LIGHT';

-- Ancien champ entreprise (remplacé par préférence utilisateur)
ALTER TABLE "Company" DROP COLUMN "appTheme";
