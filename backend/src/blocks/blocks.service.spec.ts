import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { BlocksService } from './blocks.service';

describe('BlocksService', () => {
  let service: BlocksService;
  let prisma: PrismaService;
  const date = new Date('2022-11-01T04:34:22+09:00');
  const mockUsers: User[] = [
    {
      id: '21514d8b-e6af-490c-bc51-d0c7a359a267',
      createdAt: new Date(date),
      updatedAt: new Date(date),
      name: 'blockDummy1',
      avatarUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=1',
      nickname: 'nickname1',
      onlineStatus: 'ONLINE',
    },
    {
      id: '40e8b4b4-9b39-4b7e-8e31-78e31975d320',
      createdAt: new Date(date),
      updatedAt: new Date(date),
      name: 'blockDummy2',
      avatarUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=2',
      nickname: 'nickname2',
      onlineStatus: 'OFFLINE',
    },
    {
      id: '5001da8b-0316-411e-a34f-1db29d4d4c4b',
      createdAt: new Date(date),
      updatedAt: new Date(date),
      name: 'blockDummy3',
      avatarUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=3',
      nickname: 'nickname3',
      onlineStatus: 'INGAME',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [BlocksService],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    service = module.get<BlocksService>(BlocksService);

    await prisma.user.createMany({
      data: mockUsers,
    });
  });

  afterEach(async () => {
    await prisma.$transaction([
      prisma.block.deleteMany(),
      prisma.user.deleteMany(),
    ]);
    await prisma.$disconnect();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create block', async () => {
    const newBlock = await service.create(mockUsers[0].id, mockUsers[1].id);

    expect(newBlock).toHaveProperty('sourceId', mockUsers[0].id);
    expect(newBlock).toHaveProperty('targetId', mockUsers[1].id);
  });

  it('should remove block', async () => {
    const _newBlock = await prisma.block.create({
      data: {
        sourceId: mockUsers[0].id,
        targetId: mockUsers[1].id,
      },
    });
    const recordCountBefore = await prisma.block.count();
    const deletedRequest = await service.remove(
      mockUsers[0].id,
      mockUsers[1].id
    );
    const recordCountAfter = await prisma.block.count();

    expect(deletedRequest).toHaveProperty('sourceId', mockUsers[0].id);
    expect(recordCountBefore).toBe(1);
    expect(recordCountAfter).toBe(0);
  });

  it('should find a blocking user', async () => {
    const _newBlocks = await prisma.block.createMany({
      data: [
        {
          sourceId: mockUsers[0].id,
          targetId: mockUsers[1].id,
        },
        {
          sourceId: mockUsers[1].id,
          targetId: mockUsers[2].id,
        },
        {
          sourceId: mockUsers[2].id,
          targetId: mockUsers[1].id,
        },
        {
          sourceId: mockUsers[2].id,
          targetId: mockUsers[0].id,
        },
      ],
    });
    const blockedUsers = await service.findBlockedUsers(mockUsers[0].id);

    expect(blockedUsers).toHaveLength(1);
    expect(blockedUsers).toEqual([mockUsers[1]]);
  });

  it('should find some blocking users', async () => {
    const _newBlocks = await prisma.block.createMany({
      data: [
        {
          sourceId: mockUsers[0].id,
          targetId: mockUsers[1].id,
        },
        {
          sourceId: mockUsers[1].id,
          targetId: mockUsers[2].id,
        },
        {
          sourceId: mockUsers[2].id,
          targetId: mockUsers[1].id,
        },
        {
          sourceId: mockUsers[2].id,
          targetId: mockUsers[0].id,
        },
      ],
    });
    const blockedUsers = await service.findBlockedUsers(mockUsers[2].id);

    expect(blockedUsers).toHaveLength(2);
    expect(blockedUsers).toContainEqual(mockUsers[0]);
    expect(blockedUsers).toContainEqual(mockUsers[1]);
  });
});
