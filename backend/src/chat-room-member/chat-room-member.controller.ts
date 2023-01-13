import * as NestJs from '@nestjs/common';
import * as Sw from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtOtpAuthGuard } from 'src/auth/guards/jwt-otp-auth.guard';
import { ResponseChatRoomMember } from './chat-room-member.interface';
import { ChatRoomMemberService } from './chat-room-member.service';
import { CreateChatRoomMemberDto } from './dto/create-chat-room-member.dto';

@NestJs.Controller('chat/rooms/:chatRoomId/members')
@Sw.ApiTags('chat-room-user')
@NestJs.UseGuards(JwtOtpAuthGuard)
export class ChatRoomMemberController {
  constructor(private readonly chatRoomMemberService: ChatRoomMemberService) {}

  @NestJs.Post()
  async create(
    @NestJs.Param('chatRoomId', new NestJs.ParseUUIDPipe()) chatRoomId: string,
    @NestJs.Body() createChatRoomMemberDto: CreateChatRoomMemberDto,
    @GetUser() user: User
  ): Promise<void> {
    await this.chatRoomMemberService.createOrFind(
      chatRoomId,
      createChatRoomMemberDto,
      user.id
    );
  }

  @NestJs.Get()
  async findAll(
    @NestJs.Param('chatRoomId', new NestJs.ParseUUIDPipe()) chatRoomId: string,
    @GetUser() user: User
  ): Promise<ResponseChatRoomMember[]> {
    return await this.chatRoomMemberService.findAll(chatRoomId, user.id);
  }

  // me
  @NestJs.Get('me')
  async findMe(
    @NestJs.Param('chatRoomId', new NestJs.ParseUUIDPipe()) chatRoomId: string,
    @GetUser() user: User
  ): Promise<ResponseChatRoomMember> {
    return await this.chatRoomMemberService.findOne(chatRoomId, user.id);
  }

  // 退出
  @NestJs.Delete('me')
  async removeMe(
    @NestJs.Param('chatRoomId', new NestJs.ParseUUIDPipe()) chatRoomId: string,
    @GetUser() user: User
  ): Promise<void> {
    await this.chatRoomMemberService.remove(chatRoomId, user.id);
  }
}
