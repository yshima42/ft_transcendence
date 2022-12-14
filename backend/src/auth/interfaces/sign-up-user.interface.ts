import { User } from '@prisma/client';

export type SignUpUser = Pick<User, 'name' | 'nickname' | 'avatarImageUrl'>;
