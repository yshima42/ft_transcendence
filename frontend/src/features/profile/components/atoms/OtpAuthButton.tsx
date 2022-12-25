import { FC, memo, useState } from 'react';
import { Button } from '@chakra-ui/react';
import { useOtpAuthCreate } from 'hooks/api';
import { useIsOtpAuthEnabled } from 'hooks/api/auth/useIsOtpAuthEnabled';
import { useOtpAuthDelete } from 'hooks/api/auth/useOtpAuthDelete';
import { OtpQrcodeModal } from '../organisms/OtpQrcodeModal';

export const OtpAuthButton: FC = memo(() => {
  const { isOtpAuthEnabled } = useIsOtpAuthEnabled();
  const { createOtpAuth } = useOtpAuthCreate();
  const { deleteOtpAuth } = useOtpAuthDelete();
  const [showFlag, setShowFlag] = useState(false);

  const onClickInactive = async () => {
    if (isOtpAuthEnabled === null) {
      await createOtpAuth({});
    }
    setShowFlag(true);
  };

  const onClickActive = async () => {
    await deleteOtpAuth();
    setShowFlag(false);
  };

  const onCloseModal = () => {
    setShowFlag(false);
  };

  return (
    <>
      {isOtpAuthEnabled === null || !isOtpAuthEnabled ? (
        <Button size="xs" fontSize="xs" bg="red.200" onClick={onClickInactive}>
          inactive
        </Button>
      ) : (
        <Button size="xs" fontSize="xs" bg="green.200" onClick={onClickActive}>
          active
        </Button>
      )}

      <OtpQrcodeModal isOpen={showFlag} onCloseModal={onCloseModal} />
    </>
  );
});
