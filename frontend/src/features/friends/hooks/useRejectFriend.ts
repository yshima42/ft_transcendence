import { User } from '@prisma/client';
import { axios } from 'lib/axios';

export const useRejectFriend = (): { rejectFriend: (id: string) => void } => {
  async function rejectFriend(id: string): Promise<void> {
    await axios.patch<User[]>('/users/me/friend-requests/incoming', {
      creatorId: id,
      status: 'DECLINED',
    });
  }

  return { rejectFriend };
};
