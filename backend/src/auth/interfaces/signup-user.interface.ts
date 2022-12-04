import { User } from '@prisma/client';

export type SignupUser = Pick<User, 'name' | 'nickname' | 'avatarImageUrl'>;
