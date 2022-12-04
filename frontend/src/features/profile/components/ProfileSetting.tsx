import { memo, FC, useState } from 'react';
import { Button, Flex, Spacer, Text } from '@chakra-ui/react';
import { useProfile } from 'hooks/api';

import { useQRCode } from 'next-qrcode';
import { useNavigate } from 'react-router-dom';
import { useTwoFactor } from '../hooks/useTwoFactor';

export const ProfileSetting: FC = memo(() => {
  const { user } = useProfile();
  const { Canvas } = useQRCode();
  const { turnOn, turnOff, getQrcodeUrl, qrcodeUrl } = useTwoFactor();
  const navigate = useNavigate();

  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState<boolean>(
    user.isTwoFactorAuthEnabled
  );

  const onClickSwitchButton = () => {
    isTwoFactorEnabled ? turnOff() : turnOn();
    setIsTwoFactorEnabled(!isTwoFactorEnabled);
    if (!isTwoFactorEnabled) getQrcodeUrl();
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
      {isTwoFactorEnabled && qrcodeUrl !== '' ? (
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
      <Button size="xs" onClick={() => navigate('/app/profile/edit')}>
        Edit
      </Button>
    </>
  );
});
