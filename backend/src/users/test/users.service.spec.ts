import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../users.service';

const date = new Date('2022-11-01T04:34:22+09:00');

const mockUser1: User = {
  id: '21514d8b-e6af-490c-bc51-d0c7a359a267',
  createdAt: new Date(date),
  updatedAt: new Date(date),
  name: 'dummy1',
  avatarUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=1',
  nickname: 'nickname1',
  onlineStatus: 'ONLINE',
};

const mockUser2: User = {
  id: '40e8b4b4-9b39-4b7e-8e31-78e31975d320',
  createdAt: new Date(date),
  updatedAt: new Date(date),
  name: 'dummy2',
  avatarUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=2',
  nickname: 'nickname2',
  onlineStatus: 'OFFLINE',
};

const mockUser3: User = {
  id: '5001da8b-0316-411e-a34f-1db29d4d4c4b',
  createdAt: new Date(date),
  updatedAt: new Date(date),
  name: 'dummy3',
  avatarUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=3',
  nickname: 'nickname3',
  onlineStatus: 'INGAME',
};

describe('UsersServiceTest', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, UsersService, PrismaService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('findAll', () => {
    it('正常系', async () => {
      const expected = [mockUser1, mockUser3];
      prisma.user.findMany = jest.fn().mockReturnValueOnce(expected);
      expect(await service.findAll(mockUser2)).toEqual(expected);
    });
  });
});
