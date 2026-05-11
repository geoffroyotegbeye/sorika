import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setupInventoryModule() {
  console.log('🚀 Configuration complète du module INVENTORY...\n');

  try {
    // Récupérer toutes les organisations
    const companies = await prisma.company.findMany({
      include: {
        members: {
          include: {
            user: { select: { email: true, firstName: true, lastName: true } },
          },
        },
      },
    });

    console.log(`📊 ${companies.length} organisation(s) trouvée(s)\n`);

    for (const company of companies) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`🏢 Organisation: ${company.name} (${company.slug})`);
      console.log(`${'='.repeat(60)}`);

      // 1. Activer les modules ACCOUNTING et INVENTORY
      console.log('\n📦 Activation des modules...');
      const currentModules = company.modules as string[];
      const modulesToAdd = ['ACCOUNTING', 'INVENTORY'];
      let modulesUpdated = false;

      for (const module of modulesToAdd) {
        if (!currentModules.includes(module)) {
          currentModules.push(module);
          modulesUpdated = true;
          console.log(`   ✅ Module ${module} ajouté`);
        } else {
          console.log(`   ✓ Module ${module} déjà activé`);
        }
      }

      if (modulesUpdated) {
        await prisma.company.update({
          where: { id: company.id },
          data: { modules: currentModules },
        });
      }

      // 2. Ajouter les permissions aux membres
      console.log('\n🔐 Configuration des permissions...');
      console.log(`   👥 ${company.members.length} membre(s) trouvé(s)`);

      for (const membership of company.members) {
        const currentPermissions = membership.permissions as any;
        let permissionsUpdated = false;

        // Permissions ACCOUNTING
        if (!currentPermissions.ACCOUNTING) {
          currentPermissions.ACCOUNTING = ['READ', 'CREATE', 'UPDATE', 'DELETE'];
          permissionsUpdated = true;
          console.log(`   ✅ ${membership.user.email} - Permissions ACCOUNTING ajoutées`);
        } else {
          console.log(`   ✓ ${membership.user.email} - Permissions ACCOUNTING déjà présentes`);
        }

        // Permissions INVENTORY
        if (!currentPermissions.INVENTORY) {
          currentPermissions.INVENTORY = ['READ', 'CREATE', 'UPDATE', 'DELETE'];
          permissionsUpdated = true;
          console.log(`   ✅ ${membership.user.email} - Permissions INVENTORY ajoutées`);
        } else {
          console.log(`   ✓ ${membership.user.email} - Permissions INVENTORY déjà présentes`);
        }

        if (permissionsUpdated) {
          await prisma.membership.update({
            where: { id: membership.id },
            data: { permissions: currentPermissions },
          });
        }
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Configuration terminée avec succès !');
    console.log('='.repeat(60));
    console.log('\n📝 Résumé:');
    console.log(`   • Modules activés: ACCOUNTING, INVENTORY`);
    console.log(`   • Permissions ajoutées pour tous les membres`);
    console.log(`   • ${companies.length} organisation(s) configurée(s)`);
    console.log('\n🎉 Le module Inventaire est prêt à être utilisé !\n');
  } catch (error) {
    console.error('\n❌ Erreur:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

setupInventoryModule();
