import { User } from '@prisma/client';
import { axios } from 'lib/axios';

export const useCancelFriend = (): { cancelFriend: (id: string) => void } => {
  async function cancelFriend(id: string): Promise<void> {
    await axios.delete<User[]>('/friendships/cancel', {
      data: {
        peerId: id,
      },
    });
  }

  return { cancelFriend };
};
