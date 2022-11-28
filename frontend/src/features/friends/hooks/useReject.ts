import { User } from '@prisma/client';
import { axios } from 'lib/axios';

export const useReject = (): { reject: (id: string) => void } => {
  async function reject(id: string): Promise<void> {
    await axios.patch<User[]>('/users/me/friend-requests/incoming', {
      creatorId: id,
      status: 'DECLINED',
    });
  }

  return { reject };
};
