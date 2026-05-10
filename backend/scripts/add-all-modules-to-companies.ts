/**
 * Script pour ajouter tous les modules aux organisations existantes
 * Usage: npx ts-node scripts/add-all-modules-to-companies.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ALL_MODULES = [
  'LANDING_PAGE',
  'MEDIA',
  'CRM',
  'HR',
  'ECOMMERCE',
  'ANALYTICS',
  'MESSAGING',
  'BLOG',
];

async function addAllModulesToCompanies() {
  console.log('🔄 Mise à jour des modules pour toutes les organisations...\n');

  const companies = await prisma.company.findMany({
    select: { id: true, name: true, slug: true, modules: true },
  });

  console.log(`📊 ${companies.length} organisation(s) trouvée(s)\n`);

  for (const company of companies) {
    const currentModules = company.modules || [];
    const missingModules = ALL_MODULES.filter((m) => !currentModules.includes(m));

    if (missingModules.length === 0) {
      console.log(`✅ ${company.name} (${company.slug}) - Tous les modules déjà activés`);
      continue;
    }

    const updatedModules = [...new Set([...currentModules, ...ALL_MODULES])];

    await prisma.company.update({
      where: { id: company.id },
      data: { modules: updatedModules },
    });

    console.log(`✅ ${company.name} (${company.slug}) - ${missingModules.length} module(s) ajouté(s): ${missingModules.join(', ')}`);
  }

  console.log('\n✅ Mise à jour terminée !');
  await prisma.$disconnect();
}

addAllModulesToCompanies().catch((error) => {
  console.error('❌ Erreur:', error);
  process.exit(1);
});
