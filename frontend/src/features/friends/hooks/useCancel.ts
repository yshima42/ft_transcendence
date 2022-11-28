import { User } from '@prisma/client';
import { axios } from 'lib/axios';

export const useCancel = (): { cancel: (id: string) => void } => {
  async function cancel(id: string): Promise<void> {
    await axios.delete<User[]>(`/users/me/friend-requests/${id}`, {});
  }

  return { cancel };
};
