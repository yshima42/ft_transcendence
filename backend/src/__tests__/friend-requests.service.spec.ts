import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FriendRequest, User } from '@prisma/client';
import { UpdateFriendRequestDto } from 'src/friend-requests/dto/update-friend-request.dto';
import { FriendRequestsService } from 'src/friend-requests/friend-requests.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

const date = new Date('2022-11-01T04:34:22+09:00');

const userArray: User[] = [
  {
    id: '21514d8b-e6af-490c-bc51-d0c7a359a267',
    createdAt: new Date(date),
    updatedAt: new Date(date),
    name: 'dummy1',
    avatarImageUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=1',
    nickname: 'nickname1',
  },
  {
    id: '40e8b4b4-9b39-4b7e-8e31-78e31975d320',
    createdAt: new Date(date),
    updatedAt: new Date(date),
    name: 'dummy2',
    avatarImageUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=2',
    nickname: 'nickname2',
  },
  {
    id: '5001da8b-0316-411e-a34f-1db29d4d4c4b',
    createdAt: new Date(date),
    updatedAt: new Date(date),
    name: 'dummy3',
    avatarImageUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=3',
    nickname: 'nickname3',
  },
  {
    id: '7fd8fa2a-398f-495a-bb55-7290136c7e3f',
    createdAt: new Date(date),
    updatedAt: new Date(date),
    name: 'dummy4',
    avatarImageUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=4',
    nickname: 'nickname4',
  },
  {
    id: '9f1b53bf-e25d-4630-a174-ac4c7adadcd6',
    createdAt: new Date(date),
    updatedAt: new Date(date),
    name: 'dummy5',
    avatarImageUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=5',
    nickname: 'nickname5',
  },
  {
    id: '5e1b53bf-e25d-4630-a174-ac4c7adadcd6',
    createdAt: new Date(date),
    updatedAt: new Date(date),
    name: 'dummy6',
    avatarImageUrl: 'https://placehold.jp/2b52ee/ffffff/150x150.png?text=5',
    nickname: 'nickname6',
  },
];

