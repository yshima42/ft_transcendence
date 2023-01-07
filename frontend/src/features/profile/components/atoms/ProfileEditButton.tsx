import { FC, memo } from 'react';
import { Button, useDisclosure } from '@chakra-ui/react';
import { ProfileEditModal } from '../organisms/ProfileEditModal';

export const ProfileEditButton: FC = memo(() => {
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
      <ProfileEditModal isOpen={isOpen} onClose={onClose} />
    </>
  );
});
