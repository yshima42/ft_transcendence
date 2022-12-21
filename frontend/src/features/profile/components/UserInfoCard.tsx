import { memo, FC } from 'react';
import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { useBlockRelation } from 'hooks/api';
import { useFriendRelation } from 'hooks/api/friend/useFriendRelation';
import { DmButton } from 'components/atoms/button/DmButton';
import { GameButton } from 'components/atoms/button/GameButton';
import { UserAvatar } from 'components/organisms/avatar/UserAvatar';
import { BlockRelationButton } from './BlockRelationButton';
import { FriendButton } from './FriendButton';
import { ProfileModal } from './ProfileModal';
// import { ProfileSetting } from './ProfileSetting';

type UserInfoCardProps = {
  user: User;
  isLoginUser: boolean;
};

export const UserInfoCard: FC<UserInfoCardProps> = memo(
  ({ user, isLoginUser }: UserInfoCardProps) => {
    const { isUserBlocked } = useBlockRelation(user.id);
    const { friendRelation } = useFriendRelation(user.id);

    return (
      <Flex
        w="100%"
        h="100%"
        bg="gray.200"
        borderRadius="20px"
        shadow="md"
        p={3}
        pt={5}
        direction="column"
        align="center"
      >
        <UserAvatar
          id={user.id}
          name={user.nickname}
          size="2xl"
          src={user.avatarImageUrl}
        />
        <Text fontSize="md" fontWeight="bold" pt="2">
          {user.nickname}
        </Text>
        <Text fontSize="xs" color="gray">
          {user.name}
        </Text>
        {isLoginUser ? (
          <ProfileModal />
        ) : (
          // <ProfileSetting />
          <>
            <HStack justify="center" align="center">
              <GameButton targetId={user.id} />
              {!isUserBlocked && <DmButton targetId={user.id} />}
            </HStack>
            <Box m={2}>
              <HStack justify="center" align="center">
                <FriendButton
                  targetId={user.id}
                  friendRelation={friendRelation}
                />
                <BlockRelationButton
                  targetId={user.id}
                  isBlockedUser={isUserBlocked}
                />
              </HStack>
            </Box>
          </>
        )}
      </Flex>
    );
  }
);
