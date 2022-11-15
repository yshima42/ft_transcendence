import { PrismaClient, User } from '@prisma/client';
const prisma = new PrismaClient();

const userData: User[] = [
  {
    id: '21514d8b-e6af-490c-bc51-d0c7a359a267',
    createdAt: new Date('2022-11-01T04:34:22+09:00'),
    updatedAt: new Date('2022-11-01T04:34:22+09:00'),
    name: 'dummy1',
    avatarUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=1',
  },
  {
    id: '40e8b4b4-9b39-4b7e-8e31-78e31975d320',
    createdAt: new Date('2022-11-01T04:34:22+09:00'),
    updatedAt: new Date('2022-11-01T04:34:22+09:00'),
    name: 'dummy2',
    avatarUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=2',
  },
  {
    id: '5001da8b-0316-411e-a34f-1db29d4d4c4b',
    createdAt: new Date('2022-11-01T04:34:22+09:00'),
    updatedAt: new Date('2022-11-01T04:34:22+09:00'),
    name: 'dummy3',
    avatarUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=3',
  },
  {
    id: '7fd8fa2a-398f-495a-bb55-7290136c7e3f',
    createdAt: new Date('2022-11-01T04:34:22+09:00'),
    updatedAt: new Date('2022-11-01T04:34:22+09:00'),
    name: 'dummy4',
    avatarUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=4',
  },
  {
    id: '9f1b53bf-e25d-4630-a174-ac4c7adadcd6',
    createdAt: new Date('2022-11-01T04:34:22+09:00'),
    updatedAt: new Date('2022-11-01T04:34:22+09:00'),
    name: 'dummy5',
    avatarUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=5',
  },
];

const doSeed = async () => {
  const users = [];
  for (const u of userData) {
    const user = prisma.user.create({
      data: u,
    });
    users.push(user);
  }

  return await prisma.$transaction(users);
};

const main = async () => {
  console.log(`Start seeding ...`);

  await doSeed();

  console.log(`Seeding finished.`);
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
