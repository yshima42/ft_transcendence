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
  Logger,
} from '@nestjs/common';
import * as Sw from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtOtpAuthGuard } from 'src/auth/guards/jwt-otp-auth.guard';
import { ResponseChatRoomMember } from './chat-room-member.interface';
import { ChatRoomMemberService } from './chat-room-member.service';
import { CreateChatRoomMemberDto } from './dto/create-chat-room-member.dto';
import { UpdateChatRoomMemberDto } from './dto/update-chat-room-member.dto';

@Controller('chat/rooms/:chatRoomId/members')
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
    Logger.debug(
      `chat-room-member.controller create chatRoomId=${chatRoomId} createChatRoomMemberDto=${JSON.stringify(
        createChatRoomMemberDto
      )} user=${JSON.stringify(user)}`
    );
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
    Logger.debug(
      `chat-room-member.controller findAll chatRoomId=${chatRoomId}`
    );

    return await this.chatRoomMemberService.findAll(chatRoomId);
  }

  // me
  @Get('me')
  async findMe(
    @Param('chatRoomId', new ParseUUIDPipe()) chatRoomId: string,
    @GetUser() user: User
  ): Promise<ResponseChatRoomMember> {
    Logger.debug(
      `chat-room-member.controller findMe chatRoomId=${chatRoomId} user=${JSON.stringify(
        user
      )}`
    );

    return await this.chatRoomMemberService.findOne(chatRoomId, user.id);
  }

  @Patch(':memberId')
  async update(
    @Param('chatRoomId', new ParseUUIDPipe()) chatRoomId: string,
    @Param('memberId', new ParseUUIDPipe()) memberId: string,
    @Body() updateChatRoomMemberDto: UpdateChatRoomMemberDto,
    @GetUser() user: User
  ): Promise<void> {
    Logger.debug(
      `chat-room-member.controller update chatRoomId=${chatRoomId} memberId=${memberId} updateChatRoomMemberDto=${JSON.stringify(
        updateChatRoomMemberDto
      )} user=${JSON.stringify(user)}`
    );
    await this.chatRoomMemberService.update(
      chatRoomId,
      memberId,
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
    Logger.debug(
      `chat-room-member.controller removeMe chatRoomId=${chatRoomId} user=${JSON.stringify(
        user
      )}`
    );
    await this.chatRoomMemberService.remove(chatRoomId, user.id);
  }

  @Delete(':memberId')
  async remove(
    @Param('chatRoomId', new ParseUUIDPipe()) chatRoomId: string,
    @Param('memberId', new ParseUUIDPipe()) memberId: string
  ): Promise<void> {
    Logger.debug(
      `chat-room-member.controller remove chatRoomId=${chatRoomId} memberId=${memberId}`
    );
    await this.chatRoomMemberService.remove(chatRoomId, memberId);
  }
}
