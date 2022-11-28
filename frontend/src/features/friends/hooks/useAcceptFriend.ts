import { User } from '@prisma/client';
import { axios } from 'lib/axios';

export const useAcceptFriend = (): { acceptFriend: (id: string) => void } => {
  async function acceptFriend(id: string): Promise<void> {
    await axios.patch<User[]>('/users/me/friend-requests/incoming', {
      creatorId: id,
      status: 'ACCEPTED',
    });
  }

  return { acceptFriend };
};
