import { memo, FC, useState } from 'react';
import { Button, Flex, Spacer, Text } from '@chakra-ui/react';
import { useProfile } from 'hooks/api';

import { useQrCodeUrl } from 'hooks/api/auth/useQrCodeUrl';
import { useTwoFactorSwitch } from 'hooks/api/auth/useTwoFactorSwitch';
import { useQRCode } from 'next-qrcode';
import { useNavigate } from 'react-router-dom';

export const ProfileSetting: FC = memo(() => {
  const { user } = useProfile();
  const { Canvas } = useQRCode();
  const { switchTwoFactor } = useTwoFactorSwitch();
  const { generateQrCodeUrl } = useQrCodeUrl();
  const navigate = useNavigate();

  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState<boolean>(
    user.isTwoFactorAuthEnabled
  );

  const [url, setUrl] = useState('');

  const onClickSwitchButton = async () => {
    const newIsTwoFactorEnabled = !isTwoFactorEnabled;
    if (newIsTwoFactorEnabled) {
      const { url } = await generateQrCodeUrl({});
      setUrl(url);
    }
    isTwoFactorEnabled
      ? await switchTwoFactor({ isTwoFactorAuthEnabled: false })
      : await switchTwoFactor({ isTwoFactorAuthEnabled: true });
    setIsTwoFactorEnabled(newIsTwoFactorEnabled);
  };

  return (
    <>
      <Flex mt="2">
        <Text fontSize="sm" pr={2}>
          Two-Factor
        </Text>
        {isTwoFactorEnabled ? (
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
      </Flex>
      <Spacer />
      {isTwoFactorEnabled && url !== '' ? (
        <Canvas
          text={url}
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
      <Button size="xs" onClick={() => navigate('/app/profile/edit')}>
        Edit
      </Button>
    </>
  );
});
