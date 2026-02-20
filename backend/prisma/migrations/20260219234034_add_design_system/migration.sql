/*
  Warnings:

  - You are about to drop the column `heroSubtitle` on the `LandingPage` table. All the data in the column will be lost.
  - You are about to drop the column `heroTitle` on the `LandingPage` table. All the data in the column will be lost.
  - You are about to drop the column `primaryColor` on the `LandingPage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LandingPage" DROP COLUMN "heroSubtitle",
DROP COLUMN "heroTitle",
DROP COLUMN "primaryColor",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "customCSS" TEXT,
ADD COLUMN     "customJS" TEXT,
ADD COLUMN     "favicon" TEXT,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "seo" JSONB DEFAULT '{"title":"","description":"","keywords":[],"ogImage":""}',
ADD COLUMN     "theme" JSONB DEFAULT '{"colors":{"primary":"#3b82f6","secondary":"#8b5cf6","accent":"#f59e0b","background":"#ffffff","text":"#1e293b","muted":"#64748b"},"fonts":{"heading":"Inter","body":"Inter"},"spacing":"comfortable","borderRadius":"medium","animations":true}',
ALTER COLUMN "templateName" SET DEFAULT 'modern',
ALTER COLUMN "sections" SET DEFAULT '{"hero":{"enabled":true,"type":"hero","content":{"title":"Bienvenue","subtitle":"Découvrez nos services","buttonText":"Commencer","buttonLink":"#contact","backgroundType":"gradient","backgroundValue":"from-blue-600 to-purple-600","imageUrl":"","layout":"center"}},"features":{"enabled":true,"type":"features","content":{"title":"Nos fonctionnalités","subtitle":"Ce qui nous rend uniques","layout":"grid","columns":3,"items":[{"icon":"🚀","title":"Rapide","description":"Performance optimale"},{"icon":"💎","title":"Qualité","description":"Service premium"},{"icon":"🎯","title":"Précis","description":"Résultats garantis"}]}}}';
