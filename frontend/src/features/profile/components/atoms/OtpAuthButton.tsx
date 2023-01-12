import { FC, memo, useState } from 'react';
import { Button } from '@chakra-ui/react';
import { useOtpAuthQrcodeCreate } from 'hooks/api';
import { useOtpAuth } from 'hooks/api/auth/useOtpAuth';
import { useOtpAuthInactivate } from 'hooks/api/auth/useOtpAuthInactivate';
import { OtpQrcodeModal } from '../organisms/OtpQrcodeModal';

export const OtpAuthButton: FC = memo(() => {
  const { isEnabled: isOtpAuthEnabled, qrcodeUrl } = useOtpAuth();
  const { createOtpAuthQrcodeUrl, isLoading: isLoadingCreate } =
    useOtpAuthQrcodeCreate();
  const { inactivateOtpAuth, isLoading: isLoadingInactivate } =
    useOtpAuthInactivate();

  const [showFlag, setShowFlag] = useState(false);

  const onClickInactive = async () => {
    await createOtpAuthQrcodeUrl({});
    setShowFlag(true);
  };

  const onClickActive = async () => {
    await inactivateOtpAuth({});
    setShowFlag(false);
  };

  const onCloseModal = () => {
    setShowFlag(false);
  };

  return (
    <>
      {!isOtpAuthEnabled ? (
        <Button
          size="xs"
          fontSize="xs"
          isDisabled={isLoadingCreate}
          onClick={onClickInactive}
        >
          inactive
        </Button>
      ) : (
        <Button
          size="xs"
          fontSize="xs"
          bg="teal.300"
          isDisabled={isLoadingInactivate}
          onClick={onClickActive}
        >
          active
        </Button>
      )}

      <OtpQrcodeModal
        isOpen={showFlag}
        onCloseModal={onCloseModal}
        qrcodeUrl={qrcodeUrl}
      />
    </>
  );
});
