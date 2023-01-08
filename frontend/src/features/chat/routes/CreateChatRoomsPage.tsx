import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ChatRoomStatus } from '@prisma/client';
import {
  useCreateChatRoom,
  ChatRoomCreateFormValues,
} from 'features/chat/hooks/useCreateChatRoom';
import * as RHF from 'react-hook-form';
import { ContentLayout } from 'components/ecosystems/ContentLayout';

// チャットルームを作成するフォーム
// チャットルームの種類を選択できる
//  Public: パスワードなし default
//  Private: パスワードなし
//  Protected: パスワードあり
// Selectで選択した値によって、パスワードの入力欄を表示するかどうかを切り替える
// name: チャットルームの名前 50文字以内
// password: パスワード 8文字以上 128文字以内
const CreateChatRoomForm: React.FC = React.memo(() => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = RHF.useForm<ChatRoomCreateFormValues>();
  const { CreateChatRoom, isLoading } = useCreateChatRoom();
  const [chatRoomStatus, setChatRoomStatus] = React.useState<ChatRoomStatus>(
    ChatRoomStatus.PUBLIC
  );

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChatRoomStatus(e.target.value as ChatRoomStatus);
  };

  return (
    <>
      <form onSubmit={handleSubmit(CreateChatRoom)}>
        <C.Box>
          <C.Heading size="sm">Chat Room Status</C.Heading>
          <C.Select {...register('roomStatus')} onChange={onChange}>
            <option value={ChatRoomStatus.PUBLIC}>Public</option>
            <option value={ChatRoomStatus.PRIVATE}>Private</option>
            <option value={ChatRoomStatus.PROTECTED}>Protected</option>
          </C.Select>
        </C.Box>
        <C.Box>
          <C.Heading size="sm">Name</C.Heading>
          <C.Input
            type="text"
            placeholder="Name"
            {...register('name', {
              required: 'Required',
              maxLength: {
                value: 50,
                message: 'Max Length is 50',
              },
            })}
          />
          <C.FormErrorMessage>{errors.name?.message}</C.FormErrorMessage>
        </C.Box>
        {chatRoomStatus === ChatRoomStatus.PROTECTED && (
          <C.Box>
            <C.Heading size="sm">Password</C.Heading>
            <C.Input
              type="password"
              placeholder="Password"
              {...register('password', {
                required: 'Required',
                minLength: {
                  value: 8,
                  message: 'Min Length is 8',
                },
                maxLength: {
                  value: 128,
                  message: 'Max Length is 128',
                },
              })}
            />
            <C.FormErrorMessage>{errors.password?.message}</C.FormErrorMessage>
          </C.Box>
        )}
        <C.Button colorScheme="blue" type="submit" isDisabled={isLoading}>
          Create
        </C.Button>
      </form>
    </>
  );
});

// ボタンを押すと、作成したチャットルームに遷移する
export const CreateChatRoomsPage: React.FC = React.memo(() => {
  return (
    <>
      <ContentLayout title="Create Chat Room">
        <C.Heading>Create Chat Room</C.Heading>
        <CreateChatRoomForm />
      </ContentLayout>
    </>
  );
});
