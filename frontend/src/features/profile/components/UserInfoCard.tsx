import { memo, FC, useState } from 'react';
import { Avatar, Button, Flex, Spacer, Text } from '@chakra-ui/react';
import { useQRCode } from 'next-qrcode';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../../hooks/api/profile/useProfile';
import { useTwoFactor } from '../hooks/useTwoFactor';

export const UserInfoCard: FC = memo(() => {
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
    <Flex
      w="100%"
      h="100%"
      bg="gray.200"
      borderRadius="20px"
      shadow="md"
      p={3}
      pt={5}
      direction="column"
      align="center"
    >
      <Avatar size="2xl" name={user.nickname} src={user.avatarImageUrl} />
      <Text fontSize="md" fontWeight="bold" pt="2">
        {user.nickname}
      </Text>
      <Text fontSize="xs" color="gray">
        {user.name}
      </Text>
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
    </Flex>
  );
});
