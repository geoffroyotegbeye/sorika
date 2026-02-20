/*
  Warnings:

  - You are about to drop the column `isActive` on the `LandingPage` table. All the data in the column will be lost.
  - You are about to drop the column `sections` on the `LandingPage` table. All the data in the column will be lost.
  - You are about to drop the column `templateName` on the `LandingPage` table. All the data in the column will be lost.
  - You are about to drop the column `theme` on the `LandingPage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LandingPage" DROP COLUMN "isActive",
DROP COLUMN "sections",
DROP COLUMN "templateName",
DROP COLUMN "theme",
ADD COLUMN     "elements" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "globalStyles" JSONB DEFAULT '{"fonts":{"primary":"Inter","secondary":"Inter"},"colors":{"primary":"#3b82f6","secondary":"#8b5cf6","accent":"#f59e0b","background":"#ffffff","text":"#1e293b"},"breakpoints":{"mobile":640,"tablet":768,"desktop":1024}}',
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false;
