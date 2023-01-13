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
  const onSubmit = (data: ChatRoomCreateFormValues) => {
    // PROTECTEDではない場合は、passwordを削除する
    CreateChatRoom(
      chatRoomStatus === ChatRoomStatus.PROTECTED
        ? data
        : { ...data, password: undefined }
    );
  };
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChatRoomStatus(e.target.value as ChatRoomStatus);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
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
          {errors.name != null && (
            <C.Text color="red.500">{errors.name.message}</C.Text>
          )}
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
            {errors.password != null && (
              <C.Text color="red.500">{errors.password.message}</C.Text>
            )}{' '}
          </C.Box>
        )}
        <C.Button
          bg="teal.300"
          color="white"
          type="submit"
          isDisabled={isLoading}
        >
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
