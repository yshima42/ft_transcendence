import { ChangeEvent, FC, memo, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Spinner,
  VStack,
  Text,
  HStack,
  Input,
} from '@chakra-ui/react';
import { useOtpQrcodeUrl } from 'hooks/api';
import { useOtpAuthActivate } from 'hooks/api/auth/useOtpAuthActivate';
import { useQRCode } from 'next-qrcode';

type Props = {
  isOpen: boolean;
  onCloseModal: () => void;
};

export const OtpQrcodeModal: FC<Props> = memo((props) => {
  const { isOpen, onCloseModal } = props;
  const { Canvas } = useQRCode();
  const { qrcodeUrl } = useOtpQrcodeUrl();
  const { activateOtpAuth } = useOtpAuthActivate();

  const [token, setToken] = useState('');

  const onChangeToken = (e: ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
  };

  const onClickSubmit = async () => {
    await activateOtpAuth({ oneTimePassword: token });
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
              {qrcodeUrl === '' ? (
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
                <Button bg="teal.300" color="white" onClick={onClickSubmit}>
                  submit
                </Button>
              </HStack>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onCloseModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
});
