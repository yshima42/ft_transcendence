import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { FriendRequestsService } from './friend-requests.service';

describe('FriendRequestsService', () => {
  let service: FriendRequestsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [FriendRequestsService],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    service = module.get<FriendRequestsService>(FriendRequestsService);

    const date = new Date('2022-11-01T04:34:22+09:00');
    await prisma.user.createMany({
      data: [
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
      ],
    });
  });

  afterEach(async () => {
    await prisma.$transaction([
      prisma.friendRequest.deleteMany(),
      prisma.user.deleteMany(),
    ]);
    await prisma.$disconnect();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create friend-request', async () => {
    const newRequest = await service.create(
      '21514d8b-e6af-490c-bc51-d0c7a359a267',
      '40e8b4b4-9b39-4b7e-8e31-78e31975d320'
    );

    expect(newRequest).toHaveProperty(
      'creatorId',
      '21514d8b-e6af-490c-bc51-d0c7a359a267'
    );
    expect(newRequest).toHaveProperty(
      'receiverId',
      '40e8b4b4-9b39-4b7e-8e31-78e31975d320'
    );
  });
});
