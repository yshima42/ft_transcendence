import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { OnlineStatus } from '@prisma/client';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { ProfileService } from './profile.service';

describe('ProfileServiceTest', () => {
  let profileService: ProfileService;
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
      providers: [ConfigService, ProfileService, PrismaService],
    }).compile();

    profileService = module.get<ProfileService>(ProfileService);
    prisma = module.get<PrismaService>(PrismaService);

    await prisma.user.createMany({
      data: [dummy1, dummy2, dummy3, dummy4],
    });
  });

  afterAll(async () => {
    await prisma.$transaction([prisma.user.deleteMany()]);
    await prisma.$disconnect();
  });

  describe('update', () => {
    it('should update dummy1 avatarUrl to dummy2 avatarUrl', async () => {
      const updateByService = await profileService.update(dummy1.id, {
        avatarUrl: dummy2.avatarUrl,
      });

      expect(updateByService).toHaveProperty('avatarUrl', dummy2.avatarUrl);
    });

    it('should update dummy1 nickname to dummy2 nickname', async () => {
      const updateByService = await profileService.update(dummy1.id, {
        nickname: 'updatedNickname',
      });

      expect(updateByService).toHaveProperty('nickname', 'updatedNickname');
    });

    it('should update dummy1 onlineStatus to OFFLINE', async () => {
      const updateByService = await profileService.update(dummy1.id, {
        onlineStatus: 'OFFLINE',
      });

      expect(updateByService).toHaveProperty('onlineStatus', 'OFFLINE');
    });

    it("should update dummy1's all data to dummy5", async () => {
      const updateByService = await profileService.update(dummy1.id, {
        avatarUrl: dummy5.avatarUrl,
        nickname: dummy5.nickname,
        onlineStatus: dummy5.onlineStatus,
      });

      expect(updateByService).toHaveProperty('avatarUrl', dummy5.avatarUrl);
      expect(updateByService).toHaveProperty('nickname', dummy5.nickname);
      expect(updateByService).toHaveProperty(
        'onlineStatus',
        dummy5.onlineStatus
      );
    });
  });
});
