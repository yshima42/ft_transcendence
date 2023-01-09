import { FC, memo } from 'react';
import { Button, useDisclosure } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { ProfileEditModal } from '../organisms/ProfileEditModal';

type Props = {
  user: User;
};

export const ProfileEditButton: FC<Props> = memo((props) => {
  const { user } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        size="xs"
        fontSize="xs"
        onClick={onOpen}
        m={2}
        data-test={'profile-edit'}
      >
        Edit
      </Button>
      <ProfileEditModal user={user} isOpen={isOpen} onClose={onClose} />
    </>
  );
});
