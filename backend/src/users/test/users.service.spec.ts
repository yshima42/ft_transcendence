import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../users.service';

const date = new Date('2022-11-01T04:34:22+09:00');

const mockUser1 = {
  id: '1',
  createdAt: new Date(date),
  updatedAt: new Date(date),

  name: 'dummy1',
  avatarUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=1',
};

const mockUser2 = {
  id: '2',
  createdAt: new Date(date),
  updatedAt: new Date(date),
  name: 'dummy2',
  avatarUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=2',
};

const mockUser3 = {
  id: '3',
  createdAt: new Date(date),
  updatedAt: new Date(date),
  name: 'dummy3',
  avatarUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=3',
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

  // 必要ないテスト。
  // なぜなら、処理がシンプルでモック関数の戻り値とexpectedがほぼ同じだから。
  // FriendAPIのjestによるユニットテストはしない。
  describe('findFriends', () => {
    it('正常系:フレンドが見つかる', async () => {
      const expectedFindMany = [{ targetUser: mockUser2 }];
      const expectedFindFriends = [mockUser2];
      prisma.relationship.findMany = jest
        .fn()
        .mockReturnValueOnce(expectedFindMany);
      expect(await service.findFriends(mockUser1.id)).toEqual(
        expectedFindFriends
      );
    });
    it('正常系:フレンドが見つからない', async () => {
      const expectedFindMany: Array<{ targetUser: User }> = [];
      const expectedFindFriends: User[] = [];
      prisma.relationship.findMany = jest
        .fn()
        .mockReturnValueOnce(expectedFindMany);
      expect(await service.findFriends(mockUser3.id)).toEqual(
        expectedFindFriends
      );
    });
  });
});
