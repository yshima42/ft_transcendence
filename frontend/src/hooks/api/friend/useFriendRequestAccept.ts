import { FriendRequest } from '@prisma/client';
import {
  UseMutateAsyncFunction,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useCustomToast } from 'hooks/utils/useCustomToast';
import { usePatchApi } from '../generics/usePatchApi';

export interface FriendRequestAcceptReqBody {
  creatorId: string;
}

export interface FriendRequestAcceptResBody {
  friendRequest: FriendRequest;
}

export type AcceptFriendRequest = UseMutateAsyncFunction<
  FriendRequestAcceptResBody,
  unknown,
  FriendRequestAcceptReqBody,
  unknown
>;

export const useFriendRequestAccept = (
  targetId: string
): Omit<
  UseMutationResult<
    FriendRequestAcceptResBody,
    unknown,
    FriendRequestAcceptReqBody,
    unknown
  >,
  'mutateAsync'
> & {
  acceptFriendRequest: AcceptFriendRequest;
} => {
  const queryClient = useQueryClient();
  const { customToast } = useCustomToast();

  const { mutateAsync: acceptFriendRequest, ...useMutationResult } =
    usePatchApi<FriendRequestAcceptReqBody, FriendRequestAcceptResBody>(
      `/users/me/friend-requests/incoming`,
      {
        onSuccess: () => {
          const queryKeys = [
            ['/users/me/friend-requests/incoming'],
            ['/users/me/friends'],
            [`/users/me/friend-relations/${targetId}`],
          ];
          queryKeys.forEach((queryKey) => {
            void queryClient.invalidateQueries({ queryKey });
          });
        },
        onError: (error) => {
          if (isAxiosError<{ message: string }>(error)) {
            customToast({ description: error.response?.data.message });
          }
        },
      }
    );

  return { acceptFriendRequest, ...useMutationResult };
};
