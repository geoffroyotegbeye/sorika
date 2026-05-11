import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addInventoryPermissions() {
  console.log('🔧 Ajout des permissions INVENTORY à toutes les organisations...\n');

  try {
    // Récupérer toutes les organisations
    const companies = await prisma.company.findMany({
      select: { id: true, name: true, slug: true },
    });

    console.log(`📊 ${companies.length} organisation(s) trouvée(s)\n`);

    for (const company of companies) {
      console.log(`\n🏢 Organisation: ${company.name} (${company.slug})`);

      // Récupérer tous les membres de l'organisation
      const memberships = await prisma.membership.findMany({
        where: { companyId: company.id },
        include: { user: { select: { email: true, firstName: true, lastName: true } } },
      });

      console.log(`   👥 ${memberships.length} membre(s) trouvé(s)`);

      for (const membership of memberships) {
        const currentPermissions = membership.permissions as any;

        // Vérifier si INVENTORY existe déjà
        if (currentPermissions.INVENTORY) {
          console.log(
            `   ✓ ${membership.user.email} - Permissions INVENTORY déjà présentes`
          );
          continue;
        }

        // Ajouter les permissions INVENTORY
        const updatedPermissions = {
          ...currentPermissions,
          INVENTORY: ['READ', 'CREATE', 'UPDATE', 'DELETE'],
        };

        await prisma.membership.update({
          where: { id: membership.id },
          data: { permissions: updatedPermissions },
        });

        console.log(
          `   ✅ ${membership.user.email} - Permissions INVENTORY ajoutées`
        );
      }
    }

    console.log('\n✅ Terminé ! Toutes les permissions INVENTORY ont été ajoutées.\n');
  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

addInventoryPermissions();
