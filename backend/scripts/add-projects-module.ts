import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addProjectsModule() {
  console.log('🔧 Ajout du module PROJECTS à toutes les entreprises...\n');

  const companies = await prisma.company.findMany({
    select: {
      id: true,
      name: true,
      modules: true,
    },
  });

  let updated = 0;

  for (const company of companies) {
    const modules = company.modules as string[];

    // Ajouter PROJECTS si pas déjà présent
    if (!modules.includes('PROJECTS')) {
      const updatedModules = [...modules, 'PROJECTS'];

      await prisma.company.update({
        where: { id: company.id },
        data: { modules: updatedModules },
      });

      console.log(`✅ ${company.name} → PROJECTS ajouté`);
      updated++;
    } else {
      console.log(`⏭️  ${company.name} → PROJECTS déjà présent`);
    }
  }

  console.log(`\n✨ ${updated} entreprise(s) mise(s) à jour !`);
  console.log(`📊 Total entreprises: ${companies.length}`);

  await prisma.$disconnect();
}

// Exécution
addProjectsModule()
  .then(() => {
    console.log('\n✅ Script terminé avec succès !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erreur:', error);
    process.exit(1);
  });
