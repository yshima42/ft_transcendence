import { FC, memo, useState } from 'react';
import { Button, FormLabel } from '@chakra-ui/react';
import { useIsOtpAuthEnabled } from 'hooks/api/auth/useIsOtpAuthEnabled';
import { useOtpAuthCreate } from 'hooks/api/auth/useOtpAuthCreate';
import { useOtpAuthDelete } from 'hooks/api/auth/useOtpAuthDelete';
import { useOtpQrcodeUrl } from 'hooks/api/auth/useOtpQrcodeUrl';
import { useQRCode } from 'next-qrcode';

export const OtpAuthSetting: FC = memo(() => {
  const { createOtpAuth } = useOtpAuthCreate();
  const { deleteOtpAuth } = useOtpAuthDelete();
  const { Canvas } = useQRCode();
  const { qrcodeUrl } = useOtpQrcodeUrl();
  console.log(qrcodeUrl);

  const [isOtpAuthEnabled, setIsOtpAuthEnabled] = useState(
    useIsOtpAuthEnabled().isOtpAuthEnabled
  );
  console.log(isOtpAuthEnabled);

  const onClickSwitchButton = async () => {
    const newIsOTPAuthEnabled = !isOtpAuthEnabled;
    if (newIsOTPAuthEnabled) {
      await createOtpAuth({});
    } else {
      await deleteOtpAuth();
    }
    setIsOtpAuthEnabled(newIsOTPAuthEnabled);
  };

  return (
    <>
      <FormLabel>Two Factor</FormLabel>

      {isOtpAuthEnabled ? (
        <Button
          size="xs"
          bg="teal.200"
          _hover={{ opacity: 0.8 }}
          onClick={onClickSwitchButton}
        >
          active
        </Button>
      ) : (
        <Button size="xs" bg="red.200" onClick={onClickSwitchButton}>
          inactive
        </Button>
      )}
      {isOtpAuthEnabled && qrcodeUrl !== '' ? (
        <Canvas
          text={qrcodeUrl}
          options={{
            level: 'M',
            margin: 3,
            scale: 4,
            width: 200,
            color: {
              dark: '#010599FF',
              light: '#FFBF60FF',
            },
          }}
        />
      ) : (
        <></>
      )}
    </>
  );
});
