import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addProjectsPermissions() {
  console.log('🔧 Ajout des permissions PROJECTS à tous les memberships...\n');

  const memberships = await prisma.membership.findMany({
    include: {
      user: { select: { email: true } },
      company: { select: { name: true } },
    },
  });

  let updated = 0;

  for (const membership of memberships) {
    const permissions = membership.permissions as Record<string, string[]>;

    // Ajouter les permissions PROJECTS si elles n'existent pas
    if (!permissions['PROJECTS']) {
      permissions['PROJECTS'] = ['READ', 'CREATE', 'UPDATE', 'DELETE'];

      await prisma.membership.update({
        where: { id: membership.id },
        data: { permissions },
      });

      console.log(
        `✅ ${membership.user.email} → ${membership.company.name}`,
      );
      updated++;
    } else {
      console.log(
        `⏭️  ${membership.user.email} → ${membership.company.name} (déjà configuré)`,
      );
    }
  }

  console.log(`\n✨ ${updated} membership(s) mis à jour !`);
  console.log(`📊 Total memberships: ${memberships.length}`);

  await prisma.$disconnect();
}

// Exécution
addProjectsPermissions()
  .then(() => {
    console.log('\n✅ Script terminé avec succès !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erreur:', error);
    process.exit(1);
  });
