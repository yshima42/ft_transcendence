import { FriendRequest } from '@prisma/client';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { usePatchApi } from '../generics/usePatchApi';

// TODO: eslintエラー
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type FriendRequestApproveReqBody = void;

export interface FriendRequestApproveResBody {
  friendRequest: FriendRequest;
}

export type ApproveFriendRequest = UseMutateAsyncFunction<
  FriendRequestApproveResBody,
  unknown,
  FriendRequestApproveReqBody,
  unknown
>;

export const useFriendRequestApprove = (): {
  approveFriendRequest: ApproveFriendRequest;
  isLoading: boolean;
} => {
  const { patchFunc: approveFriendRequest, isLoading } = usePatchApi<
    FriendRequestApproveReqBody,
    FriendRequestApproveResBody
  >(`/users/me/friend-requests/incoming`);

  return { approveFriendRequest, isLoading };
};
