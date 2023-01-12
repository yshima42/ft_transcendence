import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ChatRoom, ChatRoomStatus } from '@prisma/client';
import { useChatRoomProtectSetting } from 'features/chat/hooks/useChatRoomProtectSetting';
import { useGetApiOmitUndefined } from 'hooks/api/generics/useGetApi';
import * as ReactHookForm from 'react-hook-form';

type Inputs = {
  password: string;
};

export const ChangeChatRoomStatusButtons: React.FC<{
  chatRoomId: string;
}> = React.memo(({ chatRoomId }) => {
  const chatRoomInfoEndpoint = `/chat/rooms/${chatRoomId}`;
  const { data: chatRoom } =
    useGetApiOmitUndefined<ChatRoom>(chatRoomInfoEndpoint);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = ReactHookForm.useForm<Inputs>();
  const {
    changeChatRoomStatusProtect,
    changeChatRoomStatusPublic,
    changeChatRoomStatusPrivate,
  } = useChatRoomProtectSetting(chatRoomId);

  return (
    <>
      <C.Button
        colorScheme="blue"
        onClick={changeChatRoomStatusPublic}
        isDisabled={chatRoom.roomStatus === ChatRoomStatus.PUBLIC}
      >
        Public
      </C.Button>
      <C.Button
        colorScheme="blue"
        onClick={changeChatRoomStatusPrivate}
        isDisabled={chatRoom.roomStatus === ChatRoomStatus.PRIVATE}
      >
        Private
      </C.Button>
      <C.Popover>
        <C.PopoverTrigger>
          <C.Button
            colorScheme="blue"
            isDisabled={chatRoom.roomStatus === ChatRoomStatus.PROTECTED}
          >
            Protect
          </C.Button>
        </C.PopoverTrigger>
        <C.PopoverContent>
          <C.PopoverArrow />
          <C.PopoverCloseButton />
          <C.PopoverHeader>Protect</C.PopoverHeader>
          <C.PopoverBody>
            <C.Text>Set a password</C.Text>
            <form
              onSubmit={handleSubmit(async (data) =>
                await changeChatRoomStatusProtect(data)
              )}
            >
              <C.Input
                type="password"
                placeholder="Password"
                {...register('password', {
                  required: 'password is required',
                  minLength: {
                    value: 8,
                    message: 'password is too short (min 8 characters)',
                  },
                  maxLength: {
                    value: 128,
                    message: 'password is too long (max 128 characters)',
                  },
                })}
              />
              {errors.password != null && (
                <C.Text color="red.500">{errors.password.message}</C.Text>
              )}
              <C.Button type="submit" colorScheme="blue" mr={5}>
                Protect
              </C.Button>
            </form>
          </C.PopoverBody>
        </C.PopoverContent>
      </C.Popover>
    </>
  );
});
