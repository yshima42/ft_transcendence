import * as NestJs from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as T from '@prisma/client';
import { ChatRoomModule } from 'src/chat-room/chat-room.module';
import { ChatRoomService } from 'src/chat-room/chat-room.service';
import { CreateChatRoomDto } from 'src/chat-room/dto/create-chat-room.dto';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { ChatRoomMemberService } from './chat-room-member.service';
import { CreateChatRoomMemberDto } from './dto/create-chat-room-user.dto';

describe('ChatRoomMemberService', () => {
  let chatRoomMemberService: ChatRoomMemberService;
  let chatRoomService: ChatRoomService;
  let module: TestingModule;
  let prisma: PrismaService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [PrismaModule, ChatRoomModule],
      providers: [ChatRoomMemberService],
    }).compile();

    chatRoomMemberService = module.get<ChatRoomMemberService>(
      ChatRoomMemberService
    );
    chatRoomService = module.get<ChatRoomService>(ChatRoomService);
    prisma = module.get<PrismaService>(PrismaService);

    await prisma.chatRoom.deleteMany();
    await prisma.chatMessage.deleteMany();
    await prisma.chatRoomMember.deleteMany();
  });

  it('should be defined', () => {
    expect(chatRoomMemberService).toBeDefined();
  });

  it('create a chat room user', async () => {
    const testUsers: T.User[] = [];
    for (let i = 0; i < 10; i++) {
      const user = await prisma.user.create({
        data: {
          name: `test user ${uuidv4()}`,
          avatarImageUrl: `test avatarImageUrl ${uuidv4()}`,
          nickname: `test nickname ${uuidv4()}`,
          onlineStatus: T.OnlineStatus.ONLINE,
        },
      });
      testUsers.push(user);
    }
    const createChatRoomDto: CreateChatRoomDto = {
      name: `test ${uuidv4()}`,
    };
    const testChatRoom = await chatRoomService.create(
      createChatRoomDto,
      testUsers[0].id
    );

    // create a chat room protected by password
    const createChatRoomDto2: CreateChatRoomDto = {
      name: `test protected ${uuidv4()}`,
      password: 'password',
    };
    const testChatRoomProtected = await chatRoomService.create(
      createChatRoomDto2,
      testUsers[0].id
    );

    const createChatRoomMemberDto: CreateChatRoomMemberDto = {};
    {
      // 保護されていないチャットルームに対して、パスワードを入力しなかった場合通常通りに作成できる
      const chatRoomMember = await chatRoomMemberService.create(
        testChatRoom.id,
        createChatRoomMemberDto,
        testUsers[1].id
      );
      expect(chatRoomMember).toBeDefined();
    }
    {
      const chatRoomMember = await chatRoomMemberService.findOne(
        testChatRoom.id,
        testUsers[1].id
      );
      expect(chatRoomMember).toBeDefined();
    }
    {
      const chatRoomMembers = await chatRoomMemberService.findAll(
        testChatRoom.id
      );
      expect(chatRoomMembers).toBeDefined();
    }
    {
      // delete
      const chatRoomMember = await chatRoomMemberService.remove(
        testChatRoom.id,
        testUsers[1].id
      );
      expect(chatRoomMember).toBeDefined();
    }
    {
      // 保護されたチャットルームに対して、パスワードを入力しなかった場合 400
      const createChatRoomMemberDto: CreateChatRoomMemberDto = {};
      await expect(async () => {
        await chatRoomMemberService.create(
          testChatRoomProtected.id,
          createChatRoomMemberDto,
          testUsers[1].id
        );
      }).rejects.toThrow(
        new NestJs.HttpException(
          'Password is required',
          NestJs.HttpStatus.BAD_REQUEST
        )
      );
    }
    {
      // 保護されたチャットルームに対して、パスワードが一致しない場合 401
      const createChatRoomMemberDto: CreateChatRoomMemberDto = {
        chatRoomPassword: 'wrong password',
      };
      await expect(async () => {
        await chatRoomMemberService.create(
          testChatRoomProtected.id,
          createChatRoomMemberDto,
          testUsers[1].id
        );
      }).rejects.toThrow(
        new NestJs.HttpException(
          'Password is incorrect',
          NestJs.HttpStatus.UNAUTHORIZED
        )
      );
    }
    {
      // 保護されたチャットルームに対して、パスワードが一致する場合 作成できる
      const createChatRoomMemberDto: CreateChatRoomMemberDto = {
        chatRoomPassword: 'password',
      };
      const chatRoomMember = await chatRoomMemberService.create(
        testChatRoomProtected.id,
        createChatRoomMemberDto,
        testUsers[1].id
      );
      expect(chatRoomMember).toBeDefined();
      expect(chatRoomMember.chatRoomId).toBe(testChatRoomProtected.id);
      expect(chatRoomMember.userId).toBe(testUsers[1].id);
    }
  });

  it('update a chat room user', async () => {
    const testUsers = [];
    for (let i = 0; i < 10; i++) {
      const user = await prisma.user.create({
        data: {
          name: `test user ${uuidv4()}`,
          avatarImageUrl: `test avatarImageUrl ${uuidv4()}`,
          nickname: `test nickname ${uuidv4()}`,
          onlineStatus: T.OnlineStatus.ONLINE,
        },
      });
      testUsers.push(user);
    }
    const chatRoomPublic = await prisma.chatRoom.create({
      data: {
        name: 'chat room public',
        roomStatus: T.ChatRoomStatus.PUBLIC,
        password: null,
      },
    });
    const chatRoomPublicAdmin = await prisma.chatRoomMember.create({
      data: {
        chatRoomId: chatRoomPublic.id,
        userId: testUsers[0].id,
        memberStatus: T.ChatRoomMemberStatus.ADMIN,
      },
    });
    const chatRoomPublicModerator = await prisma.chatRoomMember.create({
      data: {
        chatRoomId: chatRoomPublic.id,
        userId: testUsers[1].id,
        memberStatus: T.ChatRoomMemberStatus.MODERATOR,
      },
    });
    const chatRoomPublicNormal1 = await prisma.chatRoomMember.create({
      data: {
        chatRoomId: chatRoomPublic.id,
        userId: testUsers[2].id,
        memberStatus: T.ChatRoomMemberStatus.NORMAL,
      },
    });
    const chatRoomPublicNormal2 = await prisma.chatRoomMember.create({
      data: {
        chatRoomId: chatRoomPublic.id,
        userId: testUsers[3].id,
        memberStatus: T.ChatRoomMemberStatus.NORMAL,
      },
    });
    // const chatRoomPublicBanned = await prisma.chatRoomMember.create({
    //   data: {
    //     chatRoomId: chatRoomPublic.id,
    //     userId: testUsers[4].id,
    //     memberStatus: T.ChatRoomMemberStatus.BANNED,
    //   },
    // });
    // const chatRoomPublicMuted = await prisma.chatRoomMember.create({
    //   data: {
    //     chatRoomId: chatRoomPublic.id,
    //     userId: testUsers[5].id,
    //     memberStatus: T.ChatRoomMemberStatus.MUTED,
    //   },
    // });
    // 一般ユーザーが一般ユーザーを更新できない
    await expect(async () => {
      await chatRoomMemberService.update(
        chatRoomPublic.id,
        chatRoomPublicNormal1.userId,
        { memberStatus: T.ChatRoomMemberStatus.MODERATOR },
        chatRoomPublicNormal2.userId
      );
    }).rejects.toThrow(
      new NestJs.HttpException('Permission denied', NestJs.HttpStatus.FORBIDDEN)
    );
    // モデレーターがADMINに更新できない
    await expect(async () => {
      await chatRoomMemberService.update(
        chatRoomPublic.id,
        chatRoomPublicAdmin.userId,
        { memberStatus: T.ChatRoomMemberStatus.ADMIN },
        chatRoomPublicModerator.userId
      );
    }).rejects.toThrow(
      new NestJs.HttpException('Permission denied', NestJs.HttpStatus.FORBIDDEN)
    );
    // モデレーターがMODERATORに更新できない
    await expect(async () => {
      await chatRoomMemberService.update(
        chatRoomPublic.id,
        chatRoomPublicModerator.userId,
        { memberStatus: T.ChatRoomMemberStatus.MODERATOR },
        chatRoomPublicModerator.userId
      );
    }).rejects.toThrow(
      new NestJs.HttpException('Permission denied', NestJs.HttpStatus.FORBIDDEN)
    );
  });
});
