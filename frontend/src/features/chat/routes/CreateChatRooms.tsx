import * as React from 'react';
import * as C from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  useCreateChatRoom,
  ChatRoomCreateFormValues,
} from 'hooks/api/chat/useCreateChatRoom';
import * as RHF from 'react-hook-form';
import * as yup from 'yup';
import { ContentLayout } from 'components/ecosystems/ContentLayout';

const schema = yup.object().shape(
  {
    name: yup.string().required('チャットルーム名を入力してください').max(50),
    password: yup
      .string()
      .optional()
      .when('password', {
        is: (value: string) => value?.length !== 0,
        then: (rule) => rule.max(255),
      }),
  },
  [['password', 'password']]
);

// ボタンを押すと、作成したチャットルームに遷移する
export const CreateChatRooms: React.FC = React.memo(() => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = RHF.useForm<ChatRoomCreateFormValues>({
    resolver: yupResolver(schema),
  });
  const { CreateChatRoom } = useCreateChatRoom();

  return (
    <>
      <ContentLayout title="Create Chat Room">
        <C.Box>
          <C.Heading>Create Chat Room</C.Heading>
          <form onSubmit={handleSubmit(CreateChatRoom)}>
            <C.FormControl isInvalid={!(errors.name == null)}>
              <C.FormLabel>チャットルーム名</C.FormLabel>
              <C.Input placeholder="チャットルーム名" {...register('name')} />
              <C.FormErrorMessage>{errors.name?.message}</C.FormErrorMessage>
            </C.FormControl>
            <C.FormControl isInvalid={!(errors.password == null)}>
              <C.FormLabel>パスワード</C.FormLabel>
              <C.Input
                placeholder="パスワード"
                {...register('password')}
                type="password"
              />
              <C.FormErrorMessage>
                {errors.password?.message}
              </C.FormErrorMessage>
            </C.FormControl>
            <C.Button type="submit" colorScheme="teal" mt={4}>
              チャットルームを作成
            </C.Button>
          </form>
        </C.Box>
      </ContentLayout>
    </>
  );
});
