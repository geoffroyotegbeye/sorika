/*
  Warnings:

  - You are about to drop the column `elements` on the `LandingPage` table. All the data in the column will be lost.
  - You are about to drop the column `globalStyles` on the `LandingPage` table. All the data in the column will be lost.
  - You are about to drop the column `isPublished` on the `LandingPage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LandingPage" DROP COLUMN "elements",
DROP COLUMN "globalStyles",
DROP COLUMN "isPublished",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sections" JSONB DEFAULT '{"hero":{"enabled":true,"type":"hero","content":{"title":"Bienvenue","subtitle":"Découvrez nos services","buttonText":"Commencer","buttonLink":"#contact","backgroundType":"gradient","backgroundValue":"from-blue-600 to-purple-600","imageUrl":"","layout":"center"}},"features":{"enabled":true,"type":"features","content":{"title":"Nos fonctionnalités","subtitle":"Ce qui nous rend uniques","layout":"grid","columns":3,"items":[{"icon":"🚀","title":"Rapide","description":"Performance optimale"},{"icon":"💎","title":"Qualité","description":"Service premium"},{"icon":"🎯","title":"Précis","description":"Résultats garantis"}]}}}',
ADD COLUMN     "templateName" TEXT NOT NULL DEFAULT 'modern',
ADD COLUMN     "theme" JSONB DEFAULT '{"colors":{"primary":"#3b82f6","secondary":"#8b5cf6","accent":"#f59e0b","background":"#ffffff","text":"#1e293b","muted":"#64748b"},"fonts":{"heading":"Inter","body":"Inter"},"spacing":"comfortable","borderRadius":"medium","animations":true}';
