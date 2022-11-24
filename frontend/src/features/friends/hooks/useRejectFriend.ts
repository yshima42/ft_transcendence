import { User } from '@prisma/client';
import { axios } from 'lib/axios';

export const useRejectFriend = (): { rejectFriend: (id: string) => void } => {
  async function rejectFriend(id: string): Promise<void> {
    try {
      await axios.delete<User[]>('/friendships/reject', {
        data: {
          peerId: id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  return { rejectFriend };
};
