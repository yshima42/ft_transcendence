import { ChatUserStatus } from '@prisma/client';
import * as CV from 'class-validator';

// model ChatRoom {
//   id           String        @id @default(uuid())
//   name         String        @unique
//   createdAt    DateTime      @default(now())
//   updatedAt    DateTime      @updatedAt
//   chatMessages ChatMessage[] // チャットルームに属するメッセージ
//   chatUsers    ChatUser[] // チャットルームに属するユーザー
// }
export class CreateChatRoomDto {
  @CV.IsNotEmpty()
  @CV.IsString()
  name!: string;
}

// model ChatMessage {
//   id         String   @id @default(uuid())
//   content    String
//   createdAt  DateTime @default(now())
//   chatRoom   ChatRoom @relation(fields: [chatRoomId], references: [id]) // 属するチャットルーム
//   chatRoomId String
//   sender     User     @relation("messageSender", fields: [senderId], references: [id]) // メッセージに属するユーザー
//   senderId   String
// }
export class CreateMessageDto {
  @CV.IsNotEmpty()
  @CV.IsString()
  content!: string;

  @CV.IsNotEmpty()
  @CV.IsUUID()
  chatRoomId!: string;

  @CV.IsNotEmpty()
  @CV.IsUUID()
  senderId!: string;
}

// model ChatUser {
//   chatRoom   ChatRoom       @relation(fields: [chatRoomId], references: [id]) // 参加しているチャットルーム
//   chatRoomId String
//   user       User           @relation(fields: [userId], references: [id]) // チャットの参加者
//   userId     String
//   status     ChatUserStatus // チャットの参加者のステータス

//   @@id([chatRoomId, userId])
// }
export class CreateChatUserDto {
  @CV.IsNotEmpty()
  @CV.IsUUID()
  chatRoomId!: string;

  @CV.IsNotEmpty()
  @CV.IsUUID()
  userId!: string;

  @CV.IsNotEmpty()
  @CV.IsEnum(ChatUserStatus)
  status!: ChatUserStatus;
}
