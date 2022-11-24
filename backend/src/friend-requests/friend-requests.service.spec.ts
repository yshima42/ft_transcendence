import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { FriendRequestsService } from './friend-requests.service';

describe('FriendRequestsService', () => {
  let service: FriendRequestsService;
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [FriendRequestsService],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    service = module.get<FriendRequestsService>(FriendRequestsService);

    await prisma.user.createMany({
      data: mockUsers,
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
    const newRequest = await service.create(mockUsers[0].id, mockUsers[1].id);

    expect(newRequest).toHaveProperty('creatorId', mockUsers[0].id);
    expect(newRequest).toHaveProperty('receiverId', mockUsers[1].id);
  });

  it('should update request from pending to accepted', async () => {
    const _newRequest = await prisma.friendRequest.create({
      data: {
        creatorId: mockUsers[0].id,
        receiverId: mockUsers[1].id,
        status: 'PENDING',
      },
    });

    const updatedRequest = await service.update({
      creatorId: mockUsers[0].id,
      receiverId: mockUsers[1].id,
      status: 'ACCEPTED',
    });

    expect(updatedRequest).toHaveProperty('status', 'ACCEPTED');
  });

  it('should update request from pending to declined', async () => {
    const _newRequest = await prisma.friendRequest.create({
      data: {
        creatorId: mockUsers[0].id,
        receiverId: mockUsers[1].id,
        status: 'PENDING',
      },
    });

    const updatedRequest = await service.update({
      creatorId: mockUsers[0].id,
      receiverId: mockUsers[1].id,
      status: 'DECLINED',
    });

    expect(updatedRequest).toHaveProperty('status', 'DECLINED');
  });

  it('should remove accepted request', async () => {
    const _newRequest = await prisma.friendRequest.create({
      data: {
        creatorId: mockUsers[0].id,
        receiverId: mockUsers[1].id,
        status: 'ACCEPTED',
      },
    });
    const recordCountBefore = await prisma.friendRequest.count();
    const deletedRequest = await service.remove(
      mockUsers[0].id,
      mockUsers[1].id
    );
    const recordCountAfter = await prisma.friendRequest.count();

    expect(deletedRequest).toHaveProperty('status', 'ACCEPTED');
    expect(recordCountBefore).toBe(1);
    expect(recordCountAfter).toBe(0);
  });

  it('should find incoming request', async () => {
    const _newRequests = await prisma.friendRequest.createMany({
      data: [
        {
          creatorId: mockUsers[1].id,
          receiverId: mockUsers[0].id,
          status: 'PENDING',
        },
        {
          creatorId: mockUsers[2].id,
          receiverId: mockUsers[0].id,
          status: 'PENDING',
        },
        {
          creatorId: mockUsers[3].id,
          receiverId: mockUsers[0].id,
          status: 'ACCEPTED',
        },
        {
          creatorId: mockUsers[4].id,
          receiverId: mockUsers[0].id,
          status: 'DECLINED',
        },
        {
          creatorId: mockUsers[0].id,
          receiverId: mockUsers[5].id,
          status: 'PENDING',
        },
        {
          creatorId: mockUsers[3].id,
          receiverId: mockUsers[4].id,
          status: 'PENDING',
        },
      ],
    });

    const incomingRequests = await service.findIncomingRequest(mockUsers[0].id);

    expect(incomingRequests).toEqual([mockUsers[1], mockUsers[2]]);
  });

  it('should find outgoing request', async () => {
    const _newRequests = await prisma.friendRequest.createMany({
      data: [
        {
          creatorId: mockUsers[0].id,
          receiverId: mockUsers[1].id,
          status: 'PENDING',
        },
        {
          creatorId: mockUsers[0].id,
          receiverId: mockUsers[2].id,
          status: 'PENDING',
        },
        {
          creatorId: mockUsers[0].id,
          receiverId: mockUsers[3].id,
          status: 'ACCEPTED',
        },
        {
          creatorId: mockUsers[0].id,
          receiverId: mockUsers[4].id,
          status: 'DECLINED',
        },
        {
          creatorId: mockUsers[5].id,
          receiverId: mockUsers[0].id,
          status: 'PENDING',
        },
        {
          creatorId: mockUsers[3].id,
          receiverId: mockUsers[4].id,
          status: 'PENDING',
        },
      ],
    });
    const outgoingRequests = await service.findOutgoingRequest(mockUsers[0].id);

    expect(outgoingRequests).toEqual([mockUsers[1], mockUsers[2]]);
  });

  it('should find friends', async () => {
    const _newRequests = await prisma.friendRequest.createMany({
      data: [
        {
          creatorId: mockUsers[0].id,
          receiverId: mockUsers[1].id,
          status: 'ACCEPTED',
        },
        {
          creatorId: mockUsers[0].id,
          receiverId: mockUsers[2].id,
          status: 'ACCEPTED',
        },
        {
          creatorId: mockUsers[0].id,
          receiverId: mockUsers[3].id,
          status: 'PENDING',
        },
        {
          creatorId: mockUsers[0].id,
          receiverId: mockUsers[4].id,
          status: 'DECLINED',
        },
        {
          creatorId: mockUsers[5].id,
          receiverId: mockUsers[0].id,
          status: 'ACCEPTED',
        },
        {
          creatorId: mockUsers[3].id,
          receiverId: mockUsers[4].id,
          status: 'ACCEPTED',
        },
      ],
    });
    const pendingRequests = await service.findFriends(mockUsers[0].id);

    // expect(pendingRequests).toEqual([mockUsers[1], mockUsers[2], mockUsers[5]]);
    expect(pendingRequests).toHaveLength(3);
  });
});
