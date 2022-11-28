import { User } from '@prisma/client';
import { axios } from 'lib/axios';

export const useAccept = (): { accept: (id: string) => void } => {
  async function accept(id: string): Promise<void> {
    await axios.patch<User[]>('/users/me/friend-requests/incoming', {
      creatorId: id,
      status: 'ACCEPTED',
    });
  }

  return { accept };
};
