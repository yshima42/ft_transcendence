import { PrismaClient, Relationship, User } from '@prisma/client';
const prisma = new PrismaClient();

const date = new Date('2022-11-01T04:34:22+09:00');

const userData: User[] = [
  {
    id: '21514d8b-e6af-490c-bc51-d0c7a359a267',
    createdAt: new Date(date),
    updatedAt: new Date(date),
    name: 'dummy1',
    avatarUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=1',
    nickname: 'nickname1',
    onlineStatus: 'ONLINE',
  },
  {
    id: '40e8b4b4-9b39-4b7e-8e31-78e31975d320',
    createdAt: new Date(date),
    updatedAt: new Date(date),
    name: 'dummy2',
    avatarUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=2',
    nickname: 'nickname2',
    onlineStatus: 'OFFLINE',
  },
  {
    id: '5001da8b-0316-411e-a34f-1db29d4d4c4b',
    createdAt: new Date(date),
    updatedAt: new Date(date),
    name: 'dummy3',
    avatarUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=3',
    nickname: 'nickname3',
    onlineStatus: 'INGAME',
  },
  {
    id: '7fd8fa2a-398f-495a-bb55-7290136c7e3f',
    createdAt: new Date(date),
    updatedAt: new Date(date),
    name: 'dummy4',
    avatarUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=4',
    nickname: 'nickname4',
    onlineStatus: 'OFFLINE',
  },
  {
    id: '9f1b53bf-e25d-4630-a174-ac4c7adadcd6',
    createdAt: new Date(date),
    updatedAt: new Date(date),
    name: 'dummy5',
    avatarUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=5',
    nickname: 'nickname5',
    onlineStatus: 'OFFLINE',
  },
];

const relationshipData: Relationship[] = [
  // friend
  {
    createdAt: new Date(date),
    updatedAt: new Date(date),
    userId: userData[0].id,
    peerId: userData[1].id,
    type: 'FRIEND',
    isBlocking: false,
  },
  {
    createdAt: new Date(date),
    updatedAt: new Date(date),
    userId: userData[1].id,
    peerId: userData[0].id,
    type: 'FRIEND',
    isBlocking: false,
  },
  // not friend
  {
    createdAt: new Date(date),
    updatedAt: new Date(date),
    userId: userData[0].id,
    peerId: userData[3].id,
    type: 'OUTGOING',
    isBlocking: false,
  },
  {
    createdAt: new Date(date),
    updatedAt: new Date(date),
    userId: userData[3].id,
    peerId: userData[0].id,
    type: 'INCOMING',
    isBlocking: false,
  },
  {
    createdAt: new Date(date),
    updatedAt: new Date(date),
    userId: userData[4].id,
    peerId: userData[0].id,
    type: 'OUTGOING',
    isBlocking: false,
  },
  {
    createdAt: new Date(date),
    updatedAt: new Date(date),
    userId: userData[0].id,
    peerId: userData[4].id,
    type: 'INCOMING',
    isBlocking: false,
  },
];

const createUsers = async () => {
  const users = [];
  for (const u of userData) {
    const user = prisma.user.create({
      data: u,
    });
    users.push(user);
  }

  return await prisma.$transaction(users);
};

const createRelationships = async () => {
  const relations = [];
  for (const r of relationshipData) {
    const relation = prisma.relationship.create({
      data: r,
    });
    relations.push(relation);
  }

  return await prisma.$transaction(relations);
};

const main = async () => {
  console.log(`Start seeding ...`);

  await createUsers();
  await createRelationships();

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
