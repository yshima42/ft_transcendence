import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ChatRoomStatus } from '@prisma/client';
import { useChatRoomProtectSetting } from 'features/chat/hooks/useChatRoomProtectSetting';
import * as ReactHookForm from 'react-hook-form';

type Props = {
  roomStatus: ChatRoomStatus;
  chatRoomId: string;
  chatName: string;
};

type Inputs = {
  password: string;
  chatRoomId: string;
  chatName: string;
};

export const SecurityAccordionItem: React.FC<Props> = React.memo(
  ({ roomStatus, chatRoomId, chatName }) => {
    const { protectChatRoom, publicChatRoom } = useChatRoomProtectSetting();
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = ReactHookForm.useForm<Inputs>();

    return (
      <>
        {/*
        PROTECTEDのとき パスワードの解除
        PUBLICのとき パスワード
        */}
        {roomStatus === ChatRoomStatus.PROTECTED && (
          <C.Flex>
            <C.Text mr={5}>Password</C.Text>
            <C.Spacer />
            <C.Flex>
              <form onSubmit={handleSubmit(publicChatRoom)}>
                <C.Input
                  type="hidden"
                  value={chatRoomId}
                  {...register('chatRoomId')}
                />
                <C.Input
                  type="hidden"
                  value={chatName}
                  {...register('chatName')}
                />
                <C.Button type="submit" colorScheme="blue" mr={5}>
                  Unlock
                </C.Button>
              </form>
            </C.Flex>
          </C.Flex>
        )}
        {roomStatus === ChatRoomStatus.PUBLIC && (
          <C.Flex>
            <C.Text mr={5}>Password</C.Text>
            <C.Spacer />
            <C.Flex>
              <form onSubmit={handleSubmit(protectChatRoom)}>
                <C.Input
                  type="password"
                  placeholder="Password"
                  {...register('password', {
                    required: 'password is required',
                    minLength: {
                      value: 8,
                      message: 'password is at least 8 characters',
                    },
                    maxLength: {
                      value: 128,
                      message: 'password is at most 128 characters',
                    },
                  })}
                />
                <C.Input
                  type="hidden"
                  value={chatRoomId}
                  {...register('chatRoomId')}
                />
                <C.Input
                  type="hidden"
                  value={chatName}
                  {...register('chatName')}
                />
                {errors.password != null && (
                  <C.Text color="red.500">{errors.password.message}</C.Text>
                )}
                <C.Button type="submit" colorScheme="blue" mr={5}>
                  Lock
                </C.Button>
              </form>
            </C.Flex>
          </C.Flex>
        )}
      </>
    );
  }
);
