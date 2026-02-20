/**
 * Script pour créer les landing pages manquantes
 * À exécuter avec: npx ts-node scripts/fix-landing-pages.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Recherche des entreprises sans landing page...');

  // Trouver toutes les entreprises avec le module LANDING_PAGE
  const companies = await prisma.company.findMany({
    where: {
      modules: {
        has: 'LANDING_PAGE',
      },
    },
    include: {
      landingPage: true,
    },
  });

  console.log(`📊 ${companies.length} entreprise(s) trouvée(s) avec le module LANDING_PAGE`);

  let created = 0;
  let skipped = 0;

  for (const company of companies) {
    if (company.landingPage) {
      console.log(`⏭️  ${company.name} - Landing page existe déjà`);
      skipped++;
      continue;
    }

    console.log(`✨ Création de la landing page pour: ${company.name}`);

    await prisma.landingPage.create({
      data: {
        companyId: company.id,
        templateName: 'modern',
        theme: {
          colors: {
            primary: '#3b82f6',
            secondary: '#8b5cf6',
            accent: '#f59e0b',
            background: '#ffffff',
            text: '#1e293b',
            muted: '#64748b',
          },
          fonts: {
            heading: 'Inter',
            body: 'Inter',
          },
          spacing: 'comfortable',
          borderRadius: 'medium',
          animations: true,
        },
        sections: {
          'section-0': {
            id: 'section-0',
            type: 'hero',
            enabled: true,
            content: {
              title: `Bienvenue chez ${company.name}`,
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
        seo: {
          title: company.name,
          description: `Découvrez ${company.name} - Services professionnels`,
          keywords: [],
          ogImage: '',
        },
        isActive: true,
      },
    });

    created++;
  }

  console.log('\n✅ Terminé!');
  console.log(`   - ${created} landing page(s) créée(s)`);
  console.log(`   - ${skipped} landing page(s) déjà existante(s)`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
