import * as React from 'react';
import * as C from '@chakra-ui/react';
import {
  useCreateChatRoom,
  ChatRoomCreateFormValues,
} from 'features/chat/hooks/useCreateChatRoom';
import * as RHF from 'react-hook-form';
import { ContentLayout } from 'components/ecosystems/ContentLayout';

const CreateChatRoomForm: React.FC = React.memo(() => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = RHF.useForm<ChatRoomCreateFormValues>();
  const { CreateChatRoom, isLoading } = useCreateChatRoom();

  const onSubmit = (values: ChatRoomCreateFormValues) => {
    CreateChatRoom(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <C.FormControl isInvalid={!(errors.name == null)}>
        <C.FormLabel>name</C.FormLabel>
        <C.Input
          placeholder="name"
          {...register('name', {
            required: 'name is required',
            maxLength: {
              value: 50,
              message: 'name is too long (max 50 characters)',
            },
          })}
        />
        <C.FormErrorMessage>{errors.name?.message}</C.FormErrorMessage>
      </C.FormControl>
      <C.FormControl isInvalid={!(errors.password == null)}>
        <C.FormLabel>password (optional)</C.FormLabel>
        <C.Input
          placeholder="Password"
          {...register('password', {
            maxLength: {
              value: 128,
              message: 'password is too long (max 128 characters)',
            },
          })}
          type="password"
        />
        <C.FormErrorMessage>{errors.password?.message}</C.FormErrorMessage>
      </C.FormControl>
      <C.Button type="submit" colorScheme="teal" mt={4} isDisabled={isLoading}>
        Create
      </C.Button>
    </form>
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
