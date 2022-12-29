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
} from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

/**
 * 100個のuuidをMapで作成。
 * key  : dummy0~99
 * value: uuid
 */
const idMap = new Map<string, string>();
for (let i = 0; i < 100; i++) {
  idMap.set('dummy' + i.toString(), uuidv4());
}

const onlineStatus = ['ONLINE', 'OFFLINE', 'INGAME'] as const;
const FriendRequestStatus = ['PENDING', 'ACCEPTED'] as const;

const getOnlineStatus = () => {
  const randomIndex = Math.floor(Math.random() * onlineStatus.length);

  return onlineStatus[randomIndex];
};

const getFriendRequestStatus = () => {
  const randomIndex = Math.floor(Math.random() * FriendRequestStatus.length);

  return FriendRequestStatus[randomIndex];
};

/**
 * idMapを使って、100件のuserを作成。
 */
const userData: User[] = [];
idMap.forEach((value, key) => {
  userData.push({
    id: value,
    name: key,
    avatarImageUrl:
      'https://placehold.jp/2b52ee/ffffff/150x150.png?text=' + key,
    nickname: 'nickname' + key,
    onlineStatus: getOnlineStatus(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
});

/**
 * dummy1がcreatorとなって、dummy2~29まで
 * friend requestを作成する。ACCEPTED, PENDINGのいずれか。
 */
const friendRequestData: FriendRequest[] = [];
for (let i = 2; i < 30; i++) {
  const creatorId = idMap.get('dummy1');
  const receiverId = idMap.get('dummy' + i.toString());
  if (
    creatorId !== undefined &&
    receiverId !== undefined &&
    creatorId !== receiverId
  ) {
    friendRequestData.push({
      creatorId,
      receiverId,
      status: getFriendRequestStatus(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

/**
 * dummy40~59がcreatorとなって、dummy1に
 * friend requestを作成する。ACCEPTED or PENDING。
 */
for (let i = 40; i < 60; i++) {
  const creatorId = idMap.get('dummy' + i.toString());
  const receiverId = idMap.get('dummy1');
  if (
    creatorId !== undefined &&
    receiverId !== undefined &&
    creatorId !== receiverId
  ) {
    friendRequestData.push({
      creatorId,
      receiverId,
      status: getFriendRequestStatus(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

/**
 * dummy(i = 2, i < 30)がcreatorとなって、dummy(i + 1)に
 * friend requestを作成する。PENDING固定。
 */
for (let i = 2; i < 30; i++) {
  const creatorId = idMap.get('dummy' + i.toString());
  const receiverId = idMap.get('dummy' + (i + 1).toString());
  if (
    creatorId !== undefined &&
    receiverId !== undefined &&
    creatorId !== receiverId
  ) {
    friendRequestData.push({
      creatorId,
      receiverId,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

/**
 * dummy1がdummy2~29をBlockする。
 */
const blockData: Block[] = [];
for (let i = 2; i < 30; i++) {
  const sourceId = idMap.get('dummy1');
  const targetId = idMap.get('dummy' + i.toString());
  if (
    targetId !== undefined &&
    sourceId !== undefined &&
    targetId !== sourceId
  ) {
    blockData.push({
      targetId,
      sourceId,
    });
  }
}

const chatRooms: ChatRoom[] = [];
for (let i = 0; i < 1; i++) {
  const id = uuidv4();
  const name = 'DmRoom' + id;
  chatRooms.push({
    id,
    name,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

const chatRoomUsers: ChatRoomUser[] = [];
for (let i = 0; i < 1; i++) {
  const chatRoomId = chatRooms[i].id;
  const userId = idMap.get('dummy1');
  const status = 'OWNER';
  if (userId !== undefined) {
    chatRoomUsers.push({
      chatRoomId,
      userId,
      status,
    });
  }
  const userId2 = idMap.get('dummy2');
  const status2 = 'OWNER';
  if (userId2 !== undefined) {
    chatRoomUsers.push({
      chatRoomId,
      userId: userId2,
      status: status2,
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
    const date = new Date();
    date.setMinutes(date.getMinutes() + i);
    matchResultData.push({
      id: uuidv4(),
      playerOneId,
      playerTwoId,
      playerOneScore: matchScoreData[i][0],
      playerTwoScore: matchScoreData[i][1],
      finishedAt: date,
    });
  }
}

for (let i = 0; i < 30; i++) {
  const playerOneId = idMap.get('dummy' + (i + 1).toString());
  const playerTwoId = idMap.get('dummy' + (i + 2).toString());
  if (playerOneId !== undefined && playerTwoId !== undefined) {
    const date = new Date();
    date.setMinutes(date.getMinutes() + i);
    matchResultData.push({
      id: uuidv4(),
      playerOneId,
      playerTwoId,
      playerOneScore: matchScoreData[i][0],
      playerTwoScore: matchScoreData[i][1],
      finishedAt: date,
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
