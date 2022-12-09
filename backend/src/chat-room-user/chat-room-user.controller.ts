import {
  Controller,
  Get,
  // Post,
  // Body,
  // Patch,
  Param,
  // Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
// import { CreateChatRoomUserDto } from './dto/create-chat-room-user.dto';
// import { UpdateChatRoomUserDto } from './dto/update-chat-room-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResponseChatRoomUser } from './chat-room-user.interface';
import { ChatRoomUserService } from './chat-room-user.service';

@Controller('chat/:chatRoomId/user')
export class ChatRoomUserController {
  constructor(private readonly chatRoomUserService: ChatRoomUserService) {}

  // @Post()
  // @UseGuards(JwtAuthGuard)
  // create(@Body() createChatRoomUserDto: CreateChatRoomUserDto) {
  //   return this.chatRoomUserService.create(createChatRoomUserDto);
  // }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Param('chatRoomId', new ParseUUIDPipe()) chatRoomId: string
  ): Promise<ResponseChatRoomUser[]> {
    return await this.chatRoomUserService.findAll(chatRoomId);
  }

  // @Get(':id')
  // @UseGuards(JwtAuthGuard)
  // findOne(@Param('id') id: string) {
  //   return this.chatRoomUserService.findOne(+id);
  // }

  // @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  // update(
  //   @Param('id') id: string,
  //   @Body() updateChatRoomUserDto: UpdateChatRoomUserDto
  // ) {
  //   return this.chatRoomUserService.update(+id, updateChatRoomUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.chatRoomUserService.remove(+id);
  // }
}
