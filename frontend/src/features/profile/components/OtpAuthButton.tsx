import { FC, memo, useState } from 'react';
import { Box, Button, HStack, Text } from '@chakra-ui/react';
import { useOtpAuthCreate } from 'hooks/api';
import { useIsOtpAuthEnabled } from 'hooks/api/auth/useIsOtpAuthEnabled';
import { useOtpAuthDelete } from 'hooks/api/auth/useOtpAuthDelete';
import { ModalOtpQrcode } from './ModalOtpQrcode';

export const OtpAuthButton: FC = memo(() => {
  const { isOtpAuthEnabled } = useIsOtpAuthEnabled();
  const { createOtpAuth } = useOtpAuthCreate();
  const { deleteOtpAuth } = useOtpAuthDelete();
  const [showFlag, setShowFlag] = useState(false);

  const onClickInactivate = async () => {
    await deleteOtpAuth();
    setShowFlag(false);
  };

  const onClickActivate = async () => {
    await createOtpAuth({});
    setShowFlag(true);
  };

  const onCloseModal = () => {
    setShowFlag(false);
  };

  return (
    <Box m={1}>
      <HStack justify="center" align="center">
        <Text>OTP Auth</Text>
        {isOtpAuthEnabled ? (
          <Button
            size="xs"
            fontSize="xs"
            bg="green.200"
            onClick={onClickInactivate}
          >
            active
          </Button>
        ) : (
          <Button
            size="xs"
            fontSize="xs"
            bg="red.200"
            onClick={onClickActivate}
          >
            inactive
          </Button>
        )}
      </HStack>
      <ModalOtpQrcode isOpen={showFlag} onCloseModal={onCloseModal} />
    </Box>
  );
});
