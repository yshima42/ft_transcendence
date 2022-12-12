import {
  Block,
  FriendRequest,
  PrismaClient,
  User,
  ChatRoom,
  ChatRoomUser,
  ChatMessage,
  DmRoom,
  DmRoomUser,
  Dm,
  MatchResult,
  ChatRoomStatus,
} from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const idMap = new Map<string, string>();
for (let i = 0; i < 100; i++) {
  idMap.set('dummy' + i.toString(), uuidv4());
}

const onlineStatus = ['ONLINE', 'OFFLINE', 'INGAME'] as const;
const FriendRequestStatus = ['PENDING', 'ACCEPTED', 'DECLINED'] as const;

const getOnlineStatus = () => {
  const randomIndex = Math.floor(Math.random() * onlineStatus.length);

  return onlineStatus[randomIndex];
};

const getFriendRequestStatus = () => {
  const randomIndex = Math.floor(Math.random() * FriendRequestStatus.length);

  return FriendRequestStatus[randomIndex];
};

const userData: User[] = [];

idMap.forEach((value, key) => {
  userData.push({
    id: value,
    name: key,
    avatarImageUrl:
      'https://placehold.jp/2b52ee/ffffff/150x150.png?text=' + key,
    nickname: 'nickname' + key,
    twoFactorAuthSecret: '',
    isTwoFactorAuthEnabled: false,
    onlineStatus: getOnlineStatus(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
});

const friendRequestData: FriendRequest[] = [];
for (let i = 0; i < 30; i++) {
  const creatorId = idMap.get('dummy1');
  const receiverId = idMap.get('dummy' + (i + 1).toString());
  if (creatorId !== undefined && receiverId !== undefined) {
    friendRequestData.push({
      creatorId,
      receiverId,
      status: getFriendRequestStatus(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

for (let i = 40; i < 60; i++) {
  const creatorId = idMap.get('dummy' + (i + 1).toString());
  const receiverId = idMap.get('dummy1');
  if (creatorId !== undefined && receiverId !== undefined) {
    friendRequestData.push({
      creatorId,
      receiverId,
      status: getFriendRequestStatus(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

for (let i = 2; i < 30; i++) {
  const creatorId = idMap.get('dummy' + i.toString());
  const receiverId = idMap.get('dummy' + (i + 1).toString());
  if (creatorId !== undefined && receiverId !== undefined) {
    friendRequestData.push({
      creatorId,
      receiverId,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

const blockData: Block[] = [];
for (let i = 0; i < 30; i++) {
  const targetId = idMap.get('dummy' + i.toString());
  const sourceId = idMap.get('dummy1');
  if (targetId !== undefined && sourceId !== undefined) {
    blockData.push({
      targetId,
      sourceId,
    });
  }
}

const chatRooms: ChatRoom[] = [];
for (let i = 0; i < 100; i++) {
  const id = uuidv4();
  const name = 'DmRoom' + id;
  const status = 'PUBLIC' as ChatRoomStatus;
  chatRooms.push({
    id,
    name,
    status,
    password: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

const chatRoomUsers: ChatRoomUser[] = [];
for (let i = 0; i < 100; i++) {
  const chatRoomId = chatRooms[i].id;
  const userId = idMap.get('dummy' + i.toString());
  const status = 'ADMIN';
  if (userId !== undefined) {
    chatRoomUsers.push({
      chatRoomId,
      userId,
      status,
      statusUntil: null,
    });
  }
}
for (let i = 2; i < 100; i++) {
  const chatRoomId = chatRooms[1].id;
  const userId = idMap.get('dummy' + i.toString());
  const status = 'NORMAL';
  if (userId !== undefined) {
    chatRoomUsers.push({
      chatRoomId,
      userId,
      status,
      statusUntil: null,
    });
  }
}

const chatMessages: ChatMessage[] = [];
for (let i = 0; i < 1; i++) {
  const id = uuidv4();
  const content = 'Hello' + id;
  const chatRoomId = chatRooms[i].id;
  const senderId = idMap.get('dummy1');
  if (senderId !== undefined) {
    chatMessages.push({
      id,
      content,
      chatRoomId,
      senderId,
      createdAt: new Date(),
    });
  }
}

const dmRooms: DmRoom[] = [];
for (let i = 0; i < 1; i++) {
  const id = uuidv4();
  dmRooms.push({
    id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

const dmRoomUsers: DmRoomUser[] = [];
for (let i = 0; i < 1; i++) {
  const dmRoomId = dmRooms[i].id;
  const userId = idMap.get('dummy1');
  if (userId !== undefined) {
    dmRoomUsers.push({
      dmRoomId,
      userId,
    });
  }
  const userId2 = idMap.get('dummy2');
  if (userId2 !== undefined) {
    dmRoomUsers.push({
      dmRoomId,
      userId: userId2,
    });
  }
}

const dms: Dm[] = [];
for (let i = 0; i < 1; i++) {
  const id = uuidv4();
  const content = 'Hello' + id;
  const dmRoomId = dmRooms[i].id;
  const senderId = idMap.get('dummy1');
  if (senderId !== undefined) {
    dms.push({
      id,
      content,
      dmRoomId,
      senderId,
      createdAt: new Date(),
    });
  }
}

const GAMEWINSCORE = 5;
const getLoserScore = () => {
  return Math.floor(Math.random() * (GAMEWINSCORE - 1));
};

const matchScoreData: Array<[number, number]> = [];
for (let i = 0; i < 30; i++) {
  const matchScore: [number, number] =
    Math.random() > 0.5
      ? [GAMEWINSCORE, getLoserScore()]
      : [getLoserScore(), GAMEWINSCORE];
  matchScoreData.push(matchScore);
}

const matchResultData: MatchResult[] = [];
for (let i = 0; i < 30; i++) {
  const playerOneId = idMap.get('dummy1');
  const playerTwoId = idMap.get('dummy' + (i + 1).toString());
  if (playerOneId !== undefined && playerTwoId !== undefined) {
    matchResultData.push({
      id: uuidv4(),
      playerOneId,
      playerTwoId,
      playerOneScore: matchScoreData[i][0],
      playerTwoScore: matchScoreData[i][1],
      startedAt: new Date(),
      finishedAt: new Date(),
    });
  }
}

for (let i = 0; i < 30; i++) {
  const playerOneId = idMap.get('dummy' + (i + 1).toString());
  const playerTwoId = idMap.get('dummy' + (i + 2).toString());
  if (playerOneId !== undefined && playerTwoId !== undefined) {
    matchResultData.push({
      id: uuidv4(),
      playerOneId,
      playerTwoId,
      playerOneScore: matchScoreData[i][0],
      playerTwoScore: matchScoreData[i][1],
      startedAt: new Date(),
      finishedAt: new Date(),
    });
  }
}

const main = async () => {
  console.log(`Start seeding ...`);

  await prisma.user.createMany({
    data: userData,
  });
  await prisma.friendRequest.createMany({
    data: friendRequestData,
  });
  await prisma.block.createMany({
    data: blockData,
  });
  await prisma.chatRoom.createMany({
    data: chatRooms,
  });
  await prisma.chatRoomUser.createMany({
    data: chatRoomUsers,
  });
  await prisma.chatMessage.createMany({
    data: chatMessages,
  });
  await prisma.dmRoom.createMany({
    data: dmRooms,
  });
  await prisma.dmRoomUser.createMany({
    data: dmRoomUsers,
  });
  await prisma.dm.createMany({
    data: dms,
  });
  await prisma.matchResult.createMany({
    data: matchResultData,
  });

  console.log(`Seeding finished.`);
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
