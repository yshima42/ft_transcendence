import { memo, FC, useState } from 'react';
import { Button, Flex, Spacer, Tag, Text } from '@chakra-ui/react';
import { useQrcodeUrl } from 'hooks/api/auth/useQrcodeUrl';
import { useTwoFactorAuthState } from 'hooks/api/auth/useTwoFactorAuthState';
import { useQRCode } from 'next-qrcode';
import { useNavigate } from 'react-router-dom';

export const ProfileSetting: FC = memo(() => {
  const { Canvas } = useQRCode();
  const navigate = useNavigate();

  const twoFactorAuthState = useTwoFactorAuthState().twoFactorAuthState;
  const { qrcodeUrl } = useQrcodeUrl();

  const [showFlag, setShowFlag] = useState(false);

  const onClickQrcodeButton = () => {
    const newSetFlag = !showFlag;
    setShowFlag(newSetFlag);
  };

  return (
    <>
      <Flex mt="2">
        <Text fontSize="sm" pr={2}>
          Two-Factor
        </Text>
        {twoFactorAuthState ? <Tag>active</Tag> : <Tag>inactive</Tag>}
      </Flex>
      {twoFactorAuthState ? (
        <Button onClick={onClickQrcodeButton}>QRcode</Button>
      ) : (
        <></>
      )}
      <Spacer />
      {showFlag && qrcodeUrl !== '' ? (
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
