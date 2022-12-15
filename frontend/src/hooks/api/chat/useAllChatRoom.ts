import * as React from 'react';
import { ResponseChatRoom } from 'hooks/api/chat/types';
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
