import { User } from '@prisma/client';

export type SignupUser = Omit<
  User,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'nickname'
  | 'twoFactorAuthSecret'
  | 'isTwoFactorAuthEnabled'
  | 'onlineStatus'
>;
