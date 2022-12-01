import { FriendRequest } from '@prisma/client';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { usePatchApi } from '../generics/usePatchApi';

export type FriendRequestApproveReqBody = Record<string, never>;

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
