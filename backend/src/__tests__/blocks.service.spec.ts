import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Block, User } from '@prisma/client';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { BlocksService } from 'src/blocks/blocks.service';

const date = new Date('2022-11-01T04:34:22+09:00');

const userArray: User[] = [
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

const oneUser = userArray[0];

const blockArray: Block[] = [
  {
    sourceId: userArray[0].id,
    targetId: userArray[1].id,
  },
  {
    sourceId: userArray[0].id,
    targetId: userArray[2].id,
  },
];

const oneBlock: Block = blockArray[0];
const nonExistBlock: Block = {
  sourceId: userArray[1].id,
  targetId: userArray[2].id,
};

describe('BlocksService', () => {
  let blocksService: BlocksService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [BlocksService],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    blocksService = module.get<BlocksService>(BlocksService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.user.createMany({
      data: userArray,
    });
    await prisma.block.createMany({
      data: blockArray,
    });
  });

  afterEach(async () => {
    await prisma.$transaction([
      prisma.block.deleteMany(),
      prisma.user.deleteMany(),
    ]);
  });

  it('should be defined', () => {
    expect(blocksService).toBeDefined();
  });

  describe('create', () => {
    it('should successfully block', async () => {
      await expect(
        blocksService.create(nonExistBlock.sourceId, nonExistBlock.targetId)
      ).resolves.toStrictEqual(nonExistBlock);
    });

    it('should not block myself', async () => {
      await expect(
        blocksService.create(oneUser.id, oneUser.id)
      ).rejects.toThrow(BadRequestException);
    });

    it('should not create duplicated block', async () => {
      await expect(
        blocksService.create(oneBlock.sourceId, oneBlock.targetId)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findBlockedUsers', () => {
    it('should find blocking users', async () => {
      await expect(
        blocksService.findBlockedUsers(oneUser.id)
      ).resolves.toStrictEqual([userArray[1], userArray[2]]);
    });
  });

  describe('remove', () => {
    it('should remove block', async () => {
      const removeFunc = async () => {
        return await blocksService.remove(oneBlock.sourceId, oneBlock.targetId);
      };

      await expect(removeFunc()).resolves.toStrictEqual(oneBlock);
    });

    // テスト名が微妙。のちほど修正
    it('should not remove non-existent block', async () => {
      await expect(
        blocksService.remove(nonExistBlock.sourceId, nonExistBlock.targetId)
      ).rejects.toThrow(NotFoundException);
    });
  });
});
