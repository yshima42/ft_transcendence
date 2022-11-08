import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../user.service';

const mockUser1 = {
  id: '1',
  createdAt: new Date('2022-11-01T04:34:22+09:00'),
  updatedAt: new Date('2022-11-01T04:34:22+09:00'),
  name: 'dummy1',
};

const mockUser2 = {
  id: '2',
  createdAt: new Date('2022-11-01T04:34:22+09:00'),
  updatedAt: new Date('2022-11-01T04:34:22+09:00'),
  name: 'dummy2',
};

const mockUser3 = {
  id: '3',
  createdAt: new Date('2022-11-01T04:34:22+09:00'),
  updatedAt: new Date('2022-11-01T04:34:22+09:00'),
  name: 'dummy3',
};

describe('UserServiceTest', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, UserService, PrismaService],
    }).compile();

    service = module.get<UserService>(UserService);
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
