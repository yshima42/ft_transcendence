import { User } from '@prisma/client';
import { axios } from 'lib/axios';

export const useUnblock = (): { unblock: (id: string) => void } => {
  async function unblock(id: string): Promise<void> {
    await axios.delete<User[]>(`/users/me/blocks/${id}`, {});
  }

  return { unblock };
};
