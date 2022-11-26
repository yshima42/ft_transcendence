import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Block, User } from '@prisma/client';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { BlocksService } from './blocks.service';

describe('BlocksService', () => {
  let blocksService: BlocksService;
  let prisma: PrismaService;
  const date = new Date('2022-11-01T04:34:22+09:00');
  const mockUsers: User[] = [
    {
      id: '21514d8b-e6af-490c-bc51-d0c7a359a267',
      createdAt: new Date(date),
      updatedAt: new Date(date),
      name: 'blockDummy1',
      avatarImageUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=1',
      nickname: 'nickname1',
      onlineStatus: 'ONLINE',
    },
    {
      id: '40e8b4b4-9b39-4b7e-8e31-78e31975d320',
      createdAt: new Date(date),
      updatedAt: new Date(date),
      name: 'blockDummy2',
      avatarImageUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=2',
      nickname: 'nickname2',
      onlineStatus: 'OFFLINE',
    },
    {
      id: '5001da8b-0316-411e-a34f-1db29d4d4c4b',
      createdAt: new Date(date),
      updatedAt: new Date(date),
      name: 'blockDummy3',
      avatarImageUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=3',
      nickname: 'nickname3',
      onlineStatus: 'INGAME',
    },
  ];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [BlocksService],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    blocksService = module.get<BlocksService>(BlocksService);
  });

  beforeEach(async () => {
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
    expect(blocksService).toBeDefined();
  });

  it('should create block', async () => {
    const newBlock = await blocksService.create(
      mockUsers[0].id,
      mockUsers[1].id
    );

    expect(newBlock).toHaveProperty('sourceId', mockUsers[0].id);
    expect(newBlock).toHaveProperty('targetId', mockUsers[1].id);
  });

  it('should not block myself', async () => {
    const createFunc = async () => {
      return await blocksService.create(mockUsers[0].id, mockUsers[0].id);
    };

    await expect(createFunc()).rejects.toThrow(BadRequestException);
  });

  it('should not create duplicated block', async () => {
    const createFunc = async () => {
      return await blocksService.create(mockUsers[0].id, mockUsers[1].id);
    };
    const newBlock: Block = {
      sourceId: mockUsers[0].id,
      targetId: mockUsers[1].id,
    };

    await expect(createFunc()).resolves.toStrictEqual(newBlock);
    await expect(createFunc()).rejects.toThrow(BadRequestException);
  });

  it('should remove block', async () => {
    const _newBlock = await prisma.block.create({
      data: {
        sourceId: mockUsers[0].id,
        targetId: mockUsers[1].id,
      },
    });
    const recordCountBefore = await prisma.block.count();
    const deletedRequest = await blocksService.remove(
      mockUsers[0].id,
      mockUsers[1].id
    );
    const recordCountAfter = await prisma.block.count();

    expect(deletedRequest).toHaveProperty('sourceId', mockUsers[0].id);
    expect(recordCountBefore).toBe(1);
    expect(recordCountAfter).toBe(0);
  });

  // テスト名が微妙。のちほど修正
  it('should not remove non-existent block', async () => {
    const deleteFunc = async () =>
      await blocksService.remove(mockUsers[0].id, mockUsers[1].id);
    await expect(deleteFunc()).rejects.toThrow(NotFoundException);
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
    const blockedUsers = await blocksService.findBlockedUsers(mockUsers[0].id);

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
    const blockedUsers = await blocksService.findBlockedUsers(mockUsers[2].id);

    expect(blockedUsers).toHaveLength(2);
    expect(blockedUsers).toContainEqual(mockUsers[0]);
    expect(blockedUsers).toContainEqual(mockUsers[1]);
  });
});
