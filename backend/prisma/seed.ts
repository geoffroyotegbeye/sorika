import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Créer une entreprise de test
  const company = await prisma.company.upsert({
    where: { slug: 'test-company' },
    update: {},
    create: {
      name: 'Test Company',
      slug: 'test-company',
      currency: 'XOF',
      phoneNumber: '+221 77 123 45 67',
      address: 'Dakar, Sénégal',
    },
  });
  console.log(`✅ Company created/updated: ${company.name}`);

  // Créer des départements
  const departments = await Promise.all([
    prisma.department.upsert({
      where: { companyId_name: { companyId: company.id, name: 'Direction' } },
      update: {},
      create: {
        companyId: company.id,
        name: 'Direction',
        description: 'Direction générale',
      },
    }),
    prisma.department.upsert({
      where: { companyId_name: { companyId: company.id, name: 'RH' } },
      update: {},
      create: {
        companyId: company.id,
        name: 'RH',
        description: 'Ressources Humaines',
      },
    }),
    prisma.department.upsert({
      where: { companyId_name: { companyId: company.id, name: 'IT' } },
      update: {},
      create: {
        companyId: company.id,
        name: 'IT',
        description: 'Département informatique',
      },
    }),
    prisma.department.upsert({
      where: { companyId_name: { companyId: company.id, name: 'Finance' } },
      update: {},
      create: {
        companyId: company.id,
        name: 'Finance',
        description: 'Département financier',
      },
    }),
  ]);
  console.log(`✅ Created ${departments.length} departments`);

  // Créer des postes avec des salaires de base
  const positions = await Promise.all([
    prisma.position.upsert({
      where: { companyId_title: { companyId: company.id, title: 'Directeur Général' } },
      update: {},
      create: {
        companyId: company.id,
        title: 'Directeur Général',
        description: 'Dirigeant de l\'entreprise',
        level: 'EXECUTIVE',
        baseSalary: 1500000,
      },
    }),
    prisma.position.upsert({
      where: { companyId_title: { companyId: company.id, title: 'Manager RH' } },
      update: {},
      create: {
        companyId: company.id,
        title: 'Manager RH',
        description: 'Responsable des ressources humaines',
        level: 'MANAGER',
        baseSalary: 800000,
      },
    }),
    prisma.position.upsert({
      where: { companyId_title: { companyId: company.id, title: 'Développeur Senior' } },
      update: {},
      create: {
        companyId: company.id,
        title: 'Développeur Senior',
        description: 'Développeur expérimenté',
        level: 'STAFF',
        baseSalary: 600000,
      },
    }),
    prisma.position.upsert({
      where: { companyId_title: { companyId: company.id, title: 'Développeur Junior' } },
      update: {},
      create: {
        companyId: company.id,
        title: 'Développeur Junior',
        description: 'Développeur débutant',
        level: 'STAFF',
        baseSalary: 350000,
      },
    }),
    prisma.position.upsert({
      where: { companyId_title: { companyId: company.id, title: 'Comptable' } },
      update: {},
      create: {
        companyId: company.id,
        title: 'Comptable',
        description: 'Responsable comptabilité',
        level: 'STAFF',
        baseSalary: 450000,
      },
    }),
    prisma.position.upsert({
      where: { companyId_title: { companyId: company.id, title: 'Assistant' } },
      update: {},
      create: {
        companyId: company.id,
        title: 'Assistant',
        description: 'Assistant administratif',
        level: 'STAFF',
        baseSalary: 250000,
      },
    }),
  ]);
  console.log(`✅ Created ${positions.length} positions with salaries`);

  // Créer des utilisateurs
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'director@testcompany.com' },
      update: {},
      create: {
        email: 'director@testcompany.com',
        firstName: 'Jean',
        lastName: 'Dupont',
        password: 'password123',
      },
    }),
    prisma.user.upsert({
      where: { email: 'manager.hr@testcompany.com' },
      update: {},
      create: {
        email: 'manager.hr@testcompany.com',
        firstName: 'Marie',
        lastName: 'Martin',
        password: 'password123',
      },
    }),
    prisma.user.upsert({
      where: { email: 'dev.senior@testcompany.com' },
      update: {},
      create: {
        email: 'dev.senior@testcompany.com',
        firstName: 'Pierre',
        lastName: 'Lefebvre',
        password: 'password123',
      },
    }),
    prisma.user.upsert({
      where: { email: 'dev.junior@testcompany.com' },
      update: {},
      create: {
        email: 'dev.junior@testcompany.com',
        firstName: 'Sophie',
        lastName: 'Bernard',
        password: 'password123',
      },
    }),
    prisma.user.upsert({
      where: { email: 'comptable@testcompany.com' },
      update: {},
      create: {
        email: 'comptable@testcompany.com',
        firstName: 'Luc',
        lastName: 'Dubois',
        password: 'password123',
      },
    }),
  ]);
  console.log(`✅ Created ${users.length} users`);

  // Créer des employés
  const employees = await Promise.all([
    prisma.employee.upsert({
      where: { id: 'emp-1' },
      update: {},
      create: {
        id: 'emp-1',
        companyId: company.id,
        userId: users[0].id,
        firstName: 'Jean',
        lastName: 'Dupont',
        positionId: positions[0].id,
        departmentId: departments[0].id,
        hireDate: new Date('2020-01-01'),
        contractType: 'CDI',
        baseSalary: 1600000, // Salaire spécifique supérieur au poste
        isActive: true,
      },
    }),
    prisma.employee.upsert({
      where: { id: 'emp-2' },
      update: {},
      create: {
        id: 'emp-2',
        companyId: company.id,
        userId: users[1].id,
        firstName: 'Marie',
        lastName: 'Martin',
        positionId: positions[1].id,
        departmentId: departments[1].id,
        hireDate: new Date('2021-03-15'),
        contractType: 'CDI',
        baseSalary: null, // Utilisera le salaire du poste (800000)
        isActive: true,
      },
    }),
    prisma.employee.upsert({
      where: { id: 'emp-3' },
      update: {},
      create: {
        id: 'emp-3',
        companyId: company.id,
        userId: users[2].id,
        firstName: 'Pierre',
        lastName: 'Lefebvre',
        positionId: positions[2].id,
        departmentId: departments[2].id,
        hireDate: new Date('2022-06-01'),
        contractType: 'CDI',
        baseSalary: null, // Utilisera le salaire du poste (600000)
        isActive: true,
      },
    }),
    prisma.employee.upsert({
      where: { id: 'emp-4' },
      update: {},
      create: {
        id: 'emp-4',
        companyId: company.id,
        userId: users[3].id,
        firstName: 'Sophie',
        lastName: 'Bernard',
        positionId: positions[3].id,
        departmentId: departments[2].id,
        hireDate: new Date('2023-01-10'),
        contractType: 'CDD',
        baseSalary: 400000, // Salaire spécifique supérieur au poste
        isActive: true,
      },
    }),
    prisma.employee.upsert({
      where: { id: 'emp-5' },
      update: {},
      create: {
        id: 'emp-5',
        companyId: company.id,
        userId: users[4].id,
        firstName: 'Luc',
        lastName: 'Dubois',
        positionId: positions[4].id,
        departmentId: departments[3].id,
        hireDate: new Date('2021-09-20'),
        contractType: 'CDI',
        baseSalary: null, // Utilisera le salaire du poste (450000)
        isActive: true,
      },
    }),
  ]);
  console.log(`✅ Created ${employees.length} employees`);

  // Créer des présences pour le mois courant
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  for (const employee of employees) {
    for (let i = 0; i < 22; i++) {
      const date = new Date(startOfMonth);
      date.setDate(date.getDate() + i);
      
      if (date <= endOfMonth) {
        await prisma.attendance.upsert({
          where: {
            employeeId_date: {
              employeeId: employee.id,
              date: date,
            },
          },
          update: {},
          create: {
            employeeId: employee.id,
            companyId: company.id,
            date: date,
            status: i < 20 ? 'PRESENT' : 'REMOTE',
            checkIn: new Date(date.setHours(8, 0, 0)),
            checkOut: new Date(date.setHours(17, 0, 0)),
            hoursWorked: 8,
          },
        });
      }
    }
  }
  console.log(`✅ Created attendances for ${employees.length} employees`);

  // Créer une règle d'acompte
  const advanceRule = await prisma.advanceRule.upsert({
    where: { id: 'rule-1' },
    update: {},
    create: {
      id: 'rule-1',
      companyId: company.id,
      name: 'Règle acompte standard',
      maxPercentage: 30,
      allowedDaysOfMonth: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
      baseSalary: 350000,
      requireManagerApproval: true,
    },
  });
  console.log(`✅ Created advance rule`);

  // Créer quelques acomptes
  await Promise.all([
    prisma.advance.upsert({
      where: { id: 'advance-1' },
      update: {},
      create: {
        id: 'advance-1',
        companyId: company.id,
        employeeId: employees[2].id,
        advanceRuleId: advanceRule.id,
        amount: 100000,
        reason: 'Frais de voyage',
        requestDate: new Date(),
        status: 'APPROVED',
      },
    }),
    prisma.advance.upsert({
      where: { id: 'advance-2' },
      update: {},
      create: {
        id: 'advance-2',
        companyId: company.id,
        employeeId: employees[3].id,
        advanceRuleId: advanceRule.id,
        amount: 50000,
        reason: 'Dépenses médicales',
        requestDate: new Date(),
        status: 'PENDING',
      },
    }),
  ]);
  console.log(`✅ Created advances`);

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
