import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { OnlineStatus } from '@prisma/client';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';

describe('UsersServiceTest', () => {
  let userService: UsersService;
  let prisma: PrismaService;

  const date = new Date('2022-11-01T04:34:22+09:00');
  const dummy1 = {
    id: '21514d8b-e6af-490c-bc51-d0c7a359a267',
    createdAt: new Date(date),
    updatedAt: new Date(date),
    name: 'dummy1',
    avatarUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=1',
    nickname: 'nickname1',
    onlineStatus: 'ONLINE' as OnlineStatus,
  };
  const dummy2 = {
    id: '40e8b4b4-9b39-4b7e-8e31-78e31975d320',
    createdAt: new Date(date),
    updatedAt: new Date(date),
    name: 'dummy2',
    avatarUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=2',
    nickname: 'nickname2',
    onlineStatus: 'OFFLINE' as OnlineStatus,
  };
  const dummy3 = {
    id: '5001da8b-0316-411e-a34f-1db29d4d4c4b',
    createdAt: new Date(date),
    updatedAt: new Date(date),
    name: 'dummy3',
    avatarUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=3',
    nickname: 'nickname3',
    onlineStatus: 'INGAME' as OnlineStatus,
  };
  const dummy4 = {
    id: '7fd8fa2a-398f-495a-bb55-7290136c7e3f',
    createdAt: new Date(date),
    updatedAt: new Date(date),
    name: 'dummy4',
    avatarUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=4',
    nickname: 'nickname4',
    onlineStatus: 'OFFLINE' as OnlineStatus,
  };
  const dummy5 = {
    id: '9f1b53bf-e25d-4630-a174-ac4c7adadcd6',
    createdAt: new Date(date),
    updatedAt: new Date(date),
    name: 'dummy5',
    avatarUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=5',
    nickname: 'nickname5',
    onlineStatus: 'OFFLINE' as OnlineStatus,
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [ConfigService, UsersService, PrismaService],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);

    await prisma.user.createMany({
      data: [dummy1, dummy2, dummy3, dummy4, dummy5],
    });
  });

  afterAll(async () => {
    await prisma.$transaction([prisma.user.deleteMany()]);
    await prisma.$disconnect();
  });

  describe('findAll', () => {
    it('should get all users', async () => {
      const allUsersByService = await userService.findAll(dummy1);
      const allUsersByDatabase = await prisma.user.findMany({
        where: {
          name: {
            not: 'dummy1',
          },
        },
      });

      expect(allUsersByService).toEqual(allUsersByDatabase);
    });
  });

  describe('find', () => {
    it("should get one user's id", async () => {
      const idByService = await userService.find(dummy1.id, 'id');
      const idExpected = { id: dummy1.id };

      expect(idByService).toEqual(idExpected);
    });

    it("should get one user's createdAt", async () => {
      const createdAtByService = await userService.find(dummy1.id, 'createdAt');
      const createdAtExpected = { createdAt: dummy1.createdAt };

      expect(createdAtByService).toEqual(createdAtExpected);
    });

    it("should get one user's updatedAt", async () => {
      const updatedAtByService = await userService.find(dummy1.id, 'updatedAt');
      const updatedAtExpected = { updatedAt: dummy1.updatedAt };

      expect(updatedAtByService).toEqual(updatedAtExpected);
    });

    it("should get one user's name", async () => {
      const nameByService = await userService.find(dummy1.id, 'name');
      const nameAtExpected = { name: dummy1.name };

      expect(nameByService).toEqual(nameAtExpected);
    });

    it("should get one user's avatarUrl", async () => {
      const avatarUrlByService = await userService.find(dummy1.id, 'avatarUrl');
      const avatarUrlExpected = { avatarUrl: dummy1.avatarUrl };

      expect(avatarUrlByService).toEqual(avatarUrlExpected);
    });

    it("should get one user's nickname", async () => {
      const nicknameByService = await userService.find(dummy1.id, 'nickname');
      const nicknameExpected = {
        nickname: dummy1.nickname,
      };

      expect(nicknameByService).toEqual(nicknameExpected);
    });
  });
});
