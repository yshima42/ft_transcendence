import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ChatRoomStatus } from '@prisma/client';
import { AxiosError } from 'axios';
import { axios } from 'lib/axios';
import * as ReactHookForm from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';

type State = {
  chatRoomId: string;
  chatName: string;
  roomStatus: ChatRoomStatus;
};

type Inputs = {
  password: string;
};

export const ChatRoomConfirmation: React.FC = React.memo(() => {
  const location = useLocation();
  const { chatRoomId, chatName, roomStatus } = location.state as State;
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = ReactHookForm.useForm<Inputs>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  // axiosを使って、チャットルームに参加する処理を行う。
  // その後、チャットルームのページに遷移する。
  const joinChatRoom: ReactHookForm.SubmitHandler<Inputs> = async (data) => {
    const { password } = data;
    try {
      await axios.post(`/chat/rooms/${chatRoomId}/members`, {
        chatRoomPassword: password,
      });
    } catch (e) {
      const err = e as AxiosError;
      if (err.response?.status !== 201) {
        alert('Authentication failed.');
      }

      return;
    }
    navigate(`/app/chat/rooms/${chatRoomId}`, {
      state: { chatRoomId, chatName, roomStatus },
    });
  };

  const onSubmit: ReactHookForm.SubmitHandler<Inputs> = async (data) => {
    setIsSubmitting(true);
    await joinChatRoom(data);
    setIsSubmitting(false);
  };

  return (
    <ContentLayout title="Chat Room Confirmation">
      {/*
        statusがPUBLICの場合、 チャットルームへの参加確認
        statusがPROTECTEDの場合、 パスワードの要求

        チャットルームへの参加は、axiosを使って行う。
        チャットルームのページに遷移する。
      */}
      <C.Box>
        <C.Heading>Join Chat Room</C.Heading>
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
                    minLength: {
                      value: 8,
                      message: 'password must be at least 8 characters.',
                    },
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
              colorScheme="teal"
              mt={4}
              isDisabled={isSubmitting}
            >
              Join
            </C.Button>
          </C.FormControl>
        </form>
      </C.Box>
    </ContentLayout>
  );
});
