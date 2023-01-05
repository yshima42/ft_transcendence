import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ChatRoomStatus } from '@prisma/client';
import { useChatRoomProtectSetting } from 'features/chat/hooks/useChatRoomProtectSetting';
import * as ReactHookForm from 'react-hook-form';

type Props = {
  roomStatus: ChatRoomStatus;
  chatRoomId: string;
};

type Inputs = {
  password: string;
};

export const SecurityAccordionItem: React.FC<Props> = React.memo(
  ({ roomStatus, chatRoomId }) => {
    const {
      changeChatRoomStatusProtect,
      changeChatRoomStatusPublic,
      changeChatRoomStatusPrivate,
    } = useChatRoomProtectSetting(chatRoomId);
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = ReactHookForm.useForm<Inputs>();

    return (
      <>
        <C.Button
          colorScheme="blue"
          onClick={changeChatRoomStatusPublic}
          isDisabled={roomStatus === ChatRoomStatus.PUBLIC}
        >
          Public
        </C.Button>
        <C.Button
          colorScheme="blue"
          onClick={changeChatRoomStatusPrivate}
          isDisabled={roomStatus === 'PRIVATE'}
        >
          Private
        </C.Button>
        <C.Popover>
          <C.PopoverTrigger>
            <C.Button
              colorScheme="blue"
              isDisabled={roomStatus === ChatRoomStatus.PROTECTED}
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
              <form onSubmit={handleSubmit(changeChatRoomStatusProtect)}>
                <C.Input
                  type="password"
                  placeholder="Password"
                  {...register('password', {
                    required: 'password is required',
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
  }
);
