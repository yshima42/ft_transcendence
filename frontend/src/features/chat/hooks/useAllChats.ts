import { useCallback, useState } from 'react';
import { axios } from 'lib/axios';
import { useNavigate } from 'react-router-dom';

import { Chat } from '../types/chat';

const mockChats: Chat[] = [
  {
    createdAt: '11-14',
    id: '1',
    members: 'dummy1,dummy2,dummy3',
    updatedAt: '11-14',
  },
  {
    createdAt: '11-14',
    id: '2',
    members: 'dummy1,dummy2,dummy3',
    updatedAt: '11-14',
  },
  {
    createdAt: '11-14',
    id: '3',
    members: 'dummy1,dummy2,dummy3',
    updatedAt: '11-14',
  },
  {
    createdAt: '11-14',
    id: '4',
    members: 'dummy1,dummy2,dummy3',
    updatedAt: '11-14',
  },
  {
    createdAt: '11-14',
    id: '5',
    members: 'dummy1,dummy2,dummy3',
    updatedAt: '11-14',
  },
  {
    createdAt: '11-14',
    id: '6',
    members: 'dummy1,dummy2,dummy3',
    updatedAt: '11-14',
  },
];

export const useAllChats = (): {
  getChats: () => void;
  chats: Chat[];
} => {
  const [chats, setChats] = useState<Chat[]>([]);
  const navigate = useNavigate();

  const getChats = useCallback(() => {
    // ここをChatsゲットしてきてmockChatsを入れ替える
    axios
      .get<Chat[]>('/users/all')
      .then(() => setChats(mockChats))
      .catch(() => navigate('/', { replace: true }));
  }, [navigate]);

  return { getChats, chats };
};
