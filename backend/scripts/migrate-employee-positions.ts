import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateEmployeePositions() {
  console.log('🔄 Migration des postes des employés...\n');

  try {
    // Récupérer toutes les companies
    const companies = await prisma.company.findMany({
      select: { id: true, name: true },
    });

    for (const company of companies) {
      console.log(`📦 Traitement de l'organisation: ${company.name}`);

      // Récupérer tous les employés de cette company
      // Note: Le champ 'position' n'existe plus dans le schéma, donc on ne peut pas le lire
      // Les employés ont déjà positionId = null après la migration
      const employees = await prisma.employee.findMany({
        where: { companyId: company.id },
        select: { 
          id: true, 
          firstName: true, 
          lastName: true,
          positionId: true,
        },
      });

      console.log(`  ✓ ${employees.length} employés trouvés`);
      
      // Compter les employés sans poste
      const employeesWithoutPosition = employees.filter(e => !e.positionId);
      console.log(`  ⚠️  ${employeesWithoutPosition.length} employés sans poste assigné\n`);
    }

    console.log('✅ Migration terminée !');
    console.log('\n📝 Note: Les anciens postes (texte) ont été perdus lors de la migration.');
    console.log('   Vous devez maintenant :');
    console.log('   1. Créer les postes dans l\'interface RH > Postes');
    console.log('   2. Assigner manuellement les employés à leurs postes\n');

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

migrateEmployeePositions()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
