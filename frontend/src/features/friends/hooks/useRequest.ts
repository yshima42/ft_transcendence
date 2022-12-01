import { User } from '@prisma/client';
import { axios } from 'lib/axios';

export const useRequest = (): { request: (id: string) => void } => {
  async function request(id: string): Promise<void> {
    await axios.post<User[]>('/users/me/friend-requests', {
      receiverId: id,
    });
  }

  return { request };
};
