import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Recherche des entreprises sans page d\'accueil...');

  // Récupérer toutes les entreprises
  const companies = await prisma.company.findMany({
    include: {
      pages: {
        where: { isHomePage: true },
      },
    },
  });

  const companiesWithoutHomePage = companies.filter(
    (company) => company.pages.length === 0
  );

  console.log(`📊 ${companiesWithoutHomePage.length} entreprise(s) sans page d'accueil trouvée(s)`);

  if (companiesWithoutHomePage.length === 0) {
    console.log('✅ Toutes les entreprises ont déjà une page d\'accueil');
    return;
  }

  // Créer les pages d'accueil manquantes
  for (const company of companiesWithoutHomePage) {
    console.log(`📝 Création de la page d'accueil pour: ${company.name} (${company.slug})`);

    await prisma.page.create({
      data: {
        companyId: company.id,
        slug: '',
        title: 'Accueil',
        description: 'Page d\'accueil',
        isHomePage: true,
        isPublished: false,
        elements: [
          {
            id: `section-${Date.now()}`,
            type: 'section',
            tag: 'section',
            content: '',
            styles: {
              desktop: {
                display: 'block',
                width: '100%',
                padding: '80px 20px',
                backgroundColor: '#ffffff',
                minHeight: '400px',
              },
            },
            children: [],
          },
        ],
      },
    });

    console.log(`✅ Page d'accueil créée pour ${company.name}`);
  }

  console.log('\n🎉 Terminé !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
