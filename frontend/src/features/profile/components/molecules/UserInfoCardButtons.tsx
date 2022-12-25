import { memo, FC } from 'react';
import { Box, HStack, Tag, TagLabel } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { useBlockRelation } from 'hooks/api';
import { useFriendRelation } from 'hooks/api/friend/useFriendRelation';
import { DmButton } from 'components/atoms/button/DmButton';
import { GameButton } from 'components/atoms/button/GameButton';
import { OtpAuthButton } from '../atoms/OtpAuthButton';
import { ProfileEditButton } from '../atoms/ProfileEditButton';
import { BlockRelationButton } from './BlockRelationButton';
import { FriendButton } from './FriendButton';

type Props = {
  user: User;
  isLoginUser: boolean;
};

export const UserInfoCardButtons: FC<Props> = memo((props) => {
  const { user, isLoginUser } = props;
  const { isUserBlocked } = useBlockRelation(user.id);
  const { friendRelation } = useFriendRelation(user.id);

  return (
    <>
      {isLoginUser ? (
        <>
          <ProfileEditButton />
          <HStack>
            <Tag size="md" fontSize="md" variant="outline" colorScheme="blue">
              <TagLabel>2FactorAuth</TagLabel>
            </Tag>
            <OtpAuthButton />
          </HStack>
        </>
      ) : (
        <>
          {!isUserBlocked && (
            <HStack>
              <GameButton targetId={user.id} />
              <DmButton targetId={user.id} />
            </HStack>
          )}
          <Box m={2}>
            <HStack>
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
    </>
  );
});
