import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@gmail.com';
  const password = 'Admin123!'; // change after first login

  const hashedPassword = await bcrypt.hash(password, 10);

  // upsert = create if missing, update if already there -> safe to run repeatedly
  const admin = await prisma.user.upsert({
    where: { email },
    update: { role: 'ADMIN' }, // if the user exists, just make sure they're an admin
    create: {
      email,
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log(`✅ Admin ready: ${admin.email} (id: ${admin.id})`);
  console.log(`   Login with password: ${password}`);
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });