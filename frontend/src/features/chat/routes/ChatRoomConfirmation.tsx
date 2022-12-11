import * as React from 'react';
import * as C from '@chakra-ui/react';
import { axios } from 'lib/axios';
import { Link, useLocation } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';

type State = {
  chatRoomId: string;
  name: string;
};

export const ChatRoomConfirmation: React.FC = React.memo(() => {
  const location = useLocation();
  const { chatRoomId, name } = location.state as State;
  // axiosを使って、チャットルームに参加する処理を行う。
  // その後、チャットルームのページに遷移する。
  async function joinChatRoom() {
    const res = await axios.post(`/chat/${chatRoomId}/user`);

    console.log('joinChatRoom: ' + JSON.stringify(res));
  }

  return (
    <ContentLayout title="Chat Room Confirmation">
      <C.Text>チャットルーム「{name}」に参加しますか？</C.Text>
      <C.Flex justifyContent="flex-end" mt={4}>
        <C.Link as={Link} to={`/app/chat/${chatRoomId}`} state={{ chatRoomId }}>
          <C.Button colorScheme="blue" mr={2} onClick={joinChatRoom}>
            参加する
          </C.Button>
        </C.Link>
      </C.Flex>
    </ContentLayout>
  );
});
