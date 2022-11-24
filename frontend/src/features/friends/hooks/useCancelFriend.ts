import { User } from '@prisma/client';
import { axios } from 'lib/axios';

export const useCancelFriend = (): { cancelFriend: (id: string) => void } => {
  async function cancelFriend(id: string): Promise<void> {
    try {
      await axios.delete<User[]>('/friendships/cancel', {
        data: {
          peerId: id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  return { cancelFriend };
};
