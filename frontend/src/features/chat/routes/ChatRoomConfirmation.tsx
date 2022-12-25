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
  // axiosを使って、チャットルームに参加する処理を行う。
  // その後、チャットルームのページに遷移する。

  const joinChatRoom: ReactHookForm.SubmitHandler<Inputs> = async (data) => {
    const { password } = data;
    try {
      await axios.post(
        `/chat/rooms/${chatRoomId}/members`,
        roomStatus === ChatRoomStatus.PROTECTED
          ? {
              createChatRoomMemberDto: {
                chatRoomPassword: password,
              },
            }
          : undefined
      );
    } catch (e) {
      const err = e as AxiosError;
      if (err.response?.status !== 201) {
        alert('認証に失敗しました。');
      }

      return;
    }
    navigate(`/app/chat/rooms/${chatRoomId}`, {
      state: { chatRoomId, name, roomStatus },
    });
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
        <C.Heading>チャットルームに参加</C.Heading>
        <form onSubmit={handleSubmit(joinChatRoom)}>
          <C.FormControl isInvalid={errors.password != null}>
            <C.FormLabel>チャットルーム名</C.FormLabel>
            <C.Text>{chatName}</C.Text>
            {roomStatus === ChatRoomStatus.PROTECTED && (
              <>
                <C.FormLabel>パスワード</C.FormLabel>
                <C.Input
                  placeholder="パスワード"
                  type="password"
                  {...register('password', {
                    required: 'パスワードを入力してください。',
                    minLength: {
                      value: 8,
                      message: 'パスワードは8文字以上で入力してください。',
                    },
                    maxLength: {
                      value: 128,
                      message: 'パスワードは128文字以下で入力してください。',
                    },
                  })}
                />
              </>
            )}
            {errors.password != null && (
              <C.FormErrorMessage>{errors.password.message}</C.FormErrorMessage>
            )}
            <C.Button type="submit" colorScheme="teal" mt={4}>
              チャットルームに参加
            </C.Button>
          </C.FormControl>
        </form>
      </C.Box>
    </ContentLayout>
  );
});
