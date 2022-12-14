import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import * as Sw from '@nestjs/swagger';
import { ChatRoom, User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtOtpAuthGuard } from 'src/auth/guards/jwt-otp-auth.guard';
import { ResponseChatRoom } from './chat-room.interface';
import { ChatRoomService } from './chat-room.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';

@Controller('chat/rooms')
@Sw.ApiTags('chat-room')
@UseGuards(JwtOtpAuthGuard)
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @Post()
  async create(
    @Body() createChatroomDto: CreateChatRoomDto,
    @GetUser() user: User
  ): Promise<Omit<ChatRoom, 'password'>> {
    const res = await this.chatRoomService.create(createChatroomDto, user.id);
    // omit password
    const { password, ...rest } = res;
    void password; // 使わないとエラーでるのでvoidキャスト的な

    return rest;
  }

  // 自分が入っていないチャット全部
  @Get()
  async findJoinableRooms(@GetUser() user: User): Promise<ResponseChatRoom[]> {
    return await this.chatRoomService.findJoinableRooms(user.id);
  }

  // 自分が入っているチャット全部
  @Get('me')
  async findJoinedRooms(@GetUser() user: User): Promise<ResponseChatRoom[]> {
    return await this.chatRoomService.findJoinedRooms(user.id);
  }

  // chatRoomIdで検索
  @Get(':chatRoomId')
  async findOne(
    @Param('chatRoomId', new ParseUUIDPipe()) chatRoomId: string
  ): Promise<Omit<ChatRoom, 'password'>> {
    const res = await this.chatRoomService.findOne(chatRoomId);
    // omit password
    const { password, ...rest } = res;
    void password; // 使わないとエラーでるのでvoidキャスト的な

    return rest;
  }

  @Patch(':chatRoomId')
  async update(
    @Param('chatRoomId', new ParseUUIDPipe()) chatRoomId: string,
    @Body() updateChatRoomDto: UpdateChatRoomDto,
    @GetUser() user: User
  ): Promise<Omit<ChatRoom, 'password'>> {
    const res = await this.chatRoomService.update(
      chatRoomId,
      updateChatRoomDto,
      user.id
    );
    // omit password
    const { password, ...rest } = res;
    void password; // 使わないとエラーでるのでvoidキャスト的な

    return rest;
  }

  // delete
  @Delete(':chatRoomId')
  async remove(
    @Param('chatRoomId', new ParseUUIDPipe()) chatRoomId: string,
    @GetUser() user: User
  ): Promise<void> {
    await this.chatRoomService.remove(chatRoomId, user.id);
  }
}
