import { ChangeEvent, FC, memo, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Spinner,
  VStack,
  Text,
  HStack,
  Input,
} from '@chakra-ui/react';
import { useOtpAuthActivate } from 'hooks/api/auth/useOtpAuthActivate';
import { useQRCode } from 'next-qrcode';

type Props = {
  isOpen: boolean;
  onCloseModal: () => void;
  qrcodeUrl: string | null;
};

export const OtpQrcodeModal: FC<Props> = memo((props) => {
  const { isOpen, onCloseModal, qrcodeUrl } = props;
  const { Canvas } = useQRCode();
  const { activateOtpAuth, isLoading } = useOtpAuthActivate();
  const [token, setToken] = useState('');

  const onChangeToken = (e: ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
  };

  const onClickSubmit = async () => {
    await activateOtpAuth({ oneTimePassword: token });
    setToken('');
    onCloseModal();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>OTP QRcode</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack justify="center" align="center">
              <Text fontSize="lg" mb={4}>
                Scan the QR code with Google Authenticator app.
              </Text>
              {qrcodeUrl === null ? (
                <Spinner />
              ) : (
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
              )}
              <HStack>
                <Input
                  m={4}
                  placeholder="Token"
                  value={token}
                  onChange={onChangeToken}
                />
                <Button
                  bg="teal.300"
                  color="white"
                  isLoading={isLoading}
                  isDisabled={isLoading}
                  onClick={onClickSubmit}
                >
                  submit
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
});
