import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 12);

  const user = await prisma.user.upsert({
    where: { email: 'demo@aiway.com' },
    update: {},
    create: {
      email: 'demo@aiway.com',
      name: 'Demo User',
      password: hashedPassword,
      plan: 'FREE',
    },
  });

  console.log('Created demo user:', user.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
