import { User } from '@prisma/client';
import { axios } from 'lib/axios';

export const useRequestFriend = (): { requestFriend: (id: string) => void } => {
  async function requestFriend(id: string): Promise<void> {
    await axios.post<User[]>('/friendships/request', {
      peerId: id,
    });
  }

  return { requestFriend };
};
