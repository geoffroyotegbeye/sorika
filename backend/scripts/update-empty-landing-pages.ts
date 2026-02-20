/**
 * Script pour mettre à jour les landing pages sans sections
 * À exécuter avec: npx ts-node scripts/update-empty-landing-pages.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Recherche des landing pages sans sections...');

  const landingPages = await prisma.landingPage.findMany({
    include: {
      company: true,
    },
  });

  console.log(`📊 ${landingPages.length} landing page(s) trouvée(s)`);

  let updated = 0;
  let skipped = 0;

  for (const lp of landingPages) {
    const sections = lp.sections as any;
    
    // Vérifier si sections est vide ou null
    if (!sections || Object.keys(sections).length === 0) {
      console.log(`✨ Mise à jour de la landing page pour: ${lp.company.name}`);

      await prisma.landingPage.update({
        where: { id: lp.id },
        data: {
          sections: {
            'section-0': {
              id: 'section-0',
              type: 'hero',
              enabled: true,
              content: {
                title: `Bienvenue chez ${lp.company.name}`,
                subtitle: 'Découvrez nos services exceptionnels',
                buttonText: 'Commencer',
                buttonLink: '#contact',
                backgroundType: 'gradient',
                backgroundValue: 'from-blue-600 to-purple-600',
                imageUrl: '',
                layout: 'center',
              },
            },
            'section-1': {
              id: 'section-1',
              type: 'features',
              enabled: true,
              content: {
                title: 'Nos fonctionnalités',
                subtitle: 'Ce qui nous rend uniques',
                layout: 'grid',
                columns: 3,
                items: [
                  { icon: '🚀', title: 'Rapide', description: 'Performance optimale' },
                  { icon: '💎', title: 'Qualité', description: 'Service premium' },
                  { icon: '🎯', title: 'Précis', description: 'Résultats garantis' },
                ],
              },
            },
          },
        },
      });

      updated++;
    } else {
      console.log(`⏭️  ${lp.company.name} - Sections déjà présentes (${Object.keys(sections).length} section(s))`);
      skipped++;
    }
  }

  console.log('\n✅ Terminé!');
  console.log(`   - ${updated} landing page(s) mise(s) à jour`);
  console.log(`   - ${skipped} landing page(s) déjà OK`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