describe('FriendRequestsService', () => {
  let friendRequestsService: FriendRequestsService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [FriendRequestsService],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    friendRequestsService = module.get<FriendRequestsService>(
      FriendRequestsService
    );
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.$transaction([
      prisma.user.createMany({
        data: userArray,
      }),
    ]);
  });

  afterEach(async () => {
    await prisma.$transaction([
      prisma.friendRequest.deleteMany(),
      prisma.user.deleteMany(),
    ]);
  });

  it('should be defined', () => {
    expect(friendRequestsService).toBeDefined();
  });

  describe('create', () => {
    it('should create friend-request', async () => {
      const nonExistFreindRequest: FriendRequest = {
        creatorId: userArray[0].id,
        receiverId: userArray[1].id,
        status: 'PENDING',
        createdAt: date,
        updatedAt: date,
      };

      // createAtとupdateAtの時刻が一致しないため、その他のプロパティで比較
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { createdAt, updatedAt, ...frinedRequestBase } =
        nonExistFreindRequest;

      await expect(
        friendRequestsService.create(
          nonExistFreindRequest.creatorId,
          nonExistFreindRequest.receiverId
        )
      ).resolves.toMatchObject(frinedRequestBase);
    });

    it('should not create friend-request to myself', async () => {
      await expect(
        friendRequestsService.create(userArray[0].id, userArray[0].id)
      ).rejects.toThrow(BadRequestException);
    });

    it('should not create duplicated friend-request', async () => {
      await friendRequestsService.create(userArray[0].id, userArray[1].id);
      await expect(
        friendRequestsService.create(userArray[0].id, userArray[1].id)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    // この辺りのテスト名、ユニットテストとe2eテストの考えが混じって違和感ある。
    it('should update request from pending to accepted', async () => {
      const pendingRequest = await prisma.friendRequest.create({
        data: {
          creatorId: userArray[0].id,
          receiverId: userArray[1].id,
          status: 'PENDING',
          createdAt: date,
          updatedAt: date,
        },
      });

      await expect(
        friendRequestsService.update({
          creatorId: pendingRequest.creatorId,
          receiverId: pendingRequest.receiverId,
          status: 'ACCEPTED',
        })
      ).resolves.toHaveProperty('status', 'ACCEPTED');
    });

    it('should not update request sending to myself', async () => {
      const updateFriendRequestDto: UpdateFriendRequestDto = {
        creatorId: userArray[1].id,
        receiverId: userArray[1].id,
        status: 'ACCEPTED',
      };

      await expect(
        friendRequestsService.update(updateFriendRequestDto)
      ).rejects.toThrow(BadRequestException);
    });

    it('should not update non-existent request', async () => {
      const updateFriendRequestDto: UpdateFriendRequestDto = {
        creatorId: userArray[1].id,
        receiverId: userArray[2].id,
        status: 'ACCEPTED',
      };

      await expect(
        friendRequestsService.update(updateFriendRequestDto)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a request', async () => {
      const acceptedRequest = await prisma.friendRequest.create({
        data: {
          creatorId: userArray[0].id,
          receiverId: userArray[1].id,
          status: 'PENDING',
          createdAt: date,
          updatedAt: date,
        },
      });

      await expect(
        friendRequestsService.removeOne(
          acceptedRequest.creatorId,
          acceptedRequest.receiverId
        )
      ).resolves.toHaveProperty('status', 'PENDING');
    });

    it('should not remove non-existent request', async () => {
      await expect(
        friendRequestsService.removeOne(userArray[0].id, userArray[1].id)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findIncomingRequest', () => {
    it('should find incoming request', async () => {
      await prisma.friendRequest.createMany({
        data: [
          {
            creatorId: userArray[1].id,
            receiverId: userArray[0].id,
            status: 'PENDING',
          },
          {
            creatorId: userArray[2].id,
            receiverId: userArray[0].id,
            status: 'PENDING',
          },
          {
            creatorId: userArray[3].id,
            receiverId: userArray[0].id,
            status: 'ACCEPTED',
          },
          {
            creatorId: userArray[4].id,
            receiverId: userArray[0].id,
            status: 'ACCEPTED',
          },
          {
            creatorId: userArray[0].id,
            receiverId: userArray[5].id,
            status: 'PENDING',
          },
          {
            creatorId: userArray[3].id,
            receiverId: userArray[4].id,
            status: 'PENDING',
          },
        ],
      });

      await expect(
        friendRequestsService.findIncomingRequest(userArray[0].id)
      ).resolves.toStrictEqual([userArray[1], userArray[2]]);
    });
  });

  describe('findOutgoingRequest', () => {
    it('should find outgoing request', async () => {
      await prisma.friendRequest.createMany({
        data: [
          {
            creatorId: userArray[0].id,
            receiverId: userArray[1].id,
            status: 'PENDING',
          },
          {
            creatorId: userArray[0].id,
            receiverId: userArray[2].id,
            status: 'PENDING',
          },
          {
            creatorId: userArray[0].id,
            receiverId: userArray[3].id,
            status: 'ACCEPTED',
          },
          {
            creatorId: userArray[0].id,
            receiverId: userArray[4].id,
            status: 'ACCEPTED',
          },
          {
            creatorId: userArray[5].id,
            receiverId: userArray[0].id,
            status: 'PENDING',
          },
          {
            creatorId: userArray[3].id,
            receiverId: userArray[4].id,
            status: 'PENDING',
          },
        ],
      });

      await expect(
        friendRequestsService.findOutgoingRequest(userArray[0].id)
      ).resolves.toStrictEqual([userArray[1], userArray[2]]);
    });
  });

  describe('findFriends', () => {
    it('should find friends', async () => {
      await prisma.friendRequest.createMany({
        data: [
          {
            creatorId: userArray[0].id,
            receiverId: userArray[1].id,
            status: 'ACCEPTED',
          },
          {
            creatorId: userArray[0].id,
            receiverId: userArray[2].id,
            status: 'ACCEPTED',
          },
          {
            creatorId: userArray[0].id,
            receiverId: userArray[3].id,
            status: 'PENDING',
          },
          {
            creatorId: userArray[0].id,
            receiverId: userArray[4].id,
            status: 'PENDING',
          },
          {
            creatorId: userArray[5].id,
            receiverId: userArray[0].id,
            status: 'ACCEPTED',
          },
          {
            creatorId: userArray[3].id,
            receiverId: userArray[4].id,
            status: 'ACCEPTED',
          },
        ],
      });

      await expect(
        friendRequestsService.findFriends(userArray[0].id)
      ).resolves.toStrictEqual([userArray[1], userArray[2], userArray[5]]);
    });

    it('should not find friends', async () => {
      await prisma.friendRequest.createMany({
        data: [
          {
            creatorId: userArray[0].id,
            receiverId: userArray[1].id,
            status: 'PENDING',
          },
          {
            creatorId: userArray[2].id,
            receiverId: userArray[0].id,
            status: 'PENDING',
          },
        ],
      });

      await expect(
        friendRequestsService.findFriends(userArray[0].id)
      ).resolves.toStrictEqual([]);
    });
  });

  describe('findRequestableUsers', () => {
    it('should find requestable users', async () => {
      await prisma.friendRequest.createMany({
        data: [
          {
            creatorId: userArray[0].id,
            receiverId: userArray[1].id,
            status: 'PENDING',
          },
          {
            creatorId: userArray[0].id,
            receiverId: userArray[2].id,
            status: 'ACCEPTED',
          },
          {
            creatorId: userArray[3].id,
            receiverId: userArray[0].id,
            status: 'PENDING',
          },
        ],
      });

      await expect(
        friendRequestsService.findRequestableUsers(userArray[0].id)
      ).resolves.toStrictEqual([userArray[4], userArray[5]]);
    });
  });
});
