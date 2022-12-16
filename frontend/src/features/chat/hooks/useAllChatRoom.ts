import * as React from 'react';
import { ResponseChatRoom } from 'features/chat/hooks/types';
import { axios } from 'lib/axios';

export const useAllChatRoom = (): {
  chatRooms: ResponseChatRoom[];
} => {
  const [chatRooms, setChatRooms] = React.useState<ResponseChatRoom[]>([]);

  React.useEffect(() => {
    axios
      .get('/chat/rooms')
      .then((response) => {
        setChatRooms(response.data as ResponseChatRoom[]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return { chatRooms };
};
