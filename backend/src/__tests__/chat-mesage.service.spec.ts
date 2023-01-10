// import * as NestJs from '@nestjs/common';
import * as Test from '@nestjs/testing';
import * as Type from '@prisma/client';
import { ResponseChatMessage } from 'src/chat-message/chat-message.interface';
import { ChatMessageModule } from 'src/chat-message/chat-message.module';
import { ChatMessageService } from 'src/chat-message/chat-message.service';
import { ChatRoomMemberModule } from 'src/chat-room-member/chat-room-member.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

let gChatMessageService: ChatMessageService;
let gModule: Test.TestingModule;
let gPrisma: PrismaService;
let gTestUsers: Type.User[];
let gTestChatRoom: Type.ChatRoom;
let gChatMessages: ResponseChatMessage[];

// userを5人作る関数
const createTestUsers = async () => {
  const testUsers: Type.User[] = [];
  for (let i = 0; i < 5; i++) {
    const name = `${`00${i}`.slice(-3)}`;
    const user = await gPrisma.user.create({
      data: {
        // 001, 002, 003, ... という名前になる
        name: `${name}`,
        avatarImageUrl: `test avatarImageUrl ${name}`,
        nickname: `test nickname ${name}`,
        onlineStatus: Type.OnlineStatus.ONLINE,
      },
    });
    testUsers.push(user);
  }

  return testUsers;
};

// chatRoomを作る関数
const createTestChatRoom = async (testUsers: Type.User[]) => {
  const testChatRoom = await gPrisma.chatRoom.create({
    data: {
      name: 'test chat room',
      roomStatus: Type.ChatRoomStatus.PUBLIC,
      chatRoomMembers: {
        create: testUsers.map((user) => ({
          userId: user.id,
        })),
      },
    },
  });

  return testChatRoom;
};

// testUsersがそれぞれメッセージを送る関数
const createTestChatMessages = async (
  testUsers: Type.User[],
  testChatRoom: Type.ChatRoom
) => {
  const testChatMessages: Type.ChatMessage[] = [];
  for (let i = 0; i < testUsers.length; i++) {
    const testChatMessage = await gPrisma.chatMessage.create({
      data: {
        content: `${i} from ${testUsers[i].name}`,
        chatRoomId: testChatRoom.id,
        senderId: testUsers[i].id,
      },
    });
    testChatMessages.push(testChatMessage);
  }

  return testChatMessages;
};

const findAllNotBlockedByTestUser = async (userId: number) => {
  return await gChatMessageService.findAllNotBlocked(
    gTestChatRoom.id,
    gTestUsers[userId].id
  );
};

// block
async function block(sourceId: number, targetId: number) {
  await gPrisma.block.create({
    data: {
      sourceId: gTestUsers[sourceId].id,
      targetId: gTestUsers[targetId].id,
    },
  });
}
// dbの初期化
async function initDb() {
  await gPrisma.chatRoom.deleteMany();
  await gPrisma.chatMessage.deleteMany();
  await gPrisma.chatRoomMember.deleteMany();
  await gPrisma.user.deleteMany();
}

describe('ChatMessageService', () => {
  beforeAll(async () => {
    gModule = await Test.Test.createTestingModule({
      imports: [PrismaModule, ChatMessageModule, ChatRoomMemberModule],
      providers: [ChatMessageService],
    }).compile();

    gChatMessageService = gModule.get<ChatMessageService>(ChatMessageService);
    gPrisma = gModule.get<PrismaService>(PrismaService);

    // dbの初期化
    await initDb();
  });

  // 各テストの前に実行される
  beforeEach(async () => {
    // db
    await initDb();
    gTestUsers = await createTestUsers();
    gTestChatRoom = await createTestChatRoom(gTestUsers);
    await createTestChatMessages(gTestUsers, gTestChatRoom);
  });

  test('should be defined', () => {
    expect(gChatMessageService).toBeDefined();
  });

  test('findAllNotBlocked normal', async () => {
    gChatMessages = await findAllNotBlockedByTestUser(0);
    // ブロックしていないので、全てのメッセージが取得できる
    // 5個のメッセージが取得できる
    expect(gChatMessages).toHaveLength(5);

    // contentが一致している
    for (let i = 0; i < gChatMessages.length; i++) {
      expect(gChatMessages[i].content).toBe(`${i} from ${gTestUsers[i].name}`);
    }
  });

  test('findAllNotBlocked testUsers[0]がtestUsers[1]をブロック', async () => {
    // testUsers[0]がtestUsers[1]をブロックする
    await block(0, 1);
    gChatMessages = await findAllNotBlockedByTestUser(0);
    // ブロックしているので、ブロックしている相手のメッセージは取得できない
    // 4個のメッセージが取得できる
    expect(gChatMessages).toHaveLength(4);
    // testUsers[1]のメッセージは取得できない
    expect(
      gChatMessages.find(
        (chatMessage) => chatMessage.sender.id === gTestUsers[1].id
      )
    ).toBeUndefined();

    // ブロックされていても、TestUser1は関係なくすべてのメッセージを取得できる
    gChatMessages = await findAllNotBlockedByTestUser(1);
    expect(gChatMessages).toHaveLength(5);

    // TestUser0とTestUser1のブロック関係はTestUser2に影響を与えない
    gChatMessages = await findAllNotBlockedByTestUser(2);
    expect(gChatMessages).toHaveLength(5);
  });
});
