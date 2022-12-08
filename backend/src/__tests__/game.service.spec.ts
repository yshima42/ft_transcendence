import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MatchResult, User } from '@prisma/client';
import { CreateMatchResultDto } from 'src/game/dto/create-match-result.dto';
import { GameService } from 'src/game/game.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

const date = new Date('2022-11-01T04:34:22+09:00');

const userArray: User[] = [
  {
    id: '21514d8b-e6af-490c-bc51-d0c7a359a267',
    name: 'dummy1',
    avatarImageUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=1',
    nickname: 'nickname1',
    onlineStatus: 'ONLINE',
    createdAt: new Date(date),
    updatedAt: new Date(date),
  },
  {
    id: '40e8b4b4-9b39-4b7e-8e31-78e31975d320',
    name: 'dummy2',
    avatarImageUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=1',
    nickname: 'nickname2',
    onlineStatus: 'ONLINE',
    createdAt: new Date(date),
    updatedAt: new Date(date),
  },
  {
    id: '5001da8b-0316-411e-a34f-1db29d4d4c4b',
    name: 'dummy3',
    avatarImageUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=1',
    nickname: 'nickname3',
    onlineStatus: 'ONLINE',
    createdAt: new Date(date),
    updatedAt: new Date(date),
  },
];

const matchResultArray: MatchResult[] = [
  {
    id: 'f0ad9b0d-291b-4635-afad-6e6e0fec58e0',
    playerOneId: userArray[0].id,
    playerTwoId: userArray[1].id,
    playerOneScore: 5,
    playerTwoScore: 0,
    startedAt: new Date(date),
    finishedAt: new Date(date),
  },
  {
    id: '4bdd5d65-0a11-4efb-aae3-7480002429b8',
    playerOneId: userArray[2].id,
    playerTwoId: userArray[0].id,
    playerOneScore: 5,
    playerTwoScore: 1,
    startedAt: new Date(date),
    finishedAt: new Date(date),
  },
  {
    id: '4121260f-f785-4b88-ab2d-694e96cedbd6',
    playerOneId: userArray[1].id,
    playerTwoId: userArray[2].id,
    playerOneScore: 5,
    playerTwoScore: 0,
    startedAt: new Date(date),
    finishedAt: new Date(date),
  },
];

describe('GameService', () => {
  let gameService: GameService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [GameService],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    gameService = module.get<GameService>(GameService);
  });

  beforeEach(async () => {
    await prisma.user.createMany({
      data: userArray,
    });
    await prisma.matchResult.createMany({
      data: matchResultArray,
    });
  });

  afterEach(async () => {
    await prisma.$transaction([
      prisma.matchResult.deleteMany(),
      prisma.user.deleteMany(),
    ]);
  });

  describe('addMatchResult', () => {
    it('Success case', async () => {
      const input: CreateMatchResultDto = {
        playerOneId: userArray[0].id,
        playerTwoId: userArray[1].id,
        playerOneScore: 5,
        playerTwoScore: 3,
      };

      const output = await gameService.addMatchResult(input);

      expect(output.playerOneId).toEqual(input.playerOneId);
      expect(output.playerTwoId).toEqual(input.playerTwoId);
      expect(output.playerOneScore).toBe(input.playerOneScore);
      expect(output.playerTwoScore).toBe(input.playerTwoScore);
    });

    it('Failure case1', async () => {
      const input: CreateMatchResultDto = {
        playerOneId: userArray[0].id,
        playerTwoId: userArray[1].id,
        playerOneScore: 4,
        playerTwoScore: 3,
      };

      await expect(gameService.addMatchResult(input)).rejects.toThrow(
        BadRequestException
      );
    });

    it('Failure case2', async () => {
      const input: CreateMatchResultDto = {
        playerOneId: userArray[0].id,
        playerTwoId: userArray[1].id,
        playerOneScore: 5,
        playerTwoScore: 5,
      };

      await expect(gameService.addMatchResult(input)).rejects.toThrow(
        BadRequestException
      );
    });

    it('Failure case3', async () => {
      const input: CreateMatchResultDto = {
        playerOneId: userArray[0].id,
        playerTwoId: userArray[1].id,
        playerOneScore: -5,
        playerTwoScore: 5,
      };

      await expect(gameService.addMatchResult(input)).rejects.toThrow(
        BadRequestException
      );
    });

    it('Failure case4', async () => {
      const input: CreateMatchResultDto = {
        playerOneId: userArray[0].id,
        playerTwoId: userArray[1].id,
        playerOneScore: 3,
        playerTwoScore: 100,
      };

      await expect(gameService.addMatchResult(input)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('findManyHistory', () => {
    it('Success case', async () => {
      await expect(
        gameService.findMatchHistory(userArray[0].id)
      ).resolves.toStrictEqual([
        {
          ...matchResultArray[0],
          playerOne: { ...userArray[0] },
          playerTwo: { ...userArray[1] },
        },
        {
          ...matchResultArray[1],
          playerOne: { ...userArray[2] },
          playerTwo: { ...userArray[0] },
        },
      ]);
    });
  });

  describe('findStats', () => {
    it('Success case', async () => {
      const expectStats = {
        totalMatches: 2,
        totalWins: 1,
        totalLoses: 1,
        winRate: 50,
      };

      await expect(
        gameService.findStats(userArray[0].id)
      ).resolves.toStrictEqual(expectStats);
    });
  });
});
