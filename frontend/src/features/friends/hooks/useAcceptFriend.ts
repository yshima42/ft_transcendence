import { User } from '@prisma/client';
import { axios } from 'lib/axios';

export const useAcceptFriend = (): { acceptFriend: (id: string) => void } => {
  async function acceptFriend(id: string): Promise<void> {
    await axios.post<User[]>('/friendships/accept', {
      peerId: id,
    });
  }

  return { acceptFriend };
};
