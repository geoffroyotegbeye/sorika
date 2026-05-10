import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const memberships = await prisma.membership.findMany();
  let updated = 0;

  for (const m of memberships) {
    const perms = (m.permissions as Record<string, string[]>) ?? {};
    if (!perms['ACCOUNTING']) {
      perms['ACCOUNTING'] = ['READ', 'CREATE', 'UPDATE', 'DELETE'];
      await prisma.membership.update({
        where: { id: m.id },
        data: { permissions: perms },
      });
      updated++;
    }
  }

  console.log(`✅ ${updated} membership(s) mis à jour avec les permissions ACCOUNTING`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
