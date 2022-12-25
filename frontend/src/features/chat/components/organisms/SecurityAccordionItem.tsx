import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ChatRoomStatus } from '@prisma/client';
import { useChatRoomProtectSetting } from 'features/chat/hooks/useChatRoomProtectSetting';
import * as ReactHookForm from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

type Props = {
  roomStatus: ChatRoomStatus;
  chatRoomId: string;
  chatName: string;
  navigate: ReturnType<typeof useNavigate>;
};

type Inputs = {
  password: string;
  chatRoomId: string;
  chatName: string;
};

export const SecurityAccordionItem: React.FC<Props> = React.memo(
  ({ roomStatus, chatRoomId, chatName, navigate }) => {
    const { protectChatRoom, publicChatRoom } =
      useChatRoomProtectSetting(navigate);
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
                    required: 'パスワードを入力してください',
                    minLength: {
                      value: 8,
                      message: 'パスワードは8文字以上で入力してください',
                    },
                    maxLength: {
                      value: 128,
                      message: 'パスワードは128文字以下で入力してください',
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
                  <C.FormErrorMessage>
                    {errors.password.message}
                  </C.FormErrorMessage>
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
