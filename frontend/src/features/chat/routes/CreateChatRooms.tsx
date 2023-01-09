import * as React from 'react';
import * as C from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  useCreateChatRoom,
  ChatRoomCreateFormValues,
} from 'features/chat/hooks/useCreateChatRoom';
import * as RHF from 'react-hook-form';
import * as yup from 'yup';
import { ContentLayout } from 'components/ecosystems/ContentLayout';

const schema = yup.object().shape(
  {
    // nameスペースはだめ
    name: yup.string().trim().required('name is required').max(50),
    password: yup
      .string()
      .optional()
      .when('password', {
        is: (value: string) => value?.length > 0,
        then: (rule) => rule.min(8).max(128),
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

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onSubmit = async (values: ChatRoomCreateFormValues) => {
    setIsSubmitting(true);
    await CreateChatRoom(values);
    setIsSubmitting(false);
  };

  return (
    <>
      <ContentLayout title="Create Chat Room">
        <C.Box>
          <C.Heading>Create Chat Room</C.Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <C.FormControl isInvalid={!(errors.name == null)}>
              <C.FormLabel>Create Chat Room</C.FormLabel>
              <C.Input
                placeholder="name"
                {...register('name')}
                data-test="input-chat-room-name"
              />
              <C.FormErrorMessage>{errors.name?.message}</C.FormErrorMessage>
            </C.FormControl>
            <C.FormControl isInvalid={!(errors.password == null)}>
              <C.FormLabel>password (optional)</C.FormLabel>
              <C.Input
                placeholder="Password"
                {...register('password')}
                type="password"
                data-test="input-chat-room-password"
              />
              <C.FormErrorMessage>
                {errors.password?.message}
              </C.FormErrorMessage>
            </C.FormControl>
            <C.Button
              type="submit"
              colorScheme="teal"
              mt={4}
              isDisabled={isSubmitting}
              data-test="chat-room-create-button"
            >
              Create
            </C.Button>
          </form>
        </C.Box>
      </ContentLayout>
    </>
  );
});
