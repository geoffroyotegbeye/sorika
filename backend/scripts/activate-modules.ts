import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function activateModules() {
  console.log('🔧 Activation des modules ACCOUNTING et INVENTORY...\n');

  try {
    // Récupérer toutes les organisations
    const companies = await prisma.company.findMany({
      select: { id: true, name: true, slug: true, modules: true },
    });

    console.log(`📊 ${companies.length} organisation(s) trouvée(s)\n`);

    for (const company of companies) {
      console.log(`\n🏢 Organisation: ${company.name} (${company.slug})`);
      console.log(`   Modules actuels: ${company.modules.join(', ')}`);

      const currentModules = company.modules as string[];
      const modulesToAdd = ['ACCOUNTING', 'INVENTORY'];
      let updated = false;

      for (const module of modulesToAdd) {
        if (!currentModules.includes(module)) {
          currentModules.push(module);
          updated = true;
          console.log(`   ✅ Module ${module} ajouté`);
        } else {
          console.log(`   ✓ Module ${module} déjà activé`);
        }
      }

      if (updated) {
        await prisma.company.update({
          where: { id: company.id },
          data: { modules: currentModules },
        });
        console.log(`   💾 Modules mis à jour: ${currentModules.join(', ')}`);
      }
    }

    console.log('\n✅ Terminé ! Tous les modules ont été activés.\n');
  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

activateModules();
