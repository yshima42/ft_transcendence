import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

describe('UsersServiceTest', () => {
  let usersService: UsersService;
  let prisma: PrismaService;

  const date = new Date('2022-11-01T04:34:22+09:00');
  const mockUsers: User[] = [
    {
      id: '21514d8b-e6af-490c-bc51-d0c7a359a267',
      createdAt: new Date(date),
      updatedAt: new Date(date),
      name: 'dummy1',
      avatarImageUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=1',
      nickname: 'nickname1',
      onlineStatus: 'ONLINE',
    },
    {
      id: '40e8b4b4-9b39-4b7e-8e31-78e31975d320',
      createdAt: new Date(date),
      updatedAt: new Date(date),
      name: 'dummy2',
      avatarImageUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=2',
      nickname: 'nickname2',
      onlineStatus: 'OFFLINE',
    },
    {
      id: '5001da8b-0316-411e-a34f-1db29d4d4c4b',
      createdAt: new Date(date),
      updatedAt: new Date(date),
      name: 'dummy3',
      avatarImageUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=3',
      nickname: 'nickname3',
      onlineStatus: 'INGAME',
    },
    {
      id: '7fd8fa2a-398f-495a-bb55-7290136c7e3f',
      createdAt: new Date(date),
      updatedAt: new Date(date),
      name: 'dummy4',
      avatarImageUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=4',
      nickname: 'nickname4',
      onlineStatus: 'OFFLINE',
    },
    {
      id: '9f1b53bf-e25d-4630-a174-ac4c7adadcd6',
      createdAt: new Date(date),
      updatedAt: new Date(date),
      name: 'dummy5',
      avatarImageUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=5',
      nickname: 'nickname5',
      onlineStatus: 'OFFLINE',
    },
    {
      id: '5e1b53bf-e25d-4630-a174-ac4c7adadcd6',
      createdAt: new Date(date),
      updatedAt: new Date(date),
      name: 'dummy6',
      avatarImageUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=5',
      nickname: 'nickname6',
      onlineStatus: 'OFFLINE',
    },
  ];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [ConfigService, UsersService, PrismaService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);

    await prisma.user.createMany({
      data: mockUsers,
    });
  });

  afterAll(async () => {
    await prisma.$transaction([
      prisma.friendRequest.deleteMany(),
      prisma.user.deleteMany(),
    ]);
    await prisma.$disconnect();
  });

  describe('findAll', () => {
    it('should get all users', async () => {
      const allUsersByService = await usersService.findAll(mockUsers[0]);
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
      const idByService = await usersService.find(mockUsers[0].id, 'id');
      const idExpected = { id: mockUsers[0].id };

      expect(idByService).toEqual(idExpected);
    });

    it("should get one user's createdAt", async () => {
      const createdAtByService = await usersService.find(
        mockUsers[0].id,
        'createdAt'
      );
      const createdAtExpected = { createdAt: mockUsers[0].createdAt };

      expect(createdAtByService).toEqual(createdAtExpected);
    });

    it("should get one user's updatedAt", async () => {
      const updatedAtByService = await usersService.find(
        mockUsers[0].id,
        'updatedAt'
      );
      const updatedAtExpected = { updatedAt: mockUsers[0].updatedAt };

      expect(updatedAtByService).toEqual(updatedAtExpected);
    });

    it("should get one user's name", async () => {
      const nameByService = await usersService.find(mockUsers[0].id, 'name');
      const nameAtExpected = { name: mockUsers[0].name };

      expect(nameByService).toEqual(nameAtExpected);
    });

    it("should get one user's avatarImageUrl", async () => {
      const avatarImageUrlByService = await usersService.find(
        mockUsers[0].id,
        'avatarImageUrl'
      );
      const avatarImageUrlExpected = {
        avatarImageUrl: mockUsers[0].avatarImageUrl,
      };

      expect(avatarImageUrlByService).toEqual(avatarImageUrlExpected);
    });

    it("should get one user's nickname", async () => {
      const nicknameByService = await usersService.find(
        mockUsers[0].id,
        'nickname'
      );
      const nicknameExpected = {
        nickname: mockUsers[0].nickname,
      };

      expect(nicknameByService).toEqual(nicknameExpected);
    });
  });

  describe('update', () => {
    it('should update dummy1 avatarImageUrl to dummy2 avatarImageUrl', async () => {
      const updateByService = await usersService.update(mockUsers[0].id, {
        avatarImageUrl: mockUsers[1].avatarImageUrl,
      });

      expect(updateByService).toHaveProperty(
        'avatarImageUrl',
        mockUsers[1].avatarImageUrl
      );
    });

    it('should update dummy1 nickname to updated1', async () => {
      const updateByService = await usersService.update(mockUsers[0].id, {
        nickname: 'updated1',
      });

      expect(updateByService).toHaveProperty('nickname', 'updated1');
    });

    it('should update dummy1 onlineStatus to OFFLINE', async () => {
      const updateByService = await usersService.update(mockUsers[0].id, {
        onlineStatus: 'OFFLINE',
      });

      expect(updateByService).toHaveProperty('onlineStatus', 'OFFLINE');
    });

    it("should update dummy2's all data", async () => {
      const updateByService = await usersService.update(mockUsers[1].id, {
        avatarImageUrl: 'google.com',
        nickname: 'updated2',
        onlineStatus: 'INGAME',
      });

      expect(updateByService).toHaveProperty('avatarImageUrl', 'google.com');
      expect(updateByService).toHaveProperty('nickname', 'updated2');
      expect(updateByService).toHaveProperty('onlineStatus', 'INGAME');
    });
  });
});
