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
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtOtpAuthGuard } from 'src/auth/guards/jwt-otp-auth.guard';
import { ResponseChatRoomMember } from './chat-room-member.interface';
import { ChatRoomMemberService } from './chat-room-member.service';
import { CreateChatRoomMemberDto } from './dto/create-chat-room-member.dto';
import { UpdateChatRoomMemberDto } from './dto/update-chat-room-member.dto';

@Controller('chat/rooms/:chatRoomId/users')
@Sw.ApiTags('chat-room-user')
@UseGuards(JwtOtpAuthGuard)
export class ChatRoomMemberController {
  constructor(private readonly chatRoomMemberService: ChatRoomMemberService) {}

  @Post()
  async create(
    @Param('chatRoomId', new ParseUUIDPipe()) chatRoomId: string,
    @Body() createChatRoomMemberDto: CreateChatRoomMemberDto,
    @GetUser() user: User
  ): Promise<void> {
    await this.chatRoomMemberService.create(
      chatRoomId,
      createChatRoomMemberDto,
      user.id
    );
  }

  @Get()
  async findAll(
    @Param('chatRoomId', new ParseUUIDPipe()) chatRoomId: string
  ): Promise<ResponseChatRoomMember[]> {
    return await this.chatRoomMemberService.findAll(chatRoomId);
  }

  // me
  @Get('me')
  async findMe(
    @Param('chatRoomId', new ParseUUIDPipe()) chatRoomId: string,
    @GetUser() user: User
  ): Promise<ResponseChatRoomMember> {
    return await this.chatRoomMemberService.findOne(chatRoomId, user.id);
  }

  @Patch(':userId')
  async update(
    @Param('chatRoomId', new ParseUUIDPipe()) chatRoomId: string,
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Body() updateChatRoomMemberDto: UpdateChatRoomMemberDto,
    @GetUser() user: User
  ): Promise<void> {
    await this.chatRoomMemberService.update(
      chatRoomId,
      userId,
      updateChatRoomMemberDto,
      user.id
    );
  }

  // 退出
  @Delete('me')
  async removeMe(
    @Param('chatRoomId', new ParseUUIDPipe()) chatRoomId: string,
    @GetUser() user: User
  ): Promise<void> {
    await this.chatRoomMemberService.remove(chatRoomId, user.id);
  }

  @Delete(':userId')
  async remove(
    @Param('chatRoomId', new ParseUUIDPipe()) chatRoomId: string,
    @Param('userId', new ParseUUIDPipe()) userId: string
  ): Promise<void> {
    await this.chatRoomMemberService.remove(chatRoomId, userId);
  }
}
