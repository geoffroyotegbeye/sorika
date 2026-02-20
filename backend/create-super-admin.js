// Script pour créer un Super Admin
// Usage: node create-super-admin.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createSuperAdmin() {
  const email = 'admin@sorika.bj';
  const password = 'Admin@2024'; // Changez ce mot de passe !
  
  // Vérifier si l'utilisateur existe déjà
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    // Promouvoir l'utilisateur existant
    await prisma.user.update({
      where: { email },
      data: { isSuperAdmin: true },
    });
    console.log(`✅ Utilisateur ${email} promu Super Admin`);
  } else {
    // Créer un nouveau Super Admin
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        isSuperAdmin: true,
      },
    });
    console.log(`✅ Super Admin créé: ${email}`);
    console.log(`🔑 Mot de passe: ${password}`);
  }

  await prisma.$disconnect();
}

createSuperAdmin().catch(console.error);
