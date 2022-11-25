import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { ProfileService } from './profile.service';

describe('ProfileServiceTest', () => {
  let profileService: ProfileService;
  let prisma: PrismaService;

  const date = new Date('2022-11-01T04:34:22+09:00');
  const mockUsers: User[] = [
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
    {
      id: '5e1b53bf-e25d-4630-a174-ac4c7adadcd6',
      createdAt: new Date(date),
      updatedAt: new Date(date),
      name: 'dummy6',
      avatarUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=5',
      nickname: 'nickname6',
      onlineStatus: 'OFFLINE',
    },
  ];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [ConfigService, ProfileService, PrismaService],
    }).compile();

    profileService = module.get<ProfileService>(ProfileService);
    prisma = module.get<PrismaService>(PrismaService);

    await prisma.user.createMany({
      data: mockUsers,
    });
  });

  afterAll(async () => {
    await prisma.$transaction([prisma.user.deleteMany()]);
    await prisma.$disconnect();
  });

  describe('update', () => {
    it('should update dummy1 avatarUrl to dummy2 avatarUrl', async () => {
      const updateByService = await profileService.update(mockUsers[0].id, {
        avatarUrl: mockUsers[1].avatarUrl,
      });

      expect(updateByService).toHaveProperty(
        'avatarUrl',
        mockUsers[1].avatarUrl
      );
    });

    it('should update dummy1 nickname to updated1', async () => {
      const updateByService = await profileService.update(mockUsers[0].id, {
        nickname: 'updated1',
      });

      expect(updateByService).toHaveProperty('nickname', 'updated1');
    });

    it('should update dummy1 onlineStatus to OFFLINE', async () => {
      const updateByService = await profileService.update(mockUsers[0].id, {
        onlineStatus: 'OFFLINE',
      });

      expect(updateByService).toHaveProperty('onlineStatus', 'OFFLINE');
    });

    it("should update dummy2's all data", async () => {
      const updateByService = await profileService.update(mockUsers[1].id, {
        avatarUrl: 'google.com',
        nickname: 'updated2',
        onlineStatus: 'INGAME',
      });

      expect(updateByService).toHaveProperty('avatarUrl', 'google.com');
      expect(updateByService).toHaveProperty('nickname', 'updated2');
      expect(updateByService).toHaveProperty('onlineStatus', 'INGAME');
    });
  });
});
