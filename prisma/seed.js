import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Every seeded account uses this password.
const PASSWORD = 'Password123!';

async function seedUsers() {
  const hashed = await bcrypt.hash(PASSWORD, 10);

  const users = [
    { email: 'admin@gmail.com', username: 'admin', role: 'ADMIN' },
    { email: 'vip@gmail.com', username: 'vip', role: 'VIP' },
    { email: 'normal@gmail.com', username: 'normal', role: 'NORMAL' },
    { email: 'user@gmail.com', username: 'user', role: 'NORMAL' },
  ];

  for (const u of users) {
    // upsert = safe to re-run; ensures the role is correct even if the user exists.
    await prisma.user.upsert({
      where: { email: u.email },
      update: { role: u.role },
      create: { ...u, password: hashed },
    });
  }

  console.log(`Seeded ${users.length} users (password for all: ${PASSWORD})`);
}

async function seedContests() {
  // Only seed contests once — skip if any already exist.
  const existing = await prisma.contest.count();
  if (existing > 0) {
    console.log('Contests already exist, skipping contest seed');
    return;
  }

  const startTime = new Date('2025-01-01T00:00:00.000Z');
  const endTime = new Date('2030-01-01T00:00:00.000Z');

  await prisma.contest.create({
    data: {
      name: 'General Knowledge Sprint',
      description: 'A quick quiz open to everyone',
      accessLevel: 'NORMAL',
      startTime,
      endTime,
      prizeInfo: 'Amazon Gift Card ($50)',
      questions: {
        create: [
          {
            text: 'What is the capital of France?',
            type: 'SINGLE',
            points: 1,
            options: {
              create: [
                { text: 'Paris', isCorrect: true },
                { text: 'Lyon', isCorrect: false },
                { text: 'Marseille', isCorrect: false },
              ],
            },
          },
          {
            text: 'Which of these are programming languages?',
            type: 'MULTI',
            points: 2,
            options: {
              create: [
                { text: 'Python', isCorrect: true },
                { text: 'HTML', isCorrect: false },
                { text: 'Rust', isCorrect: true },
              ],
            },
          },
          {
            text: 'The Earth is flat.',
            type: 'BOOLEAN',
            points: 1,
            options: {
              create: [
                { text: 'True', isCorrect: false },
                { text: 'False', isCorrect: true },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.contest.create({
    data: {
      name: 'VIP Masterclass Quiz',
      description: 'Restricted to VIP and Admin users',
      accessLevel: 'VIP',
      startTime,
      endTime,
      prizeInfo: 'Premium Headphones',
      questions: {
        create: [
          {
            text: 'What is the Big-O of binary search?',
            type: 'SINGLE',
            points: 1,
            options: {
              create: [
                { text: 'O(log n)', isCorrect: true },
                { text: 'O(n)', isCorrect: false },
                { text: 'O(n log n)', isCorrect: false },
              ],
            },
          },
          {
            text: 'Which are NoSQL databases?',
            type: 'MULTI',
            points: 2,
            options: {
              create: [
                { text: 'MongoDB', isCorrect: true },
                { text: 'PostgreSQL', isCorrect: false },
                { text: 'Redis', isCorrect: true },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('Seeded 2 contests (1 NORMAL, 1 VIP)');
}

async function main() {
  await seedUsers();
  await seedContests();
  console.log('Seed complete');
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });