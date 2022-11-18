import { User } from '@prisma/client';

export type SignupUser = Omit<
  User,
  'id' | 'createdAt' | 'updatedAt' | 'nickname' | 'onlineStatus'
>;
