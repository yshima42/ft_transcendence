import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ChatRoomStatus, ChatRoom } from '@prisma/client';
import { AxiosError } from 'axios';
import { useGetApiOmitUndefined } from 'hooks/api/generics/useGetApi';
import { axios } from 'lib/axios';
import * as ReactHookForm from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as ReactRouter from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';

type Inputs = {
  password: string;
};

const ChatRoomConfirmationFormPage: React.FC = React.memo(() => {
  const { chatRoomId } = ReactRouter.useParams() as { chatRoomId: string };
  const chatRoomInfoEndpoint = `/chat/rooms/${chatRoomId}`;
  const chatRoomMemberEndpoint = `/chat/rooms/${chatRoomId}/members`;
  const chatRoomLink = `/app/chat/rooms/${chatRoomId}`;
  const { data: chatRoom } =
    useGetApiOmitUndefined<ChatRoom>(chatRoomInfoEndpoint);
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = ReactHookForm.useForm<Inputs>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { name: chatName, roomStatus } = chatRoom;

  // axiosを使って、チャットルームに参加する処理を行う。
  // その後、チャットルームのページに遷移する。
  const joinChatRoom: ReactHookForm.SubmitHandler<Inputs> = async (data) => {
    const { password } = data;
    try {
      await axios.post(chatRoomMemberEndpoint, {
        chatRoomPassword: password,
      });
    } catch (e) {
      const err = e as AxiosError;
      if (err.response?.status !== 201) {
        alert('Authentication failed.');
      }

      return;
    }
    navigate(chatRoomLink);
  };

  const onSubmit: ReactHookForm.SubmitHandler<Inputs> = async (data) => {
    setIsSubmitting(true);
    await joinChatRoom(data);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <C.FormControl isInvalid={errors.password != null}>
        <C.FormLabel>Chat Room Name</C.FormLabel>
        <C.Text>{chatName}</C.Text>
        {roomStatus === ChatRoomStatus.PROTECTED && (
          <>
            <C.FormLabel>password</C.FormLabel>
            <C.Input
              placeholder="Password"
              type="password"
              {...register('password', {
                required: 'password is required.',
                maxLength: {
                  value: 128,
                  message: 'password must be at most 128 characters.',
                },
              })}
            />
          </>
        )}
        {errors.password != null && (
          <C.FormErrorMessage>{errors.password.message}</C.FormErrorMessage>
        )}
        <C.Button
          type="submit"
          bg="teal.300"
          color="white"
          mt={4}
          isDisabled={isSubmitting}
        >
          Join
        </C.Button>
      </C.FormControl>
    </form>
  );
});

export const ChatRoomConfirmation: React.FC = React.memo(() => {
  return (
    <ContentLayout title="Chat Room Confirmation">
      {/*
        statusがPUBLICの場合、 チャットルームへの参加確認
        statusがPROTECTEDの場合、 パスワードの要求

        チャットルームへの参加は、axiosを使って行う。
        チャットルームのページに遷移する。
      */}
      <C.Heading>Join Chat Room</C.Heading>
      <C.Divider my={4} />
      <ChatRoomConfirmationFormPage />
    </ContentLayout>
  );
});
