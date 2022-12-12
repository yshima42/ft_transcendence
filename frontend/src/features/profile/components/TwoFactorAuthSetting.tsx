import { FC, memo, useState } from 'react';
import { Button, FormLabel } from '@chakra-ui/react';
import { useQrcodeUrl } from 'hooks/api/auth/useQrcodeUrl';
import { useTwoFactorAuthCreate } from 'hooks/api/auth/useTwoFactorAuthCreate';
import { useTwoFactorAuthDelete } from 'hooks/api/auth/useTwoFactorAuthDelete';
import { useTwoFactorAuthState } from 'hooks/api/auth/useTwoFactorAuthState';
import { useQRCode } from 'next-qrcode';

export const TwoFactorAuthSetting: FC = memo(() => {
  const { createTwoFactorAuth } = useTwoFactorAuthCreate();
  const { deleteTwoFactorAuth } = useTwoFactorAuthDelete();
  const { Canvas } = useQRCode();
  const { qrcodeUrl } = useQrcodeUrl();
  console.log(qrcodeUrl);

  const [twoFactorAuthState, setTwoFactorAuthState] = useState(
    useTwoFactorAuthState().twoFactorAuthState
  );
  console.log(twoFactorAuthState);

  const onClickSwitchButton = async () => {
    const newTwoFactorAuthState = !twoFactorAuthState;
    if (newTwoFactorAuthState) {
      await createTwoFactorAuth({});
    } else {
      await deleteTwoFactorAuth();
    }
    setTwoFactorAuthState(newTwoFactorAuthState);
  };

  return (
    <>
      <FormLabel>Two Factor</FormLabel>

      {twoFactorAuthState ? (
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
      {twoFactorAuthState && qrcodeUrl !== '' ? (
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
