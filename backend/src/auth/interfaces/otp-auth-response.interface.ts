import { OneTimePasswordAuth } from '@prisma/client';

export type OneTimePasswordAuthResponse = Omit<OneTimePasswordAuth, 'secret'>;
