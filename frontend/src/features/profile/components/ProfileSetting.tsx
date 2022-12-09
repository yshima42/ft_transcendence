import { memo, FC, useState } from 'react';
import { Button, Flex, Spacer, Text } from '@chakra-ui/react';
import { useGetTwoFactorAuthState } from 'hooks/api/auth/useGetTwoFactorAuthState';
import { useTwoFactorAuthCreate } from 'hooks/api/auth/useTwoFactorAuthCreate';
import { useTwoFactorAuthDelete } from 'hooks/api/auth/useTwoFactorAuthDelete';
import { useQRCode } from 'next-qrcode';
import { useNavigate } from 'react-router-dom';

export const ProfileSetting: FC = memo(() => {
  const { createTwoFactorAuth } = useTwoFactorAuthCreate();
  const { deleteTwoFactorAuth } = useTwoFactorAuthDelete();
  const { Canvas } = useQRCode();
  const navigate = useNavigate();

  const [twoFactorAuthState, setTwoFactorAuthState] = useState(
    useGetTwoFactorAuthState().twoFactorAuthState
  );

  const [url, setUrl] = useState('');

  const onClickSwitchButton = async () => {
    const newTwoFactorAuthState = !twoFactorAuthState;
    if (newTwoFactorAuthState) {
      const { url } = await createTwoFactorAuth({});
      setUrl(url);
    } else {
      await deleteTwoFactorAuth({});
      setUrl('');
    }
    setTwoFactorAuthState(newTwoFactorAuthState);
  };

  return (
    <>
      <Flex mt="2">
        <Text fontSize="sm" pr={2}>
          Two-Factor
        </Text>
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
      </Flex>
      <Spacer />
      {twoFactorAuthState && url !== '' ? (
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
