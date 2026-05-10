import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addCRMPermissions() {
  console.log('🔧 Ajout des permissions CRM à tous les memberships...\n');

  try {
    // Récupérer tous les memberships
    const memberships = await prisma.membership.findMany({
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        company: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    console.log(`📊 ${memberships.length} membership(s) trouvé(s)\n`);

    let updated = 0;

    for (const membership of memberships) {
      const permissions = membership.permissions as Record<string, string[]>;

      // Vérifier si les permissions CRM existent déjà
      if (!permissions.CRM) {
        // Ajouter les permissions CRM
        permissions.CRM = ['READ', 'CREATE', 'UPDATE', 'DELETE'];

        await prisma.membership.update({
          where: { id: membership.id },
          data: { permissions },
        });

        console.log(
          `✅ Permissions CRM ajoutées pour ${membership.user.email} dans ${membership.company.name}`,
        );
        updated++;
      } else {
        console.log(
          `⏭️  ${membership.user.email} a déjà les permissions CRM dans ${membership.company.name}`,
        );
      }
    }

    console.log(`\n✨ ${updated} membership(s) mis à jour avec succès !`);
  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

addCRMPermissions()
  .then(() => {
    console.log('\n🎉 Script terminé avec succès !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Erreur fatale:', error);
    process.exit(1);
  });
