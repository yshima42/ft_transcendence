import { User } from '@prisma/client';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { usePostApi } from '../generics/usePostApi';

export interface TwoFactorSwitchReqBody {
  isTwoFactorAuthEnabled: boolean;
}

export interface TwoFactorSwitchResBody {
  user: User;
}

export type SwitchTwoFactor = UseMutateAsyncFunction<
  TwoFactorSwitchResBody,
  unknown,
  TwoFactorSwitchReqBody,
  unknown
>;

export const useTwoFactorSwitch = (): {
  switchTwoFactor: SwitchTwoFactor;
  isLoading: boolean;
} => {
  const { postFunc: switchTwoFactor, isLoading } = usePostApi<
    TwoFactorSwitchReqBody,
    TwoFactorSwitchResBody
  >('/auth/2fa/update');

  return { switchTwoFactor, isLoading };
};
