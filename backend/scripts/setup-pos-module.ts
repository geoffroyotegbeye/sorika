import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setupPOSModule() {
  console.log('🚀 Configuration complète du module POS (Point de Vente)...\n');

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

      // 1. Activer le module POS
      console.log('\n📦 Activation du module POS...');
      const currentModules = company.modules as string[];
      let modulesUpdated = false;

      if (!currentModules.includes('POS')) {
        currentModules.push('POS');
        modulesUpdated = true;
        console.log(`   ✅ Module POS ajouté`);
      } else {
        console.log(`   ✓ Module POS déjà activé`);
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

        // Permissions POS
        if (!currentPermissions.POS) {
          currentPermissions.POS = ['READ', 'CREATE', 'UPDATE', 'DELETE'];
          permissionsUpdated = true;
          console.log(`   ✅ ${membership.user.email} - Permissions POS ajoutées`);
        } else {
          console.log(`   ✓ ${membership.user.email} - Permissions POS déjà présentes`);
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
    console.log(`   • Module activé: POS (Point de Vente)`);
    console.log(`   • Permissions ajoutées pour tous les membres`);
    console.log(`   • ${companies.length} organisation(s) configurée(s)`);
    console.log('\n🎉 Le module Point de Vente est prêt à être utilisé !\n');
    console.log('📍 Accès: /dashboard/[slug]/pos\n');
  } catch (error) {
    console.error('\n❌ Erreur:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

setupPOSModule();
