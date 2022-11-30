import { memo, FC, useState } from 'react';
import { Avatar, Button, Flex, Spacer, Text } from '@chakra-ui/react';
import { useQRCode } from 'next-qrcode';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { useTwoFactorGenerate } from '../hooks/useTwoFactorGenerate';
import { useTwoFactorTurnOn } from '../hooks/useTwoFactorTrunOn';
import { useTwoFactorTurnOff } from '../hooks/useTwoFactorTurnOff';

export const UserInfoCard: FC = memo(() => {
  console.log('UserInfoCard');
  const { user } = useProfile();
  const { turnOn } = useTwoFactorTurnOn();
  const { turnOff } = useTwoFactorTurnOff();
  const { getQrcode, url } = useTwoFactorGenerate();
  const { Canvas } = useQRCode();

  const navigate = useNavigate();

  const [twoFactor, setTwoFactor] = useState<boolean>(
    user.isTwoFactorAuthenticationEnabled 
  );

  const onClickSwitchButton = () => {
    twoFactor ? turnOff() : turnOn();
    setTwoFactor(!twoFactor);
    if (twoFactor) getQrcode();
    console.log(url);
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
        <Text fontSize="sm">Two-Factor</Text>
        {/* <Tag size="sm" variant="outline" colorScheme="green" ml="2">
          ON
        </Tag> */}
        <Button bg="teal.200" onClick={onClickSwitchButton}>
          {twoFactor ? 'off' : 'on'}
        </Button>
      </Flex>
      <Spacer />
      <Button size="xs" onClick={() => navigate('/app/profile/edit')}>
        Edit
      </Button>
      {twoFactor && url !== '' ? (
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
    </Flex>
  );
});
