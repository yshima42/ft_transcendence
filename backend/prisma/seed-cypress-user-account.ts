import {
  Block,
  FriendRequest,
  PrismaClient,
  User,
  MatchResult,
  OneTimePasswordAuth,
} from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

/**
 * 50 + 3個のuuidをMapで作成。
 * key  :
 *        dummy1~3
 *        dummy-friends1~10
 *        dummy-pending1~10
 *        dummy-recognition1~10
 *        dummy-blocked1~10
 *        dummy-add-friend1~10
 * value: uuid
 */
const idMap = new Map<string, string>();
for (let i = 1; i <= 3; i++) {
  idMap.set('dummy' + i.toString(), uuidv4());
}
for (let i = 1; i <= 10; i++) {
  idMap.set('dummy-friends' + i.toString(), uuidv4());
  idMap.set('dummy-pending' + i.toString(), uuidv4());
  idMap.set('dummy-recognition' + i.toString(), uuidv4());
  idMap.set('dummy-blocked' + i.toString(), uuidv4());
  idMap.set('dummy-add-friend' + i.toString(), uuidv4());
}

const onlineStatus = ['ONLINE', 'OFFLINE', 'INGAME'] as const;

const getOnlineStatus = () => {
  const randomIndex = Math.floor(Math.random() * onlineStatus.length);

  return onlineStatus[randomIndex];
};

const getColorCode = (name: string) => {
  let colorCode = '0C163D';
  if (name.match(/friends/) != null) {
    colorCode = 'E26B00';
  } else if (name.match(/blocked/) != null) {
    colorCode = 'F4C500';
  }

  return colorCode;
};

/**
 * idMapを使って、50 + 3件のuserを作成。
 */
const userData: User[] = [];
idMap.forEach((value, key) => {
  const colorCode = getColorCode(key);
  userData.push({
    id: value,
    name: key,
    avatarImageUrl:
      `https://placehold.jp/${colorCode}/fffffe/150x150.png?text=` + key,
    nickname: 'nick-' + key,
    onlineStatus: getOnlineStatus(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
});

/**
 * user全員のotpAuthのレコードを作成。
 */
const otpAuthData: OneTimePasswordAuth[] = [];
userData.forEach((value) => {
  otpAuthData.push({
    authUserId: value.id,
    isEnabled: false,
    qrcodeUrl: null,
    secret: null,
    createdAt: new Date(),
  });
});

/**
 * dummy1がcreatorとなって、dummy2, 3 とフレンドになる。
 * (オンラインステータス確認のため)
 */
const friendRequestData: FriendRequest[] = [];
const creatorId = idMap.get('dummy1');
for (let i = 2; i < 4; i++) {
  const receiverId = idMap.get('dummy' + i.toString());
  if (creatorId !== undefined && receiverId !== undefined) {
    friendRequestData.push({
      creatorId,
      receiverId,
      status: 'ACCEPTED',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

/**
 * dummy1がcreatorとなって、dummy-pending1~10に
 * friend requestを作成する。ステータスはPENDING
 */
for (let i = 1; i <= 10; i++) {
  const creatorId = idMap.get('dummy1');
  const receiverId = idMap.get('dummy-pending' + i.toString());
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

/**
 * dummy1がcreatorとなって、dummy-friends1~5に
 * friend requestを作成する。ステータスはACCEPTED
 */
for (let i = 1; i <= 5; i++) {
  const creatorId = idMap.get('dummy1');
  const receiverId = idMap.get('dummy-friends' + i.toString());
  if (creatorId !== undefined && receiverId !== undefined) {
    friendRequestData.push({
      creatorId,
      receiverId,
      status: 'ACCEPTED',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

/**
 * dummy-friends6~10がcreatorとなって、dummy1に
 * friend requestを作成する。ステータスはACCEPTED
 */
for (let i = 6; i <= 10; i++) {
  const creatorId = idMap.get('dummy-friends' + i.toString());
  const receiverId = idMap.get('dummy1');
  if (creatorId !== undefined && receiverId !== undefined) {
    friendRequestData.push({
      creatorId,
      receiverId,
      status: 'ACCEPTED',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

/**
 * dummy-recognition1~10がcreatorとなって、dummy1に
 * friend requestを作成する。ステータスはPENDING
 */
for (let i = 1; i <= 10; i++) {
  const creatorId = idMap.get('dummy-recognition' + i.toString());
  const receiverId = idMap.get('dummy1');
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

/**
 * dummy1がdummy-blocked1~10をBlockする。
 */
const blockData: Block[] = [];
for (let i = 1; i < 10; i++) {
  const sourceId = idMap.get('dummy1');
  const targetId = idMap.get('dummy-blocked' + i.toString());
  if (targetId !== undefined && sourceId !== undefined) {
    blockData.push({
      targetId,
      sourceId,
    });
  }
}

const GAMEWINSCORE = 5;
const getLoserScore = () => {
  return Math.floor(Math.random() * (GAMEWINSCORE - 1));
};

const matchScoreData: Array<[number, number]> = [];
for (let i = 0; i < userData.length; i++) {
  const matchScore: [number, number] =
    Math.random() > 0.5
      ? [GAMEWINSCORE, getLoserScore()]
      : [getLoserScore(), GAMEWINSCORE];
  matchScoreData.push(matchScore);
}

const matchResultData: MatchResult[] = [];

/**
 * dummy1が自分以外のユーザー全員と1回ずつ対戦する。
 */
for (let i = 0; i < userData.length; i++) {
  const playerOneId = idMap.get('dummy1');
  const playerTwoId = userData[i].id;
  if (
    playerOneId !== undefined &&
    playerTwoId !== undefined &&
    playerOneId !== playerTwoId
  ) {
    const date = new Date();
    date.setDate(date.getDate() - 1);
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

/**
 * ユーザー全員が2回ずつ対戦する。
 */
for (let i = 0; i < userData.length - 1; i++) {
  const playerOneId = userData[i].id;
  const playerTwoId = userData[i + 1].id;
  if (playerOneId !== undefined && playerTwoId !== undefined) {
    const date = new Date();
    date.setDate(date.getDate() - 1);
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

  const userCount = await prisma.user.count();
  if (userCount > 0) {
    console.log(`Data exists. Delete all data ...`);
    await prisma.oneTimePasswordAuth.deleteMany({});
    await prisma.friendRequest.deleteMany({});
    await prisma.block.deleteMany({});
    await prisma.matchResult.deleteMany({});
    await prisma.user.deleteMany({});
  }

  await prisma.user.createMany({
    data: userData,
  });
  await prisma.oneTimePasswordAuth.createMany({
    data: otpAuthData,
  });
  await prisma.friendRequest.createMany({
    data: friendRequestData,
  });
  await prisma.block.createMany({
    data: blockData,
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
